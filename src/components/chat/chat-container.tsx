"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { MessageBubble } from "@/components/chat/message-bubble";
import { SuggestedPrompts } from "@/components/chat/suggested-prompts";
import { ChatInput } from "@/components/chat/chat-input";
import { usePersistMessages } from "@/hooks/use-persist-messages";

const WELCOME_MESSAGE =
  "Hey! I'm your investment learning assistant. Ask me anything about stocks, ETFs, or investing concepts — I'm here to help you learn, not to give financial advice.";

export function ChatContainer() {
  const { messages, sendMessage, status } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  const isStreaming = status === "streaming" || status === "submitted";

  // Persist messages to Supabase after each exchange
  usePersistMessages(messages);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, status]);

  function handleSend(text: string) {
    sendMessage({ text });
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-3 px-4 pb-24 pt-4">
        {/* Welcome message — always shown at top */}
        <MessageBubble role="assistant" content={WELCOME_MESSAGE} />

        {/* Suggested prompts — only when no user messages */}
        {isEmpty && (
          <div className="mt-2">
            <SuggestedPrompts onSelect={handleSend} />
          </div>
        )}

        {/* Message list */}
        {messages.map((msg) => {
          const textContent = msg.parts
            .filter((p) => p.type === "text")
            .map((p) => p.text)
            .join("");

          if (!textContent) return null;

          return (
            <MessageBubble
              key={msg.id}
              role={msg.role as "user" | "assistant"}
              content={textContent}
            />
          );
        })}

        {/* Typing indicator — shown when waiting for first token */}
        {status === "submitted" && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-sm text-stone-400 shadow-sm">
              Thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} disabled={isStreaming} />
    </div>
  );
}
