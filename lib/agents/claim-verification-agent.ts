import type { Agent, AgentResult, ScopedContext } from "./types";
import { CLAIM_SAFE_REWRITES } from "@/lib/brand";
import { WATCHED_CLAIMS } from "./prompts";

interface ClaimInput {
  text: string;
  scope: ScopedContext;
}

interface ClaimCheck {
  claim: string;
  status: "supported" | "unsupported" | "partially_supported";
  sourceDocumentId: string | null;
  confidence: number;
  saferWording?: string;
}

interface ClaimOutput {
  checks: ClaimCheck[];
  hasUnsupportedClaims: boolean;
}

export const claimVerificationAgent: Agent<ClaimInput, ClaimOutput> = {
  type: "claim_verification",
  description: "Checks whether marketing/listing claims are supported by the provided records.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<ClaimOutput>> {
    const text = (input.text || "").toLowerCase();
    const { scope } = input;
    const docs = scope.documents;
    const events = scope.serviceEvents;

    const supportFor = (claim: string): { status: ClaimCheck["status"]; doc: string | null; conf: number } => {
      switch (claim) {
        case "full service history": {
          const ok = events.length >= 4;
          return { status: ok ? "partially_supported" : "unsupported", doc: events[0]?.documentId ?? null, conf: ok ? 0.6 : 0.2 };
        }
        case "clean title": {
          const t = scope.vehicle?.titleStatus?.toLowerCase();
          const ok = t === "clean";
          return { status: ok ? "supported" : "unsupported", doc: docs.find((d) => /title/i.test(`${d.documentType}`))?.id ?? null, conf: ok ? 0.7 : 0.2 };
        }
        case "accident-free":
        case "never tracked":
        case "no stories":
          // Absence of records cannot prove a negative.
          return { status: "unsupported", doc: null, conf: 0.15 };
        case "dealer serviced": {
          const ok = events.some((e) => /dealer|porsche/i.test(`${e.vendor}`));
          return { status: ok ? "partially_supported" : "unsupported", doc: null, conf: ok ? 0.55 : 0.2 };
        }
        default:
          return { status: "unsupported", doc: null, conf: 0.2 };
      }
    };

    const checks: ClaimCheck[] = WATCHED_CLAIMS.filter((c) => text.includes(c)).map((claim) => {
      const s = supportFor(claim);
      const safer = CLAIM_SAFE_REWRITES[claim];
      return {
        claim,
        status: s.status,
        sourceDocumentId: s.doc,
        confidence: s.conf,
        saferWording: s.status !== "supported" ? safer : undefined,
      };
    });

    const hasUnsupported = checks.some((c) => c.status !== "supported");

    return {
      ok: true,
      agentType: "claim_verification",
      output: { checks, hasUnsupportedClaims: hasUnsupported },
      confidence: 0.8,
      sources: docs.map((d) => ({ field: "document", value: d.documentType, kind: "document_supported" as const, documentId: d.id })),
      assumptions: ["A claim is only 'supported' if records directly back it. Negatives (e.g. accident-free) cannot be proven by absence."],
      missingData: checks.filter((c) => c.status === "unsupported").map((c) => `Evidence for "${c.claim}"`),
      nextActions: hasUnsupported ? ["Replace unsupported claims with the suggested safer wording."] : ["Claims look supported by your records."],
      riskFlags: checks
        .filter((c) => c.status !== "supported")
        .map((c) => ({ severity: "high" as const, category: "claim" as const, message: `Unsupported claim: "${c.claim}"`, saferWording: c.saferWording })),
      approvalRequired: hasUnsupported,
      externalSideEffect: false,
    };
  },
};
