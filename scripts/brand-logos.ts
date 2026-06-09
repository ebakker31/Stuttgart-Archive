/**
 * Logo exploration — 15 distinct directions in one phone-friendly PDF.
 * Output: /tmp/stuttgart-archive-logos.pdf
 *
 * Excluded from tsconfig typecheck; dev-only fonts:
 *   npm i -D @pdf-lib/fontkit @expo-google-fonts/cormorant-garamond @expo-google-fonts/cormorant \
 *     @expo-google-fonts/cinzel @expo-google-fonts/marcellus @expo-google-fonts/eb-garamond \
 *     @expo-google-fonts/italiana @expo-google-fonts/hanken-grotesk
 *   npx tsx scripts/brand-logos.ts
 */
// @ts-nocheck
import { readFileSync, writeFileSync } from "node:fs";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const RED = rgb(0.784, 0.063, 0.18);
const INK = rgb(0.15, 0.16, 0.18);
const PARCH = rgb(0.957, 0.945, 0.918);
const CARD = rgb(0.985, 0.978, 0.96);
const MUTED = rgb(0.46, 0.46, 0.43);
const SILVER = rgb(0.82, 0.83, 0.85);
const LINE = rgb(0.82, 0.8, 0.74);
const PW = 612, PH = 792, M = 40;
const RT = "node_modules/@expo-google-fonts";
const ff = (p) => readFileSync(`${RT}/${p}.ttf`);

async function main() {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const cg = await doc.embedFont(ff("cormorant-garamond/600SemiBold/CormorantGaramond_600SemiBold"));
  const cgd = await doc.embedFont(ff("cormorant/600SemiBold/Cormorant_600SemiBold"));
  const cinzel = await doc.embedFont(ff("cinzel/600SemiBold/Cinzel_600SemiBold"));
  const marcellus = await doc.embedFont(ff("marcellus/400Regular/Marcellus_400Regular"));
  const ebg = await doc.embedFont(ff("eb-garamond/600SemiBold/EBGaramond_600SemiBold"));
  const italiana = await doc.embedFont(ff("italiana/400Regular/Italiana_400Regular"));
  const hk = await doc.embedFont(ff("hanken-grotesk/500Medium/HankenGrotesk_500Medium"));
  const hkB = await doc.embedFont(StandardFonts.HelveticaBold);

  const tw = (s, fo, sz, tr = 0) => [...s].reduce((w, c) => w + fo.widthOfTextAtSize(c, sz) + tr, 0) - tr;
  const T = (p, s, x, y, fo, sz, col, tr = 0) => { let cx = x; for (const c of s) { p.drawText(c, { x: cx, y, size: sz, font: fo, color: col }); cx += fo.widthOfTextAtSize(c, sz) + tr; } };
  const C = (p, s, fo, sz, cx, y, col, tr = 0) => T(p, s, cx - tw(s, fo, sz, tr) / 2, y, fo, sz, col, tr);
  const diamond = (p, cx, cy, r, col = RED) => p.drawRectangle({ x: cx - r, y: cy - r, width: r * 2, height: r * 2, color: col, rotate: degrees(45) });

  // ---- 15 logo concepts. Each: (p, cx, cy, ink) draws centred around cx,cy ----
  const concepts = [
    ["Refined wordmark", "Cormorant title case + hairline rule.", (p, cx, cy, ink) => {
      C(p, "Stuttgart Archive", cg, 27, cx, cy + 3, ink, 0.4);
      p.drawLine({ start: { x: cx - 66, y: cy - 12 }, end: { x: cx + 66, y: cy - 12 }, thickness: 0.6, color: ink });
    }],
    ["Spaced capitals", "Single line, letter-spaced caps.", (p, cx, cy, ink) => {
      C(p, "STUTTGART ARCHIVE", cg, 17, cx, cy - 2, ink, 4);
    }],
    ["Monumental caps", "Cinzel — Trajan-style luxury.", (p, cx, cy, ink) => {
      C(p, "STUTTGART", cinzel, 12.5, cx, cy + 8, ink, 1.5);
      C(p, "ARCHIVE", cinzel, 12.5, cx, cy - 10, ink, 5);
    }],
    ["Monogram lockup", "SA mark + wordmark, horizontal.", (p, cx, cy, ink) => {
      const sx = cx - 92;
      p.drawRectangle({ x: sx, y: cy - 18, width: 36, height: 36, borderColor: ink, borderWidth: 1 });
      C(p, "SA", cg, 22, sx + 18, cy - 7, ink, 0.5);
      diamond(p, sx + 18, cy - 14, 1.6);
      T(p, "Stuttgart", sx + 50, cy + 2, cg, 20, ink, 0.3);
      T(p, "Archive", sx + 50, cy - 16, cg, 20, ink, 0.3);
    }],
    ["SA ligature", "Interlocked initials + small word.", (p, cx, cy, ink) => {
      const sz = 46; const sW = cg.widthOfTextAtSize("S", sz);
      const x = cx - (sW + cg.widthOfTextAtSize("A", sz) - sz * 0.42) / 2;
      p.drawText("S", { x, y: cy - 6, size: sz, font: cg, color: ink });
      p.drawText("A", { x: x + sW - sz * 0.42, y: cy - 6, size: sz, font: cg, color: ink });
      C(p, "STUTTGART ARCHIVE", hk, 6.5, cx, cy - 24, MUTED, 2.5);
    }],
    ["Initial lockup", "Oversized S leading the name.", (p, cx, cy, ink) => {
      p.drawText("S", { x: cx - 78, y: cy - 22, size: 56, font: cgd, color: ink });
      T(p, "Stuttgart", cx - 34, cy + 3, cg, 21, ink, 0.3);
      T(p, "Archive", cx - 34, cy - 18, cg, 21, ink, 0.3);
    }],
    ["Editorial masthead", "Rules above & below the name.", (p, cx, cy, ink) => {
      p.drawLine({ start: { x: cx - 96, y: cy + 14 }, end: { x: cx + 96, y: cy + 14 }, thickness: 1, color: ink });
      C(p, "STUTTGART ARCHIVE", cg, 14, cx, cy - 2, ink, 3);
      p.drawLine({ start: { x: cx - 96, y: cy - 12 }, end: { x: cx + 96, y: cy - 12 }, thickness: 1, color: ink });
    }],
    ["Circular seal", "Ring with SA — museum stamp.", (p, cx, cy, ink) => {
      p.drawCircle({ x: cx, y: cy, size: 30, borderColor: ink, borderWidth: 1.3 });
      C(p, "SA", cg, 26, cx, cy - 9, ink, 0.5);
      diamond(p, cx, cy + 20, 1.6);
    }],
    ["Italiana wordmark", "Delicate high-contrast serif.", (p, cx, cy, ink) => {
      C(p, "Stuttgart Archive", italiana, 30, cx, cy - 3, ink, 0.6);
    }],
    ["Framed nameplate", "Wordmark in a thin frame.", (p, cx, cy, ink) => {
      const w = 196, h = 58;
      p.drawRectangle({ x: cx - w / 2, y: cy - h / 2, width: w, height: h, borderColor: ink, borderWidth: 1 });
      for (const [sxx, syy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        const px = cx + sxx * (w / 2), py = cy + syy * (h / 2);
        p.drawLine({ start: { x: px, y: py }, end: { x: px - sxx * 7, y: py }, thickness: 1.2, color: RED });
        p.drawLine({ start: { x: px, y: py }, end: { x: px, y: py - syy * 7 }, thickness: 1.2, color: RED });
      }
      C(p, "Stuttgart Archive", cg, 23, cx, cy - 6, ink, 0.4);
    }],
    ["Serif + sans", "Serif name over a tracked sans line.", (p, cx, cy, ink) => {
      C(p, "Stuttgart Archive", cg, 28, cx, cy + 4, ink, 0.3);
      C(p, "PORSCHE ARCHIVE & MARKETPLACE", hk, 6, cx, cy - 16, MUTED, 2.2);
    }],
    ["Roman elegance", "Marcellus capitals.", (p, cx, cy, ink) => {
      C(p, "STUTTGART ARCHIVE", marcellus, 15, cx, cy - 2, ink, 3);
    }],
    ["Monoline S", "Single serif S in a fine circle.", (p, cx, cy, ink) => {
      p.drawCircle({ x: cx, y: cy, size: 28, borderColor: ink, borderWidth: 1.6 });
      C(p, "S", cgd, 38, cx, cy - 13, ink, 0);
      diamond(p, cx, cy + 19, 1.4);
    }],
    ["Inline diamond", "Diamond separates the two words.", (p, cx, cy, ink) => {
      const a = "Stuttgart", b = "Archive", sz = 24, gap = 16;
      const aw = tw(a, cg, sz), bw = tw(b, cg, sz);
      const total = aw + gap * 2 + bw;
      const x = cx - total / 2;
      T(p, a, x, cy - 8, cg, sz, ink);
      diamond(p, x + aw + gap, cy - 1, 2.4);
      T(p, b, x + aw + gap * 2, cy - 8, cg, sz, ink);
    }],
    ["Stacked plaque", "EB Garamond caps, ruled plaque.", (p, cx, cy, ink) => {
      p.drawLine({ start: { x: cx - 80, y: cy + 16 }, end: { x: cx + 80, y: cy + 16 }, thickness: 0.6, color: ink });
      C(p, "STUTTGART", ebg, 15, cx, cy + 1, ink, 3);
      C(p, "ARCHIVE", ebg, 9, cx, cy - 15, MUTED, 5);
      p.drawLine({ start: { x: cx - 80, y: cy - 24 }, end: { x: cx + 80, y: cy - 24 }, thickness: 0.6, color: ink });
    }],
  ];

  // ---- layout: 2 cols x 3 rows per page ----
  const perPage = 6, cols = 2;
  const cardW = (PW - 2 * M - 18) / cols, cardH = 196, gap = 16;
  let idx = 0;
  const pageCount = Math.ceil(concepts.length / perPage);
  for (let pg = 0; pg < pageCount; pg++) {
    const p = doc.addPage([PW, PH]); p.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: PARCH });
    T(p, "STUTTGART ARCHIVE LOGO DIRECTIONS", M, PH - 44, hkB, 8.5, RED, 0); // header
    T(p, `${pg * perPage + 1}–${Math.min((pg + 1) * perPage, concepts.length)} of ${concepts.length}`, PW - M - 70, PH - 44, hk, 9, MUTED, 0);
    p.drawLine({ start: { x: M, y: PH - 54 }, end: { x: PW - M, y: PH - 54 }, thickness: 0.6, color: LINE });

    for (let i = 0; i < perPage && idx < concepts.length; i++, idx++) {
      const [name, note, draw] = concepts[idx];
      const col = i % cols, row = Math.floor(i / cols);
      const x = M + col * (cardW + 18);
      const yTop = PH - 74 - row * (cardH + gap);
      const y = yTop - cardH;
      // card
      p.drawRectangle({ x, y, width: cardW, height: cardH, color: CARD, borderColor: LINE, borderWidth: 0.8 });
      // number
      C(p, String(idx + 1).padStart(2, "0"), cg, 13, x + 22, yTop - 24, RED, 1);
      // logo, centred in the upper area
      draw(p, x + cardW / 2, y + cardH * 0.56, INK);
      // footer rule + name + note
      p.drawLine({ start: { x: x + 16, y: y + 40 }, end: { x: x + cardW - 16, y: y + 40 }, thickness: 0.5, color: LINE });
      T(p, name, x + 16, y + 24, cg, 14, INK, 0);
      T(p, note, x + 16, y + 11, hk, 7.5, MUTED, 0);
    }
  }

  // closing note page
  {
    const p = doc.addPage([PW, PH]); p.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: PARCH });
    C(p, "Which directions speak to you?", cg, 30, PW / 2, PH / 2 + 30, INK, 0.4);
    C(p, "Reply with the numbers you like (e.g. \"3, 7 and 14\") — or describe what's", hk, 11, PW / 2, PH / 2 - 6, MUTED, 0);
    C(p, "missing. I'll refine the winner into a full identity.", hk, 11, PW / 2, PH / 2 - 22, MUTED, 0);
    diamond(p, PW / 2, PH / 2 - 50, 3);
  }

  const bytes = await doc.save();
  writeFileSync("/tmp/stuttgart-archive-logos.pdf", Buffer.from(bytes));
  console.log("ok", bytes.byteLength, "concepts", concepts.length);
}

main().catch((e) => { console.error(e); process.exit(1); });
