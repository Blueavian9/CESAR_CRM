import type { FC } from "react";
import { MOCK_PAYMENTS } from "./mockPayments.ts";

const PaymentsPage: FC = () => {
  const collected = MOCK_PAYMENTS.filter((p) => p.status === "completed").reduce(
    (sum, p) => sum + p.amount,
    0
  );
  const outstanding = MOCK_PAYMENTS.filter(
    (p) => p.status === "pending" || p.status === "failed"
  ).reduce((sum, p) => sum + p.amount, 0);
  const failedCount = MOCK_PAYMENTS.filter((p) => p.status === "failed").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Payments</h1>
          <p className="text-sm text-slate-600">
            Monitor rent collection and spot failed or pending payments quickly.
          </p>
        </div>

        <button className="inline-flex items-center justify-center px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
          Record Payment
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Collected (sample month)</p>
          <p className="mt-1 text-xl font-semibold">
            ${collected.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Outstanding</p>
          <p className="mt-1 text-xl font-semibold">
            ${outstanding.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Failed Payments</p>
          <p className="mt-1 text-xl font-semibold">{failedCount}</p>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Recent Activity
          </p>
          <p className="text-xs text-slate-400">
            {MOCK_PAYMENTS.length} payments
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs font-medium text-slate-500">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Tenant</th>
                <th className="px-4 py-2">Property</th>
                <th className="px-4 py-2">Method</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PAYMENTS.map((p) => (
                <tr
                  key={p.id}
                  className="border-b last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-4 py-2 text-sm text-slate-600">{p.date}</td>
                  <td className="px-4 py-2 text-sm font-medium text-slate-900">
                    {p.tenantName}
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-600">
                    {p.propertyName}
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-600">{p.method}</td>
                  <td className="px-4 py-2 text-sm text-slate-600">
                    ${p.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        p.status === "completed" &&
                          "bg-emerald-50 text-emerald-700 border border-emerald-100",
                        p.status === "pending" &&
                          "bg-amber-50 text-amber-700 border border-amber-100",
                        p.status === "failed" &&
                          "bg-rose-50 text-rose-700 border border-rose-100",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {p.status === "completed" && "Completed"}
                      {p.status === "pending" && "Pending"}
                      {p.status === "failed" && "Failed"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                      View receipt
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

export default PaymentsPage;
