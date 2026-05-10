"use client";

import { useState, useEffect, useCallback } from "react";
import { RotateCw } from "lucide-react";

interface StockBrief {
  ticker: string;
  headline: string;
  so_what: string;
  follow_up_prompt: string;
}

interface BriefingData {
  market_mood: string;
  stocks: StockBrief[];
}

interface PortfolioPulseProps {
  onAsk: (prompt: string) => void;
}

export function PortfolioPulse({ onAsk }: PortfolioPulseProps) {
  const [data, setData] = useState<BriefingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);

  const fetchBriefing = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/briefing");
      if (!res.ok) { setHidden(true); return; }
      const json = await res.json();
      if (!json.pulse) { setHidden(true); return; }
      setData(json.pulse);
      setHidden(false);
    } catch {
      setHidden(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBriefing(); }, [fetchBriefing]);

  if (hidden && !loading) return null;

  if (loading) {
    return (
      <div className="mx-4 mt-2 animate-pulse rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-200/60">
        <div className="h-3 w-16 rounded bg-stone-100" />
        <div className="mt-2 h-4 w-full rounded bg-stone-100" />
        <div className="mt-2 h-4 w-3/4 rounded bg-stone-100" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mx-4 mt-2 rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-200/60">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-stone-400">This week</p>
          <p className="mt-1 line-clamp-2 text-sm text-stone-700">
            {data.market_mood}
          </p>
        </div>
        <button
          onClick={fetchBriefing}
          aria-label="Refresh briefing"
          className="ml-2 shrink-0 rounded-md p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
        >
          <RotateCw className="size-3" />
        </button>
      </div>

      {data.stocks.map((stock) => (
        <div
          key={stock.ticker}
          className="mt-3 border-t border-stone-100 pt-3"
        >
          <p className="text-xs font-semibold text-amber-800">
            {stock.ticker}
          </p>
          <p className="mt-0.5 line-clamp-1 text-sm text-stone-800">
            {stock.headline}
          </p>
          <p className="mt-0.5 line-clamp-1 text-xs text-stone-500">
            {stock.so_what}
          </p>
          <button
            onClick={() => onAsk(stock.follow_up_prompt)}
            className="mt-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs text-stone-700 transition-colors hover:bg-amber-100"
          >
            {stock.follow_up_prompt}
          </button>
        </div>
      ))}
    </div>
  );
}
