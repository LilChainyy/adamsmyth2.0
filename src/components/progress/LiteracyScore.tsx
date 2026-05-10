"use client";

import { ProgressRing } from "@/components/progress/ProgressRing";

interface LiteracyScoreProps {
  score: number;
}

export function LiteracyScore({ score }: LiteracyScoreProps) {
  return (
    <div className="rounded-xl bg-white p-5 ring-1 ring-stone-200/60">
      <div className="flex items-center gap-5">
        <ProgressRing percentage={score} size={72} strokeWidth={6} />
        <div>
          <h2 className="text-base font-semibold text-stone-800">
            Investment Literacy Score
          </h2>
          <p className="mt-0.5 text-xs text-stone-500">
            Weighted average across all your stocks
          </p>
        </div>
      </div>
    </div>
  );
}
