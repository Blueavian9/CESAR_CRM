const DashboardPage = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-sm text-slate-600">
        High-level overview of your portfolio: properties, leases, payments, and maintenance.
      </p>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-xs text-slate-500">Total Properties</p>
          <p className="mt-2 text-2xl font-semibold">0</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-xs text-slate-500">Active Leases</p>
          <p className="mt-2 text-2xl font-semibold">0</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-xs text-slate-500">Vacant Units</p>
          <p className="mt-2 text-2xl font-semibold">0</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-xs text-slate-500">Overdue Payments</p>
          <p className="mt-2 text-2xl font-semibold">0</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
