import type { Agent, AgentResult } from "./types";

interface QaInput {
  area?: string;
}

interface Bug {
  area: string;
  severity: "low" | "medium" | "high";
  description: string;
  reproSteps: string[];
  suggestedFix: string;
  retestStatus: "open" | "fixed" | "verified";
}

interface QaOutput {
  testPlan: string[];
  bugs: Bug[];
  privacyChecks: string[];
}

/** A standing test plan + known-risk checklist for the MVP. */
export const qaAgent: Agent<QaInput, QaOutput> = {
  type: "qa",
  description: "Produces test plans and a standing bug/risk checklist across key flows.",
  canHaveExternalSideEffect: false,
  async run(): Promise<AgentResult<QaOutput>> {
    const bugs: Bug[] = [
      { area: "Payments", severity: "medium", description: "Verify Stripe webhook grants entitlements with real keys.", reproSteps: ["Set Stripe test keys", "Complete checkout", "Check entitlements table"], suggestedFix: "Confirm webhook secret + event handling.", retestStatus: "open" },
      { area: "Email", severity: "low", description: "Confirm Resend sends once a domain is verified.", reproSteps: ["Set RESEND_API_KEY", "Trigger welcome email"], suggestedFix: "Verify DNS + from-domain.", retestStatus: "open" },
      { area: "Privacy", severity: "high", description: "Ensure public pages never expose private documents or full VIN by default.", reproSteps: ["Publish a page", "Inspect output"], suggestedFix: "Run Privacy Guard before publish.", retestStatus: "open" },
    ];
    return {
      ok: true,
      agentType: "qa",
      output: {
        testPlan: ["Sign up + onboarding per mode", "Create vehicle + upload doc", "Generate seller packet", "Publish public page (approval gate)", "Stripe test checkout", "Mobile layout pass", "AI outputs are source-labeled"],
        bugs,
        privacyChecks: ["No full VIN on public page by default", "Private docs excluded from packet/public", "Org-level isolation holds under RLS", "AI receives only scoped data"],
      },
      confidence: 0.75,
      sources: [],
      assumptions: ["Standing checklist; pair with manual + automated testing."],
      missingData: [],
      nextActions: ["Run the test plan before launch and mark each bug retested."],
      riskFlags: bugs.filter((b) => b.severity === "high").map((b) => ({ severity: "high" as const, category: "privacy" as const, message: b.description })),
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
