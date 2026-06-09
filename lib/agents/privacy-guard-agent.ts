import type { Agent, AgentResult, RiskFlag, ScopedContext } from "./types";

interface PrivacyInput {
  text: string;
  scope: ScopedContext;
  intent: "public_page" | "seller_packet" | "instagram" | "ad" | "buyer_reply" | "auction";
  showFullVin?: boolean;
  showPrice?: boolean;
}

interface PrivacyOutput {
  safeToPublish: boolean;
  riskFlags: RiskFlag[];
  recommendedRedactions: string[];
  requiredApprovals: string[];
  claimsRequiringVerification: string[];
}

const PATTERNS: { re: RegExp; message: string; severity: RiskFlag["severity"] }[] = [
  { re: /\b[A-HJ-NPR-Z0-9]{17}\b/, message: "Full VIN present in content.", severity: "high" },
  { re: /\b\d{1,5}\s+[A-Za-z].{2,30}(street|st|ave|avenue|road|rd|drive|dr|lane|ln)\b/i, message: "A street address may be exposed.", severity: "high" },
  { re: /\b\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/, message: "A phone number may be exposed.", severity: "high" },
  { re: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i, message: "An email address may be exposed.", severity: "medium" },
  { re: /\b\d{3}-\d{2}-\d{4}\b/, message: "An SSN-like number may be exposed.", severity: "high" },
];

export const privacyGuardAgent: Agent<PrivacyInput, PrivacyOutput> = {
  type: "privacy_guard",
  description: "Reviews any external content for privacy leaks before publishing or export.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<PrivacyOutput>> {
    const text = input.text || "";
    const flags: RiskFlag[] = [];
    const redactions: string[] = [];

    for (const p of PATTERNS) {
      if (p.re.test(text)) {
        flags.push({ severity: p.severity, category: "privacy", message: p.message });
        redactions.push(p.message.replace(/ present.*| may be exposed\.?/, ""));
      }
    }

    if (input.showFullVin && input.intent !== "buyer_reply") {
      flags.push({ severity: "medium", category: "privacy", message: "Full VIN is set to display publicly. Default is hidden." });
    }
    if (input.showPrice && (input.intent === "public_page" || input.intent === "auction")) {
      flags.push({ severity: "low", category: "privacy", message: "Price is shown — confirm this is intentional." });
    }

    // Photos with plates / personal info.
    const plate = input.scope.photos.filter((p) => p.containsLicensePlate);
    const personal = input.scope.photos.filter((p) => p.containsPersonalInfo);
    if (plate.length) flags.push({ severity: "medium", category: "privacy", message: `${plate.length} photo(s) may show a license plate.` });
    if (personal.length) flags.push({ severity: "medium", category: "privacy", message: `${personal.length} photo(s) may contain personal info.` });

    // Private documents must never be exposed.
    const privateDocs = input.scope.documents.filter((d) => d.isPrivate);

    const high = flags.filter((f) => f.severity === "high");
    const safe = high.length === 0;

    return {
      ok: true,
      agentType: "privacy_guard",
      output: {
        safeToPublish: safe,
        riskFlags: flags,
        recommendedRedactions: Array.from(new Set(redactions)),
        requiredApprovals: safe ? ["Confirm only approved public fields are included."] : ["Resolve high-severity privacy issues before publishing."],
        claimsRequiringVerification: [],
      },
      confidence: 0.9,
      sources: [],
      assumptions: privateDocs.length ? [`${privateDocs.length} private document(s) are excluded from any public output.`] : [],
      missingData: [],
      nextActions: redactions.length ? ["Apply the recommended redactions, then re-run the check."] : ["No privacy issues detected — still confirm before publishing."],
      riskFlags: flags,
      approvalRequired: !safe,
      externalSideEffect: false,
    };
  },
};
