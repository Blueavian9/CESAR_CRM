export type PaymentStatus = "completed" | "pending" | "failed";

export interface Payment {
  id: string;
  date: string;
  tenantName: string;
  propertyName: string;
  unit?: string; // ✅ Added - optional because not all properties have units
  method: string;
  amount: number;
  status: PaymentStatus;
  reference?: string; // ✅ Added - optional reference/transaction ID
}

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: "p1",
    date: "2024-12-01",
    tenantName: "Maria Lopez",
    propertyName: "Ever Hills Apartments",
    unit: "105", // ✅ Added
    method: "ACH",
    amount: 2450,
    status: "completed",
    reference: "ACH-2024120100145", // ✅ Added
  },
  {
    id: "p2",
    date: "2024-12-03",
    tenantName: "James Chen",
    propertyName: "Sunset View Duplex",
    unit: "B", // ✅ Added
    method: "Card",
    amount: 2100,
    status: "failed",
    reference: "CARD-XXXX4532", // ✅ Added
  },
  {
    id: "p3",
    date: "2024-12-05",
    tenantName: "Ana Rodriguez",
    propertyName: "Ever Short-Stay Lofts",
    unit: "712", // ✅ Added
    method: "Card",
    amount: 3200,
    status: "pending",
    reference: "CARD-XXXX9821", // ✅ Added
  },
];