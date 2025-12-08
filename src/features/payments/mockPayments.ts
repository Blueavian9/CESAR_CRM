export type PaymentStatus = "completed" | "pending" | "failed";

export interface Payment {
  id: string;
  date: string;
  tenantName: string;
  propertyName: string;
  method: string;
  amount: number;
  status: PaymentStatus;
}

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: "p1",
    date: "2024-12-01",
    tenantName: "Maria Lopez",
    propertyName: "Ever Hills Apartments",
    method: "ACH",
    amount: 2450,
    status: "completed",
  },
  {
    id: "p2",
    date: "2024-12-03",
    tenantName: "James Chen",
    propertyName: "Sunset View Duplex",
    method: "Card",
    amount: 2100,
    status: "failed",
  },
  {
    id: "p3",
    date: "2024-12-05",
    tenantName: "Ana Rodriguez",
    propertyName: "Ever Short-Stay Lofts",
    method: "Card",
    amount: 3200,
    status: "pending",
  },
];
