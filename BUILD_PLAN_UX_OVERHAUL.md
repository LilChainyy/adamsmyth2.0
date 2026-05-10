# Adamsmyth 2.0 — UX Overhaul: Portfolio Pulse

> **The problem:** Users open the app, see a blank chat with generic prompts like "What is a stock?", don't know what to ask, don't see value, and leave. The chat-first design asks users to *pull* value out. But ICP research shows they need value *pushed* to them.
>
> **The fix:** When the user opens the app, they see a **Portfolio Pulse** — a short, AI-generated briefing about what's happening with their stocks this week. Chat becomes the drill-down ("tell me more about this"), not the entry point.
>
> **What stays the same:** All existing tools (get_news, get_financials, get_stock_profile, get_competitors), learning dimensions, progress tracking, checkpoints, journal entries. None of that changes.
>
> **What changes:** The chat page layout, the AI system prompt tone/length, and one new API route.

---

## Pre-Work: Fix the broken rendering first

### Step 0: Fix markdown rendering in chat bubbles

This is the `**bold**` showing as raw text bug. Fix this before anything else — it affects every AI response going forward.

**Prompt:**
```
In /src/components/chat/message-bubble.tsx, the assistant's text content is rendered as raw text using {content} on line 63. This causes markdown formatting like **bold**, *italics*, and bullet points to display as literal characters.

Fix this:
1. Install react-markdown: pnpm add react-markdown
2. Import ReactMarkdown in message-bubble.tsx
3. For assistant messages ONLY (not user messages), render content through <ReactMarkdown> instead of raw {content}
4. Add minimal styling inside the bubble so prose elements look clean:
   - Bold and italic should just work
   - Bullet lists should have small left padding, no extra spacing
   - Paragraphs should have a small gap between them (mb-2)
   - No h1-h6 styling needed — the AI won't use headers in chat
5. Keep user messages rendering as plain text with whitespace-pre-wrap

Do NOT change bubble colors, padding, layout, or any other component.
```

**Verify:** Send a message. Bold text renders as bold, not **raw asterisks**. Bullet points render as bullets, not dashes.
**Commit:** `git add . && git commit -m "fix: render markdown in assistant chat bubbles"`

---

## Phase 1: Portfolio Pulse (the new entry point)

### Step 1: Create the briefing API route

This is the engine. It fetches news for each holding, then asks the AI to write a short, casual briefing.

**Prompt:**
```
Create a new API route at /src/app/api/briefing/route.ts

This route generates a "Portfolio Pulse" — a short weekly briefing about what's happening with the user's stocks.

How it works:
1. Authenticate the user (same pattern as /api/chat/route.ts)
2. Fetch the user's holdings from Supabase (same pattern as chat route)
3. If no holdings, return { pulse: null }
4. For each holding (max 5), call the existing getNews(ticker, 3) from /src/lib/financial-data.ts
5. Combine all the news into a single context block
6. Call the Anthropic API (using @ai-sdk/anthropic, model: claude-sonnet-4-20250514) with this prompt:

SYSTEM PROMPT FOR BRIEFING:
"You are writing a short portfolio pulse for a beginner investor. Be casual, like a smart friend texting them an update. No jargon without explanation.

Format your response as JSON with this exact structure:
{
  "market_mood": "1-2 sentences about the overall market vibe this week — what are people talking about? Any big themes? Keep it super casual.",
  "stocks": [
    {
      "ticker": "AAPL",
      "company_name": "Apple",
      "headline": "One sentence: the single most important thing that happened",
      "so_what": "One sentence: why this matters if you own this stock",
      "follow_up_prompt": "A natural question the user might want to ask about this (under 50 chars)"
    }
  ]
}

Rules:
- If nothing noteworthy happened for a stock, say so honestly: 'Quiet week for Tesla. No major news.'
- The so_what line must connect the event to the user OWNING this stock specifically
- follow_up_prompt should be specific, not generic. 'How did Apple's services revenue do?' not 'Tell me more'
- If the news is all mock data, still generate a plausible briefing so the UI works during development"

USER MESSAGE: "Here are my holdings and their recent news: {JSON of holdings + news data}"

7. Parse the AI response as JSON
8. Return it with proper error handling. If AI response isn't valid JSON, return a fallback structure.

Add caching: store the briefing result in the existing api-cache with a "briefing" category and TTL of 4 hours, keyed by user ID. This way it doesn't regenerate on every page load.

Import getNews from /src/lib/financial-data.ts — do NOT duplicate that logic.
Do NOT modify any existing routes or files.
```

**Verify:** Hit GET /api/briefing in the browser or with curl while logged in. Should return JSON with market_mood and per-stock headlines.
**Commit:** `git add . && git commit -m "feat: portfolio pulse briefing API route"`

---

### Step 2: Build the Portfolio Pulse component

**Prompt:**
```
Create /src/components/chat/portfolio-pulse.tsx — a component that displays the Portfolio Pulse briefing at the top of the chat screen.

It should:
1. On mount, fetch GET /api/briefing
2. While loading, show a subtle skeleton loader (2-3 lines of animated placeholder, similar style to the settings page loader). Keep it compact — not a full-screen loader.
3. Once loaded, render:

LAYOUT (all inside a single card with rounded-xl, bg-white, shadow-sm, ring-1 ring-stone-200/60):

TOP SECTION — Market Mood:
- Small muted label: "This week" (text-xs text-stone-400)
- The market_mood text (text-sm text-stone-700, max 2 lines)

STOCK SECTIONS — one per stock, separated by thin dividers:
- Ticker as a small bold label (text-xs font-semibold text-amber-800)
- Headline text (text-sm text-stone-800, 1 line)
- "So what" text (text-xs text-stone-500, 1 line)  
- A tappable chip/button with the follow_up_prompt text that calls the onAsk prop
  Style: text-xs, rounded-full, border border-amber-200, bg-amber-50, hover:bg-amber-100
  On tap, it sends the follow_up_prompt text into the chat

Props:
- onAsk: (prompt: string) => void — called when user taps a follow-up prompt

4. If the API returns { pulse: null } (no holdings), show nothing — return null
5. If the API errors, show nothing — fail silently, return null
6. Include a small "refresh" icon button (RotateCw from lucide-react, size-3) in the top-right corner of the card that re-fetches the briefing

Keep the component under 120 lines. Use Tailwind only. Make it feel like a clean notification card, not a dashboard widget.

Do NOT modify any existing files.
```

**Verify:** Component renders with mock data when imported. Loading state works. Follow-up chips are tappable.
**Commit:** `git add . && git commit -m "feat: portfolio pulse UI component"`

---

### Step 3: Wire Portfolio Pulse into the chat page

**Prompt:**
```
Modify /src/components/chat/chat-container.tsx to add the Portfolio Pulse as the new entry point.

Changes:
1. Import PortfolioPulse from /src/components/chat/portfolio-pulse
2. Replace the current empty-state section (lines 67-74, the isEmpty block with SmartRecommendation and SuggestedPrompts) with:
   - The PortfolioPulse component, passing onAsk={handleSend}
   - Below it, keep the SuggestedPrompts but ONLY as a fallback (see Step 4 for updating those)
3. Remove the SmartRecommendation import and usage — Portfolio Pulse replaces its function
4. The PortfolioPulse should show when messages are empty (isEmpty === true)
5. Once the user sends their first message, the pulse stays visible but the chat messages flow below it
6. After 3+ messages, hide the pulse card (it served its purpose — the user is now engaged in conversation)

Also update the WELCOME_MESSAGE on line 14 to:
"Here's what's been going on with your stocks this week 👇"

Do NOT change the ChatInput component, the FollowUpChips component, the message rendering logic, or any API routes.
```

**Verify:** Open the chat tab. Portfolio Pulse card appears with stock updates. Tapping a follow-up chip sends a message. After a few messages, the pulse fades and chat takes over.
**Commit:** `git add . && git commit -m "feat: wire portfolio pulse into chat as entry point"`

---

### Step 4: Update suggested prompts to be portfolio-aware

**Prompt:**
```
Rewrite /src/components/chat/suggested-prompts.tsx completely.

Current behavior: Hardcoded generic prompts like "What is a stock?" and "Explain ETFs to me".

New behavior:
1. Accept a new prop: holdings?: { ticker: string; company_name: string }[]
2. If holdings exist and have items, generate personalized prompts using the tickers:
   - Pick 3 random prompts from a template pool like:
     "How does {company_name} make money?"
     "What's {ticker}'s biggest risk right now?"
     "Compare {ticker} to its competitors"
     "Is {ticker} considered expensive?"
     "What industry is {company_name} in?"
   - Rotate which templates and tickers are used (use a simple random selection each render)
3. If no holdings, show:
   - "Help me add my first stocks"
   - "What can you teach me?"
4. Below the prompt chips, add a subtle text link:
   "Manage portfolio →" that navigates to /settings
   Style: text-xs text-stone-400 hover:text-amber-600, centered, mt-2

Now update the parent — /src/components/chat/chat-container.tsx:
1. Fetch holdings from /api/portfolio on mount using a simple useEffect + fetch
2. Pass holdings to SuggestedPrompts

Do NOT change the visual chip styling (rounded-full, border-amber-200, etc.)
Do NOT modify any API routes.
```

**Verify:** Suggested prompts show your actual stock tickers. Refresh the page — prompts should vary. "Manage portfolio →" link navigates to settings.
**Commit:** `git add . && git commit -m "feat: personalized suggested prompts with portfolio link"`

---

## Phase 2: AI Personality Reset

### Step 5: Rewrite the system prompt for brevity

This is the biggest single-change impact. The AI goes from "textbook teacher" to "sharp friend who gives you the short version."

**Prompt:**
```
In /src/app/api/chat/route.ts, modify the buildSystemPrompt function. 

ONLY change the PERSONALITY, RESPONSE STYLE, and add a new RESPONSE FORMAT section. Leave ALL tool definitions, learning framework dimensions, checkpoint logic, journal logic, follow-up logic, and rules (NON-NEGOTIABLE section) exactly as they are.

Replace the PERSONALITY line (line 30) with:

PERSONALITY: You're a sharp friend who happens to know finance. Casual, warm, sometimes funny. You know their portfolio and always make it personal. Never sound like a textbook or a chatbot. If you use a finance term, explain it in parentheses right away.

Replace the RESPONSE STYLE section (lines 93-97) with:

RESPONSE FORMAT (THIS IS CRITICAL — FOLLOW EXACTLY):
- DEFAULT to 2-3 sentences. Short, punchy, specific to their portfolio.
- Lead with why it matters to THEIR stocks. Never lead with a definition.
- If a topic genuinely needs depth, give the short answer FIRST, then say "Want me to break this down more?" and STOP. Only expand if they say yes.
- Use their ticker symbols naturally: "Your AAPL" or "Since you own Tesla" — not "the stock" or "the company."
- One concept per response. If they ask about multiple things, pick the most relevant, address the rest after.
- NEVER start with "Great question!" or "That's a great question!" or any variation. Just answer.
- NEVER start with a textbook definition. Start with the "so what" — why this matters.
- NEVER use bullet points in your first response to a question. Write in natural sentences. You can use bullets only when listing specific data points (like financials) and only if the user asks for detail.

That's it. Do NOT change anything else in this file — no tool definitions, no rules, no checkpoint logic, no follow-up logic, no journal logic.
```

**Verify:** Ask "What is a P/E ratio?" — should get 2-3 sentences connecting it to your actual holdings. Ask "tell me more" — then it should expand. Ask "What's happening with AAPL?" — should lead with news relevance to your portfolio, not a definition of what Apple is.
**Commit:** `git add . && git commit -m "feat: rewrite AI personality for brevity and personalization"`

---

## Phase 3: Paper Cuts Cleanup

### Step 6: Fix stock management discoverability

**Prompt:**
```
Two changes to make the existing stock management feature findable:

1. In /src/components/top-bar.tsx:
   - Make sure the settings gear icon is visible, properly sized (at least 44x44px touch target), and links to /settings
   - If it's not already there, add a settings gear icon (Settings from lucide-react) on the right side of the top bar
   - Style: text-stone-500 hover:text-stone-700, size-5

2. In /src/components/bottom-nav.tsx:
   - Check if there are exactly 2 tabs (Chat, Progress). If so, do NOT add a third tab — the gear icon in the top bar is sufficient.
   - But make sure the gear icon in the top bar is visible on all app pages, not just chat.

The settings page at /src/app/(app)/settings/page.tsx already has working add/remove stock functionality — do NOT change it.

Do NOT add modals, drawers, or inline stock-adding to the chat page. Just make the existing settings page easy to find.
```

**Verify:** From any page in the app, you can see and tap the gear icon to reach settings. On settings page, you can add a new ticker and it saves.
**Commit:** `git add . && git commit -m "fix: make settings gear icon visible and tappable on all pages"`

---

### Step 7: Test the critical path end-to-end

Do NOT paste this as a prompt. This is your manual testing checklist. Walk through each step yourself after completing Steps 0-6.

```
CRITICAL PATH TEST:
1. Sign up with a new account (or sign out and back in)
2. Complete onboarding — add at least 2 stocks
3. Land on chat page → Portfolio Pulse should appear with updates about your stocks
4. Tap a follow-up prompt from the pulse → chat message sends, AI responds
5. AI response should be:
   ✓ 2-3 sentences (not a wall of text)
   ✓ References your specific stocks
   ✓ Renders bold/italic properly (no raw **)
   ✓ Casual tone, not textbook
6. Send a follow-up question → response stays short and relevant
7. Navigate to Progress tab → data should still display
8. Navigate back to Chat → conversation should persist
9. Tap the gear icon → Settings opens
10. Add a new stock in settings → saves successfully
11. Go back to chat → new stock should appear in context on next message
12. Ask the AI for investment advice → it should refuse politely

REGRESSION CHECK:
- Learning checkpoints still appear after 3-4 exchanges
- Follow-up chips still appear after AI responses
- Journal entries still get created after 5+ exchanges about one stock
- Progress tracking still updates when AI covers a topic
```

If anything in the critical path fails, fix that specific issue before moving on. Do NOT try to fix multiple things at once.

---

## Summary: What This Changes

| Before | After |
|--------|-------|
| Blank chat with "What is a stock?" | Portfolio Pulse with this week's updates for YOUR stocks |
| User has to figure out what to ask | App tells them what's happening and offers "go deeper" prompts |
| AI responds with 200+ word educational essays | AI gives 2-3 sentence answers, expands only when asked |
| Generic tone ("A stock is a share of ownership...") | Personal tone ("Your AAPL just reported earnings...") |
| Raw ** in messages | Proper markdown rendering |
| Can't find how to add stocks | Gear icon visible + "Manage portfolio" link in prompts |

## Vibe Coding Rules for This Plan

- **One prompt at a time.** Do steps 0 → 1 → 2 → 3 → 4 → 5 → 6 in order. Never combine two steps.
- **Commit after each step.** If something breaks, you can revert to the last working state.
- **Clear AI context between steps.** Start each prompt in a fresh session.
- **Run the critical path test (Step 7) after Steps 0, 3, 5, and 6.** Those are the highest-risk changes.
- **If the AI fails 3 times on a step**, stop. Simplify the prompt. Break it into two smaller steps.
