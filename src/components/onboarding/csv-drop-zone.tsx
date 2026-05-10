"use client";

import { useRef } from "react";
import { Upload, FileText, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CSVDropZoneProps {
  dragOver: boolean;
  error: string | null;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
}

export function CSVDropZone({
  dragOver,
  error,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onBack,
}: CSVDropZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-stone-800">Upload your brokerage CSV</h2>
        <p className="mt-1 text-sm text-stone-500">
          Export your holdings from Robinhood, Fidelity, or any brokerage and drop it here.
        </p>
      </div>

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors ${
          dragOver
            ? "border-amber-500 bg-amber-50"
            : "border-stone-300 bg-white hover:border-amber-400 hover:bg-amber-50/50"
        }`}
      >
        <div className={`rounded-lg p-3 ${dragOver ? "bg-amber-100" : "bg-stone-100"}`}>
          {dragOver ? (
            <FileText className="size-6 text-amber-700" />
          ) : (
            <Upload className="size-6 text-stone-400" />
          )}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-stone-700">
            {dragOver ? "Drop your file here" : "Drag & drop your CSV file"}
          </p>
          <p className="mt-1 text-xs text-stone-400">or click to browse</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={onFileSelect}
          className="hidden"
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="rounded-lg bg-stone-50 p-3">
        <p className="mb-2 text-xs font-medium text-stone-500">Supported formats</p>
        <div className="flex flex-wrap gap-2">
          {["Robinhood", "Fidelity", "Generic CSV"].map((f) => (
            <span key={f} className="rounded-md bg-stone-200/60 px-2 py-0.5 text-xs text-stone-600">
              {f}
            </span>
          ))}
        </div>
      </div>

      <Button variant="outline" onClick={onBack} className="w-full">
        <ArrowLeft className="size-4" data-icon="inline-start" />
        Back
      </Button>
    </div>
  );
}
