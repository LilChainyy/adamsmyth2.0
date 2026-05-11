// DEPRECATED: Chat route kept for reference. Not served to users.
import { NextResponse } from "next/server";
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
import { getStockProfile, getFinancials, getNews, getCompetitors } from "@/lib/financial-data";
import { getProgressByTicker } from "@/lib/progress";
import { getDimensionForSubTopic } from "@/lib/learning-framework";
import { getPortfolioId } from "@/lib/supabase/queries";
import { searchKnowledgeBase } from "@/lib/knowledge-search";

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

PERSONALITY: You're a sharp friend who happens to know finance. Casual, warm, sometimes funny. You know their portfolio and always make it personal. Never sound like a textbook or a chatbot. If you use a finance term, explain it in parentheses right away.

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

LEARNING CHECKPOINTS:
- After explaining a significant concept (roughly every 3-4 exchanges), present a checkpoint using present_learning_checkpoint
- Keep it friendly and low-pressure. Questions should relate to what was just discussed with 3-4 plausible options where wrong answers reflect common misconceptions
- If the user answers correctly, the sub-topic is auto-completed — do NOT also call update_learning_progress

TOOL USAGE GUIDANCE:
- Call get_learning_progress before teaching about a stock to avoid re-covering known topics
- Call update_learning_progress only when the user demonstrates understanding through conversation (not needed after checkpoints)
- Call create_journal_entry naturally after 5+ meaningful exchanges about one stock
- Call suggest_follow_ups at the end of every educational response
- Always frame financial data as educational context, explaining what numbers mean for beginners
- When explaining investing concepts, use search_knowledge_base to find relevant educational content. Weave the knowledge naturally into your explanation — don't just paste it.
- When discussing competitive position or comparing a company to peers, call get_competitors to pull real peer metrics. Walk the user through what the comparison reveals about relative strengths and weaknesses.

LEARNING JOURNAL:
- After 5+ meaningful exchanges about a single stock, create a journal entry summarizing what the user learned
- Do this naturally at the end of a topic, as a closing summary
- The summary should be 2-3 sentences capturing the key concepts covered
- The key_takeaway should be 1 sentence — the single most important insight
- Don't announce that you're creating a journal entry — just do it quietly alongside your response

FOLLOW-UP SUGGESTIONS:
- After each educational response, call suggest_follow_ups with 2-3 natural follow-up questions the user might want to ask
- Make them specific to what was just discussed — not generic
- Keep them short and conversational (under 50 characters each)
- Example: After explaining Apple's revenue segments, suggest: "Which segment is growing fastest?", "How do services compare to hardware margins?", "What do Apple's competitors look like?"
- Always call this tool at the end of your response, after your text

RESPONSE FORMAT (THIS IS CRITICAL — FOLLOW EXACTLY):
- DEFAULT to 2-3 sentences. Short, punchy, specific to their portfolio.
- Lead with why it matters to THEIR stocks. Never lead with a definition.
- If a topic genuinely needs depth, give the short answer FIRST, then say "Want me to break this down more?" and STOP. Only expand if they say yes.
- Use their ticker symbols naturally: "Your AAPL" or "Since you own Tesla" — not "the stock" or "the company."
- One concept per response. If they ask about multiple things, pick the most relevant, address the rest after.
- NEVER start with "Great question!" or "That's a great question!" or any variation. Just answer.
- NEVER start with a textbook definition. Start with the "so what" — why this matters.
- NEVER use bullet points in your first response to a question. Write in natural sentences. You can use bullets only when listing specific data points (like financials) and only if the user asks for detail.`;
}

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
      get_financials: tool({
        description:
          "Get financial data for a stock including revenue, earnings, margins, P/E ratio, and growth rates. Returns up to 4 years of annual income statement data plus key financial ratios.",
        inputSchema: z.object({
          ticker: z
            .string()
            .describe("The stock ticker symbol, e.g. AAPL, MSFT, TSLA"),
        }),
        execute: async ({ ticker }) => {
          return await getFinancials(ticker);
        },
      }),
      get_news: tool({
        description:
          "Get recent news articles about a stock. Use this when the user asks about recent events, earnings reports, catalysts, or what's happening with a company.",
        inputSchema: z.object({
          ticker: z
            .string()
            .describe("The stock ticker symbol, e.g. AAPL, MSFT, TSLA"),
          limit: z
            .number()
            .min(1)
            .max(10)
            .default(5)
            .describe("Number of articles to fetch (1-10, default 5)"),
        }),
        execute: async ({ ticker, limit }) => {
          return await getNews(ticker, limit);
        },
      }),
      get_competitors: tool({
        description:
          "Get a comparison of a stock with its main competitors including key metrics like market cap, P/E ratio, revenue growth, and operating margin. Use this when discussing competitive position, market share, or comparing a company to its peers.",
        inputSchema: z.object({
          ticker: z
            .string()
            .describe("The stock ticker symbol, e.g. AAPL, MSFT, TSLA"),
        }),
        execute: async ({ ticker }) => {
          return await getCompetitors(ticker);
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
      suggest_follow_ups: tool({
        description:
          "Suggest 2-3 natural follow-up questions the user might want to ask next, based on what was just discussed. Call this at the end of every educational response.",
        inputSchema: z.object({
          suggestions: z
            .array(z.string().max(60))
            .min(2)
            .max(3)
            .describe("2-3 short follow-up questions specific to the current topic"),
        }),
        execute: async (input) => {
          return input;
        },
      }),
      present_learning_checkpoint: tool({
        description:
          "Present an interactive comprehension question to test the user's understanding of a concept just discussed. The question appears as an interactive multiple-choice quiz in the chat. If the user answers correctly, the sub-topic is automatically marked as completed.",
        inputSchema: z.object({
          question: z
            .string()
            .describe("The comprehension question to ask"),
          options: z
            .array(z.string())
            .min(3)
            .max(4)
            .describe("3-4 answer options, with wrong options reflecting common misconceptions"),
          correct_index: z
            .number()
            .min(0)
            .max(3)
            .describe("Zero-based index of the correct answer in the options array"),
          explanation: z
            .string()
            .describe("Brief explanation shown after answering, reinforcing the key concept"),
          ticker: z
            .string()
            .describe("The stock ticker this checkpoint relates to, e.g. AAPL"),
          dimension: z
            .enum([
              "business_model",
              "financials",
              "competitive_position",
              "risks",
              "news_catalysts",
              "valuation_context",
            ])
            .describe("The learning dimension this checkpoint covers"),
          sub_topic: z
            .string()
            .describe("The sub-topic ID this checkpoint tests, e.g. revenue_segments"),
        }),
        execute: async (input) => {
          // Pass-through: the structured data is rendered as an interactive
          // component on the client. No server-side logic needed.
          return input;
        },
      }),
      create_journal_entry: tool({
        description:
          "After a meaningful learning conversation about a single stock (5+ exchanges), create a journal entry summarizing what the user learned. Do this naturally when wrapping up a topic.",
        inputSchema: z.object({
          ticker: z
            .string()
            .describe("The stock ticker, e.g. AAPL"),
          dimension: z
            .enum([
              "business_model",
              "financials",
              "competitive_position",
              "risks",
              "news_catalysts",
              "valuation_context",
            ])
            .describe("The primary learning dimension covered"),
          summary: z
            .string()
            .max(500)
            .describe(
              "2-3 sentence summary of what was learned in this conversation"
            ),
          key_takeaway: z
            .string()
            .max(200)
            .describe(
              "1 sentence — the single most important insight from this session"
            ),
        }),
        execute: async ({ ticker, dimension, summary, key_takeaway }) => {
          const { error } = await supabase.from("journal_entries").insert({
            user_id: user.id,
            ticker: ticker.toUpperCase(),
            dimension,
            summary,
            key_takeaway,
          });

          if (error) {
            return { success: false, error: error.message };
          }

          return { success: true, ticker, dimension, summary, key_takeaway };
        },
      }),
      search_knowledge_base: tool({
        description:
          "Search the educational knowledge base for beginner-friendly explanations of investing concepts. Use this when explaining financial topics to find relevant, pre-written educational content to weave into your response.",
        inputSchema: z.object({
          query: z
            .string()
            .describe(
              "The concept or topic to search for, e.g. 'P/E ratio', 'competitive moat', 'free cash flow'"
            ),
          limit: z
            .number()
            .min(1)
            .max(5)
            .default(3)
            .describe("Number of results to return (1-5, default 3)"),
        }),
        execute: async ({ query, limit }) => {
          const results = await searchKnowledgeBase(query, limit);
          return results.map((r) => ({
            title: r.title,
            content: r.content,
            dimension: r.dimension,
            similarity: r.similarity,
          }));
        },
      }),
    },
    stopWhen: stepCountIs(5),
  });

  return createUIMessageStreamResponse({
    stream: result.toUIMessageStream(),
  });
  } catch (e) {
    console.error("[chat] Error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
