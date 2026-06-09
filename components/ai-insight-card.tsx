import { Card, CardContent } from "@/components/ui/card";
import { ArchiveLabel } from "@/components/ui/misc";
import { SourceReferenceBadge } from "@/components/badges";
import { Sparkles, AlertTriangle } from "lucide-react";
import type { AgentResult } from "@/lib/agents/types";

/** Renders an agent result with its source labels, confidence, and risk flags. */
export function AIInsightCard({ title, result, children }: { title: string; result: AgentResult<any>; children?: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-oxblood" /><ArchiveLabel>{title}</ArchiveLabel></div>
          <span className="text-xs text-muted-foreground">Confidence {Math.round(result.confidence * 100)}%{result.mocked ? " · local" : ""}</span>
        </div>

        <div className="mt-4">{children}</div>

        {result.sources.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {Array.from(new Set(result.sources.map((s) => s.kind))).map((k) => <SourceReferenceBadge key={k} kind={k} />)}
          </div>
        )}

        {result.missingData.length > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">Missing: {result.missingData.slice(0, 4).join(", ")}</p>
        )}

        {result.riskFlags.length > 0 && (
          <ul className="mt-3 space-y-1">
            {result.riskFlags.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-oxblood">
                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" /> {f.message}{f.saferWording ? ` → “${f.saferWording}”` : ""}
              </li>
            ))}
          </ul>
        )}

        {result.approvalRequired && (
          <p className="mt-3 rounded-sm bg-muted px-2 py-1 text-xs text-muted-foreground">Draft only — your approval is required before anything leaves the platform.</p>
        )}
      </CardContent>
    </Card>
  );
}
