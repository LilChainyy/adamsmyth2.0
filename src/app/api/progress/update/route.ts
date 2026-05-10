import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { getDimensionForSubTopic } from "@/lib/learning-framework";

const requestSchema = z.object({
  ticker: z.string().min(1).max(10).transform((v) => v.toUpperCase().trim()),
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

  const { error } = await supabase
    .from("learning_progress")
    .upsert(
      {
        user_id: user.id,
        ticker,
        dimension,
        sub_topic: subTopicId,
        status,
        completed_at: status === "completed" ? new Date().toISOString() : null,
        evidence: evidence ?? null,
      },
      { onConflict: "user_id,ticker,dimension,sub_topic" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
