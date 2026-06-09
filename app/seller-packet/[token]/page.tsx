import { Wordmark } from "@/components/brand/logo";
import { ArchiveLabel, MuseumCaption, Separator, Stat } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DemoNotice } from "@/components/guardrails";
import { ServiceTimeline } from "@/components/timeline";
import { DEMO_VEHICLES } from "@/lib/demo-data";
import { sellerPacketAgent } from "@/lib/agents/seller-packet-agent";
import { demoVehicleToScope } from "@/lib/demo-scope";
import { FOOTER_DISCLAIMER } from "@/lib/brand";
import { formatMileage } from "@/lib/utils";

/**
 * Token-gated seller packet. In production the token resolves to a specific
 * seller_packets row (RLS-bypassed read by token). In demo mode it renders a
 * representative packet so the secure-share flow is viewable.
 */
export default async function SellerPacketPage({ params }: { params: { token: string } }) {
  const v = DEMO_VEHICLES.find((x) => x.saleStatus === "For sale") ?? DEMO_VEHICLES[0];
  const packet = await sellerPacketAgent.run(
    { scope: demoVehicleToScope(v) },
    { organizationId: "demo", userId: "demo", vehicleId: v.slug }
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border"><div className="container flex h-16 items-center justify-between"><Wordmark /><ArchiveLabel>Secure seller packet</ArchiveLabel></div></header>

      <main className="container max-w-3xl py-12">
        <DemoNotice className="mb-6" />
        <ArchiveLabel>Shared with you · token {params.token.slice(0, 8)}…</ArchiveLabel>
        <h1 className="mt-3 display text-4xl">{v.year} Porsche {v.model}</h1>
        <p className="mt-2 text-muted-foreground">{v.trim ?? v.bodyStyle} · {v.exteriorColor} over {v.interiorColor} · {formatMileage(v.mileage)}</p>

        <div className="mt-4"><Button variant="accent" href={`/api/seller-packet/pdf?vehicle=${v.slug}`}>Download packet PDF</Button></div>

        <MuseumCaption className="mt-6 text-base">{v.archiveNotes}</MuseumCaption>

        <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
          {[["Year", v.year], ["Transmission", v.transmission], ["Mileage", formatMileage(v.mileage)], ["Title", v.titleStatus], ["Drivetrain", v.drivetrain], ["Records", `${v.service.length} entries`]].map(([k, val]) => (
            <Stat key={String(k)} label={String(k)} value={String(val)} />
          ))}
        </div>

        <div className="mt-10 space-y-8">
          {packet.output.sections.map((s) => (
            <section key={s.title}>
              <ArchiveLabel>{s.title}</ArchiveLabel>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/85">{s.body}</p>
            </section>
          ))}

          <section>
            <ArchiveLabel>Service timeline</ArchiveLabel>
            <div className="mt-4"><ServiceTimeline events={v.service} /></div>
          </section>
        </div>

        <Card className="mt-10"><CardContent className="p-5">
          <p className="text-xs leading-relaxed text-muted-foreground">This packet reflects records the seller provided through Stuttgart Archive. It does not certify authenticity or condition. Verify independently before purchase.</p>
        </CardContent></Card>

        <Separator className="my-8" />
        <p className="text-[11px] leading-relaxed text-muted-foreground/80">{FOOTER_DISCLAIMER}</p>
      </main>
    </div>
  );
}
