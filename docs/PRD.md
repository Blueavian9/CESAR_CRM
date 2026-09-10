# CESAR/CRM — Product Requirements Document

**Status:** Reconstructed — original PRD not located. This supersedes it as source of truth.
**Companion doc:** `docs/PROJECT_TRACKER.md` (session-to-session status log — update that, not this, after each work session)

---

## 1. Overview

CESAR/CRM is a modular, multi-tenant property management platform serving property managers/landlords (primary users) and their tenants (portal users), covering the full lifecycle: lead → application → screening → lease → rent collection → maintenance → offboarding, plus reporting, documents, and communications.

## 2. Key Decision Baked Into This PRD

**Backend is a free-tier composed stack, not Supabase and not Bolt Database.** `ARCHITECTURE.md` in repo root still names Bolt Database throughout — that's stale, and so is any earlier reference to Supabase in this repo's docs. The confirmed stack, chosen entirely for zero recurring cost with no inactivity-pause risk:

| Concern | Provider | Notes |
|---|---|---|
| Auth | **Clerk** | Already installed & wired (`@clerk/clerk-react`, `ClerkProvider` in `main.tsx`) |
| Database | **Neon** (Postgres) | Free tier, no 7-day inactivity pause (the dealbreaker with Supabase's free tier) |
| File storage | **Cloudflare R2** | S3-compatible, free tier, no egress fees |
| Tenant isolation | **Postgres RLS**, with the API setting a per-request session variable | Decided 2026-09-08. See callout below — this is *not* automatic the way Supabase's was; the API must set the session variable itself |
| Realtime | **None initially — refetch-on-mutate** | No built-in equivalent to Supabase Realtime in this stack; add a dedicated service later only if a specific feature needs true push updates |

> ⚠️ **Important architectural callout, carried through every epic below:** Supabase auto-generated a REST API that enforced Postgres RLS per-request using the caller's JWT. Neon is *just* Postgres — nothing sets per-request org context for you. This stack requires a thin API layer (Vercel serverless functions or a small Node service) that (1) validates the Clerk session, (2) resolves the caller's `organization_id`/role, and (3) sets that as a Postgres session variable (`app.current_org_id`, via `set_config(..., true)` inside each request's transaction) consumed by RLS policies on every table. This is now the confirmed mechanism (decided 2026-09-08) — see `db/migrations/001_schema_and_rls.sql`. It changes the acceptance-testing burden versus Supabase: Epic 17's RLS test suite is covering hand-written policies, not a battle-tested platform default, so treat it as higher-risk and prioritize accordingly. The one gap RLS doesn't cover: the Clerk webhook that creates the very first `organizations`/`users` row on signup has no org context yet, so that code path uses a separate, privileged (`bypassrls`) connection — keep that path minimal and reviewed carefully, it's the one place RLS isn't protecting you.

Schema/routes are otherwise unchanged from ARCHITECTURE.md's original data model — this is a backend-provider swap, not a data model redesign.

## 3. Non-Goals (for this pass)

- Native mobile apps (PWA only — see Epic 16)
- Payment gateway selection/integration logic beyond "integration-ready" hooks (Epic 6 wires the schema and stub, doesn't pick/ship a processor)
- Multi-language/i18n
- True realtime push updates (deferred — see stack table above)

## 4. Success Metrics

- A property manager can go from signup → first property → first tenant → first lease → first rent payment logged, end-to-end, with no manual DB intervention.
- Tenant portal supports the same lease/payment/maintenance visibility with zero write access outside their own records (verified by an actual scoping/RLS test suite, not just UI hiding — see the architectural callout in §2).
- Zero rows in any table reachable by an org that doesn't own them (tenant isolation is the platform's core trust guarantee — treat as a launch blocker, not a nice-to-have. With no platform-enforced default, this is proven by tests, not assumed from the stack).

---

## 5. Epic Index

| # | Epic | Depends On |
|---|------|-----------|
| 1 | Foundation & Auth (Clerk + Neon migration) | — |
| 2 | Dashboard & Properties | 1 |
| 3 | Tenants & Leads | 1, 2 |
| 4 | Screening | 3 |
| 5 | Leases | 3, 4 |
| 6 | Payments & Rent Collection | 5 |
| 7 | Maintenance Requests | 3 |
| 8 | Communications & Notifications | 3 |
| 9 | Tenant Portal | 5, 6, 7, 8 |
| 10 | Reporting & Analytics | 2, 5, 6, 7 |
| 11 | Document Management | 1 |
| 12 | Security & Compliance | 1, 11 |
| 13 | Automation & Workflows | 6, 7, 8 |
| 14 | Integrations & API | 1, 12 |
| 15 | SEO & Performance (public pages) | — |
| 16 | Mobile & PWA | 9 |
| 17 | Testing & QA | all |
| 18 | Deployment & Launch | 17 |

---

## 6. Epics

### Epic 1 — Foundation & Auth (Clerk + Neon Migration)
**Goal:** Replace Bolt Database (and the previously-planned Supabase) with Clerk (auth) + Neon (Postgres) as the backend; establish the org/role/tenant-isolation model everything else depends on.

**Scope**
- Provision Neon project; confirm connection pooling setup (Neon's pooler vs. direct connection) for serverless/Vercel deployment
- Recreate `users`, `organizations` tables in Neon; wire Clerk webhook (`user.created`) → create matching `users`/`organizations` rows, no orphaned Clerk users
- Role model: `admin`, `manager`, `tenant` — stored on the `users` row, resolved via Clerk's session/JWT claims or a DB lookup keyed by `clerk_user_id`
- Implement the isolation mechanism decided in §2: Postgres RLS, with the API layer setting `app.current_org_id` via `set_config(..., true)` inside each request's transaction. Schema + policies live in `db/migrations/001_schema_and_rls.sql`.
- Build the thin API layer (Vercel serverless functions recommended, matching existing Vite/React deploy target) that all client data access routes through — no direct client-to-Neon queries
- Login/signup/forgot-password/tenant-login flows working end-to-end against Clerk, with the API layer correctly resolving org/role on every request

**Acceptance Criteria**
- [ ] A brand-new Clerk signup creates an `organizations` row + `users` row with `role = manager`, no orphaned Clerk users
- [ ] A tenant user can authenticate but is blocked — at the API/query layer, not just by routing — from any `/properties`, `/settings`, etc. data
- [ ] No Bolt SDK or Supabase SDK imports remain anywhere in the codebase (`grep -rE "bolt|supabase" src/` returns nothing)
- [ ] The chosen isolation mechanism (RLS-with-session-context vs. query-layer scoping) is documented in this file and has at least one automated test proving cross-org access fails

**Dependencies:** None — this blocks everything else.

---

### Epic 2 — Dashboard & Properties
**Goal:** Manager landing experience + property CRUD, the first "real" screen after login.

**Scope**
- Dashboard KPI cards (properties, active leases, vacant units, overdue payments) — real queries through the API layer, not placeholders
- Properties list/filter, create/edit, property detail with Overview/Units/Tenants/Financials/Maintenance/Documents/Settings tabs (tabs can stub until their owning epic lands)
- Units CRUD nested under properties, vacancy status tracking

**Acceptance Criteria**
- [ ] KPI cards reflect live Neon counts, scoped to the logged-in org
- [ ] Creating a property → creating a unit under it → both show up in list views without refresh (since there's no Realtime layer, this means refetch-on-mutate, not a live subscription)

**Dependencies:** Epic 1

---

### Epic 3 — Tenants & Leads
**Goal:** Lead capture through active/past tenant records.

**Scope**
- `/tenants` (all/active/past), `/tenants/leads`, `/tenants/applications`
- Lead → application conversion flow
- Tenant profile shell (tabs wired to later epics: lease, payments, maintenance, documents, comms log)

**Acceptance Criteria**
- [ ] A lead can be converted to an application without re-entering already-captured fields
- [ ] Tenant status transitions (`lead → active → past/evicted`) are logged (feeds Epic 12 audit log)

**Dependencies:** Epics 1, 2

---

### Epic 4 — Screening
**Goal:** Application screening workflow and results storage.

**Scope**
- `/screening` pending/completed views, `/screening/:id` detail
- `screenings` table wired to `applications`; store credit/background/eviction results (`report_data` JSONB for provider-specific payloads)
- Status-driven UI (pending → in-progress → completed → pass/fail)

**Acceptance Criteria**
- [ ] Screening result determines whether "Approve → generate lease" action is available on the application

**Dependencies:** Epic 3

---

### Epic 5 — Leases
**Goal:** Lease lifecycle from draft to signed to expired.

**Scope**
- `/leases` (active/expiring/expired), `/leases/new`, `/leases/:id`
- Lease ↔ unit ↔ tenant linkage; terms, dates, rent/deposit amounts
- Document attachment (signed lease file) — hooks into Epic 11 (Cloudflare R2)

**Acceptance Criteria**
- [ ] "Expiring soon" view is date-driven (e.g., ≤60 days to `end_date`), not manually flagged
- [ ] Creating a lease flips the unit's status to `occupied` automatically

**Dependencies:** Epics 3, 4

---

### Epic 6 — Payments & Rent Collection
**Goal:** Rent roll, payment history, overdue tracking. Schema + UI only — no live payment processor in this pass (see Non-Goals).

**Scope**
- `/payments` rent roll, history, overdue, schedules; `/payments/new`, `/payments/:id`
- Recurring schedule generation from lease terms (due dates derived from `start_date` + cadence)
- `status`/`payment_method`/`transaction_id` fields ready for a future gateway integration to populate

**Acceptance Criteria**
- [ ] Overdue payments view is computed (`due_date < today AND status != paid`), not manually tagged
- [ ] Rent roll totals reconcile against sum of active leases' `rent_amount`

**Dependencies:** Epic 5

---

### Epic 7 — Maintenance Requests
**Goal:** Tenant-reported issues through resolution.

**Scope**
- `/maintenance` (all/open/in-progress/completed), `/maintenance/new`, `/maintenance/:id`
- Priority/category, image attachments (Cloudflare R2), assignment
- Feeds tenant portal (Epic 9) for tenant-side visibility/creation

**Acceptance Criteria**
- [ ] A tenant-submitted request appears in the manager's `/maintenance` queue on next load (no Realtime layer — refetch-on-mutate or polling), correctly scoped to their org

**Dependencies:** Epic 3

---

### Epic 8 — Communications & Notifications
**Goal:** In-app messaging + automated notification triggers.

**Scope**
- `/communications` inbox/sent/templates/automated
- `notifications` table + UI bell/center (polled, not pushed — see stack table in §2)
- Trigger points: lease expiring soon, payment overdue, maintenance status change (wire the triggers here even though the fuller automation engine is Epic 13)

**Acceptance Criteria**
- [ ] A payment going overdue creates a `notifications` row for the relevant manager without manual action

**Dependencies:** Epic 3

---

### Epic 9 — Tenant Portal
**Goal:** Self-service experience for tenants, isolation-verified.

**Scope**
- `/tenant-portal`: dashboard, my lease, payment history, pay rent (integration-ready stub), submit/view maintenance requests, documents, messages

**Acceptance Criteria**
- [ ] Every query on this portal is provably scoped by the API layer to the authenticated tenant's own records — write an actual test for this (RLS-context test or query-scoping test, per whichever mechanism Epic 1 settled on), don't rely on UI filtering

**Dependencies:** Epics 5, 6, 7, 8

---

### Epic 10 — Reporting & Analytics
**Goal:** Financial/occupancy/maintenance/tenant reports, exportable.

**Scope**
- `/reports` with report-type selector, custom report builder, CSV/export
- Pulls from Epics 2, 5, 6, 7 data via the API layer — no new tables, mostly query/aggregation work

**Acceptance Criteria**
- [ ] Every report is org-scoped and matches manual spot-check totals against the source tables

**Dependencies:** Epics 2, 5, 6, 7

---

### Epic 11 — Document Management
**Goal:** Centralized file storage on Cloudflare R2, replacing Bolt Storage (and the previously-planned Supabase Storage).

**Scope**
- `/documents`, `/documents/upload`; `documents` table (`related_type`/`related_id` polymorphic link) in Neon
- Cloudflare R2 bucket structure + per-org access enforced via signed URLs issued by the API layer (R2 has no built-in per-row policy engine like Supabase Storage did — access control lives entirely in the API layer that mints signed URLs)

**Acceptance Criteria**
- [ ] A document uploaded under one org is not retrievable by another org's users — neither by guessing the R2 object key nor by requesting a signed URL through the API for an object outside their org

**Dependencies:** Epic 1

---

### Epic 12 — Security & Compliance
**Goal:** Audit trail + hardening pass across everything built so far.

**Scope**
- `audit_logs` table wired to key mutations (tenant status changes, lease creation, payment status changes, user role changes)
- Full audit of the isolation mechanism chosen in Epic 1 — re-verify it still holds after Epics 2–11 added tables/columns/routes (this audit matters more in this stack than it would have under Supabase, since there's no platform-level default to fall back on)
- Basic rate-limiting/input-validation pass on public-facing forms and on the API layer itself (signup, tenant-login, file upload endpoints)

**Acceptance Criteria**
- [ ] Every table with tenant-sensitive data has an isolation mechanism (RLS policy or enforced query-layer scoping) — produce a checklist/table mapping table → mechanism → verified (not just "exists")

**Dependencies:** Epics 1, 11

---

### Epic 13 — Automation & Workflows
**Goal:** Rules-based automation beyond the ad-hoc triggers seeded in Epic 8.

**Scope**
- Configurable automation rules (e.g., "3 days before lease expiry, notify manager + tenant")
- Automated late-fee flagging (flagging only — no charge processing, per Non-Goals)

**Acceptance Criteria**
- [ ] At least the lease-expiry and payment-overdue automations run on a schedule (Vercel Cron or equivalent free scheduled-function option) without manual trigger

**Dependencies:** Epics 6, 7, 8

---

### Epic 14 — Integrations & API
**Goal:** External-facing API + webhook/Zapier hooks for `/settings` → Integration settings.

**Scope**
- API key issuance/management per org, validated by the same API layer used internally
- Webhook config UI + delivery for key events (new lead, lease signed, payment received)

**Acceptance Criteria**
- [ ] An API key scoped to one org cannot read another org's data (same isolation guarantee as Epic 1/12, exercised via the external API surface, not just the app)

**Dependencies:** Epics 1, 12

---

### Epic 15 — SEO & Performance (Public Pages)
**Goal:** Marketing/landing pages discoverable and fast — this is the *public* area only (`/`, `/login`, `/signup`), not the authenticated app.

**Scope:** Per ARCHITECTURE.md §6 — SSR/SSG for landing pages, sitemap/robots, meta tags, Open Graph, image optimization, code splitting, CDN/caching.

**Acceptance Criteria**
- [ ] Landing page passes Core Web Vitals thresholds (LCP/CLS/INP) in Lighthouse

**Dependencies:** None — can run in parallel with backend epics.

---

### Epic 16 — Mobile & PWA
**Goal:** Installable, offline-tolerant experience, tenant portal prioritized.

**Scope:** Service worker, manifest, offline fallback for read-heavy tenant portal views.

**Dependencies:** Epic 9

---

### Epic 17 — Testing & QA
**Goal:** Coverage sufficient to trust the isolation guarantees under load, not just happy-path UI. Higher priority than it would be under a managed platform, since this stack's tenant isolation is hand-built (see §2).

**Scope:** Isolation/scoping test suite (per-table, per-role — RLS-context or query-layer, matching Epic 1's mechanism), critical-path E2E (signup → lease → payment), regression suite before each release.

**Dependencies:** All prior epics (run continuously, formalize before launch)

---

### Epic 18 — Deployment & Launch
**Goal:** Production cutover.

**Scope:** Environment config (Neon prod branch, Clerk prod instance, R2 prod bucket, secrets), CI/CD pipeline, rollback plan, launch checklist tying back to Epic 17's test suite.

**Dependencies:** Epic 17

---

## 7. How to Use This Document

- This PRD is the scope reference. `docs/PROJECT_TRACKER.md` is the status log. Don't duplicate status into this file — link between them.
- When an epic's acceptance criteria are met, check it off in the tracker's phase checklist and note the session log entry there, not here.
- If real requirements diverge from an epic as written here (they will), edit *this* file and note the change in the tracker's log so the divergence is traceable.
- The isolation mechanism is now decided (Postgres RLS, §2) — every later epic's acceptance criteria assume this is settled going forward.