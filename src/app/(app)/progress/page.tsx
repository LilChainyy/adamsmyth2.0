import { BarChart3 } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-24">
      <div className="rounded-full bg-amber-100 p-4">
        <BarChart3 className="size-8 text-amber-700" />
      </div>
      <h2 className="text-lg font-semibold text-stone-800">Progress coming soon</h2>
      <p className="text-center text-sm text-stone-500">
        Track your learning journey across every stock you explore.
      </p>
    </div>
  );
}
