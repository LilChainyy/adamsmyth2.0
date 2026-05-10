"use client";

import { cn } from "@/lib/utils";

type MessageBubbleProps = {
  role: "user" | "assistant";
  content: string;
};

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] whitespace-pre-wrap px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-2xl rounded-br-md bg-amber-800 text-white"
            : "rounded-2xl rounded-bl-md bg-white text-stone-800 shadow-sm"
        )}
      >
        {content}
      </div>
    </div>
  );
}
