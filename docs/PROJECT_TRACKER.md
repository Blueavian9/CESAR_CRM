# CESAR/CRM — Project Tracker

> **Read `docs/PRD.md` and this file first, every session, before touching code.**
> PRD = scope & acceptance criteria (source of truth for *what*). This file = status & log (source of truth for *where things stand*). Don't let them drift — if scope changes, edit the PRD and log the change here.
> Update the "Last Session Log" section at the end of every work session — even a short one — before ending the conversation.

---

## 1. Project Snapshot

- **What it is:** Multi-tenant property management platform (landlords/PMs, tenants, leases, payments, maintenance, screening).
- **Stack:** React 18 + TypeScript + Vite, Tailwind CSS, Lucide icons.
- **Backend:** Clerk (Auth) + Neon (Postgres, RLS-enforced) + Cloudflare R2 (storage) — replacing the original Bolt.new/Bolt Database scaffold.
- **Full scope:** `docs/PRD.md` (18 epics, reconstructed — original PRD not located).
- **Status:** Mid-Epic 1 (Foundation & Auth). Clerk installed and wired; Neon schema + RLS live and force-enforced; TypeScript build clean. Sign In/Sign Up UI and the Clerk `user.created` webhook not yet built.

## 2. Open Items

- [ ] Original 16-EPIC PRD still not located. Current `docs/PRD.md` is a reconstruction; treat as authoritative unless the original turns up and conflicts.
- [ ] `ARCHITECTURE.md` in repo root is still Bolt-flavored — leave as-is until Epic 1 is functionally complete, then rewrite (see PRD §7).

- [ ] Minor: `tsconfig.app.json` has a deprecated-`baseUrl` warning (TS 6/7). Fix is to delete the `"baseUrl": "."` line — `paths` already resolves relative to the tsconfig file under `moduleResolution: "bundler"`, so nothing depends on it. Not blocking, low priority.

## 3. Phase / Epic Checklist

Full scope and acceptance criteria for each epic are in `docs/PRD.md` §6. This section tracks completion only — don't duplicate the criteria text here, just check items off as the PRD's stated criteria are met.

- [ ] **Epic 1 — Foundation & Auth (Clerk + Neon migration)**
  - [x] Neon project provisioned/confirmed
  - [ ] `users`/`organizations` tables + Auth signup wiring
  - [x] Role model (`admin`/`manager`/`tenant`) enforced via RLS
  - [ ] Bolt SDK fully removed, Supabase also removed; Clerk SDK installed and provider wired in main.tsx. 

  
  - [ ] RLS policy pass across existing tables
  - [ ] Login/signup/forgot-password/tenant-login flows working end-to-end
  - [ ] *All 3 PRD acceptance criteria for Epic 1 verified*
- [ ] **Epic 2 — Dashboard & Properties**
- [ ] **Epic 3 — Tenants & Leads**
- [ ] **Epic 4 — Screening**
- [ ] **Epic 5 — Leases**
- [ ] **Epic 6 — Payments & Rent Collection** (schema/UI only, no live processor — see PRD Non-Goals)
- [ ] **Epic 7 — Maintenance Requests**
- [ ] **Epic 8 — Communications & Notifications**
- [ ] **Epic 9 — Tenant Portal**
- [ ] **Epic 10 — Reporting & Analytics**
- [ ] **Epic 11 — Document Management** (Bolt Storage → Supabase Storage)
- [ ] **Epic 12 — Security & Compliance**
- [ ] **Epic 13 — Automation & Workflows**
- [ ] **Epic 14 — Integrations & API**
- [ ] **Epic 15 — SEO & Performance** (public pages — can run in parallel, no blockers)
- [ ] **Epic 16 — Mobile & PWA**
- [ ] **Epic 17 — Testing & QA** (continuous, formalize before launch)
- [ ] **Epic 18 — Deployment & Launch**

## 4. Housekeeping Log

- `npm audit fix` run — 0 vulnerabilities remaining (was 13: 1 low, 1 moderate, 11 high).
- `docs/PROJECT_TRACKER.md` + lockfile committed and pushed (`ce1b03e`, 2026-08-31).
- `docs/PRD.md` drafted (reconstructed, 18 epics) — commit pending as of last check.
- `tsconfig.app.json` — deprecated `baseUrl` flagged, fix identified, not yet applied.

## 5. Last Session Log

*(Most recent entry on top. One entry per session — a few lines is enough: what changed, what's next, any open decision.)*


### 2026-09-20
- Verified via query against `pg_class` that all 5 core tables (`organizations`, `users`, `properties`, `units`, `tenants`) have both `relrowsecurity` and `relforcerowsecurity` = true in the live Neon "production" branch.
- Confirmed the earlier Vercel build failure (commit `09c08ad`, "npm run build" TS errors) was stale — current HEAD is a different commit that already contains the TypeScript fixes.
- Added FORCE ROW LEVEL SECURITY to `db/migrations/001_schema_and_rls.sql` to match the live database (see commit above).

### 2026-09-21
- Added `current_app_role()`; replaced `properties_isolation`, `units_isolation`, and `tenants_isolation` with role-aware `using` and `with check` clauses that exclude the `tenant` role.
- Verified via `pg_policies` that all three policies show `current_app_role() <> 'tenant'` in both clauses; committed as `3c838f2`.
- The reserved-keyword gotcha was caught: `current_role` is a PostgreSQL built-in, so the function is named `current_app_role()` instead.
- No PRD changes are needed until the automated cross-org/cross-role RLS test exists.
- **Next:** write the automated cross-org/cross-role RLS test before starting the Sign In/Sign Up UI or Clerk webhook, then gate dashboard routes behind auth and build the `user.created` webhook with a separate `bypassrls` connection.


### 2026-08-31 (session end — handing off to a new Claude session)
- Reviewed a `tsconfig.app.json` deprecation warning (`baseUrl`) — fix identified (delete the line), not yet applied to the file.
- Generated a resume prompt for starting a fresh Claude session, pointing it at this tracker + the PRD and instructing it not to re-derive settled decisions (Bolt→Supabase, epic breakdown).
- **Stopping point:** `docs/PRD.md` commit status unconfirmed — verify it's actually pushed before assuming the new session can read it from the repo. `package.json` Bolt/Supabase dependency check still not done.
- **Next:** in the new session — (1) confirm PRD is committed/pushed, (2) run the `package.json` check, (3) apply the `tsconfig.app.json` fix if not already done, (4) begin Epic 1 work.
- **Open decision:** none blocking.

### 2026-08-31 (cont'd)
- Drafted full PRD (`docs/PRD.md`) — 18 epics with scope, acceptance criteria, dependency graph. Reconstructed from ARCHITECTURE.md since original PRD wasn't located.
- Rewrote this tracker's checklist to mirror the PRD's Epic 1 criteria 1:1 instead of the earlier shorthand version.
- Tracker + lockfile committed/pushed. PRD not yet committed.

### 2026-08-31
- Reopened repo after pause. Confirmed `git status` clean except lockfile from `npm install`/`npm audit fix`.
- Flagged that `ARCHITECTURE.md` is stale (Bolt, not Supabase) and that the original 16-EPIC PRD is not currently locatable.
- Created this tracker as the canonical resume point.

### 2026-09-08
- Installed @clerk/clerk-react, removed unused @supabase/supabase-js dependency
- Wrapped app in <ClerkProvider> in src/main.tsx, wired to VITE_CLERK_PUBLISHABLE_KEY
- Confirmed app boots clean with Clerk loaded (dev-key warning only, expected)
- Next: build Sign In / Sign Up pages using Clerk's prebuilt components, gate dashboard routes behind auth