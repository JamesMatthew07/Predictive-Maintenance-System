import type { Plant } from "@/lib/types";

export const plants: Plant[] = [
  {
    id: "detroit-hq",
    name: "Detroit HQ",
    label: "Headquarters - Detroit, Michigan",
    city: "Detroit",
    state: "MI",
    address: "4617 W Fort St., Detroit, MI 48209-3208",
    isHeadquarters: true,
    vehiclePrograms: ["Ram Classic"],
    summary:
      "Bridgewater headquarters and southwest Detroit production facility.",
    operationalFocus: "Executive oversight, sequencing support, and mixed-model seating.",
  },
  {
    id: "warren-mi",
    name: "Warren",
    label: "Warren, Michigan",
    city: "Warren",
    state: "MI",
    address: "7500 Tank Avenue, Warren, MI 48092-2707",
    isHeadquarters: false,
    vehiclePrograms: ["Ford F-150", "RAM 1500"],
    summary:
      "High-throughput Warren facility used as the primary hero incident site.",
    operationalFocus: "Seat assembly, welding, and JIT delivery for truck programs.",
  },
  {
    id: "eastaboga-al",
    name: "Eastaboga",
    label: "Eastaboga, Alabama",
    city: "Eastaboga",
    state: "AL",
    address: "1 Bridgewater Dr., Eastaboga, AL 36260",
    isHeadquarters: false,
    vehiclePrograms: ["Honda Pilot", "Honda Passport"],
    summary:
      "Secondary plant used to show cross-site pressure and hydraulic risk.",
    operationalFocus: "Seat sub-assembly and hydraulic forming stability.",
  },
  {
    id: "lansing-mi",
    name: "Lansing",
    label: "Lansing, Michigan",
    city: "Lansing",
    state: "MI",
    address: "2369 S Canal Rd., Lansing, MI 48917-8589",
    isHeadquarters: false,
    vehiclePrograms: [
      "Buick Enclave",
      "Cadillac CT4",
      "Cadillac CT5",
      "Chevy Camaro",
    ],
    summary:
      "Plant used to represent backlog pressure and competing maintenance priorities.",
    operationalFocus: "Mixed-model seating and center-console sequencing.",
  },
];
