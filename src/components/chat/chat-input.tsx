"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled: boolean;
};

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  const canSend = value.trim().length > 0 && !disabled;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) {
        onSend(value.trim());
        setValue("");
      }
    }
  }

  return (
    <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-amber-200/60 bg-amber-50/80 backdrop-blur-lg">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3"
      >
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about investing..."
          className={cn(
            "h-10 flex-1 rounded-full border border-amber-200 bg-white px-4 text-sm text-stone-800",
            "placeholder:text-stone-400 outline-none",
            "focus:border-amber-300 focus:ring-2 focus:ring-amber-200/50"
          )}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!canSend}
          className="size-10 shrink-0 rounded-full bg-amber-800 text-white hover:bg-amber-700 disabled:opacity-40"
        >
          <SendHorizontal className="size-4" />
        </Button>
      </form>
    </div>
  );
}
