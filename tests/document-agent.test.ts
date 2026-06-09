import { describe, it, expect } from "vitest";
import { documentAgent } from "@/lib/agents/document-agent";
import { CTX } from "./_fixtures";

describe("Document Agent — deterministic extraction, no fabrication", () => {
  it("extracts date, mileage, cost, and VIN from an invoice's text", async () => {
    const res = await documentAgent.run(
      {
        documentId: "d1",
        fileName: "porsche-dealer-invoice.pdf",
        text: "Service Invoice 03/14/2023. Odometer: 18,450 miles. Oil change and brake inspection. Total: $1,250.00. VIN WP0AB2A99JS123456",
      },
      CTX
    );
    expect(res.output.date).toBe("2023-03-14");
    expect(res.output.mileage).toBe(18450);
    expect(res.output.cost).toBe(1250);
    expect(res.output.vinReference).toBe("WP0AB2A99JS123456");
    expect(res.output.servicesPerformed).toContain("oil change");
  });

  it("reports missing fields instead of inventing them, and requires review", async () => {
    const res = await documentAgent.run(
      { documentId: "d2", fileName: "note.txt", text: "A short note with no structured data." },
      CTX
    );
    expect(res.output.date).toBeNull();
    expect(res.output.mileage).toBeNull();
    expect(res.output.unclearFields.length).toBeGreaterThan(0);
    expect(res.output.humanReviewRequired).toBe(true);
  });

  it("flags documents that appear to contain personal information", async () => {
    const res = await documentAgent.run(
      { documentId: "d3", text: "Owner SSN 123-45-6789 with signature on file." },
      CTX
    );
    expect(res.output.containsPrivateInfo).toBe(true);
    expect(res.riskFlags.some((f) => f.category === "privacy")).toBe(true);
  });
});
