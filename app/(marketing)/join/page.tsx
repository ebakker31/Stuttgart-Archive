import type { Metadata } from "next";
import { ArchiveLabel } from "@/components/ui/misc";
import { WaitlistForm } from "@/components/waitlist-form";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Join — founding members",
  description: "Request founding-member access to Stuttgart Archive.",
};

export default function JoinPage() {
  return (
    <div className="container max-w-2xl py-20">
      <ArchiveLabel>Founding members</ArchiveLabel>
      <h1 className="mt-4 display text-5xl">Request early access.</h1>
      <p className="mt-5 text-lg text-muted-foreground">
        Stuttgart Archive is opening to a first group of Porsche owners, collectors, sellers, and dealers who
        want a serious, private home for their cars' history. Join the founding members.
      </p>

      <div className="mt-8 rounded-md border border-border bg-card/50 p-6">
        <WaitlistForm />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          ["Free to start", "Three vehicles, full digital garage, no card required."],
          ["Private by default", "You decide what's ever made public."],
          ["Built for the long haul", "Your archive is yours — export or delete anytime."],
        ].map(([t, d]) => (
          <div key={t}>
            <div className="flex items-center gap-2 text-oxblood"><CheckCircle2 className="h-4 w-4" /><span className="archive-label text-oxblood">{t}</span></div>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
