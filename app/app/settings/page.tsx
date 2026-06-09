import Link from "next/link";
import { getAppSession } from "@/lib/app-data";
import { ArchiveLabel } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Bot, Plug, CreditCard, ChevronRight } from "lucide-react";

const LINKS = [
  ["Privacy", "/app/settings/privacy", "Control visibility, VIN display, and data export.", ShieldCheck],
  ["Autopilot", "/app/settings/autopilot", "Decide what the AI may do on its own.", Bot],
  ["Integrations", "/app/settings/integrations", "Connect Instagram and Meta Ads (mock).", Plug],
  ["Billing", "/app/billing", "Manage your plan and per-vehicle packs.", CreditCard],
] as const;

export default async function SettingsPage() {
  const session = await getAppSession();
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <ArchiveLabel>Settings</ArchiveLabel>
        <h1 className="mt-2 display text-4xl">Account & controls.</h1>
        <p className="mt-2 text-muted-foreground">{session.email ?? "Demo account"} · <span className="capitalize">{session.mode} mode</span></p>
      </div>
      <div className="space-y-3">
        {LINKS.map(([label, href, desc, Icon]) => (
          <Link key={href} href={href}>
            <Card className="transition-colors hover:border-oxblood/40">
              <CardContent className="flex items-center gap-4 p-5">
                <Icon className="h-5 w-5 text-oxblood" />
                <div className="flex-1"><div className="font-medium">{label}</div><p className="text-sm text-muted-foreground">{desc}</p></div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
