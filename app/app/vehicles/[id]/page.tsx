import { notFound } from "next/navigation";
import { getAppSession, getVehicle } from "@/lib/app-data";
import { demoVehicleToScope } from "@/lib/demo-scope";
import { completenessScore, sellerReadinessScore, auctionReadinessScore, buyerRiskScore } from "@/lib/scoring";
import { ArchiveLabel, MuseumCaption, Separator, Stat, Progress } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TabNav } from "@/components/app/tab-nav";
import { ServiceTimeline, ModificationTimeline } from "@/components/timeline";
import { AIInsightCard } from "@/components/ai-insight-card";
import { GuardrailNotice } from "@/components/guardrails";
import { DemoDataBadge, PrivacyStatusBadge, SellerReadinessBadge, AuctionReadinessBadge, BuyerRiskBadge } from "@/components/badges";
import { formatCurrency, formatMileage, maskVin } from "@/lib/utils";
import { VehicleImage } from "@/components/vehicle-image";

import { sellerPacketAgent } from "@/lib/agents/seller-packet-agent";
import { listingAgent } from "@/lib/agents/listing-agent";
import { auctionPrepAgent } from "@/lib/agents/auction-prep-agent";
import { photoCoachAgent } from "@/lib/agents/photo-coach-agent";
import { buyerFaqAgent } from "@/lib/agents/buyer-faq-agent";
import { archiveCuratorAgent } from "@/lib/agents/archive-curator-agent";
import { instagramAgent } from "@/lib/agents/instagram-agent";
import { adAgent } from "@/lib/agents/ad-agent";
import { campaignAgent } from "@/lib/agents/campaign-agent";
import { publicPageAgent } from "@/lib/agents/public-page-agent";
import { missingRecordsAgent } from "@/lib/agents/missing-records-agent";
import { claimVerificationAgent } from "@/lib/agents/claim-verification-agent";
import type { AgentContext } from "@/lib/agents/types";

const TABS: [string, string][] = [
  ["overview", "Overview"], ["documents", "Documents"], ["service-history", "Service"],
  ["modifications", "Modifications"], ["photos", "Photos"], ["seller-packet", "Seller packet"],
  ["public-page", "Public page"], ["auction-prep", "Auction prep"], ["instagram", "Instagram"],
  ["ads", "Ads"], ["campaign", "Campaign"], ["buyer-questions", "Buyer Q&A"],
  ["tasks", "Tasks"], ["ai-activity", "AI activity"],
];

export default async function VehicleDetailPage({ params, searchParams }: { params: { id: string }; searchParams: { tab?: string } }) {
  const session = await getAppSession();
  const v = await getVehicle(session, params.id);
  if (!v) return notFound();

  const tab = searchParams.tab || "overview";
  const base = `/app/vehicles/${params.id}`;
  const scope = demoVehicleToScope(v, session.organizationId ?? "demo");
  const ctx: AgentContext = { organizationId: session.organizationId ?? "demo", userId: session.userId ?? "demo", vehicleId: v.slug, scope };

  const scores = {
    completeness: completenessScore(scope),
    seller: sellerReadinessScore(scope),
    auction: auctionReadinessScore(scope),
    buyer: buyerRiskScore(scope),
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <ArchiveLabel>Archive file · {v.generation ?? v.model}</ArchiveLabel>
          {session.demo && <DemoDataBadge />}
          <PrivacyStatusBadge status={v.privacyStatus} />
        </div>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="display text-4xl">{v.year} Porsche {v.model}</h1>
            <p className="mt-1 text-muted-foreground">{v.trim ?? v.bodyStyle} · {v.exteriorColor} over {v.interiorColor} · {formatMileage(v.mileage)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SellerReadinessBadge score={scores.seller.score} />
            <AuctionReadinessBadge score={scores.auction.score} />
            <BuyerRiskBadge score={scores.buyer.score} />
          </div>
        </div>
      </div>

      <TabNav base={base} active={tab} tabs={TABS} />

      <div className="pt-2">
        {tab === "overview" && <Overview v={v} scope={scope} scores={scores} ctx={ctx} />}
        {tab === "documents" && <Documents v={v} />}
        {tab === "service-history" && <section><ArchiveLabel>Service history</ArchiveLabel><div className="mt-4"><ServiceTimeline events={v.service} /></div></section>}
        {tab === "modifications" && <section><ArchiveLabel>Modifications</ArchiveLabel><div className="mt-4"><ModificationTimeline mods={v.modifications} /></div></section>}
        {tab === "photos" && <PhotosTab v={v} ctx={ctx} />}
        {tab === "seller-packet" && <SellerPacketTab ctx={ctx} />}
        {tab === "public-page" && <PublicPageTab v={v} ctx={ctx} />}
        {tab === "auction-prep" && <AuctionTab ctx={ctx} score={scores.auction.score} />}
        {tab === "instagram" && <InstagramTab ctx={ctx} />}
        {tab === "ads" && <AdsTab ctx={ctx} />}
        {tab === "campaign" && <CampaignTab ctx={ctx} />}
        {tab === "buyer-questions" && <BuyerQATab ctx={ctx} v={v} />}
        {tab === "tasks" && <TasksTab v={v} />}
        {tab === "ai-activity" && <AIActivityTab />}
      </div>
    </div>
  );
}

/* ----------------------------- Overview ----------------------------- */
async function Overview({ v, scope, scores, ctx }: any) {
  const curator = await archiveCuratorAgent.run({ scope }, ctx);
  const missing = await missingRecordsAgent.run({ scope }, ctx);
  const specs: [string, string][] = [
    ["Year", String(v.year)], ["Generation", v.generation ?? "—"], ["Transmission", v.transmission],
    ["Engine", v.engine], ["Drivetrain", v.drivetrain], ["Mileage", formatMileage(v.mileage)],
    ["Title", v.titleStatus], ["VIN", maskVin("WP0AB2A9XJS000000", v.vinPublicMode)], ["Status", v.ownershipStatus],
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div className="space-y-8">
        <VehicleImage v={v} className="aspect-[16/9]" />
        <section>
          <ArchiveLabel>Archive notes</ArchiveLabel>
          <MuseumCaption className="mt-3 text-base">{v.archiveNotes}</MuseumCaption>
        </section>
        <section>
          <ArchiveLabel>Specifications</ArchiveLabel>
          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
            {specs.map(([k, val]) => <Stat key={k} label={k} value={val} />)}
          </div>
        </section>
        <section>
          <ArchiveLabel>Options & equipment</ArchiveLabel>
          <div className="mt-3 flex flex-wrap gap-2">
            {v.options.map((o: string) => <Badge key={o} variant="outline">{o}</Badge>)}
            {!v.options.length && <span className="text-sm text-muted-foreground">No options recorded.</span>}
          </div>
        </section>
        <AIInsightCard title="Archive Curator" result={curator}>
          <div className="space-y-3">
            {curator.output.chapters.map((c: any) => (
              <div key={c.title}><div className="font-serif text-base">{c.title}</div><p className="text-sm text-muted-foreground">{c.caption}</p></div>
            ))}
          </div>
        </AIInsightCard>
      </div>

      <aside className="space-y-5">
        <Card><CardContent className="space-y-4 p-5">
          <div><div className="flex items-center justify-between"><span className="archive-label">Completeness</span><span className="text-sm">{scores.completeness.score}</span></div><Progress value={scores.completeness.score} className="mt-2" /></div>
          <div><div className="flex items-center justify-between"><span className="archive-label">Seller readiness</span><span className="text-sm">{scores.seller.score}</span></div><Progress value={scores.seller.score} className="mt-2" /></div>
          <div><div className="flex items-center justify-between"><span className="archive-label">Auction readiness</span><span className="text-sm">{scores.auction.score}</span></div><Progress value={scores.auction.score} className="mt-2" /></div>
        </CardContent></Card>

        <AIInsightCard title="Missing records" result={missing}>
          <ul className="space-y-2 text-sm">
            {missing.output.missing.slice(0, 4).map((m: any) => (
              <li key={m.record}><span className="font-medium">{m.record}</span> <Badge variant={m.importance === "high" ? "danger" : "muted"}>{m.importance}</Badge><p className="text-xs text-muted-foreground">{m.whyItMatters}</p></li>
            ))}
            {!missing.output.missing.length && <li className="text-muted-foreground">Documentation looks complete.</li>}
          </ul>
        </AIInsightCard>
      </aside>
    </div>
  );
}

/* ----------------------------- Documents ----------------------------- */
function Documents({ v }: any) {
  return (
    <section>
      <div className="flex items-center justify-between"><ArchiveLabel>Paperwork vault</ArchiveLabel><Button variant="outline" size="sm">Upload document</Button></div>
      <Card className="mt-4"><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left"><th className="p-4 font-normal text-muted-foreground">Document</th><th className="p-4 font-normal text-muted-foreground">Type</th><th className="p-4 font-normal text-muted-foreground">Visibility</th></tr></thead>
          <tbody>
            {v.documents.map((d: any) => (
              <tr key={d.name} className="border-b border-border last:border-0">
                <td className="p-4">{d.name}</td><td className="p-4 text-muted-foreground">{d.type}</td>
                <td className="p-4">{d.isPrivate ? <Badge variant="muted">Private</Badge> : <Badge variant="success">Shareable</Badge>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent></Card>
      <p className="mt-3 text-xs text-muted-foreground">Documents are private by default. The Document Agent extracts dates, mileage, vendor, and services for you to confirm.</p>
    </section>
  );
}

/* ----------------------------- Photos ----------------------------- */
async function PhotosTab({ v, ctx }: any) {
  const coach = await photoCoachAgent.run({ scope: ctx.scope }, ctx);
  return (
    <div className="space-y-6">
      <VehicleImage v={v} className="aspect-[16/9]" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {v.photos.map((p: any, i: number) => (
          <div key={i} className="flex aspect-[4/3] items-center justify-center rounded-md border border-border bg-gradient-to-br from-graphite/[0.05] to-graphite/[0.12] paper-grain"><span className="archive-label">{p.category}</span></div>
        ))}
      </div>
      <AIInsightCard title="Photo Coach — missing shots" result={coach}>
        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          <Listy label="Exterior" items={coach.output.missingExterior} />
          <Listy label="Interior" items={coach.output.missingInterior} />
          <Listy label="Wheels & tires" items={coach.output.missingWheelTire} />
          <Listy label="Undercarriage" items={coach.output.missingUndercarriage} />
        </div>
      </AIInsightCard>
    </div>
  );
}

/* ----------------------------- Seller packet ----------------------------- */
async function SellerPacketTab({ ctx }: any) {
  const packet = await sellerPacketAgent.run({ scope: ctx.scope }, ctx);
  const listing = await listingAgent.run({ scope: ctx.scope }, ctx);
  return (
    <div className="space-y-6">
      <GuardrailNotice />
      <AIInsightCard title="Seller packet" result={packet}>
        <div className="space-y-3">
          {packet.output.sections.map((s: any) => (
            <div key={s.title}><div className="font-serif text-base">{s.title}</div><p className="whitespace-pre-line text-sm text-muted-foreground">{s.body}</p></div>
          ))}
        </div>
      </AIInsightCard>
      <AIInsightCard title="Listing copy" result={listing}>
        <p className="whitespace-pre-line text-sm text-muted-foreground">{listing.output.longDescription}</p>
      </AIInsightCard>
      <div className="flex gap-2"><Button variant="accent" href={`/api/seller-packet/pdf?vehicle=${ctx.vehicleId}`}>Download seller packet PDF</Button><Button variant="outline">Create secure share link</Button></div>
    </div>
  );
}

/* ----------------------------- Public page ----------------------------- */
async function PublicPageTab({ v, ctx }: any) {
  const pp = await publicPageAgent.run({ scope: ctx.scope, showFullVin: v.vinPublicMode === "full" }, ctx);
  return (
    <div className="space-y-6">
      <GuardrailNotice items={["approvedFields", "draftOnly", "factsOnly"]} />
      <AIInsightCard title="Public page builder" result={pp}>
        <div className="space-y-3 text-sm">
          <div><span className="archive-label">Suggested sections</span><div className="mt-2 flex flex-wrap gap-2">{pp.output.suggestedSections.map((s: string) => <Badge key={s} variant="outline">{s}</Badge>)}</div></div>
          <div><span className="archive-label">Hidden private fields</span><ul className="mt-2 space-y-1 text-muted-foreground">{pp.output.hiddenPrivateFields.map((f: string) => <li key={f}>• {f}</li>)}</ul></div>
          <div className="flex items-center gap-2"><span className="archive-label">Publish readiness</span><Progress value={pp.output.publishReadiness} className="max-w-[160px]" /><span>{pp.output.publishReadiness}</span></div>
        </div>
      </AIInsightCard>
      <div className="flex gap-2"><Button variant="accent">Confirm & publish</Button><Button variant="outline" href={`/v/${v.slug}`}>Preview public page</Button></div>
      <p className="text-xs text-muted-foreground">Publishing is never automatic — it requires this explicit confirmation.</p>
    </div>
  );
}

/* ----------------------------- Auction prep ----------------------------- */
async function AuctionTab({ ctx, score }: any) {
  const a = await auctionPrepAgent.run({ scope: ctx.scope }, ctx);
  const claims = await claimVerificationAgent.run({ text: a.output.longDescription, scope: ctx.scope }, ctx);
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3"><ArchiveLabel>Auction readiness</ArchiveLabel><Progress value={score} className="max-w-[200px]" /><span className="text-sm">{score}</span></div>
      <AIInsightCard title="Auction-style draft" result={a}>
        <div className="space-y-3 text-sm">
          <div className="font-serif text-lg">{a.output.listingTitle}</div>
          <p className="text-muted-foreground">{a.output.longDescription}</p>
          <Listy label="Photo gaps" items={a.output.photoGaps} />
          <Listy label="Video recommendations" items={a.output.videoRecommendations} />
          <Listy label="Missing items" items={a.output.missingItems} />
        </div>
      </AIInsightCard>
      <AIInsightCard title="Claim verification" result={claims}>
        {claims.output.checks.length ? (
          <ul className="space-y-2 text-sm">{claims.output.checks.map((c: any, i: number) => (
            <li key={i} className="flex items-start gap-2"><Badge variant={c.status === "supported" ? "success" : "danger"}>{c.status.replace("_", " ")}</Badge><span>“{c.claim}”{c.saferWording ? ` → ${c.saferWording}` : ""}</span></li>
          ))}</ul>
        ) : <p className="text-sm text-muted-foreground">No watched claims detected in the draft.</p>}
      </AIInsightCard>
    </div>
  );
}

/* ----------------------------- Instagram ----------------------------- */
async function InstagramTab({ ctx }: any) {
  const ig = await instagramAgent.run({ scope: ctx.scope }, ctx);
  return (
    <div className="space-y-6">
      <GuardrailNotice items={["draftOnly", "reviewClaims"]} />
      <AIInsightCard title="Instagram kit" result={ig}>
        <div className="space-y-3 text-sm">
          <Listy label="Captions" items={ig.output.captions} />
          <Listy label="Reel script" items={ig.output.reelScript} />
          <div><span className="archive-label">Hashtags</span><div className="mt-2 flex flex-wrap gap-1.5">{ig.output.hashtags.map((h: string) => <Badge key={h} variant="muted">{h}</Badge>)}</div></div>
        </div>
      </AIInsightCard>
      <p className="text-xs text-muted-foreground">Stuttgart Archive never posts to Instagram automatically. Copy, review, and post manually.</p>
    </div>
  );
}

/* ----------------------------- Ads ----------------------------- */
async function AdsTab({ ctx }: any) {
  const ad = await adAgent.run({ scope: ctx.scope }, ctx);
  return (
    <div className="space-y-6">
      <GuardrailNotice items={["draftOnly", "reviewClaims"]} />
      <AIInsightCard title="Ad brief" result={ad}>
        <dl className="space-y-2 text-sm">
          <Row k="Objective" val={ad.output.campaignObjective} /><Row k="Headline" val={ad.output.headline} />
          <Row k="Primary text" val={ad.output.primaryText} /><Row k="CTA" val={ad.output.cta} />
          <Row k="Landing page" val={ad.output.landingPageRecommendation} />
        </dl>
      </AIInsightCard>
      <p className="text-xs text-muted-foreground">No ad is ever launched and no money is ever spent automatically.</p>
    </div>
  );
}

/* ----------------------------- Campaign ----------------------------- */
async function CampaignTab({ ctx }: any) {
  const c = await campaignAgent.run({ scope: ctx.scope, days: 7 }, ctx);
  return (
    <AIInsightCard title="7-day campaign plan" result={c}>
      <div className="space-y-2 text-sm">
        {c.output.days.map((d: any) => (
          <div key={d.day} className="flex gap-3 border-b border-border pb-2 last:border-0"><span className="archive-label w-12 shrink-0">Day {d.day}</span><span>{d.post}{d.reel ? ` · Reel: ${d.reel}` : ""}</span></div>
        ))}
      </div>
    </AIInsightCard>
  );
}

/* ----------------------------- Buyer Q&A ----------------------------- */
async function BuyerQATab({ ctx }: any) {
  const faq = await buyerFaqAgent.run({ scope: ctx.scope }, ctx);
  return (
    <AIInsightCard title="Buyer FAQ" result={faq}>
      <div className="space-y-3 text-sm">
        {faq.output.faq.map((f: any) => (
          <div key={f.q}><div className="font-medium">{f.q}</div><p className={f.needsUserInput ? "text-oxblood" : "text-muted-foreground"}>{f.a}{f.needsUserInput ? " (needs your input)" : ""}</p></div>
        ))}
      </div>
    </AIInsightCard>
  );
}

/* ----------------------------- Tasks ----------------------------- */
function TasksTab({ v }: any) {
  return (
    <section>
      <ArchiveLabel>Tasks</ArchiveLabel>
      <Card className="mt-4"><CardContent className="divide-y divide-border p-0">
        {v.tasks.map((t: any) => (
          <div key={t.title} className="flex items-center justify-between px-5 py-3.5"><span>{t.title}</span><Badge variant={t.priority === "high" ? "danger" : t.priority === "medium" ? "warning" : "muted"}>{t.priority}</Badge></div>
        ))}
        {!v.tasks.length && <div className="px-5 py-8 text-center text-sm text-muted-foreground">No tasks yet.</div>}
      </CardContent></Card>
    </section>
  );
}

/* ----------------------------- AI activity ----------------------------- */
function AIActivityTab() {
  return (
    <section>
      <ArchiveLabel>AI activity log</ArchiveLabel>
      <p className="mt-2 text-sm text-muted-foreground">Every agent run is recorded with its inputs (summarized), confidence, sources, and risk flags. With Supabase connected, this view reads from <code className="text-xs">ai_agent_runs</code>.</p>
      <Card className="mt-4"><CardContent className="p-5 text-sm text-muted-foreground">In demo mode, agent runs are computed live and not persisted. Connect Supabase to see a full audit trail here.</CardContent></Card>
    </section>
  );
}

/* ----------------------------- helpers ----------------------------- */
function Listy({ label, items }: { label: string; items: string[] }) {
  return (
    <div><span className="archive-label">{label}</span><ul className="mt-1.5 space-y-1 text-muted-foreground">{items.length ? items.map((i, k) => <li key={k}>• {i}</li>) : <li>—</li>}</ul></div>
  );
}
function Row({ k, val }: { k: string; val: string }) {
  return <div className="grid grid-cols-[110px_1fr] gap-2"><dt className="archive-label">{k}</dt><dd>{val}</dd></div>;
}
