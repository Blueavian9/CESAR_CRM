export type TicketStatus = "open" | "in_progress" | "completed";

export interface Ticket {
  id: string;
  title: string;
  propertyName: string;
  unit: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: TicketStatus;
  updatedAt: string;
}

export const MOCK_TICKETS: Ticket[] = [
  {
    id: "m1",
    title: "Leaking kitchen sink",
    propertyName: "Ever Hills Apartments",
    unit: "105",
    category: "Plumbing",
    priority: "high",
    status: "open",
    updatedAt: "2024-12-06 09:32",
  },
  {
    id: "m2",
    title: "Hallway light flickering",
    propertyName: "Cesar Plaza Offices",
    unit: "3F",
    category: "Electrical",
    priority: "medium",
    status: "in_progress",
    updatedAt: "2024-12-05 14:10",
  },
  {
    id: "m3",
    title: "AC filter replacement",
    propertyName: "Cesar Short-Stay Lofts",
    unit: "712",
    category: "HVAC",
    priority: "low",
    status: "completed",
    updatedAt: "2024-12-02 11:05",
  },
];
