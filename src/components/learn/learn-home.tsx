"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";
import { StreakBadge } from "@/components/progress/StreakBadge";
import { CURRICULUM } from "@/lib/curriculum";

export function LearnHome() {
  const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/lessons/completions")
      .then((r) => r.json())
      .then((data) => {
        const slugs = (data.completions ?? []).map((c: { lesson_slug: string }) => c.lesson_slug);
        setCompletedSlugs(new Set(slugs));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
      <h1 className="text-2xl font-bold text-stone-800">Learn</h1>
      <p className="mt-0.5 text-sm text-stone-500">Investing concepts, taught with your stocks</p>

      <div className="mt-3">
        <StreakBadge />
      </div>

      <div className="mt-5">
        {CURRICULUM.map((unit, ui) => {
          const doneCount = unit.lessons.filter((l) => completedSlugs.has(l.slug)).length;
          return (
            <div key={unit.unit} className={ui > 0 ? "mt-6" : ""}>
              {/* Unit header */}
              <div className="flex items-start gap-2.5">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-xs font-bold text-amber-800">
                  {unit.unit}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-stone-800">{unit.title}</h2>
                    <span className="text-xs text-amber-600">{doneCount}/{unit.lessons.length} completed</span>
                  </div>
                  <p className="text-xs text-stone-400">{unit.subtitle}</p>
                </div>
              </div>

              {/* Lesson cards */}
              <div className="mt-3 flex flex-col gap-2">
                {unit.lessons.map((lesson) => {
                  const done = completedSlugs.has(lesson.slug);
                  return (
                    <Link
                      key={lesson.id}
                      href={`/learn/lesson/${lesson.slug}`}
                      className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 ring-1 ring-stone-200/60"
                    >
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        done ? "bg-emerald-100 text-emerald-600" : "bg-stone-100 text-stone-500"
                      }`}>
                        {lesson.id}
                      </span>
                      <span className="flex-1 text-sm text-stone-700">{lesson.title}</span>
                      {done ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                          <Check className="size-3 text-emerald-600" />
                        </span>
                      ) : (
                        <ChevronRight className="size-4 text-stone-300" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
