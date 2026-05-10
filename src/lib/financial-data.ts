import { getCached, setCache } from "@/lib/api-cache";
import { scrapeUrl } from "@/lib/firecrawl";

const API_KEY = process.env.FINANCIAL_DATA_API_KEY;
const BASE_URL = "https://financialmodelingprep.com/stable";

// ---------------------------------------------------------------------------
// Stock Profile
// ---------------------------------------------------------------------------

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
  const t = ticker.toUpperCase();
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
    mocks[t] ?? {
      symbol: t,
      companyName: `${t} Corp.`,
      price: 150.0,
      marketCap: 500000000000,
      sector: "Technology",
      industry: "Software",
      description: `${t} is a publicly traded company. This is mock data — connect a Financial Modeling Prep API key for real information.`,
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
  const t = ticker.toUpperCase();
  const cached = getCached<StockProfile>("profile", t);
  if (cached) return cached;

  if (!API_KEY) {
    console.warn("FINANCIAL_DATA_API_KEY not set — returning mock stock profile data");
    return getMockProfile(t);
  }

  const url = `${BASE_URL}/profile?symbol=${encodeURIComponent(t)}&apikey=${API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    console.error(`FMP API error: ${res.status}`);
    return getMockProfile(t);
  }

  const data = await res.json();
  const raw = Array.isArray(data) ? data[0] : data;

  if (!raw) return getMockProfile(t);

  const profile: StockProfile = {
    symbol: raw.symbol ?? t,
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

  setCache("profile", t, profile);
  return profile;
}

// ---------------------------------------------------------------------------
// Financials (income statement + ratios)
// ---------------------------------------------------------------------------

export interface StockFinancials {
  ticker: string;
  annual: AnnualFinancials[];
  ratios: FinancialRatios;
}

export interface AnnualFinancials {
  year: string;
  revenue: number;
  netIncome: number;
  grossMargin: number;
  operatingMargin: number;
  revenueGrowthYoY: number | null;
}

export interface FinancialRatios {
  peRatio: number | null;
  pbRatio: number | null;
  debtToEquity: number | null;
  returnOnEquity: number | null;
  currentRatio: number | null;
}

function getMockFinancials(ticker: string): StockFinancials {
  const t = ticker.toUpperCase();
  return {
    ticker: t,
    annual: [
      { year: "2024", revenue: 391_035_000_000, netIncome: 100_913_000_000, grossMargin: 0.462, operatingMargin: 0.317, revenueGrowthYoY: 0.02 },
      { year: "2023", revenue: 383_285_000_000, netIncome: 96_995_000_000, grossMargin: 0.441, operatingMargin: 0.298, revenueGrowthYoY: -0.03 },
      { year: "2022", revenue: 394_328_000_000, netIncome: 99_803_000_000, grossMargin: 0.434, operatingMargin: 0.303, revenueGrowthYoY: 0.08 },
      { year: "2021", revenue: 365_817_000_000, netIncome: 94_680_000_000, grossMargin: 0.418, operatingMargin: 0.298, revenueGrowthYoY: 0.33 },
    ],
    ratios: {
      peRatio: 30.5,
      pbRatio: 48.2,
      debtToEquity: 1.87,
      returnOnEquity: 1.47,
      currentRatio: 0.99,
    },
  };
}

export async function getFinancials(ticker: string): Promise<StockFinancials> {
  const t = ticker.toUpperCase();
  const cached = getCached<StockFinancials>("financials", t);
  if (cached) return cached;

  if (!API_KEY) {
    console.warn("FINANCIAL_DATA_API_KEY not set — returning mock financials");
    return getMockFinancials(t);
  }

  try {
    const [incomeRes, ratiosRes] = await Promise.all([
      fetch(`${BASE_URL}/income-statement?symbol=${encodeURIComponent(t)}&limit=4&apikey=${API_KEY}`),
      fetch(`${BASE_URL}/ratios?symbol=${encodeURIComponent(t)}&limit=1&apikey=${API_KEY}`),
    ]);

    if (!incomeRes.ok || !ratiosRes.ok) {
      console.error(`FMP financials API error: income=${incomeRes.status} ratios=${ratiosRes.status}`);
      return getMockFinancials(t);
    }

    const incomeData = await incomeRes.json();
    const ratiosData = await ratiosRes.json();

    const statements = Array.isArray(incomeData) ? incomeData : [];
    const ratioRaw = Array.isArray(ratiosData) ? ratiosData[0] : ratiosData;

    if (statements.length === 0) return getMockFinancials(t);

    const annual: AnnualFinancials[] = statements.map(
      (s: Record<string, unknown>, i: number) => {
        const revenue = (s.revenue as number) ?? 0;
        const prevRevenue = statements[i + 1]?.revenue as number | undefined;
        const grossProfit = (s.grossProfit as number) ?? 0;
        const operatingIncome = (s.operatingIncome as number) ?? 0;

        return {
          year: ((s.calendarYear as string) ?? (s.date as string)?.slice(0, 4)) ?? "N/A",
          revenue,
          netIncome: (s.netIncome as number) ?? 0,
          grossMargin: revenue > 0 ? grossProfit / revenue : 0,
          operatingMargin: revenue > 0 ? operatingIncome / revenue : 0,
          revenueGrowthYoY:
            prevRevenue && prevRevenue > 0
              ? (revenue - prevRevenue) / prevRevenue
              : null,
        };
      }
    );

    const ratios: FinancialRatios = {
      peRatio: (ratioRaw?.priceEarningsRatio as number) ?? null,
      pbRatio: (ratioRaw?.priceToBookRatio as number) ?? null,
      debtToEquity: (ratioRaw?.debtEquityRatio as number) ?? null,
      returnOnEquity: (ratioRaw?.returnOnEquity as number) ?? null,
      currentRatio: (ratioRaw?.currentRatio as number) ?? null,
    };

    const result: StockFinancials = { ticker: t, annual, ratios };
    setCache("financials", t, result);
    return result;
  } catch (err) {
    console.error("Failed to fetch financials:", err);
    return getMockFinancials(t);
  }
}

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

export interface StockNewsArticle {
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
}

export interface StockNews {
  ticker: string;
  articles: StockNewsArticle[];
}

function getMockNews(ticker: string): StockNews {
  const t = ticker.toUpperCase();
  return {
    ticker: t,
    articles: [
      {
        title: `${t} Reports Strong Quarterly Earnings`,
        source: "Financial Times",
        date: "2025-04-28",
        summary: `${t} exceeded analyst expectations with revenue growth driven by strong product demand. This is mock data — connect a Financial Modeling Prep API key for real news.`,
        url: "https://example.com/mock-article-1",
      },
      {
        title: `Analysts Weigh In on ${t}'s Growth Strategy`,
        source: "Bloomberg",
        date: "2025-04-25",
        summary: `Wall Street analysts are evaluating ${t}'s strategic initiatives and their potential impact on long-term growth. This is mock data.`,
        url: "https://example.com/mock-article-2",
      },
      {
        title: `${t} Announces New Product Line`,
        source: "Reuters",
        date: "2025-04-20",
        summary: `${t} unveiled its latest product line, aiming to capture a larger share of the market. This is mock data.`,
        url: "https://example.com/mock-article-3",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Competitors Comparison
// ---------------------------------------------------------------------------

export interface CompetitorData {
  ticker: string;
  name: string;
  marketCap: number;
  peRatio: number | null;
  revenueGrowth: number | null;
  margin: number | null;
}

export interface CompetitorComparison {
  ticker: string;
  peers: CompetitorData[];
}

function getMockCompetitors(ticker: string): CompetitorComparison {
  const t = ticker.toUpperCase();
  const mockPeers: Record<string, CompetitorData[]> = {
    AAPL: [
      { ticker: "AAPL", name: "Apple Inc.", marketCap: 2980000000000, peRatio: 30.5, revenueGrowth: 0.02, margin: 0.317 },
      { ticker: "MSFT", name: "Microsoft Corp.", marketCap: 3100000000000, peRatio: 35.2, revenueGrowth: 0.16, margin: 0.445 },
      { ticker: "GOOG", name: "Alphabet Inc.", marketCap: 2100000000000, peRatio: 25.8, revenueGrowth: 0.13, margin: 0.275 },
      { ticker: "AMZN", name: "Amazon.com Inc.", marketCap: 1900000000000, peRatio: 60.1, revenueGrowth: 0.12, margin: 0.064 },
    ],
  };

  return {
    ticker: t,
    peers: mockPeers[t] ?? [
      { ticker: t, name: `${t} Corp.`, marketCap: 500000000000, peRatio: 25.0, revenueGrowth: 0.10, margin: 0.20 },
      { ticker: "COMP1", name: "Competitor A", marketCap: 300000000000, peRatio: 20.0, revenueGrowth: 0.08, margin: 0.18 },
      { ticker: "COMP2", name: "Competitor B", marketCap: 200000000000, peRatio: 28.0, revenueGrowth: 0.15, margin: 0.22 },
      { ticker: "COMP3", name: "Competitor C", marketCap: 150000000000, peRatio: 18.5, revenueGrowth: 0.05, margin: 0.15 },
    ],
  };
}

export async function getCompetitors(ticker: string): Promise<CompetitorComparison> {
  const t = ticker.toUpperCase();
  const cached = getCached<CompetitorComparison>("competitors", t);
  if (cached) return cached;

  if (!API_KEY) {
    console.warn("FINANCIAL_DATA_API_KEY not set — returning mock competitor data");
    return getMockCompetitors(t);
  }

  try {
    // Get peer list
    const peersRes = await fetch(
      `${BASE_URL}/stock_peers?symbol=${encodeURIComponent(t)}&apikey=${API_KEY}`
    );

    if (!peersRes.ok) {
      console.error(`FMP peers API error: ${peersRes.status}`);
      return getMockCompetitors(t);
    }

    const peersData = await peersRes.json();
    const peerList: string[] = Array.isArray(peersData)
      ? (peersData[0]?.peersList ?? [])
      : (peersData?.peersList ?? []);

    // Take top 3 peers + the target ticker
    const topPeers = peerList.slice(0, 3);
    const allTickers = [t, ...topPeers];

    // Fetch profiles and ratios for all tickers in parallel
    const results = await Promise.all(
      allTickers.map(async (sym): Promise<CompetitorData> => {
        try {
          const [profileRes, ratiosRes, incomeRes] = await Promise.all([
            fetch(`${BASE_URL}/profile?symbol=${encodeURIComponent(sym)}&apikey=${API_KEY}`),
            fetch(`${BASE_URL}/ratios?symbol=${encodeURIComponent(sym)}&limit=1&apikey=${API_KEY}`),
            fetch(`${BASE_URL}/income-statement?symbol=${encodeURIComponent(sym)}&limit=2&apikey=${API_KEY}`),
          ]);

          const profileData = await profileRes.json();
          const ratiosDataArr = await ratiosRes.json();
          const incomeData = await incomeRes.json();

          const profile = Array.isArray(profileData) ? profileData[0] : profileData;
          const ratios = Array.isArray(ratiosDataArr) ? ratiosDataArr[0] : ratiosDataArr;
          const income = Array.isArray(incomeData) ? incomeData : [];

          let revenueGrowth: number | null = null;
          if (income.length >= 2 && income[1]?.revenue > 0) {
            revenueGrowth = (income[0].revenue - income[1].revenue) / income[1].revenue;
          }

          const revenue = income[0]?.revenue ?? 0;
          const operatingIncome = income[0]?.operatingIncome ?? 0;
          const margin = revenue > 0 ? operatingIncome / revenue : null;

          return {
            ticker: sym,
            name: profile?.companyName ?? profile?.company_name ?? sym,
            marketCap: profile?.marketCap ?? profile?.mktCap ?? 0,
            peRatio: ratios?.priceEarningsRatio ?? null,
            revenueGrowth,
            margin,
          };
        } catch {
          return {
            ticker: sym,
            name: sym,
            marketCap: 0,
            peRatio: null,
            revenueGrowth: null,
            margin: null,
          };
        }
      })
    );

    const comparison: CompetitorComparison = { ticker: t, peers: results };
    setCache("competitors", t, comparison);
    return comparison;
  } catch (err) {
    console.error("Failed to fetch competitors:", err);
    return getMockCompetitors(t);
  }
}

export async function getNews(
  ticker: string,
  limit: number = 5
): Promise<StockNews> {
  const t = ticker.toUpperCase();
  const cacheKey = `${t}:${limit}`;
  const cached = getCached<StockNews>("news", cacheKey);
  if (cached) return cached;

  if (!API_KEY) {
    console.warn("FINANCIAL_DATA_API_KEY not set — returning mock news");
    return getMockNews(t);
  }

  try {
    const url = `${BASE_URL}/stock_news?tickers=${encodeURIComponent(t)}&limit=${limit}&apikey=${API_KEY}`;
    const res = await fetch(url);

    if (!res.ok) {
      console.error(`FMP news API error: ${res.status}`);
      return getMockNews(t);
    }

    const data = await res.json();
    const items = Array.isArray(data) ? data : [];

    if (items.length === 0) return getMockNews(t);

    const articles: StockNewsArticle[] = await Promise.all(
      items.map(async (item: Record<string, unknown>) => {
        const articleUrl = (item.url as string) ?? "";
        let summary = (item.text as string) ?? (item.snippet as string) ?? "";

        // Try enriching with Firecrawl for full article content
        if (articleUrl) {
          const scraped = await scrapeUrl(articleUrl);
          if (scraped?.markdown) {
            // Truncate to ~2000 chars so the AI can summarize it
            summary = scraped.markdown.slice(0, 2000);
          }
        }

        return {
          title: (item.title as string) ?? "Untitled",
          source: (item.site as string) ?? (item.source as string) ?? "Unknown",
          date: (item.publishedDate as string) ?? (item.date as string) ?? "Unknown",
          summary,
          url: articleUrl,
        };
      })
    );

    const result: StockNews = { ticker: t, articles };
    setCache("news", cacheKey, result);
    return result;
  } catch (err) {
    console.error("Failed to fetch news:", err);
    return getMockNews(t);
  }
}
