import type { Agent, AgentResult, ScopedContext } from "./types";

interface BuyerFaqInput {
  scope: ScopedContext;
}

interface BuyerFaqOutput {
  faq: { q: string; a: string; needsUserInput: boolean }[];
}

export const buyerFaqAgent: Agent<BuyerFaqInput, BuyerFaqOutput> = {
  type: "buyer_faq",
  description: "Generates likely buyer questions with answers grounded in provided data.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<BuyerFaqOutput>> {
    const { scope } = input;
    const v = scope.vehicle;
    const ans = (cond: any, yes: string): { a: string; needs: boolean } =>
      cond ? { a: yes, needs: false } : { a: "Needs the owner's input.", needs: true };

    const faq = [
      { q: "What service history is included?", ...ans(scope.serviceEvents.length, `${scope.serviceEvents.length} documented entries from the owner's files.`) },
      { q: "How many owners?", ...ans(v?.ownershipStory, "See the ownership notes provided.") },
      { q: "Any modifications?", ...ans(scope.modifications.length, scope.modifications.map((m) => m.name).join(", ") || "") },
      { q: "Tire and brake condition?", ...ans(false, "") },
      { q: "Paint/body condition?", ...ans(scope.photos.length >= 4, "See photos; independent inspection recommended.") },
      { q: "Accident history?", ...ans(false, "") },
      { q: "Title status?", ...ans(v?.titleStatus, v?.titleStatus || "") },
      { q: "Known flaws?", ...ans(v?.knownFlaws, v?.knownFlaws || "") },
      { q: "Reason for sale?", ...ans(false, "") },
      { q: "Has it been tracked?", ...ans(false, "") },
      { q: "IMS/RMS or bore scoring (where relevant)?", ...ans(false, "") },
      { q: "Will you support a PPI?", a: "Recommended — most sellers welcome a buyer-arranged PPI.", needsUserInput: false },
    ].map((f) => ({ q: f.q, a: f.a, needsUserInput: (f as any).needs ?? (f as any).needsUserInput ?? false }));

    return {
      ok: true,
      agentType: "buyer_faq",
      output: { faq },
      confidence: 0.7,
      sources: [],
      assumptions: ["Answers reflect provided data only; unknowns are flagged for the owner."],
      missingData: faq.filter((f) => f.needsUserInput).map((f) => f.q),
      nextActions: ["Fill in the questions marked as needing input."],
      riskFlags: [],
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
