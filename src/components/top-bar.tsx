import Link from "next/link";
import { Settings } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-amber-200/60 bg-amber-50/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <h1 className="text-lg font-bold tracking-tight text-amber-900">
          AdamsMyth
        </h1>
        <Link
          href="/settings"
          aria-label="Settings"
          className="-mr-1.5 flex size-11 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-amber-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <Settings className="size-5" />
        </Link>
      </div>
    </header>
  );
}
