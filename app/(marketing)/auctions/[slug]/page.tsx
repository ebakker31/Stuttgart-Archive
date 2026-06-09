import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LISTINGS, getListing } from "@/lib/listings";
import { MEMBERS } from "@/lib/community";
import { VehicleImage } from "@/components/vehicle-image";
import { BidBox } from "@/components/auctions/bid-box";
import { CommentThread } from "@/components/auctions/comment-thread";
import { ServiceTimeline, ModificationTimeline } from "@/components/timeline";
import { ArchiveLabel, MuseumCaption, Separator, Stat } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DemoNotice } from "@/components/guardrails";
import { DemoDataBadge } from "@/components/badges";
import { formatCurrency, formatMileage, maskVin } from "@/lib/utils";
import { CheckCircle2, ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ slug: l.vehicleSlug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const l = getListing(params.slug);
  return { title: l ? l.title : "Auction" };
}

export default function AuctionListingPage({ params }: { params: { slug: string } }) {
  const l = getListing(params.slug);
  if (!l) return notFound();
  const v = l.vehicle;
  const seller = MEMBERS.find((m) => m.vehicleSlugs.includes(v.slug));
  const publicDocs = v.documents.filter((d) => !d.isPrivate);

  const specs: [string, string][] = [
    ["Year", String(v.year)], ["Generation", v.generation ?? "—"], ["Transmission", v.transmission],
    ["Engine", v.engine], ["Drivetrain", v.drivetrain], ["Mileage", formatMileage(v.mileage)],
    ["Exterior", v.exteriorColor], ["Interior", v.interiorColor], ["Title", v.titleStatus],
    ["VIN", maskVin("WP0AB2A9XJS000000", v.vinPublicMode)],
  ];

  return (
    <div className="container py-8">
      <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> All auctions
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <ArchiveLabel>Auction · {v.generation ?? v.model}</ArchiveLabel>
        <DemoDataBadge />
        <Badge variant={l.reserve === "no_reserve" ? "success" : "muted"}>{l.reserve === "no_reserve" ? "No reserve" : "Reserve"}</Badge>
      </div>
      <h1 className="mt-3 display text-4xl md:text-5xl">{l.title}</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.65fr_1fr]">
        {/* Main */}
        <div className="space-y-10">
          <VehicleImage v={v} className="aspect-[16/9]" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {v.photos.map((p, i) => (
              <div key={i} className="flex aspect-[4/3] items-center justify-center rounded-md border border-border bg-gradient-to-br from-graphite/[0.05] to-graphite/[0.12] paper-grain"><span className="archive-label">{p.category}</span></div>
            ))}
          </div>

          {/* Highlights */}
          <section>
            <ArchiveLabel>Highlights</ArchiveLabel>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {l.highlights.map((h) => <li key={h} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0 text-oxblood" /> {h}</li>)}
            </ul>
          </section>

          {/* Backed by archive callout */}
          <Card className="border-oxblood/25 bg-oxblood/[0.03]">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <ArchiveLabel className="text-oxblood">Backed by a documented archive</ArchiveLabel>
                <p className="mt-1 text-sm text-muted-foreground">This listing is built from the seller's real records — verify everything in the full archive.</p>
              </div>
              <Button href={`/v/${v.slug}`} variant="outline">View full archive</Button>
            </CardContent>
          </Card>

          {/* Specs */}
          <section>
            <ArchiveLabel>Specifications</ArchiveLabel>
            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
              {specs.map(([k, val]) => <Stat key={k} label={k} value={val} />)}
            </div>
            {v.options.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {v.options.map((o) => <Badge key={o} variant="outline">{o}</Badge>)}
              </div>
            )}
          </section>

          <section>
            <ArchiveLabel>Service history</ArchiveLabel>
            <p className="mt-2 text-sm text-muted-foreground">Includes available service records from the seller's files.</p>
            <div className="mt-5"><ServiceTimeline events={v.service} /></div>
          </section>

          {v.modifications.length > 0 && (
            <section>
              <ArchiveLabel>Modifications — disclosed</ArchiveLabel>
              <div className="mt-4"><ModificationTimeline mods={v.modifications} /></div>
            </section>
          )}

          <section>
            <ArchiveLabel>Known flaws — disclosed</ArchiveLabel>
            <Card className="mt-3"><CardContent className="p-5 text-sm leading-relaxed">{v.knownFlaws}</CardContent></Card>
          </section>

          <section>
            <ArchiveLabel>Ownership</ArchiveLabel>
            <MuseumCaption className="mt-3 text-base">{v.ownershipStory}</MuseumCaption>
          </section>

          {/* Bid history */}
          <section>
            <ArchiveLabel>Bid history</ArchiveLabel>
            <Card className="mt-4"><CardContent className="p-0">
              <table className="w-full text-sm">
                <tbody>
                  {l.bids.map((b, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="p-3.5 font-serif">{formatCurrency(b.amount)}</td>
                      <td className="p-3.5 text-muted-foreground">@{b.bidder}</td>
                      <td className="p-3.5 text-right text-xs text-muted-foreground">{b.hoursAgo}h ago</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent></Card>
          </section>

          {/* Comments */}
          <section>
            <ArchiveLabel>Comments & questions</ArchiveLabel>
            <div className="mt-4"><CommentThread initial={l.comments} /></div>
          </section>
        </div>

        {/* Sidebar */}
        <aside>
          <div className="space-y-5 lg:sticky lg:top-20">
            <BidBox
              endsAt={l.endsAt}
              startingBid={l.currentBid}
              initialBids={l.bidCount}
              reserve={l.reserve}
              reserveMet={l.reserveMet}
              watchers={l.watchers}
            />

            {seller && (
              <Card><CardContent className="p-5">
                <ArchiveLabel>The seller</ArchiveLabel>
                <Link href={`/community/${seller.handle}`} className="mt-3 flex items-center gap-3 group">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-graphite text-sm font-medium text-parchment dark:bg-parchment dark:text-graphite">
                    {seller.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                  </span>
                  <span>
                    <span className="block text-sm font-medium group-hover:text-oxblood">{seller.name}</span>
                    <span className="block text-xs text-muted-foreground">@{seller.handle} · {seller.location}</span>
                  </span>
                </Link>
                <div className="mt-3 flex flex-wrap gap-1.5">{seller.badges.map((b) => <Badge key={b} variant="muted">{b}</Badge>)}</div>
              </CardContent></Card>
            )}

            <Card><CardContent className="p-5 text-xs leading-relaxed text-muted-foreground">
              Bids are commitments. Inspect or arrange a PPI before bidding. The car payment is handled through licensed escrow; Stuttgart Archive never holds funds and is not a party to the sale.
            </CardContent></Card>
          </div>
        </aside>
      </div>

      <DemoNotice className="mt-12 max-w-xl" />
    </div>
  );
}
