import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MEMBERS, getMember, memberVehicles, feedForMember } from "@/lib/community";
import { FeedCard } from "@/components/community/feed-card";
import { FollowButton } from "@/components/community/interactions";
import { VehicleCard } from "@/components/vehicle-card";
import { ArchiveLabel, Separator, Stat } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { DemoNotice } from "@/components/guardrails";
import { MapPin } from "lucide-react";

export function generateStaticParams() {
  return MEMBERS.map((m) => ({ handle: m.handle }));
}

export function generateMetadata({ params }: { params: { handle: string } }): Metadata {
  const m = getMember(params.handle);
  return { title: m ? `${m.name} (@${m.handle})` : "Member" };
}

export default function MemberProfilePage({ params }: { params: { handle: string } }) {
  const m = getMember(params.handle);
  if (!m) return notFound();
  const vehicles = memberVehicles(m);
  const activity = feedForMember(m.handle);

  return (
    <div className="container py-12">
      <DemoNotice className="mb-6 max-w-xl" />

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-start gap-5">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-graphite text-xl font-medium text-parchment dark:bg-parchment dark:text-graphite">
            {m.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
          </span>
          <div>
            <h1 className="display text-4xl">{m.name}</h1>
            <p className="text-muted-foreground">@{m.handle}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {m.location}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">{m.badges.map((b) => <Badge key={b} variant="muted">{b}</Badge>)}</div>
          </div>
        </div>
        <FollowButton handle={m.handle} />
      </div>

      <p className="mt-6 max-w-2xl font-serif text-lg italic text-muted-foreground">{m.bio}</p>

      <div className="mt-6 flex gap-10">
        <Stat label="Garage" value={`${vehicles.length} cars`} />
        <Stat label="Followers" value={m.followers.toLocaleString()} />
        <Stat label="Following" value={String(m.following)} />
      </div>

      <Separator className="my-10" />

      {/* Garage */}
      <ArchiveLabel>Published garage</ArchiveLabel>
      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v) => <VehicleCard key={v.slug} v={v} href={`/v/${v.slug}`} />)}
      </div>

      <Separator className="my-10" />

      {/* Activity */}
      <ArchiveLabel>Recent activity</ArchiveLabel>
      <div className="mt-5 max-w-2xl space-y-5">
        {activity.length ? activity.map((item) => <FeedCard key={item.id} item={item} />) : <p className="text-muted-foreground">No public activity yet.</p>}
      </div>
    </div>
  );
}
