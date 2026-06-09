import type { Agent, AgentResult, ScopedContext } from "./types";
import { buyerRiskScore } from "@/lib/scoring";

interface DueDiligenceInput {
  scope: ScopedContext;
}

interface DueDiligenceOutput {
  documentationCompleteness: number;
  missingHighImpactRecords: string[];
  questionsToAsk: string[];
  inspectionRecommendations: string[];
  verifiedClaims: string[];
  unverifiedClaims: string[];
  nextSteps: string[];
}

export const buyerDueDiligenceAgent: Agent<DueDiligenceInput, DueDiligenceOutput> = {
  type: "buyer_due_diligence",
  description: "Helps a buyer review a vehicle's shared archive and identify gaps and risks.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<DueDiligenceOutput>> {
    const { scope } = input;
    const risk = buyerRiskScore(scope);
    const v = scope.vehicle;
    const has = (re: RegExp) => scope.documents.some((d) => re.test(`${d.documentType}`));

    const missing: string[] = [];
    if (!has(/title/i)) missing.push("Title documentation");
    if (!scope.serviceEvents.length) missing.push("Service history");
    if (!has(/ppi|inspection/i)) missing.push("Independent inspection / PPI");
    if (!has(/window sticker|build/i)) missing.push("Build sheet / window sticker");

    return {
      ok: true,
      agentType: "buyer_due_diligence",
      output: {
        documentationCompleteness: risk.score,
        missingHighImpactRecords: missing,
        questionsToAsk: [
          "Can you share the full service history?",
          "Are there any accidents or paintwork?",
          "What is the title status?",
          "Any deferred maintenance or known flaws?",
          "Will you support a buyer-arranged PPI?",
        ],
        inspectionRecommendations: ["Marque-specialist PPI", "Paint meter readings", "Compression/leak-down where relevant", "Test drive incl. cold start"],
        verifiedClaims: scope.serviceEvents.length ? ["Service entries are backed by uploaded records."] : [],
        unverifiedClaims: ["Accident history and originality cannot be confirmed from absence of records."],
        nextSteps: ["Request missing high-impact records", "Schedule a PPI", "Compare against similar examples"],
      },
      confidence: 0.8,
      sources: scope.documents.map((d) => ({ field: "document", value: d.documentType, kind: "document_supported" as const, documentId: d.id })),
      assumptions: ["Assessment is based only on what the seller chose to share."],
      missingData: missing,
      nextActions: ["Ask the seller the listed questions", "Arrange independent inspection"],
      riskFlags: missing.length ? [{ severity: "medium", category: "data", message: `${missing.length} high-impact record(s) missing.` }] : [],
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
