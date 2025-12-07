import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layout/Layout";
import DashboardPage from "../../features/dashboard/DashboardPage";
import PropertiesPage from "../../features/properties/PropertiesPage";
import TenantsPage from "../../features/tenants/TenantsPage";
import LeasesPage from "../../features/leases/LeasesPage";
import PaymentsPage from "../../features/payments/PaymentsPage";
import MaintenancePage from "../../features/maintenance/MaintenancePage";

const AppRouter = () => {
  return (
    <Routes>
      {/* Root layout for all authenticated routes */}
      <Route path="/" element={<Layout />}>
        {/* When user hits "/", send them to /dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="tenants" element={<TenantsPage />} />
        <Route path="leases" element={<LeasesPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="maintenance" element={<MaintenancePage />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
