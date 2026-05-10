"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import type { StockFinancials } from "@/lib/financial-data";

interface FinancialSnapshotProps {
  data: StockFinancials;
}

function formatLargeNumber(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
  return `$${value.toLocaleString()}`;
}

function formatPercent(value: number | null): string {
  if (value === null) return "—";
  return `${(value * 100).toFixed(1)}%`;
}

export function FinancialSnapshot({ data }: FinancialSnapshotProps) {
  const latest = data.annual[0];
  if (!latest) return null;

  const netMargin =
    latest.revenue > 0 ? latest.netIncome / latest.revenue : null;
  const revenueGrowth = latest.revenueGrowthYoY;
  const growthPositive = revenueGrowth !== null && revenueGrowth >= 0;

  // Revenue bars — show all years, scaled to the max
  const revenues = data.annual.map((a) => a.revenue);
  const maxRevenue = Math.max(...revenues, 1);

  return (
    <div className="my-2 overflow-hidden rounded-xl border border-amber-200/60 bg-gradient-to-br from-white to-amber-50/50">
      <div className="flex items-center justify-between border-b border-amber-100 px-3 py-2">
        <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
          {data.ticker}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
          Financial Snapshot
        </span>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-px bg-amber-100/40 p-px">
        <MetricCell
          label="Revenue"
          value={formatLargeNumber(latest.revenue)}
          sub={
            revenueGrowth !== null ? (
              <span
                className={`flex items-center gap-0.5 ${
                  growthPositive ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {growthPositive ? (
                  <TrendingUp className="size-2.5" />
                ) : (
                  <TrendingDown className="size-2.5" />
                )}
                {growthPositive ? "+" : ""}
                {(revenueGrowth * 100).toFixed(1)}% YoY
              </span>
            ) : null
          }
        />
        <MetricCell
          label="Net Margin"
          value={formatPercent(netMargin)}
        />
        <MetricCell
          label="P/E Ratio"
          value={
            data.ratios.peRatio !== null
              ? data.ratios.peRatio.toFixed(1)
              : "—"
          }
        />
        <MetricCell
          label="Gross Margin"
          value={formatPercent(latest.grossMargin)}
        />
      </div>

      {/* Mini revenue chart */}
      <div className="border-t border-amber-100 px-3 py-2">
        <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-stone-400">
          Annual Revenue
        </p>
        <div className="flex items-end gap-1.5">
          {[...data.annual].reverse().map((a) => {
            const height = Math.max((a.revenue / maxRevenue) * 36, 3);
            return (
              <div key={a.year} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-sm bg-amber-400/70"
                  style={{ height: `${height}px` }}
                />
                <span className="text-[9px] text-stone-400">{a.year}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MetricCell({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: React.ReactNode;
}) {
  return (
    <div className="bg-white px-3 py-2">
      <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
        {label}
      </p>
      <p className="text-sm font-semibold text-stone-800">{value}</p>
      {sub && <div className="text-[10px] font-medium">{sub}</div>}
    </div>
  );
}
