import { anthropic } from "@ai-sdk/anthropic";
import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  tool,
  stepCountIs,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getStockProfile } from "@/lib/financial-data";
import { getProgressByTicker } from "@/lib/progress";
import { getDimensionForSubTopic } from "@/lib/learning-framework";
import { getPortfolioId } from "@/lib/supabase/queries";

function buildSystemPrompt(
  holdings: { ticker: string; company_name: string; shares: number }[]
) {
  const portfolioSection =
    holdings.length > 0
      ? holdings
          .map((h) => `${h.ticker} - ${h.company_name} - ${h.shares} shares`)
          .join("\n")
      : "No holdings added yet.";

  return `You are AdamsMyth, an investment learning assistant. Your job is to help beginner investors understand what they own — NOT to give financial advice.

PERSONALITY: Warm, patient, curious. Like a knowledgeable friend who makes finance interesting. Use analogies. Ask follow-up questions. Celebrate progress.

PORTFOLIO CONTEXT:
The user holds these stocks:
${portfolioSection}

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

VALID SUB-TOPICS (use these exact IDs when calling update_learning_progress):
- business_model: what_company_does, revenue_segments, core_products, customer_base, business_model_type
- financials: revenue_growth, profitability, balance_sheet, cash_flow, key_ratios
- competitive_position: main_competitors, differentiation, market_share, moat_concept
- risks: key_risk_factors, historical_challenges, dependency_risks, macro_risks
- news_catalysts: recent_earnings, upcoming_catalysts, significant_news, analyst_sentiment
- valuation_context: pe_ratio_meaning, peer_comparison, historical_valuation, expensive_vs_overvalued

PROGRESS TRACKING:
- After teaching a concept, call update_learning_progress to record what was covered
- Only mark a topic as completed when the user has engaged meaningfully (asked questions, responded to your explanation, or answered a comprehension check)
- Don't mark topics completed just because you mentioned them — the user needs to show engagement
- Before diving into a stock, call get_learning_progress to see what's already covered
- Periodically mention progress: "You've now covered 3 of 5 topics in Apple's Business Model dimension!"

TOOLS:
You have access to financial data tools and learning progress tools. When a user asks about a specific stock or company, use the get_stock_profile tool to fetch real data, then explain the results in beginner-friendly language. Always frame data as educational context, not investment advice.

RESPONSE STYLE:
1. Acknowledge the question
2. Connect to their portfolio if relevant ("Since you hold X...")
3. Explain the concept with an analogy
4. Ask a follow-up to deepen understanding`;
}

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  // Fetch user's holdings for portfolio context
  const portfolioId = await getPortfolioId(supabase, user.id);
  const { data: holdings } = portfolioId
    ? await supabase
        .from("holdings")
        .select("ticker, company_name, shares")
        .eq("portfolio_id", portfolioId)
    : { data: [] };

  const systemPrompt = buildSystemPrompt(holdings ?? []);

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: systemPrompt,
    messages: modelMessages,
    tools: {
      get_stock_profile: tool({
        description:
          "Get basic information about a stock including current price, market cap, sector, description, and key metrics",
        inputSchema: z.object({
          ticker: z
            .string()
            .describe("The stock ticker symbol, e.g. AAPL, MSFT, TSLA"),
        }),
        execute: async ({ ticker }) => {
          return await getStockProfile(ticker);
        },
      }),
      get_learning_progress: tool({
        description:
          "Check what the user has already learned about a specific stock. Use this before teaching about a stock to avoid re-teaching known topics and to suggest what to explore next.",
        inputSchema: z.object({
          ticker: z
            .string()
            .describe("The stock ticker symbol, e.g. AAPL, MSFT, TSLA"),
        }),
        execute: async ({ ticker }) => {
          return await getProgressByTicker(supabase, user.id, ticker);
        },
      }),
      update_learning_progress: tool({
        description:
          "Mark a learning sub-topic as explored after the user has demonstrated understanding through conversation. Only call this when the user has meaningfully engaged with the topic — not just because it was mentioned.",
        inputSchema: z.object({
          ticker: z
            .string()
            .describe("The stock ticker symbol, e.g. AAPL"),
          dimension: z
            .enum([
              "business_model",
              "financials",
              "competitive_position",
              "risks",
              "news_catalysts",
              "valuation_context",
            ])
            .describe("The learning dimension this sub-topic belongs to"),
          sub_topic: z
            .string()
            .describe(
              "The sub-topic ID, e.g. what_company_does, revenue_segments"
            ),
          evidence: z
            .string()
            .describe(
              "Brief note about what the user understood, e.g. 'User correctly explained Apple's 5 revenue segments'"
            ),
        }),
        execute: async ({ ticker, dimension, sub_topic, evidence }) => {
          // Validate the sub-topic belongs to the claimed dimension
          const actualDimension = getDimensionForSubTopic(sub_topic);
          if (!actualDimension || actualDimension !== dimension) {
            return {
              success: false,
              error: `Invalid sub-topic '${sub_topic}' for dimension '${dimension}'`,
            };
          }

          const { error } = await supabase
            .from("learning_progress")
            .upsert(
              {
                user_id: user.id,
                ticker: ticker.toUpperCase(),
                dimension,
                sub_topic,
                status: "completed",
                completed_at: new Date().toISOString(),
                evidence,
              },
              { onConflict: "user_id,ticker,dimension,sub_topic" }
            );

          if (error) {
            return { success: false, error: error.message };
          }

          return { success: true, ticker, dimension, sub_topic, evidence };
        },
      }),
    },
    stopWhen: stepCountIs(5),
  });

  return createUIMessageStreamResponse({
    stream: result.toUIMessageStream(),
  });
}
