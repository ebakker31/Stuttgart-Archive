import { describe, it, expect } from "vitest";
import { calcBuyerPremium, MARKETPLACE } from "@/lib/marketplace";

describe("Marketplace buyer's premium", () => {
  it("applies the percentage rate in the normal range", () => {
    expect(calcBuyerPremium(50000)).toBe(2500); // 5%
    expect(calcBuyerPremium(92000)).toBe(4600);
  });

  it("clamps to the minimum on low prices", () => {
    expect(calcBuyerPremium(1000)).toBe(MARKETPLACE.buyerPremiumMin);
    expect(calcBuyerPremium(0)).toBe(MARKETPLACE.buyerPremiumMin);
  });

  it("clamps to the maximum on high prices", () => {
    expect(calcBuyerPremium(250000)).toBe(MARKETPLACE.buyerPremiumMax);
    expect(calcBuyerPremium(1000000)).toBe(MARKETPLACE.buyerPremiumMax);
  });

  it("never exceeds the cap or drops below the floor", () => {
    for (const p of [0, 100, 4999, 100000, 999999]) {
      const fee = calcBuyerPremium(p);
      expect(fee).toBeGreaterThanOrEqual(MARKETPLACE.buyerPremiumMin);
      expect(fee).toBeLessThanOrEqual(MARKETPLACE.buyerPremiumMax);
    }
  });
});
