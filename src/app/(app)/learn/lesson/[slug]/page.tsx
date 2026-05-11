"use client";

import { use } from "react";
import { LessonPlayer } from "@/components/learn/lesson-player";

export default function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <LessonPlayer slug={slug} />;
}
