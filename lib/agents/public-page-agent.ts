import type { Agent, AgentResult, ScopedContext } from "./types";

interface PublicPageInput {
  scope: ScopedContext;
  showFullVin?: boolean;
}

interface PublicPageOutput {
  suggestedSections: string[];
  publicSafeSummary: string;
  missingPublicFields: string[];
  hiddenPrivateFields: string[];
  claimsNeedingReview: string[];
  publishReadiness: number;
}

export const publicPageAgent: Agent<PublicPageInput, PublicPageOutput> = {
  type: "public_page",
  description: "Assembles a clean public vehicle page from approved data. Publishing requires approval.",
  canHaveExternalSideEffect: true,
  async run(input): Promise<AgentResult<PublicPageOutput>> {
    const { scope } = input;
    const v = scope.vehicle;
    const name = `${v?.year ?? ""} ${v?.make ?? "Porsche"} ${v?.model ?? ""} ${v?.trim ?? ""}`.trim();

    const sections = ["Overview", "Specifications", "Service Highlights", "Modifications", "Photo Gallery", "Known Flaws", "Ownership Story"]
      .filter((s) => {
        if (s === "Service Highlights") return scope.serviceEvents.length;
        if (s === "Modifications") return scope.modifications.length;
        if (s === "Ownership Story") return v?.ownershipStory;
        if (s === "Known Flaws") return v?.knownFlaws;
        return true;
      });

    const missing: string[] = [];
    if (!v?.mileage) missing.push("Mileage");
    if (scope.photos.filter((p) => p.approvedForPublic).length < 3) missing.push("At least 3 public-approved photos");
    if (!v?.knownFlaws) missing.push("Known-flaws note");

    const readiness = Math.max(0, 100 - missing.length * 20);

    return {
      ok: true,
      agentType: "public_page",
      output: {
        suggestedSections: sections,
        publicSafeSummary: `${name}${v?.mileage ? ` · ${v.mileage.toLocaleString()} mi` : ""}. Documented in Stuttgart Archive by its owner.`,
        missingPublicFields: missing,
        hiddenPrivateFields: ["VIN (hidden by default)", "Documents marked private", "Exact location", "Price (unless enabled)"],
        claimsNeedingReview: ["Run Claim Verification on any descriptive claims before publishing."],
        publishReadiness: readiness,
      },
      confidence: 0.8,
      sources: [],
      assumptions: ["Only fields you approve for public view are included; VIN hidden unless you opt in."],
      missingData: missing,
      nextActions: ["Approve public fields", "Run Privacy Guard", "Confirm publish (required — never automatic)"],
      riskFlags: input.showFullVin ? [{ severity: "medium", category: "privacy", message: "Full VIN is set to show publicly." }] : [],
      approvalRequired: true,
      externalSideEffect: false,
    };
  },
};
