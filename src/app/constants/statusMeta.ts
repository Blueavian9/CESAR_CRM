import type {
  LeaseStatus,
  PaymentStatus,
  MaintenanceStatus,
  TenantStatus,
} from "../types/domain";

export const LEASE_STATUS_LABEL: Record<LeaseStatus, string> = {
  pending: "Pending",
  active: "Active",
  expiring: "Expiring Soon",
  expired: "Expired",
  terminated: "Terminated",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  overdue: "Overdue",
  failed: "Failed",
  refunded: "Refunded",
};

export const MAINT_STATUS_LABEL: Record<MaintenanceStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const TENANT_STATUS_LABEL: Record<TenantStatus, string> = {
  lead: "Lead",
  applicant: "Applicant",
  active: "Active",
  past: "Past",
};
