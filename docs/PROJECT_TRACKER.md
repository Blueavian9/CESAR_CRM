# CESAR/CRM — Project Tracker

> **Read this file first, every session, before touching code or asking the user to re-explain context.**
> Update the "Last Session Log" section at the end of every work session — even a short one — before ending the conversation. That's what makes cross-LLM resume actually work.

---

## 1. Project Snapshot

- **What it is:** Multi-tenant property management platform (landlords/PMs, tenants, leases, payments, maintenance, screening, communications).
- **Stack:** React 18 + TypeScript + Vite, Tailwind CSS, Lucide icons.
- **Origin:** Scaffolded via Bolt.new. `ARCHITECTURE.md` in the repo root still describes the *original* Bolt.new stack (Bolt Database for auth/storage/real-time/REST+RLS).
- **Current direction:** Migrating off Bolt Database → **Supabase** (Postgres + Auth + Storage + Realtime + RLS). This decision predates this tracker; a prior "16-EPIC PRD" reportedly detailed the migration but the file is currently missing/unlocated.
- **Status:** Paused mid-migration for client/portfolio work. Resuming now.

## 2. Known Discrepancies to Resolve First

- [ ] Locate or reconstruct the 16-EPIC PRD (check: old chat exports, Notion, Google Docs, local `/docs`, git log/branches for a `supabase-migration` branch, closed GitHub issues/PRs).
- [ ] `ARCHITECTURE.md` needs a rewrite pass once Supabase migration scope is confirmed — right now it's Bolt-flavored and will mislead any future contributor (including future LLM sessions) if left as-is.
- [ ] Confirm current `package.json` deps: is `@bolt/*` or Bolt SDK still present? Is `@supabase/supabase-js` already installed? (Determines how far migration actually got before pause.)

## 3. Phase Checklist (from ARCHITECTURE.md §4, annotated for the Supabase migration)

- [ ] **Phase 1 — Foundation & Auth**
  - [ ] Decide final backend: Supabase (assumed) — confirm no reason to reconsider
  - [ ] Stand up Supabase project (or confirm one already exists)
  - [ ] Port `users` table + role model (`admin`/`manager`/`tenant`) to Supabase Auth + profile table
  - [ ] Recreate RLS policies per table (Bolt RLS ≠ Supabase RLS syntax — needs rewrite, not copy-paste)
  - [ ] Swap Bolt SDK calls → `@supabase/supabase-js` client setup
- [ ] **Phase 2 — Dashboard & Properties**
- [ ] **Phase 3 — Tenants & Leads**
- [ ] **Phase 4 — Screening**
- [ ] **Phase 5 — Leases**
- [ ] **Phase 6 — Payments & Rent Collection**
- [ ] **Phase 7 — Maintenance Requests**
- [ ] **Phase 8 — Communications & Notifications**
- [ ] **Phase 9 — Tenant Portal**
- [ ] **Phase 10 — Reporting & Analytics**
- [ ] **Phase 11 — Document Management** (Bolt Storage → Supabase Storage buckets)
- [ ] **Phase 12 — Security & Compliance**
- [ ] **Phase 13 — Automation & Workflows**
- [ ] **Phase 14 — Integrations & API**
- [ ] **Phase 15 — SEO & Performance**
- [ ] **Phase 16 — Mobile & PWA**
- [ ] **Phase 17 — Testing & QA**
- [ ] **Phase 18 — Deployment & Launch**

(Phases 1–18 mirror ARCHITECTURE.md's original list; the Supabase migration mostly front-loads work into Phase 1 and Phase 11, everything else is largely stack-agnostic once the client wrapper is swapped.)

## 4. Core Schema Reference

Tables (see ARCHITECTURE.md §3 for full column lists): `users`, `organizations`, `properties`, `units`, `tenants`, `leads`, `applications`, `screenings`, `leases`, `payments`, `maintenance_requests`, `communications`, `documents`, `notifications`, `audit_logs`.

No schema changes needed for the migration itself — Postgres → Postgres. The work is auth/RLS/storage/client-SDK, not data modeling.

## 5. Housekeeping Log

- `npm audit fix` run — 0 vulnerabilities remaining (was 13: 1 low, 1 moderate, 11 high). `package-lock.json` updated, `package.json` unchanged. Safe to commit as its own small commit.

## 6. Last Session Log

*(Most recent entry on top. One entry per session — a few lines is enough: what changed, what's next, any open decision.)*

### 2026-08-31
- Reopened repo after pause. Confirmed `git status` clean except lockfile from `npm install`/`npm audit fix`.
- Flagged that `ARCHITECTURE.md` is stale (Bolt, not Supabase) and that the original 16-EPIC PRD is not currently locatable.
- Created this tracker as the canonical resume point.
- **Next:** locate/reconstruct the PRD (see §2), then start Phase 1 checklist.
- **Open decision:** none blocking — Supabase is confirmed direction, just need to verify how much of the migration was already done before pause.