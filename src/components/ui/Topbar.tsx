import { Bell, Search, UserCircle2 } from "lucide-react";
import { useSearch } from "../../app/context/SearchContext";

const Topbar = () => {
  const { query, setQuery } = useSearch();

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b bg-white">
      {/* Left: global search */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-2 flex items-center">
            <Search className="w-4 h-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search properties, tenants, leases..."
            className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Right: notifications + user */}
      <div className="ml-4 flex items-center gap-4">
        <button
          type="button"
          className="relative inline-flex items-center justify-center rounded-full p-2 hover:bg-slate-100"
        >
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5 text-slate-500" />
          <span className="absolute top-1 right-1 inline-flex h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <span className="text-xs font-medium text-slate-900">
              Ever Hernandez
            </span>
            <span className="text-[11px] text-slate-500">
              Property Manager
            </span>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
            <UserCircle2 className="h-6 w-6 text-slate-500" />
          </span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
