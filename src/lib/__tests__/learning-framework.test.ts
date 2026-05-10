import { describe, it, expect } from "vitest";
import {
  getAllSubTopics,
  getSubTopicsForDimension,
  getDimensionForSubTopic,
  DIMENSIONS,
  ALL_DIMENSIONS,
} from "@/lib/learning-framework";

describe("learning-framework", () => {
  it("getAllSubTopics returns 26 sub-topics", () => {
    expect(getAllSubTopics()).toHaveLength(26);
  });

  it("getSubTopicsForDimension('business_model') returns 5 sub-topics", () => {
    expect(getSubTopicsForDimension("business_model")).toHaveLength(5);
  });

  it("getDimensionForSubTopic('revenue_growth') returns 'financials'", () => {
    expect(getDimensionForSubTopic("revenue_growth")).toBe("financials");
  });

  it("getDimensionForSubTopic('nonexistent') returns null", () => {
    expect(getDimensionForSubTopic("nonexistent")).toBeNull();
  });

  it("all sub-topics have correct dimension field matching their parent", () => {
    for (const dim of ALL_DIMENSIONS) {
      for (const st of dim.subTopics) {
        expect(st.dimension).toBe(dim.id);
      }
    }
  });

  it("dimension weights sum to 1.0", () => {
    const total = ALL_DIMENSIONS.reduce((sum, d) => sum + d.weight, 0);
    expect(total).toBeCloseTo(1.0);
  });
});
