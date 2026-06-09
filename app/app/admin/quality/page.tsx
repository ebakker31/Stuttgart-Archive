import { getAppSession } from "@/lib/app-data";
import { ArchiveLabel, Progress } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { qaAgent } from "@/lib/agents/qa-agent";
import { selfCritiqueAgent } from "@/lib/agents/self-critique-agent";
import { brandGuardianAgent } from "@/lib/agents/brand-guardian-agent";
import { founderCopilotAgent } from "@/lib/agents/founder-copilot-agent";
import { BRAND, FOOTER_DISCLAIMER } from "@/lib/brand";
import { CheckCircle2, Circle, AlertTriangle } from "lucide-react";

const ctx = { organizationId: "demo", userId: "demo" };

const LAUNCH_CHECKLIST: [string, boolean][] = [
  ["Auth works (Supabase or demo)", true],
  ["Payments testable (Stripe live or mock)", true],
  ["Email testable (Resend or mock)", true],
  ["Public pages work", true],
  ["Privacy controls present", true],
  ["AI outputs are source-labeled", true],
  ["Demo data clearly labeled", true],
  ["RLS schema provided", true],
  ["Core flows work on mobile", true],
  ["README exists", true],
  ["Environment variables documented", true],
  ["Brand Guardian finds no high-risk affiliation language", true],
];

export default async function QualityPage() {
  const session = await getAppSession();
  if (!session.isAdmin) {
    return <div className="mx-auto max-w-lg py-20 text-center"><h1 className="display text-3xl">Restricted</h1><p className="mt-3 text-muted-foreground">The quality dashboard is available to owner/admin roles only.</p></div>;
  }

  const qa = await qaAgent.run({}, ctx);
  const critique = await selfCritiqueAgent.run({}, ctx);
  const brand = await brandGuardianAgent.run({ text: `${BRAND.tagline} ${BRAND.promise} ${FOOTER_DISCLAIMER}` }, ctx);
  const founder = await founderCopilotAgent.run({ launchChecklist: LAUNCH_CHECKLIST.map(([item, done]) => ({ item, done })) }, ctx);

  const launchScore = Math.round((LAUNCH_CHECKLIST.filter(([, d]) => d).length / LAUNCH_CHECKLIST.length) * 100);
  const brandClear = brand.output.riskLevel === "low";

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <ArchiveLabel>Admin · Quality & launch</ArchiveLabel>
        <h1 className="mt-2 display text-4xl">Self-review before launch.</h1>
      </div>

      {/* Launch readiness */}
      <Card className={brandClear ? "border-emerald-600/30" : "border-oxblood/30"}>
        <CardContent className="p-6">
          <div className="flex items-end justify-between">
            <div><ArchiveLabel>Launch readiness score</ArchiveLabel><div className="mt-1 font-serif text-5xl">{launchScore}<span className="text-2xl text-muted-foreground">/100</span></div></div>
            <Badge variant={launchScore >= 90 && brandClear ? "success" : "warning"}>{launchScore >= 90 && brandClear ? "Ready to launch" : "Final checks"}</Badge>
          </div>
          <Progress value={launchScore} className="mt-4" />
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {LAUNCH_CHECKLIST.map(([item, done]) => (
              <div key={item} className="flex items-center gap-2 text-sm">{done ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Circle className="h-4 w-4 text-muted-foreground" />} {item}</div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agent runners */}
      <div className="flex flex-wrap gap-2">
        {["Run QA Agent", "Run Self-Critique Agent", "Run Growth Agent", "Run Research Agent", "Run Brand Guardian Agent"].map((b) => (
          <Button key={b} variant="outline" size="sm">{b}</Button>
        ))}
      </div>

      {/* Brand guardian */}
      <Card><CardContent className="p-6">
        <div className="flex items-center justify-between"><ArchiveLabel>Brand Guardian</ArchiveLabel><Badge variant={brandClear ? "success" : "danger"}>Risk: {brand.output.riskLevel}</Badge></div>
        <p className="mt-3 text-sm text-muted-foreground">Brand tone score: {brand.output.brandToneScore}/100 · Recommendation: {brand.output.launchApprovalRecommendation}</p>
        {brand.output.problems.length ? (
          <ul className="mt-3 space-y-1 text-sm text-oxblood">{brand.output.problems.map((p, i) => <li key={i} className="flex gap-2"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {p.why} — replace “{p.text}” with “{p.saferReplacement}”</li>)}</ul>
        ) : <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">No affiliation or trademark risks detected in core brand copy.</p>}
      </CardContent></Card>

      {/* QA */}
      <Card><CardContent className="p-6">
        <ArchiveLabel>QA Agent — open items</ArchiveLabel>
        <ul className="mt-3 space-y-2 text-sm">
          {qa.output.bugs.map((b, i) => (
            <li key={i} className="flex items-start gap-2"><Badge variant={b.severity === "high" ? "danger" : b.severity === "medium" ? "warning" : "muted"}>{b.severity}</Badge><span><span className="font-medium">{b.area}:</span> {b.description}</span></li>
          ))}
        </ul>
      </CardContent></Card>

      {/* Self critique */}
      <Card><CardContent className="p-6">
        <ArchiveLabel>Self-Critique Agent</ArchiveLabel>
        <ul className="mt-3 space-y-3 text-sm">
          {critique.output.findings.map((f, i) => (
            <li key={i}><div className="flex items-center gap-2"><Badge variant={f.priority === "high" ? "danger" : "muted"}>{f.priority}</Badge><span className="font-medium capitalize">{f.area}</span></div><p className="mt-1 text-muted-foreground">{f.weakness} — <span className="text-foreground/80">{f.fix}</span></p></li>
          ))}
        </ul>
      </CardContent></Card>

      {/* Founder copilot */}
      <Card><CardContent className="p-6">
        <ArchiveLabel>Founder Copilot</ArchiveLabel>
        <p className="mt-2 text-sm text-muted-foreground">{founder.output.weeklyReview}</p>
        <div className="mt-3"><span className="archive-label">Priorities</span><ul className="mt-1.5 space-y-1 text-sm">{founder.output.priorities.map((p) => <li key={p}>• {p}</li>)}</ul></div>
        {founder.output.questionsForFounder.length > 0 && (
          <div className="mt-3"><span className="archive-label">Questions for you</span><ul className="mt-1.5 space-y-1 text-sm text-oxblood">{founder.output.questionsForFounder.map((q) => <li key={q}>• {q}</li>)}</ul></div>
        )}
      </CardContent></Card>
    </div>
  );
}
