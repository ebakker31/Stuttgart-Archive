import type { Metadata } from "next";
import { ArchiveLabel } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Book a demo" };

export default function BookDemoPage() {
  return (
    <div className="container max-w-2xl py-20">
      <ArchiveLabel>Concierge & dealer</ArchiveLabel>
      <h1 className="mt-4 display text-5xl">Book a walkthrough.</h1>
      <p className="mt-5 text-lg text-muted-foreground">
        For dealers, brokers, collectors, and concierge clients. Tell us about your inventory or collection and
        we'll show you how Stuttgart Archive fits.
      </p>

      {/* In MVP this form does not send automatically; it routes to concierge@ for human review. */}
      <form className="mt-10 space-y-5" action={`mailto:${BRAND.emails.concierge}`} method="post" encType="text/plain">
        <div className="grid gap-5 sm:grid-cols-2">
          <div><Label htmlFor="name">Name</Label><Input id="name" name="name" className="mt-1.5" required /></div>
          <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" className="mt-1.5" required /></div>
        </div>
        <div><Label htmlFor="org">Dealership / collection</Label><Input id="org" name="org" className="mt-1.5" /></div>
        <div><Label htmlFor="msg">What would you like to do?</Label><Textarea id="msg" name="msg" className="mt-1.5" rows={4} /></div>
        <Button type="submit" variant="accent" size="lg">Request a walkthrough</Button>
        <p className="text-xs text-muted-foreground">We review every request by hand and reply from {BRAND.emails.concierge}. No automated outreach.</p>
      </form>
    </div>
  );
}
