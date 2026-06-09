import { getServerSupabase } from "@/lib/supabase/server";
import { config, isAdminEmail } from "@/lib/config";
import { DEMO_VEHICLES, type DemoVehicle } from "@/lib/demo-data";
import type { UserMode } from "@/lib/brand";

/**
 * App data layer. When Supabase is configured it reads the authenticated user's
 * real data; otherwise it serves the clearly-labeled demo archive so the entire
 * app is explorable with zero setup. `demo` is surfaced so the UI can show a
 * "demo mode" banner and never present sample data as real.
 */

export interface AppSession {
  authed: boolean;
  demo: boolean;
  email: string | null;
  fullName: string | null;
  mode: UserMode;
  organizationId: string | null;
  userId: string | null;
  isAdmin: boolean;
}

export async function getAppSession(): Promise<AppSession> {
  const db = getServerSupabase();
  if (!db) {
    return { authed: false, demo: true, email: null, fullName: "Demo Curator", mode: "owner", organizationId: null, userId: null, isAdmin: true };
  }
  const { data: { user } } = await db.auth.getUser();
  if (!user) {
    return { authed: false, demo: true, email: null, fullName: null, mode: "owner", organizationId: null, userId: null, isAdmin: false };
  }
  const { data: profile } = await db
    .from("profiles")
    .select("organization_id, full_name, selected_mode, email")
    .eq("id", user.id)
    .maybeSingle();
  return {
    authed: true,
    demo: false,
    email: user.email ?? profile?.email ?? null,
    fullName: profile?.full_name ?? null,
    mode: (profile?.selected_mode as UserMode) || "owner",
    organizationId: profile?.organization_id ?? null,
    userId: user.id,
    isAdmin: isAdminEmail(user.email) || config.adminEmails.length === 0,
  };
}

export async function listVehicles(session: AppSession): Promise<DemoVehicle[]> {
  if (session.demo || !session.organizationId) return DEMO_VEHICLES;
  const db = getServerSupabase();
  if (!db) return DEMO_VEHICLES;
  const { data } = await db.from("vehicles").select("*").eq("organization_id", session.organizationId).order("created_at", { ascending: false });
  if (!data || data.length === 0) return [];
  return data.map(mapRowToDemoShape);
}

export async function getVehicle(session: AppSession, id: string): Promise<DemoVehicle | null> {
  if (session.demo) return DEMO_VEHICLES.find((v) => v.slug === id) ?? null;
  const db = getServerSupabase();
  if (!db) return null;
  const { data } = await db.from("vehicles").select("*").eq("id", id).maybeSingle();
  return data ? mapRowToDemoShape(data) : null;
}

/** Map a DB vehicle row onto the DemoVehicle view shape used by app components. */
function mapRowToDemoShape(r: any): DemoVehicle {
  return {
    slug: r.public_slug || r.id,
    year: r.year, make: "Porsche", model: r.model, trim: r.trim, generation: r.generation,
    bodyStyle: r.body_style || "", exteriorColor: r.exterior_color || "", interiorColor: r.interior_color || "",
    mileage: r.mileage || 0, transmission: r.transmission || "", engine: r.engine || "", drivetrain: r.drivetrain || "",
    vinPublicMode: r.vin_public_mode || "hidden", titleStatus: r.title_status || "", ownershipStatus: r.ownership_status || "",
    saleStatus: r.sale_status || "", askingPrice: r.asking_price ?? undefined,
    options: Array.isArray(r.options) ? r.options : [], knownFlaws: r.known_flaws || "",
    ownershipStory: r.ownership_story || "", personalSignificance: r.personal_significance || "",
    archiveNotes: r.archive_notes || "", provenanceHighlights: r.documented_provenance_highlights ? [r.documented_provenance_highlights] : [],
    privacyStatus: r.privacy_status || "private", sellerReadiness: 0, auctionReadiness: 0, completeness: 0,
    service: [], modifications: [], documents: [], photos: [], instagram: [], ad: { headline: "", primaryText: "" },
    tasks: [], buyerQuestions: [], listingDraft: "",
  };
}
