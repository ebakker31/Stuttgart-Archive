import type { Metadata } from "next";
import { ArchiveLabel, Separator } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { LOGO_CONCEPTS, MarkSeal } from "@/components/brand/logo-concepts";

export const metadata: Metadata = { title: "Brand & logo concepts" };

const FONT_OPTIONS = [
  { name: "EB Garamond", stack: "'EB Garamond', Georgia, serif", note: "Recommended — classic Garamond, old-money, low curve, very readable.", rec: true },
  { name: "Libre Caslon Display", stack: "'Libre Caslon Display', Georgia, serif", note: "Caslon — the quintessential establishment serif. A touch more presence.", rec: false },
  { name: "Cormorant Garamond", stack: "'Cormorant Garamond', Georgia, serif", note: "More elegant and high-contrast — refined, slightly more flair.", rec: false },
  { name: "Newsreader (current)", stack: "'Newsreader', Georgia, serif", note: "Editorial and warm — the current face, for comparison.", rec: false },
];

export default function BrandPage() {
  return (
    <div className="container py-16">
      <ArchiveLabel>Brand studio</ArchiveLabel>
      <h1 className="mt-4 display text-5xl">Wordmark & logo concepts.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        A few directions for the “Stuttgart Archive” wordmark and an original mark. All artwork is bespoke — no
        Porsche crest, logo, or typography is used. Tell me which font and mark you like and I'll set it everywhere.
      </p>

      {/* Font options */}
      <section className="mt-14">
        <ArchiveLabel>Wordmark — font options</ArchiveLabel>
        <div className="mt-6 space-y-4">
          {FONT_OPTIONS.map((f) => (
            <Card key={f.name} className={f.rec ? "border-oxblood/40" : ""}>
              <CardContent className="flex flex-col gap-4 p-7 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div style={{ fontFamily: f.stack }} className="text-4xl leading-none md:text-5xl">Stuttgart Archive</div>
                  <div style={{ fontFamily: f.stack, letterSpacing: "0.18em" }} className="mt-3 text-sm uppercase text-muted-foreground">Stuttgart Archive</div>
                </div>
                <div className="shrink-0 md:w-64 md:text-right">
                  <div className="flex items-center gap-2 md:justify-end">
                    <span className="archive-label">{f.name}</span>
                    {f.rec && <span className="rounded-sm bg-oxblood/10 px-2 py-0.5 text-[0.65rem] font-medium text-oxblood">Recommended</span>}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{f.note}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-16" />

      {/* Logo concepts */}
      <section>
        <ArchiveLabel>Logo concepts</ArchiveLabel>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LOGO_CONCEPTS.map(({ id, name, note, Mark }) => (
            <Card key={id}>
              <CardContent className="p-0">
                {/* light */}
                <div className="flex h-40 items-center justify-center bg-parchment-card text-graphite">
                  <Mark className="h-16 w-auto" />
                </div>
                {/* dark */}
                <div className="flex h-24 items-center justify-center gap-3 bg-graphite text-parchment">
                  <Mark className="h-10 w-auto" />
                  <span style={{ fontFamily: "var(--font-wordmark)" }} className="text-xl">Stuttgart Archive</span>
                </div>
                <div className="p-5">
                  <div className="font-serif text-lg">{name}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{note}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-16" />

      {/* Full lockups */}
      <section>
        <ArchiveLabel>Primary lockup — recommended pairing</ArchiveLabel>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card><CardContent className="flex items-center gap-4 bg-parchment-card p-10 text-graphite">
            <MarkSeal className="h-16 w-16" />
            <div>
              <div style={{ fontFamily: "'EB Garamond', serif", fontWeight: 500 }} className="text-3xl leading-none">Stuttgart Archive</div>
              <div className="archive-label mt-1.5">Est. for the marque</div>
            </div>
          </CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 bg-graphite p-10 text-parchment">
            <MarkSeal className="h-16 w-16" />
            <div>
              <div style={{ fontFamily: "'EB Garamond', serif", fontWeight: 500 }} className="text-3xl leading-none">Stuttgart Archive</div>
              <div className="archive-label mt-1.5 text-silver">Est. for the marque</div>
            </div>
          </CardContent></Card>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Want a different pairing? Tell me the mark (e.g. “Archive Seal”) + font (e.g. “EB Garamond”) and I'll
          apply it to the header, footer, emails, and PDFs.
        </p>
      </section>
    </div>
  );
}
