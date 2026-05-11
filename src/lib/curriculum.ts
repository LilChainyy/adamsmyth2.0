export interface LessonDimension {
  dimension: string;
  sub_topic: string;
}

export type DataType = "profile" | "financials" | "news" | "competitors";

export interface LessonConfig {
  title: string;
  unit: number;
  topic_prompt: string;
  data_needed: DataType[];
  dimensions: LessonDimension[];
}

export interface CurriculumLesson {
  id: string;
  title: string;
  slug: string;
}

export interface CurriculumUnit {
  unit: number;
  title: string;
  subtitle: string;
  lessons: CurriculumLesson[];
}

export const CURRICULUM: CurriculumUnit[] = [
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
      { id: "5.3", title: 'What "doing your research" actually means', slug: "dyor-framework" },
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

const LESSON_CONFIG: Record<string, LessonConfig> = {
  "what-is-a-stock": { title: "What is a stock, really?", unit: 1, topic_prompt: "Explain what a stock is using the user's actual holdings as examples. Cover: ownership, shares, why companies go public.", data_needed: ["profile"], dimensions: [{ dimension: "business_model", sub_topic: "what_company_does" }] },
  "business-model": { title: "How does your company make money?", unit: 1, topic_prompt: "Explain how the user's top holding makes money. Cover: revenue segments, products/services, customer base.", data_needed: ["profile"], dimensions: [{ dimension: "business_model", sub_topic: "revenue_segments" }, { dimension: "business_model", sub_topic: "core_products" }] },
  "price-movement": { title: "What moves a stock price?", unit: 1, topic_prompt: "Explain supply and demand, how news/earnings affect price. Use recent events from the user's stocks.", data_needed: ["profile", "news"], dimensions: [{ dimension: "news_catalysts", sub_topic: "significant_news" }] },
  "long-term-thinking": { title: "The stock market is not a casino", unit: 1, topic_prompt: "Teach long-term investing mentality. Historical returns. Why volatility is normal, not dangerous.", data_needed: ["profile"], dimensions: [{ dimension: "risks", sub_topic: "macro_risks" }] },
  "revenue-profit": { title: "Revenue & profit", unit: 2, topic_prompt: "Explain revenue vs net income vs profit margins using the user's stocks' actual numbers.", data_needed: ["profile", "financials"], dimensions: [{ dimension: "financials", sub_topic: "revenue_growth" }, { dimension: "financials", sub_topic: "profitability" }] },
  "pe-ratio": { title: "Is this stock expensive?", unit: 2, topic_prompt: "Teach P/E ratio using the user's actual stocks' P/E. Compare to industry averages. When high P/E is ok vs not.", data_needed: ["profile", "financials"], dimensions: [{ dimension: "valuation_context", sub_topic: "pe_ratio_meaning" }] },
  "growth-vs-value": { title: "Growth vs value stocks", unit: 2, topic_prompt: "Explain growth vs value investing. Classify the user's stocks. Why some P/Es are high and that's fine.", data_needed: ["profile", "financials"], dimensions: [{ dimension: "valuation_context", sub_topic: "peer_comparison" }] },
  "market-cap": { title: "Market cap", unit: 2, topic_prompt: "Explain market cap and company size categories. Show where the user's stocks fall (large/mid/small cap).", data_needed: ["profile"], dimensions: [{ dimension: "business_model", sub_topic: "business_model_type" }] },
  "earnings-report": { title: "What is an earnings report?", unit: 3, topic_prompt: "Explain quarterly earnings, EPS, beats/misses, guidance. Use recent earnings news from user's stocks.", data_needed: ["news", "financials"], dimensions: [{ dimension: "news_catalysts", sub_topic: "recent_earnings" }] },
  "priced-in": { title: "Why do stocks drop on good news?", unit: 3, topic_prompt: "Teach 'priced in' concept, expectations vs reality. Use real examples from user's stocks' recent news.", data_needed: ["news", "profile"], dimensions: [{ dimension: "news_catalysts", sub_topic: "analyst_sentiment" }] },
  "analyst-ratings": { title: "What analysts say", unit: 3, topic_prompt: "Explain analyst ratings, price targets, consensus. Why to be skeptical. Show sentiment on user's stocks.", data_needed: ["profile", "news"], dimensions: [{ dimension: "news_catalysts", sub_topic: "analyst_sentiment" }] },
  "news-filtering": { title: "Headlines that matter vs noise", unit: 3, topic_prompt: "Teach how to filter material news from noise. Use real recent headlines from user's stocks.", data_needed: ["news"], dimensions: [{ dimension: "news_catalysts", sub_topic: "significant_news" }] },
  "competitors": { title: "Who are the competitors?", unit: 4, topic_prompt: "Show competitive landscape for user's top stock. Market share, key metrics comparison.", data_needed: ["profile", "competitors"], dimensions: [{ dimension: "competitive_position", sub_topic: "main_competitors" }, { dimension: "competitive_position", sub_topic: "market_share" }] },
  "competitive-moat": { title: "What's a moat?", unit: 4, topic_prompt: "Explain competitive advantages (brand, network effects, switching costs). Identify moats in user's stocks.", data_needed: ["profile", "competitors"], dimensions: [{ dimension: "competitive_position", sub_topic: "moat_concept" }, { dimension: "competitive_position", sub_topic: "differentiation" }] },
  "risk-factors": { title: "Every stock has risks", unit: 4, topic_prompt: "Cover key risks: company-specific, sector, macro. Show actual risk factors for user's stocks.", data_needed: ["profile", "financials"], dimensions: [{ dimension: "risks", sub_topic: "key_risk_factors" }, { dimension: "risks", sub_topic: "dependency_risks" }] },
  "diversification": { title: "Diversification", unit: 4, topic_prompt: "Teach diversification. Analyze user's portfolio sector concentration. Are they diversified or concentrated?", data_needed: ["profile"], dimensions: [{ dimension: "risks", sub_topic: "macro_risks" }] },
  "bull-bear": { title: "Bull case vs bear case", unit: 5, topic_prompt: "Teach how to think about both sides. Generate bull/bear case for user's top stock using real data.", data_needed: ["profile", "financials", "competitors", "news"], dimensions: [{ dimension: "valuation_context", sub_topic: "historical_valuation" }] },
  "red-flags": { title: "When to worry", unit: 5, topic_prompt: "Teach red flags vs normal volatility. Check user's stocks against common warning signs.", data_needed: ["financials", "news"], dimensions: [{ dimension: "risks", sub_topic: "historical_challenges" }] },
  "dyor-framework": { title: "Doing your own research", unit: 5, topic_prompt: "Provide a practical research framework. Walk through it using one of user's actual stocks.", data_needed: ["profile", "financials", "competitors", "news"], dimensions: [{ dimension: "business_model", sub_topic: "customer_base" }] },
  "investment-thesis": { title: "Writing your investment thesis", unit: 5, topic_prompt: "Teach how to articulate 'why I own this.' Help user form a thesis for their top holding.", data_needed: ["profile", "financials"], dimensions: [{ dimension: "valuation_context", sub_topic: "expensive_vs_overvalued" }] },
  "indices": { title: "Indices — the market's mood ring", unit: 6, topic_prompt: "Explain S&P 500, NASDAQ, Dow. Which indices contain user's stocks. What 'the market' means.", data_needed: ["profile"], dimensions: [{ dimension: "business_model", sub_topic: "business_model_type" }] },
  "macro-factors": { title: "What moves the whole market?", unit: 6, topic_prompt: "Interest rates, inflation, Fed decisions. How macro events affect user's specific stocks.", data_needed: ["profile", "news"], dimensions: [{ dimension: "risks", sub_topic: "macro_risks" }] },
  "etfs-intro": { title: "ETFs — the lazy investor's best friend", unit: 6, topic_prompt: "What ETFs are, expense ratios, active vs passive. ETFs that hold user's stocks.", data_needed: ["profile"], dimensions: [{ dimension: "business_model", sub_topic: "business_model_type" }] },
  "portfolio-strategy": { title: "Building a portfolio strategy", unit: 6, topic_prompt: "Asset allocation, rebalancing, time horizon. Analyze user's current portfolio composition.", data_needed: ["profile", "financials"], dimensions: [{ dimension: "valuation_context", sub_topic: "peer_comparison" }] },
};

export function getLessonConfig(slug: string): LessonConfig | undefined {
  return LESSON_CONFIG[slug];
}
