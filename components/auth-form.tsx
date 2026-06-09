"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { Info } from "lucide-react";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = getBrowserSupabase();
  const demoMode = !supabase;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (demoMode) {
      // No auth provider configured — continue into the demo experience.
      router.push(mode === "signup" ? "/onboarding" : "/app");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase!.auth.signUp({
          email, password, options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        router.push("/onboarding");
      } else {
        const { error } = await supabase!.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/app");
      }
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="display text-3xl">{mode === "signup" ? "Start your archive" : "Welcome back"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "signup" ? "Free to begin. Three vehicles, no card required." : "Sign in to your archive."}
      </p>

      {demoMode && (
        <div className="mt-5 flex items-start gap-2 rounded-md border border-oxblood/25 bg-oxblood/5 p-3 text-sm text-oxblood">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Demo mode — no authentication provider is configured. Continue to explore the sample archive.</span>
        </div>
      )}

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        {mode === "signup" && (
          <div><Label htmlFor="name">Full name</Label><Input id="name" className="mt-1.5" value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
        )}
        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} required={!demoMode} /></div>
        <div><Label htmlFor="password">Password</Label><Input id="password" type="password" className="mt-1.5" value={password} onChange={(e) => setPassword(e.target.value)} required={!demoMode} /></div>
        {error && <p className="text-sm text-oxblood">{error}</p>}
        <Button type="submit" variant="accent" className="w-full" disabled={loading}>
          {loading ? "…" : demoMode ? "Continue to demo" : mode === "signup" ? "Create account" : "Sign in"}
        </Button>
      </form>

      <p className="mt-5 text-sm text-muted-foreground">
        {mode === "signup" ? (
          <>Already have an archive? <Link href="/login" className="text-oxblood hover:underline">Sign in</Link></>
        ) : (
          <>New here? <Link href="/signup" className="text-oxblood hover:underline">Start your archive</Link></>
        )}
      </p>
    </div>
  );
}
