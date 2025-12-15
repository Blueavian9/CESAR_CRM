import { useState, type FC } from "react";
import { MOCK_TICKETS, type Ticket, type TicketStatus } from "./mockTickets";

const MaintenancePage: FC = () => {
  // State to manage tickets (starts with mock data)
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Calculate counts
  const openCount = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
  const completedCount = tickets.filter((t) => t.status === "completed").length;

  // Function to add new ticket
  const handleAddTicket = (newTicket: Omit<Ticket, "id" | "updatedAt">) => {
    const ticket: Ticket = {
      ...newTicket,
      id: `m${Date.now()}`, // Simple ID generation
      updatedAt: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setTickets([ticket, ...tickets]); // Add to beginning of array
    setShowNewTicketModal(false);
  };

  // Function to update ticket status
  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    setTickets(
      tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: newStatus,
              updatedAt: new Date().toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : t
      )
    );
    setSelectedTicket(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Maintenance</h1>
          <p className="text-sm text-slate-600">
            Track work orders, prioritize urgent issues, and keep residents updated.
          </p>
        </div>

        <button
          onClick={() => setShowNewTicketModal(true)}
          className="inline-flex items-center justify-center px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
        >
          + New Ticket
        </button>
      </div>

      {/* Stats Cards */}
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

      {/* Tickets Table */}
      <div className="rounded-lg border bg-white">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Work Orders
          </p>
          <p className="text-xs text-slate-400">{tickets.length} tickets</p>
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
              {tickets.map((t) => (
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
                      {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}{" "}
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
                    <button
                      onClick={() => setSelectedTicket(t)}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      View ticket
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <NewTicketModal
          onClose={() => setShowNewTicketModal(false)}
          onSubmit={handleAddTicket}
        />
      )}

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

// New Ticket Modal Component
const NewTicketModal: FC<{
  onClose: () => void;
  onSubmit: (ticket: Omit<Ticket, "id" | "updatedAt">) => void;
}> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    propertyName: "",
    unit: "",
    category: "",
    priority: "medium" as "low" | "medium" | "high",
    status: "open" as TicketStatus,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Create New Ticket</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Leaking kitchen sink"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Property Name
            </label>
            <input
              type="text"
              required
              value={formData.propertyName}
              onChange={(e) =>
                setFormData({ ...formData, propertyName: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Ever Hills Apartments"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Unit
            </label>
            <input
              type="text"
              required
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., 105"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Category
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select category</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="HVAC">HVAC</option>
              <option value="Appliances">Appliances</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as "low" | "medium" | "high",
                })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-md hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Ticket Details Modal Component
const TicketDetailsModal: FC<{
  ticket: Ticket;
  onClose: () => void;
  onStatusChange: (ticketId: string, newStatus: TicketStatus) => void;
}> = ({ ticket, onClose, onStatusChange }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold">{ticket.title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium text-slate-700">Property:</span>{" "}
            {ticket.propertyName}
          </div>
          <div>
            <span className="font-medium text-slate-700">Unit:</span>{" "}
            {ticket.unit}
          </div>
          <div>
            <span className="font-medium text-slate-700">Category:</span>{" "}
            {ticket.category}
          </div>
          <div>
            <span className="font-medium text-slate-700">Priority:</span>{" "}
            <span
              className={[
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ml-2",
                ticket.priority === "high" &&
                  "bg-rose-50 text-rose-700 border border-rose-100",
                ticket.priority === "medium" &&
                  "bg-amber-50 text-amber-700 border border-amber-100",
                ticket.priority === "low" &&
                  "bg-slate-100 text-slate-600 border border-slate-200",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
            </span>
          </div>
          <div>
            <span className="font-medium text-slate-700">Last Updated:</span>{" "}
            {ticket.updatedAt}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-700 mb-2">
            Update Status:
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onStatusChange(ticket.id, "open")}
              disabled={ticket.status === "open"}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                ticket.status === "open"
                  ? "bg-emerald-100 text-emerald-700 cursor-not-allowed"
                  : "bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              Open
            </button>
            <button
              onClick={() => onStatusChange(ticket.id, "in_progress")}
              disabled={ticket.status === "in_progress"}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                ticket.status === "in_progress"
                  ? "bg-indigo-100 text-indigo-700 cursor-not-allowed"
                  : "bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => onStatusChange(ticket.id, "completed")}
              disabled={ticket.status === "completed"}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                ticket.status === "completed"
                  ? "bg-slate-200 text-slate-700 cursor-not-allowed"
                  : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;