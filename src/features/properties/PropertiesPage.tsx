import { type FC, useState } from "react";
import { MOCK_PROPERTIES } from "./mockProperties";

type SortKey = "name" | "city" | "type" | "units" | "vacant" | "status";
type SortDir = "asc" | "desc";

const PropertiesPage: FC = () => {
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "draft">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const totalProps = MOCK_PROPERTIES.length;
  const totalUnits = MOCK_PROPERTIES.reduce((sum, p) => sum + p.unitsTotal, 0);
  const totalVacant = MOCK_PROPERTIES.reduce((sum, p) => sum + p.unitsVacant, 0);

  // Build dropdown options for property types from the mock data
  const typeOptions = Array.from(new Set(MOCK_PROPERTIES.map((p) => p.type)));

  const handleSort = (key: SortKey) => {
    if (key === sortBy) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const sortedFiltered = [...MOCK_PROPERTIES]
    .filter((p) => (statusFilter === "all" ? true : p.status === statusFilter))
    .filter((p) => (typeFilter === "all" ? true : p.type === typeFilter))
    .sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";

      switch (sortBy) {
        case "name":
          aVal = a.name;
          bVal = b.name;
          break;
        case "city":
          aVal = a.city;
          bVal = b.city;
          break;
        case "type":
          aVal = a.type;
          bVal = b.type;
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        case "units": {
          const aUnits = a.unitsTotal === 0 ? 0 : (a.unitsOccupied / a.unitsTotal) * 100;
          const bUnits = b.unitsTotal === 0 ? 0 : (b.unitsOccupied / b.unitsTotal) * 100;
          aVal = aUnits;
          bVal = bUnits;
          break;
        }
        case "vacant":
          aVal = a.unitsVacant;
          bVal = b.unitsVacant;
          break;
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

  const sortIcon = (key: SortKey) => {
    if (key !== sortBy) return "↕";
    return sortDir === "asc" ? "↑" : "↓";
  };

  return (
    <div className="space-y-4">
      {/* Header + CTA */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Properties</h1>
          <p className="text-sm text-slate-600">
            Manage your portfolio of residential, commercial, and short-term rentals.
          </p>
        </div>

        <button className="inline-flex items-center justify-center px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
          + Add Property
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Total Properties</p>
          <p className="mt-1 text-xl font-semibold">{totalProps}</p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Total Units</p>
          <p className="mt-1 text-xl font-semibold">{totalUnits}</p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Vacant Units</p>
          <p className="mt-1 text-xl font-semibold">{totalVacant}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-1">
            <span className="text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "active" | "inactive" | "draft")
              }
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs sm:text-sm"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs sm:text-sm"
            >
              <option value="all">All</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Showing {sortedFiltered.length} of {totalProps} properties
        </p>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Portfolio
          </p>
          <p className="text-xs text-slate-400">
            {totalProps} properties • {totalUnits} units
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs font-medium text-slate-500">
              <tr>
                <th className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => handleSort("name")}
                    className="inline-flex items-center gap-1"
                  >
                    Property <span className="text-[10px]">{sortIcon("name")}</span>
                  </button>
                </th>
                <th className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => handleSort("city")}
                    className="inline-flex items-center gap-1"
                  >
                    Location <span className="text-[10px]">{sortIcon("city")}</span>
                  </button>
                </th>
                <th className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => handleSort("type")}
                    className="inline-flex items-center gap-1"
                  >
                    Type <span className="text-[10px]">{sortIcon("type")}</span>
                  </button>
                </th>
                <th className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => handleSort("units")}
                    className="inline-flex items-center gap-1"
                  >
                    Units <span className="text-[10px]">{sortIcon("units")}</span>
                  </button>
                </th>
                <th className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => handleSort("vacant")}
                    className="inline-flex items-center gap-1"
                  >
                    Vacant <span className="text-[10px]">{sortIcon("vacant")}</span>
                  </button>
                </th>
                <th className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => handleSort("status")}
                    className="inline-flex items-center gap-1"
                  >
                    Status <span className="text-[10px]">{sortIcon("status")}</span>
                  </button>
                </th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedFiltered.map((property) => {
                const occupancy =
                  property.unitsTotal === 0
                    ? 0
                    : Math.round((property.unitsOccupied / property.unitsTotal) * 100);

                return (
                  <tr
                    key={property.id}
                    className="border-b last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-2 align-middle">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">
                          {property.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          Added {property.createdAt}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 align-middle text-sm text-slate-600">
                      {property.city}, {property.state}
                      <div className="text-xs text-slate-400">{property.address}</div>
                    </td>
                    <td className="px-4 py-2 align-middle text-sm text-slate-600">
                      {property.type}
                    </td>
                    <td className="px-4 py-2 align-middle text-sm text-slate-600">
                      {property.unitsOccupied}/{property.unitsTotal}
                      <span className="ml-1 text-xs text-slate-400">({occupancy}%)</span>
                    </td>
                    <td className="px-4 py-2 align-middle text-sm text-slate-600">
                      {property.unitsVacant}
                    </td>
                    <td className="px-4 py-2 align-middle">
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
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
                    </td>
                    <td className="px-4 py-2 align-middle text-right">
                      <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                        View details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
