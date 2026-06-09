import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArchiveLabel, MuseumCaption, Separator } from "@/components/ui/misc";
import { FAQAccordion } from "@/components/faq-accordion";
import { WaitlistForm } from "@/components/waitlist-form";
import { USER_MODES } from "@/lib/brand";
import { PLANS } from "@/lib/payments/plans";
import {
  Archive, FileText, ShieldCheck, Gavel, Camera, Megaphone, Search,
  Clock, FolderArchive, Lock, Sparkles, ArrowRight, CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 paper-grain opacity-70" aria-hidden />
        <div className="container relative grid gap-12 py-20 md:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <ArchiveLabel>Independent · Privacy-first · Collector-grade</ArchiveLabel>
            <h1 className="mt-5 display text-balance text-5xl leading-[1.05] md:text-6xl">
              Preserve the story<br />behind the machine.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Stuttgart Archive helps Porsche owners, buyers, sellers, and collectors organize
              records, build digital garages, prepare listings, and preserve the history of each car.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/signup" variant="accent" size="lg">Start your archive <ArrowRight className="h-4 w-4" /></Button>
              <Button href="/demo" variant="outline" size="lg">Explore demo archive</Button>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">Free to start · 3 vehicles · No card required</p>
          </div>

          {/* Archival "index card" hero panel — original, no official imagery */}
          <div className="relative">
            <Card className="rotate-[-1deg] shadow-archive-lg">
              <CardContent className="p-7">
                <div className="flex items-center justify-between">
                  <ArchiveLabel>Archive file</ArchiveLabel>
                  <ArchiveLabel>No. 0993</ArchiveLabel>
                </div>
                <Separator className="my-4" />
                <div className="font-serif text-2xl">1997 911 Carrera</div>
                <div className="text-sm text-muted-foreground">993 · Arena Red Metallic · Cashmere</div>
                <div className="mt-5 grid grid-cols-3 gap-4 text-center">
                  {[["Records", "since 1990s"], ["Owners", "three"], ["Service", "specialist"]].map(([k, v]) => (
                    <div key={k}>
                      <div className="archive-label">{k}</div>
                      <div className="mt-1 font-serif text-sm">{v}</div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <MuseumCaption>The last air-cooled 911 — preserved, documented, and handled with care.</MuseumCaption>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> Service timeline · <FolderArchive className="h-3.5 w-3.5" /> Paperwork vault · <Lock className="h-3.5 w-3.5" /> Private by default
                </div>
              </CardContent>
            </Card>
            <div className="absolute -bottom-4 -right-3 hidden rotate-[2deg] sm:block">
              <span className="rounded-sm border border-oxblood/40 bg-background px-3 py-1.5 text-xs text-oxblood shadow-archive">Handled with care</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TRUST STRIP ---------------- */}
      <section className="border-b border-border bg-graphite text-parchment">
        <div className="container flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-5 text-sm">
          {["Private by default", "Real-data-only AI", "No auto-posting, ever", "Export or delete anytime", "Free to start"].map((t) => (
            <span key={t} className="inline-flex items-center gap-2 text-parchment/85">
              <CheckCircle2 className="h-4 w-4 text-oxblood-soft" /> {t}
            </span>
          ))}
        </div>
      </section>

      {/* ---------------- BUILT FOR CARS WITH A STORY ---------------- */}
      <section className="border-b border-border bg-card/40">
        <div className="container py-20">
          <div className="mx-auto max-w-3xl text-center">
            <ArchiveLabel className="justify-center">Built for cars with a story</ArchiveLabel>
            <h2 className="mt-4 display text-4xl">Some cars deserve more than a folder of receipts.</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Every Porsche carries years of engineering, design, racing heritage, craftsmanship, and time.
              Stuttgart Archive helps you preserve the story behind each example — from service records and
              ownership history to photos, modifications, and the details that make the car meaningful.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: Clock, t: "Timeline motifs", d: "Service and ownership history laid out chronologically, like a curator's catalogue." },
              { icon: FolderArchive, t: "Archive labels", d: "Museum-style captions and metadata tables for every record you keep." },
              { icon: Sparkles, t: "Provenance, preserved", d: "Turn scattered documents into a coherent, collector-grade history." },
            ].map((c) => (
              <Card key={c.t}>
                <CardContent className="p-6">
                  <c.icon className="h-6 w-6 text-oxblood" />
                  <h3 className="mt-4 font-serif text-xl">{c.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="border-b border-border">
        <div className="container py-20">
          <ArchiveLabel>How it works</ArchiveLabel>
          <h2 className="mt-3 display text-4xl">Three steps to a documented archive.</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { n: "01", icon: Archive, t: "Add your Porsche", d: "Enter the basics — year, model, spec, mileage. It takes a minute, and it's private by default." },
              { n: "02", icon: FileText, t: "Upload your records", d: "Drop in service invoices, the title, photos. We read the dates, mileage, and work performed for you to confirm." },
              { n: "03", icon: ShieldCheck, t: "Share what you approve", d: "Build a public page, a seller packet, or an auction draft — and publish only the fields you choose." },
            ].map((s, i) => (
              <div key={s.n} className="relative">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-3xl text-oxblood/30">{s.n}</span>
                  <s.icon className="h-5 w-5 text-oxblood" />
                </div>
                <h3 className="mt-4 font-serif text-2xl">{s.t}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{s.d}</p>
                {i < 2 && <div className="absolute -right-4 top-3 hidden h-px w-8 bg-border md:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- WHO IT'S FOR ---------------- */}
      <section className="border-b border-border">
        <div className="container py-20">
          <ArchiveLabel>Who it's for</ArchiveLabel>
          <h2 className="mt-3 display text-4xl">One archive, every kind of enthusiast.</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {USER_MODES.filter((m) => m.id !== "browse").map((m) => (
              <Card key={m.id} id={m.id} className="transition-shadow hover:shadow-archive-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xl">{m.label}</span>
                    <span className="archive-label">{m.firstAction}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FEATURE PILLARS ---------------- */}
      <FeaturePillars />

      {/* ---------------- PRIVACY + REAL DATA ---------------- */}
      <section id="real-data" className="border-b border-border bg-graphite text-parchment">
        <div className="container grid gap-12 py-20 lg:grid-cols-2">
          <div>
            <ArchiveLabel className="text-silver">Privacy-first controls</ArchiveLabel>
            <h2 className="mt-3 display text-4xl">Private by default. Public only when you say so.</h2>
            <ul className="mt-6 space-y-3 text-parchment/85">
              {["Vehicles are private until you choose to publish", "Full VIN is hidden by default", "Documents can stay private forever", "AI access is scoped to one vehicle and logged", "Export or delete your data anytime"].map((t) => (
                <li key={t} className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-oxblood-soft" /> {t}</li>
              ))}
            </ul>
            <Button href="/privacy" variant="outline" className="mt-7 border-parchment/30 text-parchment hover:bg-parchment/10">Read our privacy approach</Button>
          </div>
          <div>
            <ArchiveLabel className="text-silver">Real-data-only AI</ArchiveLabel>
            <h2 className="mt-3 display text-4xl">The AI never invents facts about your car.</h2>
            <p className="mt-6 leading-relaxed text-parchment/85">
              Our assistants only use what you provide — your entries, documents, and photos. Every output is
              labeled with its source, a confidence level, and any missing information. Unsupported claims are
              rewritten honestly instead of dressed up.
            </p>
            <div className="mt-6 rounded-md border border-parchment/15 bg-parchment/[0.04] p-4 text-sm">
              <div className="archive-label text-silver">Claim-safe wording</div>
              <p className="mt-2 text-parchment/80">
                Instead of <span className="line-through opacity-60">“accident-free”</span> →
                <span className="text-oxblood-soft"> “No accident records were provided in the uploaded documents.”</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- PRICING PREVIEW ---------------- */}
      <section className="border-b border-border">
        <div className="container py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <ArchiveLabel>Pricing</ArchiveLabel>
              <h2 className="mt-3 display text-4xl">Free to start. Upgrade only if you need to.</h2>
            </div>
            <Button href="/pricing" variant="outline">See all plans <ArrowRight className="h-4 w-4" /></Button>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {PLANS.filter((p) => ["free", "plus", "collector"].includes(p.id)).map((p) => (
              <Card key={p.id} className={p.highlight ? "border-oxblood/40" : ""}>
                <CardContent className="p-6">
                  {p.highlight && <ArchiveLabel className="text-oxblood">Most popular</ArchiveLabel>}
                  <div className="mt-2 font-serif text-2xl">{p.name}</div>
                  <div className="mt-1 text-3xl font-light">{p.priceLabel}</div>
                  <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                    {p.features.slice(0, 5).map((f) => (
                      <li key={f} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-oxblood" /> {f}</li>
                    ))}
                  </ul>
                  <Button href="/signup" variant={p.highlight ? "accent" : "outline"} className="mt-6 w-full">
                    {p.id === "free" ? "Start free" : `Choose ${p.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="border-b border-border bg-card/40">
        <div className="container grid gap-12 py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <ArchiveLabel>Questions</ArchiveLabel>
            <h2 className="mt-3 display text-4xl">Good to know.</h2>
            <p className="mt-4 text-muted-foreground">Still curious? <Link href="/book-demo" className="text-oxblood hover:underline">Book a walkthrough</Link>.</p>
          </div>
          <FAQAccordion items={FAQ} />
        </div>
      </section>

      {/* ---------------- FOUNDING MEMBERS ---------------- */}
      <section className="border-b border-border bg-card/40">
        <div className="container grid items-center gap-10 py-20 lg:grid-cols-[1fr_1fr]">
          <div>
            <ArchiveLabel>Founding members</ArchiveLabel>
            <h2 className="mt-3 display text-4xl">Be among the first archivists.</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              We're opening Stuttgart Archive to a first group of owners, collectors, and sellers who care about
              doing this right. Founding members get early access, a say in the roadmap, and recognition on the
              cars they document.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {["Early access to every tool", "Founding-member badge on your profile", "Direct line to shape the product"].map((t) => (
                <li key={t} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-oxblood" /> {t}</li>
              ))}
            </ul>
          </div>
          <Card className="shadow-archive-lg">
            <CardContent className="p-7">
              <ArchiveLabel>Request access</ArchiveLabel>
              <p className="mt-2 text-sm text-muted-foreground">Free to join. No card required.</p>
              <div className="mt-5"><WaitlistForm /></div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ---------------- FINAL CTA ---------------- */}
      <section>
        <div className="container py-24 text-center">
          <Archive className="mx-auto h-8 w-8 text-oxblood" />
          <h2 className="mx-auto mt-6 max-w-2xl display text-4xl md:text-5xl">Every Porsche has a story worth preserving.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">Start your archive today — it's free, and it's yours.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Button href="/signup" variant="accent" size="lg">Start your archive</Button>
            <Button href="/demo" variant="outline" size="lg">Explore the demo</Button>
          </div>
        </div>
      </section>
    </>
  );
}

function FeaturePillars() {
  const pillars = [
    { id: "garage", icon: Archive, label: "Digital Garage", title: "A private garage for every car you own, watch, or chase.", body: "Add vehicles with full specs, ownership status, photo galleries, completeness scores, and service & modification timelines — public or private, your call.", points: ["Service & modification timelines", "Completeness & readiness scores", "Public/private per field"] },
    { id: "vault", icon: FileText, label: "Paperwork Vault", title: "Every receipt, organized and understood.", body: "Upload service records, titles, window stickers, PPIs, and more. The Document Agent extracts dates, mileage, vendors, and services — then you confirm.", points: ["PDF, image, and document upload", "Automatic field extraction", "Private documents stay private"] },
    { id: "seller", icon: ShieldCheck, label: "Seller Tools", title: "A buyer-ready presentation, honestly assembled.", body: "Generate a seller packet PDF, listing copy, buyer FAQ, photo checklist, and a secure shareable page — with unsupported claims flagged before you publish.", points: ["Seller packet PDF", "Listing & FAQ drafts", "Privacy check before sharing"] },
    { id: "buyer", icon: Search, label: "Buyer Tools", title: "Verify before you buy.", body: "Build a watchlist, compare cars side by side, and run a due-diligence checklist that flags missing high-impact records and the questions to ask.", points: ["Watchlist & comparisons", "Due-diligence checklists", "Verified vs. unverified claims"] },
    { id: "auction", icon: Gavel, label: "Auction Prep", title: "Auction-grade, independent of any platform.", body: "Generate auction-style drafts, photo and video checklists, seller Q&A prep, and a claim verification report — so your listing is thorough and honest.", points: ["Auction-style listing drafts", "Photo & video checklists", "Comment-response prep"] },
    { id: "marketing", icon: Megaphone, label: "Marketing Kit", title: "Drafts you approve — never auto-posted.", body: "Instagram captions, reels, story sequences, hashtags, and ad briefs, all generated from your real material. Nothing publishes without your say-so.", points: ["Instagram & reel drafts", "Ad brief generator", "Human approval required"] },
  ];

  return (
    <section className="border-b border-border">
      <div className="container py-20">
        <ArchiveLabel>What's inside</ArchiveLabel>
        <h2 className="mt-3 display text-4xl">Seven tools. One coherent archive.</h2>
        <div className="mt-12 space-y-16">
          {pillars.map((p, i) => (
            <div key={p.id} id={p.id} className={`grid items-center gap-10 lg:grid-cols-2 ${i % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}>
              <div>
                <div className="flex items-center gap-2 text-oxblood"><p.icon className="h-5 w-5" /><ArchiveLabel className="text-oxblood">{p.label}</ArchiveLabel></div>
                <h3 className="mt-3 font-serif text-3xl">{p.title}</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">{p.body}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {p.points.map((pt) => <li key={pt} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-oxblood" /> {pt}</li>)}
                </ul>
              </div>
              <Card className="bg-card/60">
                <CardContent className="p-7">
                  <div className="flex items-center justify-between"><ArchiveLabel>{p.label}</ArchiveLabel><Camera className="h-4 w-4 text-muted-foreground" /></div>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-2 gap-4">
                    {p.points.map((pt, j) => (
                      <div key={pt} className="rounded-md border border-border bg-background/50 p-4">
                        <div className="archive-label">Detail {j + 1}</div>
                        <div className="mt-1 font-serif text-sm">{pt}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQ = [
  { q: "Is Stuttgart Archive affiliated with Porsche?", a: "No. Stuttgart Archive is an independent platform and is not affiliated with, endorsed by, or connected to Porsche AG, Porsche Cars North America, the Porsche Museum, any official archive, or any auction platform. Porsche and model names are used descriptively only." },
  { q: "Is it really free?", a: "Yes. The core product is free — up to 3 vehicles, a digital garage, basic timelines, a basic public page, buyer checklists, and limited AI summaries. Paid plans add capacity and advanced tools, but the free product is genuinely useful on its own." },
  { q: "Does the AI make up facts about my car?", a: "Never. The AI uses only the data you enter, upload, or connect. Every output is labeled with its source and confidence, and unsupported claims are rewritten into honest, grounded wording." },
  { q: "Who can see my vehicles and documents?", a: "Only you, until you decide otherwise. Vehicles are private by default, the full VIN is hidden by default, and documents can stay private permanently. Public pages show only the fields you approve." },
  { q: "Will it post to Instagram or launch ads for me?", a: "No. Marketing content and ad briefs are drafts. Nothing is posted, sent, or spent without your explicit approval." },
  { q: "Can I sell or prepare an auction listing?", a: "Yes. Seller and Auction tools generate packets, listing drafts, checklists, and Q&A prep from your real records — independent of any auction platform, and with claims verified before you publish." },
];
