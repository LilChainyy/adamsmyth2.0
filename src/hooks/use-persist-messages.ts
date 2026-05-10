"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UIMessage } from "ai";

/**
 * Persists new chat messages to Supabase chat_messages table.
 * Tracks which messages have already been saved to avoid duplicates.
 * Also records daily activity for streak tracking (once per day).
 */
export function usePersistMessages(messages: UIMessage[]) {
  const savedIds = useRef(new Set<string>());
  const activityRecorded = useRef(false);

  useEffect(() => {
    const newMessages = messages.filter((m) => {
      // Only persist completed messages (not still streaming)
      const isComplete = m.parts.every(
        (p) => p.type !== "text" || p.state !== "streaming"
      );
      return isComplete && !savedIds.current.has(m.id);
    });

    if (newMessages.length === 0) return;

    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      // Record daily activity for streak tracking (once per session)
      const hasUserMessage = newMessages.some((m) => m.role === "user");
      if (hasUserMessage && !activityRecorded.current) {
        activityRecorded.current = true;
        const today = new Date().toISOString().split("T")[0];

        supabase
          .from("daily_activity")
          .upsert(
            { user_id: user.id, date: today, message_count: 1 },
            { onConflict: "user_id,date", ignoreDuplicates: true }
          )
          .then(({ error }) => {
            if (error) {
              console.error("Failed to record daily activity:", error);
              activityRecorded.current = false;
            }
          });
      }

      for (const msg of newMessages) {
        const textContent = msg.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join("");

        if (!textContent) continue;

        savedIds.current.add(msg.id);

        supabase
          .from("chat_messages")
          .insert({
            user_id: user.id,
            role: msg.role,
            content: textContent,
          })
          .then(({ error }) => {
            if (error) {
              console.error("Failed to persist message:", error);
              savedIds.current.delete(msg.id);
            }
          });
      }
    });
  }, [messages]);
}
