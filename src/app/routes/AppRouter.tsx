import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layout/Layout";
import DashboardPage from "../../features/dashboard/DashboardPage";
import PropertiesPage from "../../features/properties/PropertiesPage";
import TenantsPage from "../../features/tenants/TenantsPage";
import LeasesPage from "../../features/leases/LeasesPage";
import PaymentsPage from "../../features/payments/PaymentsPage";
import MaintenancePage from "../../features/maintenance/MaintenancePage";
import PropertyDetailsPage from "../../features/properties/PropertyDetailsPage";
import TenantDetailsPage from "../../features/tenants/TenantDetailsPage";
import LeaseDetailsPage from "../../features/leases/LeaseDetailsPage";
import PaymentDetailsPage from "../../features/payments/PaymentDetailsPage";

const AppRouter = () => {
  return (
  <Routes>
          <Route path="/" element={<Layout />}>
        {/* When user hits "/", send them to /dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<DashboardPage />} />

        {/* Properties */}
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="properties/:id" element={<PropertyDetailsPage />} />

        {/* Tenants */}
        <Route path="tenants" element={<TenantsPage />} />
        <Route path="tenants/:id" element={<TenantDetailsPage />} />

        {/* Leases */}
        <Route path="leases" element={<LeasesPage />} />
        <Route path="leases/:id" element={<LeaseDetailsPage />} />

        {/* Payments */}
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="payments/:id" element={<PaymentDetailsPage />} />

        {/* Maintenance */}
        <Route path="maintenance" element={<MaintenancePage />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
</Routes>
  );
};

export default AppRouter;
