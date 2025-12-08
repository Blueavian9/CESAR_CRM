import type { FC } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MOCK_PROPERTIES } from "./mockProperties";

const PropertyDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const property = MOCK_PROPERTIES.find((p) => p.id === id);

  if (!property) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          ← Back
        </button>
        <p className="text-sm text-slate-700">Property not found.</p>
      </div>
    );
  }

  const occupancy =
    property.unitsTotal === 0
      ? 0
      : Math.round((property.unitsOccupied / property.unitsTotal) * 100);

  return (
    <div className="space-y-6">
      {/* Breadcrumb + back */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link
            to="/properties"
            className="text-indigo-600 hover:text-indigo-700"
          >
            Properties
          </Link>
          <span>/</span>
          <span>{property.name}</span>
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
            {property.name}
          </h1>
          <p className="text-sm text-slate-600">
            {property.address}, {property.city}, {property.state}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Added {property.createdAt} • {property.type}
          </p>
        </div>

        <span
          className={[
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
            property.status === "active" &&
              "bg-emerald-50 text-emerald-700 border border-emerald-100",
            property.status === "inactive" &&
              "bg-slate-100 text-slate-600 border border-slate-200",
            property.status === "draft" &&
              "bg-amber-50 text-amber-700 border border-amber-100",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {property.status === "active" && "Active"}
          {property.status === "inactive" && "Inactive"}
          {property.status === "draft" && "Draft"}
        </span>
      </div>

      {/* Stats cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Units</p>
          <p className="mt-1 text-xl font-semibold">
            {property.unitsOccupied}/{property.unitsTotal}
          </p>
          <p className="text-xs text-slate-400">({occupancy}% occupied)</p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Vacant Units</p>
          <p className="mt-1 text-xl font-semibold">{property.unitsVacant}</p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Owner</p>
          <p className="mt-1 text-sm font-medium text-slate-900">
            Ever Hills Investments
          </p>
          <p className="text-xs text-slate-400">
            (placeholder – real data later)
          </p>
        </div>
      </div>

      {/* Placeholder sections for future expansion */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-lg border bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Recent activity
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              No recent activity yet. This section will show lease updates,
              payments, and maintenance tickets related to this property.
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
                <dt className="text-slate-500">Type</dt>
                <dd>{property.type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Status</dt>
                <dd className="capitalize">{property.status}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">City</dt>
                <dd>{property.city}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">State</dt>
                <dd>{property.state}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
