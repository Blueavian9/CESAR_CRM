import type { FC } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MOCK_TENANTS } from "./mockTenants";

const TenantDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const tenant = MOCK_TENANTS.find((t) => t.id === id);

  if (!tenant) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          ← Back
        </button>
        <p className="text-sm text-slate-700">Tenant not found.</p>
      </div>
    );
  }

  // feel free to tweak these fields to match your mockTenants shape
  const fullName = tenant.name;
  const propertyName = tenant.propertyName ?? tenant.property;
  const unitLabel = tenant.unit ?? tenant.unitNumber;
  const status = tenant.status; // e.g. "current" | "former" | "pending"
  const balance = tenant.balance ?? 0;
  const email = tenant.email;
  const phone = tenant.phone;
  const moveInDate = tenant.moveInDate;

  return (
    <div className="space-y-6">
      {/* Breadcrumb + back */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link
            to="/tenants"
            className="text-indigo-600 hover:text-indigo-700"
          >
            Tenants
          </Link>
          <span>/</span>
          <span>{fullName}</span>
        </div>

        <button
          type="button"
          className="inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {fullName}
          </h1>
          <p className="text-sm text-slate-600">
            {propertyName}
            {unitLabel ? ` • ${unitLabel}` : null}
          </p>
          {moveInDate && (
            <p className="mt-1 text-xs text-slate-400">
              Move-in date: {moveInDate}
            </p>
          )}
        </div>

        <span
          className={[
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize",
            status === "current" &&
              "bg-emerald-50 text-emerald-700 border border-emerald-100",
            status === "late" &&
              "bg-amber-50 text-amber-700 border border-amber-100",
            status === "former" &&
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
          <p className="text-xs text-slate-500">Current balance</p>
          <p className="mt-1 text-xl font-semibold">
            ${balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-400">
            Placeholder – later we’ll pull from real payments.
          </p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Status</p>
          <p className="mt-1 text-sm font-medium capitalize text-slate-900">
            {status}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Property</p>
          <p className="mt-1 text-sm font-medium text-slate-900">
            {propertyName}
          </p>
        </div>
      </div>

      {/* Layout: activity + sidebar */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-lg border bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Recent activity
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              No recent activity yet. This will show payments, lease changes,
              and maintenance requests submitted by this tenant.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Contact details
            </h2>
            <dl className="mt-2 space-y-2 text-xs text-slate-600">
              {email && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Email</dt>
                  <dd className="ml-2">{email}</dd>
                </div>
              )}
              {phone && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Phone</dt>
                  <dd className="ml-2">{phone}</dd>
                </div>
              )}
              {unitLabel && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Unit</dt>
                  <dd className="ml-2">{unitLabel}</dd>
                </div>
              )}
              {propertyName && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Property</dt>
                  <dd className="ml-2">{propertyName}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDetailsPage;
