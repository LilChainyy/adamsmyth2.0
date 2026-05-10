"use client";

import { useQuery } from "@tanstack/react-query";
import { Flame, Trophy } from "lucide-react";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
}

export function StreakBadge() {
  const { data, isLoading } = useQuery<StreakData>({
    queryKey: ["streaks"],
    queryFn: async () => {
      const res = await fetch("/api/streaks");
      if (!res.ok) throw new Error("Failed to fetch streaks");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="h-14 animate-pulse rounded-xl bg-amber-50 ring-1 ring-amber-200/60" />
    );
  }

  if (!data || data.currentStreak === 0) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-4 ring-1 ring-amber-200/60">
      <div className="flex items-center gap-1.5">
        <Flame className="size-5 text-orange-500" />
        <span className="text-base font-semibold text-stone-800">
          {data.currentStreak}-day learning streak
        </span>
      </div>
      {data.longestStreak > data.currentStreak && (
        <div className="ml-auto flex items-center gap-1 text-xs text-stone-500">
          <Trophy className="size-3.5" />
          <span>Best: {data.longestStreak}</span>
        </div>
      )}
    </div>
  );
}
