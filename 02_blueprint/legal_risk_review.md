# Legal & Compliance Risk Review — FitLedger (blueprint stage)

> This file is an operational risk review, not legal advice. A licensed attorney review is
> recommended before launch (flagged again in Phase 9 acceptance checklist).

## 1. Health / nutrition liability — MEDIUM, mitigated

- The macro calculator is a **general-wellness informational tool** using published, standard
  formulas (Mifflin-St Jeor; Epley for est. 1RM). It must never present output as medical,
  dietetic, or individualized treatment advice.
- Mitigations built into the product (not just fine print): conservative deficit/surplus caps;
  hard calorie floor below which the app shows guidance to seek professional help instead of a
  target; first-run disclaimer acceptance; persistent "informational tool" labeling; copy
  avoids "lose X lbs" outcome promises entirely; eating-disorder-aware language (no
  "aggressive cut" presets).
- `DISCLAIMER.md` + in-app disclaimer: not medical advice; consult a professional before
  changing diet/exercise, especially with any condition, pregnancy, or history of disordered
  eating; individual results vary; US-style wellness disclaimer language.
- **No medical claims = no FDA/MDR software-as-medical-device exposure** (tracker/calculator
  apps without diagnosis/treatment claims fall under general wellness).

## 2. Data privacy — LOW (by architecture)

- No account, no server, no analytics, no network calls in v1 → effectively no personal-data
  processing by the seller; GDPR/CCPA exposure limited to the storefront (handled by
  platform / privacy-policy notes in Phase 6).
- Honest framing required: "we never see your data" is true and verifiable from the code.

## 3. IP / content — LOW-MEDIUM

- **Foods data:** USDA FoodData Central is U.S. public domain — bundling a curated subset is
  permitted; attribute as good practice. **Do not** scrape/bundle MyFitnessPal, Nutritionix,
  or other proprietary databases. Open Food Facts (roadmap barcode feature) is ODbL —
  attribution + share-alike obligations documented before that feature ships.
- **Exercise library:** original descriptions written for this product; no copied app content.
- **All code original** in this repo; no GPL contamination (vanilla TS, no copied libraries).
- **Trademarks:** "Strava," "Garmin," "Apple Health," "MyFitnessPal," "MacroFactor" used only
  descriptively/comparatively (file-format compatibility and price comparison) — lawful
  nominative use; no logos, no "official integration" implication. Comparison table must carry
  "prices as of June 2026" qualifier.
- **Product name:** "FitLedger" is a working name. **Owner task before launch:** USPTO/EUIPO
  knockout search + app-store/domain search. Name is isolated in one config constant for
  cheap rename.

## 4. Marketing claims — controlled

- Banned by project rules and reconfirmed here: fake testimonials/reviews, invented user
  counts, income/outcome guarantees, fake scarcity, fabricated "as seen in."
- Allowed and substantiated: competitor pricing (cited), market-size stat (cited), "your data
  never leaves your device" (architecturally true), "buy once" (true; v1.x updates included —
  scope of included updates stated precisely to avoid lifetime-update ambiguity).
- "Connects with everything" must not appear as a literal claim; v1 copy says "imports the
  standard export files from Strava, Garmin, and Apple Health (GPX/TCX/CSV)" + public roadmap.

## 5. Consumer / refund law — LOW

- 14-day refund policy (draft in Phase 6) meets/exceeds marketplace norms; EU digital-content
  withdrawal nuances handled by choosing a merchant-of-record platform (Lemon Squeezy) or
  Shopify policy text.

## 6. Open items for owner before launch

1. Attorney glance at `DISCLAIMER.md` + refund/terms drafts (Phase 6 outputs).
2. Trademark knockout search on chosen name.
3. Confirm storefront tax setup (or pick merchant-of-record platform).
4. If/when Strava sync ships: Strava API agreement compliance review (their brand & data terms).
