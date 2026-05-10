import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { initializeProgressForTicker } from "@/lib/progress";

const holdingSchema = z.object({
  ticker: z.string().min(1).max(10).transform((v) => v.toUpperCase().trim()),
  company_name: z.string().optional(),
  shares: z.number().positive().optional(),
  avg_cost_basis: z.number().positive().optional(),
});

const requestSchema = z.object({
  name: z.string().min(1).max(100).default("My Portfolio"),
  holdings: z.array(holdingSchema).min(1, "At least one stock is required"),
});

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: portfolios } = await supabase
    .from("portfolios")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  const portfolioId = portfolios?.[0]?.id;
  if (!portfolioId) {
    return NextResponse.json({ holdings: [] });
  }

  const { data: holdings } = await supabase
    .from("holdings")
    .select("id, ticker, company_name, shares")
    .eq("portfolio_id", portfolioId);

  return NextResponse.json({ holdings: holdings ?? [] });
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
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const { name, holdings } = parsed.data;

    // Create portfolio
    const { data: portfolio, error: portfolioError } = await supabase
      .from("portfolios")
      .insert({ user_id: user.id, name })
      .select("id")
      .single();

    if (portfolioError) {
      return NextResponse.json(
        { error: portfolioError.message },
        { status: 500 }
      );
    }

    // Insert holdings
    const holdingRows = holdings.map((h) => ({
      portfolio_id: portfolio.id,
      ticker: h.ticker,
      company_name: h.company_name || null,
      shares: h.shares || null,
      avg_cost_basis: h.avg_cost_basis || null,
    }));

    const { error: holdingsError } = await supabase
      .from("holdings")
      .insert(holdingRows);

    if (holdingsError) {
      return NextResponse.json(
        { error: holdingsError.message },
        { status: 500 }
      );
    }

    // Initialize learning progress for each stock
    await Promise.all(
      holdings.map((h) => initializeProgressForTicker(supabase, user.id, h.ticker))
    );

    // Mark onboarding as completed
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ onboarding_completed: true })
      .eq("id", user.id);

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ portfolio_id: portfolio.id });
  } catch (e) {
    console.error("[portfolio] Error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
