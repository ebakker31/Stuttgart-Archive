import type { Metadata } from "next";
import Link from "next/link";
import { FEED, MEMBERS } from "@/lib/community";
import { FeedCard } from "@/components/community/feed-card";
import { FollowButton } from "@/components/community/interactions";
import { PostComposer } from "@/components/community/post-composer";
import { ArchiveLabel } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DemoNotice } from "@/components/guardrails";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "The Paddock — the Porsche owner community",
  description: "Follow fellow Porsche owners, see what's for sale, discover tasteful modifications, and talk with enthusiasts.",
};

const FILTERS: [string, string][] = [
  ["all", "All activity"], ["for_sale", "For sale"], ["modification", "Modifications"], ["archive_update", "Archive updates"],
];

export default function CommunityPage({ searchParams }: { searchParams: { type?: string } }) {
  const type = searchParams.type || "all";
  const feed = type === "all" ? FEED : FEED.filter((f) => f.type === type);

  return (
    <div className="container py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <ArchiveLabel>The Paddock · Community</ArchiveLabel>
          <h1 className="mt-3 display text-5xl">Talk shop with fellow owners.</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Follow enthusiasts, see what members put up for sale, discover tasteful modifications, and react to
            archive updates. You only ever share what you choose to publish.
          </p>
        </div>
        <Button href="/signup" variant="accent">Join The Paddock</Button>
      </div>

      <DemoNotice className="mt-6 max-w-xl" />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Feed */}
        <div>
          <div className="mb-5"><PostComposer /></div>
          <div className="mb-5 flex flex-wrap gap-2">
            {FILTERS.map(([id, label]) => (
              <Link key={id} href={id === "all" ? "/community" : `/community?type=${id}`} className={`rounded-full border px-3 py-1 text-sm transition-colors ${type === id ? "border-oxblood/40 bg-oxblood/5 text-oxblood" : "border-border text-muted-foreground hover:text-foreground"}`}>
                {label}
              </Link>
            ))}
          </div>
          <div className="space-y-5">
            {feed.map((item) => <FeedCard key={item.id} item={item} />)}
            {!feed.length && <p className="text-muted-foreground">No activity in this filter yet.</p>}
          </div>
        </div>

        {/* Sidebar: who to follow */}
        <aside className="space-y-6">
          <Card>
            <CardContent className="p-5">
              <ArchiveLabel>Owners to follow</ArchiveLabel>
              <div className="mt-4 space-y-4">
                {MEMBERS.map((m) => (
                  <div key={m.handle} className="flex items-start justify-between gap-3">
                    <Link href={`/community/${m.handle}`} className="group flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-graphite text-xs font-medium text-parchment dark:bg-parchment dark:text-graphite">
                        {m.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                      </span>
                      <span>
                        <span className="block text-sm font-medium group-hover:text-oxblood">{m.name}</span>
                        <span className="block text-xs text-muted-foreground">@{m.handle} · {m.location}</span>
                        <span className="mt-1 flex flex-wrap gap-1">{m.badges.slice(0, 2).map((b) => <Badge key={b} variant="muted">{b}</Badge>)}</span>
                      </span>
                    </Link>
                    <FollowButton handle="" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-oxblood/30">
            <CardContent className="p-5">
              <ArchiveLabel className="text-oxblood">Selling soon?</ArchiveLabel>
              <p className="mt-2 text-sm text-muted-foreground">Publish your car to The Paddock and reach enthusiasts who value documentation.</p>
              <Button href="/signup" variant="outline" className="mt-4 w-full">List your Porsche</Button>
            </CardContent>
          </Card>
        </aside>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        Community members and posts shown here are sample data for demonstration. Real profiles are opt-in and
        show only what each owner chooses to make public.
      </p>
    </div>
  );
}
