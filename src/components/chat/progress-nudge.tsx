"use client";

interface ProgressNudgeProps {
  ticker: string;
  dimension: string;
  subTopic: string;
}

// Map dimension IDs to readable labels
const DIMENSION_LABELS: Record<string, string> = {
  business_model: "Business Model",
  financials: "Financials",
  competitive_position: "Competitive Position",
  risks: "Risks",
  news_catalysts: "News & Catalysts",
  valuation_context: "Valuation Context",
};

export function ProgressNudge({
  ticker,
  dimension,
  subTopic,
}: ProgressNudgeProps) {
  const label = DIMENSION_LABELS[dimension] ?? dimension;
  const subtopicLabel = subTopic.replace(/_/g, " ");

  return (
    <div className="my-2 flex items-center gap-2.5 rounded-lg border border-emerald-200/60 bg-emerald-50/50 px-3 py-2">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm">
        &#127919;
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-emerald-800">
          Progress updated for {ticker}
        </p>
        <p className="text-[10px] text-emerald-600">
          {label} &middot; {subtopicLabel}
        </p>
      </div>
    </div>
  );
}
