"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { StreakBadge } from "@/components/progress/StreakBadge";

interface Holding {
  id: string;
  ticker: string;
  company_name: string | null;
  shares: number | null;
}

export function MyPortfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [lessonCount, setLessonCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/portfolio").then((r) => r.json()),
      fetch("/api/lessons/completions").then((r) => r.json()),
    ]).then(([portfolioData, completionsData]) => {
      setHoldings(portfolioData.holdings ?? []);
      setLessonCount((completionsData.completions ?? []).length);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
      <h1 className="text-2xl font-bold text-stone-800">My Portfolio</h1>
      <p className="mt-0.5 text-sm text-stone-500">Your stocks power your lessons</p>

      <div className="mt-3">
        <StreakBadge />
      </div>

      {/* Stats row */}
      {!loading && (
        <div className="mt-3 flex justify-between rounded-xl bg-white px-4 py-3 ring-1 ring-stone-200/60">
          <span className="text-sm text-stone-600">{lessonCount}/24 lessons completed</span>
          <span className="text-sm text-stone-600">{holdings.length} stocks tracked</span>
        </div>
      )}

      {/* Holdings section */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-stone-800">Your Stocks</h2>
          {holdings.length > 0 && (
            <Link href="/settings" className="text-xs text-amber-600">Edit</Link>
          )}
        </div>

        {loading ? (
          <div className="mt-3 space-y-3">
            <div className="h-14 animate-pulse rounded-xl bg-white ring-1 ring-stone-200/60" />
            <div className="h-14 animate-pulse rounded-xl bg-white ring-1 ring-stone-200/60" />
          </div>
        ) : holdings.length === 0 ? (
          <div className="mt-6 flex flex-col items-center text-center">
            <Briefcase className="size-12 text-amber-200" />
            <p className="mt-3 text-sm text-stone-500">Add your first stocks to unlock personalized lessons</p>
            <Link href="/settings" className="mt-4 rounded-lg bg-amber-700 px-5 py-2.5 text-sm font-medium text-white">
              Add Stocks
            </Link>
          </div>
        ) : (
          <div className="mt-3 rounded-xl bg-white ring-1 ring-stone-200/60">
            {holdings.map((h, i) => (
              <div
                key={h.id}
                className={`flex items-center gap-3 px-4 py-3 ${i < holdings.length - 1 ? "border-b border-stone-100" : ""}`}
              >
                <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-sm font-bold text-amber-800">
                  {h.ticker}
                </span>
                <span className="flex-1 text-sm text-stone-700">{h.company_name ?? h.ticker}</span>
                {h.shares != null && (
                  <span className="text-xs text-stone-400">{h.shares} shares</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Portfolio snapshot */}
      {!loading && holdings.length > 0 && (
        <div className="mt-6">
          <h2 className="text-base font-semibold text-stone-800">Portfolio Snapshot</h2>
          <div className="mt-3 rounded-xl bg-white px-4 py-3 ring-1 ring-stone-200/60">
            <span className="text-sm text-stone-600">{holdings.length} {holdings.length === 1 ? "company" : "companies"}</span>
          </div>
        </div>
      )}

      <p className="mt-8 text-center text-xs text-stone-300">
        Looking for your learning progress? It&apos;s on the Learn tab now
      </p>
    </div>
  );
}
