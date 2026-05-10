"use client";

import { useState, useRef, type FormEvent, type KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled: boolean;
  onTypingChange?: (typing: boolean) => void;
};

export function ChatInput({ onSend, disabled, onTypingChange }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = value.trim().length > 0 && !disabled;

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newValue = e.target.value;
    setValue(newValue);
    onTypingChange?.(newValue.length > 0);

    // Auto-resize textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }

  function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
    onTypingChange?.(false);
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-amber-200/60 bg-amber-50/80 backdrop-blur-lg">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-3xl items-end gap-2 px-4 py-3"
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about investing..."
          rows={1}
          aria-label="Message input"
          className={cn(
            "min-h-[40px] max-h-[120px] flex-1 resize-none rounded-2xl border border-amber-200 bg-white px-4 py-2.5 text-sm text-stone-800",
            "placeholder:text-stone-400 outline-none",
            "focus:border-amber-300 focus:ring-2 focus:ring-amber-200/50"
          )}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!canSend}
          aria-label="Send message"
          className="size-10 shrink-0 rounded-full bg-amber-800 text-white hover:bg-amber-700 disabled:opacity-40"
        >
          <SendHorizontal className="size-4" />
        </Button>
      </form>
    </div>
  );
}
