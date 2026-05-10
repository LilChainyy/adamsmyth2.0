import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProgressByTicker, getOverallProgress } from "@/lib/progress";

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
    if (ticker) {
      const progress = await getProgressByTicker(supabase, user.id, ticker);
      return NextResponse.json(progress);
    }

    const progress = await getOverallProgress(supabase, user.id);
    return NextResponse.json(progress);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch progress";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
