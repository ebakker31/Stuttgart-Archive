import { describe, it, expect } from "vitest";
import { privacyGuardAgent } from "@/lib/agents/privacy-guard-agent";
import { makeScope, CTX } from "./_fixtures";

describe("Privacy Guard Agent", () => {
  it("blocks publishing when a full VIN appears in the content", async () => {
    const res = await privacyGuardAgent.run(
      { text: "VIN: WP0AB2A99JS123456 — ready to sell.", scope: makeScope(), intent: "public_page" },
      CTX
    );
    expect(res.output.safeToPublish).toBe(false);
    expect(res.approvalRequired).toBe(true);
    expect(res.riskFlags.some((f) => f.severity === "high" && /VIN/i.test(f.message))).toBe(true);
  });

  it("flags exposed email and phone numbers", async () => {
    const res = await privacyGuardAgent.run(
      { text: "Contact me at jane@example.com or (415) 555-0199.", scope: makeScope(), intent: "seller_packet" },
      CTX
    );
    expect(res.riskFlags.some((f) => /email/i.test(f.message))).toBe(true);
    expect(res.riskFlags.some((f) => /phone/i.test(f.message))).toBe(true);
  });

  it("passes clean content and notes that private documents are excluded", async () => {
    const res = await privacyGuardAgent.run(
      { text: "A documented 911 Carrera S with service records.", scope: makeScope(), intent: "public_page" },
      CTX
    );
    expect(res.output.safeToPublish).toBe(true);
    // The fixture has one private document (title.pdf) — guard should note it is excluded.
    expect(res.assumptions.join(" ")).toMatch(/private document/i);
  });

  it("warns when full VIN display is enabled on a public page", async () => {
    const res = await privacyGuardAgent.run(
      { text: "Clean documented example.", scope: makeScope(), intent: "public_page", showFullVin: true },
      CTX
    );
    expect(res.riskFlags.some((f) => /full VIN/i.test(f.message))).toBe(true);
  });
});
