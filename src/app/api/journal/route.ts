import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const createSchema = z.object({
  ticker: z.string().min(1).max(10).transform((v) => v.toUpperCase().trim()),
  dimension: z.enum([
    "business_model",
    "financials",
    "competitive_position",
    "risks",
    "news_catalysts",
    "valuation_context",
  ]),
  summary: z.string().min(1).max(500),
  key_takeaway: z.string().min(1).max(200),
});

export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker");

  try {
    let query = supabase
      .from("journal_entries")
      .select("id, ticker, dimension, summary, key_takeaway, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (ticker) {
      query = query.eq("ticker", ticker.toUpperCase());
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch journal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { ticker, dimension, summary, key_takeaway } = parsed.data;

  try {
    const { error } = await supabase.from("journal_entries").insert({
      user_id: user.id,
      ticker,
      dimension,
      summary,
      key_takeaway,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create journal entry";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
