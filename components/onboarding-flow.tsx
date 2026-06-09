"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArchiveLabel } from "@/components/ui/misc";
import { USER_MODES, type UserMode } from "@/lib/brand";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { Check } from "lucide-react";

/** The "What are you here to do?" onboarding. Persists mode when auth is live. */
export function OnboardingFlow() {
  const router = useRouter();
  const [selected, setSelected] = useState<UserMode | null>(null);
  const [saving, setSaving] = useState(false);

  async function onContinue() {
    if (!selected) return;
    setSaving(true);
    const supabase = getBrowserSupabase();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({ selected_mode: selected }).eq("id", user.id);
      }
    }
    router.push(`/app?mode=${selected}`);
  }

  return (
    <div className="w-full max-w-3xl">
      <ArchiveLabel>Welcome to the archive</ArchiveLabel>
      <h1 className="mt-3 display text-4xl">What are you here to do?</h1>
      <p className="mt-3 text-muted-foreground">We'll tailor your dashboard, tools, and first steps to fit.</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {USER_MODES.map((m) => {
          const active = selected === m.id;
          return (
            <button key={m.id} onClick={() => setSelected(m.id)} className="text-left">
              <Card className={active ? "border-oxblood ring-1 ring-oxblood" : "transition-colors hover:border-oxblood/40"}>
                <CardContent className="flex items-start justify-between gap-3 p-5">
                  <div>
                    <div className="font-serif text-lg">{m.question}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{m.description}</div>
                  </div>
                  {active && <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-oxblood text-white"><Check className="h-3 w-3" /></span>}
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center gap-3">
        <Button variant="accent" size="lg" disabled={!selected || saving} onClick={onContinue}>
          {saving ? "Setting up…" : "Enter my archive"}
        </Button>
        <Button variant="ghost" href="/app">Skip for now</Button>
      </div>
    </div>
  );
}
