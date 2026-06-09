import type { Agent, AgentResult, SourceReference } from "./types";

/**
 * Document Agent — extracts structured fields from an uploaded document's text.
 *
 * Uses deterministic pattern extraction (dates, mileage, money, VIN, vendor) so
 * it NEVER fabricates. Anything not found in the text is reported as missing
 * and flagged for human review. The optional LLM only paraphrases the summary.
 */

interface DocumentInput {
  documentId: string;
  fileName?: string;
  text: string;
  vehicleVin?: string | null;
}

interface DocumentOutput {
  documentType: string;
  date: string | null;
  mileage: number | null;
  vendor: string | null;
  servicesPerformed: string[];
  partsInstalled: string[];
  cost: number | null;
  vinReference: string | null;
  vehicleMatchConfidence: number;
  supportsPublicClaims: boolean;
  containsPrivateInfo: boolean;
  suggestedTimelineEvent: { date: string | null; mileage: number | null; category: string; summary: string } | null;
  unclearFields: string[];
  humanReviewRequired: boolean;
}

const TYPE_HINTS: [RegExp, string][] = [
  [/invoice|repair order|\bRO\b/i, "Dealer/shop invoice"],
  [/service|maintenance|oil change/i, "Service record"],
  [/title|certificate of title/i, "Title document"],
  [/registration/i, "Registration record"],
  [/window sticker|monroney/i, "Window sticker"],
  [/insurance/i, "Insurance document"],
  [/inspection|ppi|pre-purchase/i, "Inspection/PPI report"],
  [/bill of sale/i, "Bill of sale"],
  [/tire/i, "Tire record"],
];

function classify(text: string, fileName?: string): string {
  const hay = `${fileName ?? ""} ${text}`;
  for (const [re, label] of TYPE_HINTS) if (re.test(hay)) return label;
  return "Other vehicle document";
}

function extractDate(text: string): string | null {
  const m =
    text.match(/\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\b/) ||
    text.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}\b/i);
  if (!m) return null;
  const d = new Date(m[0]);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

function extractMileage(text: string): number | null {
  const m = text.match(/([\d,]{3,7})\s*(?:mi|miles|mileage|odometer)/i) || text.match(/(?:mileage|odometer)[:\s]*([\d,]{3,7})/i);
  if (!m) return null;
  const n = parseInt(m[1].replace(/,/g, ""), 10);
  return Number.isFinite(n) && n < 1_000_000 ? n : null;
}

function extractCost(text: string): number | null {
  const matches = [...text.matchAll(/\$\s?([\d,]+(?:\.\d{2})?)/g)].map((m) => parseFloat(m[1].replace(/,/g, "")));
  if (!matches.length) return null;
  return Math.max(...matches); // invoice total is typically the largest figure
}

function extractVin(text: string): string | null {
  const m = text.match(/\b([A-HJ-NPR-Z0-9]{17})\b/);
  return m ? m[1] : null;
}

function extractVendor(text: string, fileName?: string): string | null {
  const m = text.match(/(?:from|vendor|shop|dealer|performed by)[:\s]+([A-Z][A-Za-z0-9 &'.-]{2,40})/);
  if (m) return m[1].trim();
  if (fileName) {
    const base = fileName.replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ");
    if (/[A-Za-z]/.test(base)) return base.slice(0, 40);
  }
  return null;
}

export const documentAgent: Agent<DocumentInput, DocumentOutput> = {
  type: "document",
  description: "Extracts structured vehicle information from an uploaded document.",
  canHaveExternalSideEffect: false,
  async run(input): Promise<AgentResult<DocumentOutput>> {
    const text = input.text || "";
    const documentType = classify(text, input.fileName);
    const date = extractDate(text);
    const mileage = extractMileage(text);
    const cost = extractCost(text);
    const vin = extractVin(text);
    const vendor = extractVendor(text, input.fileName);

    const services = [...text.matchAll(/\b(oil change|brake|tire|alignment|coolant|spark plug|clutch|ims|rms|transmission|suspension|detail|ppf|ceramic|major service|annual service)\b/gi)]
      .map((m) => m[1].toLowerCase());
    const servicesPerformed = Array.from(new Set(services));

    const parts = [...text.matchAll(/part(?:\s*(?:no|number|#))?[:\s]+([A-Z0-9.\- ]{4,20})/gi)].map((m) => m[1].trim());
    const partsInstalled = Array.from(new Set(parts));

    const vinMatch =
      input.vehicleVin && vin ? (input.vehicleVin === vin ? 1 : 0.2) : vin ? 0.5 : 0.3;

    const containsPrivateInfo = /\b(\d{3}-\d{2}-\d{4}|name|address|phone|signature|account)\b/i.test(text);

    const unclear: string[] = [];
    if (!date) unclear.push("date");
    if (!mileage) unclear.push("mileage");
    if (!vendor) unclear.push("vendor");
    if (!cost) unclear.push("cost");

    const confidence = Math.max(0.2, 1 - unclear.length * 0.18);

    const suggested = date || mileage || servicesPerformed.length
      ? {
          date,
          mileage,
          category: servicesPerformed[0] ?? "service",
          summary: `${documentType}${vendor ? ` — ${vendor}` : ""}${servicesPerformed.length ? `: ${servicesPerformed.join(", ")}` : ""}`,
        }
      : null;

    const sources: SourceReference[] = [
      { field: "documentType", value: documentType, kind: "document_supported", documentId: input.documentId },
      { field: "date", value: date, kind: date ? "document_supported" : "missing", documentId: input.documentId },
      { field: "mileage", value: mileage, kind: mileage ? "document_supported" : "missing", documentId: input.documentId },
      { field: "cost", value: cost, kind: cost ? "document_supported" : "missing", documentId: input.documentId },
      { field: "vin", value: vin, kind: vin ? "document_supported" : "missing", documentId: input.documentId },
    ];

    return {
      ok: true,
      agentType: "document",
      output: {
        documentType,
        date,
        mileage,
        vendor,
        servicesPerformed,
        partsInstalled,
        cost,
        vinReference: vin,
        vehicleMatchConfidence: vinMatch,
        supportsPublicClaims: Boolean(date && (mileage || servicesPerformed.length)),
        containsPrivateInfo,
        suggestedTimelineEvent: suggested,
        unclearFields: unclear,
        humanReviewRequired: confidence < 0.7 || vinMatch < 0.6,
      },
      confidence,
      sources,
      assumptions: vendor && !/(?:from|vendor|shop)/i.test(text) ? ["Vendor inferred from file name."] : [],
      missingData: unclear,
      nextActions: unclear.length ? [`Confirm: ${unclear.join(", ")}`, "Verify or correct extracted fields"] : ["Confirm the extracted fields"],
      riskFlags: [
        ...(containsPrivateInfo ? [{ severity: "medium" as const, category: "privacy" as const, message: "Document appears to contain personal information; keep private." }] : []),
        ...(vinMatch < 0.6 ? [{ severity: "medium" as const, category: "data" as const, message: "VIN did not clearly match this vehicle." }] : []),
      ],
      approvalRequired: false,
      externalSideEffect: false,
    };
  },
};
