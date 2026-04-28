import type { Alert, ScenarioSeed, WorkOrderTemplate } from "@/lib/types";

export const scenarios: ScenarioSeed[] = [
  {
    id: "portfolio-baseline-healthy",
    name: "Portfolio Baseline Healthy",
    affectedAssetIds: [],
    executiveSummary:
      "All four plants are operating inside expected risk bounds with routine watch items only.",
    operationsNarrative:
      "Production lines are stable, takt adherence is on plan, and no single asset is threatening throughput.",
    maintenanceNarrative:
      "Maintenance is operating on planned work with no escalations beyond normal inspection windows.",
    businessImpact: {
      projectedDowntimeHours: 1.8,
      avoidedDowntimeHours: 0,
      protectedRevenue: 0,
      overtimeAvoidance: 0,
      backlogHours: 21,
      openCriticalIssues: 0,
    },
    executiveActions: [
      "Keep Warren in its normal inspection cadence through shift turnover.",
      "Preserve buffer hours in Lansing to avoid backlog compression late in the week.",
      "Use the healthy baseline to compare against any live scenario changes.",
    ],
    presenterNotes: [
      "Use this state to establish trust and the four-plant footprint.",
      "Show how the product starts with a calm, readable operating picture.",
    ],
    assetStates: {},
  },
  {
    id: "detroit-conveyor-bearing-wear",
    name: "Detroit Conveyor Bearing Wear",
    heroPlantId: "detroit-hq",
    heroLineId: "det-seat-line-a",
    heroAssetId: "asset-det-cv-01",
    affectedAssetIds: ["asset-det-cv-01"],
    executiveSummary:
      "Detroit shows early-stage conveyor degradation without immediate stoppage exposure.",
    operationsNarrative:
      "Vibration and temperature are trending above the learned baseline, but the line still has planning room to intervene.",
    maintenanceNarrative:
      "This is a watch-to-warning event designed to demonstrate earlier intervention before a line-impacting failure.",
    businessImpact: {
      projectedDowntimeHours: 3.1,
      avoidedDowntimeHours: 2.2,
      protectedRevenue: 74000,
      overtimeAvoidance: 16000,
      backlogHours: 24,
      openCriticalIssues: 0,
    },
    executiveActions: [
      "Inspect Detroit's main conveyor during the next planned service window.",
      "Keep Warren and Eastaboga stable while Detroit is corrected without overtime.",
      "Use the early-warning trend to explain the value of predictive signals before a critical alert exists.",
    ],
    presenterNotes: [
      "Good backup scenario when you want a softer introduction than the Warren incident.",
    ],
    assetStates: {
      "asset-det-cv-01": {
        healthScore: 71,
        anomalyScore: 0.48,
        riskBand: "watch",
        failureRisk24h: 0.18,
        failureRisk72h: 0.34,
        predictedStoppageWindow: null,
        topDrivers: ["rising vibration", "motor temperature drift"],
        drift: 0.42,
        recommendedAction:
          "Inspect bearing lubrication and revalidate motor current load before the next production window.",
        lineImpact: "No line stop expected in the next shift if serviced in cadence.",
        telemetryProfile: {
          onset: 0.36,
          escalation: 0.74,
          focusStart24h: 0.62,
          volatility: 0.26,
          bursts: [
            { at: 0.68, width: 0.06, magnitude: 0.18 },
            { at: 0.84, width: 0.05, magnitude: 0.24 },
          ],
        },
        alertTitle: "Conveyor bearing wear trend detected",
        alertReason:
          "Vibration RMS and motor temperature moved outside the learned Detroit baseline across four monitoring windows.",
        alertStatus: "acknowledged",
        recoveryHealthScore: 82,
        recoveryAnomalyScore: 0.22,
        recoveryRiskBand: "healthy",
        recoveryFailureRisk24h: 0.08,
        recoveryFailureRisk72h: 0.15,
        recoveryWindow: null,
      },
    },
  },
  {
    id: "warren-robotic-welder-thermal-drift",
    name: "Warren Robotic Welder Thermal Drift",
    heroPlantId: "warren-mi",
    heroLineId: "war-seat-line-a",
    heroAssetId: "asset-war-rw-01",
    affectedAssetIds: ["asset-war-rw-01", "asset-war-cv-01"],
    executiveSummary:
      "Warren is now the top risk site as its primary weld cell approaches a likely stoppage window inside the next shift.",
    operationsNarrative:
      "Thermal rise, current instability, and slower cycle time are compressing buffer on Warren Seat Line A.",
    maintenanceNarrative:
      "The maintenance team can still protect the shift if the cooling circuit and tip condition are corrected immediately.",
    businessImpact: {
      projectedDowntimeHours: 8.2,
      avoidedDowntimeHours: 6.4,
      protectedRevenue: 218000,
      overtimeAvoidance: 43000,
      backlogHours: 34,
      openCriticalIssues: 1,
    },
    executiveActions: [
      "Prioritize Warren Seat Line A over all other network work in the next shift.",
      "Dispatch a thermal recovery work order before the stoppage window tightens under six hours.",
      "Use the stabilized post-fix view to show avoided downtime and protected throughput.",
    ],
    presenterNotes: [
      "This is the primary hero story for the full executive-to-technician walkthrough.",
      "Warren should remain the selected plant unless a presenter intentionally changes the narrative.",
    ],
    notificationPreview: {
      channel: "Operations Alert Preview",
      title: "Warren Seat Line A at risk within next shift",
      body:
        "RW-WAR-01 is showing thermal drift and unstable current draw. Maintenance action recommended before 4:00 PM local time.",
    },
    assetStates: {
      "asset-war-rw-01": {
        healthScore: 42,
        anomalyScore: 0.91,
        riskBand: "critical",
        failureRisk24h: 0.78,
        failureRisk72h: 0.94,
        predictedStoppageWindow: "Within 6-10 hours",
        topDrivers: [
          "rising tip temperature",
          "unstable current draw",
          "cycle-time variance",
        ],
        drift: 0.96,
        recommendedAction:
          "Inspect cooling line flow, clean contact buildup, and recalibrate thermal controls before the next shift handoff.",
        lineImpact:
          "Seat Line A is projected to lose its buffer before the next truck program sequence completes.",
        telemetryProfile: {
          onset: 0.22,
          escalation: 0.7,
          focusStart24h: 0.66,
          volatility: 0.88,
          bursts: [
            { at: 0.58, width: 0.05, magnitude: 0.24 },
            { at: 0.78, width: 0.04, magnitude: 0.46 },
            { at: 0.91, width: 0.03, magnitude: 0.62 },
          ],
        },
        alertTitle: "Robotic welder thermal drift nearing stoppage threshold",
        alertReason:
          "Temperature, current, and cycle-time variance moved outside the learned normal range for Warren Seat Line A.",
        alertStatus: "new",
        recoveryHealthScore: 79,
        recoveryAnomalyScore: 0.24,
        recoveryRiskBand: "watch",
        recoveryFailureRisk24h: 0.16,
        recoveryFailureRisk72h: 0.29,
        recoveryWindow: null,
      },
      "asset-war-cv-01": {
        healthScore: 63,
        anomalyScore: 0.61,
        riskBand: "warning",
        failureRisk24h: 0.31,
        failureRisk72h: 0.53,
        predictedStoppageWindow: "Within 18-24 hours",
        topDrivers: ["motor temperature drift", "speed instability"],
        drift: 0.52,
        recommendedAction:
          "Inspect belt tracking after the weld cell is stabilized to prevent a secondary feed disruption.",
        lineImpact: "Secondary feeder instability is increasing operator intervention.",
        telemetryProfile: {
          onset: 0.32,
          escalation: 0.76,
          focusStart24h: 0.64,
          volatility: 0.41,
          bursts: [
            { at: 0.72, width: 0.05, magnitude: 0.18 },
            { at: 0.88, width: 0.04, magnitude: 0.22 },
          ],
        },
        alertTitle: "Feed conveyor instability following weld cell slowdown",
        alertReason:
          "Belt speed variance increased as the upstream weld cell lost cycle stability.",
        alertStatus: "acknowledged",
        recoveryHealthScore: 76,
        recoveryAnomalyScore: 0.29,
        recoveryRiskBand: "healthy",
        recoveryFailureRisk24h: 0.12,
        recoveryFailureRisk72h: 0.24,
        recoveryWindow: null,
      },
      "asset-det-cv-01": {
        healthScore: 74,
        anomalyScore: 0.4,
        riskBand: "watch",
        failureRisk24h: 0.14,
        failureRisk72h: 0.27,
        predictedStoppageWindow: null,
        topDrivers: ["vibration drift"],
        drift: 0.28,
        recommendedAction:
          "Keep Detroit on its planned watch cadence while Warren receives immediate attention.",
        lineImpact: "No immediate impact.",
        telemetryProfile: {
          onset: 0.44,
          escalation: 0.8,
          focusStart24h: 0.68,
          volatility: 0.18,
          bursts: [{ at: 0.83, width: 0.05, magnitude: 0.12 }],
        },
      },
      "asset-eas-pr-01": {
        healthScore: 66,
        anomalyScore: 0.58,
        riskBand: "warning",
        failureRisk24h: 0.28,
        failureRisk72h: 0.44,
        predictedStoppageWindow: "Within 24-36 hours",
        topDrivers: ["pressure spread", "oil temperature rise"],
        drift: 0.5,
        recommendedAction:
          "Keep Eastaboga acknowledged and hold until the Warren incident is dispatched.",
        lineImpact: "Near-term monitoring required, but not the top network risk.",
        telemetryProfile: {
          onset: 0.28,
          escalation: 0.68,
          focusStart24h: 0.58,
          volatility: 0.52,
          bursts: [
            { at: 0.6, width: 0.06, magnitude: 0.22 },
            { at: 0.82, width: 0.05, magnitude: 0.34 },
          ],
        },
        alertTitle: "Hydraulic pressure instability detected",
        alertReason:
          "Pressure variance persisted across three Eastaboga monitoring windows.",
        alertStatus: "acknowledged",
      },
      "asset-lan-rw-01": {
        healthScore: 69,
        anomalyScore: 0.55,
        riskBand: "warning",
        failureRisk24h: 0.24,
        failureRisk72h: 0.4,
        predictedStoppageWindow: "Within 30-40 hours",
        topDrivers: ["cycle-time drift", "tip wear variance"],
        drift: 0.45,
        recommendedAction:
          "Keep Lansing in queue and avoid splitting Warren technician coverage until the hero issue is stabilized.",
        lineImpact: "Backlog pressure continues to accumulate.",
        telemetryProfile: {
          onset: 0.34,
          escalation: 0.72,
          focusStart24h: 0.61,
          volatility: 0.47,
          bursts: [
            { at: 0.74, width: 0.05, magnitude: 0.2 },
            { at: 0.9, width: 0.04, magnitude: 0.28 },
          ],
        },
        alertTitle: "Backlog pressure increased after delayed maintenance task",
        alertReason:
          "Open work combined with warning-level telemetry on Lansing's weld cell.",
        alertStatus: "in-review",
      },
    },
  },
  {
    id: "eastaboga-hydraulic-pressure-instability",
    name: "Eastaboga Hydraulic Pressure Instability",
    heroPlantId: "eastaboga-al",
    heroLineId: "eas-seat-line-a",
    heroAssetId: "asset-eas-pr-01",
    affectedAssetIds: ["asset-eas-pr-01"],
    executiveSummary:
      "Eastaboga is showing warning-state pressure instability that can still be handled within normal plant response windows.",
    operationsNarrative:
      "Pressure spread and cycle deviation are drifting together, threatening quality and throughput if ignored.",
    maintenanceNarrative:
      "Maintenance can triage the hydraulic system before it becomes a cross-shift disruption.",
    businessImpact: {
      projectedDowntimeHours: 4.6,
      avoidedDowntimeHours: 3.4,
      protectedRevenue: 118000,
      overtimeAvoidance: 26000,
      backlogHours: 29,
      openCriticalIssues: 0,
    },
    executiveActions: [
      "Dispatch Eastaboga in the next planned service slot.",
      "Use this scenario to explain pressure-based anomaly detection.",
      "Keep Warren and Detroit stable while Eastaboga is corrected.",
    ],
    presenterNotes: [
      "Useful as a secondary maintenance-focused storyline.",
    ],
    assetStates: {
      "asset-eas-pr-01": {
        healthScore: 58,
        anomalyScore: 0.72,
        riskBand: "warning",
        failureRisk24h: 0.42,
        failureRisk72h: 0.61,
        predictedStoppageWindow: "Within 16-24 hours",
        topDrivers: [
          "pressure variance",
          "cycle deviation growth",
          "oil temperature rise",
        ],
        drift: 0.7,
        recommendedAction:
          "Inspect the hydraulic manifold, confirm valve response, and validate repeatability with a controlled test cycle.",
        lineImpact:
          "Quality drift is likely before a full line stop if the issue is ignored.",
        telemetryProfile: {
          onset: 0.24,
          escalation: 0.66,
          focusStart24h: 0.57,
          volatility: 0.58,
          bursts: [
            { at: 0.56, width: 0.07, magnitude: 0.26 },
            { at: 0.78, width: 0.05, magnitude: 0.32 },
            { at: 0.9, width: 0.04, magnitude: 0.4 },
          ],
        },
        alertTitle: "Hydraulic pressure instability detected",
        alertReason:
          "Pressure variance persisted for three monitoring windows and cycle timing is diverging from baseline.",
        alertStatus: "acknowledged",
        recoveryHealthScore: 81,
        recoveryAnomalyScore: 0.23,
        recoveryRiskBand: "healthy",
        recoveryFailureRisk24h: 0.11,
        recoveryFailureRisk72h: 0.21,
        recoveryWindow: null,
      },
    },
  },
  {
    id: "lansing-backlog-pressure",
    name: "Lansing Backlog Pressure",
    heroPlantId: "lansing-mi",
    heroLineId: "lan-seat-line-a",
    heroAssetId: "asset-lan-rw-01",
    affectedAssetIds: ["asset-lan-rw-01", "asset-lan-cv-01"],
    executiveSummary:
      "Lansing does not have a single catastrophic asset yet, but open work and warning-state signals are compressing maintenance capacity.",
    operationsNarrative:
      "The plant is still shipping, but its maintenance backlog is weakening schedule protection across two lines.",
    maintenanceNarrative:
      "This scenario demonstrates prioritization when several warning-level issues compete for the same technicians.",
    businessImpact: {
      projectedDowntimeHours: 5,
      avoidedDowntimeHours: 2.6,
      protectedRevenue: 86000,
      overtimeAvoidance: 18000,
      backlogHours: 43,
      openCriticalIssues: 0,
    },
    executiveActions: [
      "Prioritize Lansing's weld cell before the warning stack becomes a critical bottleneck.",
      "Use this view to explain why portfolio prioritization matters even without an active critical asset.",
      "Maintain Warren as the hero story when demonstrating the full intervention flow.",
    ],
    presenterNotes: [
      "Shows portfolio tradeoffs and backlog pressure without relying on a single breakdown event.",
    ],
    assetStates: {
      "asset-lan-rw-01": {
        healthScore: 64,
        anomalyScore: 0.63,
        riskBand: "warning",
        failureRisk24h: 0.32,
        failureRisk72h: 0.51,
        predictedStoppageWindow: "Within 20-30 hours",
        topDrivers: ["cycle-time drift", "tip wear variance"],
        drift: 0.56,
        recommendedAction:
          "Move the Lansing weld cell ahead of non-critical PM work to prevent a compounded backlog event.",
        lineImpact:
          "Line protection is narrowing, especially if the current backlog stretches into the next shift.",
        telemetryProfile: {
          onset: 0.31,
          escalation: 0.7,
          focusStart24h: 0.6,
          volatility: 0.49,
          bursts: [
            { at: 0.62, width: 0.06, magnitude: 0.18 },
            { at: 0.8, width: 0.05, magnitude: 0.26 },
          ],
        },
        alertTitle: "Backlog pressure increased after delayed maintenance task",
        alertReason:
          "Open work combined with warning-level telemetry on Lansing's weld cell.",
        alertStatus: "in-review",
        recoveryHealthScore: 78,
        recoveryAnomalyScore: 0.27,
        recoveryRiskBand: "healthy",
        recoveryFailureRisk24h: 0.12,
        recoveryFailureRisk72h: 0.24,
        recoveryWindow: null,
      },
      "asset-lan-cv-01": {
        healthScore: 77,
        anomalyScore: 0.36,
        riskBand: "watch",
        failureRisk24h: 0.12,
        failureRisk72h: 0.22,
        predictedStoppageWindow: null,
        topDrivers: ["vibration drift"],
        drift: 0.26,
        recommendedAction:
          "Keep the console conveyor on watch while the weld cell receives coverage.",
        lineImpact: "No immediate line stop, but it contributes to backlog drag.",
      },
    },
  },
];

export const seededAlerts: Alert[] = [
  {
    id: "alert-war-rw-01",
    assetId: "asset-war-rw-01",
    plantId: "warren-mi",
    lineId: "war-seat-line-a",
    severity: "critical",
    title: "Robotic welder thermal drift nearing stoppage threshold",
    triggerReason:
      "Temperature, current, and cycle-time variance moved outside the learned normal range.",
    status: "new",
    createdAt: "2026-04-23T12:00:00Z",
    ownerId: "user-mm-01",
  },
  {
    id: "alert-war-cv-01",
    assetId: "asset-war-cv-01",
    plantId: "warren-mi",
    lineId: "war-seat-line-a",
    severity: "warning",
    title: "Feed conveyor instability following weld cell slowdown",
    triggerReason:
      "Belt speed variance increased as the upstream weld cell lost cycle stability.",
    status: "acknowledged",
    createdAt: "2026-04-23T11:10:00Z",
    ownerId: "user-ops-01",
  },
  {
    id: "alert-eas-pr-01",
    assetId: "asset-eas-pr-01",
    plantId: "eastaboga-al",
    lineId: "eas-seat-line-a",
    severity: "warning",
    title: "Hydraulic pressure instability detected",
    triggerReason: "Pressure variance persisted for three monitoring windows.",
    status: "acknowledged",
    createdAt: "2026-04-23T09:30:00Z",
    ownerId: "user-mm-01",
  },
  {
    id: "alert-lan-rw-01",
    assetId: "asset-lan-rw-01",
    plantId: "lansing-mi",
    lineId: "lan-seat-line-a",
    severity: "warning",
    title: "Backlog pressure increased after delayed maintenance task",
    triggerReason:
      "Open work combined with warning-level telemetry on a second Lansing asset.",
    status: "in-review",
    createdAt: "2026-04-23T08:15:00Z",
    ownerId: "user-mm-01",
  },
];

export const seededWorkOrders: WorkOrderTemplate[] = [
  {
    id: "wo-det-1701",
    alertId: "alert-det-cv-01",
    assetId: "asset-det-cv-01",
    assignedTo: "user-tech-01",
    priority: "high",
    status: "assigned",
    title: "Inspect conveyor bearing vibration and lubrication path",
    dueAt: "2026-04-24T12:00:00Z",
    playbookCode: "PB-CONVEYOR-BEARING",
    notes:
      "Verify bearing temperature, listen for cage chatter, and confirm lubrication before the next seat-build window.",
  },
  {
    id: "wo-war-2001",
    alertId: "alert-war-rw-01",
    assetId: "asset-war-rw-01",
    assignedTo: "user-tech-01",
    priority: "urgent",
    status: "assigned",
    title: "Stabilize welder thermal drift before next shift",
    dueAt: "2026-04-23T20:00:00Z",
    playbookCode: "PB-WELDER-THERMAL",
    notes:
      "Confirm tip temperature, current stability, and cooling path before the Warren weld cell loses buffer.",
  },
  {
    id: "wo-eas-1221",
    alertId: "alert-eas-pr-01",
    assetId: "asset-eas-pr-01",
    assignedTo: "user-tech-01",
    priority: "high",
    status: "assigned",
    title: "Validate hydraulic pressure repeatability",
    dueAt: "2026-04-24T13:00:00Z",
    playbookCode: "PB-PRESS-PRESSURE",
    notes:
      "Check pressure spread, cycle repeatability, and hydraulic response before the Eastaboga queue builds.",
  },
  {
    id: "wo-lan-1042",
    alertId: "alert-lan-rw-01",
    assetId: "asset-lan-rw-01",
    assignedTo: "user-tech-02",
    priority: "high",
    status: "in_progress",
    title: "Validate welder cycle consistency and inspect tip wear",
    dueAt: "2026-04-24T14:00:00Z",
    playbookCode: "PB-WELDER-THERMAL",
    notes:
      "Keep Lansing moving while Warren takes network priority. Validation cycle already in progress.",
  },
];
