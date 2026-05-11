/*
  Run this SQL in the Supabase SQL editor to create the lesson_completions table:

  CREATE TABLE IF NOT EXISTS lesson_completions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    lesson_slug text NOT NULL,
    completed_at timestamptz DEFAULT now(),
    score int,
    total int,
    UNIQUE(user_id, lesson_slug)
  );

  ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Users can read own completions" ON lesson_completions FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "Users can insert own completions" ON lesson_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "Users can update own completions" ON lesson_completions FOR UPDATE USING (auth.uid() = user_id);
*/

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const requestSchema = z.object({
  slug: z.string().min(1),
  score: z.number().int().min(0),
  total: z.number().int().min(1),
});

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { slug, score, total } = parsed.data;

  try {
    const { error } = await supabase
      .from("lesson_completions")
      .upsert(
        {
          user_id: user.id,
          lesson_slug: slug,
          score,
          total,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_slug" }
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Record daily activity for streak tracking
    const today = new Date().toISOString().split("T")[0];
    await supabase
      .from("daily_activity")
      .upsert(
        { user_id: user.id, date: today, message_count: 1 },
        { onConflict: "user_id,date", ignoreDuplicates: true }
      );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[lessons/complete] Error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
