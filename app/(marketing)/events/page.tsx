import type { Metadata } from "next";
import { getUpcomingAuctions, auctionFeedIsLive } from "@/lib/integrations/auctions";
import { ArchiveLabel, Separator } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, MapPin, ExternalLink, Gavel } from "lucide-react";

export const metadata: Metadata = {
  title: "Auction Radar — upcoming collector-car auctions",
  description: "An independent, editorial calendar of upcoming collector-car auctions relevant to Porsche owners, sellers, and collectors.",
};

export default async function EventsPage() {
  const events = await getUpcomingAuctions();
  const isLive = auctionFeedIsLive();
  const inPerson = events.filter((e) => e.format === "in_person");
  const online = events.filter((e) => e.format === "online");

  return (
    <div>
      <section className="border-b border-border bg-card/40">
        <div className="container py-16">
          <div className="flex items-center gap-3">
            <ArchiveLabel>Auction Radar · News & events</ArchiveLabel>
            <Badge variant={isLive ? "success" : "muted"}>{isLive ? "Live feed" : "Curated"}</Badge>
          </div>
          <h1 className="mt-4 display text-5xl">Where great Porsches change hands.</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            An independent calendar of upcoming collector-car auctions and marketplaces relevant to Porsche
            owners, sellers, and collectors. Selling at one of these? Build a documented, honest packet first.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/signup" variant="accent">Prepare your auction packet <Gavel className="h-4 w-4" /></Button>
            <Button href="/pricing" variant="outline">See Auction Pack</Button>
          </div>
        </div>
      </section>

      <div className="container py-14">
        <ArchiveLabel>In-person sales</ArchiveLabel>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {inPerson.map((e) => <EventCard key={e.id} e={e} />)}
        </div>

        <Separator className="my-12" />

        <ArchiveLabel>Online marketplaces</ArchiveLabel>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {online.map((e) => <EventCard key={e.id} e={e} />)}
        </div>

        {/* Independence + accuracy note */}
        <div className="mt-12 rounded-md border border-oxblood/25 bg-oxblood/5 p-5">
          <ArchiveLabel className="text-oxblood">Please verify before you plan</ArchiveLabel>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">
            Event information is editorial and provided for general guidance only. Windows are approximate —
            always confirm exact dates, locations, consignment deadlines, and terms with the official organizer.
            Stuttgart Archive is independent and is not affiliated with, endorsed by, sponsored by, or partnered
            with any auction house, marketplace, or event listed here. All names and marks belong to their
            respective owners and are used for descriptive, informational purposes only.
          </p>
        </div>
      </div>

      {/* Funnel CTA */}
      <section className="border-t border-border">
        <div className="container py-16 text-center">
          <h2 className="mx-auto max-w-2xl display text-4xl">Bidders reward documentation. Bring it.</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Generate an auction-style listing draft, photo and video checklists, seller Q&amp;A prep, and a
            claim-verification report — all from your real records.
          </p>
          <Button href="/signup" variant="accent" size="lg" className="mt-7">Start your auction prep — free</Button>
        </div>
      </section>
    </div>
  );
}

function EventCard({ e }: { e: Awaited<ReturnType<typeof getUpcomingAuctions>>[number] }) {
  return (
    <Card className="transition-shadow hover:shadow-archive-lg">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-xl leading-tight">{e.name}</h3>
            <p className="text-sm text-muted-foreground">{e.organizer}</p>
          </div>
          <Badge variant={e.format === "online" ? "muted" : "accent"}>{e.format === "online" ? "Online" : "In person"}</Badge>
        </div>
        <Separator className="my-4" />
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><CalendarClock className="h-3.5 w-3.5" /> {e.window} <span className="archive-label ml-1 text-muted-foreground/70">approx.</span></div>
          <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {e.location}</div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">{e.note}</p>
        <a href={e.url} target="_blank" rel="noopener noreferrer nofollow" className="mt-4 inline-flex items-center gap-1.5 text-sm text-oxblood hover:underline">
          Official site <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </CardContent>
    </Card>
  );
}
