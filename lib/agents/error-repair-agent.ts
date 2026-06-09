import type { Agent, AgentResult } from "./types";

interface ErrorInput {
  errorText: string;
  context?: string;
}

interface ErrorOutput {
  likelyCause: string;
  suggestedPatch: string;
  rootCauseNotes: string;
  safetyCheck: string;
}

export const errorRepairAgent: Agent<ErrorInput, ErrorOutput> = {
  type: "error_repair",
  description: "Diagnoses build/type/runtime errors and proposes root-cause fixes.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<ErrorOutput>> {
    const e = input.errorText.toLowerCase();
    let cause = "Unclassified error — inspect the stack trace.";
    let patch = "Reproduce locally, then fix the failing module.";
    if (/cannot find module|module not found/.test(e)) { cause = "Missing dependency or wrong import path."; patch = "Install the package or fix the import path (check @/ alias)."; }
    else if (/type .* is not assignable|ts\d{4}/.test(e)) { cause = "TypeScript type mismatch."; patch = "Align the value with the declared type; avoid `any` unless justified."; }
    else if (/hydration|server.*client/.test(e)) { cause = "Server/client component mismatch."; patch = "Add 'use client' or move data fetching to the server boundary."; }
    else if (/supabase|fetch failed|econnrefused/.test(e)) { cause = "External service unreachable."; patch = "Ensure mock-mode fallback path is used when keys are absent."; }

    return {
      ok: true,
      agentType: "error_repair",
      output: {
        likelyCause: cause,
        suggestedPatch: patch,
        rootCauseNotes: "Fix the underlying cause; do not delete features or weaken privacy/security checks to pass.",
        safetyCheck: "Confirm the fix keeps RLS, privacy guards, and approval gates intact.",
      },
      confidence: 0.6,
      sources: [],
      assumptions: ["Heuristic diagnosis from the error text."],
      missingData: input.context ? [] : ["Surrounding code context"],
      nextActions: [patch, "Re-run typecheck + build."],
      riskFlags: [{ severity: "low", category: "quality", message: "Never weaken security to silence an error." }],
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
