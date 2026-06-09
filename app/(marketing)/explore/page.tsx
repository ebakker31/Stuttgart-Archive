import type { Metadata } from "next";
import { ArchiveLabel } from "@/components/ui/misc";
import { DemoNotice } from "@/components/guardrails";
import { VehicleCard } from "@/components/vehicle-card";
import { DEMO_VEHICLES } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Explore" };

/**
 * Public Explore — only shows vehicles intentionally marked public.
 * In this MVP build it showcases the demo archive's public examples. Real
 * public pages render at /v/[slug] and never expose private fields or full VIN.
 */
export default function ExplorePage() {
  const publicVehicles = DEMO_VEHICLES.filter((v) => v.privacyStatus === "public");

  return (
    <div className="container py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <ArchiveLabel>Public explore</ArchiveLabel>
          <h1 className="mt-4 display text-5xl">Documented Porsches, shared by their keepers.</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Only vehicles whose owners chose to publish appear here. Private data, documents, and full VINs are
            never shown.
          </p>
        </div>
      </div>

      <DemoNotice className="mt-6 max-w-xl" />

      {/* Simple filter chips (visual; real filtering arrives with live data) */}
      <div className="mt-8 flex flex-wrap gap-2">
        {["All", "911", "Cayman / Boxster", "Taycan", "Air-cooled", "For sale"].map((f, i) => (
          <span key={f} className={`rounded-full border px-3 py-1 text-sm ${i === 0 ? "border-oxblood/40 bg-oxblood/5 text-oxblood" : "border-border text-muted-foreground"}`}>{f}</span>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {publicVehicles.map((v) => (
          <VehicleCard key={v.slug} v={v} href={`/v/${v.slug}`} />
        ))}
      </div>

      {publicVehicles.length === 0 && (
        <p className="mt-16 text-center text-muted-foreground">No public vehicles yet. Be the first to publish your archive.</p>
      )}
    </div>
  );
}
