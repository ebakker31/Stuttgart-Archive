import type { Metadata } from "next";
import { ArchiveLabel } from "@/components/ui/misc";
import { FOOTER_DISCLAIMER } from "@/lib/brand";

export const metadata: Metadata = { title: "Terms & Disclaimer" };

const POINTS = [
  "Stuttgart Archive is an independent platform. It is not affiliated with, endorsed by, sponsored by, or connected to Porsche AG or Porsche Cars North America.",
  "It is not affiliated with the Porsche Museum or the official Porsche company archive.",
  "It is not affiliated with the Stuttgart City Archive.",
  "It is not affiliated with Bring a Trailer, Cars & Bids, PCARMARKET, Meta, Instagram, Apple, Stripe, or any auction or listing platform.",
  "Stuttgart Archive does not certify authenticity.",
  "Stuttgart Archive does not guarantee the condition of any vehicle.",
  "Stuttgart Archive does not verify title history unless supported by user-provided documents or future verified integrations explicitly connected by the user.",
  "Stuttgart Archive does not provide legal, tax, financial, insurance, or professional appraisal advice.",
  "AI-generated outputs are drafts and should be reviewed before publishing or relying on them.",
  "Users are solely responsible for the accuracy of any claims they choose to publish.",
];

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-20">
      <ArchiveLabel>Legal</ArchiveLabel>
      <h1 className="mt-4 display text-5xl">Terms & Disclaimer</h1>

      <ol className="mt-10 space-y-5">
        {POINTS.map((p, i) => (
          <li key={i} className="flex gap-4">
            <span className="archive-label mt-1 shrink-0">{String(i + 1).padStart(2, "0")}</span>
            <p className="text-muted-foreground">{p}</p>
          </li>
        ))}
      </ol>

      <div className="mt-14 rounded-md border border-oxblood/25 bg-oxblood/5 p-6">
        <ArchiveLabel className="text-oxblood">Required disclaimer</ArchiveLabel>
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">{FOOTER_DISCLAIMER}</p>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        This page is a plain-language summary for an MVP and is not a substitute for full terms of service or
        a privacy policy reviewed by qualified counsel before public launch.
      </p>
    </div>
  );
}
