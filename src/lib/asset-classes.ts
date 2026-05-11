export const ASSET_CLASSES = [
  { id: "stocks", label: "Stocks", enabled: true },
  { id: "etfs", label: "ETFs", enabled: false },
  { id: "bonds", label: "Bonds", enabled: false },
  { id: "crypto", label: "Crypto", enabled: false },
  { id: "real-estate", label: "Real Estate", enabled: false },
  { id: "commodities", label: "Commodities", enabled: false },
] as const;

export type AssetClassId = (typeof ASSET_CLASSES)[number]["id"];
