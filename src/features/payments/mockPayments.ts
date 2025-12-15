import type { PaymentStatus } from "../../app/types/domain";

export interface Payment {
  id: string;
  date: string;
  tenantName: string;
  propertyName: string;
  unit?: string;
  method: string;
  amount: number;
  status: PaymentStatus;
  reference?: string;
}

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: "p1",
    date: "2024-12-01",
    tenantName: "Maria Lopez",
    propertyName: "Ever Hills Apartments",
    unit: "105",
    method: "ACH",
    amount: 2450,
    status: "paid", // ✅ was "completed"
    reference: "ACH-2024120100145",
  },
  {
    id: "p2",
    date: "2024-12-03",
    tenantName: "James Chen",
    propertyName: "Sunset View Duplex",
    unit: "B",
    method: "Card",
    amount: 2100,
    status: "failed",
    reference: "CARD-XXXX4532",
  },
  {
    id: "p3",
    date: "2024-12-05",
    tenantName: "Ana Rodriguez",
    propertyName: "Ever Short-Stay Lofts",
    unit: "712",
    method: "Card",
    amount: 3200,
    status: "pending",
    reference: "CARD-XXXX9821",
  },
];
