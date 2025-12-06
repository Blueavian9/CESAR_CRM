import { Outlet, NavLink } from "react-router-dom";
import Sidebar from "../../components/ui/Sidebar";
import Topbar from "../../components/ui/Topbar";

const Layout = () => {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <Topbar />

        {/* Content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
