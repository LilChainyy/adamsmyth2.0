"use client";

import { Check, X, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ParsedHolding } from "@/lib/csv-parser";

interface CSVPreviewRowProps {
  holding: ParsedHolding;
  isEditing: boolean;
  editValues: { ticker: string; shares: string; cost: string };
  onEditValuesChange: (values: { ticker: string; shares: string; cost: string }) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onRemove: () => void;
}

export function CSVPreviewRow({
  holding,
  isEditing,
  editValues,
  onEditValuesChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onRemove,
}: CSVPreviewRowProps) {
  if (isEditing) {
    return (
      <>
        <Input
          value={editValues.ticker}
          onChange={(e) => onEditValuesChange({ ...editValues, ticker: e.target.value })}
          className="h-7 text-sm uppercase"
        />
        <Input
          type="number"
          value={editValues.shares}
          onChange={(e) => onEditValuesChange({ ...editValues, shares: e.target.value })}
          className="h-7 text-sm"
          min="0"
          step="any"
        />
        <Input
          type="number"
          value={editValues.cost}
          onChange={(e) => onEditValuesChange({ ...editValues, cost: e.target.value })}
          className="h-7 text-sm"
          min="0"
          step="any"
        />
        <div className="flex gap-1">
          <button
            onClick={onSaveEdit}
            className="rounded p-1 text-green-600 hover:bg-green-50"
          >
            <Check className="size-3.5" />
          </button>
          <button
            onClick={onCancelEdit}
            className="rounded p-1 text-stone-400 hover:bg-stone-100"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <span className="text-sm font-semibold text-stone-800">{holding.ticker}</span>
      <span className="text-sm text-stone-600">{holding.shares ?? "—"}</span>
      <span className="text-sm text-stone-600">
        {holding.avg_cost_basis ? `$${holding.avg_cost_basis}` : "—"}
      </span>
      <div className="flex gap-1">
        <button
          onClick={onStartEdit}
          className="rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
        >
          <Pencil className="size-3.5" />
        </button>
        <button
          onClick={onRemove}
          className="rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-red-500"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </>
  );
}
