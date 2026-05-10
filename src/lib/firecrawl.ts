const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const FIRECRAWL_URL = "https://api.firecrawl.dev/v1/scrape";

export interface ScrapeResult {
  markdown: string;
}

/**
 * Scrapes a URL and returns its content as markdown using Firecrawl.
 * Returns null if the API key is not configured or the request fails.
 */
export async function scrapeUrl(url: string): Promise<ScrapeResult | null> {
  if (!FIRECRAWL_API_KEY) return null;

  try {
    const res = await fetch(FIRECRAWL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const markdown = data?.data?.markdown;
    if (!markdown || typeof markdown !== "string") return null;

    return { markdown };
  } catch {
    return null;
  }
}
