# Adamsmyth 2.0 — Full Product Specification

## 1. Executive Summary

Adamsmyth 2.0 is a portfolio-aware investment learning assistant for beginner investors. Users upload their holdings, and an AI chat guides them through understanding what they own — not by giving advice, but by teaching them to evaluate stocks through structured learning dimensions (business model, financials, news, risks, etc.). A progress tracker visualizes how much the user has explored about each holding, turning investing education into a tangible, measurable journey.

**Core principle:** "We don't tell you what to do. We help you understand what you already have."

---

## 2. Problems with the Current App (v1 Audit)

The existing app at adamsmyth.app/stocks has several structural issues that necessitate a full rework:

**Wrong entry point.** The current app starts with "Browse Themes" — a discovery-first model. But the target user (a beginner who already bought stocks) doesn't need discovery. They need to understand what they already own. The app should start with "what's in your portfolio?" not "here are some themes."

**Passive AI.** The AI Advisor exists but is buried behind a CTA button on stock detail pages. It's not the core experience — it's an afterthought. The new app should make conversational learning the primary interaction model.

**Empty progress tracker.** The per-stock progress bars (Business Model 0%, Financials 0%, News & Catalysts 0%) are a good idea but disconnected from the chat. There's no mechanism for the chat to actually update progress. The tracker and the chat need to be a single integrated system.

**Broken data.** Chart data fails to load. The app feels incomplete and unreliable.

**No portfolio upload.** Users can't bring their own holdings. They can only browse pre-curated themes. This misses the core use case entirely.

**Unclear value proposition.** The app tries to be a theme browser, a stock screener, a watchlist manager, and a learning tool simultaneously. It needs to pick one lane and go deep.

---

## 3. Product Vision and Positioning

### What Adamsmyth 2.0 IS:
- A learning companion for your investment portfolio
- A structured framework for understanding what you own
- A progress tracker that shows how much you've researched each holding
- A safe space where beginners can ask "dumb questions" without judgment

### What Adamsmyth 2.0 IS NOT:
- A financial advisor (we never say "buy" or "sell")
- A stock screener or discovery tool
- A portfolio tracker (we don't focus on performance/returns)
- A trading platform

### Competitive positioning (Cleo as reference model):
Cleo (meetcleo.com) is the closest analogue in a different domain — an AI chat-first financial assistant for budgeting/spending. Their approach validates several of our design choices: chat as the primary surface, requiring real financial data upfront (bank connection) before anything works, and a strong AI personality to make finance feel approachable. However, Cleo's model is about *managing money for you* (their Autopilot feature literally automates financial decisions), while Adamsmyth is about *teaching you to understand your investments yourself*. Cleo creates dependency; Adamsmyth builds competence. Their "Money IQ" feature — a weekly gamified spending quiz — is engagement-focused, not education-focused. Adamsmyth's structured 6-dimension learning framework with persistent progress tracking goes significantly deeper on the education axis. This is our core differentiation: we're not a tool you use, we're a tool that makes you smarter.

### Regulatory boundary (critical):
The AI must never provide personalized investment advice, recommendations to buy/sell/hold, price targets, portfolio allocation suggestions, or timing guidance. It operates purely as an educational tool that surfaces factual information and teaches analytical frameworks. Every response should help the user build their own judgment, not replace it.

---

## 4. Target User

**Primary persona: "The Accidental Investor"**

Demographics: 22-35, bought stocks through Robinhood/WeBull/Fidelity, holds 3-15 positions. They may have bought based on tips from friends, Reddit, TikTok, or news headlines. They own things they don't fully understand.

Motivations: They feel vaguely anxious about their portfolio. They want to understand what they own but don't know where to start. Traditional financial education feels dry and disconnected from their actual holdings.

Key insight: They don't need more information — the internet is full of it. They need *structured, personalized guidance* through the information that matters for *their specific holdings*.

---

## 5. Complete User Flow

### 5.1 Onboarding (First-time user)

```
Landing Page
  → "Understand what you own" value prop
  → Sign up (email/Google)
  → Portfolio Upload Screen
      Option A: CSV upload (from brokerage export)
      Option B: Manual entry (ticker + shares + avg cost)
      Option C: Connect brokerage (Plaid, stretch goal)
  → Portfolio Parsed & Confirmed
      Show list of holdings with current prices
      User confirms / edits
  → Guided First Chat ("Where do you want to start?")
      AI presents 3-4 tappable options:
        🔍 "I want to understand what I actually own"
        📰 "Something happened in the news and I'm nervous"
        📊 "I don't understand if my stocks are doing well"
        🤷 "I don't even know what to ask — just help me"
      Each option routes to a different opening conversation
      that feels immediately relevant to the user's mindset.
  → User enters the Chat (main experience)
```

**Why the guided first chat matters (lesson from Cleo):** Cleo's onboarding ends with the AI asking "where do you want to start?" with options like controlling spending, building credit, etc. This reduces the blank-page anxiety that kills beginner engagement. A user who just uploaded 8 stocks they barely understand doesn't know what to type. Giving them a choice of entry points — especially emotional ones like "I'm nervous about the news" — meets them where they are instead of requiring them to articulate a financial question they don't know how to ask yet.

### 5.2 Core Loop (Returning user)

```
Open App
  → Landing: Chat (last conversation continues)
  → Sidebar/Tab: Portfolio Overview
      Each holding shows learning progress ring (0-100%)
      Color-coded: Red (< 25%), Yellow (25-75%), Green (> 75%)
  → User taps a stock or asks a question in chat
  → AI teaches about that dimension
  → Progress auto-updates as topics are explored
  → User sees their overall "Investment Literacy Score" grow
```

### 5.3 Deep Dive Flow (Per-stock learning)

```
User selects AAPL from portfolio
  → Stock Learning Dashboard
      Progress wheel showing 6 dimensions:
        1. Business Model — "How does this company make money?"
        2. Financials — "Is the company financially healthy?"
        3. Competitive Position — "What's their moat?"
        4. Risks — "What could go wrong?"
        5. News & Catalysts — "What's happening right now?"
        6. Valuation Context — "Is the price reasonable?"
      Each dimension: 0-100% based on chat interactions
  → Tap any dimension → Opens guided chat thread
      AI asks probing questions, surfaces data, explains concepts
      Example (Business Model):
        "Apple has 5 major revenue segments. The biggest might
         surprise you. Want me to break down where their money
         actually comes from?"
  → User explores, asks follow-ups
  → Dimension progress updates in real-time
```

### 5.4 News & Events Flow

```
User opens News tab (or asks "what's happening with TSLA?")
  → AI pulls recent news for that holding
  → Presents in educational context:
      "Tesla reported Q1 earnings yesterday. Here's what
       the key numbers mean and what analysts are debating..."
  → Links to learning dimensions:
      "This relates to their Financials dimension. Want to
       dig into what revenue growth means for a company like Tesla?"
  → Reading news updates News & Catalysts progress
```

### 5.5 Portfolio-Wide Learning

```
User asks "How diversified am I?"
  → AI shows sector breakdown (not advice, just facts)
      "Here's what your portfolio looks like by sector:
       40% Tech, 25% Healthcare, 20% Finance, 15% Energy.
       Diversification is a concept where... [teaches]"
  → User asks "Is that bad?"
  → AI redirects educationally:
      "I can't tell you if it's good or bad for you — that
       depends on your goals and risk tolerance, which are
       personal. But I can explain what concentration risk
       means and how to think about it. Want me to?"
```

---

## 6. Information Architecture

### 6.1 App Structure (Two primary tabs)

```
┌──────────────────────────────────────────┐
│  ADAMSMYTH                          [⚙️]  │
├──────────────────────────────────────────┤
│                                          │
│              [MAIN CONTENT]              │
│                                          │
│                                          │
├──────────────────────────────────────────┤
│     💬 Chat        📊 Progress           │
└──────────────────────────────────────────┘
```

**Tab 1: Chat (default, 70% of usage)**
- Persistent conversation with AI learning assistant
- Context-aware: knows the user's portfolio
- Can pull up stock data, news, financials inline
- Renders charts, tables, and explanations within the chat
- Suggested prompts for new users

**Tab 2: Progress (30% of usage)**
- Portfolio overview with learning progress per stock
- Overall "Investment Literacy Score"
- Per-stock dimension breakdown
- "What you've learned" journal (AI-generated summaries of key takeaways)
- Streak/consistency tracker ("You've learned about your portfolio 5 days in a row")

### 6.2 Screen Inventory

| Screen | Description |
|---|---|
| Landing/Marketing | Value prop, sign-up CTA |
| Auth | Sign up / Sign in |
| Portfolio Upload | CSV upload, manual entry, or brokerage connect |
| Portfolio Confirm | Review parsed holdings, edit, confirm |
| Chat (Main) | Conversational AI interface with portfolio context |
| Chat — Stock Context | Chat with a specific stock selected as focus |
| Progress — Overview | All holdings with progress rings |
| Progress — Stock Detail | Single stock, 6 dimensions, detailed progress |
| Progress — Journal | AI-generated learning summaries |
| Settings | Account, portfolio management, notification prefs |
| Portfolio Edit | Add/remove holdings, re-upload |

### 6.3 Chat UI Patterns

The chat is not a basic text-in/text-out. It renders rich inline content:

- **Data cards**: When discussing a stock, show a compact card with price, key metrics
- **Mini charts**: Inline revenue trend, margin chart, etc.
- **Comparison tables**: When user asks about two holdings
- **Learning checkpoints**: "Quick check — based on what we just covered, what do you think Apple's biggest revenue driver is?" (interactive, not graded)
- **Progress nudges**: "You've now explored 3 of 6 dimensions for AAPL. Nice work."
- **Suggested follow-ups**: Chips/buttons for logical next questions
- **News cards**: Headline, source, date, with AI summary beneath
- **Disclaimer footer**: Subtle but persistent "Educational content only. Not financial advice."

---

## 7. The Learning Framework (6 Dimensions)

Each holding is evaluated across 6 learning dimensions. Progress in each dimension is tracked by the AI based on what topics the user has explored in chat.

### Dimension 1: Business Model (Weight: 20%)
What gets tracked:
- User has learned what the company does
- User understands revenue segments
- User knows the core products/services
- User understands the customer base
- User knows the business model type (subscription, advertising, hardware, etc.)

### Dimension 2: Financials (Weight: 20%)
What gets tracked:
- Revenue and revenue growth
- Profitability (margins, net income)
- Balance sheet health (debt, cash)
- Cash flow basics
- Key financial ratios (P/E, P/S explained in context)

### Dimension 3: Competitive Position (Weight: 15%)
What gets tracked:
- Who the main competitors are
- What differentiates this company
- Market share context
- Moat concept (brand, network effects, switching costs, etc.)

### Dimension 4: Risks (Weight: 15%)
What gets tracked:
- Key risk factors (regulatory, competitive, technological)
- Historical challenges
- Dependency risks (single product, single market)
- Macro risks (interest rates, geopolitics as they apply)

### Dimension 5: News & Catalysts (Weight: 15%)
What gets tracked:
- User has reviewed recent earnings
- User understands upcoming catalysts
- User has read recent significant news
- User understands analyst sentiment (what people are debating)

### Dimension 6: Valuation Context (Weight: 15%)
What gets tracked:
- User understands what P/E ratio means (in context)
- User has seen how the stock's valuation compares to peers
- User understands historical valuation range
- User knows the difference between "expensive" and "overvalued"

**Progress calculation:** Each dimension has 4-5 sub-topics. When the AI determines (via chat analysis) that the user has engaged meaningfully with a sub-topic, it marks it complete. Dimension progress = completed sub-topics / total sub-topics. Overall stock progress = weighted average of all 6 dimensions.

---

## 8. AI Behavior Specification

### 8.1 Personality

**The voice is the product.** (Lesson from Cleo: their snarky, Gen-Z persona is cited in nearly every review as the reason people keep using it. Tone does the heavy lifting for engagement in finance apps because the subject matter is inherently dry and anxiety-inducing.)

Adamsmyth's AI persona: **"The patient, curious mentor."** Not a snarky friend (that's Cleo's lane), not a dry textbook, not a corporate advisor. Think: the person at a dinner party who works in finance and actually makes it interesting when they explain things — no jargon, no condescension, genuine enthusiasm for helping someone understand.

Core voice traits:
- **Warm and encouraging** — never makes the user feel dumb for not knowing something. "Great question — this trips up a lot of people" rather than just answering.
- **Curious and Socratic** — asks follow-up questions to deepen understanding rather than lecturing. "Now that you know Apple makes most of its money from services, what do you think happens to their revenue if iPhone sales slow down?"
- **Analogy-driven** — translates financial concepts into everyday language. "Think of a P/E ratio like the price-per-square-foot of a house — it helps you compare whether something is relatively cheap or expensive."
- **Celebratory without being patronizing** — marks progress naturally. "That's 3 out of 6 dimensions covered for Tesla. You know more about this company than most people who own it."
- **Honest about uncertainty** — "Analysts are split on this one — some think..." rather than presenting one view as truth.

What the voice is NOT:
- Not snarky or roasting (that's Cleo — different audience, different anxiety)
- Not formal or corporate (that's a Bloomberg terminal)
- Not preachy or moralizing ("you should have researched before buying...")
- Not overly enthusiastic with emojis (professional warmth, not hype)

### 8.2 Guardrails (Non-negotiable)

**NEVER do:**
- Recommend buying, selling, or holding any security
- Provide price targets or fair value estimates
- Suggest portfolio allocation percentages
- Time the market ("now is a good time to...")
- Compare the user's portfolio to benchmarks with implicit judgment
- Say "you should" regarding any financial action

**ALWAYS do:**
- Redirect advice-seeking questions to education
- Frame everything as "here's how to think about this" not "here's what to do"
- Include factual sources for data claims
- Acknowledge uncertainty ("analysts disagree on this...")
- Remind users to consult a financial advisor for personalized advice (when appropriate, not every message)

### 8.3 Response framework

When a user asks about a stock or concept, the AI follows this internal framework:

```
1. ACKNOWLEDGE — Show you understand the question
2. CONTEXTUALIZE — Connect it to their portfolio ("Since you hold AAPL...")
3. EDUCATE — Explain the concept or surface the data
4. PROBE — Ask a follow-up to deepen understanding
5. CONNECT — Link to related dimensions they haven't explored
```

### 8.4 Progress tracking logic

The AI maintains an internal understanding of what topics have been covered per stock. After each meaningful exchange, it updates the progress state. The criteria for "meaningful engagement" (not just mentioned, but actually discussed):

- User asked a question about the topic AND received an explanation
- User answered a comprehension check correctly
- User engaged in at least 2 back-and-forth exchanges about the topic
- AI summarized the topic and user acknowledged understanding

---

## 9. Technical Architecture Recommendation

### 9.1 Why not the current stack

The current app appears to be a client-rendered SPA with pre-curated content. The rework requires real-time AI chat, dynamic data retrieval, portfolio state management, and progress tracking — a fundamentally different architecture.

### 9.2 Recommended Stack

#### Frontend
**Next.js 14+ (App Router) with TypeScript**
- Why: Server components for fast initial load, API routes for backend logic, excellent DX, Vercel deployment, great mobile-responsive story
- UI: Tailwind CSS + shadcn/ui for consistent, accessible components
- Chat UI: Build on `ai` SDK from Vercel (designed for streaming LLM responses)
- State: Zustand for client state (portfolio, UI), server state via React Query

#### Backend / API
**Next.js API Routes + separate Python service for AI orchestration**
- Next.js API routes handle: auth, portfolio CRUD, progress tracking, user management
- Python service handles: AI orchestration, data retrieval, embedding/RAG pipeline
- Why split: Python has the best AI/ML ecosystem (LangChain/LlamaIndex, data libraries). Next.js API routes handle everything else efficiently.

#### AI Layer
**Orchestration approach: Structured single-agent with tool use (not multi-agent)**

Why NOT multi-agent:
- Multi-agent adds latency (agents calling agents), complexity, and debugging difficulty
- For this use case, a single well-prompted agent with tools is sufficient and more reliable
- Multi-agent makes sense when agents need to disagree or negotiate — not applicable here

Why NOT pure RAG:
- RAG alone is too passive. The app needs the AI to proactively guide, ask questions, and track progress — not just answer queries from a document store
- However, RAG is a component of the solution (for news retrieval, financial data context)

**Recommended: Single LLM agent with structured tool calling**

```
┌─────────────────────────────────────────────┐
│                 AI AGENT                     │
│          (Claude / GPT-4 via API)            │
│                                              │
│  System Prompt:                              │
│  - Persona & guardrails                      │
│  - User's portfolio context                  │
│  - Current progress state per stock          │
│  - Learning framework (6 dimensions)         │
│                                              │
│  Tools available to the agent:               │
│  ┌──────────────┐  ┌──────────────────┐     │
│  │ get_stock_   │  │ get_financials   │     │
│  │ profile      │  │ (revenue, P/E..) │     │
│  ├──────────────┤  ├──────────────────┤     │
│  │ get_news     │  │ get_competitors  │     │
│  │ (recent      │  │ (peer list &     │     │
│  │  articles)   │  │  comparison)     │     │
│  ├──────────────┤  ├──────────────────┤     │
│  │ update_      │  │ get_learning_    │     │
│  │ progress     │  │ progress         │     │
│  │ (dimension,  │  │ (what user has   │     │
│  │  sub-topic)  │  │  already covered)│     │
│  ├──────────────┤  ├──────────────────┤     │
│  │ get_earnings │  │ search_knowledge │     │
│  │ (quarterly   │  │ (RAG over        │     │
│  │  reports)    │  │  educational     │     │
│  └──────────────┘  │  content)        │     │
│                    └──────────────────┘     │
└─────────────────────────────────────────────┘
```

The agent decides which tools to call based on the conversation. When a user asks "How does Apple make money?", the agent calls `get_stock_profile` and `get_financials`, then explains revenue segments, then calls `update_progress` to mark Business Model sub-topics as explored.

#### Data Sources
- **Stock data**: Financial Modeling Prep API or Alpha Vantage (free tier available, good coverage)
- **News**: NewsAPI, Finnhub, or Alpha Vantage news endpoints
- **Earnings/Fundamentals**: Financial Modeling Prep or Polygon.io
- **Educational content**: Curated knowledge base (RAG) with Investopedia-style explanations written for beginners, stored in a vector DB

#### Database
**Supabase (PostgreSQL + Auth + Realtime)**
- Why: Managed Postgres, built-in auth (Google, email), row-level security, real-time subscriptions (for live progress updates), generous free tier
- Tables: users, portfolios, holdings, chat_messages, learning_progress, learning_journal

#### Vector Database (for RAG component)
**Pinecone or Supabase pgvector**
- Stores embeddings of: educational content, financial concepts, stock-specific context
- Used by the `search_knowledge` tool when the AI needs to explain a concept

#### Hosting
- **Frontend + API**: Vercel (natural for Next.js)
- **Python AI service**: Railway, Render, or AWS Lambda (for the AI orchestration layer)
- **Database**: Supabase Cloud

### 9.3 Data Model (Core Tables)

```sql
-- Users
users (
  id UUID PK,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMP,
  onboarding_completed BOOLEAN
)

-- Portfolio
portfolios (
  id UUID PK,
  user_id UUID FK → users,
  name TEXT DEFAULT 'My Portfolio',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Holdings
holdings (
  id UUID PK,
  portfolio_id UUID FK → portfolios,
  ticker TEXT NOT NULL,
  company_name TEXT,
  shares DECIMAL,
  avg_cost_basis DECIMAL,
  added_at TIMESTAMP
)

-- Learning Progress
learning_progress (
  id UUID PK,
  user_id UUID FK → users,
  ticker TEXT NOT NULL,
  dimension TEXT NOT NULL,  -- 'business_model', 'financials', etc.
  sub_topic TEXT NOT NULL,  -- 'revenue_segments', 'customer_base', etc.
  status TEXT DEFAULT 'not_started',  -- 'not_started', 'in_progress', 'completed'
  completed_at TIMESTAMP,
  evidence TEXT  -- brief note on what the user demonstrated understanding of
)

-- Chat Messages
chat_messages (
  id UUID PK,
  user_id UUID FK → users,
  thread_id UUID,  -- groups messages into conversations
  ticker TEXT,  -- optional: which stock this message relates to
  role TEXT,  -- 'user' or 'assistant'
  content TEXT,
  metadata JSONB,  -- tool calls, progress updates, etc.
  created_at TIMESTAMP
)

-- Learning Journal
learning_journal (
  id UUID PK,
  user_id UUID FK → users,
  ticker TEXT,
  dimension TEXT,
  summary TEXT,  -- AI-generated summary of what user learned
  key_takeaway TEXT,
  created_at TIMESTAMP
)
```

### 9.4 Architecture Diagram

```
┌─────────────┐     ┌──────────────────────┐     ┌─────────────┐
│   Browser    │────▶│  Next.js on Vercel    │────▶│  Supabase   │
│   (React)    │◀────│  (App Router + API)   │◀────│  (Postgres  │
│              │     │                        │     │   + Auth)   │
│  - Chat UI   │     │  - Auth middleware     │     └─────────────┘
│  - Progress  │     │  - Portfolio CRUD      │
│  - Portfolio  │     │  - Progress API       │     ┌─────────────┐
│    upload    │     │  - Chat streaming      │────▶│  Python AI  │
└─────────────┘     │    proxy               │◀────│  Service    │
                    └──────────────────────────┘     │             │
                                                     │  - LLM API  │
                    ┌──────────────────────┐         │  - Tool     │
                    │  External APIs        │◀────────│    calls    │
                    │  - Financial Modeling  │         │  - RAG      │
                    │    Prep               │         │  - Progress │
                    │  - NewsAPI            │         │    updater  │
                    │  - Alpha Vantage      │         └─────────────┘
                    └──────────────────────┘               │
                                                     ┌─────────────┐
                                                     │  Pinecone / │
                                                     │  pgvector   │
                                                     │  (Knowledge │
                                                     │   base)     │
                                                     └─────────────┘
```

---

## 10. Phased Build Plan

### Phase 1: Foundation (Weeks 1-3)
**Goal: User can sign up, upload portfolio, and chat with AI about their holdings.**

Deliverables:
- Next.js project scaffold with Tailwind + shadcn/ui
- Supabase project: auth (email + Google), users table, portfolios table, holdings table
- Portfolio upload flow: manual ticker entry (CSV upload comes in Phase 2)
- Basic chat interface using Vercel AI SDK
- AI agent with system prompt (persona, guardrails, portfolio context)
- 2 working tools: `get_stock_profile`, `get_financials`
- Mobile-responsive layout with 2-tab structure (Chat / Progress stub)
- Deployment to Vercel

**Exit criteria:** A user can sign up, add 3 stocks manually, and have a meaningful educational conversation about any of them.

### Phase 2: Learning Engine (Weeks 4-6)
**Goal: Progress tracking works. The AI updates learning progress based on conversations.**

Deliverables:
- Learning progress data model and API
- `update_progress` and `get_learning_progress` tools for the AI agent
- Progress tab UI: per-stock progress rings, dimension breakdown
- AI prompt engineering for progress detection (when has a topic been "learned"?)
- Overall Investment Literacy Score calculation
- Learning journal: AI-generated summaries after each session
- CSV portfolio upload parser
- `get_news` and `get_competitors` tools

**Exit criteria:** After a 10-minute conversation about AAPL, the progress rings show meaningful, accurate progress across relevant dimensions.

### Phase 3: Rich Chat & Engagement (Weeks 7-9)
**Goal: Chat feels polished. Rich content, suggested prompts, learning checkpoints.**

Deliverables:
- Inline data cards in chat (stock cards, mini charts)
- Comparison tables when discussing multiple holdings
- Learning checkpoints (comprehension questions embedded in chat)
- Suggested follow-up chips after each AI response
- "What should I learn next?" smart recommendation
- News cards with AI summaries
- Streak/consistency tracking ("5-day learning streak!")
- Push notification opt-in ("AAPL earnings are tomorrow — want to prepare?")

**Exit criteria:** A new user can go from 0% to 50% progress on a single stock through a natural, engaging conversation with rich inline content.

### Phase 4: Knowledge Base & RAG (Weeks 10-12)
**Goal: AI has deep educational content to draw from, not just raw data.**

Deliverables:
- Curated knowledge base: 50+ educational articles on investing concepts (written for beginners)
- Vector embedding pipeline (content → embeddings → Pinecone/pgvector)
- `search_knowledge` RAG tool for the AI agent
- Concept explanations are accurate, beginner-friendly, and contextual
- Earnings report analysis tool (`get_earnings`)
- Valuation context tool (peer comparison data)
- Educational content covers all 6 dimensions thoroughly

**Exit criteria:** When a user asks "What is P/E ratio?", the AI explains it using their actual holding's P/E as the example, drawing from the knowledge base.

### Phase 5: Polish & Scale (Weeks 13-16)
**Goal: Production-ready, performant, delightful.**

Deliverables:
- Brokerage connection via Plaid (stretch)
- Portfolio performance overlay (factual, not advisory)
- Onboarding tutorial / guided first experience
- Rate limiting, error handling, edge cases
- Analytics (Mixpanel/PostHog): track engagement, dimension completion rates
- Landing page / marketing site
- Performance optimization (chat latency, data caching)
- SEO for landing pages
- User feedback mechanism

**Exit criteria:** 10 beta users complete onboarding and achieve 25%+ progress on at least one holding within their first week.

---

## 11. Key Technical Decisions & Rationale

### Why single agent over multi-agent?
Multi-agent architectures (e.g., separate agents for news, financials, learning) add coordination overhead and latency. For this use case, a single well-prompted agent with access to multiple tools is simpler, faster, and easier to debug. The agent can call `get_news` and `get_financials` in the same turn — no need for separate agents to negotiate.

Consider migrating to multi-agent only if: the system prompt exceeds 10K tokens and the agent starts making errors due to context overload, or if you need specialized reasoning for specific domains (e.g., a dedicated earnings analysis agent).

### Why not MCP (Model Context Protocol)?
MCP is designed for connecting AI assistants to external tools and data sources in a standardized way. It's powerful for desktop AI assistants (like Claude Desktop) but adds unnecessary abstraction for a custom web app where you control both the AI layer and the tools. Direct tool calling via the LLM API (Claude's tool_use or OpenAI's function calling) gives you the same capability with less indirection and faster iteration.

Consider MCP if: you later want to make Adamsmyth's data/tools available to other AI assistants, or if you want users to bring their own AI assistant to interact with their Adamsmyth data.

### Why Supabase over Firebase/custom backend?
PostgreSQL gives you relational integrity (important for portfolio → holdings → progress relationships), and Supabase's auth, real-time, and row-level security cover 80% of the backend needs without writing custom infrastructure. The free tier is generous enough for MVP.

### Why separate Python service?
The AI orchestration layer benefits from Python's ecosystem: LangChain/LlamaIndex for RAG, pandas for data manipulation, and the best LLM client libraries. Keeping it separate from Next.js also means you can scale AI compute independently and swap LLM providers without touching the frontend.

---

## 12. Risk & Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| AI gives investment advice despite guardrails | Legal / regulatory | Multi-layer defense: system prompt + output classifier + disclaimer UI |
| Progress tracking feels inaccurate | User trust erosion | Conservative scoring — better to under-count than over-count. Let users manually mark topics. |
| Financial data APIs have rate limits / costs | Feature degradation | Cache aggressively (stock profiles change daily, not per-request). Use free tiers strategically. |
| Chat latency too high | Poor UX | Stream responses (Vercel AI SDK handles this). Pre-fetch portfolio data. Cache recent tool results. |
| Users have very large portfolios (50+ stocks) | Overwhelm | Cap at 25 holdings for v1. Suggest focusing on top 10 by position size. |
| Beginner users don't know what to ask | Low engagement | Proactive suggested prompts, guided first conversation, "learn about [stock]" one-tap CTA |

---

## 13. Competitive Landscape

| Product | What it does | How Adamsmyth differs |
|---|---|---|
| **Cleo** (meetcleo.com) | AI chat-first budgeting assistant. Connects to bank, tracks spending, automates savings, cash advances. Strong Gen-Z personality. | Same chat-first pattern, but Cleo manages your money *for* you (Autopilot), while Adamsmyth teaches you to *understand* your investments. Cleo creates dependency; we build competence. Their Money IQ is a weekly quiz game, not structured learning. |
| **Robinhood Learn** | Educational articles attached to a trading platform. | Static content, not personalized to your holdings. Articles exist to convert readers to traders. We have no trading motive — pure education. |
| **Investopedia** | Financial dictionary and educational articles. | Comprehensive but generic. Not connected to your portfolio. You have to know what to search for. Adamsmyth surfaces the right education at the right time for your specific stocks. |
| **Copilot Money** | AI-powered personal finance tracker. | Focused on spending/budgeting like Cleo, not investment education. |
| **Wealthfront / Betterment** | Robo-advisors that manage your portfolio. | They replace your judgment with algorithms. We strengthen your judgment through education. |
| **Stock Rover / Simply Wall St** | Visual stock analysis tools. | Built for intermediate/advanced investors. Data-heavy, no conversational learning, no progress tracking. Overwhelming for beginners. |

**Key insight from Cleo:** The fintech industry has proven that chat-first, personality-driven AI can make finance accessible to young users. But nobody has applied this pattern to investment *education* with structured progress tracking. That's the gap.

---

## 14. Success Metrics

**North Star Metric:** Average learning progress across active users' portfolios (target: 40% within 30 days)

Supporting metrics:
- Onboarding completion rate (portfolio uploaded): Target 60%
- Messages sent per session: Target 8+
- Return rate (day 7): Target 30%
- Dimensions explored per stock (average): Target 3 of 6
- Learning journal entries generated: Target 2+ per user per week
- NPS score: Target 50+

---

## 14. Open Questions for Resolution

1. **LLM provider**: Claude (Anthropic) vs GPT-4 (OpenAI)? Claude has better instruction following and safety guardrails. GPT-4 has broader tool use ecosystem. Recommend Claude for the stronger guardrails given the regulatory sensitivity.

2. **Mobile app vs responsive web?** Recommend responsive web for v1 (faster to build, no app store review). Consider React Native wrapper (Capacitor) for v2 if engagement warrants it.

3. **Freemium model?** Consider: free tier (3 stocks, basic chat), paid tier ($9.99/mo: unlimited stocks, advanced analytics, news tracking). Defer monetization decision until post-beta engagement data.

4. **Content moderation**: Should user messages be logged and reviewed? Yes, for safety — but with clear privacy policy. Anonymize for any analysis.

5. **Offline support**: Not for v1. Chat requires real-time AI. Progress and journal can be cached for offline viewing in a future version.
