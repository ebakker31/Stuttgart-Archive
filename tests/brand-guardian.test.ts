import { describe, it, expect } from "vitest";
import { brandGuardianAgent } from "@/lib/agents/brand-guardian-agent";
import { CTX } from "./_fixtures";

describe("Brand Guardian Agent — independence + trademark safety", () => {
  it("blocks copy implying official Porsche affiliation", async () => {
    const res = await brandGuardianAgent.run({ text: "We are the official Porsche archive." }, CTX);
    expect(res.output.riskLevel).toBe("high");
    expect(res.output.launchApprovalRecommendation).toBe("block");
    expect(res.approvalRequired).toBe(true);
    expect(res.output.problems.length).toBeGreaterThan(0);
  });

  it("flags auction-platform name-dropping that could imply affiliation", async () => {
    const res = await brandGuardianAgent.run({ text: "List it on Bring a Trailer with us." }, CTX);
    expect(res.output.problems.some((p) => /auction/i.test(p.why))).toBe(true);
  });

  it("flags hype/absolute tone as a medium brand risk", async () => {
    const res = await brandGuardianAgent.run({ text: "A flawless, investment-grade unicorn." }, CTX);
    expect(["medium", "high"]).toContain(res.output.riskLevel);
  });

  it("approves clean, independent brand copy", async () => {
    const res = await brandGuardianAgent.run(
      { text: "An independent platform built for Porsche owners and enthusiasts." },
      CTX
    );
    expect(res.output.riskLevel).toBe("low");
    expect(res.output.launchApprovalRecommendation).toBe("approve");
    expect(res.approvalRequired).toBe(false);
  });
});
