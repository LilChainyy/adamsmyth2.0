"use client";

import { useMemo } from "react";
import Link from "next/link";

interface Holding {
  ticker: string;
  company_name: string;
}

type SuggestedPromptsProps = {
  onSelect: (prompt: string) => void;
  holdings?: Holding[];
};

const TEMPLATES = [
  (h: Holding) => `How does ${h.company_name} make money?`,
  (h: Holding) => `What's ${h.ticker}'s biggest risk right now?`,
  (h: Holding) => `Compare ${h.ticker} to its competitors`,
  (h: Holding) => `Is ${h.ticker} considered expensive?`,
  (h: Holding) => `What industry is ${h.company_name} in?`,
];

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function SuggestedPrompts({ onSelect, holdings }: SuggestedPromptsProps) {
  const prompts = useMemo(() => {
    if (!holdings || holdings.length === 0) {
      return ["Help me add my first stocks", "What can you teach me?"];
    }

    const templates = pickRandom(TEMPLATES, 3);
    return templates.map((tpl) => {
      const holding = holdings[Math.floor(Math.random() * holdings.length)];
      return tpl(holding);
    });
  }, [holdings]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-wrap justify-center gap-2 px-4">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm text-stone-700 transition-colors hover:bg-amber-50 hover:border-amber-300 active:scale-95"
          >
            {prompt}
          </button>
        ))}
      </div>
      <Link
        href="/settings"
        className="mt-2 text-xs text-stone-400 transition-colors hover:text-amber-600"
      >
        Manage portfolio &rarr;
      </Link>
    </div>
  );
}
