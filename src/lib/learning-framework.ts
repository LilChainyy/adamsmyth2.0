export type LearningDimension =
  | "business_model"
  | "financials"
  | "competitive_position"
  | "risks"
  | "news_catalysts"
  | "valuation_context";

export type LearningStatus = "not_started" | "in_progress" | "completed";

export interface SubTopic {
  id: string;
  label: string;
  description: string;
  dimension: LearningDimension;
}

export interface DimensionDefinition {
  id: LearningDimension;
  label: string;
  description: string;
  weight: number;
  subTopics: SubTopic[];
}

export const DIMENSIONS: Record<LearningDimension, DimensionDefinition> = {
  business_model: {
    id: "business_model",
    label: "Business Model",
    description: "Understanding what the company does and how it makes money",
    weight: 0.2,
    subTopics: [
      {
        id: "what_company_does",
        label: "What the Company Does",
        description:
          "Core understanding of the company's products, services, and mission",
        dimension: "business_model",
      },
      {
        id: "revenue_segments",
        label: "Revenue Segments",
        description:
          "How the company breaks down its revenue across different business lines",
        dimension: "business_model",
      },
      {
        id: "core_products",
        label: "Core Products",
        description:
          "The key products or services that drive the business",
        dimension: "business_model",
      },
      {
        id: "customer_base",
        label: "Customer Base",
        description:
          "Who buys from this company — consumers, businesses, governments, etc.",
        dimension: "business_model",
      },
      {
        id: "business_model_type",
        label: "Business Model Type",
        description:
          "The type of business model — subscription, marketplace, advertising, etc.",
        dimension: "business_model",
      },
    ],
  },
  financials: {
    id: "financials",
    label: "Financials",
    description: "Understanding the company's financial health and performance",
    weight: 0.2,
    subTopics: [
      {
        id: "revenue_growth",
        label: "Revenue Growth",
        description:
          "How fast the company's top line is growing and what drives it",
        dimension: "financials",
      },
      {
        id: "profitability",
        label: "Profitability",
        description:
          "Whether the company makes money — margins, net income, operating income",
        dimension: "financials",
      },
      {
        id: "balance_sheet",
        label: "Balance Sheet",
        description:
          "The company's assets, liabilities, and overall financial strength",
        dimension: "financials",
      },
      {
        id: "cash_flow",
        label: "Cash Flow",
        description:
          "How much cash the business generates and where it goes",
        dimension: "financials",
      },
      {
        id: "key_ratios",
        label: "Key Ratios",
        description:
          "Important financial ratios like ROE, debt-to-equity, and current ratio",
        dimension: "financials",
      },
    ],
  },
  competitive_position: {
    id: "competitive_position",
    label: "Competitive Position",
    description: "Understanding the company's standing in its industry",
    weight: 0.15,
    subTopics: [
      {
        id: "main_competitors",
        label: "Main Competitors",
        description:
          "Who the company competes with and how they stack up",
        dimension: "competitive_position",
      },
      {
        id: "differentiation",
        label: "Differentiation",
        description:
          "What makes this company different from its competitors",
        dimension: "competitive_position",
      },
      {
        id: "market_share",
        label: "Market Share",
        description:
          "How much of the market the company controls",
        dimension: "competitive_position",
      },
      {
        id: "moat_concept",
        label: "Moat Concept",
        description:
          "Whether the company has durable competitive advantages (economic moat)",
        dimension: "competitive_position",
      },
    ],
  },
  risks: {
    id: "risks",
    label: "Risks",
    description: "Understanding what could go wrong",
    weight: 0.15,
    subTopics: [
      {
        id: "key_risk_factors",
        label: "Key Risk Factors",
        description:
          "The biggest risks facing the company right now",
        dimension: "risks",
      },
      {
        id: "historical_challenges",
        label: "Historical Challenges",
        description:
          "Past problems the company has faced and how they handled them",
        dimension: "risks",
      },
      {
        id: "dependency_risks",
        label: "Dependency Risks",
        description:
          "Over-reliance on a single product, customer, or market",
        dimension: "risks",
      },
      {
        id: "macro_risks",
        label: "Macro Risks",
        description:
          "How economic conditions, regulation, or geopolitics affect the company",
        dimension: "risks",
      },
    ],
  },
  news_catalysts: {
    id: "news_catalysts",
    label: "News & Catalysts",
    description: "Understanding recent and upcoming events that move the stock",
    weight: 0.15,
    subTopics: [
      {
        id: "recent_earnings",
        label: "Recent Earnings",
        description:
          "What happened in the most recent earnings report",
        dimension: "news_catalysts",
      },
      {
        id: "upcoming_catalysts",
        label: "Upcoming Catalysts",
        description:
          "Events that could move the stock — product launches, earnings dates, etc.",
        dimension: "news_catalysts",
      },
      {
        id: "significant_news",
        label: "Significant News",
        description:
          "Major recent news stories about the company",
        dimension: "news_catalysts",
      },
      {
        id: "analyst_sentiment",
        label: "Analyst Sentiment",
        description:
          "What Wall Street analysts generally think about the company",
        dimension: "news_catalysts",
      },
    ],
  },
  valuation_context: {
    id: "valuation_context",
    label: "Valuation Context",
    description:
      "Understanding whether the stock price makes sense relative to fundamentals",
    weight: 0.15,
    subTopics: [
      {
        id: "pe_ratio_meaning",
        label: "P/E Ratio Meaning",
        description:
          "What the price-to-earnings ratio tells you and its limitations",
        dimension: "valuation_context",
      },
      {
        id: "peer_comparison",
        label: "Peer Comparison",
        description:
          "How this stock's valuation compares to similar companies",
        dimension: "valuation_context",
      },
      {
        id: "historical_valuation",
        label: "Historical Valuation",
        description:
          "How the stock's current valuation compares to its own history",
        dimension: "valuation_context",
      },
      {
        id: "expensive_vs_overvalued",
        label: "Expensive vs Overvalued",
        description:
          "Understanding the difference between a high price and being overvalued",
        dimension: "valuation_context",
      },
    ],
  },
};

export const ALL_DIMENSIONS = Object.values(DIMENSIONS);

export function getAllSubTopics(): SubTopic[] {
  return ALL_DIMENSIONS.flatMap((d) => d.subTopics);
}

export function getSubTopicsForDimension(
  dimension: LearningDimension
): SubTopic[] {
  return DIMENSIONS[dimension].subTopics;
}

export function getDimensionForSubTopic(
  subTopicId: string
): LearningDimension | null {
  for (const dim of ALL_DIMENSIONS) {
    if (dim.subTopics.some((st) => st.id === subTopicId)) {
      return dim.id;
    }
  }
  return null;
}
