import type { LeaseStatus, PaymentStatus, MaintenanceStatus, TenantStatus } from "../types/domain";

export const LEASE_STATUS_VARIANT: Record<LeaseStatus, "green" | "amber" | "sky" | "rose" | "slate"> = {
  active: "green",
  pending: "amber",
  expiring: "sky",
  expired: "rose",
  terminated: "slate",
};

export const PAYMENT_STATUS_VARIANT: Record<PaymentStatus, "green" | "amber" | "sky" | "rose" | "slate"> = {
  paid: "green",
  pending: "amber",
  overdue: "rose",
  failed: "rose",
  refunded: "slate",
};

export const MAINT_STATUS_VARIANT: Record<MaintenanceStatus, "green" | "amber" | "sky" | "rose" | "slate"> = {
  open: "amber",
  in_progress: "sky",
  completed: "green",
  cancelled: "slate",
};

export const TENANT_STATUS_VARIANT: Record<TenantStatus, "green" | "amber" | "sky" | "rose" | "slate"> = {
  lead: "amber",
  applicant: "sky",
  active: "green",
  past: "slate",
};
