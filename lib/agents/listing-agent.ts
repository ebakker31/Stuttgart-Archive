import type { Agent, AgentResult, ScopedContext } from "./types";

interface ListingInput {
  scope: ScopedContext;
}

interface ListingOutput {
  shortDescription: string;
  longDescription: string;
  highlights: string[];
  optionsBreakdown: string[];
  recentMaintenance: string[];
  modificationDisclosure: string[];
  knownFlawsDisclosure: string;
  buyerFaq: { q: string; a: string }[];
  unsupportedClaimsWarning: string[];
}

export const listingAgent: Agent<ListingInput, ListingOutput> = {
  type: "listing",
  description: "Creates polished, honest listing copy from provided data. Never hides flaws or invents rarity.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<ListingOutput>> {
    const { scope } = input;
    const v = scope.vehicle;
    const name = `${v?.year ?? ""} ${v?.make ?? "Porsche"} ${v?.model ?? ""} ${v?.trim ?? ""}`.trim();

    const recent = scope.serviceEvents
      .slice()
      .sort((a, b) => (b.eventDate || "").localeCompare(a.eventDate || ""))
      .slice(0, 5)
      .map((e) => `${e.eventDate ?? "Recent"}: ${e.summary ?? e.category}`);

    const mods = scope.modifications.map((m) => `${m.name}${m.brand ? ` — ${m.brand}` : ""}${m.reversibleStatus ? ` (${m.reversibleStatus})` : ""}`);
    const highlights = [
      v?.mileage ? `${v.mileage.toLocaleString()} miles` : null,
      v?.transmission ? `${v.transmission}` : null,
      scope.serviceEvents.length ? `${scope.serviceEvents.length} documented service entries` : null,
      v?.exteriorColor ? `${v.exteriorColor} exterior` : null,
    ].filter(Boolean) as string[];

    const short = `${name}${v?.mileage ? ` with ${v.mileage.toLocaleString()} miles` : ""}. ${scope.serviceEvents.length ? "Comes with documented service records from the owner's files." : "Documentation is being assembled."} Offered by an enthusiast who has preserved its history in Stuttgart Archive.`;

    const long = [
      short,
      v?.ownershipStory ? `\n\nFrom the owner: ${v.ownershipStory}` : "",
      recent.length ? `\n\nRecent maintenance:\n${recent.map((r) => `• ${r}`).join("\n")}` : "",
      mods.length ? `\n\nModifications (disclosed):\n${mods.map((m) => `• ${m}`).join("\n")}` : "",
      `\n\nKnown flaws: ${v?.knownFlaws || "None noted by the seller; buyers should inspect independently."}`,
    ].join("");

    const faq = [
      { q: "Is there service history?", a: scope.serviceEvents.length ? "Yes — see the included records from the owner's files." : "Owner is assembling records; ask for what's available." },
      { q: "Any known flaws?", a: v?.knownFlaws || "None noted by the seller. An independent inspection is encouraged." },
      { q: "Title status?", a: v?.titleStatus || "Provided on request / confirm with the seller." },
    ];

    const warnings: string[] = [];
    if (!scope.serviceEvents.length) warnings.push('Avoid "full service history" — no records provided.');
    if (!v?.knownFlaws) warnings.push("Add an honest known-flaws note before publishing.");

    return {
      ok: true,
      agentType: "listing",
      output: {
        shortDescription: short,
        longDescription: long,
        highlights,
        optionsBreakdown: v?.options ?? [],
        recentMaintenance: recent,
        modificationDisclosure: mods,
        knownFlawsDisclosure: v?.knownFlaws || "No known flaws were disclosed by the seller.",
        buyerFaq: faq,
        unsupportedClaimsWarning: warnings,
      },
      confidence: 0.75,
      sources: scope.serviceEvents.map((e) => ({ field: "service_event", value: e.summary, kind: "document_supported" as const, documentId: e.documentId })),
      assumptions: ["Copy uses only provided records; no rarity or accident history is asserted."],
      missingData: warnings,
      nextActions: ["Run Claim Verification + Brand Guardian before publishing."],
      riskFlags: warnings.map((w) => ({ severity: "medium" as const, category: "claim" as const, message: w })),
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
