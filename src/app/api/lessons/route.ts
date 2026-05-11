import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { getStockProfile, getFinancials, getNews, getCompetitors } from "@/lib/financial-data";
import { getPortfolioId } from "@/lib/supabase/queries";
import { getLessonConfig, type DataType } from "@/lib/curriculum";

const VALID_DIMS = `business_model: what_company_does, revenue_segments, core_products, customer_base, business_model_type
financials: revenue_growth, profitability, balance_sheet, cash_flow, key_ratios
competitive_position: main_competitors, differentiation, market_share, moat_concept
risks: key_risk_factors, historical_challenges, dependency_risks, macro_risks
news_catalysts: recent_earnings, upcoming_catalysts, significant_news, analyst_sentiment
valuation_context: pe_ratio_meaning, peer_comparison, historical_valuation, expensive_vs_overvalued`;

function buildSystemPrompt(title: string, topicPrompt: string, holdingsList: string) {
  return `You are generating a bite-sized investment lesson. The lesson teaches a CONCEPT, not a company — but uses the user's actual stocks as live examples throughout.

LESSON: ${title}
TEACHING GOAL: ${topicPrompt}
USER'S HOLDINGS: ${holdingsList}

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
- dimension and sub_topic must use valid IDs from:
${VALID_DIMS}

Respond with ONLY the JSON object. No markdown, no code fences, no explanation.`;
}

function buildFallbackLesson(title: string) {
  return {
    lesson_title: title,
    lesson_intro: "Let's explore this investing concept together.",
    cards: [
      { type: "teach", content: "Every stock represents partial ownership of a real business. When you buy shares, you become a co-owner alongside thousands of other investors.", highlight: "Stocks = ownership in a business" },
      { type: "quiz", question: "What does owning a share of stock represent?", options: ["Partial ownership of the company", "A loan to the company", "A guarantee of profit", "An employee contract"], correct_index: 0, explanation: "A share represents partial ownership — you own a tiny piece of the business.", dimension: "business_model", sub_topic: "what_company_does" },
      { type: "teach", content: "Companies make money by selling products or services. Understanding how a company generates revenue is the first step to understanding its stock.", highlight: "Revenue = money coming in from sales" },
      { type: "quiz", question: "What is revenue?", options: ["Total money earned from sales", "Profit after expenses", "Stock price times shares", "Money owed to lenders"], correct_index: 0, explanation: "Revenue is the top-line income from selling products or services.", dimension: "financials", sub_topic: "revenue_growth" },
      { type: "teach", content: "Not all revenue becomes profit. Companies have costs like salaries, materials, and rent that reduce what they earn.", highlight: "Revenue minus costs = profit" },
      { type: "quiz", question: "A company earns $100M and spends $80M. What's the profit?", options: ["$20M", "$100M", "$80M", "$180M"], correct_index: 0, explanation: "Profit = Revenue - Expenses. $100M - $80M = $20M.", dimension: "financials", sub_topic: "profitability" },
      { type: "teach", content: "Every company operates alongside competitors. Knowing who else is in the space helps you understand the bigger picture.", highlight: "Competition shapes every business" },
      { type: "quiz", question: "Why does knowing competitors matter?", options: ["Shows how a company stacks up in its market", "Competitors always have the same stock price", "Only one company can exist per industry", "Competitors share profits equally"], correct_index: 0, explanation: "Understanding competition reveals relative strengths and market position.", dimension: "competitive_position", sub_topic: "main_competitors" },
    ],
    lesson_complete_message: "Nice work! You're building a solid investing foundation.",
  };
}

const DATA_FETCHERS: Record<DataType, (ticker: string) => Promise<unknown>> = {
  profile: (t) => getStockProfile(t),
  financials: (t) => getFinancials(t),
  news: (t) => getNews(t, 3),
  competitors: (t) => getCompetitors(t),
};

export async function GET(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
  }

  const config = getLessonConfig(slug);
  if (!config) {
    return NextResponse.json({ error: "Unknown lesson slug" }, { status: 400 });
  }

  // Fetch user's holdings
  const portfolioId = await getPortfolioId(supabase, user.id);
  const { data: holdings } = portfolioId
    ? await supabase.from("holdings").select("ticker, company_name").eq("portfolio_id", portfolioId)
    : { data: [] };

  const holdingsList = (holdings ?? []).map((h) => `${h.ticker} (${h.company_name ?? h.ticker})`);
  const topTickers = (holdings ?? []).slice(0, 2).map((h) => h.ticker);

  // Fetch data for top holdings based on lesson needs
  const stockData: Record<string, unknown> = {};
  try {
    const fetches: Promise<void>[] = [];
    for (const dataType of config.data_needed) {
      const tickers = dataType === "competitors" ? topTickers.slice(0, 1) : topTickers;
      for (const ticker of tickers) {
        fetches.push(
          DATA_FETCHERS[dataType](ticker).then((result) => {
            const key = `${dataType}_${ticker}`;
            stockData[key] = result;
          }).catch((e) => {
            console.error(`[lessons] Failed to fetch ${dataType} for ${ticker}:`, e);
          })
        );
      }
    }
    await Promise.all(fetches);
  } catch (e) {
    console.error("[lessons] Data fetch error:", e);
  }

  const userMessage = `Generate a lesson about "${config.title}".\n\nStock data:\n${JSON.stringify(stockData)}`;

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: buildSystemPrompt(config.title, config.topic_prompt, holdingsList.join(", ") || "No holdings yet"),
      messages: [{ role: "user", content: userMessage }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const rawText = textBlock?.text ?? "";

    let lesson: unknown;
    try {
      lesson = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        try { lesson = JSON.parse(match[1]); } catch { lesson = null; }
      }
    }

    if (!lesson) {
      return NextResponse.json(buildFallbackLesson(config.title));
    }

    return NextResponse.json(lesson);
  } catch (e) {
    console.error("[lessons] Anthropic API error:", e);
    return NextResponse.json(buildFallbackLesson(config.title));
  }
}
