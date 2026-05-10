"use client";

const prompts = [
  "📊 What is a stock?",
  "💡 Explain ETFs to me",
  "📈 How does compound interest work?",
  "🏦 What is diversification?",
];

type SuggestedPromptsProps = {
  onSelect: (prompt: string) => void;
};

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
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
  );
}
