import type { FC } from "react";
import { Link } from "react-router-dom";
import { MOCK_TENANTS } from "./mockTenants";

const TenantsPage: FC = () => {
  const totalTenants = MOCK_TENANTS.length;
  const pastDueCount = MOCK_TENANTS.filter(
    (t) => t.status === "past_due"
  ).length;
  const noticeCount = MOCK_TENANTS.filter(
    (t) => t.status === "notice"
  ).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Tenants</h1>
          <p className="text-sm text-slate-600">
            View residents across your portfolio and track balances at a
            glance.
          </p>
        </div>

        <button className="inline-flex items-center justify-center px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
          + Add Tenant
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Total Tenants</p>
          <p className="mt-1 text-xl font-semibold">{totalTenants}</p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Past Due</p>
          <p className="mt-1 text-xl font-semibold">{pastDueCount}</p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">On Notice</p>
          <p className="mt-1 text-xl font-semibold">{noticeCount}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Residents
          </p>
          <p className="text-xs text-slate-400">{totalTenants} tenants</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs font-medium text-slate-500">
              <tr>
                <th className="px-4 py-2">Tenant</th>
                <th className="px-4 py-2">Property / Unit</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Move-in</th>
                <th className="px-4 py-2">Balance</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TENANTS.map((tenant) => (
                <tr
                  key={tenant.id}
                  className="border-b last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-4 py-2 align-middle text-sm font-medium text-slate-900">
                    {tenant.name}
                  </td>
                  <td className="px-4 py-2 align-middle text-sm text-slate-600">
                    {tenant.propertyName}
                    <div className="text-xs text-slate-400">
                      Unit {tenant.unit}
                    </div>
                  </td>
                  <td className="px-4 py-2 align-middle text-sm text-slate-600">
                    {tenant.city}, {tenant.state}
                  </td>
                  <td className="px-4 py-2 align-middle text-sm text-slate-600">
                    {tenant.moveInDate}
                  </td>
                  <td className="px-4 py-2 align-middle text-sm text-slate-600">
                    ${tenant.balance.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 align-middle">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        tenant.status === "current" &&
                          "bg-emerald-50 text-emerald-700 border border-emerald-100",
                        tenant.status === "past_due" &&
                          "bg-rose-50 text-rose-700 border border-rose-100",
                        tenant.status === "notice" &&
                          "bg-amber-50 text-amber-700 border border-amber-100",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {tenant.status === "current" && "Current"}
                      {tenant.status === "past_due" && "Past due"}
                      {tenant.status === "notice" && "Notice given"}
                    </span>
                  </td>
                  <td className="px-4 py-2 align-middle text-right">
                    <Link
                      to={`/tenants/${tenant.id}`}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      View details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TenantsPage;
