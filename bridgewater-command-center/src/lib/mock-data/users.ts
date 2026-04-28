import type { User } from "@/lib/types";

export const users: User[] = [
  {
    id: "user-exec-01",
    name: "Avery Collins",
    role: "executive",
    title: "VP, Operations Strategy",
    shift: "Network",
  },
  {
    id: "user-ops-01",
    name: "Jordan Hayes",
    role: "operations-supervisor",
    title: "Warren Operations Supervisor",
    defaultPlantId: "warren-mi",
    shift: "1st Shift",
  },
  {
    id: "user-mm-01",
    name: "Samir Patel",
    role: "maintenance-manager",
    title: "Maintenance Manager",
    defaultPlantId: "warren-mi",
    shift: "Coverage Lead",
  },
  {
    id: "user-tech-01",
    name: "Elena Brooks",
    role: "technician",
    title: "Senior Maintenance Technician",
    defaultPlantId: "warren-mi",
    shift: "1st Shift",
  },
  {
    id: "user-tech-02",
    name: "Marcus Reed",
    role: "technician",
    title: "Maintenance Technician",
    defaultPlantId: "lansing-mi",
    shift: "2nd Shift",
  },
];
