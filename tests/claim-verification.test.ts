import { describe, it, expect } from "vitest";
import { claimVerificationAgent } from "@/lib/agents/claim-verification-agent";
import { CLAIM_SAFE_REWRITES } from "@/lib/brand";
import { makeScope, CTX } from "./_fixtures";

describe("Claim Verification Agent — real-data-only guarantee", () => {
  it("flags 'accident-free' as unsupported (a negative cannot be proven by absence)", async () => {
    const res = await claimVerificationAgent.run(
      { text: "This car is accident-free and never tracked.", scope: makeScope() },
      CTX
    );
    const accident = res.output.checks.find((c) => c.claim === "accident-free");
    expect(accident).toBeDefined();
    expect(accident!.status).toBe("unsupported");
    expect(res.output.hasUnsupportedClaims).toBe(true);
    expect(res.approvalRequired).toBe(true);
  });

  it("offers grounded safer wording for unsupported claims", async () => {
    const res = await claimVerificationAgent.run(
      { text: "full service history included", scope: makeScope() },
      CTX
    );
    const check = res.output.checks.find((c) => c.claim === "full service history");
    expect(check?.saferWording).toBe(CLAIM_SAFE_REWRITES["full service history"]);
  });

  it("treats a clean title as supported when the vehicle title status is clean", async () => {
    const res = await claimVerificationAgent.run(
      { text: "clean title", scope: makeScope() },
      CTX
    );
    const check = res.output.checks.find((c) => c.claim === "clean title");
    expect(check?.status).toBe("supported");
  });

  it("returns no risk flags when no watched claims are present", async () => {
    const res = await claimVerificationAgent.run(
      { text: "A lovely silver coupe with documented service.", scope: makeScope() },
      CTX
    );
    expect(res.output.checks).toHaveLength(0);
    expect(res.riskFlags).toHaveLength(0);
    expect(res.approvalRequired).toBe(false);
  });
});
