/* Apex-as-letterform ideas -> PNG (resvg). Excluded from typecheck.
   npx tsx scripts/brand-apex.ts  ->  /tmp/stuttgart-archive-apex.png */
// @ts-nocheck
import { writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const RED = "#D5001C", INK = "#1A1C1E", ASPH = "#2b2e33", PARCH = "#F4F1EA", CARD = "#FBF9F4", LINE = "#D8D4C8", MUT = "#7d7f7a", WHT = "#F4F1EA";
const W = 1080, H = 1180;

// kerb helper: red/white striped stroke along a path
const kerb = (d, w = 9) => `<path d="${d}" fill="none" stroke="${WHT}" stroke-width="${w}"/><path d="${d}" fill="none" stroke="${RED}" stroke-width="${w}" stroke-dasharray="7 7"/>`;

// 01 — "A" whose peak is a racing corner: ink A, kerbed apex, red racing line as crossbar
const apexA = `
  <path d="M-48,74 L-2,-72" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>
  <path d="M48,74 L2,-72" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>
  ${kerb("M-16,-44 Q0,-60 16,-44", 8)}
  <path d="M-30,18 Q0,6 30,18" fill="none" stroke="${RED}" stroke-width="6" stroke-linecap="round"/>`;

// 02 — asphalt-ribbon "A": the letter built from track surface with white edges + apex kerb
const ribbonA = `
  <path d="M-46,74 L0,-70 L46,74" fill="none" stroke="${WHT}" stroke-width="34" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="M-46,74 L0,-70 L46,74" fill="none" stroke="${ASPH}" stroke-width="27" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="M-46,74 L0,-70 L46,74" fill="none" stroke="${WHT}" stroke-width="1.6" stroke-dasharray="6 10" opacity="0.85"/>
  ${kerb("M-14,-40 Q0,-58 14,-40", 7)}
  <path d="M-26,20 L26,20" stroke="${RED}" stroke-width="6" stroke-linecap="round"/>`;

// 03 — corner monogram: a single sweeping bend (reads as a C / hairpin) with apex + racing line
const cornerC = `
  <path d="M44,-66 C-26,-56 -64,-20 -58,18 C-54,46 -28,64 36,68" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>
  ${kerb("M-66,-6 C-67,8 -64,22 -56,34", 8)}
  <path d="M40,-66 C-20,-50 -52,-18 -47,16 C-43,42 -22,58 38,66" fill="none" stroke="${RED}" stroke-width="3.2" stroke-linecap="round"/>
  <circle cx="-62" cy="14" r="5" fill="${RED}"/>`;

// 04 — wordmark lockup: the red line becomes a racing line that clips an apex under the name
function lockup(cx, cy) {
  return `
  <text x="${cx}" y="${cy}" text-anchor="middle" font-family="Cormorant Garamond SemiBold" font-size="58" fill="${INK}">Stuttgart Archive</text>
  <path d="M${cx - 210},${cy + 26} C${cx - 70},${cy + 26} ${cx - 70},${cy + 40} ${cx},${cy + 40} C${cx + 70},${cy + 40} ${cx + 70},${cy + 26} ${cx + 210},${cy + 26}"
        fill="none" stroke="${RED}" stroke-width="5" stroke-linecap="round"/>
  <circle cx="${cx}" cy="${cy + 40}" r="5" fill="${RED}"/>`;
}

function tile(x, y, w, h, n, name, desc, inner, scale = 1.5) {
  const cx = x + w / 2, cy = y + h / 2 - 24;
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${CARD}" stroke="${LINE}" stroke-width="1.5"/>
  <text x="${x + 22}" y="${y + 40}" font-family="Cormorant Garamond SemiBold" font-size="30" fill="${RED}">${n}</text>
  <g transform="translate(${cx},${cy}) scale(${scale})">${inner}</g>
  <text x="${cx}" y="${y + h - 50}" text-anchor="middle" font-family="Cormorant Garamond SemiBold" font-size="32" fill="${INK}">${name}</text>
  <text x="${cx}" y="${y + h - 26}" text-anchor="middle" font-family="Hanken Grotesk Medium" font-size="16" fill="${MUT}">${desc}</text>`;
}

const cards =
  tile(50, 300, 480, 390, "01", "Apex A", "The A's peak is a kerbed corner; red is the line.", apexA) +
  tile(550, 300, 480, 390, "02", "Track A", "The letter built from asphalt, with kerbs.", ribbonA) +
  tile(50, 710, 480, 390, "03", "The Bend", "A single sweeping corner; reads as a C.", cornerC);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${PARCH}"/>
  <text x="${W / 2}" y="116" text-anchor="middle" font-family="Cormorant Garamond SemiBold" font-size="66" fill="${INK}">The Apex, as type</text>
  <rect x="${W / 2 - 84}" y="138" width="168" height="5" fill="${RED}"/>
  <text x="${W / 2}" y="192" text-anchor="middle" font-family="Hanken Grotesk Medium" font-size="21" letter-spacing="4" fill="${MUT}">A LETTER THAT IS ALSO A RACING CORNER</text>
  ${cards}
  <rect x="550" y="710" width="480" height="390" rx="14" fill="${CARD}" stroke="${LINE}" stroke-width="1.5"/>
  <text x="572" y="750" font-family="Cormorant Garamond SemiBold" font-size="30" fill="${RED}">04</text>
  ${lockup(790, 905)}
  <text x="790" y="1050" text-anchor="middle" font-family="Cormorant Garamond SemiBold" font-size="32" fill="${INK}">Racing-line lockup</text>
  <text x="790" y="1074" text-anchor="middle" font-family="Hanken Grotesk Medium" font-size="16" fill="${MUT}">The underline dips through an apex.</text>
  <text x="${W / 2}" y="${H - 36}" text-anchor="middle" font-family="Hanken Grotesk Medium" font-size="22" fill="${MUT}">Pick a direction (or mix: e.g. emblem 01 + lockup 04). I'll perfect it.</text>
</svg>`;

const fontFiles = [
  "node_modules/@expo-google-fonts/cormorant-garamond/600SemiBold/CormorantGaramond_600SemiBold.ttf",
  "node_modules/@expo-google-fonts/hanken-grotesk/500Medium/HankenGrotesk_500Medium.ttf",
];
const r = new Resvg(svg, { fitTo: { mode: "width", value: 1080 }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Cormorant Garamond SemiBold" } });
writeFileSync("/tmp/stuttgart-archive-apex.png", r.render().asPng());
console.log("ok");
