import { ArchiveLabel } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { config } from "@/lib/config";

const PROVIDERS = [
  { id: "instagram", name: "Instagram", desc: "Draft captions and plan content. Posting is always manual in MVP." },
  { id: "meta_ads", name: "Meta Ads", desc: "Generate ad briefs. No ad is launched and no spend occurs automatically." },
];

export default function IntegrationsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <ArchiveLabel>Settings · Integrations</ArchiveLabel>
        <h1 className="mt-2 display text-4xl">Integrations.</h1>
        <p className="mt-2 text-muted-foreground">Connect accounts only if you want to. We never access them without your explicit connection.</p>
      </div>

      {PROVIDERS.map((p) => {
        const enabled = p.id === "instagram" ? config.integrations.instagramEnabled : config.integrations.metaAdsEnabled;
        return (
          <Card key={p.id}><CardContent className="flex items-center justify-between gap-4 p-5">
            <div><div className="flex items-center gap-2"><span className="font-medium">{p.name}</span>{!enabled && <Badge variant="muted">Mock</Badge>}</div><p className="mt-1 text-sm text-muted-foreground">{p.desc}</p></div>
            <Button variant="outline" disabled>{enabled ? "Connect" : "Not configured"}</Button>
          </CardContent></Card>
        );
      })}
      <p className="text-xs text-muted-foreground">These integrations are placeholders in the MVP. Add OAuth credentials in your environment to enable real connections later.</p>
    </div>
  );
}
