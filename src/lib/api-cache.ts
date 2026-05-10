const cache = new Map<string, { data: unknown; expiry: number }>();

const TTL = {
  profile: 24 * 60 * 60 * 1000, // 24 hours
  financials: 6 * 60 * 60 * 1000, // 6 hours
  news: 1 * 60 * 60 * 1000, // 1 hour
  competitors: 6 * 60 * 60 * 1000, // 6 hours
} as const;

export type CacheCategory = keyof typeof TTL;

export function getCached<T>(category: CacheCategory, key: string): T | null {
  const fullKey = `${category}:${key}`;
  const entry = cache.get(fullKey);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(fullKey);
    return null;
  }
  return entry.data as T;
}

export function setCache(category: CacheCategory, key: string, data: unknown) {
  const fullKey = `${category}:${key}`;
  cache.set(fullKey, { data, expiry: Date.now() + TTL[category] });
}
