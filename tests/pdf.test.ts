import { describe, it, expect } from "vitest";
import { generateSellerPacketPdf } from "@/lib/pdf/seller-packet";
import { FOOTER_DISCLAIMER } from "@/lib/brand";

describe("Seller packet PDF generation", () => {
  it("produces a valid, non-trivial PDF document", async () => {
    const bytes = await generateSellerPacketPdf({
      title: "2018 Porsche 911 Carrera S",
      subtitle: "Coupe · GT Silver over Black · 18,450 mi",
      archiveNotes: "A clean 991.2 documented from new.",
      specs: [["Year", "2018"], ["Transmission", "PDK"], ["Mileage", "18,450 mi"]],
      sections: [
        { title: "Vehicle Summary", body: "Two owners, complete records." },
        { title: "Known Flaws", body: "Minor stone chips on the front bumper, disclosed." },
      ],
      serviceEvents: [
        { date: "2020-10-03", summary: "Major service", vendor: "Authorized dealer", mileage: 9800, cost: 980 },
      ],
      disclaimer: FOOTER_DISCLAIMER,
      isDemo: true,
    });

    // Valid PDFs begin with "%PDF-"
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
    expect(bytes.byteLength).toBeGreaterThan(1000);
  });

  it("paginates long content without throwing", async () => {
    const longBody = "Documented service entry. ".repeat(80);
    const bytes = await generateSellerPacketPdf({
      title: "Long Packet",
      subtitle: "pagination check",
      specs: Array.from({ length: 12 }, (_, i) => [`Field ${i}`, `Value ${i}`] as [string, string]),
      sections: Array.from({ length: 8 }, (_, i) => ({ title: `Section ${i}`, body: longBody })),
      serviceEvents: Array.from({ length: 30 }, (_, i) => ({ date: `2020-01-${(i % 28) + 1}`, summary: `Service ${i}`, vendor: "Specialist", mileage: 1000 * i, cost: 500 })),
      disclaimer: FOOTER_DISCLAIMER,
    });
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
  });
});
