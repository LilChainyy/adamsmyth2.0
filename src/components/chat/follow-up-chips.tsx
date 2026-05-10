"use client";

import { useEffect, useState } from "react";

interface FollowUpChipsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
  visible: boolean;
}

export function FollowUpChips({ suggestions, onSelect, visible }: FollowUpChipsProps) {
  const [show, setShow] = useState(false);

  // Stagger the fade-in after mount
  useEffect(() => {
    if (!visible || suggestions.length === 0) {
      setShow(false);
      return;
    }
    const timer = setTimeout(() => setShow(true), 150);
    return () => clearTimeout(timer);
  }, [visible, suggestions]);

  if (!visible || suggestions.length === 0) return null;

  return (
    <div
      className={`flex flex-wrap gap-2 pl-1 transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      {suggestions.map((text) => (
        <button
          key={text}
          onClick={() => onSelect(text)}
          className="rounded-full border border-amber-200 bg-white px-3 py-1.5 text-xs text-stone-600 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-stone-800 active:scale-95"
        >
          {text}
        </button>
      ))}
    </div>
  );
}
