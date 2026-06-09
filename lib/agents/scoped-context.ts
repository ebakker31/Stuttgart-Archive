import { getServerSupabase, getAdminSupabase } from "@/lib/supabase/server";
import type { AgentType, ScopedContext } from "./types";

/**
 * getAgentScopedContext — the single gateway through which agents receive data.
 *
 * Guarantees:
 *  1. Verifies the user belongs to the organization (permission check).
 *  2. Fetches ONLY the selected vehicle (+ optional documents), never others.
 *  3. Excludes private fields the agent doesn't need (e.g. VIN, leads).
 *  4. Redacts private documents' text unless the agent legitimately needs it.
 *  5. Returns a structured, minimal context object.
 *  6. Logs the access to audit_events.
 *
 * Without Supabase configured it returns an empty scope (demo/mock mode).
 */

const DOC_TEXT_AGENTS: AgentType[] = [
  "document",
  "timeline",
  "missing_records",
  "claim_verification",
];

export async function getAgentScopedContext(params: {
  organizationId: string;
  userId: string;
  vehicleId?: string | null;
  documentIds?: string[];
  agentType: AgentType;
}): Promise<ScopedContext> {
  const { organizationId, userId, vehicleId, documentIds, agentType } = params;

  const empty: ScopedContext = {
    organizationId,
    serviceEvents: [],
    modifications: [],
    documents: [],
    photos: [],
  };

  const db = getServerSupabase();
  if (!db) return empty;

  // 1. Permission check — the user must be a member of this organization.
  const { data: profile } = await db
    .from("profiles")
    .select("id, organization_id")
    .eq("id", userId)
    .maybeSingle();

  if (!profile || profile.organization_id !== organizationId) {
    // Caller is not permitted — return empty scope, never another org's data.
    return empty;
  }

  const ctx: ScopedContext = { ...empty };

  if (vehicleId) {
    // 2. Only the selected vehicle, scoped to the org (RLS also enforces this).
    const { data: v } = await db
      .from("vehicles")
      .select(
        "id, year, make, model, trim, generation, mileage, transmission, exterior_color, interior_color, known_flaws, ownership_story, archive_notes, title_status, ownership_status, is_demo"
      )
      .eq("organization_id", organizationId)
      .eq("id", vehicleId)
      .maybeSingle();

    if (v) {
      ctx.vehicle = {
        id: v.id,
        year: v.year,
        make: v.make,
        model: v.model,
        trim: v.trim,
        generation: v.generation,
        mileage: v.mileage,
        transmission: v.transmission,
        exteriorColor: v.exterior_color,
        interiorColor: v.interior_color,
        knownFlaws: v.known_flaws,
        ownershipStory: v.ownership_story,
        archiveNotes: v.archive_notes,
        titleStatus: v.title_status,
        ownershipStatus: v.ownership_status,
        isDemo: v.is_demo,
      };

      const [{ data: svc }, { data: mods }, { data: docs }, { data: pics }] = await Promise.all([
        db.from("service_events").select("id, event_date, mileage, vendor, category, summary, cost, document_id, verification_status").eq("vehicle_id", vehicleId),
        db.from("modification_events").select("id, modification_name, category, brand, install_date, reversible_status, oem_parts_retained, document_id").eq("vehicle_id", vehicleId),
        db.from("documents").select("id, file_name, document_type, status, is_private, extracted_text").eq("vehicle_id", vehicleId),
        db.from("photos").select("id, photo_category, contains_license_plate, contains_personal_info, approved_for_public").eq("vehicle_id", vehicleId),
      ]);

      ctx.serviceEvents = (svc ?? []).map((s: any) => ({
        id: s.id, eventDate: s.event_date, mileage: s.mileage, vendor: s.vendor,
        category: s.category, summary: s.summary, cost: s.cost, documentId: s.document_id,
        verificationStatus: s.verification_status,
      }));

      ctx.modifications = (mods ?? []).map((m: any) => ({
        id: m.id, name: m.modification_name, category: m.category, brand: m.brand,
        installDate: m.install_date, reversibleStatus: m.reversible_status,
        oemPartsRetained: m.oem_parts_retained, documentId: m.document_id,
      }));

      const includeText = DOC_TEXT_AGENTS.includes(agentType);
      const onlyDocs = documentIds && documentIds.length > 0;
      ctx.documents = (docs ?? [])
        .filter((d: any) => (onlyDocs ? documentIds!.includes(d.id) : true))
        .map((d: any) => ({
          id: d.id,
          fileName: d.file_name,
          documentType: d.document_type,
          status: d.status,
          isPrivate: d.is_private,
          // 4. Redact text unless this agent type needs it.
          extractedText: includeText ? d.extracted_text : null,
        }));

      ctx.photos = (pics ?? []).map((p: any) => ({
        id: p.id, category: p.photo_category, containsLicensePlate: p.contains_license_plate,
        containsPersonalInfo: p.contains_personal_info, approvedForPublic: p.approved_for_public,
      }));
    }
  }

  // 6. Log the access (service role, so it's recorded even under strict RLS).
  const admin = getAdminSupabase();
  if (admin) {
    const { data: logRow } = await admin
      .from("audit_events")
      .insert({
        organization_id: organizationId,
        user_id: userId,
        event_type: "agent_context_access",
        entity_type: "vehicle",
        entity_id: vehicleId ?? null,
        metadata_json: { agentType, documentIds: documentIds ?? [] },
      })
      .select("id")
      .maybeSingle();
    ctx.accessLogId = logRow?.id;
  }

  return ctx;
}
