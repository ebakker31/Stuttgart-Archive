import type { Agent, AgentResult, ScopedContext } from "./types";

interface BuyerReplyInput {
  question: string;
  scope: ScopedContext;
}

interface BuyerReplyOutput {
  suggestedReply: string;
  sourceReferences: string[];
  unknownsRequiringConfirmation: string[];
  saferWording: string[];
  approvalRequired: true;
}

export const buyerReplyAgent: Agent<BuyerReplyInput, BuyerReplyOutput> = {
  type: "buyer_reply",
  description: "Drafts replies to buyer questions. Never sends without explicit approval.",
  canHaveExternalSideEffect: true,
  async run(input): Promise<AgentResult<BuyerReplyOutput>> {
    const { scope, question } = input;
    const q = question.toLowerCase();
    const unknowns: string[] = [];
    let reply = "";

    if (/service|history|maintenance/.test(q)) {
      reply = scope.serviceEvents.length
        ? `Service history includes ${scope.serviceEvents.length} documented entries from my files; I can share the records.`
        : "I'm still assembling the service records; I'll share what I have.";
      if (!scope.serviceEvents.length) unknowns.push("Confirm which records you actually have.");
    } else if (/accident|paint|story/.test(q)) {
      reply = "I can only speak to what my records show. " + (scope.vehicle?.knownFlaws ? `Disclosed condition notes: ${scope.vehicle.knownFlaws}.` : "I'd encourage an independent inspection.");
      unknowns.push("Confirm accident/paint history personally — don't assert what you can't back.");
    } else if (/title/.test(q)) {
      reply = scope.vehicle?.titleStatus ? `Title status: ${scope.vehicle.titleStatus}.` : "I'll confirm the exact title status and share documentation.";
      if (!scope.vehicle?.titleStatus) unknowns.push("Confirm title status from the actual document.");
    } else {
      reply = "Happy to help — let me check my records and get back to you with specifics.";
      unknowns.push("Answer factually from your records before sending.");
    }

    return {
      ok: true,
      agentType: "buyer_reply",
      output: {
        suggestedReply: reply,
        sourceReferences: scope.serviceEvents.slice(0, 3).map((e) => e.summary || "record").filter(Boolean) as string[],
        unknownsRequiringConfirmation: unknowns,
        saferWording: ["State only what your records support.", "Use 'my records show…' rather than absolutes."],
        approvalRequired: true,
      },
      confidence: 0.65,
      sources: [],
      assumptions: ["Draft only. Stuttgart Archive never sends messages on your behalf without approval."],
      missingData: unknowns,
      nextActions: ["Review, edit, and send the reply yourself."],
      riskFlags: [{ severity: "medium", category: "claim", message: "Verify every factual statement before sending." }],
      approvalRequired: true,
      externalSideEffect: false,
    };
  },
};
