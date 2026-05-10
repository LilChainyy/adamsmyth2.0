"use client";

import { useQuery } from "@tanstack/react-query";
import { BookText } from "lucide-react";

interface JournalEntry {
  id: string;
  ticker: string;
  dimension: string;
  summary: string;
  key_takeaway: string;
  created_at: string;
}

const DIMENSION_LABELS: Record<string, string> = {
  business_model: "Business Model",
  financials: "Financials",
  competitive_position: "Competitive Position",
  risks: "Risks",
  news_catalysts: "News & Catalysts",
  valuation_context: "Valuation Context",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function JournalEntries({ ticker }: { ticker: string }) {
  const { data: entries, isLoading, isError } = useQuery<JournalEntry[]>({
    queryKey: ["journal", ticker],
    queryFn: async () => {
      const res = await fetch(`/api/journal?ticker=${ticker}`);
      if (!res.ok) throw new Error("Failed to fetch journal");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <BookText className="size-3.5 text-amber-700" />
          <h4 className="text-xs font-medium text-stone-500">Learning Journal</h4>
        </div>
        <div className="animate-pulse space-y-2">
          <div className="h-16 rounded-lg bg-stone-100" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600">
        Failed to load journal entries.
      </div>
    );
  }

  if (!entries || entries.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <BookText className="size-3.5 text-amber-700" />
        <h4 className="text-xs font-medium text-stone-500">Learning Journal</h4>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-lg bg-amber-50/50 p-3 ring-1 ring-amber-100"
          >
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span>{formatDate(entry.created_at)}</span>
              <span className="text-stone-300">·</span>
              <span>{DIMENSION_LABELS[entry.dimension] ?? entry.dimension}</span>
            </div>
            <p className="mt-1 text-sm text-stone-700">{entry.summary}</p>
            <p className="mt-1.5 text-xs font-medium text-amber-800">
              Key takeaway: {entry.key_takeaway}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
