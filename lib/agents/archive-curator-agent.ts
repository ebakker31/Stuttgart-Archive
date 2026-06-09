import type { Agent, AgentResult, ScopedContext } from "./types";

interface CuratorInput {
  scope: ScopedContext;
}

interface ArchiveChapter {
  title: string;
  caption: string;
  yearRange?: string;
}

interface CuratorOutput {
  chapters: ArchiveChapter[];
  archiveNotes: string;
  museumCaptions: string[];
  suggestedMissingProvenance: string[];
}

/**
 * Archive Curator — turns scattered records into a tasteful, chronological
 * history. It NEVER invents facts or model history; captions restate only
 * user-provided facts and clearly separate fact from interpretation.
 */
export const archiveCuratorAgent: Agent<CuratorInput, CuratorOutput> = {
  type: "archive_curator",
  description: "Organizes a vehicle's real records into a collector-grade archive narrative.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<CuratorOutput>> {
    const { scope } = input;
    const v = scope.vehicle;

    const years = Array.from(
      new Set(scope.serviceEvents.map((e) => (e.eventDate ? new Date(e.eventDate).getFullYear() : null)).filter(Boolean))
    ).sort() as number[];

    const chapters: ArchiveChapter[] = [];
    if (v?.year) chapters.push({ title: "Origins", caption: `${v.year} ${v.make ?? "Porsche"} ${v.model ?? ""}${v.exteriorColor ? `, finished in ${v.exteriorColor}` : ""}.`, yearRange: `${v.year}` });
    if (years.length) chapters.push({ title: "Service & Care", caption: `${scope.serviceEvents.length} documented service entries spanning ${years[0]}–${years[years.length - 1]}.`, yearRange: `${years[0]}–${years[years.length - 1]}` });
    if (scope.modifications.length) chapters.push({ title: "Evolution", caption: `${scope.modifications.length} owner-documented modification(s), disclosed in full.` });
    if (v?.ownershipStory) chapters.push({ title: "In the Owner's Words", caption: v.ownershipStory });

    const captions = scope.serviceEvents.slice(0, 4).map((e) => `${e.eventDate ?? "Undated"} — ${e.summary ?? e.category ?? "service"}${e.mileage ? `, ${e.mileage.toLocaleString()} mi` : ""}.`);

    const missing: string[] = [];
    if (!v?.ownershipStory) missing.push("A short ownership story in your own words");
    if (!scope.documents.some((d) => /window sticker|build/i.test(`${d.documentType}`))) missing.push("Original build sheet or window sticker");
    if (!scope.photos.length) missing.push("Period or current photography");

    return {
      ok: true,
      agentType: "archive_curator",
      output: {
        chapters,
        archiveNotes: v?.archiveNotes || "Archive notes not yet written. Add a few lines about what makes this example meaningful — facts only.",
        museumCaptions: captions,
        suggestedMissingProvenance: missing,
      },
      confidence: 0.8,
      sources: scope.serviceEvents.map((e) => ({ field: "service_event", value: e.summary, kind: "document_supported" as const, documentId: e.documentId })),
      assumptions: ["Narrative restates only your provided facts; no model or historical significance is invented."],
      missingData: missing,
      nextActions: ["Add the suggested provenance material to deepen the archive."],
      riskFlags: [{ severity: "low", category: "claim", message: "Keep captions factual; do not assert historical significance without a source." }],
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
