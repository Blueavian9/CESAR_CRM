export type PropertyStatus = "active" | "inactive" | "draft";

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
  createdAt: string; // ISO string
}
