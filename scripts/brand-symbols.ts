/* Conceptual heritage symbol options -> PNG (resvg). Excluded from typecheck.
   npx tsx scripts/brand-symbols.ts  ->  /tmp/stuttgart-archive-symbols.png */
// @ts-nocheck
import { writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const RED = "#D5001C", INK = "#1A1C1E", PARCH = "#F4F1EA", CARD = "#FBF9F4", LINE = "#D8D4C8", MUT = "#7d7f7a";
const W = 1080, H = 1620;
const SW = 4; // stroke weight

const pt = (a, r) => [r * Math.cos((a * Math.PI) / 180), r * Math.sin((a * Math.PI) / 180)];
const poly = (a0, a1, r, step = 4) => {
  let d = "";
  for (let a = a0; a <= a1; a += step) { const [x, y] = pt(a, r); d += (d ? "L" : "M") + x.toFixed(1) + "," + y.toFixed(1) + " "; }
  return d;
};

// 1 — Apex: the racing line through a corner, red dot at the apex
const apex = `
  <path d="M60,-64 C -8,-44 -58,-6 -50,36 C -47,58 -16,66 60,70" fill="none" stroke="${INK}" stroke-width="${SW}" stroke-linecap="round"/>
  <circle cx="-52" cy="16" r="6" fill="${RED}"/>`;

// 2 — Redline: a tachometer sweep with the redline zone in Guards Red
function redline() {
  const r = 60;
  let s = `<path d="${poly(150, 330, r)}" fill="none" stroke="${INK}" stroke-width="${SW}" stroke-linecap="round"/>`;
  s += `<path d="${poly(330, 390, r)}" fill="none" stroke="${RED}" stroke-width="${SW}" stroke-linecap="round"/>`;
  for (let a = 150; a <= 390; a += 30) { const [x1, y1] = pt(a, r - 12), [x2, y2] = pt(a, r); s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${a >= 330 ? RED : INK}" stroke-width="2.4"/>`; }
  const [nx, ny] = pt(366, r - 16);
  s += `<line x1="0" y1="0" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="${RED}" stroke-width="3.4" stroke-linecap="round"/><circle r="4.5" fill="${INK}"/>`;
  return s;
}

// 3 — Air-cooled fan: the cooling fan rosette, red hub
function fan() {
  const n = 11, ri = 16, ro = 58, sweep = 26;
  let s = "";
  for (let i = 0; i < n; i++) {
    const a = (360 / n) * i;
    const [x1, y1] = pt(a, ri), [x2, y2] = pt(a + sweep, ro);
    const [cx, cy] = pt(a + sweep * 0.35, (ri + ro) / 2 + 6);
    s += `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  }
  s += `<circle r="62" fill="none" stroke="${INK}" stroke-width="2" opacity="0.35"/><circle r="9" fill="${RED}"/>`;
  return s;
}

// 4 — The open road: vanishing-point road inside a badge ring, red horizon point
const road = `
  <circle r="62" fill="none" stroke="${INK}" stroke-width="2.4"/>
  <line x1="-40" y1="48" x2="-8" y2="-20" stroke="${INK}" stroke-width="${SW}" stroke-linecap="round"/>
  <line x1="40" y1="48" x2="8" y2="-20" stroke="${INK}" stroke-width="${SW}" stroke-linecap="round"/>
  <line x1="-3.5" y1="40" x2="-1.6" y2="6" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
  <line x1="-30" y1="-20" x2="30" y2="-20" stroke="${INK}" stroke-width="2" opacity="0.45"/>
  <circle cx="0" cy="-20" r="5.5" fill="${RED}"/>`;

// 5 — Boxer: horizontally-opposed engine, red crank
const boxer = `
  <circle cx="-46" cy="0" r="20" fill="none" stroke="${INK}" stroke-width="${SW}"/>
  <circle cx="46" cy="0" r="20" fill="none" stroke="${INK}" stroke-width="${SW}"/>
  <line x1="-26" y1="0" x2="-11" y2="0" stroke="${INK}" stroke-width="${SW}" stroke-linecap="round"/>
  <line x1="26" y1="0" x2="11" y2="0" stroke="${INK}" stroke-width="${SW}" stroke-linecap="round"/>
  <circle r="10" fill="none" stroke="${RED}" stroke-width="${SW}"/><circle r="3" fill="${RED}"/>`;

// 6 — Keystone: an archival keystone / provenance plaque with a red inlay
const keystone = `
  <path d="M-40,-58 L40,-58 L52,58 L-52,58 Z" fill="none" stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round"/>
  <line x1="-46" y1="20" x2="46" y2="20" stroke="${INK}" stroke-width="2" opacity="0.4"/>
  <rect x="-3" y="-34" width="6" height="40" rx="2" fill="${RED}"/>`;

const SYMBOLS = [
  ["01", "Apex", "The perfect racing line — heritage of the drive.", apex],
  ["02", "Redline", "The tachometer sweep into the red zone.", redline()],
  ["03", "Air-Cooled", "The classic cooling-fan rosette.", fan()],
  ["04", "The Open Road", "A vanishing-point road — the journey.", road],
  ["05", "Boxer", "The horizontally-opposed engine.", boxer],
  ["06", "Keystone", "An archival plaque — provenance kept.", keystone],
];

function tile(x, y, w, h, n, name, desc, inner) {
  const cx = x + w / 2, cy = y + h / 2 - 26;
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${CARD}" stroke="${LINE}" stroke-width="1.5"/>
  <text x="${x + 22}" y="${y + 40}" font-family="Cormorant Garamond SemiBold" font-size="30" fill="${RED}">${n}</text>
  <g transform="translate(${cx},${cy})">${inner}</g>
  <text x="${cx}" y="${y + h - 50}" text-anchor="middle" font-family="Cormorant Garamond SemiBold" font-size="34" fill="${INK}">${name}</text>
  <text x="${cx}" y="${y + h - 26}" text-anchor="middle" font-family="Hanken Grotesk Medium" font-size="17" fill="${MUT}">${desc}</text>`;
}

const cards = SYMBOLS.map((s, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  return tile(50 + col * 500, 340 + row * 410, 480, 390, s[0], s[1], s[2], s[3]);
}).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${PARCH}"/>
  <text x="${W / 2}" y="120" text-anchor="middle" font-family="Cormorant Garamond SemiBold" font-size="68" fill="${INK}">Heritage symbols</text>
  <rect x="${W / 2 - 90}" y="142" width="180" height="5" fill="${RED}"/>
  <text x="${W / 2}" y="200" text-anchor="middle" font-family="Hanken Grotesk Medium" font-size="22" letter-spacing="4" fill="${MUT}">ORIGINAL CONCEPTUAL MARKS — NO LETTERS, NO CREST</text>
  ${cards}
  <text x="${W / 2}" y="${H - 40}" text-anchor="middle" font-family="Hanken Grotesk Medium" font-size="22" fill="${MUT}">Pick a number — I'll refine it (line-weight, a chrome version, the lockup with the wordmark).</text>
</svg>`;

const fontFiles = [
  "node_modules/@expo-google-fonts/cormorant-garamond/600SemiBold/CormorantGaramond_600SemiBold.ttf",
  "node_modules/@expo-google-fonts/hanken-grotesk/500Medium/HankenGrotesk_500Medium.ttf",
];
const r = new Resvg(svg, { fitTo: { mode: "width", value: 1080 }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Cormorant Garamond SemiBold" } });
writeFileSync("/tmp/stuttgart-archive-symbols.png", r.render().asPng());
console.log("ok");
