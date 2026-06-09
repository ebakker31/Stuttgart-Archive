import type { Metadata } from "next";
import { getListings, nonAuctionForSale } from "@/lib/listings";
import { ListingCard } from "@/components/auctions/listing-card";
import { VehicleCard } from "@/components/vehicle-card";
import { ArchiveLabel, Separator } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { DemoNotice } from "@/components/guardrails";
import { ShieldCheck, ScrollText, Gavel } from "lucide-react";

export const metadata: Metadata = {
  title: "Marketplace — live Porsche auctions",
  description: "Bid on documented Porsches. Every listing is backed by the car's real archive — service history, paperwork, and honest disclosures.",
};

export default async function MarketplacePage() {
  const listings = getListings().sort((a, b) => a.endsAt - b.endsAt);
  const available = nonAuctionForSale();
  const endingSoon = listings.slice(0, 1)[0];

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-card/40">
        <div className="container py-14">
          <ArchiveLabel>Marketplace · Live auctions</ArchiveLabel>
          <h1 className="mt-4 display text-5xl">Bid on Porsches you can actually trust.</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Every listing is backed by the car's real archive — documented service history, paperwork, and honest
            disclosures. List free; the buyer pays a transparent premium only at a successful sale.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/signup" variant="accent"><Gavel className="h-4 w-4" /> Sell your Porsche</Button>
            <Button href="/selling" variant="outline">How it works</Button>
          </div>
          <DemoNotice className="mt-6 max-w-md" />
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-border">
        <div className="container grid gap-6 py-10 md:grid-cols-3">
          {[
            { icon: ScrollText, t: "Backed by a real archive", d: "Service records, documents, and timelines attached to every listing." },
            { icon: ShieldCheck, t: "Escrow-protected", d: "The car payment moves through licensed escrow — never through us." },
            { icon: Gavel, t: "Transparent fees", d: "Free to list. 5% buyer's premium ($250–$5,000), shown before you bid." },
          ].map((p) => (
            <div key={p.t} className="flex items-start gap-3">
              <p.icon className="mt-0.5 h-5 w-5 shrink-0 text-oxblood" />
              <div><div className="font-medium">{p.t}</div><p className="text-sm text-muted-foreground">{p.d}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Live auctions */}
      <section className="container py-14">
        <div className="flex items-end justify-between">
          <div>
            <ArchiveLabel>Live now</ArchiveLabel>
            <h2 className="mt-2 display text-3xl">Ending soonest</h2>
          </div>
          {endingSoon && <span className="hidden text-sm text-muted-foreground sm:block">Next to close: {endingSoon.title}</span>}
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l, i) => <ListingCard key={l.vehicleSlug} l={l} seed={i + 1} />)}
        </div>
      </section>

      {/* Available (non-auction) */}
      {available.length > 0 && (
        <section className="container pb-16">
          <Separator className="mb-12" />
          <ArchiveLabel>Also available</ArchiveLabel>
          <h2 className="mt-2 display text-3xl">Private-sale listings</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {available.map((v) => <VehicleCard key={v.slug} v={v} href={`/v/${v.slug}`} />)}
          </div>
        </section>
      )}

      <section className="border-t border-border">
        <div className="container py-16 text-center">
          <h2 className="mx-auto max-w-2xl display text-4xl">Your car deserves a documented listing.</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Build the archive, then list it. Bidders pay more for cars they can trust.</p>
          <Button href="/signup" variant="accent" size="lg" className="mt-7">Start your listing — free</Button>
        </div>
      </section>
    </div>
  );
}
