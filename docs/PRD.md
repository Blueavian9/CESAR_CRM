# CESAR/CRM — Product Requirements Document

**Status:** Reconstructed — original PRD not located. This supersedes it as source of truth.
**Companion doc:** `docs/PROJECT_TRACKER.md` (session-to-session status log — update that, not this, after each work session)

---

## 1. Overview

CESAR/CRM is a modular, multi-tenant property management platform serving property managers/landlords (primary users) and their tenants (portal users), covering the full lifecycle: lead → application → screening → lease → rent collection → maintenance → offboarding, plus reporting, documents, and communications.

## 2. Key Decision Baked Into This PRD

**Backend is Supabase, not Bolt Database.** `ARCHITECTURE.md` in repo root still names Bolt Database throughout — that's stale. Every epic below assumes Supabase (Postgres + Supabase Auth + Supabase Storage + Realtime + RLS). Schema/routes are otherwise unchanged from ARCHITECTURE.md — this is a backend-provider swap, not a data model redesign.

## 3. Non-Goals (for this pass)

- Native mobile apps (PWA only — see Epic 16)
- Payment gateway selection/integration logic beyond "integration-ready" hooks (Epic 6 wires the schema and stub, doesn't pick/ship a processor)
- Multi-language/i18n

## 4. Success Metrics

- A property manager can go from signup → first property → first tenant → first lease → first rent payment logged, end-to-end, with no manual DB intervention.
- Tenant portal supports the same lease/payment/maintenance visibility with zero write access outside their own records (verified by RLS tests, not just UI hiding).
- Zero rows in any table reachable by an org that doesn't own them (tenant isolation is the platform's core trust guarantee — treat as a launch blocker, not a nice-to-have).

---

## 5. Epic Index

| # | Epic | Depends On |
|---|------|-----------|
| 1 | Foundation & Auth (Supabase migration) | — |
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

### Epic 1 — Foundation & Auth (Supabase Migration)
**Goal:** Replace Bolt Database with Supabase as the sole backend; establish the org/role/RLS model everything else depends on.

**Scope**
- Provision Supabase project (or confirm existing one from before pause)
- Recreate `users`, `organizations` tables; wire Supabase Auth → `users` profile row on signup
- Role model: `admin`, `manager`, `tenant` — enforced via RLS, not just client-side checks
- Replace Bolt SDK calls with `@supabase/supabase-js`; centralize client init (one `supabaseClient.ts`, no ad-hoc instantiation)
- RLS policy pass: every table scoped to `organization_id` for managers, to own-record for tenants
- Login/signup/forgot-password/tenant-login flows working end-to-end against Supabase Auth

**Acceptance Criteria**
- [ ] A brand-new signup creates an `organizations` row + `users` row with `role = manager`, no orphaned auth users
- [ ] A tenant user can authenticate but is blocked by RLS (not just routing) from any `/properties`, `/settings`, etc. queries
- [ ] No Bolt SDK imports remain anywhere in the codebase (`grep -r "bolt" src/` returns nothing)

**Dependencies:** None — this blocks everything else.

---

### Epic 2 — Dashboard & Properties
**Goal:** Manager landing experience + property CRUD, the first "real" screen after login.

**Scope**
- Dashboard KPI cards (properties, active leases, vacant units, overdue payments) — real queries, not placeholders
- Properties list/filter, create/edit, property detail with Overview/Units/Tenants/Financials/Maintenance/Documents/Settings tabs (tabs can stub until their owning epic lands)
- Units CRUD nested under properties, vacancy status tracking

**Acceptance Criteria**
- [ ] KPI cards reflect live Supabase counts, scoped to the logged-in org
- [ ] Creating a property → creating a unit under it → both show up in list views without refresh (Realtime or refetch-on-mutate, your call)

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
- Document attachment (signed lease file) — hooks into Epic 11

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
- Priority/category, image attachments, assignment
- Feeds tenant portal (Epic 9) for tenant-side visibility/creation

**Acceptance Criteria**
- [ ] A tenant-submitted request appears in the manager's `/maintenance` queue in real time or on next load, correctly scoped to their org

**Dependencies:** Epic 3

---

### Epic 8 — Communications & Notifications
**Goal:** In-app messaging + automated notification triggers.

**Scope**
- `/communications` inbox/sent/templates/automated
- `notifications` table + UI bell/center
- Trigger points: lease expiring soon, payment overdue, maintenance status change (wire the triggers here even though the fuller automation engine is Epic 13)

**Acceptance Criteria**
- [ ] A payment going overdue creates a `notifications` row for the relevant manager without manual action

**Dependencies:** Epic 3

---

### Epic 9 — Tenant Portal
**Goal:** Self-service experience for tenants, RLS-verified.

**Scope**
- `/tenant-portal`: dashboard, my lease, payment history, pay rent (integration-ready stub), submit/view maintenance requests, documents, messages

**Acceptance Criteria**
- [ ] Every query on this portal is provably scoped by RLS to the authenticated tenant's own records — write an actual RLS test for this, don't rely on UI filtering

**Dependencies:** Epics 5, 6, 7, 8

---

### Epic 10 — Reporting & Analytics
**Goal:** Financial/occupancy/maintenance/tenant reports, exportable.

**Scope**
- `/reports` with report-type selector, custom report builder, CSV/export
- Pulls from Epics 2, 5, 6, 7 data — no new tables, mostly query/aggregation work

**Acceptance Criteria**
- [ ] Every report is org-scoped and matches manual spot-check totals against the source tables

**Dependencies:** Epics 2, 5, 6, 7

---

### Epic 11 — Document Management
**Goal:** Centralized file storage, replacing Bolt Storage with Supabase Storage buckets.

**Scope**
- `/documents`, `/documents/upload`; `documents` table (`related_type`/`related_id` polymorphic link)
- Supabase Storage bucket structure + per-org access policies (mirrors RLS pattern from Epic 1)

**Acceptance Criteria**
- [ ] A document uploaded under one org is not retrievable via signed URL guessing or direct bucket path by another org's users

**Dependencies:** Epic 1

---

### Epic 12 — Security & Compliance
**Goal:** Audit trail + hardening pass across everything built so far.

**Scope**
- `audit_logs` table wired to key mutations (tenant status changes, lease creation, payment status changes, user role changes)
- RLS policy audit across all tables (re-verify Epic 1's baseline still holds after Epics 2–11 added tables/columns)
- Basic rate-limiting/input-validation pass on public-facing forms (signup, tenant-login)

**Acceptance Criteria**
- [ ] Every table with tenant-sensitive data has an RLS policy — produce a checklist/table mapping table → policy → verified (not just "exists")

**Dependencies:** Epics 1, 11

---

### Epic 13 — Automation & Workflows
**Goal:** Rules-based automation beyond the ad-hoc triggers seeded in Epic 8.

**Scope**
- Configurable automation rules (e.g., "3 days before lease expiry, notify manager + tenant")
- Automated late-fee flagging (flagging only — no charge processing, per Non-Goals)

**Acceptance Criteria**
- [ ] At least the lease-expiry and payment-overdue automations run on a schedule (Supabase scheduled functions / cron) without manual trigger

**Dependencies:** Epics 6, 7, 8

---

### Epic 14 — Integrations & API
**Goal:** External-facing API + webhook/Zapier hooks for `/settings` → Integration settings.

**Scope**
- API key issuance/management per org
- Webhook config UI + delivery for key events (new lead, lease signed, payment received)

**Acceptance Criteria**
- [ ] An API key scoped to one org cannot read another org's data (same RLS guarantee, exercised via the API surface, not just the app)

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
**Goal:** Coverage sufficient to trust the RLS/multi-tenancy guarantees under load, not just happy-path UI.

**Scope:** RLS policy test suite (per-table, per-role), critical-path E2E (signup → lease → payment), regression suite before each release.

**Dependencies:** All prior epics (run continuously, formalize before launch)

---

### Epic 18 — Deployment & Launch
**Goal:** Production cutover.

**Scope:** Environment config (Supabase prod project, secrets), CI/CD pipeline, rollback plan, launch checklist tying back to Epic 17's test suite.

**Dependencies:** Epic 17

---

## 7. How to Use This Document

- This PRD is the scope reference. `docs/PROJECT_TRACKER.md` is the status log. Don't duplicate status into this file — link between them.
- When an epic's acceptance criteria are met, check it off in the tracker's phase checklist and note the session log entry there, not here.
- If real requirements diverge from an epic as written here (they will), edit *this* file and note the change in the tracker's log so the divergence is traceable.