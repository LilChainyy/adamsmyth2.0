"use client";

import { X } from "lucide-react";
import type { PortfolioHolding } from "@/hooks/use-save-portfolio";

interface HoldingsListProps {
  holdings: PortfolioHolding[];
  onRemove: (ticker: string) => void;
}

export function HoldingsList({ holdings, onRemove }: HoldingsListProps) {
  if (holdings.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-stone-600">
        Your stocks ({holdings.length})
      </p>
      {holdings.map((h) => (
        <div
          key={h.ticker}
          className="flex items-center justify-between rounded-lg border border-amber-100 bg-white px-4 py-3"
        >
          <div>
            <span className="font-semibold text-stone-800">
              {h.ticker}
            </span>
            {h.shares && (
              <span className="ml-2 text-sm text-stone-500">
                {h.shares} shares
              </span>
            )}
            {h.avg_cost_basis && (
              <span className="ml-2 text-sm text-stone-500">
                @ ${h.avg_cost_basis}
              </span>
            )}
          </div>
          <button
            onClick={() => onRemove(h.ticker)}
            className="rounded p-1 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
