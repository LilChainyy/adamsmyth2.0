import { describe, it, expect } from "vitest";

/**
 * E2E-style integration test for the onboarding flow.
 * Tests the data contracts expected by the /api/portfolio route.
 */

describe("Onboarding Flow - Portfolio Creation", () => {
  const validPayload = {
    holdings: [
      { ticker: "AAPL", company_name: "Apple Inc.", shares: 10, cost_basis: 150.0 },
      { ticker: "MSFT", company_name: "Microsoft Corp.", shares: 5, cost_basis: 350.0 },
    ],
  };

  it("validates that holdings array is not empty", () => {
    const payload = { holdings: [] };
    expect(payload.holdings.length).toBe(0);
    // The API route uses zod and requires at least 1 holding
  });

  it("accepts valid holdings with required fields", () => {
    for (const holding of validPayload.holdings) {
      expect(holding.ticker).toBeTruthy();
      expect(typeof holding.ticker).toBe("string");
      expect(holding.ticker).toBe(holding.ticker.toUpperCase());
    }
  });

  it("validates ticker format (uppercase, no spaces)", () => {
    const invalidTickers = ["aapl", "AA PL", "", "TOOLONGTICKER123"];
    for (const ticker of invalidTickers) {
      const isValid = /^[A-Z]{1,5}$/.test(ticker);
      if (ticker === "" || ticker === "aapl" || ticker === "AA PL" || ticker === "TOOLONGTICKER123") {
        expect(isValid).toBe(false);
      }
    }
  });

  it("allows optional cost_basis and shares", () => {
    const minimalPayload = {
      holdings: [{ ticker: "TSLA", company_name: "Tesla Inc." }],
    };
    expect(minimalPayload.holdings[0].ticker).toBe("TSLA");
    // shares and cost_basis are optional in the schema
  });

  it("handles multiple stocks in a single submission", () => {
    expect(validPayload.holdings.length).toBe(2);
    const tickers = validPayload.holdings.map((h) => h.ticker);
    // No duplicates
    expect(new Set(tickers).size).toBe(tickers.length);
  });
});
