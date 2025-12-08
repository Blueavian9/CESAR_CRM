import { Bell, Search, UserCircle2 } from "lucide-react";
import { useSearch } from "../../app/context/SearchContext";

const Topbar = () => {
  const { query, setQuery } = useSearch();

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b bg-white">
      {/* Left: search */}
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
      {/* ...rest of your existing Topbar code... */}
    </header>
  );
};

export default Topbar;
