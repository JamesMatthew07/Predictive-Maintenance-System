# Bridgewater Seeded Data Model

## Purpose

This document defines the mock domain model and the initial Bridgewater-specific seeded data required to build the predictive maintenance mockup.

It is intentionally optimized for:

- local app data only
- deterministic scenario behavior
- believable multi-plant enterprise visibility
- a controlled Bridgewater-specific demo story

## Modeling Principles

- use real public Bridgewater plant names and addresses
- keep the entity model production-shaped, but not overbuilt
- prefer a small number of highly curated entities over broad fake enterprise depth
- make every seeded record useful to at least one screen in the demo
- keep all risk outputs deterministic

## Entity Overview

Recommended top-level entities:

- `BrandConfig`
- `Plant`
- `Line`
- `Asset`
- `Sensor`
- `TelemetrySeries`
- `HealthSnapshot`
- `PredictionSnapshot`
- `Alert`
- `WorkOrder`
- `WorkOrderChecklistItem`
- `User`
- `Scenario`
- `ExecutiveMetric`
- `Playbook`

## Seed File Structure

Recommended module layout:

```text
lib/mock-data/
  brand.ts
  plants.ts
  lines.ts
  assets.ts
  sensors.ts
  telemetry.ts
  snapshots.ts
  alerts.ts
  work-orders.ts
  users.ts
  scenarios.ts
  playbooks.ts
```

## 1. Brand Config

```ts
type BrandConfig = {
  appName: string
  companyName: string
  logoWhiteUrl: string
  logoBlueUrl: string
  favicon32Url: string
  colors: {
    navy: string
    sky: string
    white: string
    neutral: string
    success: string
    warning: string
    critical: string
  }
}
```

Recommended seed:

```ts
export const brandConfig = {
  appName: "Bridgewater Predictive Maintenance Command Center",
  companyName: "Bridgewater Interiors",
  logoWhiteUrl: "https://bridgewater-interiors.com/wp-content/uploads/2023/03/logo-white.png",
  logoBlueUrl: "https://bridgewater-interiors.com/wp-content/uploads/2023/03/logo-blue.png",
  favicon32Url: "https://bridgewater-interiors.com/wp-content/uploads/2020/06/cropped-BWI_Site-Icon-v1-32x32.png",
  colors: {
    navy: "#12284C",
    sky: "#6FB1C8",
    white: "#FFFFFF",
    neutral: "#F4F6F6",
    success: "#2F8F5B",
    warning: "#D88A1D",
    critical: "#C74634"
  }
}
```

## 2. Plant Model

```ts
type Plant = {
  id: string
  name: string
  label: string
  city: string
  state: string
  address: string
  isHeadquarters: boolean
  vehiclePrograms: string[]
  summary: string
}
```

Recommended seeds:

```ts
export const plants = [
  {
    id: "detroit-hq",
    name: "Detroit Headquarters",
    label: "Headquarters - Detroit, Michigan",
    city: "Detroit",
    state: "MI",
    address: "4617 W Fort St., Detroit, MI 48209-3208",
    isHeadquarters: true,
    vehiclePrograms: ["Ram Classic"],
    summary: "Bridgewater headquarters and southwest Detroit production facility."
  },
  {
    id: "warren-mi",
    name: "Warren Plant",
    label: "Warren, Michigan",
    city: "Warren",
    state: "MI",
    address: "7500 Tank Avenue, Warren, MI 48092-2707",
    isHeadquarters: false,
    vehiclePrograms: ["Ford F-150", "RAM 1500"],
    summary: "High-throughput plant used as the primary hero incident site for the demo."
  },
  {
    id: "eastaboga-al",
    name: "Eastaboga Plant",
    label: "Eastaboga, Alabama",
    city: "Eastaboga",
    state: "AL",
    address: "1 Bridgewater Dr., Eastaboga, AL 36260",
    isHeadquarters: false,
    vehiclePrograms: ["Honda Pilot", "Honda Passport"],
    summary: "Secondary plant used to show cross-site risk comparison."
  },
  {
    id: "lansing-mi",
    name: "Lansing Plant",
    label: "Lansing, Michigan",
    city: "Lansing",
    state: "MI",
    address: "2369 S Canal Rd., Lansing, MI 48917-8589",
    isHeadquarters: false,
    vehiclePrograms: ["Buick Enclave", "Cadillac CT4", "Cadillac CT5", "Chevy Camaro"],
    summary: "Plant used to represent backlog pressure and competing maintenance priorities."
  }
]
```

## 3. Line Model

Use representative line names that sound plausible for the mockup while staying generic enough to avoid pretending we know confidential internal line naming.

```ts
type Line = {
  id: string
  plantId: string
  name: string
  productFamily: "seating" | "overhead" | "center-console"
  status: "healthy" | "watch" | "warning" | "critical"
}
```

Recommended seeds:

```ts
export const lines = [
  { id: "det-seat-line-a", plantId: "detroit-hq", name: "Seat Line A", productFamily: "seating", status: "watch" },
  { id: "war-seat-line-a", plantId: "warren-mi", name: "Seat Line A", productFamily: "seating", status: "critical" },
  { id: "eas-seat-line-a", plantId: "eastaboga-al", name: "Seat Line A", productFamily: "seating", status: "warning" },
  { id: "lan-seat-line-a", plantId: "lansing-mi", name: "Seat Line A", productFamily: "seating", status: "warning" },
  { id: "lan-console-line-b", plantId: "lansing-mi", name: "Console Line B", productFamily: "center-console", status: "watch" }
]
```

## 4. Asset Model

Target `8` seeded assets so the app feels substantial without becoming noisy.

```ts
type Asset = {
  id: string
  plantId: string
  lineId: string
  code: string
  name: string
  assetType: "conveyor" | "robotic-welder" | "hydraulic-press"
  status: "healthy" | "watch" | "warning" | "critical"
  lastMaintenanceAt: string
  playbookCode: string
}
```

Recommended seeds:

```ts
export const assets = [
  {
    id: "asset-det-cv-01",
    plantId: "detroit-hq",
    lineId: "det-seat-line-a",
    code: "CV-DET-01",
    name: "Detroit Main Conveyor",
    assetType: "conveyor",
    status: "watch",
    lastMaintenanceAt: "2026-04-05T08:30:00Z",
    playbookCode: "PB-CONVEYOR-BEARING"
  },
  {
    id: "asset-det-pr-01",
    plantId: "detroit-hq",
    lineId: "det-seat-line-a",
    code: "PR-DET-01",
    name: "Detroit Forming Press",
    assetType: "hydraulic-press",
    status: "healthy",
    lastMaintenanceAt: "2026-04-16T12:00:00Z",
    playbookCode: "PB-PRESS-PRESSURE"
  },
  {
    id: "asset-war-rw-01",
    plantId: "warren-mi",
    lineId: "war-seat-line-a",
    code: "RW-WAR-01",
    name: "Warren Robotic Welder 01",
    assetType: "robotic-welder",
    status: "critical",
    lastMaintenanceAt: "2026-03-29T10:15:00Z",
    playbookCode: "PB-WELDER-THERMAL"
  },
  {
    id: "asset-war-cv-01",
    plantId: "warren-mi",
    lineId: "war-seat-line-a",
    code: "CV-WAR-01",
    name: "Warren Feed Conveyor",
    assetType: "conveyor",
    status: "warning",
    lastMaintenanceAt: "2026-04-10T09:00:00Z",
    playbookCode: "PB-CONVEYOR-BEARING"
  },
  {
    id: "asset-eas-pr-01",
    plantId: "eastaboga-al",
    lineId: "eas-seat-line-a",
    code: "PR-EAS-01",
    name: "Eastaboga Hydraulic Press 01",
    assetType: "hydraulic-press",
    status: "warning",
    lastMaintenanceAt: "2026-04-02T14:45:00Z",
    playbookCode: "PB-PRESS-PRESSURE"
  },
  {
    id: "asset-eas-cv-01",
    plantId: "eastaboga-al",
    lineId: "eas-seat-line-a",
    code: "CV-EAS-01",
    name: "Eastaboga Outfeed Conveyor",
    assetType: "conveyor",
    status: "healthy",
    lastMaintenanceAt: "2026-04-14T07:20:00Z",
    playbookCode: "PB-CONVEYOR-BEARING"
  },
  {
    id: "asset-lan-rw-01",
    plantId: "lansing-mi",
    lineId: "lan-seat-line-a",
    code: "RW-LAN-01",
    name: "Lansing Robotic Welder 01",
    assetType: "robotic-welder",
    status: "warning",
    lastMaintenanceAt: "2026-04-01T11:00:00Z",
    playbookCode: "PB-WELDER-THERMAL"
  },
  {
    id: "asset-lan-cv-01",
    plantId: "lansing-mi",
    lineId: "lan-console-line-b",
    code: "CV-LAN-01",
    name: "Lansing Console Conveyor",
    assetType: "conveyor",
    status: "watch",
    lastMaintenanceAt: "2026-04-17T15:10:00Z",
    playbookCode: "PB-CONVEYOR-BEARING"
  }
]
```

## 5. Sensor Model

Keep sensors minimal and meaningful by asset type.

```ts
type Sensor = {
  id: string
  assetId: string
  key: string
  label: string
  unit: string
}
```

Recommended sensor mapping:

- conveyor:
  - vibration RMS
  - motor temperature
  - motor current
  - belt speed
- robotic welder:
  - tip temperature
  - current draw
  - cycle time
  - vibration
- hydraulic press:
  - hydraulic pressure
  - oil temperature
  - cycle deviation
  - motor current

## 6. Telemetry Model

```ts
type TelemetryPoint = {
  assetId: string
  sensorKey: string
  timestamp: string
  value: number
}
```

Recommended approach:

- pre-seed `24h` and `72h` time windows
- store normal and degraded curves per scenario
- keep points at `15 minute` intervals for charts
- optionally derive a denser view in-memory for smoother chart motion

## 7. Health And Prediction Snapshots

```ts
type HealthSnapshot = {
  assetId: string
  healthScore: number
  anomalyScore: number
  riskBand: "healthy" | "watch" | "warning" | "critical"
  stale: boolean
  updatedAt: string
}

type PredictionSnapshot = {
  assetId: string
  failureRisk24h: number
  failureRisk72h: number
  predictedStoppageWindow: string | null
  topDrivers: string[]
}
```

Recommended seeded examples:

```ts
export const snapshots = {
  "asset-war-rw-01": {
    healthScore: 42,
    anomalyScore: 0.91,
    riskBand: "critical",
    failureRisk24h: 0.78,
    failureRisk72h: 0.94,
    predictedStoppageWindow: "Within 6-10 hours",
    topDrivers: ["rising tip temperature", "unstable current draw", "cycle-time variance"]
  },
  "asset-det-cv-01": {
    healthScore: 71,
    anomalyScore: 0.48,
    riskBand: "watch",
    failureRisk24h: 0.18,
    failureRisk72h: 0.34,
    predictedStoppageWindow: null,
    topDrivers: ["vibration drift", "motor temperature trend"]
  }
}
```

## 8. Alert Model

```ts
type Alert = {
  id: string
  assetId: string
  plantId: string
  lineId: string
  severity: "watch" | "warning" | "critical"
  title: string
  triggerReason: string
  status: "new" | "acknowledged" | "in-review" | "resolved"
  createdAt: string
}
```

Recommended seed set:

```ts
export const alerts = [
  {
    id: "alert-war-rw-01",
    assetId: "asset-war-rw-01",
    plantId: "warren-mi",
    lineId: "war-seat-line-a",
    severity: "critical",
    title: "Robotic welder thermal drift nearing stoppage threshold",
    triggerReason: "Temperature, current, and cycle-time variance moved outside the learned normal range.",
    status: "new",
    createdAt: "2026-04-23T12:00:00Z"
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
    createdAt: "2026-04-23T09:30:00Z"
  },
  {
    id: "alert-lan-rw-01",
    assetId: "asset-lan-rw-01",
    plantId: "lansing-mi",
    lineId: "lan-seat-line-a",
    severity: "warning",
    title: "Backlog pressure increased after delayed maintenance task",
    triggerReason: "Open work combined with warning-level telemetry on a second asset.",
    status: "in-review",
    createdAt: "2026-04-23T08:15:00Z"
  }
]
```

## 9. Work Order Model

```ts
type WorkOrder = {
  id: string
  alertId: string
  assetId: string
  assignedTo: string
  priority: "high" | "urgent"
  status: "new" | "assigned" | "in_progress" | "completed" | "verified"
  title: string
  dueAt: string
  playbookCode: string
}
```

Recommended seeds:

```ts
export const workOrders = [
  {
    id: "wo-war-2001",
    alertId: "alert-war-rw-01",
    assetId: "asset-war-rw-01",
    assignedTo: "user-tech-01",
    priority: "urgent",
    status: "assigned",
    title: "Inspect welder cooling circuit and recalibrate thermal controls",
    dueAt: "2026-04-23T18:00:00Z",
    playbookCode: "PB-WELDER-THERMAL"
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
    playbookCode: "PB-WELDER-THERMAL"
  }
]
```

## 10. Checklist Model

```ts
type WorkOrderChecklistItem = {
  id: string
  workOrderId: string
  label: string
  completed: boolean
}
```

Recommended checklist examples for `PB-WELDER-THERMAL`:

- verify temperature sensor reading
- inspect cooling line flow
- inspect tip wear and contact buildup
- review current-draw variance
- run post-maintenance validation cycle

## 11. User Model

Keep users fictional but role-realistic.

```ts
type User = {
  id: string
  name: string
  role: "executive" | "operations-supervisor" | "maintenance-manager" | "technician"
  defaultPlantId?: string
}
```

Recommended seeds:

```ts
export const users = [
  { id: "user-exec-01", name: "Avery Collins", role: "executive" },
  { id: "user-ops-01", name: "Jordan Hayes", role: "operations-supervisor", defaultPlantId: "warren-mi" },
  { id: "user-mm-01", name: "Samir Patel", role: "maintenance-manager", defaultPlantId: "warren-mi" },
  { id: "user-tech-01", name: "Elena Brooks", role: "technician", defaultPlantId: "warren-mi" },
  { id: "user-tech-02", name: "Marcus Reed", role: "technician", defaultPlantId: "lansing-mi" }
]
```

## 12. Playbook Model

```ts
type Playbook = {
  code: string
  assetType: string
  title: string
  steps: string[]
}
```

Recommended playbooks:

- `PB-CONVEYOR-BEARING`
- `PB-WELDER-THERMAL`
- `PB-PRESS-PRESSURE`

## 13. Scenario Model

```ts
type Scenario = {
  id: string
  name: string
  heroPlantId?: string
  affectedAssetIds: string[]
  executiveSummary: string
}
```

Recommended scenarios:

```ts
export const scenarios = [
  {
    id: "portfolio-baseline-healthy",
    name: "Portfolio Baseline Healthy",
    affectedAssetIds: [],
    executiveSummary: "All four plants are operating within normal risk bounds."
  },
  {
    id: "detroit-conveyor-bearing-wear",
    name: "Detroit Conveyor Bearing Wear",
    heroPlantId: "detroit-hq",
    affectedAssetIds: ["asset-det-cv-01"],
    executiveSummary: "Detroit shows early-stage conveyor degradation without immediate line stoppage risk."
  },
  {
    id: "warren-robotic-welder-thermal-drift",
    name: "Warren Robotic Welder Thermal Drift",
    heroPlantId: "warren-mi",
    affectedAssetIds: ["asset-war-rw-01", "asset-war-cv-01"],
    executiveSummary: "Warren is now the top risk site due to a robotic welder approaching a likely stoppage window."
  },
  {
    id: "eastaboga-hydraulic-pressure-instability",
    name: "Eastaboga Hydraulic Pressure Instability",
    heroPlantId: "eastaboga-al",
    affectedAssetIds: ["asset-eas-pr-01"],
    executiveSummary: "Eastaboga shows a warning-state press issue requiring near-term intervention."
  },
  {
    id: "lansing-backlog-pressure",
    name: "Lansing Backlog Pressure",
    heroPlantId: "lansing-mi",
    affectedAssetIds: ["asset-lan-rw-01", "asset-lan-cv-01"],
    executiveSummary: "Lansing does not yet have a critical failure, but open work and rising warning signals are compressing maintenance capacity."
  }
]
```

## 14. Executive Metric Model

```ts
type ExecutiveMetric = {
  id: string
  label: string
  value: string
  delta?: string
  context?: string
}
```

Recommended executive metrics:

- enterprise health score
- plants at warning or critical
- critical assets open
- predicted downtime exposure
- open work orders
- avoided downtime estimate

## 15. AI Explanation Payload

```ts
type ExplanationPayload = {
  assetId: string
  scenarioId: string
  assetType: string
  plantName: string
  topDrivers: string[]
  healthScore: number
  anomalyScore: number
  failureRisk24h: number
  failureRisk72h: number
  recommendedAction: string
}
```

Recommended deterministic explanation fallback:

```ts
export const fallbackExplanation = {
  "asset-war-rw-01": "The asset is flagged because temperature, current draw, and cycle-time stability all moved outside the expected operating profile. If the pattern continues, the system expects a likely stoppage within the next shift. Recommended action is to inspect the cooling circuit, confirm tip condition, and validate post-maintenance thermal stability."
}
```

## 16. Relationship Summary

Recommended relationship chain:

- one `Plant` has many `Line`
- one `Line` has many `Asset`
- one `Asset` has many `Sensor`
- one `Asset` has many `TelemetryPoint`
- one `Asset` has one current `HealthSnapshot`
- one `Asset` has one current `PredictionSnapshot`
- one `Alert` belongs to one `Asset`
- one `WorkOrder` may be created from one `Alert`
- one `User` may own many `WorkOrder`

## 17. Minimum Viable Seed Set

To build the mockup credibly, the minimum recommended seed bundle is:

- `4` plants
- `5` lines
- `8` assets
- `3` sensor templates by asset type
- `3-5` active alerts
- `2-3` work orders
- `5` scenarios
- `4-5` demo users

## 18. Lock Criteria

The seeded data model is ready for implementation when:

- every major screen has data to render without placeholders
- the Warren hero scenario can flow from executive view to technician completion
- all four Bridgewater plants can appear in portfolio context
- the model stays small enough to manage locally in-app
