import type { Agent, AgentResult } from "./types";
import type { UserMode } from "@/lib/brand";

interface OnboardingInput {
  mode: UserMode;
  firstVehicle?: { year?: number; model?: string } | null;
  goals?: string[];
}

interface OnboardingOutput {
  recommendedFirstActions: string[];
  dashboardLayout: string[];
  suggestedChecklist: { label: string; done: boolean }[];
  suggestedTools: string[];
  emptyStateCopy: string;
}

const BY_MODE: Record<UserMode, OnboardingOutput> = {
  owner: {
    recommendedFirstActions: ["Add your first vehicle", "Upload a service record", "Write a short ownership story"],
    dashboardLayout: ["garage", "service-timeline", "next-best-action", "completeness"],
    suggestedChecklist: [
      { label: "Add a vehicle", done: false },
      { label: "Upload one document", done: false },
      { label: "Add 3 photos", done: false },
    ],
    suggestedTools: ["document", "timeline", "archive_curator"],
    emptyStateCopy: "Your garage is empty. Add your Porsche to begin preserving its story.",
  },
  collector: {
    recommendedFirstActions: ["Add vehicles to your collection", "Set up provenance notes", "Enable maintenance reminders"],
    dashboardLayout: ["collection-dashboard", "provenance", "maintenance", "portfolio"],
    suggestedChecklist: [
      { label: "Add 2+ vehicles", done: false },
      { label: "Add provenance highlights", done: false },
    ],
    suggestedTools: ["archive_curator", "timeline", "valuation_context"],
    emptyStateCopy: "Build your collection. Each car becomes a documented chapter of your archive.",
  },
  buyer: {
    recommendedFirstActions: ["Start a watchlist", "Add a vehicle you're considering", "Run a due-diligence checklist"],
    dashboardLayout: ["watchlist", "compare", "due-diligence", "research"],
    suggestedChecklist: [
      { label: "Add a vehicle to watch", done: false },
      { label: "Generate a due-diligence checklist", done: false },
    ],
    suggestedTools: ["buyer_due_diligence", "buyer_faq", "claim_verification"],
    emptyStateCopy: "Track the cars you're considering and verify before you buy.",
  },
  seller: {
    recommendedFirstActions: ["Add the vehicle you're selling", "Upload its records", "Generate a seller packet"],
    dashboardLayout: ["vehicle", "seller-packet", "public-page", "leads"],
    suggestedChecklist: [
      { label: "Upload service records", done: false },
      { label: "Disclose known flaws", done: false },
      { label: "Generate a seller packet", done: false },
    ],
    suggestedTools: ["seller_packet", "listing", "photo_coach", "privacy_guard"],
    emptyStateCopy: "Prepare a clean, buyer-ready presentation of your Porsche.",
  },
  auction: {
    recommendedFirstActions: ["Add the vehicle", "Complete the photo checklist", "Generate an auction-style draft"],
    dashboardLayout: ["auction-prep", "photo-checklist", "qa-prep", "readiness"],
    suggestedChecklist: [
      { label: "Reach 8+ photos", done: false },
      { label: "Add undercarriage photos", done: false },
      { label: "Generate auction draft", done: false },
    ],
    suggestedTools: ["auction_prep", "photo_coach", "claim_verification", "buyer_reply"],
    emptyStateCopy: "Assemble an auction-grade listing with honest, documented claims.",
  },
  dealer: {
    recommendedFirstActions: ["Set up inventory", "Bulk-upload vehicles", "Create branded public pages"],
    dashboardLayout: ["inventory", "leads", "marketing", "campaigns"],
    suggestedChecklist: [
      { label: "Add inventory", done: false },
      { label: "Enable lead capture", done: false },
    ],
    suggestedTools: ["listing", "instagram", "ad", "campaign"],
    emptyStateCopy: "Manage inventory, capture leads, and prepare premium listings at scale.",
  },
  browse: {
    recommendedFirstActions: ["Explore the public archive", "Save vehicles you like", "Read buying guides"],
    dashboardLayout: ["explore", "watchlist", "research"],
    suggestedChecklist: [{ label: "Explore the demo archive", done: false }],
    suggestedTools: ["research", "buyer_due_diligence"],
    emptyStateCopy: "Explore documented Porsches and learn what a well-kept archive looks like.",
  },
};

export const onboardingAgent: Agent<OnboardingInput, OnboardingOutput> = {
  type: "onboarding",
  description: "Customizes the product experience based on the user's selected intent.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<OnboardingOutput>> {
    const output = BY_MODE[input.mode] ?? BY_MODE.owner;
    return {
      ok: true,
      agentType: "onboarding",
      output,
      confidence: 0.9,
      sources: [{ field: "mode", value: input.mode, kind: "user_provided_claim" }],
      assumptions: input.goals?.length ? [] : ["No specific goals provided; using mode defaults."],
      missingData: [],
      nextActions: output.recommendedFirstActions,
      riskFlags: [],
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
