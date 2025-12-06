import { NavLink } from "react-router-dom";
import { Building2, Users, FileText, DollarSign, Wrench, LayoutDashboard } from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/properties", label: "Properties", icon: Building2 },
  { to: "/tenants", label: "Tenants", icon: Users },
  { to: "/leases", label: "Leases", icon: FileText },
  { to: "/payments", label: "Payments", icon: DollarSign },
  { to: "/maintenance", label: "Maintenance", icon: Wrench },
];

const Sidebar = () => {
  return (
    <aside className="hidden md:flex md:flex-col w-64 border-r bg-white">
      <div className="h-16 flex items-center px-4 border-b">
        <span className="font-semibold text-lg tracking-tight">
          Ever<span className="text-indigo-600">CRM</span>
        </span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")
            }
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
