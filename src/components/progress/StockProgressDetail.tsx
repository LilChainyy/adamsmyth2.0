"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { DimensionBar } from "@/components/progress/DimensionBar";
import type { TickerProgress } from "@/lib/progress";

interface StockProgressDetailProps {
  ticker: TickerProgress;
  isExpanded: boolean;
  onToggle: () => void;
}

export function StockProgressDetail({
  ticker,
  isExpanded,
  onToggle,
}: StockProgressDetailProps) {
  return (
    <div className="space-y-4">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-medium text-amber-700">
          {isExpanded ? "Hide details" : "Show details"}
        </span>
        {isExpanded ? (
          <ChevronUp className="size-4 text-amber-700" />
        ) : (
          <ChevronDown className="size-4 text-amber-700" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-5">
          {ticker.dimensions.map((dim) => (
            <DimensionBar key={dim.dimension} dimension={dim} />
          ))}

          <Link
            href="/chat"
            className="flex items-center justify-center gap-2 rounded-lg bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-100"
          >
            <MessageSquare className="size-4" />
            Learn more about {ticker.ticker}
          </Link>
        </div>
      )}
    </div>
  );
}
