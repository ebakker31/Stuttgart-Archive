import type { Agent, AgentResult, ScopedContext } from "./types";

interface AdInput {
  scope: ScopedContext;
  objective?: string;
}

interface AdOutput {
  campaignObjective: string;
  audienceConcept: string;
  primaryText: string;
  headline: string;
  description: string;
  cta: string;
  creativeNotes: string[];
  landingPageRecommendation: string;
  complianceWarnings: string[];
  reviewRequiredClaims: string[];
}

export const adAgent: Agent<AdInput, AdOutput> = {
  type: "ad",
  description: "Generates ad brief drafts. Never launches ads in MVP.",
  canHaveExternalSideEffect: true,
  async run(input): Promise<AgentResult<AdOutput>> {
    const v = input.scope.vehicle;
    const name = `${v?.year ?? ""} ${v?.model ?? "Porsche"} ${v?.trim ?? ""}`.trim();

    return {
      ok: true,
      agentType: "ad",
      output: {
        campaignObjective: input.objective || "Drive qualified inquiries to the vehicle's public page",
        audienceConcept: "Marque enthusiasts and considered buyers; interest-based + lookalike of past inquiries.",
        primaryText: `${name} — documented, honestly presented, and ready to review. See the full archive before you reach out.`,
        headline: `${name}, fully documented`,
        description: "Service records, photos, and honest disclosures in one place.",
        cta: "Learn More",
        creativeNotes: ["Use your own photography only", "Lead with the hero shot", "No official logos or imagery"],
        landingPageRecommendation: "The vehicle's public archive page (lead capture enabled).",
        complianceWarnings: ["No affiliation claims.", "No guaranteed-value or investment language.", "Disclose this is an independent platform."],
        reviewRequiredClaims: v?.knownFlaws ? [] : ["Avoid 'flawless'/'perfect' — no flaw disclosure on file."],
      },
      confidence: 0.65,
      sources: [],
      assumptions: ["Brief only — no spend is configured or launched."],
      missingData: [],
      nextActions: ["Review the brief. Launching ads requires your explicit action outside the platform in MVP."],
      riskFlags: [{ severity: "medium", category: "legal", message: "Ads are never launched automatically. Founder approval + manual setup required." }],
      approvalRequired: true,
      externalSideEffect: false,
    };
  },
};
