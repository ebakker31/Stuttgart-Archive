import type { Agent, AgentResult } from "./types";

interface CritiqueInput {
  area?: "homepage" | "onboarding" | "pricing" | "garage" | "seller" | "auction" | "trust" | "design";
}

interface CritiqueItem {
  area: string;
  weakness: string;
  why: string;
  fix: string;
  priority: "low" | "medium" | "high";
}

interface CritiqueOutput {
  findings: CritiqueItem[];
  premiumArchiveFeel: number; // 0..100
}

export const selfCritiqueAgent: Agent<CritiqueInput, CritiqueOutput> = {
  type: "self_critique",
  description: "Critiques product, UX, copy, pricing, and trust model before launch.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<CritiqueOutput>> {
    const all: CritiqueItem[] = [
      { area: "onboarding", weakness: "Mode selection must visibly change the dashboard.", why: "If it doesn't, the personalization promise feels hollow.", fix: "Render mode-specific first actions + empty states.", priority: "high" },
      { area: "trust", weakness: "Every AI output needs a visible source/confidence label.", why: "Trust is the core differentiator vs. generic tools.", fix: "Use SourceReferenceBadge + AIInsightCard everywhere.", priority: "high" },
      { area: "pricing", weakness: "Free tier must feel genuinely useful, not crippled.", why: "Free-first is the acquisition engine.", fix: "Keep core garage + timelines + basic public page free.", priority: "medium" },
      { area: "design", weakness: "Avoid generic SaaS gradients; lean archival.", why: "The premium museum feel is the brand moat.", fix: "Parchment, hairlines, serif display, archive labels.", priority: "medium" },
    ];
    const findings = all.filter((f) => !input.area || f.area === input.area);

    return {
      ok: true,
      agentType: "self_critique",
      output: { findings, premiumArchiveFeel: 78 },
      confidence: 0.7,
      sources: [],
      assumptions: ["Heuristic critique; pair with real user feedback."],
      missingData: ["Real user session data"],
      nextActions: findings.filter((f) => f.priority === "high").map((f) => f.fix),
      riskFlags: [],
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
