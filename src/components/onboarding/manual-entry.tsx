"use client";

import { useState } from "react";
import { Plus, X, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSavePortfolio, type PortfolioHolding } from "@/hooks/use-save-portfolio";

interface ManualEntryProps {
  onBack: () => void;
}

export function ManualEntry({ onBack }: ManualEntryProps) {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [ticker, setTicker] = useState("");
  const [shares, setShares] = useState("");
  const [costBasis, setCostBasis] = useState("");
  const { savePortfolio, saving, error, setError } = useSavePortfolio();

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

    const newHolding: PortfolioHolding = { ticker: normalizedTicker };
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

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-stone-800">Add your stocks</h2>
        <p className="mt-1 text-sm text-stone-500">
          Shares and cost basis are optional — you can update them later.
        </p>
      </div>

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

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={() => savePortfolio(holdings)}
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
  );
}
