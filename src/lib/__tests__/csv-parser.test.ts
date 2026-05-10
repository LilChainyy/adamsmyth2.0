import { describe, it, expect } from "vitest";
import { parseCSV, CSVParseError } from "@/lib/csv-parser";

describe("csv-parser", () => {
  describe("format detection", () => {
    it("detects Robinhood format", () => {
      const csv = `Instrument,Quantity,Average Cost
AAPL,10,150.50
MSFT,5,300.00`;
      const result = parseCSV(csv);
      expect(result.format).toBe("Robinhood");
      expect(result.holdings).toHaveLength(2);
      expect(result.holdings[0]).toEqual({
        ticker: "AAPL",
        shares: 10,
        avg_cost_basis: 150.5,
      });
    });

    it("detects Fidelity format and divides cost basis by shares", () => {
      const csv = `Symbol,Quantity,Cost Basis Total
AAPL,10,1505.00
TSLA,5,250.00`;
      const result = parseCSV(csv);
      expect(result.format).toBe("Fidelity");
      expect(result.holdings[0].avg_cost_basis).toBe(150.5);
      // TSLA: 250/5 = 50, but 250 > 5 so division applies
      expect(result.holdings[1].avg_cost_basis).toBe(50);
    });

    it("detects Generic format", () => {
      const csv = `Ticker,Shares,Price
GOOG,3,140.00`;
      const result = parseCSV(csv);
      expect(result.format).toBe("Generic");
      expect(result.holdings[0]).toEqual({
        ticker: "GOOG",
        shares: 3,
        avg_cost_basis: 140,
      });
    });
  });

  describe("CSV parsing edge cases", () => {
    it("handles quoted fields with escaped quotes", () => {
      // cleanTicker strips quotes, so AA""PL → AAPL (quotes removed)
      const csv = `Instrument,Quantity,Average Cost
"AA""PL",10,150.50`;
      const result = parseCSV(csv);
      // After quote removal and uppercase, becomes "AAPL" which is valid
      expect(result.holdings).toHaveLength(1);
      expect(result.holdings[0].ticker).toBe("AAPL");
    });

    it("deduplicates tickers and generates warning", () => {
      const csv = `Instrument,Quantity,Average Cost
AAPL,10,150.00
AAPL,5,155.00`;
      const result = parseCSV(csv);
      expect(result.holdings).toHaveLength(1);
      expect(result.warnings.some((w) => w.includes("Duplicate"))).toBe(true);
    });

    it("skips invalid ticker format with warning", () => {
      const csv = `Instrument,Quantity,Average Cost
AAPL,10,150.00
123INVALID,5,50.00`;
      const result = parseCSV(csv);
      expect(result.holdings).toHaveLength(1);
      expect(result.warnings.some((w) => w.includes("not a valid ticker"))).toBe(true);
    });
  });

  describe("error cases", () => {
    it("throws CSVParseError for empty file", () => {
      expect(() => parseCSV("")).toThrow(CSVParseError);
      expect(() => parseCSV("header only")).toThrow(CSVParseError);
    });

    it("throws CSVParseError for unrecognized columns", () => {
      const csv = `Foo,Bar,Baz
a,b,c`;
      expect(() => parseCSV(csv)).toThrow(CSVParseError);
      expect(() => parseCSV(csv)).toThrow("Could not recognize");
    });

    it("throws CSVParseError when no valid tickers found", () => {
      const csv = `Instrument,Quantity,Average Cost
123BAD,10,150.00`;
      expect(() => parseCSV(csv)).toThrow(CSVParseError);
      expect(() => parseCSV(csv)).toThrow("No valid stock tickers");
    });
  });

  describe("number parsing", () => {
    it("handles $, commas, and N/A values", () => {
      const csv = `Instrument,Quantity,Average Cost
AAPL,"1,000","$150.50"
MSFT,5,N/A`;
      const result = parseCSV(csv);
      expect(result.holdings[0].shares).toBe(1000);
      expect(result.holdings[0].avg_cost_basis).toBe(150.5);
      expect(result.holdings[1].avg_cost_basis).toBeUndefined();
    });
  });
});
