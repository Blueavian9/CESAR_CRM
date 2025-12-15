import type { FC } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MOCK_LEASES } from "./mockLeases";


const LeaseDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const lease = MOCK_LEASES.find((l) => l.id === id);

  if (!lease) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          ← Back
        </button>
        <p className="text-sm text-slate-700">Lease not found.</p>
      </div>
    );
  }

  const status = lease.status; // "active" | "pending" | "ended"
  const monthlyRent = lease.rent;
  const termLabel = `${lease.startDate} – ${lease.endDate ?? "Present"}`;

  return (
    <div className="space-y-6">
      {/* Breadcrumb + back */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link
            to="/leases"
            className="text-indigo-600 hover:text-indigo-700"
          >
            Leases
          </Link>
          <span>/</span>
          <span>{lease.tenantName}</span>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          ← Back
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {lease.tenantName}
          </h1>
          <p className="text-sm text-slate-600">
            {lease.propertyName}
            {lease.unit && ` • Unit ${lease.unit}`}
          </p>
          <p className="mt-1 text-xs text-slate-400">{termLabel}</p>
        </div>

        <span
          className={[
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize",
            status === "active" &&
              "bg-emerald-50 text-emerald-700 border border-emerald-100",
            status === "pending" &&
              "bg-amber-50 text-amber-700 border border-amber-100",
            status === "ended" &&
              "bg-slate-100 text-slate-600 border border-slate-200",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {status}
        </span>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Monthly rent</p>
          <p className="mt-1 text-xl font-semibold">
            ${monthlyRent.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Lease term</p>
          <p className="mt-1 text-sm font-medium text-slate-900">
            {termLabel}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Status</p>
          <p className="mt-1 text-sm font-medium capitalize text-slate-900">
            {status}
          </p>
        </div>
      </div>

      {/* Layout: overview + sidebar */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-lg border bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Lease overview
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              Placeholder – later this can show rent schedule, renewals,
              co-signers, and attached documents.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Key details
            </h2>
            <dl className="mt-2 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <dt className="text-slate-500">Tenant</dt>
                <dd>{lease.tenantName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Property</dt>
                <dd>{lease.propertyName}</dd>
              </div>
              {lease.unit && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Unit</dt>
                  <dd>{lease.unit}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-slate-500">Start date</dt>
                <dd>{lease.startDate}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">End date</dt>
                <dd>{lease.endDate ?? "Present"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaseDetailsPage;
