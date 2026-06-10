/* Apex / track symbol exploration -> PNG (resvg). Excluded from typecheck.
   npx tsx scripts/brand-track.ts  ->  /tmp/stuttgart-archive-track.png */
// @ts-nocheck
import { writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const RED = "#D5001C", INK = "#1A1C1E", ASPH = "#2b2e33", PARCH = "#F4F1EA", CARD = "#FBF9F4", LINE = "#D8D4C8", MUT = "#7d7f7a", WHITE = "#F4F1EA";
const W = 1080, H = 1180;

// ---- 01: Circuit silhouette (flowing loop) + red start/finish ----
const circuitA = `
  <path d="M0,-66 C46,-66 64,-30 52,-2 C44,18 70,28 58,52 C48,72 6,70 -20,58 C-44,47 -40,22 -54,8 C-70,-8 -58,-44 -22,-54 C-12,-57 -28,-66 0,-66 Z"
        fill="none" stroke="${INK}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>
  <line x1="-6" y1="-72" x2="6" y2="-60" stroke="${RED}" stroke-width="6" stroke-linecap="round"/>`;

// ---- 02: Circuit that flows like an S (for Stuttgart) ----
const circuitS = `
  <path d="M44,-58 C8,-72 -36,-58 -40,-26 C-44,2 -8,8 6,18 C22,30 24,52 -2,60 C-30,68 -58,52 -56,30"
        fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
  <circle cx="44" cy="-58" r="5.5" fill="${RED}"/>
  <circle cx="-56" cy="30" r="5.5" fill="${INK}"/>`;

// ---- 03: Apex corner as ACTUAL TRACK — asphalt ribbon, white edges, red/white kerb, racing line ----
function apexTrack() {
  const cl = "M14,86 C-34,58 -54,26 -46,-6 C-39,-32 -8,-50 30,-84"; // centreline through the corner
  const racing = "M30,86 C-20,54 -44,20 -40,-8 C-36,-34 0,-46 34,-84"; // ideal line, clips apex
  // kerb: short red/white striped arc on the inside of the apex (left)
  const kerb = "M-58,18 C-60,4 -58,-12 -52,-26";
  return `
    <path d="${cl}" fill="none" stroke="${WHITE}" stroke-width="50" stroke-linecap="round"/>
    <path d="${cl}" fill="none" stroke="${ASPH}" stroke-width="43" stroke-linecap="round"/>
    <path d="${cl}" fill="none" stroke="${WHITE}" stroke-width="2" stroke-dasharray="7 12" opacity="0.8"/>
    <path d="${kerb}" fill="none" stroke="${WHITE}" stroke-width="9" stroke-linecap="butt"/>
    <path d="${kerb}" fill="none" stroke="${RED}" stroke-width="9" stroke-dasharray="8 8" stroke-linecap="butt"/>
    <path d="${racing}" fill="none" stroke="${RED}" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 0" opacity="0.9"/>
    <circle cx="-43" cy="-6" r="4.5" fill="${RED}"/>`;
}

// ---- 04: Minimal apex — two kerb edges define the corner, red racing line + apex dot ----
const apexMin = `
  <path d="M18,80 C-30,52 -50,22 -44,-8 C-38,-34 -6,-50 32,-82" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
  <path d="M64,80 C24,56 6,30 12,2 C17,-22 40,-42 70,-66" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" opacity="0.35"/>
  <path d="M30,82 C-16,54 -40,22 -36,-8 C-32,-34 2,-46 36,-82" fill="none" stroke="${RED}" stroke-width="3.4" stroke-linecap="round"/>
  <circle cx="-42" cy="-6" r="5.5" fill="${RED}"/>`;

const OPTS = [
  ["01", "Circuit", "A full racing circuit, flowing as one line.", circuitA],
  ["02", "Circuit S", "The track shaped like an S — for Stuttgart.", circuitS],
  ["03", "The Apex", "A real corner: asphalt, kerbs, the racing line.", apexTrack()],
  ["04", "Apex, minimal", "The corner & ideal line, pared back.", apexMin],
];

function tile(x, y, w, h, n, name, desc, inner, dark) {
  const bg = dark ? INK : CARD, ink = dark ? PARCH : INK, mut = dark ? "#9a9d9f" : MUT;
  const cx = x + w / 2, cy = y + h / 2 - 22;
  // recolor strokes for dark tiles by wrapping (we just keep light tiles for clarity)
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${bg}" stroke="${dark ? "#34383d" : LINE}" stroke-width="1.5"/>
  <text x="${x + 22}" y="${y + 40}" font-family="Cormorant Garamond SemiBold" font-size="30" fill="${RED}">${n}</text>
  <g transform="translate(${cx},${cy}) scale(1.35)">${inner}</g>
  <text x="${cx}" y="${y + h - 50}" text-anchor="middle" font-family="Cormorant Garamond SemiBold" font-size="34" fill="${ink}">${name}</text>
  <text x="${cx}" y="${y + h - 26}" text-anchor="middle" font-family="Hanken Grotesk Medium" font-size="16" fill="${mut}">${desc}</text>`;
}

const cards = OPTS.map((s, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  return tile(50 + col * 500, 300 + row * 410, 480, 390, s[0], s[1], s[2], s[3], false);
}).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${PARCH}"/>
  <text x="${W / 2}" y="120" text-anchor="middle" font-family="Cormorant Garamond SemiBold" font-size="68" fill="${INK}">The Apex — as a track</text>
  <rect x="${W / 2 - 90}" y="142" width="180" height="5" fill="${RED}"/>
  <text x="${W / 2}" y="196" text-anchor="middle" font-family="Hanken Grotesk Medium" font-size="22" letter-spacing="4" fill="${MUT}">ORIGINAL CIRCUIT + CORNER MARKS</text>
  ${cards}
  <text x="${W / 2}" y="${H - 36}" text-anchor="middle" font-family="Hanken Grotesk Medium" font-size="22" fill="${MUT}">Pick one — I'll perfect the curves, add a chrome/dark version, and build the lockup.</text>
</svg>`;

const fontFiles = [
  "node_modules/@expo-google-fonts/cormorant-garamond/600SemiBold/CormorantGaramond_600SemiBold.ttf",
  "node_modules/@expo-google-fonts/hanken-grotesk/500Medium/HankenGrotesk_500Medium.ttf",
];
const r = new Resvg(svg, { fitTo: { mode: "width", value: 1080 }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Cormorant Garamond SemiBold" } });
writeFileSync("/tmp/stuttgart-archive-track.png", r.render().asPng());
console.log("ok");
