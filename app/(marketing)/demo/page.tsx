import type { Metadata } from "next";
import { ArchiveLabel } from "@/components/ui/misc";
import { DemoNotice } from "@/components/guardrails";
import { VehicleCard } from "@/components/vehicle-card";
import { DEMO_VEHICLES } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Demo Archive" };

export default function DemoPage() {
  return (
    <div className="container py-16">
      <ArchiveLabel>Demo archive</ArchiveLabel>
      <h1 className="mt-4 display text-5xl">A look inside the archive.</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        Six sample vehicles, each documented the way Stuttgart Archive helps you document your own. Open one to
        see the service timeline, paperwork, archive notes, and readiness scores.
      </p>
      <DemoNotice className="mt-6 max-w-xl" />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_VEHICLES.map((v) => (
          <VehicleCard key={v.slug} v={v} href={`/v/${v.slug}`} />
        ))}
      </div>
    </div>
  );
}
