"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import type { StockProfile } from "@/lib/financial-data";

interface StockCardProps {
  data: StockProfile;
}

function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

export function StockCard({ data }: StockCardProps) {
  const isPositive = data.changesPercentage >= 0;

  return (
    <div className="my-2 overflow-hidden rounded-xl border border-amber-200/60 bg-gradient-to-br from-white to-amber-50/50">
      <div className="flex items-start justify-between p-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
              {data.symbol}
            </span>
            <span className="truncate text-xs text-stone-500">{data.exchange}</span>
          </div>
          <p className="mt-1 truncate text-sm font-medium text-stone-800">
            {data.companyName}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-stone-800">
            ${data.price.toFixed(2)}
          </p>
          <div
            className={`flex items-center justify-end gap-0.5 text-xs font-medium ${
              isPositive ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            {isPositive ? "+" : ""}
            {data.changesPercentage.toFixed(2)}%
          </div>
        </div>
      </div>
      <div className="flex divide-x divide-amber-100 border-t border-amber-100 bg-amber-50/40">
        <div className="flex-1 px-3 py-2 text-center">
          <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Mkt Cap
          </p>
          <p className="text-xs font-semibold text-stone-700">
            {formatMarketCap(data.marketCap)}
          </p>
        </div>
        <div className="flex-1 px-3 py-2 text-center">
          <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Sector
          </p>
          <p className="truncate text-xs font-semibold text-stone-700">
            {data.sector}
          </p>
        </div>
        <div className="flex-1 px-3 py-2 text-center">
          <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Beta
          </p>
          <p className="text-xs font-semibold text-stone-700">
            {data.beta.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
