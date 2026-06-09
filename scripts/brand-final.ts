/**
 * Final brand sheet — the chosen logo (Framed Nameplate) + type system.
 * Output: /tmp/stuttgart-archive-logo-final.pdf
 *
 * Excluded from tsconfig typecheck; dev-only fonts:
 *   npm i -D @pdf-lib/fontkit @expo-google-fonts/cormorant-garamond @expo-google-fonts/hanken-grotesk
 *   npx tsx scripts/brand-final.ts
 */
// @ts-nocheck
import { readFileSync, writeFileSync } from "node:fs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const RED = rgb(0.784, 0.063, 0.18);   // #C8102E
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
  const cormorant = await doc.embedFont(f("cormorant-garamond/600SemiBold/CormorantGaramond_600SemiBold"));
  const hanken = await doc.embedFont(f("hanken-grotesk/400Regular/HankenGrotesk_400Regular"));
  const hankenSemi = await doc.embedFont(f("hanken-grotesk/600SemiBold/HankenGrotesk_600SemiBold"));
  const sansBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const tw = (s, fo, sz, tr) => [...s].reduce((w, c) => w + fo.widthOfTextAtSize(c, sz) + tr, 0) - tr;
  const tracked = (p, s, x, y, fo, sz, col, tr) => { let cx = x; for (const c of s) { p.drawText(c, { x: cx, y, size: sz, font: fo, color: col }); cx += fo.widthOfTextAtSize(c, sz) + tr; } };
  const centerAt = (p, s, fo, sz, cx, y, col, tr = 0) => tracked(p, s, cx - tw(s, fo, sz, tr) / 2, y, fo, sz, col, tr);
  const label = (p, s, x, y, c = RED) => tracked(p, s.toUpperCase(), x, y, sansBold, 8, c, 2.4);

  // primary logo: wordmark + red heritage bar + descriptive line, centered at cx,cy
  const nameplate = (p, cx, cy, scale, dark) => {
    const ink = dark ? PARCH : INK;
    centerAt(p, "Stuttgart Archive", cormorant, 30 * scale, cx, cy + 6 * scale, ink, 0.4);
    const bw = 46 * scale;
    p.drawRectangle({ x: cx - bw / 2, y: cy - 14 * scale, width: bw, height: 3.5 * scale, color: RED });
    centerAt(p, "AN INDEPENDENT PORSCHE ARCHIVE", hanken, 6.5 * scale, cx, cy - 30 * scale, dark ? SILVER : MUTED, 2.5);
  };

  // ---- Page 1: the logo (dark hero + light) ----
  {
    const p = doc.addPage([PW, PH]);
    p.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: PARCH });
    label(p, "Primary logo", M, PH - 70);
    // dark hero
    p.drawRectangle({ x: M, y: PH - 330, width: PW - 2 * M, height: 220, color: INK });
    nameplate(p, PW / 2, PH - 220, 1.35, true);
    centerAt(p, "wordmark + red heritage bar, on graphite", hanken, 9, PW / 2, PH - 320, SILVER);
    // light
    p.drawRectangle({ x: M, y: PH - 540, width: PW - 2 * M, height: 180, color: CARD, borderColor: LINE, borderWidth: 0.8 });
    nameplate(p, PW / 2, PH - 450, 1.15, false);
    centerAt(p, "the same logo on parchment (site default)", hanken, 9, PW / 2, PH - 530, MUTED);
    // monogram + color
    nameplateMono(p, M + 40, 150, cormorant);
    p.drawRectangle({ x: M + 110, y: 120, width: 90, height: 54, color: RED });
    tracked(p, "#C8102E", M + 116, 100, hanken, 8, MUTED, 0.5);
    tracked(p, "Porsche-inspired heritage red", M + 116, 88, hanken, 7, MUTED, 0.3);
    centerAt(p, "Cormorant Garamond · dark/white wordmark · red heritage bar · SA favicon", hanken, 8, PW / 2 + 30, 150, MUTED);
  }

  // ---- Page 2: type system ----
  {
    const p = doc.addPage([PW, PH]);
    p.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: PARCH });
    label(p, "Type system", M, PH - 70);

    tracked(p, "HEADINGS — CORMORANT GARAMOND", M, PH - 100, sansBold, 7.5, RED, 1.5);
    p.drawText("Preserve the story", { x: M, y: PH - 150, size: 42, font: cormorant, color: INK });
    p.drawText("behind the machine.", { x: M, y: PH - 196, size: 42, font: cormorant, color: INK });
    p.drawText("Built for cars with a story", { x: M, y: PH - 240, size: 24, font: cormorant, color: INK });

    p.drawLine({ start: { x: M, y: PH - 270 }, end: { x: PW - M, y: PH - 270 }, thickness: 0.8, color: LINE });

    tracked(p, "BODY — HANKEN GROTESK", M, PH - 300, sansBold, 7.5, RED, 1.5);
    const body = "Stuttgart Archive helps Porsche owners, buyers, sellers, and collectors organize records, build digital garages, prepare listings, and preserve the history of each car. The headings are an elegant high-contrast serif; the writing is a clean, modern sans that's easy on the eye.";
    wrapText(p, body, M, PH - 326, hanken, 12, INK, PW - 2 * M, 18);

    tracked(p, "EMPHASIS / LABELS", M, PH - 430, sansBold, 7.5, RED, 1.5);
    tracked(p, "ARCHIVE FILE · NO. 0964 · GRAND PRIX WHITE", M, PH - 452, hanken, 9, MUTED, 2);
    p.drawText("Documented · Verified · Buyer-ready", { x: M, y: PH - 474, size: 14, font: hankenSemi, color: INK });

    centerAt(p, "Confirm and I'll roll this across the site, emails, and PDFs.", hanken, 9, PW / 2, 90, MUTED);
  }

  const bytes = await doc.save();
  writeFileSync("/tmp/stuttgart-archive-logo-final.pdf", Buffer.from(bytes));
  console.log("ok", bytes.byteLength);

  function nameplateMono(p, cx, cy, fo) {
    p.drawRectangle({ x: cx - 26, y: cy - 26, width: 52, height: 52, color: CARD, borderColor: LINE, borderWidth: 0.8 });
    centerAt(p, "SA", fo, 28, cx, cy - 9, INK, 1);
    p.drawLine({ start: { x: cx - 10, y: cy - 16 }, end: { x: cx + 10, y: cy - 16 }, thickness: 1.2, color: RED });
  }
  function wrapText(p, text, x, y, fo, size, color, maxW, lh) {
    const words = text.split(" "); let line = "", yy = y;
    for (const w of words) {
      const t = line ? line + " " + w : w;
      if (line && fo.widthOfTextAtSize(t, size) > maxW) { p.drawText(line, { x, y: yy, size, font: fo, color }); line = w; yy -= lh; }
      else line = t;
    }
    if (line) p.drawText(line, { x, y: yy, size, font: fo, color });
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
