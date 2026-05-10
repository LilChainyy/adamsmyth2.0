"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Keyboard, Upload, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Holding {
  ticker: string;
  shares?: number;
  avg_cost_basis?: number;
}

export function PortfolioUpload() {
  const router = useRouter();
  const [step, setStep] = useState<"choose" | "manual">("choose");
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [ticker, setTicker] = useState("");
  const [shares, setShares] = useState("");
  const [costBasis, setCostBasis] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleAddStock() {
    const normalizedTicker = ticker.trim().toUpperCase();
    if (!normalizedTicker) {
      setError("Enter a ticker symbol");
      return;
    }
    if (holdings.some((h) => h.ticker === normalizedTicker)) {
      setError(`${normalizedTicker} is already in your list`);
      return;
    }

    const newHolding: Holding = { ticker: normalizedTicker };
    if (shares) newHolding.shares = parseFloat(shares);
    if (costBasis) newHolding.avg_cost_basis = parseFloat(costBasis);

    setHoldings([...holdings, newHolding]);
    setTicker("");
    setShares("");
    setCostBasis("");
    setError(null);
  }

  function handleRemoveStock(tickerToRemove: string) {
    setHoldings(holdings.filter((h) => h.ticker !== tickerToRemove));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddStock();
    }
  }

  async function handleContinue() {
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

      router.push("/chat");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        <div className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
          step === "choose" ? "bg-amber-700 text-white" : "bg-amber-200 text-amber-800"
        }`}>
          1
        </div>
        <div className="h-0.5 flex-1 bg-amber-200">
          <div className={`h-full bg-amber-700 transition-all ${
            step === "manual" ? "w-full" : "w-0"
          }`} />
        </div>
        <div className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
          step === "manual" ? "bg-amber-700 text-white" : "bg-amber-200 text-amber-800"
        }`}>
          2
        </div>
      </div>
      <p className="text-xs text-stone-500">
        Step {step === "choose" ? "1" : "2"} of 2
      </p>

      {step === "choose" && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-800">
              Let&apos;s start by adding your stocks
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              We&apos;ll use these to personalize your learning journey.
            </p>
          </div>

          <Card
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => setStep("manual")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-100 p-2">
                  <Keyboard className="size-5 text-amber-700" />
                </div>
                <div>
                  <CardTitle>Type them in</CardTitle>
                  <CardDescription>Manually add your stock tickers</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="opacity-60">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-stone-100 p-2">
                  <Upload className="size-5 text-stone-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle>Upload CSV</CardTitle>
                    <Badge variant="secondary" className="text-[10px]">
                      Coming soon
                    </Badge>
                  </div>
                  <CardDescription>Import from your brokerage export</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}

      {step === "manual" && (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-bold text-stone-800">Add your stocks</h2>
            <p className="mt-1 text-sm text-stone-500">
              Shares and cost basis are optional — you can update them later.
            </p>
          </div>

          {/* Add stock form */}
          <div className="flex flex-col gap-3 rounded-xl border border-amber-200/60 bg-white p-4">
            <div className="space-y-1.5">
              <Label htmlFor="ticker">Ticker</Label>
              <Input
                id="ticker"
                placeholder="e.g. AAPL"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                onKeyDown={handleKeyDown}
                className="uppercase"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="shares">Shares</Label>
                <Input
                  id="shares"
                  type="number"
                  placeholder="Optional"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  onKeyDown={handleKeyDown}
                  min="0"
                  step="any"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="costBasis">Avg cost</Label>
                <Input
                  id="costBasis"
                  type="number"
                  placeholder="Optional"
                  value={costBasis}
                  onChange={(e) => setCostBasis(e.target.value)}
                  onKeyDown={handleKeyDown}
                  min="0"
                  step="any"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleAddStock}
              className="w-full"
            >
              <Plus className="size-4" data-icon="inline-start" />
              Add stock
            </Button>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {/* Holdings list */}
          {holdings.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-stone-600">
                Your stocks ({holdings.length})
              </p>
              {holdings.map((h) => (
                <div
                  key={h.ticker}
                  className="flex items-center justify-between rounded-lg border border-amber-100 bg-white px-4 py-3"
                >
                  <div>
                    <span className="font-semibold text-stone-800">
                      {h.ticker}
                    </span>
                    {h.shares && (
                      <span className="ml-2 text-sm text-stone-500">
                        {h.shares} shares
                      </span>
                    )}
                    {h.avg_cost_basis && (
                      <span className="ml-2 text-sm text-stone-500">
                        @ ${h.avg_cost_basis}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveStock(h.ticker)}
                    className="rounded p-1 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep("choose")}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleContinue}
              disabled={holdings.length === 0 || saving}
              className="flex-1 bg-amber-700 hover:bg-amber-800"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
                  Saving...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="size-4" data-icon="inline-end" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
