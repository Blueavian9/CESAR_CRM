import type { EntityStatus } from "@/app/types/domain";

export type PropertyStatus = EntityStatus;

export type PropertyType =
  | "Multifamily"
  | "Single Family"
  | "Commercial"
  | "Short-Term";

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  unitsTotal: number;
  unitsOccupied: number;
  unitsVacant: number;
  type: PropertyType;
  status: PropertyStatus;
  createdAt: string;
}
