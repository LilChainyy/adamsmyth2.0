"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Settings, ChevronDown } from "lucide-react";
import { ASSET_CLASSES } from "@/lib/asset-classes";

export function TopBar() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const active = ASSET_CLASSES.find((c) => c.enabled)!;

  return (
    <header className="sticky top-0 z-40 border-b border-amber-200/60 bg-amber-50/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <h1 className="text-lg font-bold tracking-tight text-amber-900">
            AdamsMyth
          </h1>

          <div className="relative">
            <button
              ref={triggerRef}
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-200/70"
            >
              {active.label}
              <ChevronDown
                className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>

            {open && (
              <div
                ref={dropdownRef}
                className="absolute left-0 top-full mt-2 min-w-[200px] rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-stone-200/60"
              >
                {ASSET_CLASSES.map((cls) => (
                  <button
                    key={cls.id}
                    disabled={!cls.enabled}
                    onClick={() => {
                      if (cls.enabled) setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm ${
                      cls.enabled
                        ? "bg-amber-50 font-medium text-amber-800"
                        : "cursor-not-allowed text-stone-300"
                    }`}
                  >
                    {cls.label}
                    {!cls.enabled && (
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] text-stone-300">
                        Coming Soon
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

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
