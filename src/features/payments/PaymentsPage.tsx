import { useState, type FC } from "react";
import { Link } from "react-router-dom";

import { MOCK_PAYMENTS, type Payment } from "./mockPayments";
import type { PaymentStatus } from "../../app/types/domain"; 

import StatusBadge from "../../components/ui/StatusBadge";
import { PAYMENT_STATUS_LABEL } from "../../app/types/statusLabels";
import { PAYMENT_STATUS_VARIANT } from "../../app/types/statusStyles";

const PaymentsPage: FC = () => {
  // State management
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and search logic
  const filteredPayments = payments.filter((p) => {
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.tenantName.toLowerCase().includes(q) ||
      p.propertyName.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  // Calculate stats
  const collected = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const outstanding = payments
    .filter((p) => p.status === "pending" || p.status === "failed")
    .reduce((sum, p) => sum + p.amount, 0);

  const failedCount = payments.filter((p) => p.status === "failed").length;

  // Add new payment
  const handleRecordPayment = (newPayment: Omit<Payment, "id">) => {
    const payment: Payment = {
      ...newPayment,
      id: `p${Date.now()}`,
    };
    setPayments([payment, ...payments]);
    setShowRecordModal(false);
  };

  // Update payment status
  const handleStatusChange = (paymentId: string, newStatus: PaymentStatus) => {
    setPayments(
      payments.map((p) => (p.id === paymentId ? { ...p, status: newStatus } : p))
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Payments</h1>
          <p className="text-sm text-slate-600">
            Monitor rent collection and spot failed or pending payments quickly.
          </p>
        </div>

        <button
          onClick={() => setShowRecordModal(true)}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
        >
          + Record Payment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">Collected</p>
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

      {/* Filters and Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              filterStatus === "all"
                ? "bg-indigo-100 text-indigo-700"
                : "border bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            All ({payments.length})
          </button>

          <button
            onClick={() => setFilterStatus("paid")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              filterStatus === "paid"
                ? "bg-emerald-100 text-emerald-700"
                : "border bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Paid ({payments.filter((p) => p.status === "paid").length})
          </button>

          <button
            onClick={() => setFilterStatus("pending")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              filterStatus === "pending"
                ? "bg-amber-100 text-amber-700"
                : "border bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Pending ({payments.filter((p) => p.status === "pending").length})
          </button>

          <button
            onClick={() => setFilterStatus("failed")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              filterStatus === "failed"
                ? "bg-rose-100 text-rose-700"
                : "border bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Failed ({failedCount})
          </button>
        </div>

        <input
          type="text"
          placeholder="Search tenant or property..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Payments Table */}
      <div className="rounded-lg border bg-white">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {filterStatus === "all"
              ? "All Payments"
              : `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Payments`}
          </p>
          <p className="text-xs text-slate-400">{filteredPayments.length} payments</p>
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
              {filteredPayments.length === 0 ? (
                <tr>
                  <td className="px-4 py-2">
                    <StatusBadge
                      label={PAYMENT_STATUS_LABEL[payments.status]}
                      variant={[PAYMENT_STATUS_VARIANT[p.status]}
                      />
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
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
                      {p.unit && (
                        <div className="text-xs text-slate-400">Unit {p.unit}</div>
                      )}
                    </td>

                    <td className="px-4 py-2 text-sm text-slate-600">{p.method}</td>

                    <td className="px-4 py-2 text-sm text-slate-600">
                      ${p.amount.toLocaleString()}
                    </td>
{filteredPayments.length === 0 ? (
  <tr>
    <td
      colSpan={7}
      className="px-4 py-8 text-center text-sm text-slate-500"
    >
      No payments found
    </td>
  </tr>
) : (
  filteredPayments.map((p) => (
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
        {p.unit && (
          <div className="text-xs text-slate-400">Unit {p.unit}</div>
        )}
      </td>

      <td className="px-4 py-2 text-sm text-slate-600">{p.method}</td>

      <td className="px-4 py-2 text-sm text-slate-600">
        ${p.amount.toLocaleString()}
      </td>

      <td className="px-4 py-2">
        <StatusBadge
          label={PAYMENT_STATUS_LABEL[p.status]}
          variant={PAYMENT_STATUS_VARIANT[p.status]}
        />
      </td>

      <td className="px-4 py-2 text-right">
        <div className="flex items-center justify-end gap-2">
          {(p.status === "pending" || p.status === "failed") && (
            <>
              <button
                onClick={() => handleStatusChange(p.id, "paid")}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
              >
                Mark Paid
              </button>
              <span className="text-slate-300">|</span>
            </>
          )}

          <Link
            to={`/payments/${p.id}`}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
          >
            View
          </Link>
        </div>
      </td>
    </tr>
  ))
)}

                   

                    <td className="px-4 py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(p.status === "pending" || p.status === "failed") && (
                          <>
                            <button
                              onClick={() => handleStatusChange(p.id, "paid")}
                              className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                            >
                              Mark Paid
                            </button>
                            <span className="text-slate-300">|</span>
                          </>
                        )}

                        <Link
                          to={`/payments/${p.id}`}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showRecordModal && (
        <RecordPaymentModal
          onClose={() => setShowRecordModal(false)}
          onSubmit={handleRecordPayment}
        />
      )}
    </div>
  );
};

// Record Payment Modal Component
const RecordPaymentModal: FC<{
  onClose: () => void;
  onSubmit: (payment: Omit<Payment, "id">) => void;
}> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    tenantName: "",
    propertyName: "",
    unit: "",
    method: "ACH",
    amount: "",
    status: "paid" as PaymentStatus,
    reference: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      unit: formData.unit.trim() ? formData.unit : undefined,
      amount: parseFloat(formData.amount),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Record Payment</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Date
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Tenant Name
            </label>
            <input
              type="text"
              required
              value={formData.tenantName}
              onChange={(e) =>
                setFormData({ ...formData, tenantName: e.target.value })
              }
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Maria Lopez"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Property Name
            </label>
            <input
              type="text"
              required
              value={formData.propertyName}
              onChange={(e) =>
                setFormData({ ...formData, propertyName: e.target.value })
              }
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Ever Hills Apartments"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Unit (optional)
            </label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., 105"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Payment Method
            </label>
            <select
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ACH">ACH Transfer</option>
              <option value="Card">Credit/Debit Card</option>
              <option value="Check">Check</option>
              <option value="Cash">Cash</option>
              <option value="Wire">Wire Transfer</option>
              <option value="Zelle">Zelle</option>
              <option value="Venmo">Venmo</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-500">$</span>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full rounded-md border py-2 pl-7 pr-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Reference/Transaction ID (optional)
            </label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) =>
                setFormData({ ...formData, reference: e.target.value })
              }
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., ACH-2024120100145"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as PaymentStatus })
              }
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="overdue">Overdue</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border px-4 py-2 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentsPage;
