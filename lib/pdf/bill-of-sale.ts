import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";

/**
 * Vehicle Bill of Sale generator (pure-JS via pdf-lib). Produces a clean,
 * single-page bill of sale from the parties' details. This is a convenience
 * template — Stuttgart Archive is not a party to the sale and this is not legal
 * advice; users should confirm their state's requirements.
 */

export interface BillOfSaleInput {
  sellerName: string;
  sellerAddress?: string;
  buyerName: string;
  buyerAddress?: string;
  year?: number | string;
  make?: string;
  model?: string;
  vin?: string;
  mileage?: number | string;
  color?: string;
  salePrice?: number | string;
  saleDate?: string;
  location?: string; // city, state
  asIs?: boolean;
}

const OX = rgb(0.55, 0.17, 0.17);
const INK = rgb(0.15, 0.16, 0.18);
const MUTED = rgb(0.42, 0.42, 0.4);
const LINE = rgb(0.8, 0.78, 0.72);

function clean(s: unknown): string {
  return String(s ?? "")
    .replace(/[–—]/g, "-").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/…/g, "...")
    .replace(/[^\x20-\x7E]/g, "");
}

export async function generateBillOfSalePdf(input: BillOfSaleInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle("Vehicle Bill of Sale");
  const page = doc.addPage([612, 792]);
  const serif = await doc.embedFont(StandardFonts.TimesRoman);
  const serifBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const sans = await doc.embedFont(StandardFonts.Helvetica);
  const sansBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const M = 56;
  const W = 612 - M * 2;
  let y = 792 - M;

  const text = (s: string, x: number, font: PDFFont, size: number, color = INK) =>
    page.drawText(clean(s), { x, y, size, font, color });

  // Header — generous spacing between the brand label and the document title.
  page.drawText("STUTTGART ARCHIVE".split("").join(" "), { x: M, y, size: 8, font: sansBold, color: OX });
  y -= 42;
  text("Vehicle Bill of Sale", M, serif, 26);
  y -= 24;
  page.drawRectangle({ x: M, y, width: W, height: 1, color: LINE });
  y -= 32;

  // Two-column parties
  const colW = W / 2;
  const label = (s: string, x: number) => page.drawText(clean(s).split("").join(" "), { x, y, size: 7, font: sansBold, color: MUTED });
  label("SELLER", M); label("BUYER", M + colW);
  y -= 14;
  text(input.sellerName || "________________", M, serifBold, 12);
  page.drawText(clean(input.buyerName || "________________"), { x: M + colW, y, size: 12, font: serifBold, color: INK });
  y -= 16;
  text(input.sellerAddress || "", M, sans, 9, MUTED);
  page.drawText(clean(input.buyerAddress || ""), { x: M + colW, y, size: 9, font: sans, color: MUTED });
  y -= 28;

  // Vehicle block
  label("VEHICLE", M);
  y -= 16;
  const rows: [string, string][] = [
    ["Year / Make / Model", `${input.year ?? ""} ${input.make ?? "Porsche"} ${input.model ?? ""}`.trim()],
    ["VIN", String(input.vin ?? "")],
    ["Odometer (miles)", String(input.mileage ?? "")],
    ["Color", String(input.color ?? "")],
  ];
  for (const [k, v] of rows) {
    page.drawText(clean(k), { x: M, y, size: 10, font: sans, color: MUTED });
    page.drawText(clean(v || "_______________________"), { x: M + 160, y, size: 11, font: serif, color: INK });
    y -= 20;
  }
  y -= 6;
  page.drawRectangle({ x: M, y, width: W, height: 0.6, color: LINE });
  y -= 24;

  // Terms
  const price = typeof input.salePrice === "number" ? `$${input.salePrice.toLocaleString()}` : String(input.salePrice ?? "");
  label("SALE", M);
  y -= 16;
  page.drawText(clean("Sale price"), { x: M, y, size: 10, font: sans, color: MUTED });
  page.drawText(clean(price || "$______________"), { x: M + 160, y, size: 13, font: serifBold, color: OX });
  y -= 20;
  page.drawText(clean("Date of sale"), { x: M, y, size: 10, font: sans, color: MUTED });
  page.drawText(clean(input.saleDate || new Date().toISOString().slice(0, 10)), { x: M + 160, y, size: 11, font: serif, color: INK });
  y -= 20;
  page.drawText(clean("Location"), { x: M, y, size: 10, font: sans, color: MUTED });
  page.drawText(clean(input.location || "_______________________"), { x: M + 160, y, size: 11, font: serif, color: INK });
  y -= 28;

  // Clauses
  const clauses = [
    `The Seller affirms they are the legal owner of the vehicle and have the right to sell it.`,
    input.asIs !== false
      ? `The vehicle is sold AS-IS, WHERE-IS, without warranty of any kind unless stated in writing.`
      : `Any warranty terms are as separately agreed in writing between the parties.`,
    `The Seller certifies the odometer reading stated above to the best of their knowledge.`,
    `Receipt of the sale price is acknowledged by the Seller upon completion.`,
  ];
  label("TERMS", M);
  y -= 16;
  for (const c of clauses) {
    const lines = wrap(clean(c), sans, 9.5, W - 14);
    page.drawText("-", { x: M, y, size: 9.5, font: sans, color: OX });
    for (const ln of lines) { page.drawText(ln, { x: M + 12, y, size: 9.5, font: sans, color: INK }); y -= 14; }
    y -= 4;
  }
  y -= 16;

  // Signatures
  const sigW = (W - 24) / 2;
  for (const [labelText, x] of [["Seller signature", M], ["Buyer signature", M + sigW + 24]] as [string, number][]) {
    page.drawRectangle({ x, y, width: sigW, height: 0.8, color: INK });
    page.drawText(clean(labelText), { x, y: y - 12, size: 8, font: sans, color: MUTED });
    page.drawText("Date: ____________", { x: x + sigW - 110, y: y - 12, size: 8, font: sans, color: MUTED });
  }
  y -= 50;

  // Footer disclaimer
  page.drawRectangle({ x: M, y, width: W, height: 0.6, color: LINE });
  y -= 12;
  const disc = "This template is provided for convenience by Stuttgart Archive, which is not a party to this transaction and provides no legal advice. Confirm your state's bill-of-sale, title, and odometer-disclosure requirements before completing a sale.";
  for (const ln of wrap(disc, sans, 7, W)) { page.drawText(ln, { x: M, y, size: 7, font: sans, color: MUTED }); y -= 9; }

  return doc.save();
}

function wrap(text: string, font: PDFFont, size: number, maxW: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (line && font.widthOfTextAtSize(t, size) > maxW) { lines.push(line); line = w; }
    else line = t;
  }
  if (line) lines.push(line);
  return lines;
}
