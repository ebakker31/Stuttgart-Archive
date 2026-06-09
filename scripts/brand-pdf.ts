import { readFileSync, writeFileSync } from "node:fs";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

/**
 * One-off brand concept PDF generator (phone-friendly). Embeds the actual
 * candidate serifs so the wordmark options render truthfully, and draws the
 * six original logo marks as vectors. Output: /tmp/stuttgart-archive-brand.pdf
 *
 * This script is intentionally excluded from `tsconfig.json` typecheck and is
 * NOT part of the app build. It uses dev-only font packages — install them
 * before running:
 *
 *   npm i -D @pdf-lib/fontkit @expo-google-fonts/eb-garamond \
 *     @expo-google-fonts/cormorant-garamond @expo-google-fonts/libre-caslon-display
 *   npx tsx scripts/brand-pdf.ts
 */
// @ts-nocheck

const OX = rgb(0.55, 0.17, 0.17);
const INK = rgb(0.15, 0.16, 0.18);
const PARCH = rgb(0.957, 0.945, 0.918);
const PARCH_CARD = rgb(0.984, 0.976, 0.957);
const MUTED = rgb(0.45, 0.45, 0.42);
const SILVER = rgb(0.79, 0.8, 0.82);
const LINE = rgb(0.84, 0.82, 0.76);

const PW = 612, PH = 792, M = 54;
const ROOT = "node_modules/@expo-google-fonts";
const ttf = (p: string) => readFileSync(`${ROOT}/${p}`);

async function main() {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  const ebg = await doc.embedFont(ttf("eb-garamond/500Medium/EBGaramond_500Medium.ttf"));
  const ebgSemi = await doc.embedFont(ttf("eb-garamond/600SemiBold/EBGaramond_600SemiBold.ttf"));
  const caslon = await doc.embedFont(ttf("libre-caslon-display/400Regular/LibreCaslonDisplay_400Regular.ttf"));
  const cormorant = await doc.embedFont(ttf("cormorant-garamond/500Medium/CormorantGaramond_500Medium.ttf"));
  const times = await doc.embedFont(StandardFonts.TimesRoman);
  const sans = await doc.embedFont(StandardFonts.Helvetica);
  const sansBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const center = (p: PDFPage, s: string, font: PDFFont, size: number, y: number, color = INK, tracking = 0) => {
    const w = trackedWidth(s, font, size, tracking);
    drawTracked(p, s, (PW - w) / 2, y, font, size, color, tracking);
  };
  const label = (p: PDFPage, s: string, x: number, y: number, color = OX) =>
    drawTracked(p, s.toUpperCase(), x, y, sansBold, 8, color, 2.4);

  // ---------------- Page 1 — Cover ----------------
  {
    const p = doc.addPage([PW, PH]);
    p.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: PARCH });
    // top + bottom rules
    p.drawLine({ start: { x: M, y: PH - 120 }, end: { x: PW - M, y: PH - 120 }, thickness: 1, color: LINE });
    label(p, "Brand & Logo Concepts", M, PH - 150);
    center(p, "Stuttgart Archive", ebg, 52, PH / 2 + 30, INK);
    center(p, "Preserve the story behind the machine.", cormorant, 18, PH / 2 - 4, MUTED);
    // accent seal
    drawSeal(p, PW / 2, PH / 2 - 110, 30, ebgSemi);
    center(p, "EST. FOR THE MARQUE", sans, 8, 150, MUTED, 3);
    p.drawLine({ start: { x: M, y: 120 }, end: { x: PW - M, y: 120 }, thickness: 1, color: LINE });
    center(p, "An independent archive — not affiliated with Porsche AG. Original artwork; no crest or official type used.", sans, 7.5, 96, MUTED);
  }

  // ---------------- Page 2 — Font options ----------------
  {
    const p = doc.addPage([PW, PH]);
    p.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: PARCH });
    label(p, "Wordmark — font options", M, PH - 70);
    let y = PH - 110;
    const opts: [string, PDFFont, string, boolean][] = [
      ["EB Garamond", ebg, "Classic Garamond. Old-money, low curve, very readable.", true],
      ["Libre Caslon Display", caslon, "Caslon — the establishment serif. A touch more presence.", false],
      ["Cormorant Garamond", cormorant, "More elegant, higher contrast. Refined with a little flair.", false],
      ["Times Roman", times, "The literal 'Times New Roman' reference, for comparison.", false],
    ];
    for (const [name, font, note, rec] of opts) {
      if (rec) {
        p.drawRectangle({ x: M - 14, y: y - 34, width: PW - 2 * (M - 14), height: 78, color: PARCH_CARD, borderColor: OX, borderWidth: 0.8 });
        drawTracked(p, "RECOMMENDED", PW - M - 78, y + 30, sansBold, 7, OX, 1.5);
      }
      p.drawText("Stuttgart Archive", { x: M, y, size: 30, font, color: INK });
      drawTracked(p, "STUTTGART ARCHIVE", M, y - 20, font, 11, MUTED, 3);
      drawTracked(p, name, M, y - 40, sansBold, 8, OX, 1.5);
      p.drawText(note, { x: M + 150, y: y - 40, size: 9, font: sans, color: MUTED });
      y -= 92;
    }
  }

  // ---------------- Page 3 & 4 — Logo concepts ----------------
  const concepts: { name: string; note: string; draw: (p: PDFPage, cx: number, cy: number, s: number) => void }[] = [
    { name: "Archive Seal", note: "Museum-stamp ring + SA monogram. Authoritative.", draw: (p, cx, cy, s) => drawSeal(p, cx, cy, s, ebgSemi) },
    { name: "Monogram Block", note: "Serif SA embossed in graphite. Confident.", draw: (p, cx, cy, s) => drawMonogram(p, cx, cy, s, ebgSemi) },
    { name: "Index Card", note: "Filed card with a timeline notch. Literal.", draw: (p, cx, cy, s) => drawIndexCard(p, cx, cy, s) },
    { name: "Editorial Masthead", note: "Double-rule masthead. Quiet restraint.", draw: (p, cx, cy, s) => drawMasthead(p, cx, cy, s, sansBold) },
    { name: "S Emblem", note: "A single serif S in a fine ring. Timeless.", draw: (p, cx, cy, s) => drawSEmblem(p, cx, cy, s, ebgSemi) },
    { name: "Archive Tab", note: "Folder tab + precision scale. Engineering feel.", draw: (p, cx, cy, s) => drawTab(p, cx, cy, s) },
  ];

  {
    const p = doc.addPage([PW, PH]);
    p.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: PARCH });
    label(p, "Logo concepts", M, PH - 70);
    const cols = 2, cardW = (PW - 2 * M - 24) / cols, cardH = 200;
    concepts.forEach((c, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = M + col * (cardW + 24);
      const y = PH - 110 - row * (cardH + 20);
      p.drawRectangle({ x, y: y - cardH, width: cardW, height: cardH, color: PARCH_CARD, borderColor: LINE, borderWidth: 0.8 });
      // mark area
      c.draw(p, x + cardW / 2, y - 70, 34);
      // dark swatch with lockup
      p.drawRectangle({ x: x + 12, y: y - cardH + 56, width: cardW - 24, height: 46, color: INK });
      c.draw(p, x + 38, y - cardH + 79, 14);
      p.drawText("Stuttgart Archive", { x: x + 62, y: y - cardH + 73, size: 13, font: ebg, color: PARCH });
      drawTracked(p, c.name, x + 14, y - cardH + 38, ebgSemi as PDFFont, 13, INK, 0);
      p.drawText(c.note, { x: x + 14, y: y - cardH + 22, size: 7.5, font: sans, color: MUTED });
    });
  }

  // ---------------- Page 5 — Lockups + palette ----------------
  {
    const p = doc.addPage([PW, PH]);
    p.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: PARCH });
    label(p, "Primary lockup — recommended", M, PH - 70);
    // light lockup
    p.drawRectangle({ x: M, y: PH - 220, width: PW - 2 * M, height: 110, color: PARCH_CARD, borderColor: LINE, borderWidth: 0.8 });
    drawSeal(p, M + 70, PH - 165, 34, ebgSemi);
    p.drawText("Stuttgart Archive", { x: M + 120, y: PH - 168, size: 30, font: ebg, color: INK });
    drawTracked(p, "EST. FOR THE MARQUE", M + 122, PH - 188, sans, 7.5, MUTED, 2.5);
    // dark lockup
    p.drawRectangle({ x: M, y: PH - 350, width: PW - 2 * M, height: 110, color: INK });
    drawSeal(p, M + 70, PH - 295, 34, ebgSemi, PARCH);
    p.drawText("Stuttgart Archive", { x: M + 120, y: PH - 298, size: 30, font: ebg, color: PARCH });
    drawTracked(p, "EST. FOR THE MARQUE", M + 122, PH - 318, sans, 7.5, SILVER, 2.5);

    // palette
    label(p, "Palette", M, PH - 400);
    const swatches: [string, ReturnType<typeof rgb>][] = [
      ["Parchment", PARCH], ["Graphite", INK], ["Oxblood", OX], ["Silver", SILVER],
    ];
    swatches.forEach(([name, col], i) => {
      const x = M + i * 130;
      p.drawRectangle({ x, y: PH - 470, width: 110, height: 50, color: col, borderColor: LINE, borderWidth: 0.6 });
      drawTracked(p, name, x, PH - 488, sansBold, 8, INK, 1.2);
    });

    drawTracked(p, "Reply with your picks — e.g. 'EB Garamond + Archive Seal' — and it goes everywhere.", M, 90, sans as PDFFont, 9, MUTED, 0);
  }

  const bytes = await doc.save();
  writeFileSync("/tmp/stuttgart-archive-brand.pdf", Buffer.from(bytes));
  console.log("ok", bytes.byteLength);
}

/* ---------- mark drawers (pdf-lib primitives) ---------- */
function drawSeal(p: PDFPage, cx: number, cy: number, s: number, font: PDFFont, ink = INK) {
  p.drawCircle({ x: cx, y: cy, size: s, borderColor: ink, borderWidth: 1.4 });
  p.drawCircle({ x: cx, y: cy, size: s * 0.82, borderColor: ink, borderWidth: 0.6, opacity: 0 });
  const n = 44;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r1 = s * 0.9, r2 = s * 0.96;
    p.drawLine({ start: { x: cx + Math.cos(a) * r1, y: cy + Math.sin(a) * r1 }, end: { x: cx + Math.cos(a) * r2, y: cy + Math.sin(a) * r2 }, thickness: 0.5, color: ink, opacity: 0.5 });
  }
  const t = "SA", size = s * 0.82;
  const w = font.widthOfTextAtSize(t, size);
  p.drawText(t, { x: cx - w / 2, y: cy - size * 0.34, size, font, color: ink });
  p.drawCircle({ x: cx, y: cy + s * 0.78, size: 1.4, color: OX });
}
function drawMonogram(p: PDFPage, cx: number, cy: number, s: number, font: PDFFont) {
  p.drawRectangle({ x: cx - s, y: cy - s, width: 2 * s, height: 2 * s, color: INK, borderColor: INK, borderWidth: 0 });
  const t = "SA", size = s * 1.05, w = font.widthOfTextAtSize(t, size);
  p.drawText(t, { x: cx - w / 2, y: cy - size * 0.28, size, font, color: PARCH });
  p.drawLine({ start: { x: cx - s * 0.5, y: cy - s * 0.6 }, end: { x: cx + s * 0.5, y: cy - s * 0.6 }, thickness: 1.4, color: OX });
}
function drawIndexCard(p: PDFPage, cx: number, cy: number, s: number) {
  const w = s * 1.5, h = s * 1.2;
  p.drawRectangle({ x: cx - w / 2, y: cy - h / 2, width: w, height: h, borderColor: INK, borderWidth: 2 });
  p.drawLine({ start: { x: cx - w / 2, y: cy + h / 2 - h * 0.28 }, end: { x: cx + w / 2, y: cy + h / 2 - h * 0.28 }, thickness: 2, color: INK });
  p.drawLine({ start: { x: cx, y: cy + h / 2 - h * 0.28 }, end: { x: cx, y: cy - h / 2 }, thickness: 2, color: OX });
  p.drawCircle({ x: cx, y: cy - h * 0.05, size: 2.4, color: OX });
}
function drawMasthead(p: PDFPage, cx: number, cy: number, s: number, font: PDFFont) {
  const w = s * 2.6;
  p.drawLine({ start: { x: cx - w, y: cy + s * 0.5 }, end: { x: cx + w, y: cy + s * 0.5 }, thickness: 1.4, color: INK });
  p.drawLine({ start: { x: cx - w, y: cy + s * 0.36 }, end: { x: cx + w, y: cy + s * 0.36 }, thickness: 0.7, color: INK });
  drawTracked(p, "S · A", cx - font.widthOfTextAtSize("S · A", s * 0.5) / 2 - s * 0.3, cy - s * 0.1, font, s * 0.5, INK, 4);
  p.drawLine({ start: { x: cx - w, y: cy - s * 0.5 }, end: { x: cx + w, y: cy - s * 0.5 }, thickness: 0.7, color: INK });
  p.drawLine({ start: { x: cx - w, y: cy - s * 0.64 }, end: { x: cx + w, y: cy - s * 0.64 }, thickness: 1.4, color: INK });
  p.drawCircle({ x: cx, y: cy - s * 0.57, size: 1.2, color: OX });
}
function drawSEmblem(p: PDFPage, cx: number, cy: number, s: number, font: PDFFont) {
  p.drawCircle({ x: cx, y: cy, size: s, borderColor: INK, borderWidth: 1.8 });
  const size = s * 1.25, w = font.widthOfTextAtSize("S", size);
  p.drawText("S", { x: cx - w / 2, y: cy - size * 0.34, size, font, color: INK });
  p.drawLine({ start: { x: cx, y: cy + s * 0.86 }, end: { x: cx, y: cy + s * 1.08 }, thickness: 1.6, color: OX });
}
function drawTab(p: PDFPage, cx: number, cy: number, s: number) {
  const w = s * 1.5, h = s * 1.1;
  const left = cx - w / 2, bottom = cy - h / 2;
  // body
  p.drawRectangle({ x: left, y: bottom, width: w, height: h * 0.82, borderColor: INK, borderWidth: 2 });
  // tab
  p.drawRectangle({ x: left + w * 0.4, y: bottom + h * 0.82 - 1, width: w * 0.45, height: h * 0.22, borderColor: INK, borderWidth: 2 });
  // ticks
  for (let i = 0; i < 7; i++) {
    const x = left + w * 0.16 + i * (w * 0.66 / 6);
    const tall = i === 3;
    p.drawLine({ start: { x, y: bottom + 6 }, end: { x, y: bottom + (tall ? h * 0.5 : h * 0.3) }, thickness: tall ? 2 : 1, color: tall ? OX : INK });
  }
}

/* ---------- letter-spaced text ---------- */
function trackedWidth(s: string, font: PDFFont, size: number, tracking: number) {
  return [...s].reduce((w, ch) => w + font.widthOfTextAtSize(ch, size) + tracking, 0) - tracking;
}
function drawTracked(p: PDFPage, s: string, x: number, y: number, font: PDFFont, size: number, color: ReturnType<typeof rgb>, tracking: number) {
  if (!tracking) { p.drawText(s, { x, y, size, font, color }); return; }
  let cx = x;
  for (const ch of s) {
    p.drawText(ch, { x: cx, y, size, font, color });
    cx += font.widthOfTextAtSize(ch, size) + tracking;
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
