/**
 * Elevated brand sheet — heritage-grade logo (stacked spaced-caps) with
 * before/after + alternatives, and the type system.
 * Output: /tmp/stuttgart-archive-logo-final.pdf
 *
 * Excluded from tsconfig typecheck; dev-only fonts:
 *   npm i -D @pdf-lib/fontkit @expo-google-fonts/cormorant-garamond @expo-google-fonts/hanken-grotesk
 *   npx tsx scripts/brand-final.ts
 */
// @ts-nocheck
import { readFileSync, writeFileSync } from "node:fs";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const RED = rgb(0.784, 0.063, 0.18);
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

  // CHOSEN logo: editorial masthead — Cormorant caps between two fine rules
  const elevated = (p, cx, cy, scale, dark) => {
    const ink = dark ? PARCH : INK;
    const ruleCol = dark ? rgb(0.55, 0.56, 0.58) : INK;
    const sz = 15 * scale;
    const halfW = tw("STUTTGART ARCHIVE", cormorant, sz, 3.5 * scale) / 2 + 14 * scale;
    p.drawLine({ start: { x: cx - halfW, y: cy + 13 * scale }, end: { x: cx + halfW, y: cy + 13 * scale }, thickness: 0.8 * scale, color: ruleCol });
    centerAt(p, "STUTTGART ARCHIVE", cormorant, sz, cx, cy - 5 * scale, ink, 3.5 * scale);
    p.drawLine({ start: { x: cx - halfW, y: cy - 13 * scale }, end: { x: cx + halfW, y: cy - 13 * scale }, thickness: 0.8 * scale, color: ruleCol });
  };

  // Page 1 — the elevated logo
  {
    const p = doc.addPage([PW, PH]); p.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: PARCH });
    label(p, "Primary logo — elevated", M, PH - 70);
    p.drawRectangle({ x: M, y: PH - 340, width: PW - 2 * M, height: 230, color: INK });
    elevated(p, PW / 2, PH - 222, 2.0, true);
    centerAt(p, "editorial masthead — Cormorant caps between fine rules", hanken, 9, PW / 2, PH - 330, SILVER);
    p.drawRectangle({ x: M, y: PH - 545, width: PW - 2 * M, height: 175, color: CARD, borderColor: LINE, borderWidth: 0.8 });
    elevated(p, PW / 2, PH - 455, 1.6, false);
    centerAt(p, "on parchment (site default)", hanken, 9, PW / 2, PH - 535, MUTED);
    // monogram + heritage red
    monogram(p, M + 40, 150);
    p.drawRectangle({ x: M + 108, y: 122, width: 78, height: 50, color: RED });
    tracked(p, "#C8102E  ·  heritage red, used as a whisper", M + 196, 150, hanken, 8.5, MUTED, 0.4);
    tracked(p, "SA monogram for favicon / avatars", M + 196, 134, hanken, 8, MUTED, 0.3);
  }

  // Page 2 — before / after + alternatives
  {
    const p = doc.addPage([PW, PH]); p.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: PARCH });
    label(p, "Why the masthead works", M, PH - 70);
    let y = PH - 110;
    const notes = [
      "No tagline or coloured bar inside the mark — the name stands alone, like the auction houses.",
      "Spaced capitals between two fine rules read editorial and monumental — an auction-house masthead.",
      "Colour stays out of the mark entirely — pure ink — the disciplined, heritage way.",
      "Pairs an elegant display serif (Cormorant) with a clean modern sans (Hanken Grotesk).",
    ];
    notes.forEach((n) => { p.drawText("—", { x: M, y, size: 10, font: cormorant, color: RED }); wrap(p, n, M + 16, y, hanken, 10, INK, PW - 2 * M - 16, 14); y -= 30; });

    y -= 6;
    label(p, "Before  /  after", M, y); y -= 26;
    // before (bar version)
    p.drawRectangle({ x: M, y: y - 70, width: (PW - 2 * M - 20) / 2, height: 70, color: CARD, borderColor: LINE, borderWidth: 0.8 });
    const bx = M + (PW - 2 * M - 20) / 4;
    centerAt(p, "Stuttgart Archive", cormorant, 20, bx, y - 30, INK, 0.4);
    p.drawRectangle({ x: bx - 22, y: y - 44, width: 44, height: 3.5, color: RED });
    centerAt(p, "previous — bar + tagline (reads start-up)", hanken, 7, bx, y - 60, MUTED);
    // after
    const ax = M + (PW - 2 * M - 20) * 0.75 + 20;
    p.drawRectangle({ x: M + (PW - 2 * M - 20) / 2 + 20, y: y - 70, width: (PW - 2 * M - 20) / 2, height: 70, color: INK });
    elevated(p, ax, y - 33, 1.15, true);
    centerAt(p, "chosen — editorial masthead", hanken, 7, ax, y - 60, SILVER);

    // alternatives
    y -= 110;
    label(p, "Alternatives, if you prefer", M, y); y -= 30;
    centerAt(p, "STUTTGART ARCHIVE", cormorant, 17, PW / 2, y, INK, 5);
    centerAt(p, "single-line spaced caps", hanken, 7, PW / 2, y - 16, MUTED); y -= 44;
    centerAt(p, "Stuttgart Archive", cormorant, 26, PW / 2, y, INK, 0.5);
    centerAt(p, "refined title case", hanken, 7, PW / 2, y - 16, MUTED);

    centerAt(p, "Tell me: keep the elevated stacked mark, or switch to an alternative.", hanken, 9, PW / 2, 80, MUTED);
  }

  const bytes = await doc.save();
  writeFileSync("/tmp/stuttgart-archive-logo-final.pdf", Buffer.from(bytes));
  console.log("ok", bytes.byteLength);

  function monogram(p, cx, cy) {
    p.drawRectangle({ x: cx - 26, y: cy - 26, width: 52, height: 52, color: CARD, borderColor: LINE, borderWidth: 0.8 });
    centerAt(p, "SA", cormorant, 26, cx, cy - 6, INK, 1);
    p.drawRectangle({ x: cx - 2, y: cy - 18, width: 4, height: 4, color: RED, rotate: degrees(45) });
  }
  function wrap(p, text, x, y, fo, size, color, maxW, lh) {
    const words = text.split(" "); let line = "", yy = y;
    for (const w of words) { const t = line ? line + " " + w : w; if (line && fo.widthOfTextAtSize(t, size) > maxW) { p.drawText(line, { x, y: yy, size, font: fo, color }); line = w; yy -= lh; } else line = t; }
    if (line) p.drawText(line, { x, y: yy, size, font: fo, color });
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
