"use client";

import { useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CheckpointData } from "@/components/chat/learning-checkpoint";

export function useCheckpointHandler() {
  return useCallback((correct: boolean, data: CheckpointData) => {
    if (correct) {
      fetch("/api/progress/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker: data.ticker,
          subTopicId: data.sub_topic,
          status: "completed",
          evidence: `Checkpoint: correctly answered "${data.question}"`,
        }),
      }).catch((err) => console.error("Failed to update progress:", err));
    }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      supabase
        .from("chat_messages")
        .insert({
          user_id: user.id,
          role: "assistant",
          content: `[Checkpoint] ${data.question}`,
          metadata: {
            type: "checkpoint_result",
            correct,
            ticker: data.ticker,
            dimension: data.dimension,
            sub_topic: data.sub_topic,
            question: data.question,
            selected_answer: correct ? "correct" : "incorrect",
          },
        })
        .then(({ error }) => {
          if (error) console.error("Failed to persist checkpoint:", error);
        });
    });
  }, []);
}
