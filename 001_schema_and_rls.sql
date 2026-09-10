-- CESAR/CRM — Initial Neon schema + Row Level Security
-- Run this as a migration once the Neon project is provisioned.
-- Covers: organizations, users, properties, units, tenants (extend the same
-- pattern to leases, payments, maintenance_requests, documents, etc. — every
-- tenant-scoped table follows this exact shape).

-- ============================================================
-- 1. Core tables
-- ============================================================

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  address text,
  phone text,
  email text,
  website text,
  settings jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,       -- links to Clerk's user id
  organization_id uuid not null references organizations(id),
  email text not null,
  role text not null check (role in ('admin', 'manager', 'tenant')),
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table properties (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  name text not null,
  address text,
  property_type text,
  units_count int default 0,
  description text,
  images jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table units (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id), -- denormalized for RLS simplicity
  property_id uuid not null references properties(id),
  unit_number text not null,
  bedrooms int,
  bathrooms numeric,
  sqft int,
  rent_amount numeric,
  status text default 'vacant',
  created_at timestamptz not null default now()
);

create table tenants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  user_id uuid references users(id),
  first_name text,
  last_name text,
  email text,
  phone text,
  status text default 'lead' check (status in ('lead', 'active', 'past', 'evicted')),
  emergency_contact jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 2. Session-context function
-- ============================================================
-- The API layer calls: select set_config('app.current_org_id', $1, true);
-- inside the same transaction as its queries. `true` = local to the
-- transaction, so it never leaks across pooled connections.

create or replace function current_org_id() returns uuid as $$
  select nullif(current_setting('app.current_org_id', true), '')::uuid;
$$ language sql stable;

-- ============================================================
-- 3. Enable RLS + policies
-- ============================================================

alter table organizations enable row level security;
alter table users enable row level security;
alter table properties enable row level security;
alter table units enable row level security;
alter table tenants enable row level security;

-- organizations: a user can only see their own org row
create policy org_isolation on organizations
  using (id = current_org_id());

-- users: scoped to org, EXCEPT tenants should only see their own row
-- (tenant-level row restriction handled at the app layer for now —
-- revisit if you want a stricter policy once tenant portal work starts)
create policy users_isolation on users
  using (organization_id = current_org_id());

create policy properties_isolation on properties
  using (organization_id = current_org_id())
  with check (organization_id = current_org_id());

create policy units_isolation on units
  using (organization_id = current_org_id())
  with check (organization_id = current_org_id());

create policy tenants_isolation on tenants
  using (organization_id = current_org_id())
  with check (organization_id = current_org_id());

-- ============================================================
-- 4. Notes for extending this to the rest of the schema
-- ============================================================
-- For every future table (leases, payments, maintenance_requests,
-- communications, documents, notifications, audit_logs):
--   1. Add an `organization_id uuid not null references organizations(id)`
--      column, even if it's reachable via a join (denormalize it — RLS
--      policies on joined tables are painful and slow).
--   2. `alter table X enable row level security;`
--   3. `create policy X_isolation on X using (organization_id = current_org_id()) with check (organization_id = current_org_id());`
--
-- One exception: the Clerk webhook that creates the FIRST organizations/users
-- row on signup has no org context yet (chicken-and-egg). That code path
-- must use a separate, privileged database connection that bypasses RLS
-- (e.g. a Postgres role with `bypassrls`), never the app's normal
-- request-scoped connection. Keep that privileged path minimal and
-- reviewed carefully — it's the one place RLS isn't protecting you.