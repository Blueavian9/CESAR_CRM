import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layout/Layout";
import RequireAuth from "../../features/auth/RequireAuth";
import SignInPage from "../../features/auth/SignInPage";
import SignUpPage from "../../features/auth/SignUpPage";
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
      {/* Public auth routes */}
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />

      {/* Protected app routes */}
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="properties/:id" element={<PropertyDetailsPage />} />
          <Route path="tenants" element={<TenantsPage />} />
          <Route path="tenants/:id" element={<TenantDetailsPage />} />
          <Route path="leases" element={<LeasesPage />} />
          <Route path="leases/:id" element={<LeaseDetailsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="payments/:id" element={<PaymentDetailsPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;