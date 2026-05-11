import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase
    .from("daily_activity")
    .upsert(
      { user_id: user.id, date: today, message_count: 1 },
      { onConflict: "user_id,date", ignoreDuplicates: true }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all activity dates ordered descending
    const { data: rows, error } = await supabase
      .from("daily_activity")
      .select("date")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error) throw error;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ currentStreak: 0, longestStreak: 0 });
    }

    const dates = rows.map((r) => r.date as string);
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];

    // Current streak: count consecutive days ending today or yesterday
    let currentStreak = 0;
    const startsFromToday = dates[0] === today || dates[0] === yesterday;

    if (startsFromToday) {
      currentStreak = 1;
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diffDays =
          (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Longest streak: scan all dates ascending
    const ascending = [...dates].reverse();
    let longestStreak = 1;
    let streak = 1;

    for (let i = 1; i < ascending.length; i++) {
      const prev = new Date(ascending[i - 1]);
      const curr = new Date(ascending[i]);
      const diffDays =
        (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        streak++;
        longestStreak = Math.max(longestStreak, streak);
      } else {
        streak = 1;
      }
    }

    return NextResponse.json({ currentStreak, longestStreak });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch streaks";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
