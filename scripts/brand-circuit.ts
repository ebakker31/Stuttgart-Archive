/* Real racing-circuit marks -> PNG (resvg). Excluded from typecheck.
   npx tsx scripts/brand-circuit.ts  ->  /tmp/stuttgart-archive-circuit.png */
// @ts-nocheck
import { writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const RED = "#D5001C", INK = "#15171A", PARCH = "#F4F1EA", CARD = "#FBF9F4", LINE = "#D8D4C8", MUT = "#7d7f7a";
const W = 1080, H = 1500;

// Two original, intricate circuits (look like real track maps).
const CIRCUIT_A =
  "M-66,52 C-24,58 26,60 50,54 C76,47 82,30 70,18 C60,8 40,14 38,-2 " +
  "C36,-18 58,-20 60,-38 C62,-58 40,-64 22,-56 C7,-49 12,-28 -4,-26 " +
  "C-22,-24 -28,-44 -48,-40 C-70,-36 -74,-12 -62,4 C-52,17 -32,12 -32,28 " +
  "C-32,44 -52,40 -66,52 Z";

const CIRCUIT_B =
  "M-72,28 C-72,6 -54,-2 -34,-2 C-12,-2 -8,16 12,16 C30,16 30,-2 30,-18 " +
  "C30,-40 8,-50 8,-66 C8,-80 28,-84 46,-78 C70,-70 78,-44 66,-24 " +
  "C56,-8 34,-12 30,4 C27,18 44,24 50,40 C56,58 38,70 16,68 " +
  "C-8,66 -10,46 -30,44 C-50,42 -52,62 -70,56 C-84,51 -82,40 -72,28 Z";

function startFinish(path, x, y, ax, ay) {
  // a short perpendicular start/finish tick on the main straight
  return `<line x1="${x - ax}" y1="${y - ay}" x2="${x + ax}" y2="${y + ay}" stroke="${RED}" stroke-width="6" stroke-linecap="round"/>`;
}

const chrome = `<linearGradient id="cr" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="#fdfdfe"/><stop offset="24%" stop-color="#c5c9cf"/>
  <stop offset="48%" stop-color="#7e838b"/><stop offset="52%" stop-color="#eff1f3"/>
  <stop offset="62%" stop-color="#9aa0a8"/><stop offset="84%" stop-color="#dee1e5"/>
  <stop offset="100%" stop-color="#878d94"/></linearGradient>`;

function circuit(d, stroke, sw = 4.2) {
  return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>${chrome}</defs>
  <rect width="${W}" height="${H}" fill="${PARCH}"/>

  <text x="${W / 2}" y="100" text-anchor="middle" font-family="Cormorant Garamond SemiBold" font-size="64" fill="${INK}">The Circuit</text>
  <rect x="${W / 2 - 80}" y="120" width="160" height="5" fill="${RED}"/>
  <text x="${W / 2}" y="170" text-anchor="middle" font-family="Hanken Grotesk Medium" font-size="20" letter-spacing="4" fill="${MUT}">AN ORIGINAL TRACK, RENDERED PROPERLY</text>

  <!-- HERO: chrome circuit on graphite (like the emblem you liked) -->
  <rect x="60" y="210" width="${W - 120}" height="430" rx="20" fill="${INK}"/>
  <g transform="translate(${W / 2},428) scale(2.78)">${circuit(CIRCUIT_A, "url(#cr)", 4.8)}</g>

  <!-- row of variations -->
  <rect x="60" y="680" width="300" height="330" rx="16" fill="${CARD}" stroke="${LINE}"/>
  <g transform="translate(210,825) scale(1.7)">${circuit(CIRCUIT_A, INK, 4.4)}${startFinish(CIRCUIT_A, -66, 52, 0, 9)}</g>
  <text x="210" y="978" text-anchor="middle" font-family="Cormorant Garamond SemiBold" font-size="26" fill="${INK}">02 — Ink on parchment</text>

  <rect x="390" y="680" width="300" height="330" rx="16" fill="${CARD}" stroke="${LINE}"/>
  <g transform="translate(540,825) scale(1.7)">${circuit(CIRCUIT_A, RED, 4.4)}</g>
  <text x="540" y="978" text-anchor="middle" font-family="Cormorant Garamond SemiBold" font-size="26" fill="${INK}">03 — Guards Red</text>

  <rect x="720" y="680" width="300" height="330" rx="16" fill="${INK}"/>
  <g transform="translate(835,810) scale(1.5)"><rect x="-70" y="-70" width="140" height="140" rx="22" fill="none" stroke="#3a3d42" stroke-width="2"/>${circuit(CIRCUIT_A, "url(#cr)", 5)}</g>
  <text x="870" y="978" text-anchor="middle" font-family="Cormorant Garamond SemiBold" font-size="26" fill="${PARCH}">04 — App icon</text>

  <!-- alternative circuit shape -->
  <rect x="60" y="1050" width="460" height="360" rx="16" fill="${CARD}" stroke="${LINE}"/>
  <g transform="translate(290,1210) scale(2.0)">${circuit(CIRCUIT_B, INK, 4.4)}${startFinish(CIRCUIT_B, -72, 28, 9, 2)}</g>
  <text x="290" y="1378" text-anchor="middle" font-family="Cormorant Garamond SemiBold" font-size="28" fill="${INK}">05 — A second circuit</text>

  <rect x="540" y="1050" width="480" height="360" rx="16" fill="${INK}"/>
  <g transform="translate(700,1205) scale(2.0)">${circuit(CIRCUIT_B, "url(#cr)", 4.8)}</g>
  <text x="780" y="1378" text-anchor="middle" font-family="Cormorant Garamond SemiBold" font-size="28" fill="${PARCH}">06 — Second, in chrome</text>

  <text x="${W / 2}" y="${H - 24}" text-anchor="middle" font-family="Hanken Grotesk Medium" font-size="20" fill="${MUT}">Pick a circuit (01/05) + a treatment. I'll refine the corners and pair it with the wordmark.</text>
</svg>`;

const fontFiles = [
  "node_modules/@expo-google-fonts/cormorant-garamond/600SemiBold/CormorantGaramond_600SemiBold.ttf",
  "node_modules/@expo-google-fonts/hanken-grotesk/500Medium/HankenGrotesk_500Medium.ttf",
];
const r = new Resvg(svg, { fitTo: { mode: "width", value: 1080 }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Cormorant Garamond SemiBold" } });
writeFileSync("/tmp/stuttgart-archive-circuit.png", r.render().asPng());
console.log("ok");
