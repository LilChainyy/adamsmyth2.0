const API_KEY = process.env.FINANCIAL_DATA_API_KEY;
const BASE_URL = "https://financialmodelingprep.com/stable";

const cache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, expiry: Date.now() + CACHE_TTL_MS });
}

export interface StockProfile {
  symbol: string;
  companyName: string;
  price: number;
  marketCap: number;
  sector: string;
  industry: string;
  description: string;
  ceo: string;
  country: string;
  exchange: string;
  currency: string;
  beta: number;
  volAvg: number;
  changes: number;
  changesPercentage: number;
}

function getMockProfile(ticker: string): StockProfile {
  const mocks: Record<string, StockProfile> = {
    AAPL: {
      symbol: "AAPL",
      companyName: "Apple Inc.",
      price: 192.53,
      marketCap: 2980000000000,
      sector: "Technology",
      industry: "Consumer Electronics",
      description:
        "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, Mac, iPad, and wearables including Apple Watch and AirPods. It also provides AppleCare support, cloud services, and operates the App Store, Apple Music, Apple TV+, and Apple Pay.",
      ceo: "Mr. Timothy D. Cook",
      country: "US",
      exchange: "NASDAQ",
      currency: "USD",
      beta: 1.24,
      volAvg: 54000000,
      changes: 1.23,
      changesPercentage: 0.64,
    },
  };

  return (
    mocks[ticker.toUpperCase()] ?? {
      symbol: ticker.toUpperCase(),
      companyName: `${ticker.toUpperCase()} Corp.`,
      price: 150.0,
      marketCap: 500000000000,
      sector: "Technology",
      industry: "Software",
      description: `${ticker.toUpperCase()} is a publicly traded company. This is mock data — connect a Financial Modeling Prep API key for real information.`,
      ceo: "Jane Doe",
      country: "US",
      exchange: "NYSE",
      currency: "USD",
      beta: 1.1,
      volAvg: 10000000,
      changes: 0.5,
      changesPercentage: 0.33,
    }
  );
}

export async function getStockProfile(
  ticker: string
): Promise<StockProfile> {
  const cacheKey = `profile:${ticker.toUpperCase()}`;
  const cached = getCached<StockProfile>(cacheKey);
  if (cached) return cached;

  if (!API_KEY) {
    console.warn(
      "FINANCIAL_DATA_API_KEY not set — returning mock stock profile data"
    );
    return getMockProfile(ticker);
  }

  const url = `${BASE_URL}/profile?symbol=${encodeURIComponent(ticker.toUpperCase())}&apikey=${API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    console.error(`FMP API error: ${res.status}`);
    return getMockProfile(ticker);
  }

  const data = await res.json();
  const raw = Array.isArray(data) ? data[0] : data;

  if (!raw) {
    return getMockProfile(ticker);
  }

  const profile: StockProfile = {
    symbol: raw.symbol ?? ticker.toUpperCase(),
    companyName: raw.companyName ?? raw.company_name ?? ticker,
    price: raw.price ?? 0,
    marketCap: raw.marketCap ?? raw.mktCap ?? 0,
    sector: raw.sector ?? "Unknown",
    industry: raw.industry ?? "Unknown",
    description: raw.description ?? "",
    ceo: raw.ceo ?? "Unknown",
    country: raw.country ?? "Unknown",
    exchange: raw.exchange ?? raw.exchangeShortName ?? "Unknown",
    currency: raw.currency ?? "USD",
    beta: raw.beta ?? 0,
    volAvg: raw.volAvg ?? 0,
    changes: raw.changes ?? 0,
    changesPercentage: raw.changesPercentage ?? 0,
  };

  setCache(cacheKey, profile);
  return profile;
}
