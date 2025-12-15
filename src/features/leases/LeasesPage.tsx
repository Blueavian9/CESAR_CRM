import type { FC } from "react";
import { Link } from "react-router-dom";
import { MOCK_LEASES } from "./mockLeases";

const LeasesPage: FC = () => {
  const totalLeases = MOCK_LEASES.length;
  const activeCount = MOCK_LEASES.filter((l) => l.status === "active").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Leases</h1>
          <p className="text-sm text-slate-600">
            Track active, pending, and ended leases across your portfolio.
          </p>
        </div>

        <button className="inline-flex items-center justify-center px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
          + Add Lease
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Total Leases</p>
          <p className="mt-1 text-xl font-semibold">{totalLeases}</p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Active</p>
          <p className="mt-1 text-xl font-semibold">{activeCount}</p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Placeholder metric</p>
          <p className="mt-1 text-xl font-semibold">—</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Lease list
          </p>
          <p className="text-xs text-slate-400">{totalLeases} leases</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs font-medium text-slate-500">
              <tr>
                <th className="px-4 py-2">Tenant</th>
                <th className="px-4 py-2">Property / Unit</th>
                <th className="px-4 py-2">Term</th>
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
                  <td className="px-4 py-2 align-middle text-sm font-medium text-slate-900">
                    {lease.tenantName}
                  </td>
                  <td className="px-4 py-2 align-middle text-sm text-slate-600">
                    {lease.propertyName}
                    {lease.unit && (
                      <div className="text-xs text-slate-400">
                        Unit {lease.unit}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 align-middle text-sm text-slate-600">
                    {lease.startDate} – {lease.endDate ?? "Present"}
                  </td>
                  <td className="px-4 py-2 align-middle text-sm text-slate-600">
                    ${lease.rent.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 align-middle">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        lease.status === "active" &&
                          "bg-emerald-50 text-emerald-700 border border-emerald-100",
                        lease.status === "pending" &&
                          "bg-amber-50 text-amber-700 border border-amber-100",
                        lease.status === "ended" &&
                          "bg-slate-100 text-slate-600 border border-slate-200",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {lease.status === "active" && "Active"}
                      {lease.status === "pending" && "Pending"}
                      {lease.status === "ended" && "Ended"}
                    </span>
                  </td>
                  <td className="px-4 py-2 align-middle text-right">
                    <Link
                      to={`/leases/${lease.id}`}
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

export default LeasesPage;
