import { SupabaseClient } from "@supabase/supabase-js";
import {
  DIMENSIONS,
  ALL_DIMENSIONS,
  getAllSubTopics,
  type LearningDimension,
  type LearningStatus,
} from "@/lib/learning-framework";
import { getPortfolioId } from "@/lib/supabase/queries";

export interface SubTopicProgress {
  subTopicId: string;
  dimension: LearningDimension;
  status: LearningStatus;
  completedAt: string | null;
  evidence: string | null;
}

export interface DimensionProgress {
  dimension: LearningDimension;
  label: string;
  weight: number;
  completed: number;
  total: number;
  percentage: number;
  subTopics: SubTopicProgress[];
}

export interface TickerProgress {
  ticker: string;
  dimensions: DimensionProgress[];
  overallPercentage: number;
}

export interface OverallProgress {
  tickers: TickerProgress[];
  literacyScore: number;
}

export function calculateDimensionProgress(
  completed: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

function buildDimensionProgress(
  rows: Array<{
    dimension: LearningDimension;
    sub_topic: string;
    status: LearningStatus;
    completed_at: string | null;
    evidence: string | null;
  }>
): DimensionProgress[] {
  return ALL_DIMENSIONS.map((dim) => {
    const dimRows = rows.filter((r) => r.dimension === dim.id);
    const subTopics: SubTopicProgress[] = dim.subTopics.map((st) => {
      const row = dimRows.find((r) => r.sub_topic === st.id);
      return {
        subTopicId: st.id,
        dimension: dim.id,
        status: row?.status ?? "not_started",
        completedAt: row?.completed_at ?? null,
        evidence: row?.evidence ?? null,
      };
    });

    const completed = subTopics.filter((s) => s.status === "completed").length;
    const total = dim.subTopics.length;

    return {
      dimension: dim.id,
      label: dim.label,
      weight: dim.weight,
      completed,
      total,
      percentage: calculateDimensionProgress(completed, total),
      subTopics,
    };
  });
}

function calculateWeightedScore(dimensions: DimensionProgress[]): number {
  const weighted = dimensions.reduce((sum, dim) => {
    return sum + (dim.percentage / 100) * dim.weight;
  }, 0);
  return Math.round(weighted * 100);
}

export async function getProgressByTicker(
  supabase: SupabaseClient,
  userId: string,
  ticker: string
): Promise<TickerProgress> {
  const { data: rows, error } = await supabase
    .from("learning_progress")
    .select("dimension, sub_topic, status, completed_at, evidence")
    .eq("user_id", userId)
    .eq("ticker", ticker.toUpperCase());

  if (error) throw error;

  const dimensions = buildDimensionProgress(rows ?? []);

  return {
    ticker: ticker.toUpperCase(),
    dimensions,
    overallPercentage: calculateWeightedScore(dimensions),
  };
}

export async function getOverallProgress(
  supabase: SupabaseClient,
  userId: string
): Promise<OverallProgress> {
  const portfolioId = await getPortfolioId(supabase, userId);
  if (!portfolioId) {
    return { tickers: [], literacyScore: 0 };
  }

  const { data: holdings } = await supabase
    .from("holdings")
    .select("ticker, portfolio_id")
    .eq("portfolio_id", portfolioId);

  const tickers = [...new Set((holdings ?? []).map((h) => h.ticker))];

  if (tickers.length === 0) {
    return { tickers: [], literacyScore: 0 };
  }

  const { data: rows, error } = await supabase
    .from("learning_progress")
    .select("ticker, dimension, sub_topic, status, completed_at, evidence")
    .eq("user_id", userId)
    .in("ticker", tickers);

  if (error) throw error;

  const tickerProgressList: TickerProgress[] = tickers.map((ticker) => {
    const tickerRows = (rows ?? []).filter((r) => r.ticker === ticker);
    const dimensions = buildDimensionProgress(tickerRows);
    return {
      ticker,
      dimensions,
      overallPercentage: calculateWeightedScore(dimensions),
    };
  });

  const literacyScore =
    tickerProgressList.length > 0
      ? Math.round(
          tickerProgressList.reduce((sum, t) => sum + t.overallPercentage, 0) /
            tickerProgressList.length
        )
      : 0;

  return { tickers: tickerProgressList, literacyScore };
}

export async function initializeProgressForTicker(
  supabase: SupabaseClient,
  userId: string,
  ticker: string
): Promise<void> {
  const allSubTopics = getAllSubTopics();

  const rows = allSubTopics.map((st) => ({
    user_id: userId,
    ticker: ticker.toUpperCase(),
    dimension: st.dimension,
    sub_topic: st.id,
    status: "not_started" as const,
  }));

  const { error } = await supabase
    .from("learning_progress")
    .upsert(rows, { onConflict: "user_id,ticker,dimension,sub_topic" });

  if (error) throw error;
}
