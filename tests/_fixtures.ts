import type { AgentContext, ScopedContext } from "@/lib/agents/types";

/** A minimal, well-documented scope used across guardrail tests. */
export function makeScope(overrides: Partial<ScopedContext> = {}): ScopedContext {
  return {
    organizationId: "org_test",
    vehicle: {
      id: "veh_test",
      year: 2018,
      make: "Porsche",
      model: "911 Carrera S",
      trim: "Carrera S",
      generation: "991.2",
      mileage: 18450,
      transmission: "PDK",
      knownFlaws: "Minor stone chips on the front bumper.",
      titleStatus: "Clean",
      ownershipStory: "Second owner, garage-kept.",
      isDemo: true,
    },
    serviceEvents: [
      { id: "s1", eventDate: "2020-10-03", mileage: 9800, vendor: "Authorized dealer", category: "major service", summary: "Oil service", cost: 980, documentId: "d1", verificationStatus: "user_provided" },
      { id: "s2", eventDate: "2022-11-20", mileage: 15200, vendor: "Independent specialist", category: "oil change", summary: "Oil and filter", cost: 350, documentId: "d2", verificationStatus: "user_provided" },
    ],
    modifications: [],
    documents: [
      { id: "d1", fileName: "service.pdf", documentType: "Service record", status: "extracted", isPrivate: false, extractedText: null },
      { id: "d3", fileName: "title.pdf", documentType: "Title document", status: "extracted", isPrivate: true, extractedText: null },
    ],
    photos: [
      { id: "p1", category: "front 3/4", containsLicensePlate: false, containsPersonalInfo: false, approvedForPublic: true },
    ],
    ...overrides,
  };
}

export const CTX: AgentContext = { organizationId: "org_test", userId: "user_test", vehicleId: "veh_test" };
