"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckpointData {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  ticker: string;
  dimension: string;
  sub_topic: string;
}

interface LearningCheckpointProps {
  data: CheckpointData;
  onAnswer: (correct: boolean, data: CheckpointData) => void;
}

export function LearningCheckpoint({ data, onAnswer }: LearningCheckpointProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const isCorrect = selected === data.correct_index;

  function handleSelect(index: number) {
    if (answered) return;
    setSelected(index);
    onAnswer(index === data.correct_index, data);
  }

  return (
    <div className="my-2 overflow-hidden rounded-xl border border-amber-200/60 bg-white">
      {/* Question */}
      <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white px-4 py-3">
        <p className="text-[10px] font-medium uppercase tracking-wide text-amber-600">
          Quick Check
        </p>
        <p className="mt-1 text-sm font-medium leading-snug text-stone-800">
          {data.question}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-1.5 p-3">
        {data.options.map((option, i) => {
          const isThis = selected === i;
          const isCorrectOption = i === data.correct_index;

          let optionStyle = "border-stone-200 bg-stone-50/50 hover:border-amber-300 hover:bg-amber-50/50";
          if (answered) {
            if (isCorrectOption) {
              optionStyle = "border-emerald-300 bg-emerald-50";
            } else if (isThis && !isCorrect) {
              optionStyle = "border-red-300 bg-red-50";
            } else {
              optionStyle = "border-stone-100 bg-stone-50/30 opacity-50";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={cn(
                "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                answered ? "cursor-default" : "cursor-pointer",
                optionStyle
              )}
            >
              {/* Letter indicator */}
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                  answered && isCorrectOption
                    ? "bg-emerald-500 text-white"
                    : answered && isThis && !isCorrect
                      ? "bg-red-400 text-white"
                      : "bg-stone-200 text-stone-500"
                )}
              >
                {answered && isCorrectOption ? (
                  <Check className="size-3" />
                ) : answered && isThis && !isCorrect ? (
                  <X className="size-3" />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>

              <span
                className={cn(
                  "flex-1",
                  answered && isCorrectOption
                    ? "font-medium text-emerald-800"
                    : answered && isThis && !isCorrect
                      ? "text-red-700"
                      : "text-stone-700"
                )}
              >
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explanation — shown after answering */}
      {answered && (
        <div
          className={cn(
            "border-t px-4 py-3",
            isCorrect
              ? "border-emerald-100 bg-emerald-50/50"
              : "border-amber-100 bg-amber-50/50"
          )}
        >
          <p
            className={cn(
              "text-xs font-medium",
              isCorrect ? "text-emerald-700" : "text-amber-800"
            )}
          >
            {isCorrect ? "Correct!" : "Not quite — but that's okay!"}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-stone-600">
            {data.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
