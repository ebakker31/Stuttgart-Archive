/**
 * Brand concept PDF — v2 (phone-friendly). Elegant high-contrast serif options
 * (Cormorant family + peers) and a NEW set of more typographic logo directions.
 * Output: /tmp/stuttgart-archive-brand-v2.pdf
 *
 * Excluded from tsconfig typecheck; not part of the app build. Dev-only fonts:
 *   npm i -D @pdf-lib/fontkit @expo-google-fonts/cormorant \
 *     @expo-google-fonts/cormorant-garamond @expo-google-fonts/playfair-display \
 *     @expo-google-fonts/bodoni-moda @expo-google-fonts/marcellus \
 *     @expo-google-fonts/cinzel @expo-google-fonts/italiana \
 *     @expo-google-fonts/forum @expo-google-fonts/cardo
 *   npx tsx scripts/brand-pdf.ts
 */
// @ts-nocheck
import { readFileSync, writeFileSync } from "node:fs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const OX = rgb(0.55, 0.17, 0.17);
const INK = rgb(0.15, 0.16, 0.18);
const PARCH = rgb(0.957, 0.945, 0.918);
const CARD = rgb(0.984, 0.976, 0.957);
const MUTED = rgb(0.45, 0.45, 0.42);
const SILVER = rgb(0.8, 0.81, 0.83);
const LINE = rgb(0.84, 0.82, 0.76);

const PW = 612, PH = 792, M = 54;
const R = "node_modules/@expo-google-fonts";
const f = (p) => readFileSync(`${R}/${p}.ttf`);

async function main() {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  const fonts = {
    cormorantG: await doc.embedFont(f("cormorant-garamond/600SemiBold/CormorantGaramond_600SemiBold")),
    cormorant: await doc.embedFont(f("cormorant/600SemiBold/Cormorant_600SemiBold")),
    playfair: await doc.embedFont(f("playfair-display/600SemiBold/PlayfairDisplay_600SemiBold")),
    bodoni: await doc.embedFont(f("bodoni-moda/600SemiBold/BodoniModa_600SemiBold")),
    marcellus: await doc.embedFont(f("marcellus/400Regular/Marcellus_400Regular")),
    cinzel: await doc.embedFont(f("cinzel/600SemiBold/Cinzel_600SemiBold")),
    italiana: await doc.embedFont(f("italiana/400Regular/Italiana_400Regular")),
    forum: await doc.embedFont(f("forum/400Regular/Forum_400Regular")),
    cardo: await doc.embedFont(f("cardo/400Regular/Cardo_400Regular")),
  };
  const sans = await doc.embedFont(StandardFonts.Helvetica);
  const sansBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const WM = fonts.cormorantG; // wordmark font for logo directions = your pick

  const label = (p, s, x, y, c = OX) => tracked(p, s.toUpperCase(), x, y, sansBold, 8, c, 2.4);
  const centerT = (p, s, font, size, y, c = INK, tr = 0) => tracked(p, s, (PW - tw(s, font, size, tr)) / 2, y, font, size, c, tr);

  // ---- Page 1: cover ----
  {
    const p = doc.addPage([PW, PH]); bg(p);
    p.drawLine({ start: { x: M, y: PH - 120 }, end: { x: PW - M, y: PH - 120 }, thickness: 1, color: LINE });
    label(p, "Brand & Logo Concepts — Round 2", M, PH - 150);
    centerT(p, "Stuttgart Archive", WM, 54, PH / 2 + 20, INK);
    centerT(p, "elegant serif directions & new logo ideas", fonts.italiana, 17, PH / 2 - 8, MUTED);
    p.drawLine({ start: { x: M, y: 120 }, end: { x: PW - M, y: 120 }, thickness: 1, color: LINE });
    centerT(p, "ORIGINAL ARTWORK — NO PORSCHE CREST, LOGO, OR OFFICIAL TYPE", sans, 7.5, 100, MUTED, 2);
  }

  // ---- Pages 2-3: font options ----
  const fontOpts = [
    ["Cormorant Garamond", fonts.cormorantG, "Your pick. Elegant, high-contrast, old-money.", true],
    ["Cormorant (Display)", fonts.cormorant, "Same family, more dramatic — bigger flair.", false],
    ["Playfair Display", fonts.playfair, "Classic luxury didone. Editorial and rich.", false],
    ["Bodoni Moda", fonts.bodoni, "Fashion-house didone. Sharp, high fashion.", false],
    ["Italiana", fonts.italiana, "Delicate, refined, very high contrast.", false],
    ["Marcellus", fonts.marcellus, "Calm Roman elegance. Quietly upscale.", false],
    ["Cardo", fonts.cardo, "Scholarly old-style. Bookish and timeless.", false],
    ["Forum", fonts.forum, "Roman capitals feel. Monumental.", false],
    ["Cinzel", fonts.cinzel, "Trajan-style caps. Maximum luxury.", false],
  ];
  for (let pg = 0; pg < 2; pg++) {
    const p = doc.addPage([PW, PH]); bg(p);
    label(p, pg === 0 ? "Wordmark — elegant serif options" : "Wordmark — options (cont.)", M, PH - 70);
    let y = PH - 112;
    fontOpts.slice(pg * 5, pg * 5 + 5).forEach(([name, font, note, rec]) => {
      if (rec) { p.drawRectangle({ x: M - 14, y: y - 30, width: PW - 2 * (M - 14), height: 74, color: CARD, borderColor: OX, borderWidth: 0.8 }); tracked(p, "YOUR PICK", PW - M - 60, y + 30, sansBold, 7, OX, 1.5); }
      p.drawText("Stuttgart Archive", { x: M, y, size: 30, font, color: INK });
      tracked(p, "STUTTGART ARCHIVE", M, y - 20, font, 11, MUTED, 3);
      tracked(p, name, M, y - 38, sansBold, 8, OX, 1.2);
      p.drawText(note, { x: M + 165, y: y - 38, size: 9, font: sans, color: MUTED });
      y -= 88;
    });
  }

  // ---- Pages 4-5: NEW logo directions ----
  const logos = [
    { name: "Stacked wordmark", note: "STUTTGART over ARCHIVE, hairline rule. Fashion-house lockup.", draw: drawStacked },
    { name: "Framed nameplate", note: "Wordmark in a thin frame with corner ticks. Museum object label.", draw: drawNameplate },
    { name: "SA ligature monogram", note: "Interlocked serif S + A. Standalone mark for avatars/favicon.", draw: drawLigature },
    { name: "Drop-initial lockup", note: "Oversized ornamental S leading the name. Editorial.", draw: drawDropInitial },
    { name: "Underlined masthead", note: "Centered wordmark, fine rule, oxblood diamond. Restrained.", draw: drawUnderlined },
    { name: "Oval medallion", note: "SA in a slim ellipse. Elegant alternative to a round seal.", draw: drawOval },
  ];
  for (let pg = 0; pg < 2; pg++) {
    const p = doc.addPage([PW, PH]); bg(p);
    label(p, pg === 0 ? "New logo directions" : "New logo directions (cont.)", M, PH - 70);
    const slice = logos.slice(pg * 3, pg * 3 + 3);
    let top = PH - 100;
    slice.forEach((l) => {
      const h = 196; const x = M; const w = PW - 2 * M; const y = top - h;
      p.drawRectangle({ x, y, width: w, height: h, color: CARD, borderColor: LINE, borderWidth: 0.8 });
      // light area
      l.draw(p, x + w * 0.27, y + h / 2 + 6, fonts, WM, false);
      // dark swatch
      p.drawRectangle ? null : null;
      p.drawRectangle({ x: x + w * 0.52, y: y + 16, width: w * 0.46, height: h - 32, color: INK });
      l.draw(p, x + w * 0.52 + w * 0.23, y + h / 2 + 6, fonts, WM, true);
      tracked(p, l.name, x + 16, y + 22, WM, 14, INK, 0);
      p.drawText(l.note, { x: x + 16, y: y + 8, size: 7.5, font: sans, color: MUTED });
      top -= h + 16;
    });
  }

  // ---- Page 6: recommended pairing ----
  {
    const p = doc.addPage([PW, PH]); bg(p);
    label(p, "Suggested pairing", M, PH - 70);
    centerT(p, "Cormorant Garamond + Framed Nameplate", sans, 10, PH - 96, MUTED, 1);
    p.drawRectangle({ x: M, y: PH - 250, width: PW - 2 * M, height: 120, color: CARD, borderColor: LINE, borderWidth: 0.8 });
    drawNameplate(p, PW / 2, PH - 190, fonts, WM, false, 1.25);
    p.drawRectangle({ x: M, y: PH - 390, width: PW - 2 * M, height: 120, color: INK });
    drawNameplate(p, PW / 2, PH - 330, fonts, WM, true, 1.25);
    centerT(p, "Reply with a font + a logo direction and I'll set it everywhere.", sans, 9, 110, MUTED);
  }

  const bytes = await doc.save();
  writeFileSync("/tmp/stuttgart-archive-brand-v2.pdf", Buffer.from(bytes));
  console.log("ok", bytes.byteLength);
}

/* ---------------- logo drawers (centered at cx,cy) ---------------- */
function inkFor(dark) { return dark ? PARCH : INK; }
function mutedFor(dark) { return dark ? SILVER : MUTED; }

function drawStacked(p, cx, cy, fonts, WM, dark) {
  const c = inkFor(dark);
  centerAt(p, "STUTTGART", WM, 26, cx, cy + 10, c, 6);
  p.drawLine({ start: { x: cx - 70, y: cy - 4 }, end: { x: cx + 70, y: cy - 4 }, thickness: 0.8, color: c });
  p.drawCircle({ x: cx, y: cy - 4, size: 1.3, color: OX });
  centerAt(p, "ARCHIVE", WM, 26, cx, cy - 30, c, 10);
}
function drawNameplate(p, cx, cy, fonts, WM, dark, scale = 1) {
  const c = inkFor(dark);
  const w = 200 * scale, h = 64 * scale;
  p.drawRectangle({ x: cx - w / 2, y: cy - h / 2, width: w, height: h, borderColor: c, borderWidth: 1, opacity: 0 });
  p.drawRectangle({ x: cx - w / 2 + 4, y: cy - h / 2 + 4, width: w - 8, height: h - 8, borderColor: c, borderWidth: 0.5, opacity: 0 });
  // corner ticks
  const ck = 6 * scale;
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const px = cx + sx * (w / 2), py = cy + sy * (h / 2);
    p.drawLine({ start: { x: px, y: py }, end: { x: px - sx * ck, y: py }, thickness: 1, color: OX });
    p.drawLine({ start: { x: px, y: py }, end: { x: px, y: py - sy * ck }, thickness: 1, color: OX });
  }
  centerAt(p, "Stuttgart Archive", WM, 24 * scale, cx, cy + 1, c, 0);
  centerAt(p, "EST. FOR THE MARQUE", fonts.marcellus, 6.5 * scale, cx, cy - 17 * scale, mutedFor(dark), 3);
}
function drawLigature(p, cx, cy, fonts, WM, dark) {
  const c = inkFor(dark);
  const size = 56;
  // overlap S and A
  const sW = WM.widthOfTextAtSize("S", size);
  const aW = WM.widthOfTextAtSize("A", size);
  const total = sW + aW - size * 0.42;
  let x = cx - total / 2;
  p.drawText("S", { x, y: cy - size * 0.34, size, font: WM, color: c });
  p.drawText("A", { x: x + sW - size * 0.42, y: cy - size * 0.34, size, font: WM, color: OX });
}
function drawDropInitial(p, cx, cy, fonts, WM, dark) {
  const c = inkFor(dark);
  p.drawText("S", { x: cx - 70, y: cy - 24, size: 64, font: WM, color: c });
  p.drawText("tuttgart", { x: cx - 28, y: cy + 6, size: 24, font: WM, color: c });
  p.drawText("Archive", { x: cx - 28, y: cy - 22, size: 24, font: WM, color: c });
  p.drawLine({ start: { x: cx - 28, y: cy + 1 }, end: { x: cx + 70, y: cy + 1 }, thickness: 0.5, color: OX });
}
function drawUnderlined(p, cx, cy, fonts, WM, dark) {
  const c = inkFor(dark);
  centerAt(p, "Stuttgart Archive", WM, 28, cx, cy + 4, c, 1);
  p.drawLine({ start: { x: cx - 78, y: cy - 12 }, end: { x: cx - 8, y: cy - 12 }, thickness: 0.6, color: c });
  p.drawLine({ start: { x: cx + 8, y: cy - 12 }, end: { x: cx + 78, y: cy - 12 }, thickness: 0.6, color: c });
  // diamond
  p.drawRectangle({ x: cx - 2.5, y: cy - 14.5, width: 5, height: 5, color: OX, rotate: { type: "degrees", angle: 45 } });
}
function drawOval(p, cx, cy, fonts, WM, dark) {
  const c = inkFor(dark);
  p.drawEllipse({ x: cx, y: cy - 6, xScale: 34, yScale: 24, borderColor: c, borderWidth: 1.4 });
  centerAt(p, "SA", WM, 30, cx, cy - 16, c, 1);
  p.drawLine({ start: { x: cx, y: cy + 18 }, end: { x: cx, y: cy + 26 }, thickness: 1.4, color: OX });
}

/* ---------------- helpers ---------------- */
function bg(p) { p.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: PARCH }); }
function tw(s, font, size, tr) { return [...s].reduce((w, ch) => w + font.widthOfTextAtSize(ch, size) + tr, 0) - tr; }
function tracked(p, s, x, y, font, size, color, tr) {
  if (!tr) { p.drawText(s, { x, y, size, font, color }); return; }
  let cx = x; for (const ch of s) { p.drawText(ch, { x: cx, y, size, font, color }); cx += font.widthOfTextAtSize(ch, size) + tr; }
}
function centerAt(p, s, font, size, cx, y, color, tr = 0) {
  tracked(p, s, cx - tw(s, font, size, tr) / 2, y, font, size, color, tr);
}

main().catch((e) => { console.error(e); process.exit(1); });
