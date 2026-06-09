import type { Metadata } from "next";
import { ArchiveLabel } from "@/components/ui/misc";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = { title: "Privacy" };

const PRINCIPLES = [
  ["Private by default", "Every vehicle and document you add is private until you explicitly choose to publish it."],
  ["You control what becomes public", "Public vehicle pages show only the fields you approve. The full VIN is hidden by default."],
  ["AI uses only your data", "Our assistants access only the data you enter, upload, or connect — scoped to one vehicle at a time, and logged."],
  ["No automatic posting", "We never post to Instagram, send messages, or contact buyers/sellers on your behalf without your approval."],
  ["No automatic ads", "Ad briefs are drafts. No ad is ever launched and no money is ever spent without your explicit action."],
  ["Delete anytime", "You can delete documents, vehicles, and your account whenever you wish."],
  ["Export your data", "You can export your archive at any time — it's yours."],
  ["Documents can stay private", "A document you mark private is never included in a packet, public page, or AI output for sharing."],
  ["Scoped & logged AI access", "Each agent receives only the minimum necessary data, and every access is written to an audit log."],
  ["No training on your data", "We do not use your data to train models unless you explicitly opt in."],
];

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-20">
      <ArchiveLabel>Trust</ArchiveLabel>
      <h1 className="mt-4 display text-5xl">Privacy is the foundation.</h1>
      <p className="mt-5 text-lg text-muted-foreground">
        Stuttgart Archive is a privacy-first platform. The system only accesses data you explicitly upload,
        enter, connect, or give permission to use. Here is exactly how we treat it.
      </p>

      <div className="mt-12 space-y-6">
        {PRINCIPLES.map(([t, d]) => (
          <div key={t} className="flex gap-4">
            <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-oxblood" />
            <div>
              <h2 className="font-serif text-xl">{t}</h2>
              <p className="mt-1 text-muted-foreground">{d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-md border border-border bg-card/50 p-6">
        <h2 className="font-serif text-xl">Organization isolation & access control</h2>
        <p className="mt-2 text-muted-foreground">
          Data is isolated per organization with row-level security in the database, and access is governed by
          role-based permissions (owner, admin, editor, viewer). One customer's data is never used to generate
          content for another.
        </p>
      </div>
    </div>
  );
}
