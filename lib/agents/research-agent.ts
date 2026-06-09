import type { Agent, AgentResult } from "./types";

interface ResearchInput {
  topic: string;
}

interface ResearchOutput {
  summary: string;
  sources: string[];
  webAccessAvailable: boolean;
}

/**
 * Research Agent — surfaces public best-practice context. When live web access
 * is wired in, it should cite real sources. It NEVER turns research into a
 * vehicle "fact" — research informs strategy, not a car's record.
 */
export const researchAgent: Agent<ResearchInput, ResearchOutput> = {
  type: "research",
  description: "Researches public best practices and trends; cites sources. Never used as a vehicle fact.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<ResearchOutput>> {
    return {
      ok: true,
      agentType: "research",
      output: {
        summary: `Research on "${input.topic}" requires a connected web tool. In mock mode no external sources are fetched, so no findings are fabricated.`,
        sources: [],
        webAccessAvailable: false,
      },
      confidence: 0.4,
      sources: [],
      assumptions: ["Web access is not configured in this build; nothing is invented."],
      missingData: ["Live web search results"],
      nextActions: ["Connect a web search/fetch tool to enable cited research."],
      riskFlags: [{ severity: "low", category: "data", message: "Never apply research to a specific car as a verified fact." }],
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
