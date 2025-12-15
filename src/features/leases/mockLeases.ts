// src/app/types/domain.ts

export type EntityStatus = "active" | "expiring"

  | "pending"
  | "active"
  | "expiring"
  | "expired"
  | "ended"
  | "terminated";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "overdue"
  | "failed"
  | "refunded";

export type MaintenanceStatus = "open" | "in_progress" | "completed" | "cancelled";

export type TenantStatus = "lead" | "applicant" | "active" | "past";
