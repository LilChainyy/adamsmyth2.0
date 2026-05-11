import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { getDimensionForSubTopic } from "@/lib/learning-framework";

import { getPortfolioId } from "@/lib/supabase/queries";

const requestSchema = z.object({
  ticker: z.string().min(1).max(10).transform((v) => v.toUpperCase().trim()).optional(),
  subTopicId: z.string().min(1),
  status: z.enum(["not_started", "in_progress", "completed"]),
  evidence: z.string().optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { ticker, subTopicId, status, evidence } = parsed.data;

  const dimension = getDimensionForSubTopic(subTopicId);
  if (!dimension) {
    return NextResponse.json(
      { error: "Invalid sub-topic ID" },
      { status: 400 }
    );
  }

  try {
    // If ticker provided, update just that ticker. Otherwise update all holdings.
    let tickers: string[] = [];
    if (ticker) {
      tickers = [ticker];
    } else {
      const portfolioId = await getPortfolioId(supabase, user.id);
      if (portfolioId) {
        const { data: holdings } = await supabase
          .from("holdings")
          .select("ticker")
          .eq("portfolio_id", portfolioId);
        tickers = (holdings ?? []).map((h) => h.ticker.toUpperCase());
      }
    }

    if (tickers.length === 0) {
      return NextResponse.json({ success: true });
    }

    const rows = tickers.map((t) => ({
      user_id: user.id,
      ticker: t,
      dimension,
      sub_topic: subTopicId,
      status,
      completed_at: status === "completed" ? new Date().toISOString() : null,
      evidence: evidence ?? null,
    }));

    const { error } = await supabase
      .from("learning_progress")
      .upsert(rows, { onConflict: "user_id,ticker,dimension,sub_topic" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[progress/update] Error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
