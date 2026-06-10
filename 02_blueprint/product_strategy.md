# Product Strategy — "FitLedger" (working name)

**Date:** 2026-06-10 · **Owner decision:** custom pick after three research rounds — "Fitness app
and macro calculator, track runs, workouts, but connects with everything." Target buyer 18–35.

## Product name

**FitLedger** — *Your fitness, in a ledger you own.* (Working name; trademark screening is an
owner task before launch — see `legal_risk_review.md`. Alternates: **RepBook**, **MacroDeck**.)

## What it is

A **local-first fitness web app (PWA)** sold as a **one-time purchase** — no subscription, no
account, no server storing your data:

1. **Macro calculator** — BMR/TDEE (Mifflin-St Jeor) + activity level + goal → daily calorie and
   protein/carb/fat targets, with adjustable splits. General-wellness tool with clear
   disclaimers; no medical or individualized nutrition advice.
2. **Nutrition log** — daily food logging against targets using a curated USDA-derived common
   foods database (public domain) + custom foods + quick-add macros.
3. **Workout tracker** — strength logging (exercises, sets × reps × weight), auto volume/PR
   detection, progressive-overload view.
4. **Run/cardio tracker** — distance, time, pace; weekly mileage and trends.
5. **"Connects with everything" (v1 = universal file import/export)** — imports **GPX/TCX/FIT/CSV**
   files, the standard exports from Strava, Garmin Connect, and Apple Health; exports everything
   to CSV/JSON anytime. Live OAuth syncs (Strava API first) are the flagship roadmap item —
   honest framing: "works with your existing data via files today, live sync on the roadmap."
6. **Dashboard** — streaks, weekly summary, PRs, macro adherence, all charts client-side.

All data lives in the buyer's browser (IndexedDB) with file-based backup/restore. That single
architecture decision creates the marketing wedge, eliminates hosting/privacy/GDPR exposure,
and makes one-time pricing economically sane (no per-user server costs).

## Why this buyer would pay

- The macro/calorie app market is **$4.14B (2026), growing 9.27%/yr**, and the leaders charge
  recurring fees: MyFitnessPal Premium **$79.99/yr** (Premium+ $99.99), MacroFactor **$71.99/yr**
  with **no free tier**. Subscription fatigue in this exact category is documented.
- 18–35 lifters/runners already vocally use spreadsheets and FitNotes-style apps to escape
  subscriptions; FitNotes proves local-first demand but is Android-only and lifting-only.
- **Gap:** no polished product combines macros + lifting + runs + file-based device import in
  one local-first, one-time-purchase package. FitLedger costs less than 6 months of MacroFactor,
  once, forever.

## Why now

Subscription fatigue is peaking while the tracking market still grows ~9%/yr; the "own your
data" angle aligns with 2026's documented AI/privacy trust gap in fitness apps (only 33% of
Gen Z trust AI wellness apps).

## Risks (summary — full review in `legal_risk_review.md`)

| Risk | Level | Mitigation |
|---|---|---|
| Crowded category vs free apps | High | Don't compete on database size or AI coaching; compete on ownership, one-time price, multi-domain coverage |
| "Connects with everything" overpromise | High | Sell only what ships: file import/export. Roadmap stated as roadmap. No "syncs with Strava" claims in v1 copy |
| Health-advice liability | Medium | Standard formulas only, prominent disclaimers, no prescriptions, eating-disorder-aware copy |
| Browser data loss | Medium | Aggressive backup/export UX, clear warnings, restore flow |
| Working-name trademark collision | Medium | Owner screening task pre-launch; name isolated to one config constant |

## MVP scope (v1.0 — what gets built in Phase 4)

Single-page PWA (no backend): macro calculator, nutrition log + foods DB, workout logger,
run logger, GPX/TCX/CSV import (FIT documented; converted via free tools), CSV/JSON export,
backup/restore, dashboard, onboarding, installable offline PWA. Plus buyer docs per the brief.

## Premium / roadmap scope (v1.x–v2)

Strava OAuth live sync (needs owner-registered API app), FIT native parsing, barcode lookup via
Open Food Facts (optional online feature, ODbL attribution), training templates pack, multi-device
sync via user's own cloud-file storage, Apple Health/Garmin live integrations (heavier approval
processes — Garmin commercial API requires business approval).

## Differentiation angle (one sentence)

**The anti-subscription fitness tracker: macros, lifts, and runs in one app you buy once and own
completely — your data never leaves your device.**
