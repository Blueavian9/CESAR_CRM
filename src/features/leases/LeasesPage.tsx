import type { FC } from "react";
import { MOCK_LEASES } from "./mockLeases.ts";

const LeasesPage: FC = () => {
  const active = MOCK_LEASES.filter((l) => l.status === "active").length;
  const expiring = MOCK_LEASES.filter((l) => l.status === "expiring").length;
  const avgRent =
    MOCK_LEASES.reduce((sum, l) => sum + l.rent, 0) / (MOCK_LEASES.length || 1);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Leases</h1>
          <p className="text-sm text-slate-600">
            Track lease terms, expirations, and monthly rent roll.
          </p>
        </div>

        <button className="inline-flex items-center justify-center px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
          + New Lease
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Active Leases</p>
          <p className="mt-1 text-xl font-semibold">{active}</p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Expiring Soon</p>
          <p className="mt-1 text-xl font-semibold">{expiring}</p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Average Monthly Rent</p>
          <p className="mt-1 text-xl font-semibold">
            ${Math.round(avgRent).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Lease Schedule
          </p>
          <p className="text-xs text-slate-400">
            {MOCK_LEASES.length} leases
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs font-medium text-slate-500">
              <tr>
                <th className="px-4 py-2">Lease</th>
                <th className="px-4 py-2">Property / Unit</th>
                <th className="px-4 py-2">Tenant</th>
                <th className="px-4 py-2">Start</th>
                <th className="px-4 py-2">End</th>
                <th className="px-4 py-2">Rent</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LEASES.map((lease) => (
                <tr
                  key={lease.id}
                  className="border-b last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-4 py-2 text-sm font-medium text-slate-900">
                    {lease.code}
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-600">
                    {lease.propertyName}
                    <div className="text-xs text-slate-400">Unit {lease.unit}</div>
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-600">
                    {lease.tenantName}
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-600">
                    {lease.startDate}
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-600">
                    {lease.endDate}
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-600">
                    ${lease.rent.toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        lease.status === "active" &&
                          "bg-emerald-50 text-emerald-700 border border-emerald-100",
                        lease.status === "expiring" &&
                          "bg-amber-50 text-amber-700 border border-amber-100",
                        lease.status === "ended" &&
                          "bg-slate-100 text-slate-600 border border-slate-200",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {lease.status === "active" && "Active"}
                      {lease.status === "expiring" && "Expiring"}
                      {lease.status === "ended" && "Ended"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                      View lease
                    </button>
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

export default LeasesPage;
