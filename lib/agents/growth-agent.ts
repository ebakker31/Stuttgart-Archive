import type { Agent, AgentResult } from "./types";

interface GrowthInput {
  focus?: "launch" | "content" | "community" | "referral";
}

interface GrowthOutput {
  launchPlan: string[];
  contentCalendar: string[];
  communityOutreach: string[];
  emailCampaigns: string[];
  referralIdeas: string[];
  paidConcepts: string[];
}

export const growthAgent: Agent<GrowthInput, GrowthOutput> = {
  type: "growth",
  description: "Creates marketing campaigns and growth experiments. All outbound requires founder approval.",
  canHaveExternalSideEffect: false,
  async run(): Promise<AgentResult<GrowthOutput>> {
    return {
      ok: true,
      agentType: "growth",
      output: {
        launchPlan: ["Soft launch to enthusiast friends", "Publish 6 demo archives", "Post a build-in-public thread", "Reach out to 3 Porsche clubs (genuine, non-spam)"],
        contentCalendar: ["Mon: feature a documented detail", "Wed: 'how to organize Porsche records' guide", "Fri: demo archive walkthrough reel"],
        communityOutreach: ["Reddit r/Porsche value-first post (read rules first)", "PCA region newsletter intro", "Local cars & coffee flyer"],
        emailCampaigns: ["Welcome series (opt-in)", "Weekly archive tips (opt-in)", "Seller-prep nudge for active sellers"],
        referralIdeas: ["Give a free Seller Pack for a referred paying user", "Collector who adds 5 cars unlocks portfolio sharing"],
        paidConcepts: ["Retarget public-page visitors", "Interest targeting: marque enthusiasts (brief only — never auto-launched)"],
      },
      confidence: 0.7,
      sources: [],
      assumptions: ["Drafts only. No posting, emailing, or ad spend happens without your explicit approval."],
      missingData: [],
      nextActions: ["Approve a single experiment and run it manually."],
      riskFlags: [{ severity: "low", category: "legal", message: "Respect each platform's rules; never spam or impersonate users." }],
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
