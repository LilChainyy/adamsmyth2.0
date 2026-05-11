"use client";

import { StockCard } from "@/components/chat/stock-card";
import { FinancialSnapshot } from "@/components/chat/financial-snapshot";
import { NewsCard } from "@/components/chat/news-card";
import { ComparisonTable } from "@/components/chat/ComparisonTable";
import { LearningCheckpoint, type CheckpointData } from "@/components/chat/learning-checkpoint";
import type { StockProfile, StockFinancials, StockNews, CompetitorComparison } from "@/lib/financial-data";

interface ToolPartRendererProps {
  toolName: string;
  state: string;
  input: unknown;
  output: unknown;
  onCheckpointAnswer?: (correct: boolean, data: CheckpointData) => void;
}

export function ToolPartRenderer({
  toolName,
  state,
  input,
  output,
  onCheckpointAnswer,
}: ToolPartRendererProps) {
  if (state !== "output-available" || !output) return null;

  switch (toolName) {
    case "get_stock_profile":
      return <StockCard data={output as StockProfile} />;

    case "get_financials":
      return <FinancialSnapshot data={output as StockFinancials} />;

    case "get_news": {
      const news = output as StockNews;
      if (!news.articles || news.articles.length === 0) return null;
      return (
        <div className="my-2 space-y-1.5">
          <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Recent News &middot; {news.ticker}
          </p>
          {news.articles.map((article, i) => (
            <NewsCard key={`${article.url}-${i}`} article={article} />
          ))}
        </div>
      );
    }

    case "get_competitors":
      return <ComparisonTable data={output as CompetitorComparison} />;

    case "update_learning_progress":
      return null;

    case "present_learning_checkpoint": {
      const checkpoint = output as CheckpointData;
      if (!checkpoint.question || !checkpoint.options) return null;
      return (
        <LearningCheckpoint
          data={checkpoint}
          onAnswer={onCheckpointAnswer ?? (() => {})}
        />
      );
    }

    default:
      return null;
  }
}
