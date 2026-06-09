import type { Agent, AgentResult, ScopedContext } from "./types";

interface MissingInput {
  scope: ScopedContext;
}

interface MissingRecord {
  record: string;
  importance: "high" | "medium" | "low";
  whyItMatters: string;
  nextStep: string;
  neededForSellerPacket: boolean;
  neededForAuction: boolean;
  neededForBuyerDueDiligence: boolean;
}

export const missingRecordsAgent: Agent<MissingInput, { missing: MissingRecord[] }> = {
  type: "missing_records",
  description: "Identifies paperwork that is likely missing and explains why it matters.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<{ missing: MissingRecord[] }>> {
    const { scope } = input;
    const has = (re: RegExp) =>
      scope.documents.some((d) => re.test(`${d.documentType} ${d.fileName}`)) ||
      scope.serviceEvents.some((e) => re.test(`${e.category} ${e.summary}`));

    const candidates: MissingRecord[] = [];
    const add = (r: MissingRecord) => candidates.push(r);

    if (!has(/title/i)) add({ record: "Title document", importance: "high", whyItMatters: "Buyers and auctions need to confirm title status.", nextStep: "Scan the title (keep private).", neededForSellerPacket: true, neededForAuction: true, neededForBuyerDueDiligence: true });
    if (!has(/service|oil|maintenance/i)) add({ record: "Service records", importance: "high", whyItMatters: "Documented maintenance is the single biggest value driver.", nextStep: "Gather invoices from your shop or dealer.", neededForSellerPacket: true, neededForAuction: true, neededForBuyerDueDiligence: true });
    if (!has(/window sticker|build sheet|monroney/i)) add({ record: "Window sticker / build sheet", importance: "medium", whyItMatters: "Confirms factory options and original spec.", nextStep: "Request from dealer using the VIN.", neededForSellerPacket: true, neededForAuction: true, neededForBuyerDueDiligence: false });
    if (!has(/ppi|inspection/i)) add({ record: "Pre-purchase inspection (PPI)", importance: "medium", whyItMatters: "Independent verification builds buyer trust.", nextStep: "Arrange a marque specialist PPI.", neededForSellerPacket: false, neededForAuction: true, neededForBuyerDueDiligence: true });
    if (!has(/tire/i)) add({ record: "Tire records", importance: "low", whyItMatters: "Tire age/condition affects readiness and safety.", nextStep: "Note install date and brand.", neededForSellerPacket: false, neededForAuction: true, neededForBuyerDueDiligence: false });

    return {
      ok: true,
      agentType: "missing_records",
      output: { missing: candidates },
      confidence: 0.8,
      sources: scope.documents.map((d) => ({ field: "document", value: d.documentType, kind: "document_supported" as const, documentId: d.id })),
      assumptions: ["Based only on documents currently uploaded."],
      missingData: candidates.map((c) => c.record),
      nextActions: candidates.slice(0, 3).map((c) => c.nextStep),
      riskFlags: [],
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
