"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

/** Buyer lead capture. Posts to /api/leads; no automatic reply is ever sent. */
export function LeadForm({ vehicle, publicPageId }: { vehicle: string; publicPageId?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle,
          publicPageId,
          name: fd.get("name"),
          email: fd.get("email"),
          message: fd.get("message"),
          consent: fd.get("consent") === "on",
        }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="rounded-md border border-emerald-600/30 bg-emerald-600/5 p-3 text-sm text-emerald-700 dark:text-emerald-400">Sent. The seller will review and respond directly.</p>;
  }

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <div><Label htmlFor="lead-name">Name</Label><Input id="lead-name" name="name" required className="mt-1" /></div>
      <div><Label htmlFor="lead-email">Email</Label><Input id="lead-email" name="email" type="email" required className="mt-1" /></div>
      <div><Label htmlFor="lead-msg">Message</Label><Textarea id="lead-msg" name="message" rows={3} className="mt-1" placeholder="I'd like to learn more about the service history…" /></div>
      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <input type="checkbox" name="consent" className="mt-0.5" /> I agree to be contacted about this vehicle.
      </label>
      <Button type="submit" variant="accent" className="w-full" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send inquiry"}
      </Button>
      {status === "error" && <p className="text-xs text-oxblood">Something went wrong. Please try again.</p>}
    </form>
  );
}
