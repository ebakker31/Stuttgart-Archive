import type { Agent, AgentResult, ScopedContext } from "./types";
import { auctionReadinessScore } from "@/lib/scoring";

interface AuctionInput {
  scope: ScopedContext;
  targetStyle?: "auction-style" | "private-sale" | "dealer";
}

interface AuctionOutput {
  listingTitle: string;
  shortSummary: string;
  longDescription: string;
  highlights: string[];
  equipment: string[];
  modifications: string[];
  recentService: string[];
  knownFlaws: string;
  ownershipHistory: string;
  includedItems: string[];
  photoGaps: string[];
  videoRecommendations: string[];
  sellerQAndA: { q: string; a: string }[];
  commentResponseGuidance: string[];
  riskyClaims: string[];
  readinessScore: number;
  missingItems: string[];
}

const REQUIRED_PHOTOS = ["front 3/4", "rear 3/4", "side profile", "interior", "engine/frunk", "wheels", "undercarriage", "gauge cluster"];

export const auctionPrepAgent: Agent<AuctionInput, AuctionOutput> = {
  type: "auction_prep",
  description: "Prepares auction-style listing materials. Independent of any auction platform.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<AuctionOutput>> {
    const { scope } = input;
    const v = scope.vehicle;
    const name = `${v?.year ?? ""} ${v?.make ?? "Porsche"} ${v?.model ?? ""} ${v?.trim ?? ""}`.trim();
    const readiness = auctionReadinessScore(scope);

    const recentService = scope.serviceEvents
      .slice().sort((a, b) => (b.eventDate || "").localeCompare(a.eventDate || "")).slice(0, 6)
      .map((e) => `${e.eventDate ?? "Recent"}: ${e.summary ?? e.category}`);

    const presentCategories = new Set(scope.photos.map((p) => (p.category || "").toLowerCase()));
    const photoGaps = REQUIRED_PHOTOS.filter((p) => !Array.from(presentCategories).some((c) => p.toLowerCase().includes(c) || c.includes(p.split(" ")[0])));

    const risky: string[] = [];
    if (!v?.knownFlaws) risky.push("No flaws disclosed — auction audiences scrutinize this heavily.");
    if (!scope.serviceEvents.length) risky.push('Do not claim "well-maintained" without records.');

    return {
      ok: true,
      agentType: "auction_prep",
      output: {
        listingTitle: `${name}${v?.mileage ? ` — ${v.mileage.toLocaleString()} Miles` : ""}`,
        shortSummary: `${name} offered with the documentation preserved in this archive.`,
        longDescription: `This ${name} is presented with the records its owner has organized in Stuttgart Archive. ${v?.ownershipStory || ""}`.trim(),
        highlights: [v?.mileage ? `${v.mileage.toLocaleString()} miles` : "", v?.transmission || "", `${scope.serviceEvents.length} service entries`].filter(Boolean) as string[],
        equipment: v?.options ?? [],
        modifications: scope.modifications.map((m) => `${m.name}${m.brand ? ` (${m.brand})` : ""}`),
        recentService,
        knownFlaws: v?.knownFlaws || "None disclosed by the seller; independent inspection recommended.",
        ownershipHistory: v?.ownershipStory || "Ownership details to be added by the seller.",
        includedItems: scope.documents.map((d) => d.documentType || "document"),
        photoGaps,
        videoRecommendations: ["Cold start (first turn of the day)", "Walkaround narrating condition", "Driving/exhaust clip", "Undercarriage pan"],
        sellerQAndA: [
          { q: "Any deferred maintenance?", a: v?.knownFlaws || "Seller to confirm." },
          { q: "Why selling?", a: "Seller to provide a genuine reason." },
        ],
        commentResponseGuidance: ["Answer factually and quickly.", "If you don't know, say so and offer to check.", "Never overstate — auction crowds verify.", "All replies require your approval before sending."],
        riskyClaims: risky,
        readinessScore: readiness.score,
        missingItems: [...photoGaps.map((p) => `Photo: ${p}`), ...(v?.knownFlaws ? [] : ["Known-flaws disclosure"])],
      },
      confidence: 0.75,
      sources: scope.serviceEvents.map((e) => ({ field: "service_event", value: e.summary, kind: "document_supported" as const, documentId: e.documentId })),
      assumptions: ["Auction draft is a starting point; the seller is responsible for all published claims."],
      missingData: photoGaps,
      nextActions: ["Close photo gaps", "Record the recommended videos", "Run Claim Verification + Privacy Guard"],
      riskFlags: risky.map((r) => ({ severity: "high" as const, category: "claim" as const, message: r })),
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
