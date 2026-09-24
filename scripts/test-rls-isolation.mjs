// scripts/test-rls-isolation.mjs
// Automated cross-org / cross-role RLS isolation test — Epic 1 acceptance criterion.
// Run with: node --env-file=.env scripts/test-rls-isolation.mjs
// (Node 20.6+ for --env-file; otherwise export the two vars into your shell first.)

import { Pool } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";

const OWNER_URL = process.env.DATABASE_URL;
const APP_URL = process.env.DATABASE_URL_APP;

if (!OWNER_URL || !APP_URL) {
  console.error("Missing DATABASE_URL or DATABASE_URL_APP in environment.");
  process.exit(1);
}

const ownerPool = new Pool({ connectionString: OWNER_URL });
const appPool = new Pool({ connectionString: APP_URL });

const failures = [];
function assert(condition, label) {
  if (condition) {
    console.log(`  PASS  ${label}`);
  } else {
    console.log(`  FAIL  ${label}`);
    failures.push(label);
  }
}

// Holds every seeded row's id/table so cleanup can delete precisely, in FK-safe order.
const seeded = {
  tenants: [],
  units: [],
  properties: [],
  users: [],
  organizations: [],
};

async function seed() {
  const owner = await ownerPool.connect();
  try {
    const tag = randomUUID().slice(0, 8);

    const orgA = await owner.query(
      `insert into organizations (name) values ($1) returning id`,
      [`RLS_TEST_ORG_A_${tag}`],
    );
    const orgB = await owner.query(
      `insert into organizations (name) values ($1) returning id`,
      [`RLS_TEST_ORG_B_${tag}`],
    );
    const orgAId = orgA.rows[0].id;
    const orgBId = orgB.rows[0].id;
    seeded.organizations.push(orgAId, orgBId);

    const managerA = await owner.query(
      `insert into users (clerk_user_id, organization_id, email, role, full_name)
       values ($1, $2, $3, 'manager', 'RLS Test Manager') returning id`,
      [`rls_test_manager_${tag}`, orgAId, `manager_${tag}@rls-test.local`],
    );
    const tenantA = await owner.query(
      `insert into users (clerk_user_id, organization_id, email, role, full_name)
       values ($1, $2, $3, 'tenant', 'RLS Test Tenant') returning id`,
      [`rls_test_tenant_${tag}`, orgAId, `tenant_${tag}@rls-test.local`],
    );
    seeded.users.push(managerA.rows[0].id, tenantA.rows[0].id);

    const propA = await owner.query(
      `insert into properties (organization_id, name) values ($1, $2) returning id`,
      [orgAId, `RLS_TEST_PROP_A_${tag}`],
    );
    const propB = await owner.query(
      `insert into properties (organization_id, name) values ($1, $2) returning id`,
      [orgBId, `RLS_TEST_PROP_B_${tag}`],
    );
    seeded.properties.push(propA.rows[0].id, propB.rows[0].id);

    const unitA = await owner.query(
      `insert into units (organization_id, property_id, unit_number) values ($1, $2, '1A') returning id`,
      [orgAId, propA.rows[0].id],
    );
    const unitB = await owner.query(
      `insert into units (organization_id, property_id, unit_number) values ($1, $2, '1B') returning id`,
      [orgBId, propB.rows[0].id],
    );
    seeded.units.push(unitA.rows[0].id, unitB.rows[0].id);

    const tenantRowA = await owner.query(
      `insert into tenants (organization_id, first_name) values ($1, 'RLS Test A') returning id`,
      [orgAId],
    );
    const tenantRowB = await owner.query(
      `insert into tenants (organization_id, first_name) values ($1, 'RLS Test B') returning id`,
      [orgBId],
    );
    seeded.tenants.push(tenantRowA.rows[0].id, tenantRowB.rows[0].id);

    return { orgAId, orgBId };
  } finally {
    owner.release();
  }
}

async function cleanup() {
  const owner = await ownerPool.connect();
  try {
    if (seeded.tenants.length)
      await owner.query(`delete from tenants where id = any($1::uuid[])`, [
        seeded.tenants,
      ]);
    if (seeded.units.length)
      await owner.query(`delete from units where id = any($1::uuid[])`, [
        seeded.units,
      ]);
    if (seeded.properties.length)
      await owner.query(`delete from properties where id = any($1::uuid[])`, [
        seeded.properties,
      ]);
    if (seeded.users.length)
      await owner.query(`delete from users where id = any($1::uuid[])`, [
        seeded.users,
      ]);
    if (seeded.organizations.length)
      await owner.query(
        `delete from organizations where id = any($1::uuid[])`,
        [seeded.organizations],
      );
  } finally {
    owner.release();
  }
}

async function runAsAppUser(orgId, role, fn) {
  const client = await appPool.connect();
  try {
    await client.query("begin");
    await client.query(`select set_config('app.current_org_id', $1, true)`, [
      orgId,
    ]);
    await client.query(`select set_config('app.current_role', $1, true)`, [
      role,
    ]);
    await fn(client);
  } finally {
    await client.query("rollback").catch(() => {});
    client.release();
  }
}

async function main() {
  console.log("Seeding test data as neondb_owner...");
  const { orgAId, orgBId } = await seed();

  try {
    console.log(
      "\n[1] Positive control — org A manager sees org A's own data:",
    );
    await runAsAppUser(orgAId, "manager", async (client) => {
      const props = await client.query(`select id from properties`);
      const units = await client.query(`select id from units`);
      const tenants = await client.query(`select id from tenants`);
      assert(
        props.rows.length >= 1,
        "properties: org A manager sees at least org A's own property",
      );
      assert(
        units.rows.length >= 1,
        "units: org A manager sees at least org A's own unit",
      );
      assert(
        tenants.rows.length >= 1,
        "tenants: org A manager sees at least org A's own tenant row",
      );
    });

    console.log("\n[2] Cross-org — org A manager blocked from org B data:");
    await runAsAppUser(orgAId, "manager", async (client) => {
      const props = await client.query(
        `select id from properties where name like 'RLS_TEST_PROP_B%'`,
      );
      const units = await client.query(
        `select u.id from units u join properties p on p.id = u.property_id where p.name like 'RLS_TEST_PROP_B%'`,
      );
      const tenants = await client.query(
        `select id from tenants where first_name = 'RLS Test B'`,
      );
      assert(
        props.rows.length === 0,
        "properties: org A manager cannot see org B's property",
      );
      assert(
        units.rows.length === 0,
        "units: org A manager cannot see org B's unit",
      );
      assert(
        tenants.rows.length === 0,
        "tenants: org A manager cannot see org B's tenant row",
      );
    });

    console.log(
      "\n[3] Role-block — tenant role blocked from properties/units/tenants, even in own org:",
    );
    await runAsAppUser(orgAId, "tenant", async (client) => {
      const props = await client.query(`select id from properties`);
      const units = await client.query(`select id from units`);
      const tenants = await client.query(`select id from tenants`);
      assert(
        props.rows.length === 0,
        "properties: tenant role sees zero rows in own org",
      );
      assert(
        units.rows.length === 0,
        "units: tenant role sees zero rows in own org",
      );
      assert(
        tenants.rows.length === 0,
        "tenants: tenant role sees zero rows in own org",
      );
    });

    console.log(
      "\n[4] organizations/users — org-scoped, but NOT tenant-blocked (per current design):",
    );
    await runAsAppUser(orgAId, "tenant", async (client) => {
      const orgs = await client.query(`select id from organizations`);
      const users = await client.query(`select id from users`);
      assert(
        orgs.rows.length === 1 && orgs.rows[0].id === orgAId,
        "organizations: tenant sees only their own org row",
      );
      assert(
        users.rows.length >= 1,
        "users: tenant role is not blocked from users table (matches deferred-to-app-layer design)",
      );
    });
    await runAsAppUser(orgAId, "manager", async (client) => {
      const orgs = await client.query(
        `select id from organizations where id = $1`,
        [orgBId],
      );
      assert(
        orgs.rows.length === 0,
        "organizations: org A manager cannot see org B's org row",
      );
    });
  } finally {
    console.log("\nCleaning up seeded data as neondb_owner...");
    await cleanup();
    await ownerPool.end();
    await appPool.end();
  }

  console.log("\n" + "=".repeat(50));
  if (failures.length === 0) {
    console.log("ALL RLS ISOLATION TESTS PASSED");
    process.exit(0);
  } else {
    console.log(`${failures.length} TEST(S) FAILED:`);
    failures.forEach((f) => console.log(`  - ${f}`));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Test run crashed:", err);
  process.exit(1);
});
