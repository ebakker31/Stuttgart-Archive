import type { Agent, AgentResult } from "./types";

interface FounderInput {
  launchChecklist?: { item: string; done: boolean }[];
  recentSignups?: number;
  openIssues?: string[];
}

interface FounderOutput {
  priorities: string[];
  launchChecklistStatus: { item: string; done: boolean }[];
  questionsForFounder: string[];
  weeklyReview: string;
  suggestedActions: string[];
}

const DEFAULT_CHECKLIST = [
  "Auth works end-to-end",
  "Stripe test checkout completes",
  "Email sends in mock/test mode",
  "Public page publishes only after approval",
  "RLS enabled on all tables",
  "Demo data clearly labeled",
  "Brand Guardian finds no high-risk copy",
  "README + env documented",
];

export const founderCopilotAgent: Agent<FounderInput, FounderOutput> = {
  type: "founder_copilot",
  description: "Helps the founder run the business: priorities, launch checklist, weekly review.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<FounderOutput>> {
    const checklist = input.launchChecklist?.length ? input.launchChecklist : DEFAULT_CHECKLIST.map((item) => ({ item, done: false }));
    const remaining = checklist.filter((c) => !c.done);
    const questions: string[] = [];
    if ((input.recentSignups ?? 0) === 0) questions.push("Where do you want the first 25 users to come from (clubs, Reddit, IG)?");
    if (remaining.length) questions.push(`Which launch blocker should I sequence first: ${remaining[0]?.item}?`);

    return {
      ok: true,
      agentType: "founder_copilot",
      output: {
        priorities: [remaining[0]?.item ?? "Polish onboarding", "Convert demo viewers to signups", "Collect 5 real user testimonials"],
        launchChecklistStatus: checklist,
        questionsForFounder: questions,
        weeklyReview: `Signups this period: ${input.recentSignups ?? 0}. Launch blockers remaining: ${remaining.length}. Open issues: ${(input.openIssues ?? []).length}.`,
        suggestedActions: ["Close the top launch blocker", "Post one tasteful demo walkthrough to a Porsche community (no spam)", "Email 3 enthusiasts for feedback"],
      },
      confidence: 0.7,
      sources: [],
      assumptions: ["Recommendations are operational guidance, not legal/financial/tax advice."],
      missingData: input.recentSignups === undefined ? ["Signup metrics"] : [],
      nextActions: questions.length ? questions : ["Proceed with the top priority."],
      riskFlags: [],
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
