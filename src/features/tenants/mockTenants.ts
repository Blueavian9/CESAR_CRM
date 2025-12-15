export type TenantStatus = "current" | "notice" | "past_due";

export interface Tenant {
  id: string;
  name: string;
  propertyName: string;
  unit: string;
  city: string;
  state: string;
  moveInDate: string;
  balance: number;
  status: TenantStatus;
}

export const MOCK_TENANTS: Tenant[] = [
  {
    id: "t1",
    name: "Maria Lopez",
    propertyName: "Ever Hills Apartments",
    unit: "202",
    city: "Los Angeles",
    state: "CA",
    moveInDate: "2023-04-15",
    balance: 0,
    status: "current",
  },
  {
    id: "t2",
    name: "James Chen",
    propertyName: "Sunset View Duplex",
    unit: "A",
    city: "Los Angeles",
    state: "CA",
    moveInDate: "2022-11-01",
    balance: 325,
    status: "past_due",
  },
  {
    id: "t3",
    name: "Ana Rodriguez",
    propertyName: "Ever Short-Stay Lofts",
    unit: "504",
    city: "Los Angeles",
    state: "CA",
    moveInDate: "2024-12-01",
    balance: 0,
    status: "notice",
  },
];
