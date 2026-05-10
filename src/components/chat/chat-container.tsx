"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { isToolUIPart } from "ai";
import { MessageBubble } from "@/components/chat/message-bubble";
import { SuggestedPrompts } from "@/components/chat/suggested-prompts";
import { ChatInput } from "@/components/chat/chat-input";
import { FollowUpChips } from "@/components/chat/follow-up-chips";
import { SmartRecommendation } from "@/components/chat/smart-recommendation";
import { usePersistMessages } from "@/hooks/use-persist-messages";
import { useCheckpointHandler } from "@/hooks/use-checkpoint-handler";

const WELCOME_MESSAGE =
  "Hey! I'm your investment learning assistant. Ask me anything about stocks, ETFs, or investing concepts — I'm here to help you learn, not to give financial advice.";

export function ChatContainer() {
  const { messages, sendMessage, status, error } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  const isStreaming = status === "streaming" || status === "submitted";

  usePersistMessages(messages);
  const handleCheckpointAnswer = useCheckpointHandler();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, status]);

  function handleSend(text: string) {
    setIsTyping(false);
    sendMessage({ text });
  }

  // Extract follow-up suggestions from the latest assistant message
  const followUps = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.role !== "assistant") continue;

      for (const part of msg.parts) {
        if (
          isToolUIPart(part) &&
          part.state === "output-available" &&
          (part.type === "dynamic-tool"
            ? part.toolName === "suggest_follow_ups"
            : part.type === "tool-suggest_follow_ups")
        ) {
          const output = part.output as { suggestions?: string[] };
          if (output?.suggestions?.length) return output.suggestions;
        }
      }
      break;
    }
    return [];
  }, [messages]);

  const isEmpty = messages.length === 0;
  const showFollowUps = !isStreaming && !isTyping && followUps.length > 0;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-3 px-4 pb-24 pt-4">
        <MessageBubble role="assistant" content={WELCOME_MESSAGE} />

        {isEmpty && (
          <>
            <SmartRecommendation onSelect={handleSend} />
            <div className="mt-2">
              <SuggestedPrompts onSelect={handleSend} />
            </div>
          </>
        )}

        {messages.map((msg) => {
          const textContent = msg.parts
            .filter((p) => p.type === "text")
            .map((p) => p.text)
            .join("");

          return (
            <MessageBubble
              key={msg.id}
              role={msg.role as "user" | "assistant"}
              content={textContent}
              parts={msg.parts}
              onCheckpointAnswer={handleCheckpointAnswer}
            />
          );
        })}

        <FollowUpChips
          suggestions={followUps}
          onSelect={handleSend}
          visible={showFollowUps}
        />

        {status === "submitted" && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-sm text-stone-400 shadow-sm">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block size-1.5 animate-pulse rounded-full bg-amber-400" />
                <span className="inline-block size-1.5 animate-pulse rounded-full bg-amber-400 [animation-delay:150ms]" />
                <span className="inline-block size-1.5 animate-pulse rounded-full bg-amber-400 [animation-delay:300ms]" />
                <span className="ml-1">Thinking...</span>
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-red-50 px-4 py-2.5 text-sm text-red-700 ring-1 ring-red-200">
              Something went wrong. Please try again.
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="fixed bottom-[calc(4rem+3.5rem)] left-0 right-0 z-20 pointer-events-none">
        <p className="mx-auto max-w-3xl px-4 text-center text-[10px] text-stone-400">
          Educational content only. Not financial advice.
        </p>
      </div>

      <ChatInput
        onSend={handleSend}
        disabled={isStreaming}
        onTypingChange={setIsTyping}
      />
    </div>
  );
}
