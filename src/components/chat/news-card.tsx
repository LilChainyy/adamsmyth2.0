"use client";

import { ExternalLink } from "lucide-react";
import type { StockNewsArticle } from "@/lib/financial-data";

interface NewsCardProps {
  article: StockNewsArticle;
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-1 block rounded-xl border border-amber-200/60 bg-white p-3 transition-colors hover:bg-amber-50/50"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-snug text-stone-800">
            {article.title}
          </p>
          <div className="mt-1 flex items-center gap-2 text-[10px] text-stone-400">
            <span className="font-medium text-stone-500">{article.source}</span>
            <span>&middot;</span>
            <span>{formatDate(article.date)}</span>
          </div>
        </div>
        <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-stone-300" />
      </div>
      {article.summary && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-stone-500">
          {article.summary}
        </p>
      )}
    </a>
  );
}
