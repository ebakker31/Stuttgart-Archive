import Link from "next/link";
import { getAppSession, listVehicles } from "@/lib/app-data";
import { onboardingAgent } from "@/lib/agents/onboarding-agent";
import { Card, CardContent } from "@/components/ui/card";
import { ArchiveLabel, Progress } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicle-card";
import { USER_MODES, type UserMode } from "@/lib/brand";
import { ArrowRight, CheckCircle2, Circle, Plus } from "lucide-react";

export default async function DashboardPage({ searchParams }: { searchParams: { mode?: string } }) {
  const session = await getAppSession();
  const mode = (searchParams.mode as UserMode) || session.mode;
  const vehicles = await listVehicles(session);
  const modeInfo = USER_MODES.find((m) => m.id === mode) ?? USER_MODES[0];

  const onboarding = await onboardingAgent.run({ mode }, { organizationId: session.organizationId ?? "demo", userId: session.userId ?? "demo" });
  const o = onboarding.output;

  const avgCompleteness = vehicles.length ? Math.round(vehicles.reduce((s, v) => s + (v.completeness || 0), 0) / vehicles.length) : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <ArchiveLabel>{modeInfo.label} dashboard</ArchiveLabel>
          <h1 className="mt-2 display text-4xl">{greeting()}{session.fullName ? `, ${session.fullName.split(" ")[0]}` : ""}.</h1>
          <p className="mt-2 text-muted-foreground">{modeInfo.description}</p>
        </div>
        <Button href="/app/garage/new" variant="accent"><Plus className="h-4 w-4" /> {modeInfo.firstAction}</Button>
      </div>

      {/* Mode switcher */}
      <div className="flex flex-wrap gap-2">
        {USER_MODES.map((m) => (
          <Link key={m.id} href={`/app?mode=${m.id}`} className={`rounded-full border px-3 py-1 text-sm transition-colors ${m.id === mode ? "border-oxblood/40 bg-oxblood/5 text-oxblood" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {m.label}
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Vehicles in archive" value={String(vehicles.length)} />
        <StatCard label="Avg. completeness" value={`${avgCompleteness}%`} progress={avgCompleteness} />
        <StatCard label="Mode" value={modeInfo.label} />
      </div>

      {/* Next best actions (from onboarding agent) */}
      <section>
        <ArchiveLabel>Next best actions</ArchiveLabel>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {o.recommendedFirstActions.map((a, i) => (
            <Card key={a}>
              <CardContent className="flex items-start gap-3 p-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-oxblood/10 text-xs font-medium text-oxblood">{i + 1}</span>
                <span className="text-sm">{a}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Guided checklist */}
      <section>
        <ArchiveLabel>Get set up</ArchiveLabel>
        <Card className="mt-4">
          <CardContent className="divide-y divide-border p-0">
            {o.suggestedChecklist.map((c) => (
              <div key={c.label} className="flex items-center gap-3 px-5 py-3.5">
                {c.done ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <Circle className="h-5 w-5 text-muted-foreground/50" />}
                <span className={c.done ? "text-muted-foreground line-through" : ""}>{c.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Garage preview */}
      <section>
        <div className="flex items-center justify-between">
          <ArchiveLabel>Your garage</ArchiveLabel>
          <Link href="/app/garage" className="inline-flex items-center gap-1 text-sm text-oxblood hover:underline">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.slice(0, 3).map((v) => <VehicleCard key={v.slug} v={v} href={`/app/vehicles/${v.slug}`} isDemo={session.demo} />)}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, progress }: { label: string; value: string; progress?: number }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="archive-label">{label}</div>
        <div className="mt-2 font-serif text-3xl">{value}</div>
        {progress !== undefined && <Progress value={progress} className="mt-3" />}
      </CardContent>
    </Card>
  );
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}
