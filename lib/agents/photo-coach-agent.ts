import type { Agent, AgentResult, ScopedContext } from "./types";

interface PhotoInput {
  scope: ScopedContext;
}

interface PhotoOutput {
  missingExterior: string[];
  missingInterior: string[];
  missingWheelTire: string[];
  missingEngineTrunk: string[];
  missingUndercarriage: string[];
  missingFlawDocumentation: string[];
  listingShotList: string[];
  instagramShotList: string[];
  auctionShotList: string[];
}

const EXTERIOR = ["front", "rear", "driver side", "passenger side", "front 3/4", "rear 3/4", "roof"];
const INTERIOR = ["dashboard", "front seats", "rear seats", "gauge cluster", "door cards", "trunk/frunk lining"];
const WHEEL = ["each wheel face", "tire date codes", "brake calipers"];
const ENGINE = ["engine bay", "frunk", "trunk", "VIN plate (private)"];

function missing(present: Set<string>, required: string[]) {
  return required.filter((r) => !Array.from(present).some((p) => p.includes(r.split(" ")[0]) || r.includes(p)));
}

export const photoCoachAgent: Agent<PhotoInput, PhotoOutput> = {
  type: "photo_coach",
  description: "Analyzes photo coverage and recommends missing shots for listings, auctions, and social.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<PhotoOutput>> {
    const present = new Set(input.scope.photos.map((p) => (p.category || "").toLowerCase()));
    const hasUnder = Array.from(present).some((p) => p.includes("under"));

    return {
      ok: true,
      agentType: "photo_coach",
      output: {
        missingExterior: missing(present, EXTERIOR),
        missingInterior: missing(present, INTERIOR),
        missingWheelTire: missing(present, WHEEL),
        missingEngineTrunk: missing(present, ENGINE),
        missingUndercarriage: hasUnder ? [] : ["full undercarriage", "suspension corners", "exhaust"],
        missingFlawDocumentation: ["Close-ups of any chips, scratches, curb rash, or wear"],
        listingShotList: [...EXTERIOR, ...INTERIOR, "odometer", "key/accessories"],
        instagramShotList: ["hero front 3/4 in good light", "detail of a signature design line", "wheel detail", "interior mood", "badge/script"],
        auctionShotList: [...EXTERIOR, ...INTERIOR, ...WHEEL, ...ENGINE, "undercarriage", "paint meter readings", "every documented flaw"],
      },
      confidence: 0.9,
      sources: input.scope.photos.map((p) => ({ field: "photo", value: p.category, kind: "user_provided_claim" as const })),
      assumptions: ["Coverage inferred from photo categories you've tagged."],
      missingData: hasUnder ? [] : ["Undercarriage photos"],
      nextActions: ["Shoot the missing categories in even, diffused light."],
      riskFlags: [],
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
