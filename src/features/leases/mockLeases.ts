import type { LeaseStatus } from "../../app/types/domain";

export interface Lease {
  id: string;
  code: string;
  propertyName: string;
  unit: string;
  tenantName: string;
  startDate: string;
  endDate: string;
  rent: number;
  status: LeaseStatus;
}

export const MOCK_LEASES: Lease[] = [
  {
    id: "l1",
    code: "LH-202-2023",
    propertyName: "Ever Hills Apartments",
    unit: "202",
    tenantName: "Maria Lopez",
    startDate: "2023-04-15",
    endDate: "2024-04-14",
    rent: 2450,
    status: "expiring",
  },
  {
    id: "l2",
    code: "SV-A-2022",
    propertyName: "Sunset View Duplex",
    unit: "A",
    tenantName: "James Chen",
    startDate: "2022-11-01",
    endDate: "2023-10-31",
    rent: 2100,
    status: "expired",
  },
  {
    id: "l3",
    code: "EL-504-MTM",
    propertyName: "Ever Short-Stay Lofts",
    unit: "504",
    tenantName: "Ana Rodriguez",
    startDate: "2024-12-01",
    endDate: "MTM",
    rent: 3200,
    status: "active",
  },
];
