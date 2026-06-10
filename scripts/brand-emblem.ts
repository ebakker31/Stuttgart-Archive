/* Original chrome emblem options + wordmark(red line)+slogan -> PNG.
   Excluded from typecheck. Dev-only deps: @resvg/resvg-js + expo google fonts.
   Run: npx tsx scripts/brand-emblem.ts  ->  /tmp/stuttgart-archive-emblems.png */
// @ts-nocheck
import { writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const RED = "#D5001C"; // Guards Red (Indischrot)
const INK = "#1A1C1E";
const PANEL = "#23262A";
const PARCH = "#F4F1EA";
const MUT = "#7d7f7a";

const W = 1080, H = 1560;

const chrome = `
  <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#fcfcfd"/><stop offset="20%" stop-color="#c2c6cc"/>
    <stop offset="45%" stop-color="#7c818a"/><stop offset="50%" stop-color="#f2f4f6"/>
    <stop offset="56%" stop-color="#9aa0a8"/><stop offset="78%" stop-color="#dfe2e6"/>
    <stop offset="100%" stop-color="#888d94"/>
  </linearGradient>`;

function tile(x, y, w, h, n, name, inner) {
  const cx = x + w / 2, cy = y + h / 2 - 14;
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${PANEL}" stroke="#34383d" stroke-width="1.5"/>
  <text x="${x + 22}" y="${y + 40}" font-family="Cormorant Garamond SemiBold" font-size="30" font-weight="600" fill="${RED}">${n}</text>
  <g transform="translate(${cx},${cy})">${inner}</g>
  <text x="${cx}" y="${y + h - 26}" text-anchor="middle" font-family="Hanken Grotesk Medium" font-size="22" letter-spacing="3" fill="#c9ccd1">${name.toUpperCase()}</text>`;
}

// emblem 1: chrome SA ligature + red underline
const e1 = `
  <text text-anchor="middle" y="42" font-family="Cormorant Garamond SemiBold" font-size="150" font-weight="700" fill="url(#chrome)" stroke="#2b2e33" stroke-width="1">SA</text>
  <rect x="-58" y="62" width="116" height="7" rx="2" fill="${RED}"/>`;

// emblem 2: chrome A-frame + Guards Red crossbar
const e2 = `
  <line x1="-62" y1="74" x2="0" y2="-78" stroke="url(#chrome)" stroke-width="22" stroke-linecap="round"/>
  <line x1="62" y1="74" x2="0" y2="-78" stroke="url(#chrome)" stroke-width="22" stroke-linecap="round"/>
  <line x1="-30" y1="14" x2="30" y2="14" stroke="${RED}" stroke-width="13" stroke-linecap="round"/>`;

// emblem 3: chrome hex monogram
const e3 = `
  <polygon points="0,-86 74,-43 74,43 0,86 -74,43 -74,-43" fill="none" stroke="url(#chrome)" stroke-width="6"/>
  <text text-anchor="middle" y="30" font-family="Cormorant Garamond SemiBold" font-size="96" font-weight="700" fill="url(#chrome)" stroke="#2b2e33" stroke-width="0.8">SA</text>
  <rect x="-26" y="50" width="52" height="5" rx="2" fill="${RED}"/>`;

// emblem 4: chrome S crest + red diamond
const e4 = `
  <text text-anchor="middle" y="55" font-family="Cormorant Garamond SemiBold" font-size="180" font-weight="700" fill="url(#chrome)" stroke="#2b2e33" stroke-width="1">S</text>
  <rect x="-7" y="-92" width="14" height="14" fill="${RED}" transform="rotate(45)"/>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>${chrome}</defs>
  <rect width="${W}" height="${H}" fill="${INK}"/>

  <!-- wordmark bar (light) -->
  <rect x="0" y="0" width="${W}" height="250" fill="${PARCH}"/>
  <text x="30" y="44" font-family="Hanken Grotesk Medium" font-size="20" letter-spacing="4" fill="${RED}">THE WORDMARK + GUARDS RED LINE + SLOGAN</text>
  <text x="${W / 2}" y="138" text-anchor="middle" font-family="Cormorant Garamond SemiBold" font-size="72" font-weight="600" fill="#26292D">Stuttgart Archive</text>
  <rect x="${W / 2 - 235}" y="158" width="470" height="6" fill="${RED}"/>
  <text x="${W / 2}" y="200" text-anchor="middle" font-family="Hanken Grotesk Medium" font-size="22" letter-spacing="6" fill="${MUT}">PRESERVE THE STORY BEHIND THE MACHINE</text>

  <text x="30" y="300" font-family="Hanken Grotesk Medium" font-size="20" letter-spacing="4" fill="#c9ccd1">EMBLEM OPTIONS — ORIGINAL CHROME MARKS (NO CIRCLE)</text>

  ${tile(50, 330, 480, 380, "01", "SA Ligature", e1)}
  ${tile(550, 330, 480, 380, "02", "A-Frame", e2)}
  ${tile(50, 740, 480, 380, "03", "Hex Monogram", e3)}
  ${tile(550, 740, 480, 380, "04", "S Crest", e4)}

  <text x="30" y="1200" font-family="Hanken Grotesk Medium" font-size="20" letter-spacing="4" fill="#c9ccd1">HERITAGE SLOGAN — CHOOSE ONE</text>
  ${[
    "Preserve the story behind the machine.",
    "For the machines worth remembering.",
    "Keepers of the marque's record.",
    "Honour the build. Keep the record.",
    "Provenance, preserved.",
    "The marque, documented.",
  ].map((s, i) => `<text x="50" y="${1248 + i * 46}" font-family="Cormorant Garamond SemiBold" font-size="40" fill="${PARCH}">${String(i + 1)}.  ${s}</text>`).join("")}

  <text x="${W / 2}" y="${H - 28}" text-anchor="middle" font-family="Hanken Grotesk Medium" font-size="22" fill="${MUT}">Pick an emblem number + a slogan number — chrome shown; on the site it stays crisp at any size.</text>
</svg>`;

const fontFiles = [
  "node_modules/@expo-google-fonts/cormorant-garamond/600SemiBold/CormorantGaramond_600SemiBold.ttf",
  "node_modules/@expo-google-fonts/hanken-grotesk/500Medium/HankenGrotesk_500Medium.ttf",
];
const r = new Resvg(svg, { fitTo: { mode: "width", value: 1080 }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Cormorant Garamond SemiBold" } });
writeFileSync("/tmp/stuttgart-archive-emblems.png", r.render().asPng());
console.log("ok");
