import type { Agent, AgentResult, ScopedContext } from "./types";

interface InstagramInput {
  scope: ScopedContext;
  tone?: "editorial" | "enthusiast" | "minimal";
}

interface InstagramOutput {
  captions: string[];
  hooks: string[];
  reelScript: string[];
  storyFrames: string[];
  carouselOutline: string[];
  hashtags: string[];
  cta: string;
  suggestedVisuals: string[];
  claimWarnings: string[];
  approvalStatus: "draft_requires_approval";
}

export const instagramAgent: Agent<InstagramInput, InstagramOutput> = {
  type: "instagram",
  description: "Generates organic social content drafts. Never auto-posts in MVP.",
  canHaveExternalSideEffect: true, // posting would be external — always blocked/approval-gated
  async run(input): Promise<AgentResult<InstagramOutput>> {
    const { scope } = input;
    const v = scope.vehicle;
    const name = `${v?.year ?? ""} ${v?.model ?? "Porsche"} ${v?.trim ?? ""}`.trim();

    const warnings: string[] = [];
    if (!v?.knownFlaws) warnings.push("Keep captions honest — don't imply perfection.");

    return {
      ok: true,
      agentType: "instagram",
      output: {
        captions: [
          `${name}. Every receipt, every service, every detail — preserved.`,
          `The story behind this ${v?.model ?? "Porsche"} lives in its records. Swipe for the archive.`,
        ],
        hooks: [`What ${v?.mileage ? `${v.mileage.toLocaleString()} miles` : "years"} of care looks like`, "A folder of receipts becomes a story"],
        reelScript: ["Open on a slow detail pan", "Cut to documents fanned out", "Cold start audio", "End on full front 3/4", "Caption: preserved, documented, ready"],
        storyFrames: ["Hero shot + name", "Service history teaser", "One signature detail", "Swipe-up to the archive page"],
        carouselOutline: ["Hero", "Key specs", "Service highlights", "A documented detail", "Known-flaws honesty slide", "Where to learn more"],
        hashtags: ["#porsche", "#aircooled", "#porscheclassic", "#carchive", "#provenance", "#enthusiastowned"],
        cta: "Full documented archive in bio.",
        suggestedVisuals: ["Even diffused light", "Document close-ups", "One hero, one detail, one interior"],
        claimWarnings: warnings,
        approvalStatus: "draft_requires_approval",
      },
      confidence: 0.7,
      sources: [],
      assumptions: ["Content references only provided facts."],
      missingData: [],
      nextActions: ["Review + approve before posting manually. Stuttgart Archive never auto-posts."],
      riskFlags: [{ severity: "low", category: "brand", message: "Do not imply official affiliation or use official imagery." }, ...warnings.map((w) => ({ severity: "low" as const, category: "claim" as const, message: w }))],
      approvalRequired: true,
      externalSideEffect: false,
    };
  },
};
