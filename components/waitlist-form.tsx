"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

/** Founding-members email capture. Posts to /api/waitlist. */
export function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, interest }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="flex items-center gap-2 rounded-md border border-emerald-600/30 bg-emerald-600/5 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="h-4 w-4" /> You're on the list. We'll be in touch as a founding member.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={compact ? "flex flex-col gap-2 sm:flex-row" : "space-y-3"}>
      <input
        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="flex h-11 w-full rounded-md border border-input bg-background/70 px-3.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {!compact && (
        <select value={interest} onChange={(e) => setInterest(e.target.value)} className="flex h-11 w-full rounded-md border border-input bg-background/70 px-3 text-sm">
          <option value="">What brings you here?</option>
          <option>I own a Porsche</option>
          <option>I collect Porsches</option>
          <option>I want to buy</option>
          <option>I want to sell</option>
          <option>I'm a dealer or broker</option>
        </select>
      )}
      <Button type="submit" variant="accent" className="h-11 shrink-0" disabled={status === "sending"}>
        {status === "sending" ? "Joining…" : "Request access"}
      </Button>
      {status === "error" && <p className="text-xs text-oxblood">Something went wrong — try again.</p>}
    </form>
  );
}
