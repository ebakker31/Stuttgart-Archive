import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_VEHICLES, getDemoVehicle } from "@/lib/demo-data";
import { ArchiveLabel, MuseumCaption, Separator, Stat } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DemoNotice } from "@/components/guardrails";
import { DemoDataBadge, PrivacyStatusBadge } from "@/components/badges";
import { ServiceTimeline, ModificationTimeline } from "@/components/timeline";
import { LeadForm } from "@/components/lead-form";
import { formatMileage, maskVin } from "@/lib/utils";

export function generateStaticParams() {
  return DEMO_VEHICLES.map((v) => ({ slug: v.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const v = getDemoVehicle(params.slug);
  return { title: v ? `${v.year} ${v.model}` : "Vehicle" };
}

export default function PublicVehiclePage({ params }: { params: { slug: string } }) {
  const v = getDemoVehicle(params.slug);
  if (!v) return notFound();

  // Privacy: only documents not marked private are surfaced publicly.
  const publicDocs = v.documents.filter((d) => !d.isPrivate);
  const forSale = v.saleStatus === "For sale" || v.ownershipStatus === "For sale";

  const specs: [string, string][] = [
    ["Year", String(v.year)], ["Model", v.model], ["Generation", v.generation ?? "—"],
    ["Body", v.bodyStyle], ["Transmission", v.transmission], ["Engine", v.engine],
    ["Drivetrain", v.drivetrain], ["Exterior", v.exteriorColor], ["Interior", v.interiorColor],
    ["Mileage", formatMileage(v.mileage)], ["Title", v.titleStatus], ["VIN", maskVin("WP0AB2A9XJS000000", v.vinPublicMode)],
  ];

  return (
    <div>
      {/* Hero plate */}
      <section className="border-b border-border">
        <div className="container py-10">
          <div className="flex flex-wrap items-center gap-3">
            <ArchiveLabel>Public archive · {v.generation ?? v.model}</ArchiveLabel>
            <DemoDataBadge />
            <PrivacyStatusBadge status={v.privacyStatus} />
          </div>
          <h1 className="mt-4 display text-5xl">{v.year} Porsche {v.model}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{v.trim ?? v.bodyStyle} · {v.exteriorColor} over {v.interiorColor}</p>
          <DemoNotice className="mt-5 max-w-md" />
        </div>
      </section>

      <div className="container grid gap-10 py-12 lg:grid-cols-[1.6fr_1fr]">
        {/* Main column */}
        <div className="space-y-12">
          {/* Photo plate placeholder */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {v.photos.map((p, i) => (
              <div key={i} className="flex aspect-[4/3] flex-col items-center justify-center rounded-md border border-border bg-gradient-to-br from-graphite/[0.05] to-graphite/[0.12] p-3 text-center paper-grain">
                <span className="archive-label">{p.category}</span>
              </div>
            ))}
          </div>

          <section>
            <ArchiveLabel>Archive notes</ArchiveLabel>
            <MuseumCaption className="mt-3 text-base">{v.archiveNotes}</MuseumCaption>
          </section>

          <section>
            <ArchiveLabel>Specifications</ArchiveLabel>
            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
              {specs.map(([k, val]) => <Stat key={k} label={k} value={val} />)}
            </div>
          </section>

          <section>
            <ArchiveLabel>Service history</ArchiveLabel>
            <p className="mt-2 text-sm text-muted-foreground">Includes available service records from the current owner's files.</p>
            <div className="mt-5"><ServiceTimeline events={v.service} /></div>
          </section>

          <section>
            <ArchiveLabel>Modifications</ArchiveLabel>
            <div className="mt-4"><ModificationTimeline mods={v.modifications} /></div>
          </section>

          <section>
            <ArchiveLabel>Known flaws — disclosed</ArchiveLabel>
            <Card className="mt-3"><CardContent className="p-5 text-sm leading-relaxed">{v.knownFlaws}</CardContent></Card>
          </section>

          <section>
            <ArchiveLabel>Ownership story</ArchiveLabel>
            <p className="mt-3 leading-relaxed text-foreground/85">{v.ownershipStory}</p>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <ArchiveLabel>Provenance highlights</ArchiveLabel>
              <ul className="mt-3 space-y-2 text-sm">
                {v.provenanceHighlights.map((h) => <li key={h} className="flex gap-2"><span className="text-oxblood">—</span> {h}</li>)}
              </ul>
              <Separator className="my-5" />
              <ArchiveLabel>Documents shared</ArchiveLabel>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {publicDocs.map((d) => <li key={d.name} className="flex items-center justify-between"><span>{d.type}</span><Badge variant="muted">shared</Badge></li>)}
                {!publicDocs.length && <li>No documents shared publicly.</li>}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">Private documents are never shown. Verify all records independently.</p>
            </CardContent>
          </Card>

          {forSale && (
            <Card className="border-oxblood/30">
              <CardContent className="p-6">
                <ArchiveLabel className="text-oxblood">Request information</ArchiveLabel>
                <p className="mt-2 text-sm text-muted-foreground">Interested? Send the seller a note. No reply is sent automatically.</p>
                <div className="mt-4"><LeadForm vehicle={`${v.year} ${v.model}`} /></div>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
