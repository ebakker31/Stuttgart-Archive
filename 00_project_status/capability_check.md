# Capability Check — Digital Product Launch Agent

**Date:** 2026-06-10
**Repo:** `ebakker31/Stuttgart-Archive`, branch `claude/affectionate-noether-ceaahh`
**Status:** Phase 1 complete — live market research IS possible. Proceeding to Phase 2.

---

## 1. Repo context (important)

This repository is **not empty**. It already contains a prior product: **Stuttgart Archive**,
a Next.js + Supabase + Stripe MVP — an independent digital archive/documentation platform for
Porsche ownership records, provenance, and listing preparation (free core product, paid upgrades,
mock-mode fallbacks for all external services).

Implications:
- New launch-agent folders (`/00_project_status` … `/08_final_package`) are created at repo
  root **alongside** the existing app. Nothing in the existing app is modified or deleted.
- One legitimate research angle in Phase 2 is a digital product **adjacent to Stuttgart
  Archive** (e.g., a collector-car documentation/sale-prep toolkit), since the niche knowledge
  and audience already exist. It will be scored against unrelated ideas on the same rubric —
  no special treatment.

## 2. Available tools

| Capability | Tool(s) | Status |
|---|---|---|
| Live web search | `WebSearch` | ✅ Available (verified loaded) |
| Web page fetch/read | `WebFetch` | ✅ Available |
| File creation (md, csv, html, js, ts) | Write/Edit tools | ✅ Available |
| Spreadsheet generation | Node 22 / Python 3.11 + LibreOffice (headless convert to `.xlsx`/`.pdf`) | ✅ Available |
| PDF generation | Markdown/HTML → LibreOffice or print-ready HTML | ✅ Available |
| Code/calculator/mini-app builds | Node v22.22.2, npm 10.9.7, TypeScript toolchain in repo | ✅ Available |
| Git version control + push | git, remote `origin` | ✅ Available |
| GitHub operations | GitHub MCP server | ⚠️ Available, connection intermittent this session |
| Shopify store operations | Shopify MCP server (read shop, create products, etc.) | ⚠️ Available, connection intermittent; **will not create/modify anything without explicit approval** |

## 3. Missing tools

- **No Python PDF/xlsx libraries preinstalled** (no `openpyxl`, `reportlab`, `pandas`). pip is
  available; installation is possible if needed, otherwise LibreOffice headless covers conversion.
- **No image-generation capability** — product cover art / mockup images cannot be produced as
  finished graphics. Workaround: deliver text/spec for covers + clean HTML/CSS-rendered covers
  exported via LibreOffice, and note this as an owner task.
- **No `gh` CLI** — GitHub interactions go through the MCP server.
- **No email/Notion/Etsy/Gumroad APIs** — Notion-format products would ship as importable
  Markdown/CSV plus setup instructions rather than a live Notion link.

## 4. Risks caused by missing tools

| Risk | Severity | Mitigation |
|---|---|---|
| Product visuals (covers, mockups) below marketplace standard | Medium | Ship print-ready HTML/CSS covers; flag professional cover design as a pre-launch owner task |
| Notion-native products can't be delivered as a live duplicate link | Medium | Prefer spreadsheet/PDF/template-pack/web-calculator formats, or ship Notion products as import files + instructions |
| MCP connection drops mid-session | Low | All deliverables live in-repo; Shopify/GitHub steps are documented as instructions the owner (or a later session) can execute |
| Live data behind paywalls (e.g., paid market reports) | Low | Use multiple free sources; cite only what was actually verified |

## 5. Workaround plan

1. Build products in formats fully producible here: Markdown/PDF guides, CSV/XLSX spreadsheets
   (via LibreOffice headless), HTML/JS calculators and mini-apps, template packs, course content.
2. Cite every market/competitor/trend claim to a fetched source in `/01_research/source_notes.md`.
3. Keep Shopify steps as **written instructions + ready-to-paste assets**; only touch the live
   store after explicit approval.
4. Anything that cannot be verified live is labeled **ASSUMPTION** in research files.

## 6. Live market research possible?

**Yes.** `WebSearch` and `WebFetch` are loaded and functional. Phase 2 will use live research
with cited sources — no guessed trends.
