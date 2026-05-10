import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getNews, getStockProfile } from "@/lib/financial-data";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user's holdings
    const { data: portfolios } = await supabase
      .from("portfolios")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);

    const portfolioId = portfolios?.[0]?.id;
    if (!portfolioId) {
      return NextResponse.json({ pulse: null });
    }

    const { data: holdings } = await supabase
      .from("holdings")
      .select("ticker, company_name")
      .eq("portfolio_id", portfolioId);

    if (!holdings || holdings.length === 0) {
      return NextResponse.json({ pulse: null });
    }

    // Fetch news and profiles for top 3 holdings
    const topHoldings = holdings.slice(0, 3);

    const stockBriefs = await Promise.all(
      topHoldings.map(async (holding) => {
        const [news, profile] = await Promise.all([
          getNews(holding.ticker, 2),
          getStockProfile(holding.ticker),
        ]);

        const topArticle = news.articles[0];
        const headline = topArticle
          ? topArticle.title
          : `${profile.companyName} trading at $${profile.price.toFixed(2)}`;

        const soWhat = topArticle
          ? `${topArticle.source} · ${topArticle.date}`
          : `${profile.changesPercentage >= 0 ? "+" : ""}${profile.changesPercentage.toFixed(1)}% recently`;

        const followUp = topArticle
          ? `What does this mean for my ${holding.ticker}?`
          : `How is ${holding.ticker} doing lately?`;

        return {
          ticker: holding.ticker,
          headline,
          so_what: soWhat,
          follow_up_prompt: followUp,
        };
      })
    );

    // Generate market mood from the overall picture
    const changes = await Promise.all(
      topHoldings.map((h) => getStockProfile(h.ticker))
    );
    const avgChange =
      changes.reduce((sum, p) => sum + p.changesPercentage, 0) / changes.length;

    let marketMood: string;
    if (avgChange > 1) {
      marketMood = "Your stocks are having a solid week. Here's what's driving the moves.";
    } else if (avgChange < -1) {
      marketMood = "A bit of a rough patch for your portfolio this week. Let's break down why.";
    } else {
      marketMood = "Markets are relatively quiet for your stocks. A good time to learn something new.";
    }

    return NextResponse.json({
      pulse: {
        market_mood: marketMood,
        stocks: stockBriefs,
      },
    });
  } catch (e) {
    console.error("[briefing] Error:", e);
    return NextResponse.json({ pulse: null });
  }
}
