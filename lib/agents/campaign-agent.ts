import type { Agent, AgentResult, ScopedContext } from "./types";

interface CampaignInput {
  scope: ScopedContext;
  days?: 7 | 14;
}

interface DayPlan {
  day: number;
  post: string;
  reel?: string;
  story?: string;
}

interface CampaignOutput {
  days: DayPlan[];
  adBriefSummary: string;
  landingPageCta: string;
  buyerEducationPoints: string[];
  contentChecklist: string[];
}

export const campaignAgent: Agent<CampaignInput, CampaignOutput> = {
  type: "campaign",
  description: "Builds a 7- or 14-day marketing plan from the vehicle's real material.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<CampaignOutput>> {
    const n = input.days ?? 7;
    const v = input.scope.vehicle;
    const name = `${v?.year ?? ""} ${v?.model ?? "Porsche"}`.trim();
    const themes = ["Introduce the car", "Service story", "A signature detail", "Honest condition", "Ownership story", "Why it's special (factual)", "Call to action"];
    const days: DayPlan[] = Array.from({ length: n }, (_, i) => ({
      day: i + 1,
      post: `${name}: ${themes[i % themes.length]}`,
      reel: i % 3 === 0 ? "Detail pan + cold start" : undefined,
      story: i % 2 === 0 ? "Poll: what would you ask the seller?" : undefined,
    }));

    return {
      ok: true,
      agentType: "campaign",
      output: {
        days,
        adBriefSummary: "Optional paid amplification — see the Ads Kit for a full brief (review required).",
        landingPageCta: "View the documented archive",
        buyerEducationPoints: ["What documentation to expect", "Why service history matters", "How to verify before buying"],
        contentChecklist: ["Approve every post", "Use only your own photos", "Run Privacy Guard on captions", "No official logos"],
      },
      confidence: 0.7,
      sources: [],
      assumptions: ["Plan is a draft; nothing is scheduled or posted automatically."],
      missingData: [],
      nextActions: ["Approve the plan, then post manually each day."],
      riskFlags: [],
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
