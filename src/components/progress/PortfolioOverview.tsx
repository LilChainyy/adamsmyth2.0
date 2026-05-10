"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { ProgressRing } from "@/components/progress/ProgressRing";
import { LiteracyScore } from "@/components/progress/LiteracyScore";
import { StockProgressDetail } from "@/components/progress/StockProgressDetail";
import type { OverallProgress } from "@/lib/progress";

function StockCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-white p-4 ring-1 ring-stone-200/60">
      <div className="flex items-center gap-4">
        <div className="size-16 rounded-full bg-stone-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-20 rounded bg-stone-200" />
          <div className="h-3 w-32 rounded bg-stone-200" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-16">
      <div className="rounded-full bg-amber-100 p-4">
        <BookOpen className="size-8 text-amber-700" />
      </div>
      <h2 className="text-lg font-semibold text-stone-800">
        No stocks to track yet
      </h2>
      <p className="text-center text-sm text-stone-500">
        Add stocks to your portfolio to start tracking your learning progress.
      </p>
      <Link
        href="/chat"
        className="mt-2 rounded-lg bg-amber-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-800"
      >
        Start learning in Chat
      </Link>
    </div>
  );
}

export function PortfolioOverview() {
  const [expandedTicker, setExpandedTicker] = useState<string | null>(null);

  const { data, isLoading } = useQuery<OverallProgress>({
    queryKey: ["progress"],
    queryFn: async () => {
      const res = await fetch("/api/progress");
      if (!res.ok) throw new Error("Failed to fetch progress");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4 px-4 pt-4">
        <div className="animate-pulse rounded-xl bg-white p-5 ring-1 ring-stone-200/60">
          <div className="flex items-center gap-5">
            <div className="size-[72px] rounded-full bg-stone-200" />
            <div className="space-y-2">
              <div className="h-4 w-48 rounded bg-stone-200" />
              <div className="h-3 w-36 rounded bg-stone-200" />
            </div>
          </div>
        </div>
        <StockCardSkeleton />
        <StockCardSkeleton />
      </div>
    );
  }

  if (!data || data.tickers.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4 px-4 pt-4 pb-6">
      <LiteracyScore score={data.literacyScore} />

      <h3 className="pt-1 text-sm font-medium text-stone-500">Your Stocks</h3>

      <div className="space-y-3">
        {data.tickers.map((ticker) => (
          <div
            key={ticker.ticker}
            className="rounded-xl bg-white p-4 ring-1 ring-stone-200/60"
          >
            <div className="flex items-center gap-4">
              <ProgressRing
                percentage={ticker.overallPercentage}
                size={64}
                strokeWidth={5}
              />
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-stone-800">
                  {ticker.ticker}
                </p>
                <p className="text-xs text-stone-500">
                  {ticker.overallPercentage}% explored
                </p>
              </div>
            </div>

            <div className="mt-3 border-t border-stone-100 pt-3">
              <StockProgressDetail
                ticker={ticker}
                isExpanded={expandedTicker === ticker.ticker}
                onToggle={() =>
                  setExpandedTicker(
                    expandedTicker === ticker.ticker ? null : ticker.ticker
                  )
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
