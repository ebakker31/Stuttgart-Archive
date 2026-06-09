import { describe, it, expect } from "vitest";
import { completenessScore, sellerReadinessScore, auctionReadinessScore, buyerRiskScore } from "@/lib/scoring";
import { makeScope } from "./_fixtures";

describe("Readiness scoring — bounded and data-driven", () => {
  const scope = makeScope();

  it("keeps every score within 0..100", () => {
    for (const fn of [completenessScore, sellerReadinessScore, auctionReadinessScore, buyerRiskScore]) {
      const { score } = fn(scope);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });

  it("scores an empty archive lower than a documented one", () => {
    const empty = makeScope({ vehicle: undefined, serviceEvents: [], documents: [], photos: [], modifications: [] });
    expect(completenessScore(empty).score).toBeLessThan(completenessScore(scope).score);
  });

  it("rewards disclosed flaws and service records for seller readiness", () => {
    const noFlaws = makeScope({ vehicle: { ...makeScope().vehicle!, knownFlaws: null } });
    expect(sellerReadinessScore(noFlaws).score).toBeLessThan(sellerReadinessScore(scope).score);
  });
});
