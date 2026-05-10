"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, BarChart3 } from "lucide-react";

const tabs = [
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/progress", label: "Progress", icon: BarChart3 },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-amber-200/60 bg-amber-50/80 backdrop-blur-lg"
    >
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-around">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              aria-label={label}
              className={`relative flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? "text-amber-800"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              <Icon
                className={`size-5 transition-colors ${
                  isActive ? "text-amber-700" : ""
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span>{label}</span>
              {isActive && (
                <span className="absolute bottom-0 h-0.5 w-12 rounded-full bg-amber-700" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
