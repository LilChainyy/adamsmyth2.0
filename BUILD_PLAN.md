# AdamsMyth 2.0 — Vibe Coding Build Plan

> This plan is designed for building with AI-assisted coding tools (Claude Code, Cursor, etc.). Each step includes the exact prompt to give your AI, what to verify before moving on, and when to commit. Follow the vibe coding principles: one task at a time, specific prompts, commit often, clear context between major features.

---

## Pre-Build Setup

### Step 0.1: Create the CLAUDE.md context document

Before writing any code, create the project's context file. This is the single most important vibe coding practice — it gives the AI persistent memory of your project's rules, architecture, and conventions.

**Prompt:**
```
Create a CLAUDE.md file for this project with the following sections:

PROJECT: AdamsMyth 2.0 — An investment learning assistant web app
STACK: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase (Postgres + Auth), Python FastAPI for AI service, Vercel AI SDK for chat streaming
ARCHITECTURE: Two-tab app (Chat + Progress). Chat is the primary surface. AI agent uses tool calling (not multi-agent). Supabase handles auth, data, realtime.

CONVENTIONS:
- All components in /components, pages in /app
- Use server components by default, 'use client' only when needed
- Zustand for client state, React Query for server state
- All API routes in /app/api
- Environment variables for all secrets (never hardcode)
- Mobile-first responsive design
- Every component gets its own file
- Use absolute imports with @/ prefix

AI BEHAVIOR RULES (for the app's AI, not the coding AI):
- NEVER give investment advice (buy/sell/hold)
- NEVER provide price targets or portfolio allocation suggestions
- Always frame responses as educational
- Track learning progress across 6 dimensions per stock

DO NOT:
- Use localStorage or sessionStorage
- Create god components (max 150 lines per component)
- Skip TypeScript types
- Use any CSS framework besides Tailwind
- Put API keys in code
```

**Verify:** CLAUDE.md exists at project root with all sections filled in.
**Commit:** `git init && git add . && git commit -m "init: add CLAUDE.md project context"`

---

### Step 0.2: Scaffold the Next.js project

**Prompt:**
```
Scaffold a new Next.js 14 project with TypeScript, Tailwind CSS, App Router, and ESLint. Use the following exact configuration:
- Package manager: pnpm
- src/ directory: yes
- App Router: yes
- Tailwind CSS: yes
- Import alias: @/*

After scaffolding, install these additional dependencies:
- shadcn/ui (init with default style, slate color, CSS variables)
- zustand (client state)
- @tanstack/react-query (server state)
- @supabase/supabase-js and @supabase/ssr (auth + database)
- ai and @ai-sdk/anthropic (Vercel AI SDK for chat streaming)
- lucide-react (icons)
- zod (validation)

Create a .env.local.example file with these placeholder variables:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
FINANCIAL_DATA_API_KEY=

Do NOT fill in real values. Just placeholders.
```

**Verify:** `pnpm dev` runs, shows default Next.js page at localhost:3000. All packages in package.json.
**Commit:** `git add . && git commit -m "scaffold: Next.js 14 + Tailwind + shadcn + dependencies"`

---

### Step 0.3: Set up Supabase project and database schema

**Prompt:**
```
Create Supabase migration SQL files for the AdamsMyth 2.0 database schema. Create these in /supabase/migrations/ directory.

Tables needed:

1. profiles (extends Supabase auth.users)
   - id UUID PK references auth.users
   - display_name TEXT
   - onboarding_completed BOOLEAN DEFAULT false
   - created_at TIMESTAMP DEFAULT now()

2. portfolios
   - id UUID PK DEFAULT gen_random_uuid()
   - user_id UUID FK → profiles(id) ON DELETE CASCADE
   - name TEXT DEFAULT 'My Portfolio'
   - created_at TIMESTAMP DEFAULT now()
   - updated_at TIMESTAMP DEFAULT now()

3. holdings
   - id UUID PK DEFAULT gen_random_uuid()
   - portfolio_id UUID FK → portfolios(id) ON DELETE CASCADE
   - ticker TEXT NOT NULL
   - company_name TEXT
   - shares DECIMAL
   - avg_cost_basis DECIMAL
   - added_at TIMESTAMP DEFAULT now()
   - UNIQUE(portfolio_id, ticker)

4. learning_progress
   - id UUID PK DEFAULT gen_random_uuid()
   - user_id UUID FK → profiles(id) ON DELETE CASCADE
   - ticker TEXT NOT NULL
   - dimension TEXT NOT NULL (one of: business_model, financials, competitive_position, risks, news_catalysts, valuation_context)
   - sub_topic TEXT NOT NULL
   - status TEXT DEFAULT 'not_started' (one of: not_started, in_progress, completed)
   - completed_at TIMESTAMP
   - evidence TEXT
   - UNIQUE(user_id, ticker, dimension, sub_topic)

5. chat_messages
   - id UUID PK DEFAULT gen_random_uuid()
   - user_id UUID FK → profiles(id) ON DELETE CASCADE
   - thread_id UUID DEFAULT gen_random_uuid()
   - ticker TEXT
   - role TEXT NOT NULL (one of: user, assistant)
   - content TEXT NOT NULL
   - metadata JSONB DEFAULT '{}'
   - created_at TIMESTAMP DEFAULT now()

6. learning_journal
   - id UUID PK DEFAULT gen_random_uuid()
   - user_id UUID FK → profiles(id) ON DELETE CASCADE
   - ticker TEXT
   - dimension TEXT
   - summary TEXT NOT NULL
   - key_takeaway TEXT
   - created_at TIMESTAMP DEFAULT now()

Enable Row Level Security on all tables. Add policies so users can only read/write their own data. Also create a trigger that auto-creates a profile row when a new user signs up via auth.
```

**Verify:** Run the migration against your Supabase project. Check tables exist in Supabase dashboard. RLS is enabled.
**Commit:** `git add . && git commit -m "db: add Supabase migration with all tables and RLS policies"`

---

## Phase 1: Auth + Portfolio Upload + Basic Chat (Weeks 1-3)

> Goal: User can sign up, add stocks, and chat with AI about their holdings.

---

### Step 1.1: Authentication flow

**Prompt:**
```
Build the authentication flow using Supabase Auth with Next.js App Router middleware pattern.

Create:
1. /src/lib/supabase/client.ts — browser client
2. /src/lib/supabase/server.ts — server client (for Server Components and Route Handlers)
3. /src/middleware.ts — refreshes auth session on every request
4. /src/app/(auth)/login/page.tsx — login page with email + Google OAuth
5. /src/app/(auth)/signup/page.tsx — signup page
6. /src/app/(auth)/layout.tsx — auth layout (centered card, gradient background)
7. /src/app/auth/callback/route.ts — handles OAuth callback
8. A protected route group /src/app/(app)/ that redirects to /login if not authenticated

Use shadcn/ui components (Button, Input, Card). Mobile-first design. The auth pages should look clean and modern with the AdamsMyth branding — warm tones, not cold corporate blue.

Do NOT implement the actual app pages yet — just the auth flow and a placeholder "Welcome" page at /app that shows the user's email and a sign out button.
```

**Verify:** Can sign up with email. Can sign in. Middleware redirects unauthenticated users. Sign out works. Profile row auto-created in Supabase.
**Commit:** `git add . && git commit -m "feat: auth flow with Supabase (email + Google OAuth)"`

---

### Step 1.2: App shell and layout (two-tab structure)

**Prompt:**
```
Build the main app shell for AdamsMyth 2.0. This is a two-tab mobile-first layout.

Structure:
- /src/app/(app)/layout.tsx — the main app layout
- Bottom navigation bar with 2 tabs: "Chat" (MessageSquare icon) and "Progress" (BarChart3 icon)
- Active tab is highlighted with brand color
- Top bar: "AdamsMyth" title left-aligned, settings gear icon right-aligned
- Content area fills remaining space between top bar and bottom nav

Pages:
- /src/app/(app)/chat/page.tsx — placeholder "Chat coming soon"
- /src/app/(app)/progress/page.tsx — placeholder "Progress coming soon"

The default route /app should redirect to /app/chat.

Design notes:
- Bottom nav should be fixed at bottom, not scroll away
- Use warm neutral colors (cream/sand background, dark brown text) — NOT the typical blue/white SaaS look
- Max width 768px on desktop, centered. This is a mobile-first app.
- Smooth tab transitions

Do NOT build the actual chat or progress features yet. Just the shell.
```

**Verify:** Two tabs work. Navigation between them works. Layout looks good on mobile and desktop. Auth still works.
**Commit:** `git add . && git commit -m "feat: app shell with two-tab layout (Chat + Progress)"`

---

### Step 1.3: Portfolio upload flow

**Prompt:**
```
Build the portfolio upload flow. This is shown after first signup when onboarding_completed is false.

Create:
1. /src/app/(app)/onboarding/page.tsx — the onboarding wrapper
2. /src/components/onboarding/PortfolioUpload.tsx — the upload component
3. /src/app/api/portfolio/route.ts — API route to save portfolio + holdings

The flow:
Step 1: Welcome screen with "Let's start by adding your stocks" headline
Step 2: Two options presented as cards:
  - "Type them in" — manual entry form
  - "Upload CSV" — file upload (parse later in Phase 2, for now just show as disabled with "Coming soon" badge)

Manual entry form:
- Ticker search/input field (just a text input for now, autocomplete later)
- Number of shares (optional)
- Average cost basis (optional)
- "Add" button that adds to a list below
- List shows added stocks with ability to remove
- Minimum 1 stock required to continue
- "Continue" button at the bottom

When user clicks Continue:
1. Create portfolio record in Supabase
2. Create holdings records for each stock
3. Set onboarding_completed = true on profile
4. Redirect to /app/chat

Use Supabase client to write to database. Validate ticker is not empty, no duplicates. Show loading states. Handle errors gracefully.

Design: Clean, step-by-step feel. Progress indicator at top (Step 1 of 2). Use shadcn/ui components.
```

**Verify:** Can add stocks manually. Portfolio saves to Supabase. Redirects to chat after completion. Returning users skip onboarding. Check data in Supabase dashboard.
**Commit:** `git add . && git commit -m "feat: portfolio onboarding flow with manual stock entry"`

---

### Step 1.4: Basic chat interface (UI only, no AI yet)

**Prompt:**
```
Build the chat interface UI at /src/app/(app)/chat/page.tsx. No AI integration yet — just the visual chat interface with mock responses.

Create:
1. /src/components/chat/ChatContainer.tsx — the main chat wrapper
2. /src/components/chat/MessageBubble.tsx — individual message (user vs assistant styling)
3. /src/components/chat/ChatInput.tsx — text input + send button, fixed at bottom
4. /src/components/chat/SuggestedPrompts.tsx — chips shown when chat is empty

The chat should:
- Show a welcome message when empty: "Hey! I can see your portfolio. What would you like to learn about first?"
- Display 4 suggested prompt chips (tappable):
  "🔍 I want to understand what I own"
  "📰 Something in the news has me nervous"
  "📊 Are my stocks doing well?"
  "🤷 I don't know what to ask — help me"
- User messages appear on the right (dark bubble)
- Assistant messages appear on the left (light bubble)
- Auto-scroll to bottom on new messages
- Input field with send button, disabled when empty
- Show typing indicator when "AI is responding" (mock for now)
- Messages should be stored in local state (Zustand) for now

For mock behavior: when user sends any message, after 1 second delay, respond with "I'm a placeholder! The AI integration is coming next. You asked about: [user's message]"

Design: WhatsApp/iMessage-style bubbles. Warm colors. Subtle shadows. The suggested prompts should disappear once the first message is sent.

Do NOT connect to any AI API yet.
```

**Verify:** Chat UI renders. Can type and send messages. Mock response appears. Suggested prompts show and disappear. Auto-scroll works. Looks good on mobile.
**Commit:** `git add . && git commit -m "feat: chat UI with message bubbles and suggested prompts"`

---

### Step 1.5: AI chat integration with Anthropic

**Prompt:**
```
Connect the chat to Claude via the Vercel AI SDK. Replace the mock chat with real AI responses.

Create:
1. /src/app/api/chat/route.ts — streaming chat API route using Vercel AI SDK
2. Update ChatContainer.tsx to use the useChat hook from 'ai/react'

The API route should:
- Use @ai-sdk/anthropic with Claude Sonnet (claude-sonnet-4-20250514)
- Include a system prompt with these sections:

SYSTEM PROMPT STRUCTURE:
```
You are AdamsMyth, an investment learning assistant. Your job is to help beginner investors understand what they own — NOT to give financial advice.

PERSONALITY: Warm, patient, curious. Like a knowledgeable friend who makes finance interesting. Use analogies. Ask follow-up questions. Celebrate progress.

PORTFOLIO CONTEXT:
The user holds these stocks: [inject from database]
{ticker} - {company_name} - {shares} shares

RULES (NON-NEGOTIABLE):
- NEVER recommend buying, selling, or holding any security
- NEVER provide price targets or fair value estimates
- NEVER suggest portfolio allocation
- NEVER say "you should" regarding financial actions
- Frame EVERYTHING as "here's how to think about this"
- When user asks for advice, redirect to education
- Acknowledge uncertainty ("analysts disagree on this")

LEARNING FRAMEWORK:
You teach through 6 dimensions: Business Model, Financials, Competitive Position, Risks, News & Catalysts, Valuation Context.
When you cover a topic, note which dimension it belongs to.

RESPONSE STYLE:
1. Acknowledge the question
2. Connect to their portfolio ("Since you hold X...")
3. Explain the concept with an analogy
4. Ask a follow-up to deepen understanding
```

- Fetch the user's holdings from Supabase to inject into system prompt
- Stream the response back to the frontend

The frontend should:
- Use useChat() hook for automatic streaming
- Show a typing indicator while streaming
- Persist messages to Supabase chat_messages table after each exchange
- Pass the user's auth token in the request

Do NOT add tool calling yet. Just the basic chat with portfolio context.
```

**Verify:** Chat works with real AI responses. Responses stream in. AI knows about user's holdings. AI refuses to give investment advice when asked. Messages save to Supabase.
**Commit:** `git add . && git commit -m "feat: AI chat integration with Claude via Vercel AI SDK"`

**🧹 Context checkpoint:** Clear your AI coding session context here. Phase 1 core is done. Start a fresh session for the next step, referencing CLAUDE.md.

---

### Step 1.6: Stock data tool (first AI tool)

**Prompt:**
```
Add tool calling capability to the AI chat. Implement the first tool: get_stock_profile.

Reference the Vercel AI SDK tool calling documentation. Update /src/app/api/chat/route.ts.

Tool definition:
- Name: get_stock_profile
- Description: "Get basic information about a stock including current price, market cap, sector, description, and key metrics"
- Parameters: { ticker: string }
- Implementation: Call Financial Modeling Prep API (https://financialmodelingprep.com/stable/profile?symbol={ticker}&apikey=KEY) or use a mock response for now if no API key
- NOTE: FMP uses the /stable/ base URL (not /api/v3/). Parameters are query-based (?symbol=AAPL), not path-based (/{ticker}). Auth can also be sent as a header: `apikey: YOUR_KEY`.

When the AI calls this tool:
1. Fetch the data from the API
2. Return the result to the AI
3. The AI then explains it to the user in educational, beginner-friendly language

Also create:
- /src/lib/financial-data.ts — wrapper for financial data API calls with caching
- Add FINANCIAL_DATA_API_KEY to .env.local.example

For now, if no API key is set, return realistic mock data so development can continue.

Test by asking the AI: "Tell me about Apple" — it should call the tool, get data, and explain Apple's business in beginner-friendly terms.
```

**Verify:** AI calls the tool when discussing a stock. Data appears in conversation naturally. Works with mock data when no API key set.
**Commit:** `git add . && git commit -m "feat: get_stock_profile tool with Financial Modeling Prep API"`

---

## Phase 2: Learning Engine (Weeks 4-6)

> Goal: Progress tracking works. Chat conversations update learning progress.

---

### Step 2.1: Learning progress data layer

**Prompt:**
```
Build the learning progress system — the data layer and API routes.

Create:
1. /src/lib/learning-framework.ts — defines all 6 dimensions and their sub-topics:

DIMENSIONS:
- business_model: ["what_company_does", "revenue_segments", "core_products", "customer_base", "business_model_type"]
- financials: ["revenue_growth", "profitability", "balance_sheet", "cash_flow", "key_ratios"]
- competitive_position: ["main_competitors", "differentiation", "market_share", "moat_concept"]
- risks: ["key_risk_factors", "historical_challenges", "dependency_risks", "macro_risks"]
- news_catalysts: ["recent_earnings", "upcoming_catalysts", "significant_news", "analyst_sentiment"]
- valuation_context: ["pe_ratio_meaning", "peer_comparison", "historical_valuation", "expensive_vs_overvalued"]

Each sub-topic has: id, label (human-readable), description, dimension

2. /src/app/api/progress/route.ts — GET: fetch user's progress for all stocks or a specific ticker
3. /src/app/api/progress/update/route.ts — POST: mark a sub-topic as completed with evidence
4. /src/lib/progress.ts — helper functions:
   - getProgressByTicker(userId, ticker) → returns progress per dimension
   - getOverallProgress(userId) → returns overall literacy score
   - calculateDimensionProgress(completedSubTopics, totalSubTopics) → percentage

Use the dimension weights from the spec:
- business_model: 20%, financials: 20%, competitive_position: 15%, risks: 15%, news_catalysts: 15%, valuation_context: 15%

Initialize progress rows when a stock is first added to portfolio (all sub-topics as not_started).

Write TypeScript types for everything.
```

**Verify:** API routes work. Can fetch progress (all zeros for new stocks). Can update a sub-topic to completed. Percentage calculations are correct.
**Commit:** `git add . && git commit -m "feat: learning progress data layer with 6 dimensions"`

---

### Step 2.2: AI progress tracking tools

**Prompt:**
```
Add two new tools to the AI agent so it can read and update learning progress during conversations.

Tool 1: get_learning_progress
- Description: "Check what the user has already learned about a specific stock"
- Parameters: { ticker: string }
- Returns: progress per dimension with completed/total sub-topics and percentage
- The AI should use this to avoid re-teaching what the user already knows and to suggest what to explore next

Tool 2: update_learning_progress
- Description: "Mark a learning sub-topic as explored after the user has demonstrated understanding through conversation"
- Parameters: { ticker: string, dimension: string, sub_topic: string, evidence: string }
- The evidence parameter is a brief note about what the user understood (e.g., "User correctly explained Apple's 5 revenue segments")

Update the system prompt to include instructions:
```
PROGRESS TRACKING:
- After teaching a concept, call update_learning_progress to record what was covered
- Only mark a topic as completed when the user has engaged meaningfully (asked questions, responded to your explanation, or answered a comprehension check)
- Don't mark topics completed just because you mentioned them — the user needs to show engagement
- Before diving into a stock, call get_learning_progress to see what's already covered
- Periodically mention progress: "You've now covered 3 of 5 topics in Apple's Business Model dimension"
```

Test by having a conversation about Apple's business model. After 4-5 exchanges, check the database — the business_model sub-topics should show some as completed.
```

**Verify:** AI calls get_learning_progress at conversation start. AI calls update_learning_progress after teaching. Progress records appear in Supabase. AI mentions progress naturally in conversation.
**Commit:** `git add . && git commit -m "feat: AI progress tracking tools (get + update)"`

---

### Step 2.3: Progress tab UI

**Prompt:**
```
Build the Progress tab at /src/app/(app)/progress/page.tsx. This is the second main tab of the app.

Create:
1. /src/components/progress/PortfolioOverview.tsx — shows all holdings with progress rings
2. /src/components/progress/ProgressRing.tsx — circular progress indicator (SVG)
3. /src/components/progress/StockProgressDetail.tsx — detailed view for a single stock
4. /src/components/progress/DimensionBar.tsx — horizontal progress bar for each dimension
5. /src/components/progress/LiteracyScore.tsx — overall "Investment Literacy Score" card at top

The overview page shows:
- "Investment Literacy Score" card at top — large number (0-100), calculated as weighted average of all stocks
- Grid of stock cards, each showing:
  - Ticker + company name
  - Circular progress ring (0-100%)
  - Color-coded: Red (< 25%), Amber (25-75%), Green (> 75%)
  - Tap to expand

When a stock card is tapped, expand to show:
- 6 dimension bars (Business Model, Financials, etc.)
- Each bar shows percentage and label
- Sub-topics listed under each dimension (checkmark for completed, circle for not started)
- "Learn more about this" button → navigates to chat with that stock pre-selected

Fetch data from /api/progress using React Query. Show loading skeletons. Handle empty state (no stocks yet → "Add stocks to start learning" CTA).

Design: Clean cards, warm colors matching the app theme. Progress rings should animate on load. Use Tailwind for all styling.
```

**Verify:** Progress tab shows all stocks from portfolio. Progress rings display correctly. Can tap into detail view. Empty states work. Data refreshes when switching tabs.
**Commit:** `git add . && git commit -m "feat: progress tab with rings, dimensions, and literacy score"`

---

### Step 2.4: CSV portfolio upload

**Prompt:**
```
Add CSV upload capability to the portfolio onboarding flow. Update the disabled "Upload CSV" option to work.

Create:
1. /src/components/onboarding/CSVUpload.tsx — file upload component with drag-and-drop
2. /src/lib/csv-parser.ts — parse common brokerage CSV export formats

The CSV parser should handle these common formats:
- Robinhood exports (columns: Instrument, Quantity, Average Cost)
- Fidelity exports (columns: Symbol, Quantity, Last Price, Cost Basis Total)
- Generic format (columns: ticker/symbol, shares/quantity, cost/price)

Logic:
1. User drops or selects a CSV file
2. Parse the CSV and try to match columns automatically
3. Show a preview table: "We found X stocks in your file"
4. Let user confirm or edit before saving
5. Save to portfolio + holdings like the manual flow

Handle errors: wrong file type, unparseable CSV, no recognizable columns. Show clear error messages.

Design: Drag-and-drop zone with dashed border. Preview table with edit capability. Confirmation step before saving.
```

**Verify:** Can upload a Robinhood-style CSV. Stocks are parsed and previewed. Can edit before confirming. Saves to database correctly.
**Commit:** `git add . && git commit -m "feat: CSV portfolio upload with auto-detection"`

**🧹 Context checkpoint:** Clear context. Phase 2 core done. Refactor session recommended.

---

### Step 2.5: Refactoring session

> This is a pure maintenance step — critical in vibe coding to prevent technical debt from compounding.

**Prompt:**
```
Review and refactor the current codebase. Do NOT add any new features. Focus on:

1. CODE QUALITY:
   - Are there any components over 150 lines? Break them up.
   - Are TypeScript types properly defined? No 'any' types?
   - Are there duplicate code patterns that should be extracted into shared utilities?

2. FILE ORGANIZATION:
   - Are files in the right directories?
   - Are imports clean (no circular dependencies)?
   - Is the component naming consistent?

3. ERROR HANDLING:
   - Do all API routes have proper error handling?
   - Do all Supabase queries check for errors?
   - Are there loading states for all async operations?

4. PERFORMANCE:
   - Are there unnecessary re-renders?
   - Is data fetching efficient (no duplicate requests)?
   - Are images optimized?

List everything you find, then fix each issue. Do not change functionality.
```

**Verify:** App still works exactly the same. Code is cleaner. No TypeScript errors. `pnpm build` succeeds with no warnings.
**Commit:** `git add . && git commit -m "refactor: code cleanup, fix types, improve error handling"`

---

## Phase 3: Rich Chat & Engagement (Weeks 7-9)

> Goal: Chat feels polished with rich inline content and engagement features.

---

### Step 3.1: News and financials tools

**Prompt:**
```
Add two more tools to the AI agent:

Tool 1: get_financials
- Description: "Get financial data for a stock including revenue, earnings, margins, P/E ratio, and growth rates"
- Parameters: { ticker: string }
- Call Financial Modeling Prep API: /stable/income-statement?symbol={ticker}&limit=4 and /stable/ratios?symbol={ticker}&limit=1
- NOTE: FMP uses the /stable/ base URL (not /api/v3/). Parameters are query-based (?symbol=AAPL), not path-based.
- Return structured data: revenue, net_income, gross_margin, operating_margin, pe_ratio, revenue_growth_yoy
- Include mock fallback

Tool 2: get_news
- Description: "Get recent news articles about a stock"
- Parameters: { ticker: string, limit: number (default 5) }
- Call Financial Modeling Prep API: /stable/stock_news?tickers={ticker}&limit={limit}
- Return: title, source, date, summary, url
- Include mock fallback

Also create /src/lib/api-cache.ts — a simple in-memory cache with TTL:
- Stock profiles: cache for 24 hours
- Financials: cache for 6 hours
- News: cache for 1 hour

Update the AI system prompt to know about these new tools and when to use them.
```

**Verify:** AI uses get_financials when user asks about a company's financial health. AI uses get_news when user asks about recent events. Caching works (second request is instant).
**Commit:** `git add . && git commit -m "feat: financials and news tools with caching"`

---

### Step 3.2: Rich message components (inline cards in chat)

**Prompt:**
```
Create rich inline components that render inside chat messages when the AI returns structured data.

Create:
1. /src/components/chat/StockCard.tsx — compact stock info card
   Shows: ticker, company name, price, day change %, sector
   Rendered when AI calls get_stock_profile

2. /src/components/chat/FinancialSnapshot.tsx — key financial metrics
   Shows: revenue (with YoY growth arrow), net margin %, P/E ratio, market cap
   Small bar chart for 4-quarter revenue trend
   Rendered when AI calls get_financials

3. /src/components/chat/NewsCard.tsx — news article card
   Shows: headline, source, date, 2-line AI summary
   Tappable (opens source in new tab)
   Rendered when AI calls get_news

4. /src/components/chat/ProgressNudge.tsx — inline progress update
   Shows: "You've covered 3/6 dimensions for AAPL 🎯" with a mini progress bar
   Rendered when AI calls update_learning_progress

Update MessageBubble.tsx to detect structured content in the AI response metadata and render the appropriate card component inline within the message.

Design: Cards should feel native to the chat — rounded corners, subtle shadows, match the warm color palette. NOT like embedded iframes or foreign widgets.
```

**Verify:** Stock cards appear in chat when AI discusses a stock. Financial snapshots render with real data. News cards are tappable. Progress nudges show inline.
**Commit:** `git add . && git commit -m "feat: rich inline cards in chat (stock, financials, news, progress)"`

---

### Step 3.3: Learning checkpoints

**Prompt:**
```
Add interactive learning checkpoints that the AI can embed in the conversation.

Create:
1. /src/components/chat/LearningCheckpoint.tsx — an interactive multiple-choice question embedded in chat

The component:
- Shows a question with 3-4 tappable options
- User taps an answer
- Correct answer highlighted green, wrong answer highlighted red
- Brief explanation shown after answering
- If correct: AI congratulates and marks relevant sub-topic as completed
- If wrong: AI explains the correct answer gently ("No worries — here's the thing...")
- Can only answer once (disabled after selection)

Add a new tool to the AI:
Tool: present_learning_checkpoint
- Description: "Present an interactive comprehension question to test the user's understanding of a concept just discussed"
- Parameters: {
    question: string,
    options: string[] (3-4 options),
    correct_index: number,
    explanation: string,
    ticker: string,
    dimension: string,
    sub_topic: string
  }

Update the system prompt:
```
After explaining a significant concept, occasionally present a learning checkpoint to test understanding. Keep questions friendly and low-pressure — say something like "Quick check — let's see if this clicked" before the question. Don't quiz after every message — roughly every 3-4 educational exchanges.
```

Store checkpoint results in chat_messages metadata for analytics.
```

**Verify:** AI presents checkpoints after teaching. Can tap to answer. Correct/incorrect feedback works. Sub-topic marked as completed on correct answer.
**Commit:** `git add . && git commit -m "feat: interactive learning checkpoints in chat"`

---

### Step 3.4: Suggested follow-ups and smart prompts

**Prompt:**
```
Add dynamic suggested follow-up prompts after each AI response.

Create:
1. /src/components/chat/FollowUpChips.tsx — row of tappable chip buttons below the latest AI message

The AI should return suggested follow-ups in its response metadata. Add to system prompt:
```
After each response, suggest 2-3 natural follow-up questions the user might want to ask. Format them as short, tappable prompts. Make them specific to what was just discussed.

Example: After explaining Apple's revenue segments, suggest:
- "Which segment is growing fastest?"
- "How do services compare to hardware margins?"
- "What do Apple's competitors look like?"
```

Also create:
2. /src/components/chat/SmartRecommendation.tsx — a special prompt that appears when the user opens the chat and has stocks with low progress

Logic: When chat loads, check progress API. If any stock has < 25% progress, show a card:
"You haven't explored much about {ticker} yet. Want to start with their business model?"
[Start learning →]

Tapping the card sends the prompt to the chat automatically.

The follow-up chips should:
- Appear below the latest assistant message only
- Disappear when the user starts typing
- Tapping a chip sends it as a message
- Animate in with a subtle fade
```

**Verify:** Follow-up chips appear after AI responses. Tapping sends the message. Smart recommendation shows for under-explored stocks. Chips disappear on typing.
**Commit:** `git add . && git commit -m "feat: suggested follow-ups and smart learning recommendations"`

---

### Step 3.5: Engagement features (streaks + journal)

**Prompt:**
```
Add two engagement features: learning streaks and the learning journal.

Feature 1: Learning Streaks
- Track daily active learning (at least 1 chat message per day)
- /src/app/api/streaks/route.ts — GET: return current streak count and longest streak
- Store in a new Supabase table: daily_activity (user_id, date DATE, message_count INT, UNIQUE(user_id, date))
- Show streak badge on the Progress tab: "🔥 5-day learning streak"
- Increment when user sends a chat message (debounce — only first message per day triggers)

Feature 2: Learning Journal
- After each significant chat session (5+ messages about a single stock), the AI generates a journal summary
- /src/app/api/journal/route.ts — GET: list journal entries, POST: create entry
- /src/components/progress/JournalEntries.tsx — list of journal entries on Progress tab
- Each entry shows: date, ticker, dimension, summary (2-3 sentences), key takeaway (1 sentence)
- Add a tool for the AI:

Tool: create_journal_entry
- Description: "After a meaningful learning conversation, create a journal entry summarizing what the user learned"
- Parameters: { ticker, dimension, summary, key_takeaway }

Update system prompt: "After 5+ meaningful exchanges about a single stock, create a journal entry summarizing the key takeaways. Do this naturally at the end of a topic."

Show journal entries in the Progress tab under the stock detail view.
```

**Verify:** Streak counter increments daily. Journal entries are created by AI after deep conversations. Journal entries appear in Progress tab.
**Commit:** `git add . && git commit -m "feat: learning streaks and AI-generated journal entries"`

**🧹 Context checkpoint:** Clear context. Phase 3 done. Major refactoring session recommended.

---

### Step 3.6: Phase 3 refactoring + testing

**Prompt:**
```
This is a refactoring and testing session. Do NOT add new features.

1. REFACTOR:
   - Review all components for size (max 150 lines)
   - Extract shared hooks into /src/hooks/
   - Extract shared utility functions into /src/lib/utils/
   - Ensure consistent error handling patterns across all API routes
   - Review and clean up the AI system prompt (it may have gotten bloated)

2. ADD TESTS:
   - Write unit tests for /src/lib/learning-framework.ts (progress calculations)
   - Write unit tests for /src/lib/csv-parser.ts (CSV parsing)
   - Write unit tests for /src/lib/api-cache.ts (cache TTL behavior)
   - Write an E2E test (using Playwright) for the critical path:
     Sign up → Add stocks → Send chat message → Verify response appears

3. SECURITY CHECK:
   - Ensure no API keys are in the code (all in .env)
   - Verify all Supabase queries use parameterized inputs
   - Verify RLS policies are working (try accessing another user's data)
   - Check that the chat API validates auth before processing

Fix everything you find. Run all tests and make sure they pass.
```

**Verify:** All tests pass. `pnpm build` succeeds. No security issues found. Code is clean.
**Commit:** `git add . && git commit -m "refactor: phase 3 cleanup, add tests, security review"`

---

## Phase 4: Knowledge Base & Polish (Weeks 10-12)

---

### Step 4.1: Educational content RAG

**Prompt:**
```
Set up a RAG (Retrieval Augmented Generation) pipeline for educational content.

Approach: Use Supabase pgvector extension (simpler than adding Pinecone for MVP).

1. Enable pgvector extension in Supabase
2. Create table: knowledge_base (id, title, content, category, dimension, embedding vector(1536))
3. /src/lib/embeddings.ts — generate embeddings using Anthropic's embedding API or OpenAI's text-embedding-3-small
4. /src/scripts/seed-knowledge.ts — script to embed and insert educational content

Seed content (write 20 beginner-friendly educational articles):
- "What is a P/E ratio and why it matters" (valuation_context)
- "How to read a company's revenue breakdown" (business_model)
- "Understanding profit margins" (financials)
- "What is a competitive moat?" (competitive_position)
- "How interest rates affect stock prices" (risks)
- "What happens during earnings season" (news_catalysts)
- "Revenue vs profit — what's the difference?" (financials)
- "What does market cap actually mean?" (valuation_context)
- "How to think about company debt" (financials)
- "What are stock buybacks?" (business_model)
... (write 10 more covering all 6 dimensions)

Each article: 300-500 words, beginner-friendly, uses everyday analogies, no jargon without explanation.

Add AI tool:
Tool: search_knowledge_base
- Description: "Search the educational knowledge base for content about an investing concept"
- Parameters: { query: string, limit: number (default 3) }
- Implementation: Embed the query, search pgvector for nearest matches, return content

Update system prompt: "When explaining investing concepts, use search_knowledge_base to find relevant educational content. Weave the knowledge naturally into your explanation — don't just paste it."
```

**Verify:** Knowledge base seeded with articles. search_knowledge_base tool works. AI uses it when explaining concepts. Explanations are richer and more consistent.
**Commit:** `git add . && git commit -m "feat: educational knowledge base with pgvector RAG"`

---

### Step 4.2: Competitor comparison tool

**Prompt:**
```
Add a competitor comparison tool so the AI can pull peer data when discussing competitive position.

Tool: get_competitors
- Description: "Get a comparison of a stock with its main competitors including key metrics"
- Parameters: { ticker: string }
- Implementation:
  1. Call Financial Modeling Prep /stable/stock_peers?symbol={ticker} to get peer list
  2. Fetch profiles for top 3-4 peers (using /stable/profile?symbol={peer_ticker})
  3. Return comparison data: ticker, name, market_cap, pe_ratio, revenue_growth, margin

Create:
/src/components/chat/ComparisonTable.tsx — renders a comparison table inline in chat
- Columns: Company, Market Cap, P/E, Revenue Growth, Margin
- Highlight the user's holding in the table
- Clean, readable design with the stock the user owns emphasized

The AI should use this when discussing competitive position dimension. Update system prompt accordingly.
```

**Verify:** AI pulls competitor data when asked. Comparison table renders inline. User's stock is highlighted.
**Commit:** `git add . && git commit -m "feat: competitor comparison tool with inline table"`

---

### Step 4.3: Landing page + marketing site

**Prompt:**
```
Build a public landing page at the root / route (not behind auth).

Create /src/app/(marketing)/page.tsx and /src/app/(marketing)/layout.tsx

The landing page should have:

Section 1 — Hero:
- Headline: "Understand what you own"
- Subheadline: "An AI learning assistant that helps you make sense of your investment portfolio — without telling you what to do."
- CTA button: "Start learning — it's free"
- Phone mockup or illustration showing the chat interface

Section 2 — How it works:
- Step 1: "Upload your stocks" — brief description
- Step 2: "Chat with your learning assistant" — brief description
- Step 3: "Track your progress" — brief description

Section 3 — The 6 dimensions:
- Visual showing the 6 learning dimensions as a wheel or grid
- Brief explanation of the framework

Section 4 — What we don't do:
- "We never tell you to buy or sell"
- "We never give price targets"
- "We teach you to think for yourself"

Section 5 — CTA:
- "Ready to understand your portfolio?"
- Sign up button

Design: Warm, modern, not-corporate. Think Cleo or Wealthsimple's landing page energy — approachable, clean, bold typography. The current authenticated routes should still work unchanged.

Use Next.js route groups: (marketing) for public pages, (auth) for login/signup, (app) for authenticated app.
```

**Verify:** Landing page renders at /. Auth pages still work. Authenticated users still get the app. SEO basics (title, meta description). Mobile-responsive.
**Commit:** `git add . && git commit -m "feat: public landing page with marketing content"`

---

### Step 4.4: Final polish and edge cases

**Prompt:**
```
Polish pass on the entire app. Go through every screen and fix issues.

Check and fix:
1. LOADING STATES: Every async operation should show a skeleton or spinner
2. ERROR STATES: Every API call should have an error fallback UI
3. EMPTY STATES: Portfolio with 0 stocks, chat with 0 messages, progress with 0 data
4. MOBILE: Test every screen at 375px width. Fix overflow, touch targets, spacing.
5. KEYBOARD: Chat input should work with Enter to send, Shift+Enter for newline
6. PERFORMANCE: Add React.memo to expensive components. Check for unnecessary re-renders.
7. ACCESSIBILITY: All interactive elements need aria labels. Color contrast must pass WCAG AA.
8. DISCLAIMER: Add a subtle fixed footer in the chat: "Educational content only. Not financial advice."
9. SETTINGS PAGE: Build /src/app/(app)/settings/page.tsx with:
   - Account info (email)
   - Portfolio management (add/remove stocks)
   - Sign out button
   - "About AdamsMyth" link
10. FAVICON + META: Add proper favicon, og:image, meta tags

List everything you find before fixing. Fix one category at a time and verify after each.
```

**Verify:** All screens look polished on mobile and desktop. No blank states without messaging. No unhandled errors. Disclaimer visible in chat.
**Commit:** `git add . && git commit -m "polish: loading states, error handling, mobile fixes, accessibility"`

---

### Step 4.5: Final testing + deployment

**Prompt:**
```
Prepare the app for production deployment.

1. TESTS:
   - Run all existing tests, fix any failures
   - Add E2E test: Full onboarding flow (signup → add stocks → chat → check progress)
   - Add E2E test: CSV upload flow
   - Add E2E test: AI refuses to give investment advice

2. ENVIRONMENT:
   - Verify all env vars are documented in .env.local.example
   - Create .env.production with placeholder values
   - Verify Supabase RLS policies work in production mode

3. BUILD:
   - Run `pnpm build` and fix any errors/warnings
   - Check bundle size — flag anything over 200KB
   - Verify no console.log statements in production code

4. DEPLOY:
   - Create vercel.json with appropriate settings
   - Document deployment steps in README.md
   - Set up environment variables in Vercel dashboard

Do NOT deploy yet — just prepare everything so deployment is a single `vercel deploy`.
```

**Verify:** All tests pass. Build succeeds. No console.logs. README has deployment instructions.
**Commit:** `git add . && git commit -m "release: production-ready build, tests passing, deployment config"`

---

## Quick Reference: Vibe Coding Rules for This Project

### Session management
- **Start each coding session** by telling the AI: "Read CLAUDE.md and familiarize yourself with the project"
- **Clear context every 3-5 steps** (or when the AI starts making mistakes)
- **One task per prompt** — never combine "add the news tool AND update the progress UI"
- **If AI fails 3 times**, stop, clear context, and start a fresh session with a simplified prompt

### Commit discipline
- **Commit after every successful step** (the plan marks each commit point)
- **Use descriptive commit messages** (the plan provides suggested messages)
- **Before starting a new feature**, make sure Git is clean: `git status`
- **If something breaks badly**, use `git stash` or `git checkout .` to revert

### Prompting patterns that work for this project
- Always start prompts with "Create..." or "Build..." or "Add..." (imperative, specific)
- Always list the files that should be created/modified
- Always describe the behavior, not just the UI
- Always include "Do NOT..." constraints to prevent scope creep
- Reference specific API endpoints, table names, and component names from CLAUDE.md

### What to do when stuck
1. Ask the AI: "Explain what went wrong in simple terms"
2. If that doesn't help: clear context, paste just the error, ask for a fix
3. If that doesn't help: revert to last commit, rephrase the prompt differently
4. If that doesn't help: break the step into 2 smaller steps

### Update CLAUDE.md as you build
After completing each phase, update CLAUDE.md with:
- New files/directories created
- New conventions established
- Any architectural decisions that changed
- Known issues or technical debt to address later
