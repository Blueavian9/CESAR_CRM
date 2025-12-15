import type { FC } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MOCK_PAYMENTS } from "./mockPayments";

const PaymentDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const payment = MOCK_PAYMENTS.find((p) => p.id === id);

  if (!payment) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          ← Back
        </button>
        <p className="text-sm text-slate-700">Payment not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb + back */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link
            to="/payments"
            className="text-indigo-600 hover:text-indigo-700"
          >
            Payments
          </Link>
          <span>/</span>
          <span>{payment.tenantName}</span>
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
            Payment from {payment.tenantName}
          </h1>
          <p className="text-sm text-slate-600">
            {payment.propertyName}
            {payment.unit && ` • Unit ${payment.unit}`}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Posted on {payment.date}
          </p>
        </div>

        <span
          className={[
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize",
            payment.status === "completed" &&
              "bg-emerald-50 text-emerald-700 border border-emerald-100",
            payment.status === "pending" &&
              "bg-amber-50 text-amber-700 border border-amber-100",
            payment.status === "failed" &&
              "bg-rose-50 text-rose-700 border border-rose-100",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {payment.status}
        </span>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Amount</p>
          <p className="mt-1 text-xl font-semibold">
            ${payment.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Method</p>
          <p className="mt-1 text-sm font-medium text-slate-900">
            {payment.method}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Reference</p>
          <p className="mt-1 text-sm font-mono text-slate-900">
            {payment.reference ?? "—"}
          </p>
        </div>
      </div>

      {/* Layout */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-lg border bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Notes / activity
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              Placeholder – later this can show how this payment was applied to
              charges, any reversals, and communication with the resident.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Payer details
            </h2>
            <dl className="mt-2 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <dt className="text-slate-500">Tenant</dt>
                <dd>{payment.tenantName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Property</dt>
                <dd>{payment.propertyName}</dd>
              </div>
              {payment.unit && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Unit</dt>
                  <dd>{payment.unit}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsPage;