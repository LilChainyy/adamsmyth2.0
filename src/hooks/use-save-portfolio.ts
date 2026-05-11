"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface PortfolioHolding {
  ticker: string;
  shares?: number;
  avg_cost_basis?: number;
}

export function useSavePortfolio() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function savePortfolio(holdings: PortfolioHolding[]) {
    if (holdings.length === 0) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ holdings }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(typeof data.error === "string" ? data.error : "Failed to save portfolio");
        setSaving(false);
        return;
      }

      router.push("/learn");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return { savePortfolio, saving, error, setError };
}
