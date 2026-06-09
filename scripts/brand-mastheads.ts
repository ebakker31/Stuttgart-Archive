/**
 * Masthead logo variations (direction #7). 10 ruled-wordmark treatments in one
 * phone-friendly PDF. Output: /tmp/stuttgart-archive-mastheads.pdf
 *
 * Excluded from tsconfig typecheck; dev-only fonts:
 *   npm i -D @pdf-lib/fontkit @expo-google-fonts/cormorant-garamond \
 *     @expo-google-fonts/cinzel @expo-google-fonts/marcellus @expo-google-fonts/eb-garamond \
 *     @expo-google-fonts/hanken-grotesk
 *   npx tsx scripts/brand-mastheads.ts
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
const LINE = rgb(0.82, 0.8, 0.74);
const PW = 612, PH = 792, M = 44;
const RT = "node_modules/@expo-google-fonts";
const ff = (p) => readFileSync(`${RT}/${p}.ttf`);

async function main() {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const cg = await doc.embedFont(ff("cormorant-garamond/600SemiBold/CormorantGaramond_600SemiBold"));
  const cinzel = await doc.embedFont(ff("cinzel/600SemiBold/Cinzel_600SemiBold"));
  const marcellus = await doc.embedFont(ff("marcellus/400Regular/Marcellus_400Regular"));
  const ebg = await doc.embedFont(ff("eb-garamond/600SemiBold/EBGaramond_600SemiBold"));
  const hk = await doc.embedFont(ff("hanken-grotesk/500Medium/HankenGrotesk_500Medium"));
  const hkB = await doc.embedFont(StandardFonts.HelveticaBold);

  const tw = (s, fo, sz, tr = 0) => [...s].reduce((w, c) => w + fo.widthOfTextAtSize(c, sz) + tr, 0) - tr;
  const T = (p, s, x, y, fo, sz, col, tr = 0) => { let cx = x; for (const c of s) { p.drawText(c, { x: cx, y, size: sz, font: fo, color: col }); cx += fo.widthOfTextAtSize(c, sz) + tr; } };
  const C = (p, s, fo, sz, cx, y, col, tr = 0) => T(p, s, cx - tw(s, fo, sz, tr) / 2, y, fo, sz, col, tr);
  const rule = (p, cx, y, halfW, th, col = INK) => p.drawLine({ start: { x: cx - halfW, y }, end: { x: cx + halfW, y }, thickness: th, color: col });
  const diamond = (p, cx, cy, r, col = RED) => p.drawRectangle({ x: cx - r, y: cy - r, width: r * 2, height: r * 2, color: col, rotate: degrees(45) });

  const NAME = "STUTTGART ARCHIVE";

  const variations = [
    ["Classic hairline", "Single fine rule above and below.", (p, cx, cy, ink) => {
      const w = tw(NAME, cg, 16, 3.5) / 2 + 14;
      rule(p, cx, cy + 14, w, 0.8, ink); C(p, NAME, cg, 16, cx, cy - 4, ink, 3.5); rule(p, cx, cy - 14, w, 0.8, ink);
    }],
    ["Double rule", "Two hairlines top and bottom.", (p, cx, cy, ink) => {
      const w = tw(NAME, cg, 16, 3.5) / 2 + 14;
      rule(p, cx, cy + 16, w, 0.7, ink); rule(p, cx, cy + 13, w, 0.7, ink);
      C(p, NAME, cg, 16, cx, cy - 4, ink, 3.5);
      rule(p, cx, cy - 13, w, 0.7, ink); rule(p, cx, cy - 16, w, 0.7, ink);
    }],
    ["Newspaper thick/thin", "Heavier top rule, hairline below.", (p, cx, cy, ink) => {
      const w = tw(NAME, cg, 16, 3.5) / 2 + 14;
      rule(p, cx, cy + 15, w, 2.2, ink); C(p, NAME, cg, 16, cx, cy - 4, ink, 3.5); rule(p, cx, cy - 14, w, 0.8, ink);
    }],
    ["Diamond rules", "Rules broken by a small red diamond.", (p, cx, cy, ink) => {
      const w = tw(NAME, cg, 16, 3.5) / 2 + 16;
      for (const yy of [cy + 14, cy - 14]) { rule(p, cx - 7, yy, w - 7, 0.8, ink); rule(p, cx + 7 + (w - 7) / 2 * 0, yy, 0, 0.8, ink); p.drawLine({ start: { x: cx + 7, y: yy }, end: { x: cx + w, y: yy }, thickness: 0.8, color: ink }); diamond(p, cx, yy, 2.2); }
      C(p, NAME, cg, 16, cx, cy - 4, ink, 3.5);
    }],
    ["Flanking rules", "Short rules either side, one line.", (p, cx, cy, ink) => {
      const half = tw(NAME, cg, 17, 3) / 2;
      C(p, NAME, cg, 17, cx, cy - 5, ink, 3);
      rule(p, cx - half - 26, cy + 1, 14, 0.8, ink); rule(p, cx + half + 26, cy + 1, 14, 0.8, ink);
    }],
    ["With locator", "Rules + a tracked locator line.", (p, cx, cy, ink) => {
      const w = tw(NAME, cg, 17, 3.5) / 2 + 14;
      rule(p, cx, cy + 18, w, 0.8, ink); C(p, NAME, cg, 17, cx, cy + 1, ink, 3.5); rule(p, cx, cy - 9, w, 0.8, ink);
      C(p, "AN INDEPENDENT PORSCHE ARCHIVE", hk, 6, cx, cy - 22, MUTED, 2.4);
    }],
    ["Stacked masthead", "STUTTGART over ARCHIVE within rules.", (p, cx, cy, ink) => {
      const w = tw("STUTTGART", cg, 15, 3) / 2 + 16;
      rule(p, cx, cy + 22, w, 0.8, ink);
      C(p, "STUTTGART", cg, 15, cx, cy + 7, ink, 3);
      C(p, "ARCHIVE", cg, 15, cx, cy - 9, ink, 7);
      rule(p, cx, cy - 20, w, 0.8, ink);
    }],
    ["Monumental (Cinzel)", "Trajan caps between rules.", (p, cx, cy, ink) => {
      const w = tw(NAME, cinzel, 12, 2) / 2 + 16;
      rule(p, cx, cy + 15, w, 0.8, ink); C(p, NAME, cinzel, 12, cx, cy - 4, ink, 2); rule(p, cx, cy - 15, w, 0.8, ink);
    }],
    ["Roman (Marcellus)", "Marcellus caps between rules.", (p, cx, cy, ink) => {
      const w = tw(NAME, marcellus, 14, 3) / 2 + 16;
      rule(p, cx, cy + 15, w, 0.8, ink); C(p, NAME, marcellus, 14, cx, cy - 4, ink, 3); rule(p, cx, cy - 15, w, 0.8, ink);
    }],
    ["Title case", "Softer: title-case name + locator.", (p, cx, cy, ink) => {
      const w = tw("Stuttgart Archive", cg, 26, 0.4) / 2 + 12;
      rule(p, cx, cy + 18, w, 0.7, ink); C(p, "Stuttgart Archive", cg, 26, cx, cy - 2, ink, 0.4); rule(p, cx, cy - 13, w, 0.7, ink);
      C(p, "PORSCHE OWNERSHIP & PROVENANCE", hk, 5.5, cx, cy - 25, MUTED, 2.4);
    }],
  ];

  const perPage = 4;
  const cardW = PW - 2 * M, cardH = 150, gap = 14;
  let idx = 0;
  const pages = Math.ceil(variations.length / perPage);
  for (let pg = 0; pg < pages; pg++) {
    const p = doc.addPage([PW, PH]); p.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: PARCH });
    T(p, "MASTHEAD VARIATIONS (DIRECTION 7)", M, PH - 40, hkB, 8.5, RED, 1.5);
    T(p, `${pg * perPage + 1}-${Math.min((pg + 1) * perPage, variations.length)} of ${variations.length}`, PW - M - 64, PH - 40, hk, 9, MUTED, 0);
    rule(p, PW / 2, PH - 50, (PW - 2 * M) / 2, 0.6, LINE);

    for (let i = 0; i < perPage && idx < variations.length; i++, idx++) {
      const [name, note, draw] = variations[idx];
      const yTop = PH - 70 - i * (cardH + gap);
      const y = yTop - cardH;
      p.drawRectangle({ x: M, y, width: cardW, height: cardH, color: CARD, borderColor: LINE, borderWidth: 0.8 });
      C(p, String(idx + 1).padStart(2, "0"), cg, 13, M + 22, yTop - 26, RED, 1);
      draw(p, PW / 2, y + cardH * 0.6, INK);
      rule(p, PW / 2, y + 34, (cardW - 32) / 2, 0.5, LINE);
      T(p, name, M + 16, y + 20, cg, 14, INK, 0);
      T(p, note, M + 16, y + 9, hk, 7.5, MUTED, 0);
    }
  }

  {
    const p = doc.addPage([PW, PH]); p.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: PARCH });
    C(p, "Which masthead?", cg, 30, PW / 2, PH / 2 + 20, INK, 0.4);
    C(p, "Reply with a number (and any tweak: rule weight, caps vs title case, with/without locator).", hk, 10, PW / 2, PH / 2 - 8, MUTED, 0);
    diamond(p, PW / 2, PH / 2 - 34, 3);
  }

  const bytes = await doc.save();
  writeFileSync("/tmp/stuttgart-archive-mastheads.pdf", Buffer.from(bytes));
  console.log("ok", bytes.byteLength, "variations", variations.length);
}

main().catch((e) => { console.error(e); process.exit(1); });
