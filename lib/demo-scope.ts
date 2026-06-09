import type { ScopedContext } from "@/lib/agents/types";
import type { DemoVehicle } from "@/lib/demo-data";

/** Build an agent ScopedContext from a DemoVehicle view object (used in demo mode). */
export function demoVehicleToScope(v: DemoVehicle, organizationId = "demo"): ScopedContext {
  return {
    organizationId,
    vehicle: {
      id: v.slug, year: v.year, make: v.make, model: v.model, trim: v.trim, generation: v.generation,
      mileage: v.mileage, transmission: v.transmission, exteriorColor: v.exteriorColor, interiorColor: v.interiorColor,
      options: v.options, knownFlaws: v.knownFlaws, ownershipStory: v.ownershipStory, archiveNotes: v.archiveNotes,
      titleStatus: v.titleStatus, ownershipStatus: v.ownershipStatus, isDemo: true,
    },
    serviceEvents: v.service.map((s, i) => ({
      id: `${v.slug}-svc-${i}`, eventDate: s.date, mileage: s.mileage, vendor: s.vendor,
      category: s.category, summary: s.summary, cost: s.cost, documentId: null, verificationStatus: "user_provided",
    })),
    modifications: v.modifications.map((m, i) => ({
      id: `${v.slug}-mod-${i}`, name: m.name, category: m.category, brand: m.brand,
      installDate: null, reversibleStatus: m.reversible, oemPartsRetained: m.oemRetained, documentId: null,
    })),
    documents: v.documents.map((d, i) => ({
      id: `${v.slug}-doc-${i}`, fileName: d.name, documentType: d.type, status: "extracted", isPrivate: d.isPrivate, extractedText: null,
    })),
    photos: v.photos.map((p, i) => ({
      id: `${v.slug}-pho-${i}`, category: p.category, containsLicensePlate: false, containsPersonalInfo: false, approvedForPublic: true,
    })),
  };
}
