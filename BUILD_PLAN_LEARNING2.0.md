# Adamsmyth 2.0 — Duolingo for Investing

> **The pivot:** Chat is dead. Users don't know what to ask, the AI talks too much, and nobody feels like they're making progress. We're ripping out the chat entirely and replacing it with a structured learning app.
>
> **The model:** Duolingo, but for investing. Each stock you own is a "course." Each course has 5 levels. Each level has bite-sized lessons made of teach cards + multiple-choice quizzes. 3–5 minutes per session. You learn by doing, not by reading walls of text.
>
> **What gets deleted:** The entire chat interface. ChatContainer, message-bubble, chat-input, suggested-prompts, follow-up-chips, smart-recommendation, portfolio-pulse — all of it. The Chat tab disappears from the bottom nav.
>
> **What stays:** Financial data fetchers (get_news, get_financials, get_stock_profile, get_competitors), learning dimensions, progress tracking, streaks, the learning-checkpoint component (repurposed), onboarding, settings.
>
> **What's new:** Learn home screen, stock learning path, lesson player, lesson generation API.

---

## Architecture

```
APP (2 tabs: Learn + Progress)

LEARN TAB (home screen, default landing)
├── Streak Badge
├── Asset Class Selector (stocks active, others greyed "Soon")
├── Your Stocks Grid (2-col, one card per holding)
│   └── Each card: ticker, company name, level, progress ring
│
└── Tap a stock → STOCK LEARNING PATH
    ├── 5 Levels displayed as a vertical path
    │   ├── Level 1: "I know what I own"
    │   ├── Level 2: "I can read the scoreboard"
    │   ├── Level 3: "I can follow the conversation"
    │   ├── Level 4: "I can think for myself"
    │   └── Level 5: "I'm plugged in"
    │
    └── Tap a level → LESSON PLAYER
        ├── Progress bar at top
        ├── Card-by-card experience (swipe/tap through)
        │   ├── Teach cards (short explanation + highlight callout)
        │   └── Quiz cards (multiple-choice, instant feedback)
        └── Lesson complete screen (score, streak update)

PROGRESS TAB
├── Streak Badge
├── Literacy Score (existing)
└── Per-stock progress breakdown (existing)
```

---

## Pre-Work

### Step 0: Delete the chat interface

Rip out the chat. This is the cleanest way to avoid half-states where old chat code interferes with the new learning flow.

**Prompt:**
```
I'm removing the chat interface entirely from this app. The app will become a learning-only app with 2 tabs: Learn and Progress.

Do these changes:

1. /src/components/bottom-nav.tsx — Remove the Chat tab:
   - Remove the { href: "/chat", label: "Chat", icon: MessageSquare } entry from the tabs array
   - Remove the MessageSquare import
   - Only 2 tabs should remain. We'll add the Learn tab in a later step — for now just keep Progress.
   - Actually wait — rename the existing two to prepare: change the tabs array to just:
     [{ href: "/learn", label: "Learn", icon: BookOpen }, { href: "/progress", label: "Progress", icon: BarChart3 }]
   - Import BookOpen from lucide-react, remove MessageSquare

2. /src/components/tab-views.tsx — Remove ChatContainer:
   - Remove the ChatContainer import
   - Remove the isChat condition and its div
   - Change isProgress check to remain
   - Add: const isLearn = pathname.startsWith("/learn")
   - Add a div for isLearn (same pattern as isProgress div) — for now render a placeholder <div>Learn coming soon</div>
   - Update isTabRoute = isLearn || isProgress

3. Create /src/app/(app)/learn/page.tsx:
   - Simple page component that returns null (content comes from TabViews)

4. Do NOT delete any chat component FILES yet — just disconnect them from the UI. We'll clean up files later after everything works.

5. If there are any redirects to /chat in the codebase (like after onboarding), change them to /learn. Check:
   - /src/components/onboarding/portfolio-upload.tsx
   - /src/app/(app)/onboarding/page.tsx  
   - Any other file that has router.push("/chat") or redirect("/chat")
```

**Verify:** App loads. Bottom nav shows Learn + Progress (no Chat). Learn tab shows placeholder. Progress tab still works. Onboarding redirects to /learn.
**Commit:** `git add . && git commit -m "feat: remove chat tab, add learn tab placeholder"`

---

## Phase 1: The Learning Home Screen

### Step 1: Build the Learn Home screen

This is the new front door. Users see their stocks as learning courses.

**Prompt:**
```
Replace the placeholder in /src/components/tab-views.tsx with a real LearnHome component.

Create /src/components/learn/learn-home.tsx:

"use client" component.

LAYOUT (top to bottom, inside a scrollable container with px-4 pt-4 pb-6):

1. STREAK BADGE:
   - Import and render StreakBadge from /src/components/progress/StreakBadge.tsx
   - It already handles its own data fetching and rendering

2. HEADER:
   - "Learn" (text-2xl font-bold text-stone-800)
   - "Pick a stock to start a lesson" (text-sm text-stone-500 mt-0.5)

3. ASSET CLASS PILLS (horizontal scrollable row, mt-4):
   - A flex row of pill-shaped buttons: gap-2 overflow-x-auto pb-2
   - Hide scrollbar: add className style for scrollbar-none (use [&::-webkit-scrollbar]:hidden and scrollbar-width:none via inline style)
   - Pills: "Stocks", "ETFs", "Bonds", "Crypto", "Real Estate", "Commodities"
   - "Stocks" is ACTIVE: bg-amber-700 text-white rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap
   - ALL other pills are DISABLED: bg-stone-100 text-stone-300 rounded-full px-4 py-1.5 text-sm whitespace-nowrap cursor-not-allowed relative
   - Each disabled pill has a "Soon" micro-badge: absolute -top-1.5 -right-1 text-[8px] bg-stone-200 text-stone-400 rounded-full px-1.5 py-0.5 font-medium
   - Disabled pills do nothing on tap

4. YOUR STOCKS GRID (mt-5):
   - Fetch holdings from GET /api/portfolio on mount
   - Fetch progress from GET /api/progress on mount
   - While loading: show a 2-col grid of 2 skeleton cards (animate-pulse, rounded-xl bg-white h-44 ring-1 ring-stone-200/60)
   - Display as a 2-column grid: grid grid-cols-2 gap-3
   
   Each stock card:
   - Container: rounded-xl bg-white ring-1 ring-stone-200/60 p-4 flex flex-col items-center text-center
   - Ticker: text-lg font-bold text-stone-800
   - Company name: text-xs text-stone-400 truncate max-w-full mt-0.5
   - Progress ring: mt-3, reuse ProgressRing from /src/components/progress/ProgressRing.tsx (size={56} strokeWidth={4} percentage={calculated})
   - Level label: mt-2 text-xs font-semibold text-amber-700 — e.g. "Level 1"
   - Level name: text-[10px] text-stone-400 — e.g. "I know what I own"
   - The whole card is wrapped in a Link to /learn/{ticker}
   
   Level calculation from overall progress percentage:
   - 0–19% → Level 1 "I know what I own"
   - 20–39% → Level 2 "I can read the scoreboard"
   - 40–59% → Level 3 "I can follow the conversation"  
   - 60–79% → Level 4 "I can think for myself"
   - 80–100% → Level 5 "I'm plugged in"

5. EMPTY STATE (if holdings array is empty after loading):
   - Centered: mt-12
   - BookOpen icon (size-12 text-amber-200)
   - "Add your first stock to start learning" (text-sm text-stone-500 mt-3)
   - Link button to /settings: "Add Stocks" — rounded-lg bg-amber-700 text-white px-5 py-2.5 text-sm font-medium mt-4

6. BOTTOM LINK (below grid, always visible if holdings exist):
   - "Manage portfolio →" link to /settings
   - text-xs text-stone-400 hover:text-amber-600 text-center mt-4 block

Now update /src/components/tab-views.tsx:
- Import LearnHome from "@/components/learn/learn-home"
- Replace the placeholder div with <LearnHome />

Keep learn-home.tsx under 150 lines. Tailwind only.
```

**Verify:** Open app → Learn tab. See streak badge, "Stocks" pill active, other pills greyed with "Soon" badges. Stock cards show with progress rings and levels. Tapping a card navigates to /learn/AAPL (will 404 for now).
**Commit:** `git add . && git commit -m "feat: learn home screen with asset class selector and stock grid"`

---

### Step 2: Build the Stock Learning Path (the level map)

When a user taps a stock card, they see a vertical path of 5 levels — like a game progression map.

**Prompt:**
```
Two files:

1. Create /src/app/(app)/learn/[ticker]/page.tsx:
   - This is a standard Next.js dynamic route page
   - It receives params.ticker
   - It renders StockLearningPath with ticker prop
   - This page is NOT inside TabViews — it's its own full page (the app layout with TopBar still wraps it)
   - Make sure it's a client component since it needs interactivity

2. Create /src/components/learn/stock-learning-path.tsx:

Props: { ticker: string }

On mount:
- Fetch progress from GET /api/progress
- Find this ticker's data from the response
- Calculate current level (same formula as Step 1)
- Calculate sub-progress within current level (e.g., if overall is 25% and Level 2 range is 20-40%, sub-progress is (25-20)/(40-20) = 25%)

LAYOUT:

TOP SECTION (sticky top, bg-stone-50, border-b border-stone-200/60, px-4 py-3):
- Left: back button (ChevronLeft icon, size-5) wrapped in Link to /learn
- Center: ticker symbol (text-lg font-bold text-stone-800)
- Right: overall percentage (text-sm font-semibold text-amber-700) — e.g. "12%"
- Use flex items-center justify-between

LEVEL PATH (centered vertically on the page, py-8):
- 5 level nodes stacked vertically, centered
- Each node is spaced 80px apart (mb-20 on each except last)
- Between nodes: a vertical dotted line (border-l-2 border-dashed, positioned with absolute, stretching between node centers)
- Nodes are centered horizontally

Each node structure:
- A circular button (w-20 h-20 rounded-full flex items-center justify-center)
- Level number below the circle (text-xs mt-2)
- Level name below that (text-sm font-medium mt-1)
- Level description below that (text-xs text-stone-400 mt-0.5 max-w-[200px] text-center)

Node visual states:

a) COMPLETED (user's progress is past this level's range):
   - Circle: bg-emerald-500 text-white, ring-4 ring-emerald-100
   - Inside: Check icon (size-8, white)
   - Level name: text-emerald-700 font-semibold
   - Tappable → navigates to /learn/{ticker}/level/{levelNumber}

b) CURRENT (user is working on this level):
   - Circle: bg-amber-500 text-white, ring-4 ring-amber-100
   - Ring has a subtle pulse: add a div behind with animate-ping bg-amber-300 rounded-full w-20 h-20 absolute opacity-30
   - Inside: Play icon (size-8, white)
   - Level name: text-amber-800 font-semibold
   - Show sub-progress text: e.g. "3/5 topics" (text-xs text-amber-600)
   - Tappable → navigates to /learn/{ticker}/level/{levelNumber}

c) LOCKED (levels above current):
   - Circle: bg-stone-200 text-stone-400
   - Inside: Lock icon (size-6, stone-400)
   - Level name: text-stone-300
   - NOT tappable (cursor-not-allowed, no Link wrapper)
   - On tap: add a brief CSS shake animation (optional, nice-to-have)

Level data (hardcode this array):
[
  { number: 1, name: "I know what I own", description: "Explain this company in 30 seconds", range: [0, 20] },
  { number: 2, name: "I can read the scoreboard", description: "Revenue, margins, P/E actually mean something", range: [20, 40] },
  { number: 3, name: "I can follow the conversation", description: "Financial headlines make sense now", range: [40, 60] },
  { number: 4, name: "I can think for myself", description: "Form your own view on a stock", range: [60, 80] },
  { number: 5, name: "I'm plugged in", description: "You have a framework for any stock", range: [80, 100] }
]

Loading state: show 5 grey circles vertically with skeleton animation

Keep under 160 lines. Tailwind only.
```

**Verify:** Tap a stock on Learn home → see 5 levels vertically. Level 1 pulses as current. Levels 2-5 are locked. Tapping Level 1 navigates to /learn/AAPL/level/1 (will 404 until Step 4).
**Commit:** `git add . && git commit -m "feat: stock learning path with 5-level progression map"`

---

## Phase 2: The Lesson Engine

### Step 3: Create the lesson generation API

The AI generates structured teach/quiz content using real stock data. No chat — just structured JSON output.

**Prompt:**
```
Create /src/app/api/lessons/route.ts

This route generates a structured lesson for a given stock + level.

1. Authenticate the user (same pattern as /api/chat/route.ts — use createClient from @/lib/supabase/server)
2. Read query params: ticker and level from the URL searchParams
3. Validate: level must be 1-5 (return 400 if not)
4. Verify the ticker is in the user's holdings (fetch from supabase, same as chat route)

5. Fetch context data based on level:
   - Level 1: getStockProfile(ticker)
   - Level 2: getStockProfile(ticker) + getFinancials(ticker)
   - Level 3: getNews(ticker, 5) + getStockProfile(ticker)
   - Level 4: getStockProfile(ticker) + getFinancials(ticker) + getCompetitors(ticker)
   - Level 5: all four data fetchers
   
   Import all from /src/lib/financial-data.ts

6. Fetch existing progress: query learning_progress table for this user + ticker to know what sub-topics are already completed

7. Call Anthropic API directly (NOT streaming — we need the full JSON):
   
   import Anthropic from "@anthropic-ai/sdk"
   const client = new Anthropic()
   
   const response = await client.messages.create({
     model: "claude-sonnet-4-20250514",
     max_tokens: 2000,
     messages: [{ role: "user", content: userMessage }],
     system: systemPrompt
   })

   SYSTEM PROMPT:
   "You are generating a structured lesson for a beginner investor learning about a specific stock. The lesson should feel like Duolingo — short, fun, and interactive. Every explanation must use the ACTUAL company data provided.

   LEVEL: {level_number} — {level_name}
   LEVEL GOAL: {level_description}
   
   Generate a lesson as JSON with this EXACT structure:
   {
     "lesson_title": "Short catchy title (under 8 words)",
     "lesson_intro": "1-2 casual sentences setting up what they'll learn. Reference the company by name.",
     "cards": [
       {
         "type": "teach",
         "content": "2-3 sentences explaining ONE concept using this company as the example. No jargon without parenthetical explanation. Sound like a smart friend texting, not a textbook.",
         "highlight": "The single key takeaway in under 10 words"
       },
       {
         "type": "quiz",
         "question": "A multiple-choice question testing what was just taught",
         "options": ["Option A", "Option B", "Option C", "Option D"],
         "correct_index": 0,
         "explanation": "1 sentence explaining why correct, referencing the company",
         "dimension": "business_model",
         "sub_topic": "what_company_does"
       }
     ],
     "lesson_complete_message": "1 sentence celebrating what they learned. Be specific."
   }

   RULES:
   - Generate EXACTLY 8 cards: teach, quiz, teach, quiz, teach, quiz, teach, quiz (4 teach + 4 quiz, alternating, starting with teach)
   - Each quiz tests ONLY what the teach card right before it covered
   - Use REAL data from the context provided — real revenue numbers, real products, real competitors
   - Wrong options must be plausible misconceptions, not obviously stupid
   - NEVER give investment advice
   - dimension and sub_topic must be valid IDs (listed below)
   - Skip sub_topics the user already completed (listed in ALREADY_COVERED)
   
   Match content to the level:
   - Level 1: What does this company do? Products? Customers? How does it make money?
   - Level 2: What do the numbers mean? Revenue trends? What's a P/E ratio using their actual P/E?
   - Level 3: What's in the news? Why does a headline matter? What's an earnings report?
   - Level 4: Bull vs bear case? How does it stack up to competitors? Key risks?
   - Level 5: Framework questions — how would you evaluate a new stock?

   VALID DIMENSIONS AND SUB-TOPICS:
   business_model: what_company_does, revenue_segments, core_products, customer_base, business_model_type
   financials: revenue_growth, profitability, balance_sheet, cash_flow, key_ratios
   competitive_position: main_competitors, differentiation, market_share, moat_concept
   risks: key_risk_factors, historical_challenges, dependency_risks, macro_risks
   news_catalysts: recent_earnings, upcoming_catalysts, significant_news, analyst_sentiment
   valuation_context: pe_ratio_meaning, peer_comparison, historical_valuation, expensive_vs_overvalued"

   USER MESSAGE: 
   "Generate a Level {level} lesson for {ticker}.\n\nStock data:\n{JSON.stringify(stockData)}\n\nALREADY_COVERED:\n{list of completed sub_topics or 'None yet'}"

8. Extract the text from the response, parse as JSON
9. If JSON parsing fails, try to extract JSON from markdown code blocks (the AI sometimes wraps in ```json...```)
10. If it still fails, return a hardcoded fallback lesson with generic content

11. Return the lesson JSON as NextResponse.json()

NOTE: You need to install the Anthropic SDK: pnpm add @anthropic-ai/sdk
Make sure ANTHROPIC_API_KEY is set in the environment (it should already be since the chat route uses Anthropic via ai-sdk).

Do NOT modify any existing routes or files.
```

**Verify:** Hit GET /api/lessons?ticker=AAPL&level=1 in the browser while logged in. Should return JSON with lesson_title, 8 cards alternating teach/quiz, and lesson_complete_message. All content should reference actual AAPL data.
**Commit:** `git add . && git commit -m "feat: lesson generation API with AI-powered structured content"`

---

### Step 4: Build the Lesson Player

The most important screen in the app. Full-screen, card-by-card, buttery smooth.

**Prompt:**
```
Two files:

1. Create /src/app/(app)/learn/[ticker]/level/[level]/page.tsx:
   - Dynamic route page receiving params.ticker and params.level
   - Render LessonPlayer with ticker and level (parseInt) as props
   - Client component

2. Create /src/components/learn/lesson-player.tsx:

Props: { ticker: string; level: number }

State:
- lesson: the fetched lesson data (null initially)
- loading: boolean
- currentIndex: number (which card we're on, starts at -1 for the intro screen)
- answers: Record<number, { selected: number; correct: boolean }> — tracks quiz responses
- showExplanation: boolean — whether to show quiz explanation (resets on card change)

On mount: fetch GET /api/lessons?ticker={ticker}&level={level}

SCREENS:

A) LOADING (while lesson is null):
   - Centered on screen: a small spinner (animate-spin, rounded-full border-2 border-amber-500 border-t-transparent size-8)
   - Below: "Preparing your lesson..." (text-sm text-stone-400 mt-3)

B) INTRO SCREEN (currentIndex === -1):
   - Full height centered content
   - Level badge: "Level {level}" in a rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-semibold
   - Lesson title: text-2xl font-bold text-stone-800 mt-4 text-center
   - Lesson intro: text-sm text-stone-500 mt-2 text-center max-w-[280px]
   - "Start Lesson" button: mt-8 w-full max-w-[280px] rounded-xl bg-amber-600 text-white py-3.5 text-sm font-semibold
   - On tap: set currentIndex to 0

C) TOP BAR (visible during cards, currentIndex >= 0):
   - Fixed top, bg-stone-50/90 backdrop-blur-sm, px-4 py-3, z-10
   - Left: X button (X icon from lucide-react, size-5 text-stone-400) → exit confirmation then navigate to /learn/{ticker}
   - Center: progress bar (flex-1 mx-4 h-1.5 bg-stone-200 rounded-full overflow-hidden)
     - Filled: bg-amber-500 rounded-full, width = ((currentIndex + 1) / totalCards) * 100 + "%", transition-all duration-300
   - Right: card count "4/8" (text-xs text-stone-400)

D) TEACH CARD (cards[currentIndex].type === "teach"):
   - Card: mx-4 rounded-2xl bg-white shadow-md ring-1 ring-stone-200/60 overflow-hidden
   - Top section: p-6
     - Small label: "LEARN" (text-[10px] font-semibold uppercase tracking-widest text-amber-600)
     - Content: text-base text-stone-700 leading-relaxed mt-3
   - Highlight section: border-t border-amber-100 bg-amber-50/50 px-6 py-4
     - Highlight text: text-sm font-semibold text-amber-800
   - Below card: "Got it" button
     - mx-4 mt-4 w-[calc(100%-2rem)] rounded-xl bg-amber-600 text-white py-3.5 text-sm font-semibold
     - On tap: advance to next card with slide animation

E) QUIZ CARD (cards[currentIndex].type === "quiz"):
   - Card: same container as teach
   - Top: "QUIZ" label (text-[10px] font-semibold uppercase tracking-widest text-violet-600)
   - Question: text-base font-medium text-stone-800 mt-3
   - Options: mt-4 flex flex-col gap-2.5
     Each option button:
     - Default: rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-left text-sm text-stone-700 flex items-center gap-3
     - Letter indicator on left: w-6 h-6 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center text-xs font-bold
     - On tap (if not yet answered): set answer, show result
     
     After answering:
     - Correct option: border-emerald-300 bg-emerald-50 text-emerald-800, letter circle becomes bg-emerald-500 text-white with Check icon
     - Selected wrong: border-red-300 bg-red-50 text-red-700, letter circle becomes bg-red-400 text-white with X icon
     - Other options: opacity-40
     
   - Explanation (after answering): mt-3 rounded-xl px-4 py-3
     - If correct: bg-emerald-50 border border-emerald-200
       - "Correct!" (text-xs font-semibold text-emerald-700)
     - If wrong: bg-amber-50 border border-amber-200
       - "Not quite!" (text-xs font-semibold text-amber-700)
     - Explanation text: text-xs text-stone-600 mt-1
   
   - "Continue" button (appears after answering): same style as "Got it"
   - On tap: 
     - If correct: call POST /api/progress/update with { ticker, dimension, sub_topic, evidence: "Answered correctly in Level {level} lesson" }
     - Advance to next card

   - When user answers correctly, also call the progress update endpoint.
     Fire-and-forget (don't await or block the UI).

F) COMPLETION SCREEN (currentIndex >= totalCards):
   - Full height centered
   - Large circle: w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center
     - Check icon inside: size-12 text-emerald-500
   - "Lesson Complete!" text-xl font-bold text-stone-800 mt-5
   - lesson_complete_message: text-sm text-stone-500 mt-2 text-center max-w-[260px]
   - Score pill: mt-4 rounded-full bg-stone-100 px-4 py-1.5 text-sm text-stone-600
     - "{correctCount} of {quizCount} correct"
   - "Back to {ticker}" button: mt-8 w-full max-w-[280px] rounded-xl bg-amber-600 text-white py-3.5 text-sm font-semibold
     - Navigates to /learn/{ticker}

CARD TRANSITION ANIMATION:
- Wrap the card area in a div with overflow-hidden
- When advancing: current card slides out left, next card slides in from right
- Use a simple approach: on "Got it"/"Continue" tap, set a transitioning state
  - Apply transform: translateX(-100%) + opacity-0 with transition-all duration-200
  - After 200ms timeout, update currentIndex, reset transform to translateX(0)
  - Or simpler: just use a key={currentIndex} on the card wrapper and CSS transition

Keep under 250 lines total. Tailwind only. Mobile-first.

Do NOT modify any existing files.
```

**Verify:** Navigate to /learn/AAPL/level/1. See intro screen → tap Start → teach cards alternate with quiz cards → answers highlight green/red with explanations → completion screen shows score → "Back to AAPL" returns to level path.
**Commit:** `git add . && git commit -m "feat: interactive lesson player with teach/quiz cards"`

---

## Phase 3: Polish & Integration

### Step 5: Connect lesson completion to streaks and progress

**Prompt:**
```
Two changes:

1. In /src/components/learn/lesson-player.tsx, on the COMPLETION SCREEN:
   - After reaching the completion screen, call POST /api/streaks to record today's activity
     (Check what this endpoint expects — if it just needs a POST with the auth cookie, call it. If it needs a body, check the route file.)
   - Fire-and-forget, don't block the UI
   - Below the score pill, show a streak line: "🔥 Keep your streak going!" (text-xs text-stone-400 mt-2)

2. In /src/components/learn/stock-learning-path.tsx:
   - After the user navigates back from a completed lesson, the progress should reflect the new state
   - This should already work if the component re-fetches progress on mount
   - Verify: add a queryKey or cache-bust to the progress fetch so it gets fresh data after returning from a lesson
   - One approach: use router.refresh() or add a timestamp query param on the progress fetch URL

Do NOT modify any API routes.
```

**Verify:** Complete a lesson → streak updates → navigate back to level path → progress ring shows updated percentage.
**Commit:** `git add . && git commit -m "feat: connect lesson completion to streaks and progress"`

---

### Step 6: Clean up dead chat code

Now that everything works without chat, remove the unused files.

**Prompt:**
```
Delete these files — they are no longer used anywhere in the app:

/src/components/chat/chat-container.tsx
/src/components/chat/chat-input.tsx
/src/components/chat/message-bubble.tsx
/src/components/chat/follow-up-chips.tsx
/src/components/chat/suggested-prompts.tsx
/src/components/chat/smart-recommendation.tsx
/src/components/chat/portfolio-pulse.tsx
/src/components/chat/progress-nudge.tsx

KEEP these chat components (they're reused in lessons or may be useful later):
/src/components/chat/learning-checkpoint.tsx (the quiz UI — may repurpose)
/src/components/chat/stock-card.tsx
/src/components/chat/financial-snapshot.tsx
/src/components/chat/news-card.tsx
/src/components/chat/tool-part-renderer.tsx
/src/components/chat/ComparisonTable.tsx

Also:
- Delete /src/app/(app)/chat/page.tsx (the chat route page)
- Check if /src/app/api/chat/route.ts is imported anywhere BESIDES itself. If nothing imports it, keep it for now (the lesson API might reference patterns from it), but add a comment at the top: "// DEPRECATED: Chat route kept for reference. Not served to users."
- Check /src/app/api/briefing/route.ts — if it exists and nothing uses it, delete it.

Before deleting each file, grep the codebase to confirm nothing imports it. If something still imports a file you're about to delete, remove that import first.
```

**Verify:** App builds without errors. No 404s when navigating. Learn and Progress tabs work. No references to deleted files in the codebase.
**Commit:** `git add . && git commit -m "chore: remove unused chat components and routes"`

---

### Step 7: End-to-end testing

Do NOT paste this as a prompt. Walk through each step manually.

```
CRITICAL PATH TEST:

1. Sign out and sign back in (or create new account)
2. Complete onboarding — add at least 2 stocks (e.g., AAPL, MSFT)
3. Land on LEARN tab → should see:
   ✓ Streak badge at top
   ✓ "Stocks" pill active, ETFs/Bonds/Crypto/Real Estate/Commodities greyed with "Soon"
   ✓ Two stock cards with progress rings
   ✓ Both at Level 1 for new user
   ✓ "Manage portfolio →" link at bottom

4. Tap AAPL card → Stock Learning Path:
   ✓ Back arrow returns to /learn
   ✓ Ticker + percentage displayed at top
   ✓ 5 levels shown vertically with dotted lines between
   ✓ Level 1 pulses amber (current)
   ✓ Levels 2-5 show lock icon (locked)
   ✓ Tapping a locked level does nothing

5. Tap Level 1 → Lesson Player:
   ✓ Intro screen shows level badge + lesson title + intro text
   ✓ "Start Lesson" button works
   ✓ Progress bar at top shows 0%
   ✓ First card is a TEACH card
   ✓ Content references actual AAPL data (not generic placeholder)
   ✓ "Got it" button advances to next card
   ✓ Second card is a QUIZ card
   ✓ Tapping an option shows green (correct) or red (wrong) + explanation
   ✓ "Continue" button advances after answering
   ✓ Cards alternate teach → quiz → teach → quiz (8 total)
   ✓ Progress bar fills as you advance
   ✓ X button shows confirmation before exiting

6. Complete the lesson:
   ✓ Completion screen shows checkmark
   ✓ Score shows "X of 4 correct"
   ✓ Streak message appears
   ✓ "Back to AAPL" returns to learning path

7. Back on AAPL learning path:
   ✓ Level 1 progress has advanced
   ✓ If enough progress, Level 2 may start to unlock

8. Go back to Learn home:
   ✓ AAPL card shows updated progress ring
   ✓ Streak badge reflects today's activity

9. Navigate to Progress tab:
   ✓ Literacy score reflects lesson progress
   ✓ AAPL shows updated dimension progress
   ✓ Streak data is accurate

10. Tap gear icon → Settings:
    ✓ Can add a new stock
    ✓ Can remove a stock
    ✓ New stock appears on Learn tab

NO CHAT ANYWHERE:
✓ No Chat tab in bottom nav
✓ No way to access /chat (should 404 or redirect)
✓ No chat-related UI anywhere in the app

REGRESSION CHECK:
- Progress tracking still updates correctly
- Streak system still works
- Settings add/remove stocks still works
- Onboarding flow still works and lands on /learn
- App doesn't crash on any navigation
```

---

## Summary

| Before | After |
|--------|-------|
| 3 surfaces: Chat (primary) + Progress + Settings | 2 tabs: Learn (primary) + Progress. Settings via gear. |
| Blank chat with "What is a stock?" | Stock grid with progress rings and levels |
| User has to think of what to ask | Tap stock → tap level → start lesson. Zero thinking. |
| AI gives long freeform text responses | AI generates structured teach/quiz cards shown one at a time |
| Learning happens through conversation | Learning happens through bite-sized cards + multiple choice |
| No clear progression | 5 levels per stock, visual path, streak gamification |
| Only stocks mentioned | All 6 asset classes shown (5 greyed as "coming soon") |

## What's Preserved

- Financial data fetchers (FMP API + Firecrawl)
- Learning dimensions + sub-topics framework
- Progress tracking (Supabase tables, progress API)
- Streak system
- Onboarding flow
- Settings page
- ProgressRing, StreakBadge, LiteracyScore components
- The /api/chat route file (deprecated but kept for reference)

## What's Deleted

- ChatContainer, message-bubble, chat-input
- suggested-prompts, follow-up-chips, smart-recommendation
- portfolio-pulse, progress-nudge
- The /chat route and Chat bottom-nav tab

## Vibe Coding Rules

- **One step at a time.** Do 0 → 1 → 2 → 3 → 4 → 5 → 6 in order.
- **Commit after each step.**
- **Clear AI context between steps.**
- **Run the E2E test (Step 7) after Steps 0, 2, 4, and 6.**
- **If the AI fails 3 times on a step**, break it into two smaller steps.

## Future Expansion

- **ETFs:** Same 5-level framework, different dimensions (holdings analysis, expense ratios, tracking error)
- **Bonds:** Yield, duration, credit quality, interest rate sensitivity
- **Crypto:** Token utility, blockchain basics, volatility context, DeFi intro
- **Real Estate:** REITs, cap rates, rental yield, leverage concepts
- **Commodities:** Supply/demand, futures basics, inflation hedging

Each new asset class = a new set of dimensions + sub-topics + level-specific prompt templates. The lesson generation API already takes a level parameter — it just needs asset-class-specific system prompts.
