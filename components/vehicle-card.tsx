import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArchiveLabel, Separator } from "@/components/ui/misc";
import { DemoDataBadge, PrivacyStatusBadge, SellerReadinessBadge, AuctionReadinessBadge } from "@/components/badges";
import { formatMileage } from "@/lib/utils";
import type { DemoVehicle } from "@/lib/demo-data";
import { Gauge, GitFork } from "lucide-react";

/** A film-frame style vehicle card with an archival caption block. */
export function VehicleCard({ v, href, isDemo = true }: { v: DemoVehicle; href?: string; isDemo?: boolean }) {
  const link = href ?? `/v/${v.slug}`;
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-archive-lg">
      <Link href={link}>
        {/* Placeholder "photographic plate" — no official imagery */}
        <div className="relative flex aspect-[16/10] items-center justify-center border-b border-border bg-gradient-to-br from-graphite/[0.06] to-graphite/[0.14] paper-grain">
          <div className="text-center">
            <div className="font-serif text-2xl text-graphite/40 dark:text-parchment/40">{v.year}</div>
            <div className="archive-label mt-1">{v.exteriorColor}</div>
          </div>
          <div className="absolute left-3 top-3"><ArchiveLabel>Plate · {v.generation ?? v.model}</ArchiveLabel></div>
          {isDemo && <div className="absolute right-3 top-3"><DemoDataBadge /></div>}
        </div>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-serif text-xl leading-tight">{v.year} {v.model}</h3>
              <p className="text-sm text-muted-foreground">{v.trim ?? v.bodyStyle} · {v.transmission}</p>
            </div>
            <PrivacyStatusBadge status={v.privacyStatus} />
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5" /> {formatMileage(v.mileage)}</span>
            <span className="inline-flex items-center gap-1.5"><GitFork className="h-3.5 w-3.5" /> {v.drivetrain}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <SellerReadinessBadge score={v.sellerReadiness} />
            <AuctionReadinessBadge score={v.auctionReadiness} />
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
