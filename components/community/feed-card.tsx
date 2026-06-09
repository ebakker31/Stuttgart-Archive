import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/misc";
import { FeedReactions } from "@/components/community/interactions";
import { getMember, type FeedItem } from "@/lib/community";
import { getDemoVehicle } from "@/lib/demo-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Tag, Wrench, FolderArchive, UserPlus } from "lucide-react";

const META: Record<FeedItem["type"], { label: string; icon: any; variant: "accent" | "muted" | "outline" }> = {
  for_sale: { label: "For sale", icon: Tag, variant: "accent" },
  modification: { label: "Modification", icon: Wrench, variant: "outline" },
  archive_update: { label: "Archive update", icon: FolderArchive, variant: "muted" },
  joined: { label: "New member", icon: UserPlus, variant: "muted" },
};

export function FeedCard({ item }: { item: FeedItem }) {
  const member = getMember(item.memberHandle);
  const vehicle = item.vehicleSlug ? getDemoVehicle(item.vehicleSlug) : undefined;
  const m = META[item.type];

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <Link href={`/community/${item.memberHandle}`} className="flex items-center gap-3 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-graphite text-xs font-medium text-parchment dark:bg-parchment dark:text-graphite">
              {member?.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
            </span>
            <span>
              <span className="block text-sm font-medium group-hover:text-oxblood">{member?.name}</span>
              <span className="block text-xs text-muted-foreground">@{item.memberHandle} · {formatDate(item.date)}</span>
            </span>
          </Link>
          <Badge variant={m.variant}><m.icon className="h-3 w-3" /> {m.label}</Badge>
        </div>

        <h3 className="mt-4 font-serif text-lg">{item.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>

        {vehicle && (
          <>
            <Separator className="my-4" />
            <Link href={`/v/${vehicle.slug}`} className="flex items-center justify-between gap-3 rounded-md border border-border bg-background/50 p-3 transition-colors hover:border-oxblood/40">
              <span className="text-sm">
                <span className="font-medium">{vehicle.year} {vehicle.model}</span>
                <span className="block text-xs text-muted-foreground">{vehicle.exteriorColor} · {vehicle.transmission}</span>
              </span>
              {item.type === "for_sale" && vehicle.askingPrice ? (
                <span className="font-serif text-oxblood">{formatCurrency(vehicle.askingPrice)}</span>
              ) : (
                <span className="archive-label">View archive</span>
              )}
            </Link>
          </>
        )}

        <FeedReactions likes={item.likes} comments={item.comments} />
      </CardContent>
    </Card>
  );
}
