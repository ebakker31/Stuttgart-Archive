import { getAppSession, listVehicles } from "@/lib/app-data";
import { ArchiveLabel } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { VehicleCard } from "@/components/vehicle-card";

export default async function WatchlistPage() {
  const session = await getAppSession();
  const vehicles = (await listVehicles(session)).filter((v) => ["Watching", "Interested in buying", "For sale"].includes(v.ownershipStatus)).slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <ArchiveLabel>Watchlist</ArchiveLabel>
        <h1 className="mt-2 display text-4xl">Cars you're following.</h1>
        <p className="mt-2 text-muted-foreground">Track vehicles you're considering — including listings from elsewhere by URL.</p>
      </div>

      <Card><CardContent className="p-5">
        <ArchiveLabel>Add an external listing</ArchiveLabel>
        <form className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input className="flex h-10 w-full rounded-md border border-input bg-background/60 px-3 text-sm" placeholder="Paste a public listing URL…" />
          <button className="h-10 shrink-0 rounded-md bg-graphite px-5 text-sm text-parchment dark:bg-parchment dark:text-graphite">Add to watchlist</button>
        </form>
        <p className="mt-2 text-xs text-muted-foreground">We only use URLs you provide. We never scrape private accounts.</p>
      </CardContent></Card>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v) => <VehicleCard key={v.slug} v={v} href={`/app/vehicles/${v.slug}`} isDemo={session.demo} />)}
      </div>
    </div>
  );
}
