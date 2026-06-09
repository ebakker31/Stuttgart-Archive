import type { Agent, AgentResult } from "./types";

interface SupportInput {
  question: string;
}

interface SupportOutput {
  answer: string;
  helpfulLinks: string[];
  escalateToHuman: boolean;
}

const KB: { re: RegExp; answer: string; links: string[] }[] = [
  { re: /upload|document|paperwork/i, answer: "Open a vehicle → Documents → drag files into the upload zone. We extract dates, mileage, vendor, and services automatically, then you confirm. PDF, JPG, PNG, HEIC, WebP, DOCX, CSV, and TXT are supported.", links: ["/app/garage"] },
  { re: /private|privacy|public|vin/i, answer: "Vehicles are private by default. You choose exactly which fields go public, and the full VIN stays hidden unless you opt in under the vehicle's public-page settings.", links: ["/app/settings/privacy", "/privacy"] },
  { re: /seller packet|sell/i, answer: "Open the vehicle → Seller Packet. We assemble a packet from your records, flag missing info, and run a privacy check before you share.", links: ["/app/garage"] },
  { re: /buyer|due diligence|checklist/i, answer: "Use Buyer mode to build a watchlist and generate a due-diligence checklist that flags missing high-impact records.", links: ["/app/buy"] },
  { re: /price|plan|billing|upgrade/i, answer: "The core product is free (3 vehicles). Paid plans add capacity and tools. Manage everything under Billing.", links: ["/pricing", "/app/billing"] },
];

export const supportAgent: Agent<SupportInput, SupportOutput> = {
  type: "support",
  description: "Answers in-app help questions. No legal/financial/appraisal advice; escalates when unsure.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<SupportOutput>> {
    const hit = KB.find((k) => k.re.test(input.question));
    const legalish = /legal|tax|worth|value|apprais|invest/i.test(input.question);
    return {
      ok: true,
      agentType: "support",
      output: {
        answer: legalish
          ? "I can't give legal, tax, or appraisal advice. For value context, see the Valuation Context tool (which never guarantees a number), and consult a qualified professional."
          : hit?.answer || "I'll point you to the right place — could you share a bit more detail? I can also escalate to a human.",
        helpfulLinks: hit?.links || ["/app"],
        escalateToHuman: !hit && !legalish,
      },
      confidence: hit ? 0.8 : 0.5,
      sources: [],
      assumptions: ["Answers from the built-in help knowledge base only."],
      missingData: [],
      nextActions: hit ? [] : ["Escalate to support@stuttgartarchive.com if unresolved."],
      riskFlags: legalish ? [{ severity: "low", category: "legal", message: "Declined to give professional advice." }] : [],
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
