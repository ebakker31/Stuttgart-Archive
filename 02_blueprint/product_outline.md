# Product Outline — FitLedger v1.0 (MVP build spec)

## Architecture

- **Single-page PWA**: HTML + CSS + vanilla TypeScript/JavaScript, no framework lock-in, no
  backend, no analytics, no network calls in v1 (fully offline after load).
- **Storage:** IndexedDB (via a small wrapper) + JSON backup/restore files; LocalStorage only
  for preferences.
- **Distribution:** buyer receives a zip (self-host/open locally) **and** access instructions
  for a hosted static copy (owner uploads to Netlify/Vercel/Cloudflare Pages later — static
  hosting is free). License = personal use, per `LICENSE_AND_USAGE.md`.
- Built in `/03_product/source_files/` with the deliverable app in
  `/03_product/final_product/app/`.

## Modules

### 1. Onboarding & disclaimers
- First-run: units (metric/imperial), profile (age, sex for BMR formula, height, weight,
  activity level, goal), explicit general-wellness disclaimer acceptance.
- All profile inputs editable later; nothing leaves the device.

### 2. Macro calculator
- Mifflin-St Jeor BMR → TDEE via activity multipliers → goal adjustment (maintain / gain /
  lose, capped at conservative ±20%) → macro split presets (balanced / higher-protein /
  lower-carb) + fully manual override.
- Shows the math. Hard floors (never outputs below safety-floor calories; nudges to
  professionals for medical conditions, pregnancy, ED history — see legal review).

### 3. Nutrition log
- Day view: meals → foods → totals vs targets with progress bars.
- Foods: curated USDA FoodData Central subset (~600 common whole/staple foods, public domain,
  attributed), custom foods, quick-add macros, recent/favorites, copy yesterday.

### 4. Workout tracker
- Workout = exercises → sets (weight × reps, optional RPE). Exercise library (~120 common
  movements, original descriptions) + custom exercises.
- Auto-detected PRs (1RM est. via Epley, volume PRs), per-exercise history charts,
  progressive-overload trend view. Templates: save any workout as template.

### 5. Run / cardio tracker
- Manual entry: type, distance, duration → pace auto-calc; optional HR avg, notes.
- Weekly mileage chart, pace trends, distance PRs.

### 6. Import / export ("connects with everything" v1)
- **Import:** GPX and TCX (parse directly), CSV (guided column mapper for Strava/Garmin
  bulk-export CSVs and generic sheets). FIT: documented conversion path via free converters
  (native parsing = roadmap). Dedupe on import.
- **Export:** full CSV (per domain) + complete JSON backup; one-click restore.

### 7. Dashboard
- Today card (targets, planned workout), week summary (sessions, volume, mileage, macro
  adherence %), streaks, recent PRs, 12-week trend charts (client-side canvas/SVG — no
  charting CDN dependency).

## Buyer-facing docs (required by brief, in `/03_product/`)

`START_HERE.md`, `README_FOR_BUYER.md`, `FAQ.md`, `TROUBLESHOOTING.md`, `CHANGELOG.md`,
`LICENSE_AND_USAGE.md`, `DISCLAIMER.md` + `instructions/` (setup, import guides per platform,
backup guide), `examples/` (demo dataset + screenshots), `bonus_assets/` (printable gym log PDF,
macro cheat-sheet, 12-week consistency tracker spreadsheet).

## Out of scope v1 (roadmap — stated publicly)

Live OAuth syncs (Strava first), FIT native parsing, barcode scanning (Open Food Facts, ODbL),
multi-device sync, native mobile apps, AI features.
