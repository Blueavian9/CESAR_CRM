import type { FC } from "react";
import { MOCK_TICKETS } from "./mockTickets.ts";

const MaintenancePage: FC = () => {
  const openCount = MOCK_TICKETS.filter((t) => t.status === "open").length;
  const inProgressCount = MOCK_TICKETS.filter(
    (t) => t.status === "in_progress"
  ).length;
  const completedCount = MOCK_TICKETS.filter(
    (t) => t.status === "completed"
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Maintenance</h1>
          <p className="text-sm text-slate-600">
            Track work orders, prioritize urgent issues, and keep residents updated.
          </p>
        </div>

        <button className="inline-flex items-center justify-center px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
          + New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Open</p>
          <p className="mt-1 text-xl font-semibold">{openCount}</p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">In Progress</p>
          <p className="mt-1 text-xl font-semibold">{inProgressCount}</p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Completed</p>
          <p className="mt-1 text-xl font-semibold">{completedCount}</p>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Work Orders
          </p>
          <p className="text-xs text-slate-400">
            {MOCK_TICKETS.length} tickets
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs font-medium text-slate-500">
              <tr>
                <th className="px-4 py-2">Ticket</th>
                <th className="px-4 py-2">Property / Unit</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Priority</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Updated</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TICKETS.map((t) => (
                <tr
                  key={t.id}
                  className="border-b last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-4 py-2 text-sm font-medium text-slate-900">
                    {t.title}
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-600">
                    {t.propertyName}
                    <div className="text-xs text-slate-400">Unit {t.unit}</div>
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-600">
                    {t.category}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        t.priority === "high" &&
                          "bg-rose-50 text-rose-700 border border-rose-100",
                        t.priority === "medium" &&
                          "bg-amber-50 text-amber-700 border border-amber-100",
                        t.priority === "low" &&
                          "bg-slate-100 text-slate-600 border border-slate-200",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {t.priority.charAt(0).toUpperCase() +
                        t.priority.slice(1)}{" "}
                      priority
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        t.status === "open" &&
                          "bg-emerald-50 text-emerald-700 border border-emerald-100",
                        t.status === "in_progress" &&
                          "bg-indigo-50 text-indigo-700 border border-indigo-100",
                        t.status === "completed" &&
                          "bg-slate-100 text-slate-600 border border-slate-200",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {t.status === "open" && "Open"}
                      {t.status === "in_progress" && "In progress"}
                      {t.status === "completed" && "Completed"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-600">
                    {t.updatedAt}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                      View ticket
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

export default MaintenancePage;
