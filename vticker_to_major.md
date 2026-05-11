# Adamsmyth 2.0 — From Per-Ticker to Per-Topic

> **What's wrong now:** Learning is organized by stock ticker. You tap AAPL, do a lesson about Apple. Tap MSFT, do a lesson about Microsoft. This has two problems: (1) You don't learn *investing* — you learn trivia about one company. (2) A user with 2 stocks gets 2 courses. A user with 10 gets 10. Neither feels right.
>
> **The shift:** Organize learning by **knowledge topics** — the concepts every investor needs to understand. But make them alive: every concept is taught using the user's actual holdings and tied to current news. You're not learning "what is P/E ratio" in the abstract — you're learning it through YOUR Apple stock's actual P/E of 28.5 while the market average is 21.
>
> **Inspiration:** Bloom (YC-backed investing education app) does 300+ bite-sized lessons organized by topic, not by ticker. Duolingo organizes by skill (greetings, food, travel), not by individual word. The curriculum IS the product.

---

## The Two Tabs

| Tab | What it does | Icon |
|-----|-------------|------|
| **Learn** | Topic-based lessons. The curriculum. The main event. | BookOpen |
| **My Portfolio** | Upload stocks, see what you own, portfolio health. The context. | PieChart |

**Learn is the primary tab.** It's where users spend their time. My Portfolio is where they set up their holdings — which then power the lessons.

---

## The Topic Curriculum

Research from Vanguard, Fidelity, Bloom, and financial literacy standards (CEE National Standards, Ohio model curriculum) converges on a natural learning order. Here's our version, designed to go from "I just bought my first stock" to "I can evaluate any investment":

### Unit 1: "What Did I Just Buy?" (Week 1–2)
*Goal: Go from "I own shares of Apple" to "I understand what owning a stock means"*

| # | Lesson | What You'll Know After | Tied to Your Portfolio |
|---|--------|----------------------|----------------------|
| 1.1 | What is a stock, really? | A stock = a tiny slice of a real business | "You own {shares} shares of {company}. That means..." |
| 1.2 | How does {company} make money? | Business model, revenue segments | Uses get_stock_profile for user's actual #1 holding |
| 1.3 | What moves a stock price? | Supply & demand, news, earnings | Shows recent price movement of their holdings |
| 1.4 | The stock market is not a casino | Long-term returns, volatility is normal | Historical data on their specific stocks |

### Unit 2: "Reading the Scoreboard" (Week 3–4)
*Goal: Financial numbers stop being meaningless. You can look at a stock page and understand the basics.*

| # | Lesson | What You'll Know After | Tied to Your Portfolio |
|---|--------|----------------------|----------------------|
| 2.1 | Revenue & profit — the two numbers that matter | Revenue vs net income, why the difference matters | "{company} made ${revenue}B last year but only kept ${net_income}B" |
| 2.2 | Is this stock expensive? (P/E ratio) | What P/E means, when high/low matters | "Your {ticker}'s P/E is {pe}. The industry average is {avg}." |
| 2.3 | Growth vs value — two flavors of stocks | Growth stocks vs value stocks, which you own | Categorizes their holdings as growth or value |
| 2.4 | Market cap — the size of the company | Large/mid/small cap, why it matters | Shows their holdings by market cap tier |

### Unit 3: "Following the Conversation" (Week 5–6)
*Goal: Financial headlines start making sense. You can read an article about your stock and understand the "so what."*

| # | Lesson | What You'll Know After | Tied to Your Portfolio |
|---|--------|----------------------|----------------------|
| 3.1 | What is an earnings report? | Quarterly earnings, beats/misses, guidance | Uses get_news to find latest earnings news for their stocks |
| 3.2 | Why do stocks drop on good news? | Expectations vs reality, "priced in" | Real examples from their stocks' recent news |
| 3.3 | What analysts say (and why to be skeptical) | Analyst ratings, price targets, consensus | Analyst sentiment on their holdings |
| 3.4 | Headlines that matter vs noise | Material vs immaterial news, how to filter | Recent news for their stocks sorted by significance |

### Unit 4: "Knowing the Neighborhood" (Week 7–8)
*Goal: You see your stocks in context — competitors, industry, risks.*

| # | Lesson | What You'll Know After | Tied to Your Portfolio |
|---|--------|----------------------|----------------------|
| 4.1 | Who are the competitors? | Competitive landscape, market share | Uses get_competitors for their actual holdings |
| 4.2 | What's a moat? | Competitive advantages, durability | Identifies moats in companies they own |
| 4.3 | Every stock has risks | Key risk factors, concentration risk | Risk factors for their specific stocks |
| 4.4 | Diversification — why it matters | Don't put all eggs in one basket | Analyzes their portfolio's sector concentration |

### Unit 5: "Thinking For Yourself" (Week 9–10)
*Goal: You can form your own view on a stock and articulate why you own it.*

| # | Lesson | What You'll Know After | Tied to Your Portfolio |
|---|--------|----------------------|----------------------|
| 5.1 | Bull case vs bear case | How to think about both sides | AI generates bull/bear for one of their stocks |
| 5.2 | When to worry (and when not to) | Red flags vs normal volatility | Checks their stocks against common red flags |
| 5.3 | What "doing your own research" actually means | A practical framework | Applies framework to one of their holdings |
| 5.4 | Writing your investment thesis | Why you own what you own | User articulates thesis for their top holding |

### Unit 6: "The Bigger Picture" (Week 11–12)
*Goal: You understand how the market works as a system, not just individual stocks.*

| # | Lesson | What You'll Know After | Tied to Your Portfolio |
|---|--------|----------------------|----------------------|
| 6.1 | Indices — the market's mood ring | S&P 500, NASDAQ, what "the market" means | How their stocks relate to major indices |
| 6.2 | What moves the whole market? | Interest rates, inflation, macro events | Current macro environment + their stock impact |
| 6.3 | ETFs and funds — the lazy investor's best friend | What ETFs are, why most people should use them | ETFs that contain stocks they already own |
| 6.4 | Building a real portfolio strategy | Asset allocation, rebalancing, time horizon | Analyzes their current portfolio composition |

---

## How Lessons Work (Unchanged Mechanic, New Content)

The existing lesson player stays. Each lesson is still:
```
Intro Screen → [Teach Card → Quiz Card] × 4 → Completion Screen
```

**What changes:** The lesson generation API prompt. Instead of "generate a lesson about AAPL's business model," it becomes "generate a lesson about P/E ratios using the user's actual holdings as examples."

Every lesson:
- **Teaches a concept** (not a company)
- **Uses the user's actual stocks as examples** (not hypotheticals)
- **References current data** (real P/E ratios, real revenue, real news)
- **Tests with multiple choice** tied to their specific holdings

---

## Architecture Changes

```
BEFORE:                              AFTER:
─────────                            ──────

Tab 1: Learn                         Tab 1: Learn
├── Stock Grid (AAPL, MSFT...)       ├── Topic Curriculum (6 units, 24 lessons)
├── Tap stock → 5 levels             ├── Each lesson = teach/quiz cards
└── Each level = lesson              └── Content uses YOUR stocks as examples

Tab 2: Progress                      Tab 2: My Portfolio
├── Literacy Score                   ├── Your Holdings (upload/manage)
├── Streak Badge                     ├── Portfolio Overview (sector breakdown, etc.)
└── Per-stock dimension bars         └── Streak + Learning Progress summary
```

---

## Step-by-Step Build Plan

### Step 0: Restructure bottom nav and tab views

**Prompt:**
```
Update the app's navigation to reflect the new 2-tab structure:

1. /src/components/bottom-nav.tsx:
   - Change the tabs array to:
     [
       { href: "/learn", label: "Learn", icon: BookOpen },
       { href: "/portfolio", label: "My Portfolio", icon: PieChart }
     ]
   - Import PieChart from lucide-react (replace BarChart3)
   - Remove the BarChart3 import

2. /src/components/tab-views.tsx:
   - Replace PortfolioOverview import with a new MyPortfolio component (we'll create it in Step 5)
   - For now, use a placeholder: create an inline component that just renders <div className="flex-1 p-4"><p className="text-stone-400">My Portfolio — coming soon</p></div>
   - Change isProgress to isPortfolio, and update pathname check to "/portfolio"
   - Update isTabRoute accordingly

3. Create /src/app/(app)/portfolio/page.tsx:
   - Simple page that returns null (content from TabViews)

4. The /progress route still exists and the PortfolioOverview component still exists — don't delete them yet. Just disconnect from the nav. We might repurpose parts later.

5. Update any links that point to /progress to point to /portfolio instead. Check:
   - Any component with href="/progress"
   - The middleware if it references /progress
```

**Verify:** Bottom nav shows "Learn" + "My Portfolio". Both tabs load. Old Progress tab is disconnected but not deleted.
**Commit:** `git add . && git commit -m "feat: restructure nav to Learn + My Portfolio tabs"`

---

### Step 1: Rebuild the Learn home screen as a topic curriculum

Replace the stock-grid learn home with a topic-based curriculum view.

**Prompt:**
```
Completely rewrite /src/components/learn/learn-home.tsx.

This is now a topic-based curriculum browser, not a stock grid.

LAYOUT (scrollable, px-4 pt-4 pb-24):

1. HEADER:
   - Title: "Learn" (text-2xl font-bold text-stone-800)
   - Subtitle: "Investing concepts, taught with your stocks" (text-sm text-stone-500 mt-0.5)

2. STREAK BADGE:
   - Import and render StreakBadge from /src/components/progress/StreakBadge.tsx
   - mt-3

3. UNITS LIST (mt-5, the main content):
   - Each unit is a section with a header + lesson cards
   
   Define the curriculum data as a constant array:
   
   const CURRICULUM = [
     {
       unit: 1,
       title: "What Did I Just Buy?",
       subtitle: "Understand what owning a stock actually means",
       lessons: [
         { id: "1.1", title: "What is a stock, really?", slug: "what-is-a-stock" },
         { id: "1.2", title: "How does your company make money?", slug: "business-model" },
         { id: "1.3", title: "What moves a stock price?", slug: "price-movement" },
         { id: "1.4", title: "The stock market is not a casino", slug: "long-term-thinking" },
       ],
     },
     {
       unit: 2,
       title: "Reading the Scoreboard",
       subtitle: "Make sense of the numbers everyone talks about",
       lessons: [
         { id: "2.1", title: "Revenue & profit — the two numbers that matter", slug: "revenue-profit" },
         { id: "2.2", title: "Is this stock expensive? (P/E ratio)", slug: "pe-ratio" },
         { id: "2.3", title: "Growth vs value stocks", slug: "growth-vs-value" },
         { id: "2.4", title: "Market cap — the size of a company", slug: "market-cap" },
       ],
     },
     {
       unit: 3,
       title: "Following the Conversation",
       subtitle: "Headlines and earnings reports start making sense",
       lessons: [
         { id: "3.1", title: "What is an earnings report?", slug: "earnings-report" },
         { id: "3.2", title: "Why do stocks drop on good news?", slug: "priced-in" },
         { id: "3.3", title: "What analysts say (and why to be skeptical)", slug: "analyst-ratings" },
         { id: "3.4", title: "Headlines that matter vs noise", slug: "news-filtering" },
       ],
     },
     {
       unit: 4,
       title: "Knowing the Neighborhood",
       subtitle: "See your stocks in context — competitors, moats, risks",
       lessons: [
         { id: "4.1", title: "Who are the competitors?", slug: "competitors" },
         { id: "4.2", title: "What's a moat?", slug: "competitive-moat" },
         { id: "4.3", title: "Every stock has risks", slug: "risk-factors" },
         { id: "4.4", title: "Diversification — why it matters", slug: "diversification" },
       ],
     },
     {
       unit: 5,
       title: "Thinking For Yourself",
       subtitle: "Form your own view and know why you own what you own",
       lessons: [
         { id: "5.1", title: "Bull case vs bear case", slug: "bull-bear" },
         { id: "5.2", title: "When to worry (and when not to)", slug: "red-flags" },
         { id: "5.3", title: "What doing your research actually means", slug: "dyor-framework" },
         { id: "5.4", title: "Writing your investment thesis", slug: "investment-thesis" },
       ],
     },
     {
       unit: 6,
       title: "The Bigger Picture",
       subtitle: "How the market works as a system",
       lessons: [
         { id: "6.1", title: "Indices — the market's mood ring", slug: "indices" },
         { id: "6.2", title: "What moves the whole market?", slug: "macro-factors" },
         { id: "6.3", title: "ETFs — the lazy investor's best friend", slug: "etfs-intro" },
         { id: "6.4", title: "Building a real portfolio strategy", slug: "portfolio-strategy" },
       ],
     },
   ];

   On mount:
   - Fetch lesson completion data from GET /api/progress (we'll adapt this endpoint later — for now, the component should handle gracefully if the response shape doesn't match)
   - Determine which lessons are completed based on progress data
   - For now, use a simple local state or just mark everything as "not started" until we wire up the tracking

   UNIT HEADER rendering:
   - Unit number badge: inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold
   - Title: text-base font-bold text-stone-800 (next to badge)
   - Subtitle: text-xs text-stone-400 below title
   - Spacing between units: mt-6 (first unit mt-0)

   LESSON CARD rendering (stacked vertically within each unit, gap-2, mt-3):
   - Each lesson is a tappable row: flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 ring-1 ring-stone-200/60
   - Left: lesson number in a small circle (w-7 h-7 rounded-full bg-stone-100 text-stone-500 text-xs font-semibold flex items-center justify-center)
   - Center: lesson title (text-sm text-stone-700 flex-1)
   - Right: status indicator
     - Not started: ChevronRight icon (size-4 text-stone-300)
     - Completed: Check icon in green circle (w-5 h-5 rounded-full bg-emerald-100 text-emerald-600)
     - Locked: Lock icon (size-4 text-stone-300) — Units 2+ are locked until Unit 1 is complete (for now, just unlock everything so we can test)
   - Tap navigates to /learn/lesson/{slug}
   
   LOCKING LOGIC (implement later, comment it out for now):
   - Unit 1: always unlocked
   - Unit N: unlocked when all lessons in Unit N-1 are completed
   - Individual lessons within a unit: all unlocked once the unit is unlocked
   - For now: everything is unlocked (no locking). Add a TODO comment.

Keep under 180 lines. Use Tailwind only.
```

**Verify:** Learn tab shows 6 units with 4 lessons each. Clean, scrollable list. Tapping a lesson navigates to /learn/lesson/{slug} (will 404 until Step 3).
**Commit:** `git add . && git commit -m "feat: topic-based curriculum on learn home screen"`

---

### Step 2: Update the lesson generation API for topic-based lessons

The API currently takes `?ticker=AAPL&level=1`. It needs to take `?slug=pe-ratio` and fetch the user's holdings internally to use as teaching examples.

**Prompt:**
```
Rewrite /src/app/api/lessons/route.ts to support topic-based lessons.

The API now accepts: GET /api/lessons?slug={lesson-slug}

Changes:

1. Accept query param: slug (string) instead of ticker + level
2. Define a LESSON_CONFIG map that maps each slug to:
   - title: the lesson title
   - unit: which unit it belongs to (1-6)
   - topic_prompt: a description of what to teach (used in the AI prompt)
   - data_needed: which data to fetch — array of "profile" | "financials" | "news" | "competitors"
   - dimensions: which learning dimensions/sub-topics this lesson covers (for progress tracking)

Here's the config for all 24 lessons (put this in a separate file /src/lib/curriculum.ts and import it):

LESSON_CONFIG entries:
- "what-is-a-stock": { title: "What is a stock, really?", unit: 1, topic_prompt: "Explain what a stock is using the user's actual holdings as examples. Cover: ownership, shares, why companies go public.", data_needed: ["profile"], dimensions: [{ dimension: "business_model", sub_topic: "what_company_does" }] }
- "business-model": { title: "How does your company make money?", unit: 1, topic_prompt: "Explain how the user's top holding makes money. Cover: revenue segments, products/services, customer base.", data_needed: ["profile"], dimensions: [{ dimension: "business_model", sub_topic: "revenue_segments" }, { dimension: "business_model", sub_topic: "core_products" }] }
- "price-movement": { title: "What moves a stock price?", unit: 1, topic_prompt: "Explain supply and demand, how news/earnings affect price. Use recent events from the user's stocks.", data_needed: ["profile", "news"], dimensions: [{ dimension: "news_catalysts", sub_topic: "significant_news" }] }
- "long-term-thinking": { title: "The stock market is not a casino", unit: 1, topic_prompt: "Teach long-term investing mentality. Historical returns. Why volatility is normal, not dangerous.", data_needed: ["profile"], dimensions: [{ dimension: "risks", sub_topic: "macro_risks" }] }
- "revenue-profit": { title: "Revenue & profit", unit: 2, topic_prompt: "Explain revenue vs net income vs profit margins using the user's stocks' actual numbers.", data_needed: ["profile", "financials"], dimensions: [{ dimension: "financials", sub_topic: "revenue_growth" }, { dimension: "financials", sub_topic: "profitability" }] }
- "pe-ratio": { title: "Is this stock expensive?", unit: 2, topic_prompt: "Teach P/E ratio using the user's actual stocks' P/E. Compare to industry averages. When high P/E is ok vs not.", data_needed: ["profile", "financials"], dimensions: [{ dimension: "valuation_context", sub_topic: "pe_ratio_meaning" }] }
- "growth-vs-value": { title: "Growth vs value stocks", unit: 2, topic_prompt: "Explain growth vs value investing. Classify the user's stocks. Why some P/Es are high and that's fine.", data_needed: ["profile", "financials"], dimensions: [{ dimension: "valuation_context", sub_topic: "peer_comparison" }] }
- "market-cap": { title: "Market cap", unit: 2, topic_prompt: "Explain market cap and company size categories. Show where the user's stocks fall (large/mid/small cap).", data_needed: ["profile"], dimensions: [{ dimension: "business_model", sub_topic: "business_model_type" }] }
- "earnings-report": { title: "What is an earnings report?", unit: 3, topic_prompt: "Explain quarterly earnings, EPS, beats/misses, guidance. Use recent earnings news from user's stocks.", data_needed: ["news", "financials"], dimensions: [{ dimension: "news_catalysts", sub_topic: "recent_earnings" }] }
- "priced-in": { title: "Why do stocks drop on good news?", unit: 3, topic_prompt: "Teach 'priced in' concept, expectations vs reality. Use real examples from user's stocks' recent news.", data_needed: ["news", "profile"], dimensions: [{ dimension: "news_catalysts", sub_topic: "analyst_sentiment" }] }
- "analyst-ratings": { title: "What analysts say", unit: 3, topic_prompt: "Explain analyst ratings, price targets, consensus. Why to be skeptical. Show sentiment on user's stocks.", data_needed: ["profile", "news"], dimensions: [{ dimension: "news_catalysts", sub_topic: "analyst_sentiment" }] }
- "news-filtering": { title: "Headlines that matter vs noise", unit: 3, topic_prompt: "Teach how to filter material news from noise. Use real recent headlines from user's stocks.", data_needed: ["news"], dimensions: [{ dimension: "news_catalysts", sub_topic: "significant_news" }] }
- "competitors": { title: "Who are the competitors?", unit: 4, topic_prompt: "Show competitive landscape for user's top stock. Market share, key metrics comparison.", data_needed: ["profile", "competitors"], dimensions: [{ dimension: "competitive_position", sub_topic: "main_competitors" }, { dimension: "competitive_position", sub_topic: "market_share" }] }
- "competitive-moat": { title: "What's a moat?", unit: 4, topic_prompt: "Explain competitive advantages (brand, network effects, switching costs). Identify moats in user's stocks.", data_needed: ["profile", "competitors"], dimensions: [{ dimension: "competitive_position", sub_topic: "moat_concept" }, { dimension: "competitive_position", sub_topic: "differentiation" }] }
- "risk-factors": { title: "Every stock has risks", unit: 4, topic_prompt: "Cover key risks: company-specific, sector, macro. Show actual risk factors for user's stocks.", data_needed: ["profile", "financials"], dimensions: [{ dimension: "risks", sub_topic: "key_risk_factors" }, { dimension: "risks", sub_topic: "dependency_risks" }] }
- "diversification": { title: "Diversification", unit: 4, topic_prompt: "Teach diversification. Analyze user's portfolio sector concentration. Are they diversified or concentrated?", data_needed: ["profile"], dimensions: [{ dimension: "risks", sub_topic: "macro_risks" }] }
- "bull-bear": { title: "Bull case vs bear case", unit: 5, topic_prompt: "Teach how to think about both sides. Generate bull/bear case for user's top stock using real data.", data_needed: ["profile", "financials", "competitors", "news"], dimensions: [{ dimension: "valuation_context", sub_topic: "historical_valuation" }] }
- "red-flags": { title: "When to worry", unit: 5, topic_prompt: "Teach red flags vs normal volatility. Check user's stocks against common warning signs.", data_needed: ["financials", "news"], dimensions: [{ dimension: "risks", sub_topic: "historical_challenges" }] }
- "dyor-framework": { title: "Doing your own research", unit: 5, topic_prompt: "Provide a practical research framework. Walk through it using one of user's actual stocks.", data_needed: ["profile", "financials", "competitors", "news"], dimensions: [{ dimension: "business_model", sub_topic: "customer_base" }] }
- "investment-thesis": { title: "Writing your investment thesis", unit: 5, topic_prompt: "Teach how to articulate 'why I own this.' Help user form a thesis for their top holding.", data_needed: ["profile", "financials"], dimensions: [{ dimension: "valuation_context", sub_topic: "expensive_vs_overvalued" }] }
- "indices": { title: "Indices — the market's mood ring", unit: 6, topic_prompt: "Explain S&P 500, NASDAQ, Dow. Which indices contain user's stocks. What 'the market' means.", data_needed: ["profile"], dimensions: [{ dimension: "business_model", sub_topic: "business_model_type" }] }
- "macro-factors": { title: "What moves the whole market?", unit: 6, topic_prompt: "Interest rates, inflation, Fed decisions. How macro events affect user's specific stocks.", data_needed: ["profile", "news"], dimensions: [{ dimension: "risks", sub_topic: "macro_risks" }] }
- "etfs-intro": { title: "ETFs — the lazy investor's best friend", unit: 6, topic_prompt: "What ETFs are, expense ratios, active vs passive. ETFs that hold user's stocks.", data_needed: ["profile"], dimensions: [{ dimension: "business_model", sub_topic: "business_model_type" }] }
- "portfolio-strategy": { title: "Building a portfolio strategy", unit: 6, topic_prompt: "Asset allocation, rebalancing, time horizon. Analyze user's current portfolio composition.", data_needed: ["profile", "financials"], dimensions: [{ dimension: "valuation_context", sub_topic: "peer_comparison" }] }

3. The route logic:
   a. Authenticate user
   b. Look up slug in LESSON_CONFIG — return 400 if not found
   c. Fetch user's holdings from Supabase
   d. If no holdings, return a fallback lesson that teaches the concept abstractly (still useful)
   e. For each data type in data_needed, fetch data for the user's TOP 2 holdings (to keep context size reasonable):
      - "profile" → getStockProfile(ticker) for top 2
      - "financials" → getFinancials(ticker) for top 2
      - "news" → getNews(ticker, 3) for top 2
      - "competitors" → getCompetitors(ticker) for top 1
   f. Call Anthropic API with updated system prompt:

SYSTEM PROMPT:
"You are generating a bite-sized investment lesson. The lesson teaches a CONCEPT, not a company — but uses the user's actual stocks as live examples throughout.

LESSON: {title}
TEACHING GOAL: {topic_prompt}
USER'S HOLDINGS: {list of tickers and company names}

Generate a lesson as JSON with this exact structure:
{
  "lesson_title": "Short catchy title (under 8 words)",
  "lesson_intro": "1-2 casual sentences setting up what they'll learn. Mention their specific stocks by name to make it feel personalized.",
  "cards": [
    { "type": "teach", "content": "2-3 sentences explaining the concept using the user's actual stocks and real data as examples. Sound like a smart friend, not a textbook. If you use jargon, explain it immediately in parentheses.", "highlight": "The single key takeaway in under 10 words" },
    { "type": "quiz", "question": "A multiple-choice question testing the concept, using the user's actual stock data", "options": ["A", "B", "C", "D"], "correct_index": 0, "explanation": "Why this answer is correct, referencing their stocks", "dimension": "business_model", "sub_topic": "what_company_does" }
  ],
  "lesson_complete_message": "1 sentence celebrating. Mention something specific they now understand about their portfolio."
}

RULES:
- EXACTLY 8 cards: teach, quiz, teach, quiz, teach, quiz, teach, quiz
- Each quiz tests ONLY what the teach card before it explained
- Use REAL DATA from the context provided — actual numbers, real products, real competitors
- The concept is the star, their stocks are the supporting examples
- Wrong options must be plausible misconceptions
- NEVER give investment advice. Frame everything as understanding, not deciding.
- dimension and sub_topic must use valid IDs from: {list valid IDs}"

   g. Parse response, handle JSON extraction from code blocks, return result

4. Put the LESSON_CONFIG data in a new file /src/lib/curriculum.ts and export it. Also export the CURRICULUM array (for the learn-home UI) and a helper function getLessonConfig(slug).

Do NOT modify any other existing routes.
```

**Verify:** Hit GET /api/lessons?slug=pe-ratio while logged in. Returns a lesson about P/E ratios using your actual stock holdings as examples.
**Commit:** `git add . && git commit -m "feat: topic-based lesson generation API using portfolio as context"`

---

### Step 3: Create the topic lesson page route

**Prompt:**
```
Create /src/app/(app)/learn/lesson/[slug]/page.tsx:

- Dynamic route that receives params.slug
- Client component
- Import LessonPlayer from /src/components/learn/lesson-player
- But wait — LessonPlayer currently expects { ticker, level } props. We need to update it.

Update /src/components/learn/lesson-player.tsx:
- Change props from { ticker: string; level: number } to { slug: string }
- Change the fetch URL from /api/lessons?ticker={ticker}&level={level} to /api/lessons?slug={slug}
- On the completion screen, change "Back to {ticker}" button to "Continue Learning" and navigate to /learn
- In the top bar, remove the ticker reference
- When answering a quiz correctly, the progress update POST body should include the dimension and sub_topic from the quiz card (it already does this via card.dimension and card.sub_topic — verify this still works)
- Remove the old ticker/level logic entirely

The page.tsx should just render:
<LessonPlayer slug={params.slug} />

Also update /src/app/(app)/learn/[ticker]/page.tsx and /src/app/(app)/learn/[ticker]/level/[level]/page.tsx:
- These are the old per-ticker routes. Delete them (the StockLearningPath component is no longer used as a page).
- Keep the component files (stock-learning-path.tsx, etc.) for now — just remove the page routes.
```

**Verify:** Navigate to /learn/lesson/pe-ratio. Lesson loads with P/E content using your actual stocks. Complete the lesson → returns to /learn.
**Commit:** `git add . && git commit -m "feat: topic lesson page route + update lesson player for slug-based lessons"`

---

### Step 4: Track lesson completion properly

**Prompt:**
```
We need to track which lessons (by slug) the user has completed, separate from the existing per-ticker dimension progress.

1. Create a new Supabase table (or add to the migration plan — for now, just document the SQL):

CREATE TABLE IF NOT EXISTS lesson_completions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  lesson_slug text NOT NULL,
  completed_at timestamptz DEFAULT now(),
  score int, -- number of correct quiz answers
  total int, -- total quiz questions
  UNIQUE(user_id, lesson_slug)
);

ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own completions" ON lesson_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own completions" ON lesson_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own completions" ON lesson_completions FOR UPDATE USING (auth.uid() = user_id);

2. Create /src/app/api/lessons/complete/route.ts:
   - POST endpoint
   - Body: { slug: string, score: number, total: number }
   - Upsert into lesson_completions table
   - Also call the streak endpoint internally
   - Return { success: true }

3. Create /src/app/api/lessons/completions/route.ts:
   - GET endpoint
   - Returns all completed lesson slugs for the current user
   - Response: { completions: [{ lesson_slug: string, score: number, total: number, completed_at: string }] }

4. Update /src/components/learn/lesson-player.tsx:
   - On lesson completion (reaching the final screen), POST to /api/lessons/complete with { slug, score: correctCount, total: quizCards.length }
   - Fire and forget

5. Update /src/components/learn/learn-home.tsx:
   - On mount, also fetch GET /api/lessons/completions
   - Use the response to mark completed lessons with a green checkmark
   - Count completed lessons per unit to show unit progress
   - Add a small progress indicator on each unit header: e.g., "2/4 completed" in text-xs text-amber-600

Include the SQL as a comment at the top of the complete route file, with a note that it needs to be run in Supabase SQL editor.
```

**Verify:** Complete a lesson → refresh Learn tab → that lesson shows a green check. Unit header shows "1/4 completed."
**Commit:** `git add . && git commit -m "feat: lesson completion tracking with progress indicators"`

---

### Step 5: Build the My Portfolio tab

Replace the old Progress tab content with a portfolio management + overview screen.

**Prompt:**
```
Create /src/components/portfolio/my-portfolio.tsx:

This is the second tab — where users see and manage their holdings.

LAYOUT (scrollable, px-4 pt-4 pb-24):

1. HEADER:
   - "My Portfolio" (text-2xl font-bold text-stone-800)
   - "Your stocks power your lessons" (text-sm text-stone-500 mt-0.5)

2. STREAK + PROGRESS SUMMARY (mt-3):
   - Import and render StreakBadge
   - Below streak: a simple stats row (flex justify-between):
     - "X/24 lessons completed" (text-sm text-stone-600)
     - "X stocks tracked" (text-sm text-stone-600)
   - Fetch lesson completions from /api/lessons/completions to get the count

3. YOUR HOLDINGS (mt-5):
   - Section header: "Your Stocks" (text-base font-semibold text-stone-800) with an "Edit" button on the right (text-xs text-amber-600, navigates to /settings)
   - Fetch from GET /api/portfolio
   - If no holdings: show empty state with "Add your first stocks to unlock personalized lessons" and an "Add Stocks" button (→ /settings)
   - If holdings exist: render as a clean list (not a grid):
     Each holding row: flex items-center gap-3 py-3 border-b border-stone-100 last:border-0
     - Left: ticker in a rounded-lg bg-amber-50 text-amber-800 px-2.5 py-1 text-sm font-bold
     - Center: company name (text-sm text-stone-700)
     - Right: share count (text-xs text-stone-400) e.g. "10 shares"

4. PORTFOLIO INSIGHTS (mt-6, only if holdings exist):
   - Section header: "Portfolio Snapshot"
   - Simple cards showing basic portfolio info (fetch from /api/portfolio or compute client-side):
     a. Sector breakdown: if the portfolio API returns sector data, show as small colored pills. If not, skip this for now.
     b. Holdings count: "{n} companies" in a subtle card

5. BOTTOM: "Looking for your learning progress? It's on the Learn tab now" — text-xs text-stone-300 text-center mt-8

Now update /src/components/tab-views.tsx:
   - Replace the placeholder My Portfolio div with <MyPortfolio />
   - Import MyPortfolio from "@/components/portfolio/my-portfolio"

Keep under 150 lines. Tailwind only.
```

**Verify:** My Portfolio tab shows streak, holdings list, and edit button. Tapping Edit goes to settings. Holdings display with ticker badges.
**Commit:** `git add . && git commit -m "feat: My Portfolio tab with holdings list and progress summary"`

---

### Step 6: Clean up old per-ticker learning routes and components

**Prompt:**
```
Remove the old per-ticker learning UI that is no longer used:

1. Delete these route files:
   - /src/app/(app)/learn/[ticker]/page.tsx
   - /src/app/(app)/learn/[ticker]/level/[level]/page.tsx
   (They were replaced by /src/app/(app)/learn/lesson/[slug]/page.tsx in Step 3)

2. Delete these components (no longer imported anywhere):
   - /src/components/learn/stock-learning-path.tsx

3. Verify nothing else imports the deleted files:
   - grep for "stock-learning-path" in the codebase
   - grep for "learn/[ticker]" in any Link or router.push calls
   - If anything still references them, update those references

4. The learn-home.tsx no longer links to /learn/{ticker} — it links to /learn/lesson/{slug}. Verify this is the case.

5. Keep /src/components/learn/lesson-player.tsx (still used).

6. Check /src/app/api/lessons/route.ts — it should now only accept ?slug=, not ?ticker=&level=. If the old params handling is still there, remove it.
```

**Verify:** No broken imports. App builds clean. Learn → tap lesson → plays lesson → complete → back to Learn. Old /learn/AAPL routes 404 (expected and fine).
**Commit:** `git add . && git commit -m "chore: remove old per-ticker learning routes and components"`

---

### Step 7: End-to-end testing

Walk through manually. Do NOT paste as a prompt.

```
CRITICAL PATH TEST:

1. Open app → lands on Learn tab
   ✓ 6 units visible (24 lessons total)
   ✓ Unit headers show title + subtitle
   ✓ Lesson rows show number, title, and status (chevron = not started)
   ✓ Streak badge visible

2. Tap lesson "What is a stock, really?"
   ✓ Lesson loads (may take a few seconds for AI generation)
   ✓ Intro screen shows lesson title
   ✓ Start Lesson → teach card appears
   ✓ Content references YOUR actual stocks (not generic examples)
   ✓ Quiz questions use YOUR stock data
   ✓ Green/red feedback works on quiz answers
   ✓ Progress bar fills as you advance
   ✓ 8 cards total (4 teach + 4 quiz)

3. Complete the lesson
   ✓ Completion screen shows score
   ✓ Streak message appears
   ✓ "Continue Learning" returns to Learn tab

4. Back on Learn tab
   ✓ Completed lesson shows green check
   ✓ Unit header shows "1/4 completed"

5. Tap "My Portfolio" tab
   ✓ Shows streak badge
   ✓ Shows "X/24 lessons completed" stat
   ✓ Shows your holdings in a list
   ✓ Edit button navigates to settings

6. Settings
   ✓ Can add a new stock
   ✓ Can remove a stock
   ✓ Changes reflected when going back to My Portfolio

7. Do another lesson (e.g., "Is this stock expensive?")
   ✓ P/E ratio lesson uses your stocks' actual P/E
   ✓ Completion tracked, Learn tab updates

VERIFY NO CHAT ANYWHERE:
✓ No Chat tab
✓ No text input box anywhere
✓ No message bubbles
✓ /chat returns 404 or redirect

VERIFY PERSONALIZATION:
✓ Lessons reference YOUR stocks, not generic examples
✓ If you add a new stock and redo a lesson, the new stock might appear as an example
✓ Lessons feel different for different portfolios
```

---

## Summary

| Before (Per-Ticker) | After (Per-Topic) |
|---------------------|-------------------|
| Learning organized by stock (tap AAPL → learn about Apple) | Learning organized by concept (tap "P/E ratio" → learn using your stocks) |
| 2 stocks = 2 courses, 10 stocks = 10 courses | 24 lessons regardless of portfolio size |
| Each stock has 5 arbitrary levels | 6 units with clear progression (basics → advanced) |
| You learn company trivia | You learn investing concepts |
| Tab 2: "Progress" (dimension bars) | Tab 2: "My Portfolio" (manage holdings) |
| No clear curriculum | Structured 6-unit, 24-lesson curriculum |
| Content is stock-specific | Content is concept-first, personalized with your stocks |

## What's Preserved
- Lesson player UI (teach/quiz cards, animations)
- Financial data fetchers (get_stock_profile, get_financials, get_news, get_competitors)
- Streak system
- Onboarding flow
- Settings page (add/remove stocks)
- Learning dimensions + sub-topics (used for progress tracking)

## What's New
- /src/lib/curriculum.ts — the curriculum data (6 units, 24 lessons)
- /src/app/api/lessons/complete/route.ts — marks lessons as done
- /src/app/api/lessons/completions/route.ts — fetches completion data
- /src/components/portfolio/my-portfolio.tsx — the portfolio tab
- lesson_completions Supabase table
- Updated lesson API that takes ?slug= and teaches concepts using all holdings

## What's Deleted
- Per-ticker learning path (stock-learning-path.tsx)
- Per-ticker routes (/learn/[ticker], /learn/[ticker]/level/[level])
- Stock grid on learn home
- Old level-based lesson system

## Vibe Coding Rules
- One step at a time. 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7.
- Commit after each step.
- Clear AI context between steps.
- Run E2E test (Step 7) after Steps 1, 3, 5, and 6.
- If AI fails 3 times, break the step in half.
