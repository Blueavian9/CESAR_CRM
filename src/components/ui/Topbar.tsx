import { Bell, Search, UserCircle2 } from "lucide-react";

const Topbar = () => {
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
          />
        </div>
      </div>

      {/* Right: notifications + user */}
      <div className="flex items-center gap-4 ml-4">
        <button className="relative p-1 rounded-full hover:bg-slate-100">
          <Bell className="w-5 h-5 text-slate-500" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2">
          <UserCircle2 className="w-7 h-7 text-slate-500" />
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-medium text-slate-800">
              Ever Hernandez
            </span>
            <span className="text-[11px] text-slate-500">
              Property Manager
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
