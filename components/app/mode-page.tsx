import { getAppSession, listVehicles } from "@/lib/app-data";
import { ArchiveLabel } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { VehicleCard } from "@/components/vehicle-card";
import { CheckCircle2 } from "lucide-react";

/** Reusable mode landing page: header, tool list, and the relevant garage grid. */
export async function ModePage({
  label, title, description, tools, filter,
}: {
  label: string; title: string; description: string; tools: string[];
  filter?: (statuses: string[]) => boolean;
}) {
  const session = await getAppSession();
  let vehicles = await listVehicles(session);
  if (filter) vehicles = vehicles.filter((v) => filter([v.ownershipStatus, v.saleStatus]));

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <ArchiveLabel>{label}</ArchiveLabel>
        <h1 className="mt-2 display text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
      </div>

      <section>
        <ArchiveLabel>Tools in this mode</ArchiveLabel>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Card key={t}><CardContent className="flex items-start gap-3 p-4"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-oxblood" /><span className="text-sm">{t}</span></CardContent></Card>
          ))}
        </div>
      </section>

      <section>
        <ArchiveLabel>Relevant vehicles</ArchiveLabel>
        {vehicles.length ? (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v) => <VehicleCard key={v.slug} v={v} href={`/app/vehicles/${v.slug}`} isDemo={session.demo} />)}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No vehicles match this mode yet.</p>
        )}
      </section>
    </div>
  );
}
