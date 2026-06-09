import type { Agent, AgentResult, RiskFlag } from "./types";

interface BrandInput {
  text: string;
  context?: string;
}

interface BrandOutput {
  riskLevel: "low" | "medium" | "high";
  problems: { text: string; why: string; saferReplacement: string }[];
  brandToneScore: number; // 0..100
  launchApprovalRecommendation: "approve" | "revise" | "block";
}

/** Phrases that could imply official affiliation or trademark misuse. */
const AFFILIATION_PATTERNS: { re: RegExp; why: string; safer: string }[] = [
  { re: /official\s+porsche/i, why: "Implies official Porsche affiliation.", safer: "for Porsche owners and enthusiasts" },
  { re: /porsche\s+(museum|archive|passport)/i, why: "References an official Porsche entity/product.", safer: "your private vehicle archive" },
  { re: /porsche\s+approved|certified by porsche|endorsed by porsche/i, why: "Implies endorsement.", safer: "independently prepared" },
  { re: /\bwe are porsche\b|partnered with porsche/i, why: "Claims a relationship with Porsche AG.", safer: "an independent platform for Porsche owners" },
  { re: /bring a trailer|cars (?:and|&) bids|pcarmarket/i, why: "Names an auction platform; could imply affiliation.", safer: "auction-style listing" },
];

const HYPE_PATTERNS = /\b(guaranteed|investment-grade|once-in-a-lifetime|unicorn|holy grail|flawless|perfect)\b/i;

export const brandGuardianAgent: Agent<BrandInput, BrandOutput> = {
  type: "brand_guardian",
  description: "Protects the brand from affiliation, trademark, tone, and unsupported-claim risk.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<BrandOutput>> {
    const text = input.text || "";
    const problems: BrandOutput["problems"] = [];
    const flags: RiskFlag[] = [];

    for (const p of AFFILIATION_PATTERNS) {
      const m = text.match(p.re);
      if (m) {
        problems.push({ text: m[0], why: p.why, saferReplacement: p.safer });
        flags.push({ severity: "high", category: "brand", message: `${p.why} ("${m[0]}")`, saferWording: p.safer });
      }
    }

    const hype = text.match(HYPE_PATTERNS);
    if (hype) {
      problems.push({ text: hype[0], why: "Hype/absolute language undermines the restrained, collector-grade tone.", saferReplacement: "well-documented" });
      flags.push({ severity: "medium", category: "brand", message: `Tone risk: "${hype[0]}"`, saferWording: "well-documented" });
    }

    const high = flags.filter((f) => f.severity === "high").length;
    const riskLevel: BrandOutput["riskLevel"] = high ? "high" : flags.length ? "medium" : "low";
    const toneScore = Math.max(0, 100 - high * 35 - (flags.length - high) * 12);
    const rec: BrandOutput["launchApprovalRecommendation"] = high ? "block" : flags.length ? "revise" : "approve";

    return {
      ok: true,
      agentType: "brand_guardian",
      output: { riskLevel, problems, brandToneScore: toneScore, launchApprovalRecommendation: rec },
      confidence: 0.85,
      sources: [],
      assumptions: [],
      missingData: [],
      nextActions: problems.length ? problems.map((p) => `Replace "${p.text}" → "${p.saferReplacement}"`) : ["No brand risks detected."],
      riskFlags: flags,
      approvalRequired: high > 0,
      externalSideEffect: false,
    };
  },
};
