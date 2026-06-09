/**
 * Seed script — populates Supabase with the clearly-labeled demo archive.
 * Every inserted row has is_demo = true and is never mixed with real user data.
 *
 * Usage:
 *   1. Set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   2. Run the schema (supabase/schema.sql) first.
 *   3. npm run seed
 *
 * Safe to re-run: it removes any existing demo organization first.
 */
import { createClient } from "@supabase/supabase-js";
import { DEMO_VEHICLES } from "../lib/demo-data";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("✗ Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before seeding.");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });
const DEMO_ORG_NAME = "Stuttgart Archive — Demo Collection";

async function main() {
  console.log("Seeding demo archive…");

  // Clean any prior demo org (cascades to its rows).
  const { data: existing } = await db.from("organizations").select("id").eq("name", DEMO_ORG_NAME);
  for (const o of existing ?? []) {
    await db.from("organizations").delete().eq("id", o.id);
  }

  const { data: org, error: orgErr } = await db
    .from("organizations")
    .insert({ name: DEMO_ORG_NAME, type: "collector" })
    .select("id")
    .single();
  if (orgErr || !org) throw orgErr ?? new Error("Failed to create demo org");
  const organization_id = org.id;

  await db.from("autopilot_settings").insert({ organization_id });
  await db.from("billing_plans").insert({ organization_id, plan_name: "collector", vehicle_limit: 25, ai_generation_limit: 600 });

  for (const v of DEMO_VEHICLES) {
    const { data: vehicle, error: vErr } = await db
      .from("vehicles")
      .insert({
        organization_id, year: v.year, make: v.make, model: v.model, trim: v.trim, generation: v.generation,
        body_style: v.bodyStyle, exterior_color: v.exteriorColor, interior_color: v.interiorColor,
        vin_public_mode: v.vinPublicMode, mileage: v.mileage, transmission: v.transmission, engine: v.engine,
        drivetrain: v.drivetrain, title_status: v.titleStatus, ownership_status: v.ownershipStatus, sale_status: v.saleStatus,
        privacy_status: v.privacyStatus, public_slug: v.slug, archive_notes: v.archiveNotes, ownership_story: v.ownershipStory,
        personal_significance: v.personalSignificance, documented_provenance_highlights: v.provenanceHighlights.join("; "),
        known_flaws: v.knownFlaws, options: v.options, is_demo: true,
      })
      .select("id")
      .single();
    if (vErr || !vehicle) throw vErr ?? new Error(`Failed to insert ${v.slug}`);
    const vehicle_id = vehicle.id;

    if (v.service.length) {
      await db.from("service_events").insert(v.service.map((s) => ({
        organization_id, vehicle_id, event_date: s.date, mileage: s.mileage, vendor: s.vendor,
        category: s.category, summary: s.summary, cost: s.cost, source_type: "user_provided",
        verification_status: "user_provided", is_demo: true,
      })));
    }
    if (v.modifications.length) {
      await db.from("modification_events").insert(v.modifications.map((m) => ({
        organization_id, vehicle_id, modification_name: m.name, category: m.category, brand: m.brand,
        reversible_status: m.reversible, oem_parts_retained: m.oemRetained, source_type: "user_provided", is_demo: true,
      })));
    }
    if (v.documents.length) {
      await db.from("documents").insert(v.documents.map((d) => ({
        organization_id, vehicle_id, file_name: d.name, document_type: d.type, status: "extracted",
        is_private: d.isPrivate, is_demo: true,
      })));
    }
    if (v.photos.length) {
      await db.from("photos").insert(v.photos.map((p) => ({
        organization_id, vehicle_id, caption: p.caption, photo_category: p.category, approved_for_public: true, is_demo: true,
      })));
    }
    if (v.tasks.length) {
      await db.from("tasks").insert(v.tasks.map((t) => ({
        organization_id, vehicle_id, title: t.title, priority: t.priority, status: "open", created_by_ai: true,
      })));
    }
    if (v.instagram.length) {
      await db.from("instagram_posts").insert(v.instagram.map((p) => ({
        organization_id, vehicle_id, content_type: "caption", caption: p.caption, hook: p.hook, status: "draft",
      })));
    }
    await db.from("ad_briefs").insert({
      organization_id, vehicle_id, campaign_type: "inquiries", headline: v.ad.headline, primary_text: v.ad.primaryText, status: "draft",
    });

    console.log(`  ✓ ${v.year} ${v.model}`);
  }

  console.log(`\nDone. Demo organization id: ${organization_id}`);
  console.log("All demo rows are flagged is_demo = true.");
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
