import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/misc";
import { DemoDataBadge, PrivacyStatusBadge, SellerReadinessBadge, AuctionReadinessBadge } from "@/components/badges";
import { VehicleImage } from "@/components/vehicle-image";
import { formatCurrency, formatMileage } from "@/lib/utils";
import type { DemoVehicle } from "@/lib/demo-data";
import { Gauge, GitFork, Tag } from "lucide-react";

/** A film-frame style vehicle card with an archival caption block. */
export function VehicleCard({ v, href, isDemo = true }: { v: DemoVehicle; href?: string; isDemo?: boolean }) {
  const link = href ?? `/v/${v.slug}`;
  const forSale = (v.saleStatus === "For sale" || v.ownershipStatus === "For sale") && !!v.askingPrice;
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-archive-lg">
      <Link href={link}>
        <div className="relative">
          <VehicleImage v={v} className="aspect-[16/10] border-0 border-b" rounded={false} />
          {isDemo && <div className="absolute right-3 top-3"><DemoDataBadge /></div>}
          {forSale && (
            <div className="absolute bottom-3 right-3 rounded-sm border border-oxblood/40 bg-background/90 px-2.5 py-1 text-sm font-medium text-oxblood shadow-archive">
              {formatCurrency(v.askingPrice)}
            </div>
          )}
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
            {forSale && <span className="inline-flex items-center gap-1.5 text-oxblood"><Tag className="h-3.5 w-3.5" /> For sale</span>}
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
