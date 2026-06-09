import { describe, it, expect } from "vitest";
import { instagramAgent } from "@/lib/agents/instagram-agent";
import { adAgent } from "@/lib/agents/ad-agent";
import { buyerReplyAgent } from "@/lib/agents/buyer-reply-agent";
import { publicPageAgent } from "@/lib/agents/public-page-agent";
import { listingAgent } from "@/lib/agents/listing-agent";
import { archiveCuratorAgent } from "@/lib/agents/archive-curator-agent";
import { makeScope, CTX } from "./_fixtures";
import type { AgentResult } from "@/lib/agents/types";

function assertEnvelope(res: AgentResult<unknown>) {
  expect(res).toHaveProperty("output");
  expect(typeof res.confidence).toBe("number");
  expect(res.confidence).toBeGreaterThanOrEqual(0);
  expect(res.confidence).toBeLessThanOrEqual(1);
  expect(Array.isArray(res.sources)).toBe(true);
  expect(Array.isArray(res.assumptions)).toBe(true);
  expect(Array.isArray(res.missingData)).toBe(true);
  expect(Array.isArray(res.nextActions)).toBe(true);
  expect(Array.isArray(res.riskFlags)).toBe(true);
  expect(typeof res.approvalRequired).toBe("boolean");
}

describe("Agent contract — universal result envelope", () => {
  it("listing + curator agents return a well-formed envelope", async () => {
    assertEnvelope(await listingAgent.run({ scope: makeScope() }, CTX));
    assertEnvelope(await archiveCuratorAgent.run({ scope: makeScope() }, CTX));
  });
});

describe("External-action agents are approval-gated and never auto-execute", () => {
  it("Instagram + Ad agents declare external side-effect capability and require approval", async () => {
    expect(instagramAgent.canHaveExternalSideEffect).toBe(true);
    expect(adAgent.canHaveExternalSideEffect).toBe(true);

    const ig = await instagramAgent.run({ scope: makeScope() }, CTX);
    const ad = await adAgent.run({ scope: makeScope() }, CTX);
    expect(ig.approvalRequired).toBe(true);
    expect(ad.approvalRequired).toBe(true);
    // A draft is produced but no side-effect is performed.
    expect(ig.externalSideEffect).toBe(false);
    expect(ad.externalSideEffect).toBe(false);
  });

  it("Buyer reply + public page agents require approval before anything leaves the platform", async () => {
    const reply = await buyerReplyAgent.run({ question: "What is the service history?", scope: makeScope() }, CTX);
    const page = await publicPageAgent.run({ scope: makeScope() }, CTX);
    expect(buyerReplyAgent.canHaveExternalSideEffect).toBe(true);
    expect(publicPageAgent.canHaveExternalSideEffect).toBe(true);
    expect(reply.approvalRequired).toBe(true);
    expect(page.approvalRequired).toBe(true);
  });
});
