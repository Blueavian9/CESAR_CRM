# CESAR/CRM – Application Architecture

> Stack and isolation mechanism here must match `docs/CONSTITUTION.md`.
> If they ever diverge, the Constitution wins — update this file, not the other way around.

## 1. Technology Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Auth:** Clerk (`@clerk/clerk-react`, `ClerkProvider` wired in `main.tsx`)
- **Database:** Neon (Postgres), free tier, no inactivity pause
- **Storage:** Cloudflare R2 (S3-compatible), for documents/photos — Epic 11
- **Real-time:** None — refetch-on-mutate (see Constitution; add a dedicated service later only if a specific feature needs true push updates)
- **API layer:** Thin serverless functions (Vercel), all client data access routes through this — no direct client-to-Neon queries
- **Tenant isolation:** Postgres Row Level Security (RLS), with the API layer setting `app.current_org_id` and `app.current_role` as per-transaction session variables (`set_config(..., true)`). See `db/migrations/001_schema_and_rls.sql` for the live pattern.

> ⚠️ Unlike a platform like Supabase, Neon does not auto-enforce RLS per-request from a caller's JWT. The API layer is responsible for validating the Clerk session, resolving `organization_id`/role, and setting the session variable inside the same transaction as the query. This is a hand-built mechanism — treat RLS policy correctness as a standing risk, not a solved problem (see `docs/PRD.md` §17, Testing & QA).

**Roles in the database (as of Epic 1):**
- `neondb_owner` — full privileges, `BYPASSRLS`. Used only for migrations and the Clerk `user.created` webhook's initial org/user row creation (the one code path RLS can't cover, since there's no org context yet on signup).
- `app_user` — `NOBYPASSRLS`, standard CRUD grants. Used by the API layer for all normal request-scoped queries. This is the role RLS policies are actually tested against.

---

## 2. Application Structure (Routes)

### Public Area

- `/` – Landing Page
- `/login` – Property manager login
- `/signup` – Property manager registration
- `/forgot-password` – Password reset
- `/tenant-login` – Tenant portal login

### Authenticated Manager Area

- `/dashboard`
  - KPIs, metrics, recent activity
  - Quick actions (add property, add tenant, etc.)
  - Notifications center

- `/properties`
  - List view + filters
  - `/properties/new`
  - `/properties/:id`
    - Overview
    - Units
    - Tenants
    - Financials
    - Maintenance
    - Documents
    - Property settings

- `/units`
  - Units list, vacancy management
  - `/units/new`
  - `/units/:id`

- `/tenants`
  - All / Active / Past tenants
  - `/tenants/leads`
  - `/tenants/applications`
  - `/tenants/new`
  - `/tenants/:id`
    - Personal info
    - Lease details
    - Payment history
    - Maintenance requests
    - Documents
    - Communication log

- `/screening`
  - Pending / Completed
  - `/screening/new`
  - `/screening/:id`

- `/leases`
  - Active / Expiring soon / Expired
  - `/leases/new`
  - `/leases/:id`

- `/payments`
  - Rent roll
  - Payment history
  - Overdue payments
  - Schedules
  - `/payments/new`
  - `/payments/:id`

- `/maintenance`
  - All / Open / In progress / Completed
  - `/maintenance/new`
  - `/maintenance/:id`

- `/communications`
  - Inbox
  - Sent
  - Templates
  - Automated notifications
  - `/communications/new`

- `/reports`
  - Financial, occupancy, maintenance, tenant reports
  - Custom reports
  - Data export

- `/documents`
  - All documents
  - Leases, inspections, insurance
  - `/documents/upload`

- `/settings`
  - Account settings
  - Company profile
  - User management
  - Roles & permissions
  - Payment gateway setup
  - Email templates
  - Notification preferences
  - Integration settings (API, Zapier, webhooks)

### Tenant Portal

- `/tenant-portal`
  - Tenant dashboard
  - My lease
  - Pay rent (integration ready)
  - Payment history
  - Submit maintenance request
  - My requests
  - Documents
  - Messages

---

## 3. Database Schema (Core Tables)

Live, canonical schema is `db/migrations/001_schema_and_rls.sql` — the tables below reflect its current state (`organizations`, `users`, `properties`, `units`, `tenants`) plus tables planned for later epics, not yet created.

### `users`

- `id`
- `clerk_user_id` (links to Clerk's user id, unique)
- `organization_id`
- `email`
- `role` (`admin`, `manager`, `tenant`)
- `full_name`
- `phone`
- `avatar_url`
- `created_at`, `updated_at`

### `organizations`

- `id`
- `name`
- `logo_url`
- `address`
- `phone`
- `email`
- `website`
- `settings` (JSONB)
- `created_at`

### `properties`

- `id`
- `organization_id`
- `name`
- `address`
- `property_type`
- `units_count`
- `description`
- `images` (JSONB)
- `created_at`

### `units`

- `id`
- `organization_id` (denormalized for RLS — see migration notes)
- `property_id`
- `unit_number`
- `bedrooms`
- `bathrooms`
- `sqft`
- `rent_amount`
- `status` (vacant, occupied, etc.)
- `created_at`

### `tenants`

- `id`
- `organization_id`
- `user_id` (link to `users`)
- `first_name`
- `last_name`
- `email`
- `phone`
- `status` (lead, active, past, evicted)
- `emergency_contact`
- `created_at`

> The following tables (`leads`, `applications`, `screenings`, `leases`, `payments`, `maintenance_requests`, `communications`, `documents`, `notifications`, `audit_logs`) are planned per their owning epics (PRD §5–6) but not yet created in Neon. Each will follow the same pattern documented in `001_schema_and_rls.sql`'s closing notes: an `organization_id` column, RLS enabled + forced, and an isolation policy matching the existing shape.

---

## 4. Implementation Phases (High Level)

See `docs/PRD.md` §5 (Epic Index) for the authoritative list, dependencies, and acceptance criteria. Current status: `docs/PROJECT_TRACKER.md`.

---

## 5. Wireframe Concepts

### Dashboard Layout

- Left sidebar navigation
- Header with logo, search, notifications, user menu
- Quick stats cards (Total Properties, Active Leases, Vacant Units, Overdue Payments)
- Sections:
  - Recent activity timeline
  - Upcoming tasks (lease expirations, payments due)
  - Open maintenance requests list

### Tenant Profile Layout

- Header with avatar, name, status, actions
- Tabs:
  - Info
  - Lease
  - Payments
  - Maintenance
  - Documents
- Two-column layout:
  - Left: personal information, contact details
  - Right: current lease summary, recent activity

---

## 6. SEO & Performance Strategy (Public Pages)

- SSR/SSG for landing and marketing pages
- Semantic HTML, mobile-first responsive design
- Image optimization (WebP, alt text)
- `sitemap.xml`, `robots.txt`, canonical URLs
- Unique titles and meta descriptions per page
- Schema.org structured data
- Open Graph tags for social sharing
- Code splitting, lazy loading, minified JS/CSS
- CDN + caching + compression (gzip/brotli)

---

CESAR/CRM is designed as a modular, multi-tenant, enterprise-ready property management platform that can scale from a single landlord to large portfolios with thousands of units.