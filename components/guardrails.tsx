import { ShieldCheck, Info } from "lucide-react";
import { GUARDRAILS, DEMO_DISCLAIMER } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** The standard four-part guardrail notice shown on any page producing external content. */
export function GuardrailNotice({ items, className }: { items?: (keyof typeof GUARDRAILS)[]; className?: string }) {
  const show = items ?? (["draftOnly", "reviewClaims", "approvedFields", "factsOnly"] as (keyof typeof GUARDRAILS)[]);
  return (
    <div className={cn("rounded-md border border-oxblood/25 bg-oxblood/5 p-3.5", className)}>
      <div className="flex items-center gap-2 text-oxblood">
        <ShieldCheck className="h-4 w-4" />
        <span className="archive-label text-oxblood">Safeguards</span>
      </div>
      <ul className="mt-2 space-y-1 text-sm text-foreground/80">
        {show.map((k) => (
          <li key={k} className="flex gap-2">
            <span className="text-oxblood">•</span> {GUARDRAILS[k]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DemoNotice({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 rounded-md border border-oxblood/30 bg-oxblood/5 px-3 py-2 text-sm text-oxblood", className)}>
      <Info className="h-4 w-4" /> {DEMO_DISCLAIMER}
    </div>
  );
}
