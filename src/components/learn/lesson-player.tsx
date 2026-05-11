"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Check, X as XIcon } from "lucide-react";

interface TeachCard { type: "teach"; content: string; highlight: string }
interface QuizCard { type: "quiz"; question: string; options: string[]; correct_index: number; explanation: string; dimension: string; sub_topic: string }
type Card = TeachCard | QuizCard;
interface Lesson { lesson_title: string; lesson_intro: string; cards: Card[]; lesson_complete_message: string }

export function LessonPlayer({ slug }: { slug: string }) {
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [answers, setAnswers] = useState<Record<number, { selected: number; correct: boolean }>>({});
  const [sliding, setSliding] = useState(false);

  useEffect(() => {
    fetch(`/api/lessons?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => { setLesson(data); setLoading(false); });
  }, [slug]);

  useEffect(() => {
    if (lesson && currentIndex >= lesson.cards.length) {
      const quizCount = lesson.cards.filter((c) => c.type === "quiz").length;
      const correct = Object.values(answers).filter((a) => a.correct).length;
      fetch("/api/lessons/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, score: correct, total: quizCount }),
      });
    }
  }, [currentIndex, lesson, slug, answers]);

  function advance() {
    setSliding(true);
    setTimeout(() => { setCurrentIndex((i) => i + 1); setSliding(false); }, 200);
  }

  function handleAnswer(cardIdx: number, optIdx: number, card: QuizCard) {
    const correct = optIdx === card.correct_index;
    setAnswers((prev) => ({ ...prev, [cardIdx]: { selected: optIdx, correct } }));
    if (correct) {
      fetch("/api/progress/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subTopicId: card.sub_topic, status: "completed", evidence: `Answered correctly in lesson: ${slug}` }),
      });
    }
  }

  // Loading
  if (loading || !lesson) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        <p className="mt-3 text-sm text-stone-400">Preparing your lesson...</p>
      </div>
    );
  }

  const totalCards = lesson.cards.length;
  const quizCards = lesson.cards.filter((c) => c.type === "quiz");
  const correctCount = Object.values(answers).filter((a) => a.correct).length;

  // Intro
  if (currentIndex === -1) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Lesson</span>
        <h1 className="mt-4 text-center text-2xl font-bold text-stone-800">{lesson.lesson_title}</h1>
        <p className="mt-2 max-w-[280px] text-center text-sm text-stone-500">{lesson.lesson_intro}</p>
        <button onClick={() => setCurrentIndex(0)} className="mt-8 w-full max-w-[280px] rounded-xl bg-amber-600 py-3.5 text-sm font-semibold text-white">
          Start Lesson
        </button>
      </div>
    );
  }

  // Completion
  if (currentIndex >= totalCards) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
          <Check className="size-12 text-emerald-500" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-stone-800">Lesson Complete!</h2>
        <p className="mt-2 max-w-[260px] text-center text-sm text-stone-500">{lesson.lesson_complete_message}</p>
        <span className="mt-4 rounded-full bg-stone-100 px-4 py-1.5 text-sm text-stone-600">{correctCount} of {quizCards.length} correct</span>
        <p className="mt-2 text-xs text-stone-400">🔥 Keep your streak going!</p>
        <button onClick={() => router.push("/learn")} className="mt-8 w-full max-w-[280px] rounded-xl bg-amber-600 py-3.5 text-sm font-semibold text-white">
          Continue Learning
        </button>
      </div>
    );
  }

  const card = lesson.cards[currentIndex];
  const answered = answers[currentIndex];

  return (
    <div className="flex flex-1 flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center bg-stone-50/90 px-4 py-3 backdrop-blur-sm">
        <button onClick={() => router.push("/learn")}><X className="size-5 text-stone-400" /></button>
        <div className="mx-4 h-1.5 flex-1 overflow-hidden rounded-full bg-stone-200">
          <div className="h-full rounded-full bg-amber-500 transition-all duration-300" style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }} />
        </div>
        <span className="text-xs text-stone-400">{currentIndex + 1}/{totalCards}</span>
      </div>

      {/* Card area */}
      <div className="flex flex-1 flex-col justify-center overflow-hidden px-4 py-6">
        <div className={`transition-all duration-200 ${sliding ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}>
          {card.type === "teach" ? (
            <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-stone-200/60">
              <div className="p-6">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-600">LEARN</span>
                <p className="mt-3 text-base leading-relaxed text-stone-700">{card.content}</p>
              </div>
              <div className="border-t border-amber-100 bg-amber-50/50 px-6 py-4">
                <p className="text-sm font-semibold text-amber-800">{card.highlight}</p>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-stone-200/60">
              <div className="p-6">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-600">QUIZ</span>
                <p className="mt-3 text-base font-medium text-stone-800">{card.question}</p>
                <div className="mt-4 flex flex-col gap-2.5">
                  {card.options.map((opt, i) => {
                    const letters = ["A", "B", "C", "D"];
                    let btnClass = "rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-left text-sm text-stone-700 flex items-center gap-3";
                    let circleClass = "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-200 text-xs font-bold text-stone-500";
                    let icon: React.ReactNode = letters[i];

                    if (answered) {
                      if (i === card.correct_index) {
                        btnClass = "rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-left text-sm text-emerald-800 flex items-center gap-3";
                        circleClass = "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white";
                        icon = <Check className="size-3.5" />;
                      } else if (i === answered.selected && !answered.correct) {
                        btnClass = "rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-left text-sm text-red-700 flex items-center gap-3";
                        circleClass = "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-400 text-white";
                        icon = <XIcon className="size-3.5" />;
                      } else {
                        btnClass += " opacity-40";
                      }
                    }

                    return (
                      <button key={i} className={btnClass} disabled={!!answered} onClick={() => handleAnswer(currentIndex, i, card)}>
                        <span className={circleClass}>{icon}</span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <div className={`mt-3 rounded-xl border px-4 py-3 ${answered.correct ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                    <span className={`text-xs font-semibold ${answered.correct ? "text-emerald-700" : "text-amber-700"}`}>
                      {answered.correct ? "Correct!" : "Not quite!"}
                    </span>
                    <p className="mt-1 text-xs text-stone-600">{card.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action button */}
        {(card.type === "teach" || answered) && (
          <button onClick={advance} className="mx-auto mt-4 w-full max-w-sm rounded-xl bg-amber-600 py-3.5 text-sm font-semibold text-white">
            {card.type === "teach" ? "Got it" : "Continue"}
          </button>
        )}
      </div>
    </div>
  );
}
