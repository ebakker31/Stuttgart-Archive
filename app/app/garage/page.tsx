import { getAppSession, listVehicles } from "@/lib/app-data";
import { ArchiveLabel } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VehicleCard } from "@/components/vehicle-card";
import { Plus, Archive } from "lucide-react";

export default async function GaragePage() {
  const session = await getAppSession();
  const vehicles = await listVehicles(session);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <ArchiveLabel>Digital garage</ArchiveLabel>
          <h1 className="mt-2 display text-4xl">Your collection of records.</h1>
          <p className="mt-2 text-muted-foreground">{vehicles.length} vehicle{vehicles.length === 1 ? "" : "s"} in the archive.</p>
        </div>
        <Button variant="accent"><Plus className="h-4 w-4" /> Add vehicle</Button>
      </div>

      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <Archive className="h-8 w-8 text-muted-foreground" />
            <h2 className="mt-4 font-serif text-2xl">Your garage is empty.</h2>
            <p className="mt-2 max-w-sm text-muted-foreground">Add your Porsche to begin preserving its story — specs, records, photos, and provenance.</p>
            <Button variant="accent" className="mt-6"><Plus className="h-4 w-4" /> Add your first vehicle</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => <VehicleCard key={v.slug} v={v} href={`/app/vehicles/${v.slug}`} isDemo={session.demo} />)}
        </div>
      )}
    </div>
  );
}
