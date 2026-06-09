import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

/**
 * Seller packet PDF generator (pure-JS via pdf-lib — serverless/Vercel-safe).
 * Produces a clean, archival-styled multi-page document from grounded data only.
 * No external claims are added; the disclaimer appears on every page footer.
 */

export interface SellerPacketPdfInput {
  title: string;
  subtitle: string;
  archiveNotes?: string;
  specs: [string, string][];
  sections: { title: string; body: string }[];
  serviceEvents: { date: string; summary: string; vendor: string; mileage?: number | null; cost?: number | null }[];
  disclaimer: string;
  isDemo?: boolean;
}

const OXBLOOD = rgb(0.55, 0.17, 0.17);
const GRAPHITE = rgb(0.15, 0.16, 0.18);
const MUTED = rgb(0.42, 0.42, 0.4);
const LINE = rgb(0.84, 0.82, 0.76);

const PAGE = { w: 612, h: 792 }; // US Letter
const MARGIN = 56;
const CONTENT_W = PAGE.w - MARGIN * 2;
const FOOTER_Y = 54;

export async function generateSellerPacketPdf(input: SellerPacketPdfInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(sanitize(input.title));
  doc.setSubject("Seller packet - Stuttgart Archive");
  doc.setProducer("Stuttgart Archive");

  const serif = await doc.embedFont(StandardFonts.TimesRoman);
  const serifIt = await doc.embedFont(StandardFonts.TimesRomanItalic);
  const sans = await doc.embedFont(StandardFonts.Helvetica);
  const sansBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const ctx = new Layout(doc, { serif, serifIt, sans, sansBold }, input.disclaimer);

  // --- Cover header ---
  ctx.label("STUTTGART ARCHIVE - SELLER PACKET");
  ctx.rule();
  ctx.gap(10);
  ctx.heading(input.title, 24);
  ctx.text(input.subtitle, sans, 11, MUTED);
  if (input.isDemo) {
    ctx.gap(6);
    ctx.text("Sample demo data, not a real vehicle listing.", sansBold, 9, OXBLOOD);
  }
  ctx.gap(18);

  // --- Archive notes ---
  if (input.archiveNotes) {
    ctx.label("ARCHIVE NOTES");
    ctx.gap(6);
    ctx.text(input.archiveNotes, serifIt, 12, GRAPHITE, 1.4);
    ctx.gap(16);
  }

  // --- Specifications ---
  ctx.label("SPECIFICATIONS");
  ctx.gap(8);
  ctx.specGrid(input.specs);
  ctx.gap(16);

  // --- Sections ---
  for (const s of input.sections) {
    ctx.ensure(70);
    ctx.label(s.title.toUpperCase());
    ctx.gap(6);
    ctx.text(s.body || "-", sans, 10.5, GRAPHITE, 1.45);
    ctx.gap(14);
  }

  // --- Service timeline ---
  if (input.serviceEvents.length) {
    ctx.ensure(60);
    ctx.label("SERVICE HISTORY");
    ctx.gap(8);
    for (const e of input.serviceEvents) {
      ctx.ensure(28);
      const head = `${e.date || "Undated"} - ${e.summary}`;
      const meta = [e.vendor, e.mileage ? `${e.mileage.toLocaleString()} mi` : null, e.cost ? `$${e.cost.toLocaleString()}` : null].filter(Boolean).join("  -  ");
      ctx.bulletText(head, meta);
    }
  }

  ctx.finalizeFooters();
  return doc.save();
}

/** Minimal flowing-layout engine over pdf-lib pages. All text is sanitized. */
class Layout {
  private page!: PDFPage;
  private y = 0;
  private pages: PDFPage[] = [];

  constructor(
    private doc: PDFDocument,
    private fonts: { serif: PDFFont; serifIt: PDFFont; sans: PDFFont; sansBold: PDFFont },
    private disclaimer: string
  ) {
    this.newPage();
  }

  private newPage() {
    this.page = this.doc.addPage([PAGE.w, PAGE.h]);
    this.pages.push(this.page);
    this.y = PAGE.h - MARGIN;
  }

  private draw(text: string, x: number, y: number, font: PDFFont, size: number, color = GRAPHITE) {
    this.page.drawText(sanitize(text), { x, y, size, font, color });
  }

  ensure(space: number) {
    if (this.y - space < FOOTER_Y + 20) this.newPage();
  }

  gap(n: number) {
    this.y -= n;
  }

  rule() {
    this.page.drawRectangle({ x: MARGIN, y: this.y - 6, width: CONTENT_W, height: 1, color: LINE });
    this.y -= 12;
  }

  label(text: string) {
    this.ensure(18);
    this.draw(spaced(text), MARGIN, this.y, this.fonts.sansBold, 8, OXBLOOD);
    this.y -= 12;
  }

  heading(text: string, size: number) {
    this.ensure(size + 8);
    this.draw(text, MARGIN, this.y - size, this.fonts.serif, size, GRAPHITE);
    this.y -= size + 6;
  }

  text(body: string, font: PDFFont, size: number, color = GRAPHITE, lineHeight = 1.35) {
    const lines = wrap(body, font, size, CONTENT_W);
    const step = size * lineHeight;
    for (const ln of lines) {
      this.ensure(step);
      this.draw(ln, MARGIN, this.y - size, font, size, color);
      this.y -= step;
    }
  }

  bulletText(head: string, meta: string) {
    const size = 10.5;
    this.draw("-", MARGIN, this.y - size, this.fonts.sans, size, OXBLOOD);
    const lines = wrap(head, this.fonts.sans, size, CONTENT_W - 14);
    for (const ln of lines) {
      this.ensure(size * 1.3);
      this.draw(ln, MARGIN + 14, this.y - size, this.fonts.sans, size, GRAPHITE);
      this.y -= size * 1.3;
    }
    if (meta) {
      this.draw(meta, MARGIN + 14, this.y - 9, this.fonts.sans, 9, MUTED);
      this.y -= 16;
    } else {
      this.y -= 4;
    }
  }

  specGrid(specs: [string, string][]) {
    const cols = 3;
    const colW = CONTENT_W / cols;
    const rowH = 34;
    for (let i = 0; i < specs.length; i += cols) {
      this.ensure(rowH);
      const rowY = this.y;
      for (let c = 0; c < cols; c++) {
        const item = specs[i + c];
        if (!item) continue;
        const x = MARGIN + c * colW;
        this.draw(spaced(item[0].toUpperCase()), x, rowY - 9, this.fonts.sansBold, 7, MUTED);
        this.draw(ellipsize(item[1] || "-", this.fonts.serif, 12, colW - 12), x, rowY - 24, this.fonts.serif, 12, GRAPHITE);
      }
      this.y -= rowH;
    }
  }

  finalizeFooters() {
    const total = this.pages.length;
    this.pages.forEach((p, i) => {
      p.drawRectangle({ x: MARGIN, y: FOOTER_Y + 14, width: CONTENT_W, height: 0.7, color: LINE });
      const lines = wrap(this.disclaimer, this.fonts.sans, 6.5, CONTENT_W);
      let yy = FOOTER_Y + 4;
      for (const ln of lines.slice(0, 3)) {
        p.drawText(sanitize(ln), { x: MARGIN, y: yy, size: 6.5, font: this.fonts.sans, color: MUTED });
        yy -= 8;
      }
      p.drawText(`Page ${i + 1} of ${total}`, { x: PAGE.w - MARGIN - 60, y: FOOTER_Y + 18, size: 7, font: this.fonts.sans, color: MUTED });
    });
  }
}

function spaced(s: string) {
  // Letter-spacing for small-caps labels (pdf-lib has no native tracking).
  return sanitize(s).split("").join(" ");
}

function wrap(text: string, font: PDFFont, size: number, maxW: number): string[] {
  const out: string[] = [];
  for (const para of sanitize(text).split("\n")) {
    const words = para.split(/\s+/).filter(Boolean);
    if (!words.length) { out.push(""); continue; }
    let line = "";
    for (const w of words) {
      const trial = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(trial, size) > maxW && line) {
        out.push(line);
        line = w;
      } else {
        line = trial;
      }
    }
    if (line) out.push(line);
  }
  return out;
}

function ellipsize(text: string, font: PDFFont, size: number, maxW: number): string {
  const t = sanitize(text);
  if (font.widthOfTextAtSize(t, size) <= maxW) return t;
  let s = t;
  while (s.length > 1 && font.widthOfTextAtSize(s + "...", size) > maxW) s = s.slice(0, -1);
  return s + "...";
}

/**
 * pdf-lib's standard fonts use a limited encoding that can't render many unicode
 * punctuation marks. Normalize common ones to ASCII, then strip anything left so
 * the standard fonts never throw an encoding error.
 */
function sanitize(s: string): string {
  return (s || "")
    .replace(/[–—]/g, "-")
    .replace(/[‘’‚]/g, "'")
    .replace(/[“”„]/g, '"')
    .replace(/…/g, "...")
    .replace(/ /g, " ")
    .replace(/[^\x20-\x7E\n]/g, "");
}
