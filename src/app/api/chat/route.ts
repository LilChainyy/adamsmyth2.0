import { anthropic } from "@ai-sdk/anthropic";
import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { createClient } from "@/lib/supabase/server";

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
  const { data: holdings } = await supabase
    .from("holdings")
    .select("ticker, company_name, shares")
    .eq(
      "portfolio_id",
      (
        await supabase
          .from("portfolios")
          .select("id")
          .eq("user_id", user.id)
          .limit(1)
          .single()
      ).data?.id ?? ""
    );

  const systemPrompt = buildSystemPrompt(holdings ?? []);

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: systemPrompt,
    messages: modelMessages,
  });

  return createUIMessageStreamResponse({
    stream: result.toUIMessageStream(),
  });
}
