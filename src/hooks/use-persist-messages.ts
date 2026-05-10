"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UIMessage } from "ai";

/**
 * Persists new chat messages to Supabase chat_messages table.
 * Tracks which messages have already been saved to avoid duplicates.
 */
export function usePersistMessages(messages: UIMessage[]) {
  const savedIds = useRef(new Set<string>());

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
  }, [messages]);
}
