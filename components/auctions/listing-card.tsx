import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VehicleImage } from "@/components/vehicle-image";
import { Countdown } from "@/components/auctions/countdown";
import { DemoDataBadge } from "@/components/badges";
import { formatCurrency } from "@/lib/utils";
import { MessageCircle, Heart, Gavel } from "lucide-react";
import type { ResolvedListing } from "@/lib/listings";

/** BaT-style auction tile: big photo, current bid, live time-left, social proof. */
export async function ListingCard({ l, seed = 1 }: { l: ResolvedListing; seed?: number }) {
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-archive-lg">
      <Link href={`/auctions/${l.vehicleSlug}`}>
        <div className="relative">
          <VehicleImage v={l.vehicle} className="aspect-[16/10] border-0 border-b" rounded={false} showLabels={false} seed={seed} />
          <div className="absolute left-3 top-3"><DemoDataBadge /></div>
          <div className="absolute right-3 top-3">
            <Badge variant={l.reserve === "no_reserve" ? "success" : "muted"}>{l.reserve === "no_reserve" ? "No reserve" : "Reserve"}</Badge>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-graphite/85 to-transparent px-3 pb-2.5 pt-8 text-parchment">
            <span className="text-sm font-medium"><Gavel className="mr-1 inline h-3.5 w-3.5" /> {formatCurrency(l.currentBid)}</span>
            <Countdown endsAt={l.endsAt} compact className="text-sm text-parchment" />
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-serif text-lg leading-snug">{l.title}</h3>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>{l.bidCount} bids</span>
            <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {l.watchers}</span>
            <span className="inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {l.comments.length}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
