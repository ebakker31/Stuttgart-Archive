import type { Agent, AgentResult, ScopedContext } from "./types";

interface ValuationInput {
  scope: ScopedContext;
}

interface ValuationOutput {
  valuePositiveFactors: string[];
  valueNegativeFactors: string[];
  documentationGaps: string[];
  suggestedPreparation: string[];
  comparableResearchPlaceholder: string;
  disclaimer: string;
}

const DISCLAIMER =
  "This is contextual guidance only — not an appraisal, guarantee of value, or investment advice. Value depends on market conditions, condition, and verification beyond this archive.";

export const valuationContextAgent: Agent<ValuationInput, ValuationOutput> = {
  type: "valuation_context",
  description: "Explains value drivers without appraising the car or inventing comparable sales.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<ValuationOutput>> {
    const { scope } = input;
    const v = scope.vehicle;
    const pos: string[] = [];
    const neg: string[] = [];
    const gaps: string[] = [];

    if (scope.serviceEvents.length >= 3) pos.push("Documented service history");
    else gaps.push("More complete service documentation");
    if (v?.knownFlaws) pos.push("Transparent flaw disclosure (builds buyer trust)");
    if (scope.photos.length >= 8) pos.push("Thorough photo coverage");
    else gaps.push("Additional photos for buyer confidence");
    if (scope.modifications.length && !scope.modifications.some((m) => /reversible/i.test(m.reversibleStatus || ""))) neg.push("Permanent modifications may narrow the buyer pool");
    if (!v?.titleStatus) gaps.push("Title status documentation");

    return {
      ok: true,
      agentType: "valuation_context",
      output: {
        valuePositiveFactors: pos,
        valueNegativeFactors: neg,
        documentationGaps: gaps,
        suggestedPreparation: ["Close documentation gaps", "Disclose flaws honestly", "Add undercarriage + detail photos"],
        comparableResearchPlaceholder: "Research recent sales of comparable examples on reputable marketplaces. (We do not fabricate comps.)",
        disclaimer: DISCLAIMER,
      },
      confidence: 0.6,
      sources: [],
      assumptions: ["No market value is asserted; factors are derived from your documentation only."],
      missingData: gaps,
      nextActions: ["Research real comparable sales yourself", "Close the listed documentation gaps"],
      riskFlags: [{ severity: "low", category: "legal", message: "Never present this as a guaranteed value or appraisal." }],
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
