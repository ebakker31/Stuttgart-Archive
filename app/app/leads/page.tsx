import { getAppSession } from "@/lib/app-data";
import { ArchiveLabel } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DEMO_LEADS = [
  { name: "A. Becker", email: "a***@example.com", vehicle: "2016 Boxster Spyder", message: "Is the service history complete? Keen to learn more.", status: "new" },
  { name: "J. Moretti", email: "j***@example.com", vehicle: "2007 911 Turbo", message: "Would you support a PPI in the area?", status: "replied" },
];

export default async function LeadsPage() {
  const session = await getAppSession();
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <ArchiveLabel>Leads</ArchiveLabel>
        <h1 className="mt-2 display text-4xl">Buyer inquiries.</h1>
        <p className="mt-2 text-muted-foreground">Captured from your public pages. No reply is ever sent automatically.</p>
      </div>

      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left text-muted-foreground"><th className="p-4 font-normal">Name</th><th className="p-4 font-normal">Vehicle</th><th className="p-4 font-normal">Message</th><th className="p-4 font-normal">Status</th></tr></thead>
          <tbody>
            {DEMO_LEADS.map((l) => (
              <tr key={l.name} className="border-b border-border last:border-0">
                <td className="p-4"><div>{l.name}</div><div className="text-xs text-muted-foreground">{l.email}</div></td>
                <td className="p-4 text-muted-foreground">{l.vehicle}</td>
                <td className="p-4 max-w-xs text-muted-foreground">{l.message}</td>
                <td className="p-4"><Badge variant={l.status === "new" ? "accent" : "muted"}>{l.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent></Card>
      {session.demo && <p className="text-xs text-muted-foreground">Sample leads shown in demo mode.</p>}
    </div>
  );
}
