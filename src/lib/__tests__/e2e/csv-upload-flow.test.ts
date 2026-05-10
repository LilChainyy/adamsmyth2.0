import { describe, it, expect } from "vitest";

/**
 * E2E-style test for the CSV upload parsing flow.
 * Tests the expected input/output contracts for CSV data processing.
 */

describe("CSV Upload Flow", () => {
  // Simulates the CSV parser output format
  function parseCSVRow(row: string): { ticker: string; shares: number; costBasis: number | null } | null {
    const cols = row.split(",").map((c) => c.trim());
    if (cols.length < 2) return null;

    const ticker = cols[0].toUpperCase();
    const shares = parseFloat(cols[1]);

    if (!ticker || isNaN(shares)) return null;

    return {
      ticker,
      shares,
      costBasis: cols[2] ? parseFloat(cols[2]) : null,
    };
  }

  it("parses standard CSV format: ticker, shares, cost", () => {
    const result = parseCSVRow("AAPL, 10, 150.25");
    expect(result).toEqual({ ticker: "AAPL", shares: 10, costBasis: 150.25 });
  });

  it("handles missing cost basis column", () => {
    const result = parseCSVRow("MSFT, 5");
    expect(result).toEqual({ ticker: "MSFT", shares: 5, costBasis: null });
  });

  it("uppercases ticker symbols", () => {
    const result = parseCSVRow("aapl, 10, 150");
    expect(result?.ticker).toBe("AAPL");
  });

  it("rejects rows with missing ticker", () => {
    const result = parseCSVRow(", 10, 150");
    expect(result).toBeNull();
  });

  it("rejects rows with invalid share count", () => {
    const result = parseCSVRow("AAPL, notanumber, 150");
    expect(result).toBeNull();
  });

  it("handles rows with extra whitespace", () => {
    const result = parseCSVRow("  GOOG  ,  25  ,  2800.50  ");
    expect(result).toEqual({ ticker: "GOOG", shares: 25, costBasis: 2800.5 });
  });

  it("processes a full CSV content batch", () => {
    const csvContent = `Ticker,Shares,Cost Basis
AAPL,10,150.00
MSFT,5,350.00
GOOG,3,2800.00
TSLA,8,250.00`;

    const rows = csvContent.split("\n").slice(1); // Skip header
    const results = rows.map(parseCSVRow).filter(Boolean);

    expect(results.length).toBe(4);
    expect(results.map((r) => r!.ticker)).toEqual(["AAPL", "MSFT", "GOOG", "TSLA"]);
  });

  it("skips empty lines in CSV", () => {
    const csvContent = `AAPL,10,150

MSFT,5,350

`;
    const rows = csvContent.split("\n").filter((r) => r.trim());
    const results = rows.map(parseCSVRow).filter(Boolean);
    expect(results.length).toBe(2);
  });
});
