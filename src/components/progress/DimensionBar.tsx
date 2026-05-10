"use client";

import { CheckCircle2, Circle } from "lucide-react";
import type { DimensionProgress } from "@/lib/progress";
import { DIMENSIONS } from "@/lib/learning-framework";
import { getProgressColors } from "@/lib/utils";

interface DimensionBarProps {
  dimension: DimensionProgress;
}

export function DimensionBar({ dimension }: DimensionBarProps) {
  const def = DIMENSIONS[dimension.dimension];
  const colors = getProgressColors(dimension.percentage);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-stone-700">
          {dimension.label}
        </span>
        <span className="text-xs text-stone-500">
          {dimension.completed}/{dimension.total}
        </span>
      </div>
      <div
        className={`h-2 w-full overflow-hidden rounded-full ${colors.barTrack}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colors.bar}`}
          style={{ width: `${dimension.percentage}%` }}
        />
      </div>
      <div className="space-y-1 pl-1">
        {def.subTopics.map((st) => {
          const progress = dimension.subTopics.find(
            (s) => s.subTopicId === st.id
          );
          const completed = progress?.status === "completed";
          return (
            <div key={st.id} className="flex items-center gap-2">
              {completed ? (
                <CheckCircle2 className="size-3.5 text-emerald-500" />
              ) : (
                <Circle className="size-3.5 text-stone-300" />
              )}
              <span
                className={`text-xs ${completed ? "text-stone-700" : "text-stone-400"}`}
              >
                {st.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
