"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CSVPreviewRow } from "@/components/onboarding/csv-preview-row";
import type { ParsedHolding } from "@/lib/csv-parser";

interface CSVPreviewTableProps {
  holdings: ParsedHolding[];
  format: string;
  warnings: string[];
  saving: boolean;
  error: string | null;
  onHoldingsChange: (holdings: ParsedHolding[]) => void;
  onConfirm: () => void;
  onReset: () => void;
}

export function CSVPreviewTable({
  holdings,
  format,
  warnings,
  saving,
  error,
  onHoldingsChange,
  onConfirm,
  onReset,
}: CSVPreviewTableProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({ ticker: "", shares: "", cost: "" });

  function startEdit(index: number) {
    const h = holdings[index];
    setEditingIndex(index);
    setEditValues({
      ticker: h.ticker,
      shares: h.shares?.toString() ?? "",
      cost: h.avg_cost_basis?.toString() ?? "",
    });
  }

  function saveEdit() {
    if (editingIndex === null) return;
    const ticker = editValues.ticker.trim().toUpperCase();
    if (!ticker) return;

    const updated = [...holdings];
    updated[editingIndex] = {
      ticker,
      shares: editValues.shares ? parseFloat(editValues.shares) : undefined,
      avg_cost_basis: editValues.cost ? parseFloat(editValues.cost) : undefined,
    };
    onHoldingsChange(updated);
    setEditingIndex(null);
  }

  function handleRemove(index: number) {
    onHoldingsChange(holdings.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-stone-800">
          We found {holdings.length} stock{holdings.length !== 1 ? "s" : ""} in your file
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Detected format: {format}. Review and edit before saving.
        </p>
      </div>

      {warnings.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="mb-1 text-xs font-medium text-amber-800">Warnings</p>
          {warnings.map((w, i) => (
            <p key={i} className="text-xs text-amber-700">{w}</p>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <div className="grid grid-cols-[1fr_80px_80px_64px] gap-2 border-b border-stone-100 bg-stone-50 px-4 py-2 text-xs font-medium text-stone-500">
          <span>Ticker</span>
          <span>Shares</span>
          <span>Avg Cost</span>
          <span />
        </div>
        {holdings.map((h, i) => (
          <div
            key={`${h.ticker}-${i}`}
            className="grid grid-cols-[1fr_80px_80px_64px] items-center gap-2 border-b border-stone-50 px-4 py-2 last:border-b-0"
          >
            <CSVPreviewRow
              holding={h}
              isEditing={editingIndex === i}
              editValues={editValues}
              onEditValuesChange={setEditValues}
              onStartEdit={() => startEdit(i)}
              onSaveEdit={saveEdit}
              onCancelEdit={() => setEditingIndex(null)}
              onRemove={() => handleRemove(i)}
            />
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onReset} className="flex-1">
          <ArrowLeft className="size-4" data-icon="inline-start" />
          Upload different file
        </Button>
        <Button
          onClick={onConfirm}
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
              Confirm & continue
              <ArrowRight className="size-4" data-icon="inline-end" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
