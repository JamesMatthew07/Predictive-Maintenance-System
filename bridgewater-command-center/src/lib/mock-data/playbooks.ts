import type { Playbook } from "@/lib/types";

export const playbooks: Playbook[] = [
  {
    code: "PB-CONVEYOR-BEARING",
    assetType: "conveyor",
    title: "Conveyor Bearing and Drive Stability",
    overview:
      "Address rising vibration, heat, and current imbalance before belt speed degrades into a stoppage event.",
    estimatedDurationMinutes: 65,
    steps: [
      "Inspect bearing housing for heat rise and lubrication loss.",
      "Confirm belt tracking and remove debris from the drive zone.",
      "Validate current draw at the motor starter and compare to normal load.",
      "Run a short post-adjustment cycle to verify speed recovery.",
    ],
    verification: [
      "Vibration trend returns inside the watch band.",
      "Motor temperature stabilizes across three sample windows.",
    ],
  },
  {
    code: "PB-WELDER-THERMAL",
    assetType: "robotic-welder",
    title: "Welder Thermal Drift Recovery",
    overview:
      "Stabilize heat and current variance before the weld cell crosses its stoppage threshold in the next shift.",
    estimatedDurationMinutes: 75,
    steps: [
      "Verify the temperature sensor reading against a handheld check.",
      "Inspect cooling line flow and purge any obstruction.",
      "Inspect tip wear and clean contact buildup on the arm.",
      "Review current-draw variance and recalibrate thermal controls.",
      "Run a validation cycle and confirm cycle time returns to nominal.",
    ],
    verification: [
      "Tip temperature trend resumes inside the warning band.",
      "Cycle time variance stays below 0.2 seconds for five consecutive cycles.",
    ],
  },
  {
    code: "PB-PRESS-PRESSURE",
    assetType: "hydraulic-press",
    title: "Hydraulic Pressure Stability Check",
    overview:
      "Correct pressure instability before quality drift becomes a throughput issue across the plant.",
    estimatedDurationMinutes: 70,
    steps: [
      "Inspect hydraulic manifold pressure and valve response.",
      "Check oil temperature rise and verify cooling performance.",
      "Review cycle deviation against the prior healthy run profile.",
      "Run a controlled press test and confirm repeatability.",
    ],
    verification: [
      "Pressure spread collapses inside the healthy operating band.",
      "Cycle deviation remains inside 0.05 seconds during validation.",
    ],
  },
];
