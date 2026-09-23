# CESAR/CRM — Constitution

> Read this first, every session. This is the stable "why" and "with what" —
> it should rarely change. Scope and status live elsewhere:
> `docs/PRD.md` (roadmap + epic detail) and `docs/PROJECT_TRACKER.md` (session log).

## Mission

CESAR/CRM is a multi-tenant property management platform for property
managers/landlords and their tenants, covering lead → application →
screening → lease → rent collection → maintenance → offboarding.

Target user: a single landlord up to a mid-size portfolio (not enterprise-scale
on day one — see PRD §4 Success Metrics for the concrete bar).

Non-goals (current pass): native mobile, live payment processing, i18n,
true realtime push. Full list: PRD §3.

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite, Tailwind, Lucide | unchanged since project start |
| Auth | Clerk | installed, wired in `main.tsx` |
| Database | Neon (Postgres) | free tier, no inactivity pause |
| Isolation | Postgres RLS + per-request `app.current_org_id` session var, set by API layer | Neon has no auto-REST-with-RLS like Supabase did — API must set context itself |
| File storage | Cloudflare R2 | S3-compatible, no egress fees |
| Realtime | None — refetch-on-mutate | add a dedicated service later only if a feature truly needs push |
| API layer | Thin serverless functions (Vercel) — no direct client→Neon queries | all client data access routes through this |

**Non-negotiable constraint:** every tenant-scoped table gets an
`organization_id` column (denormalized, even if reachable via join) and an
RLS policy in the same shape as the existing ones — see
`db/migrations/001_schema_and_rls.sql` for the pattern and its own inline
notes on extending it.

**One exception to "RLS protects everything":** the Clerk `user.created`
webhook creates the first `organizations`/`users` row with no org context
yet. That code path uses a separate, privileged (non-RLS-bypassing... wait,
bypassing) connection, kept minimal and reviewed carefully.

## Roadmap

18 epics, full detail and acceptance criteria in `docs/PRD.md` §5–6.
Current epic: **Epic 1 — Foundation & Auth**, status in
`docs/PROJECT_TRACKER.md`.

Do not re-derive settled decisions in a new session: the stack table above,
the RLS-with-session-variable mechanism, and the epic breakdown are all
closed questions unless this file changes.