"use client";

import { useState, useCallback } from "react";
import { parseCSV, CSVParseError, type ParsedHolding } from "@/lib/csv-parser";
import { useSavePortfolio } from "@/hooks/use-save-portfolio";
import { CSVDropZone } from "@/components/onboarding/csv-drop-zone";
import { CSVPreviewTable } from "@/components/onboarding/csv-preview-table";

interface CSVUploadProps {
  onBack: () => void;
}

export function CSVUpload({ onBack }: CSVUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [format, setFormat] = useState<string>("");
  const [holdings, setHoldings] = useState<ParsedHolding[]>([]);
  const { savePortfolio, saving, error: saveError, setError: setSaveError } = useSavePortfolio();

  const processFile = useCallback((file: File) => {
    setParseError(null);
    setWarnings([]);
    setSaveError(null);

    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      setParseError("Please upload a CSV file (.csv)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setParseError("File is too large. Maximum size is 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const result = parseCSV(content);
        setHoldings(result.holdings);
        setFormat(result.format);
        setWarnings(result.warnings);
      } catch (err) {
        if (err instanceof CSVParseError) {
          setParseError(err.message);
        } else {
          setParseError("Failed to read the file. Make sure it's a valid CSV.");
        }
      }
    };
    reader.onerror = () => setParseError("Failed to read the file.");
    reader.readAsText(file);
  }, [setSaveError]);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  }

  function handleReset() {
    setHoldings([]);
    setFormat("");
    setWarnings([]);
    setParseError(null);
    setSaveError(null);
  }

  if (holdings.length > 0) {
    return (
      <CSVPreviewTable
        holdings={holdings}
        format={format}
        warnings={warnings}
        saving={saving}
        error={saveError}
        onHoldingsChange={setHoldings}
        onConfirm={() => savePortfolio(holdings)}
        onReset={handleReset}
      />
    );
  }

  return (
    <CSVDropZone
      dragOver={dragOver}
      error={parseError}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onFileSelect={handleFileSelect}
      onBack={onBack}
    />
  );
}
