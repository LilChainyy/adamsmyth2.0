export interface ParsedHolding {
  ticker: string;
  shares?: number;
  avg_cost_basis?: number;
}

export interface CSVParseResult {
  holdings: ParsedHolding[];
  format: string;
  warnings: string[];
}

export class CSVParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CSVParseError";
  }
}

type ColumnMap = {
  ticker: number;
  shares: number | null;
  cost: number | null;
};

const COLUMN_PROFILES: {
  name: string;
  match: (headers: string[]) => ColumnMap | null;
}[] = [
  {
    name: "Robinhood",
    match: (headers) => {
      const instrument = findColumn(headers, ["instrument"]);
      const quantity = findColumn(headers, ["quantity"]);
      const cost = findColumn(headers, ["average cost"]);
      if (instrument === -1 || quantity === -1) return null;
      return { ticker: instrument, shares: quantity, cost: cost === -1 ? null : cost };
    },
  },
  {
    name: "Fidelity",
    match: (headers) => {
      const symbol = findColumn(headers, ["symbol"]);
      const quantity = findColumn(headers, ["quantity"]);
      const cost = findColumn(headers, ["cost basis total"]);
      if (symbol === -1 || quantity === -1) return null;
      return { ticker: symbol, shares: quantity, cost: cost === -1 ? null : cost };
    },
  },
  {
    name: "Generic",
    match: (headers) => {
      const ticker = findColumn(headers, ["ticker", "symbol", "stock", "name"]);
      const shares = findColumn(headers, ["shares", "quantity", "qty", "amount"]);
      const cost = findColumn(headers, ["cost", "price", "avg cost", "average cost", "cost basis", "avg_cost_basis"]);
      if (ticker === -1) return null;
      return { ticker, shares: shares === -1 ? null : shares, cost: cost === -1 ? null : cost };
    },
  },
];

function findColumn(headers: string[], candidates: string[]): number {
  return headers.findIndex((h) =>
    candidates.some((c) => h.toLowerCase().trim() === c.toLowerCase())
  );
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function cleanTicker(value: string): string {
  // Remove quotes, whitespace, and common suffixes like exchange markers
  return value.replace(/['"]/g, "").trim().toUpperCase().split(/\s+/)[0];
}

function parseNumber(value: string): number | undefined {
  const cleaned = value.replace(/[$,'"]/g, "").trim();
  if (!cleaned || cleaned === "-" || cleaned === "N/A" || cleaned === "n/a") {
    return undefined;
  }
  const num = parseFloat(cleaned);
  return isNaN(num) || num <= 0 ? undefined : num;
}

// Basic ticker format check — 1-5 uppercase letters
const TICKER_REGEX = /^[A-Z]{1,5}$/;

export function parseCSV(content: string): CSVParseResult {
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    throw new CSVParseError(
      "The file appears to be empty or has no data rows."
    );
  }

  const headers = parseCSVLine(lines[0]);

  // Try each column profile
  let columnMap: ColumnMap | null = null;
  let formatName = "";

  for (const profile of COLUMN_PROFILES) {
    columnMap = profile.match(headers);
    if (columnMap) {
      formatName = profile.name;
      break;
    }
  }

  if (!columnMap) {
    throw new CSVParseError(
      "Could not recognize the CSV columns. Expected columns like: Symbol/Ticker, Quantity/Shares, Cost/Price."
    );
  }

  const holdings: ParsedHolding[] = [];
  const warnings: string[] = [];
  const seen = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    const rawTicker = fields[columnMap.ticker];
    if (!rawTicker) continue;

    const ticker = cleanTicker(rawTicker);
    if (!TICKER_REGEX.test(ticker)) {
      warnings.push(`Row ${i + 1}: Skipped "${rawTicker}" (not a valid ticker)`);
      continue;
    }

    if (seen.has(ticker)) {
      warnings.push(`Row ${i + 1}: Duplicate "${ticker}" skipped`);
      continue;
    }
    seen.add(ticker);

    const holding: ParsedHolding = { ticker };

    if (columnMap.shares !== null) {
      const shares = parseNumber(fields[columnMap.shares] || "");
      if (shares !== undefined) holding.shares = shares;
    }

    if (columnMap.cost !== null) {
      const cost = parseNumber(fields[columnMap.cost] || "");
      if (cost !== undefined) {
        // Fidelity gives total cost basis, so divide by shares if available
        if (formatName === "Fidelity" && holding.shares && cost > holding.shares) {
          holding.avg_cost_basis = Math.round((cost / holding.shares) * 100) / 100;
        } else {
          holding.avg_cost_basis = cost;
        }
      }
    }

    holdings.push(holding);
  }

  if (holdings.length === 0) {
    throw new CSVParseError(
      "No valid stock tickers found in the file. Make sure your CSV contains a column with ticker symbols."
    );
  }

  return { holdings, format: formatName, warnings };
}
