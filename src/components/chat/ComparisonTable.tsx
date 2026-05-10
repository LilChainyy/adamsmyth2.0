"use client";

import type { CompetitorComparison } from "@/lib/financial-data";

interface ComparisonTableProps {
  data: CompetitorComparison;
}

function formatMarketCap(cap: number): string {
  if (cap >= 1_000_000_000_000) return `$${(cap / 1_000_000_000_000).toFixed(1)}T`;
  if (cap >= 1_000_000_000) return `$${(cap / 1_000_000_000).toFixed(0)}B`;
  if (cap >= 1_000_000) return `$${(cap / 1_000_000).toFixed(0)}M`;
  return `$${cap.toLocaleString()}`;
}

function formatPercent(value: number | null): string {
  if (value === null) return "—";
  return `${(value * 100).toFixed(1)}%`;
}

function formatPE(value: number | null): string {
  if (value === null) return "—";
  return value.toFixed(1);
}

export function ComparisonTable({ data }: ComparisonTableProps) {
  if (!data.peers || data.peers.length === 0) return null;

  return (
    <div className="my-2 overflow-hidden rounded-lg border border-stone-200 dark:border-stone-700">
      <div className="px-3 py-2 bg-stone-50 dark:bg-stone-800/50">
        <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
          Competitor Comparison &middot; {data.ticker}
        </p>
      </div>
      <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <table className="w-full min-w-[480px] text-xs" aria-label={`Competitor comparison for ${data.ticker}`}>
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-700 text-left text-stone-500 dark:text-stone-400">
              <th scope="col" className="px-3 py-2 font-medium">Company</th>
              <th scope="col" className="px-3 py-2 font-medium text-right">Market Cap</th>
              <th scope="col" className="px-3 py-2 font-medium text-right">P/E</th>
              <th scope="col" className="px-3 py-2 font-medium text-right">Rev Growth</th>
              <th scope="col" className="px-3 py-2 font-medium text-right">Op. Margin</th>
            </tr>
          </thead>
          <tbody>
            {data.peers.map((peer) => {
              const isTarget = peer.ticker === data.ticker;
              return (
                <tr
                  key={peer.ticker}
                  className={
                    isTarget
                      ? "bg-blue-50 dark:bg-blue-950/30 font-medium"
                      : "hover:bg-stone-50 dark:hover:bg-stone-800/30"
                  }
                >
                  <td className="px-3 py-2">
                    <span className="font-medium text-stone-800 dark:text-stone-200">
                      {peer.ticker}
                    </span>
                    <span className="ml-1.5 text-stone-500 dark:text-stone-400">
                      {peer.name.length > 20 ? `${peer.name.slice(0, 20)}…` : peer.name}
                    </span>
                    {isTarget && (
                      <span className="ml-1.5 text-[9px] font-medium text-blue-600 dark:text-blue-400 uppercase">
                        yours
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right text-stone-700 dark:text-stone-300">
                    {formatMarketCap(peer.marketCap)}
                  </td>
                  <td className="px-3 py-2 text-right text-stone-700 dark:text-stone-300">
                    {formatPE(peer.peRatio)}
                  </td>
                  <td className="px-3 py-2 text-right text-stone-700 dark:text-stone-300">
                    {formatPercent(peer.revenueGrowth)}
                  </td>
                  <td className="px-3 py-2 text-right text-stone-700 dark:text-stone-300">
                    {formatPercent(peer.margin)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
