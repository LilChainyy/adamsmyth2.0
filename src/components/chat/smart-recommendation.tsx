"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import type { OverallProgress } from "@/lib/progress";

interface SmartRecommendationProps {
  onSelect: (text: string) => void;
}

const DIMENSION_STARTERS: Record<string, string> = {
  business_model: "business model",
  financials: "financials",
  competitive_position: "competitive position",
  risks: "risks",
  news_catalysts: "recent news",
  valuation_context: "valuation",
};

export function SmartRecommendation({ onSelect }: SmartRecommendationProps) {
  const [recommendation, setRecommendation] = useState<{
    ticker: string;
    dimension: string;
    percentage: number;
  } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/progress")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: OverallProgress | null) => {
        if (!data?.tickers?.length) return;

        // Find a stock with < 25% progress
        const lowProgress = data.tickers
          .filter((t) => t.overallPercentage < 25)
          .sort((a, b) => a.overallPercentage - b.overallPercentage);

        if (lowProgress.length === 0) return;

        const stock = lowProgress[0];
        // Find the least-covered dimension
        const weakest = [...stock.dimensions].sort(
          (a, b) => a.percentage - b.percentage
        )[0];

        setRecommendation({
          ticker: stock.ticker,
          dimension: weakest.dimension,
          percentage: stock.overallPercentage,
        });
      })
      .catch(() => {});
  }, []);

  if (!recommendation || dismissed) return null;

  const topic = DIMENSION_STARTERS[recommendation.dimension] ?? "business model";
  const prompt = `Tell me about ${recommendation.ticker}'s ${topic}`;

  return (
    <div className="mx-4 mt-2">
      <button
        onClick={() => {
          setDismissed(true);
          onSelect(prompt);
        }}
        className="group flex w-full items-start gap-3 rounded-xl border border-amber-200/60 bg-gradient-to-r from-amber-50 to-white p-3 text-left transition-shadow hover:shadow-md"
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
          <Sparkles className="size-4 text-amber-700" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-stone-800">
            You haven&apos;t explored much about {recommendation.ticker} yet
          </p>
          <p className="mt-0.5 text-xs text-stone-500">
            Want to start with their {topic}?
          </p>
        </div>
        <ArrowRight className="mt-1 size-4 shrink-0 text-amber-400 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
