import { getAppSession, listVehicles } from "@/lib/app-data";
import { ArchiveLabel } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { formatMileage } from "@/lib/utils";

export default async function ComparePage() {
  const session = await getAppSession();
  const vehicles = await listVehicles(session);
  const [a, b] = vehicles;

  const rows: [string, (v: any) => string][] = [
    ["Year", (v) => String(v.year)], ["Model", (v) => v.model], ["Generation", (v) => v.generation ?? "—"],
    ["Mileage", (v) => formatMileage(v.mileage)], ["Transmission", (v) => v.transmission], ["Drivetrain", (v) => v.drivetrain],
    ["Title", (v) => v.titleStatus], ["Service records", (v) => String(v.service.length)],
    ["Modifications", (v) => String(v.modifications.length)], ["Seller readiness", (v) => String(v.sellerReadiness)],
    ["Auction readiness", (v) => String(v.auctionReadiness)], ["Known flaws", (v) => (v.knownFlaws ? "Disclosed" : "Not provided")],
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <ArchiveLabel>Compare vehicles</ArchiveLabel>
        <h1 className="mt-2 display text-4xl">Side by side.</h1>
        <p className="mt-2 text-muted-foreground">Compare documentation and readiness — only on the facts each archive provides.</p>
      </div>

      {a && b ? (
        <Card><CardContent className="p-0">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border"><th className="p-4 text-left font-normal text-muted-foreground">Attribute</th><th className="p-4 text-left font-serif text-base">{a.year} {a.model}</th><th className="p-4 text-left font-serif text-base">{b.year} {b.model}</th></tr></thead>
            <tbody>
              {rows.map(([label, get]) => (
                <tr key={label} className="border-b border-border last:border-0"><td className="p-4 text-muted-foreground">{label}</td><td className="p-4">{get(a)}</td><td className="p-4">{get(b)}</td></tr>
              ))}
            </tbody>
          </table>
        </CardContent></Card>
      ) : (
        <p className="text-muted-foreground">Add at least two vehicles to compare.</p>
      )}
    </div>
  );
}
