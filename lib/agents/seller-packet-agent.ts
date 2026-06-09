import type { Agent, AgentResult, ScopedContext } from "./types";

interface SellerPacketInput {
  scope: ScopedContext;
}

interface PacketSection {
  title: string;
  body: string;
}

interface SellerPacketOutput {
  title: string;
  sections: PacketSection[];
  documentIndex: { id: string; label: string }[];
  missingInfoWarnings: string[];
  claimRiskFlags: string[];
}

export const sellerPacketAgent: Agent<SellerPacketInput, SellerPacketOutput> = {
  type: "seller_packet",
  description: "Generates seller packet content strictly from provided data.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<SellerPacketOutput>> {
    const { scope } = input;
    const v = scope.vehicle;
    const title = v ? `${v.year ?? ""} ${v.make ?? "Porsche"} ${v.model ?? ""} ${v.trim ?? ""}`.trim() : "Vehicle";

    const serviceLines = scope.serviceEvents
      .slice()
      .sort((a, b) => (b.eventDate || "").localeCompare(a.eventDate || ""))
      .map((e) => `• ${e.eventDate ?? "Undated"} — ${e.summary ?? e.category ?? "service"}${e.mileage ? ` at ${e.mileage} mi` : ""}`)
      .join("\n");

    const modLines = scope.modifications.map((m) => `• ${m.name ?? "Modification"}${m.brand ? ` (${m.brand})` : ""}${m.reversibleStatus ? ` — ${m.reversibleStatus}` : ""}`).join("\n");

    const sections: PacketSection[] = [
      { title: "Vehicle Summary", body: `${title}${v?.mileage ? `, ${v.mileage} miles` : ""}${v?.exteriorColor ? `, ${v.exteriorColor}` : ""}${v?.interiorColor ? ` over ${v.interiorColor}` : ""}.` },
      { title: "Ownership", body: v?.ownershipStory || "Ownership notes not yet provided." },
      { title: "Service Highlights", body: serviceLines || "No service records provided yet." },
      { title: "Modifications", body: modLines || "No modifications recorded." },
      { title: "Known Flaws (disclosed)", body: v?.knownFlaws || "No known flaws were noted by the seller. Buyers should still inspect independently." },
      { title: "Documents Included", body: scope.documents.length ? `${scope.documents.length} document(s) on file.` : "No documents attached yet." },
    ];

    const warnings: string[] = [];
    if (!scope.serviceEvents.length) warnings.push("No service history — add records to strengthen the packet.");
    if (!v?.knownFlaws) warnings.push("No known-flaws disclosure — buyers expect transparency.");
    if (scope.photos.length < 6) warnings.push("Fewer than 6 photos — buyers want thorough coverage.");
    if (!v?.titleStatus) warnings.push("Title status not provided.");

    return {
      ok: true,
      agentType: "seller_packet",
      output: {
        title: `Seller Packet — ${title}`,
        sections,
        documentIndex: scope.documents.map((d) => ({ id: d.id, label: d.documentType || d.fileName || "Document" })),
        missingInfoWarnings: warnings,
        claimRiskFlags: ["Run the Claim Verification check before publishing any absolute claims."],
      },
      confidence: scope.serviceEvents.length ? 0.8 : 0.5,
      sources: scope.serviceEvents.map((e) => ({ field: "service_event", value: e.summary, kind: "document_supported" as const, documentId: e.documentId })),
      assumptions: ["Packet reflects only the records the seller uploaded."],
      missingData: warnings,
      nextActions: ["Review each section", "Resolve missing-info warnings", "Run Privacy Guard before sharing"],
      riskFlags: warnings.length ? [{ severity: "low", category: "quality", message: `${warnings.length} completeness gap(s).` }] : [],
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
