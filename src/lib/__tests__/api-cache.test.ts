import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCached, setCache } from "@/lib/api-cache";

describe("api-cache", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("cache miss returns null", () => {
    expect(getCached("profile", "nonexistent")).toBeNull();
  });

  it("setCache + getCached returns stored value", () => {
    const data = { name: "Apple Inc", ticker: "AAPL" };
    setCache("profile", "AAPL", data);
    expect(getCached("profile", "AAPL")).toEqual(data);
  });

  it("expired entry returns null", () => {
    setCache("news", "AAPL", { articles: [] });
    // news TTL is 1 hour
    vi.advanceTimersByTime(61 * 60 * 1000);
    expect(getCached("news", "AAPL")).toBeNull();
  });

  it("different categories don't collide on same key", () => {
    setCache("profile", "AAPL", { type: "profile" });
    setCache("news", "AAPL", { type: "news" });
    expect(getCached<{ type: string }>("profile", "AAPL")?.type).toBe("profile");
    expect(getCached<{ type: string }>("news", "AAPL")?.type).toBe("news");
  });
});
