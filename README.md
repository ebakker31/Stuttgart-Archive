# Stuttgart Archive

**Preserve the story behind the machine.**

Stuttgart Archive is a premium, independent digital archive for Porsche ownership,
paperwork, provenance, buying, selling, collecting, documentation, and listing
preparation. It helps owners, buyers, sellers, collectors, dealers, and brokers turn
scattered records into a clean, trusted, buyer-ready vehicle profile — and share only
what they approve.

> It feels like opening a private automotive archive: clean, elegant, historical,
> precise, visual, respectful, and collector-grade.

---

## ⚖️ Brand & trademark disclaimer

**Stuttgart Archive is an independent platform and is not affiliated with, endorsed by,
sponsored by, or connected to Porsche AG, Porsche Cars North America, the Porsche Museum,
the official Porsche company archive, Stuttgart City Archive, Bring a Trailer, Cars & Bids,
PCARMARKET, Meta, Instagram, Apple, Stripe, or any auction/listing platform. Porsche and
related model names are trademarks of their respective owners and are used only for
descriptive purposes.**

This product uses **no** official Porsche logos, crest, typography, imagery, or brand
assets. The visual identity (archival parchment, graphite, silver dividers, a single
muted oxblood accent, museum-style captions) is original and intentionally distinct from
any official Porsche design system.

### Historical tribute design

The site includes a tasteful, non-infringing storytelling layer ("Built for cars with a
story") that pays tribute to automotive engineering and craftsmanship using **original
copy and generic design motifs** — timelines, archive labels, technical/spec cards, and
museum-style captions. It makes **no specific historical claims** unless they come from
user-provided or reliable public sources.

---

## Free public platform

The core product is **free to use**. Free accounts can create an account, choose a mode,
add up to 3 vehicles, build a digital garage, upload limited documents and photos, build
basic service and modification timelines, use buyer due-diligence checklists, create a
basic public page, generate limited AI summaries, and download a basic records summary.
Paid upgrades add capacity and advanced tools but the free product is genuinely useful.

### User modes ("What are you here to do?")

`Owner` · `Collector` · `Buyer` · `Seller` · `Auction prep` · `Dealer / Broker` ·
`Researcher`. The selected mode customizes the dashboard, navigation, first actions,
empty states, and AI suggestions.

---

## Tech stack

- **Next.js (App Router)** + **TypeScript** + **Tailwind CSS** + handcrafted shadcn-style UI
- **Supabase** — auth, PostgreSQL, storage, row-level security
- **OpenAI-compatible LLM abstraction** (`lib/llm`) with a safe mock mode
- **Stripe** — web payments (Checkout, subscriptions, one-time, portal, webhooks)
- **Resend** — transactional + lifecycle email (with mock mode)
- App-Store-ready payment **abstraction** for future iOS in-app purchases
- Mock Instagram / Meta Ads integration placeholders

> **Everything degrades to a clearly-labeled mock mode** when its credentials are absent,
> so the app **builds and runs with zero external accounts**.

---

## Local setup

```bash
git clone <this repo>
cd Stuttgart-Archive
npm install
cp .env.example .env.local      # fill in what you have; blanks → mock mode
npm run dev                     # http://localhost:3000
```

With **no keys at all**, you get the full marketing site, the public demo archive
(`/demo`, `/explore`, `/v/[slug]`), and the entire app (`/app`) running against the
clearly-labeled demo data.

### Build / typecheck / test

```bash
npm run build       # production build
npm run typecheck   # tsc --noEmit
npm test            # vitest — guardrail + scoring unit tests
```

The test suite (`tests/`) exercises the product's core safety guarantees: the
Claim Verification, Privacy Guard, Brand Guardian, and Document agents, the readiness
scoring, and the approval-gating contract that keeps Instagram/ad/buyer-reply/public-page
agents from ever auto-executing. CI (`.github/workflows/ci.yml`) runs typecheck, tests,
and a build on every push and PR.

---

## Supabase setup

1. Create a project at supabase.com.
2. In **SQL Editor**, paste and run [`supabase/schema.sql`](supabase/schema.sql). This
   creates every table, **enables row-level security with org isolation**, adds a
   new-user trigger (creates an organization + profile + free plan + entitlement on
   signup), and a private `vehicle-files` storage bucket.
3. Copy your keys into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
4. (Optional) seed the demo archive: `npm run seed`.

Once configured, real auth + per-organization data replace demo mode automatically.

---

## Stripe setup

1. Create products/prices in the Stripe dashboard for: Archive Plus, Collector, Dealer
   (subscriptions) and Seller Pack, Auction Pack (one-time). Put the price IDs in
   `.env.local` (`STRIPE_*_PRICE_ID`).
2. Set `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Add a webhook endpoint → `https://<your-domain>/api/stripe/webhook`, subscribe to
   `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`, and set `STRIPE_WEBHOOK_SECRET`.
4. Test with Stripe test keys: the **Billing** page and `PaymentButton` start Checkout;
   on success the webhook grants the matching **entitlement** (source-agnostic).

Without `STRIPE_SECRET_KEY`, checkout runs in **mock mode** — the upgrade flow is fully
clickable and returns to `/app/billing?mock_checkout=1`.

### Trials

Add a trial period to the Stripe **Price**; Checkout applies it automatically.

---

## Resend / email setup

Email runs in **mock mode** by default (no key needed): messages are logged to the
console and recorded in the `emails` table with status `mocked`.

To send real email:

1. **Buy a domain** (e.g. `stuttgartarchive.com`) from any registrar.
2. **Add the domain to Resend** (Domains → Add Domain).
3. **Verify DNS records** — add the SPF, DKIM, and (recommended) DMARC records Resend
   shows to your DNS provider; wait for verification.
4. **Set environment variables**: `RESEND_API_KEY`, `EMAIL_MOCK_MODE=false`, and the
   `EMAIL_FROM_*` addresses (`noreply@`, `support@`, `hello@`, `concierge@`, `updates@`).
5. **Test**: trigger a welcome email (sign up) or a lead (submit an inquiry on a public
   page) and confirm delivery in Resend's dashboard and the `emails` table.
6. **Switch to production**: set `EMAIL_MOCK_MODE=false` once DNS is verified.

**Email rules** (enforced in `lib/email/service.ts`): system mail sends from `noreply`;
marketing mail requires opt-in + an unsubscribe link; buyer/seller messages are
notifications only — the platform never replies on a user's behalf without approval.

Templates: welcome, email verification, password reset, lead notification, seller packet
shared, buyer inquiry, payment receipt, upgrade confirmation, weekly activity summary,
founder notification.

---

## Future App Store (iOS) payment setup

The web app does **not** process App Store purchases. The entitlements layer is
**source-agnostic** (`free | stripe | app_store | admin`), so a future native iOS app can
grant identical capabilities. See `lib/payments/app-store.ts` for the placeholder provider
and **reserved product identifiers**:

| Capability    | App Store product id                       |
| ------------- | ------------------------------------------ |
| Archive Plus  | `com.stuttgartarchive.plus.monthly`        |
| Collector     | `com.stuttgartarchive.collector.monthly`   |
| Dealer        | `com.stuttgartarchive.dealer.monthly`      |
| Seller Pack   | `com.stuttgartarchive.sellerpack`          |
| Auction Pack  | `com.stuttgartarchive.auctionpack`         |

When the native app ships: present StoreKit products → send the signed transaction to a
verification endpoint → validate with Apple's App Store Server API using
`APP_STORE_SHARED_SECRET` → call `grantEntitlement({ source: "app_store", … })`.

---

## Environment variables

See [`.env.example`](.env.example). Everything blank ⇒ mock mode. Keys: app URL + admin
emails, Supabase, LLM, Resend/email, Stripe (+ price IDs), Instagram/Meta Ads (mock),
App Store shared secret.

---

## Demo data

`lib/demo-data.ts` defines six sample vehicles, each fully fleshed out (service,
modifications, documents, photos, archive notes, ownership story, scores, tasks, Instagram
drafts, ad brief, listing draft):

1. 2018 911 Carrera S · 2. 2021 Cayman GT4 · 3. 1997 911 Carrera (993) ·
4. 2020 Taycan Turbo · 5. 2016 Boxster Spyder · 6. 2007 911 Turbo

> **Every demo record is flagged `is_demo = true` and labeled in the UI with:**
> *"This is sample demo data, not a real vehicle listing."* Demo data is **never** mixed
> with real user data.

Run `npm run seed` to load it into Supabase.

---

## How the AI agents work

All agents live in `lib/agents/` (30+ files) and share one envelope (`AgentResult`):
`output`, `confidence`, `sources`, `assumptions`, `missingData`, `nextActions`,
`riskFlags`, `approvalRequired`, `externalSideEffect`.

- **App-facing**: onboarding, document, timeline, missing-records, seller-packet, listing,
  auction-prep, instagram, ad, photo-coach, buyer-faq, buyer-due-diligence, privacy-guard,
  claim-verification, valuation-context, campaign, buyer-reply, public-page,
  archive-curator, brand-guardian.
- **Founder/operator**: founder-copilot, growth, research, seo, qa, self-critique,
  error-repair, support, revenue.

Agents are **deterministic-first**: they compute structured results from real user data
using rule-based logic and use the LLM only to polish prose. The `agent-runner` wraps every
run — it persists to `ai_agent_runs`, and **blocks any external side-effect** (publish,
message, charge) unless autopilot explicitly allows it. Instagram/ads are **never**
auto-executed in the MVP.

### Real-data-only rules

The AI never invents vehicle facts (service, accident, title, ownership, rarity, value,
options, originality, modifications, auction history, inspection results). It distinguishes
**verified fact / user-provided claim / document-supported / AI inference / missing /
unknown**, labels every output with sources + confidence, and rewrites unsupported absolute
claims into honest wording (see `CLAIM_SAFE_REWRITES` in `lib/brand.ts`).

### Privacy scoping

`getAgentScopedContext()` (`lib/agents/scoped-context.ts`) is the single gateway for agent
data: it verifies org membership, fetches **only** the selected vehicle (+ optional
documents), excludes unneeded private fields (VIN, leads), redacts document text unless the
agent needs it, and **logs the access** to `audit_events`. One customer's data is never
used for another.

---

## Buy / sell / auction / marketing tools

- **Buyer**: watchlist, comparisons, due-diligence checklist, questions to ask, verified vs.
  unverified claims, missing-document warnings, PPI reminders.
- **Seller**: seller packet PDF, listing + FAQ drafts, photo/walkaround checklists, known
  flaws, lead capture, buyer-reply drafts — privacy-checked before sharing.
- **Auction prep**: auction-style drafts, photo + video checklists, seller Q&A prep, comment
  response drafts, claim verification report, readiness score. **Independent of any auction
  platform.**
- **Marketing kit**: Instagram captions/reels/stories/hashtags, ad briefs, 7/14-day
  campaigns. **Drafts only — never auto-posted, never auto-launched, human approval
  required.**

Public content passes through **Privacy Guard**, **Claim Verification**, and **Brand
Guardian** before publishing/export.

---

## QA / self-critique / quality dashboard

`/app/admin/quality` (owner/admin only) runs the QA, Self-Critique, Brand Guardian, and
Founder Copilot agents and computes a **Launch Readiness Score (0–100)**. The app is not
marked launch-ready until auth works, payments + email are testable, public pages work,
privacy controls work, AI outputs are source-labeled, demo data is labeled, RLS is enabled,
core flows work on mobile, README + env are documented, and Brand Guardian finds no
high-risk affiliation language.

---

## Mock integrations

Instagram and Meta Ads are placeholders (`/app/settings/integrations`). They never post or
spend. Add OAuth credentials later to enable real connections. The LLM, email, Stripe, and
Supabase layers each have explicit mock modes.

---

## Deployment to Vercel

1. Push to GitHub and import the repo in Vercel.
2. Add the environment variables from `.env.example` (Project → Settings → Environment
   Variables). Set `NEXT_PUBLIC_APP_URL` to your deployed URL.
3. Deploy. Add the Stripe webhook pointing at `/api/stripe/webhook` and verify your Resend
   domain when you're ready for live payments/email.

---

## Launch checklist

- [ ] Run `supabase/schema.sql` (RLS enabled)
- [ ] Configure Supabase keys → real auth + data
- [ ] `npm run seed` (optional demo data)
- [ ] Stripe products + prices + webhook configured and tested
- [ ] Domain bought, added to Resend, DNS verified, `EMAIL_MOCK_MODE=false`
- [ ] `ADMIN_EMAILS` set for the quality dashboard
- [ ] Review `/app/admin/quality` Launch Readiness Score
- [ ] Replace placeholder legal pages with counsel-reviewed terms + privacy policy

---

## Roadmap

Real OCR/text extraction, true PDF rendering for packets, Instagram/Meta OAuth, native iOS
app with StoreKit, team roles for dealers, public explore filtering on live data, expansion
beyond Porsche to other enthusiast marques (the architecture already supports it).

## Known limitations (MVP)

- Document extraction and PDF export are stubbed/abstracted (deterministic extraction +
  HTML packet); wire a real OCR/PDF service for production.
- Some app sub-flows render representative content in demo mode and persist fully only when
  Supabase is connected.
- Legal pages are plain-language summaries, **not** a substitute for reviewed legal docs.
- The LLM mock mode paraphrases provided data only — connect a provider for richer copy.
