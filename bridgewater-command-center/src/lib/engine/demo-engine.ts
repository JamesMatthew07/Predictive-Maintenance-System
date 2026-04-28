import {
  assets,
  brandConfig,
  lines,
  plants,
  playbooks,
  scenarios,
  seededAlerts,
  seededWorkOrders,
  sensorTemplatesByAssetType,
  users,
} from "@/lib/mock-data";
import type {
  Alert,
  AlertStatus,
  Asset,
  AssetSnapshot,
  CompareMode,
  DemoSessionState,
  DemoSnapshot,
  ExecutiveMetric,
  ExplanationPayload,
  PlantSnapshot,
  RiskBand,
  Role,
  ScenarioAssetSeed,
  ScenarioSeed,
  SensorTemplate,
  TelemetryPoint,
  TimeWindow,
  WorkOrder,
  WorkOrderStatus,
  WorkOrderTemplate,
} from "@/lib/types";
import {
  average,
  clamp,
  formatCompactNumber,
  formatCurrency,
  formatPercent,
} from "@/lib/utils";

export const NOW_ISO = "2026-04-23T18:30:00Z";
export const DEFAULT_SCENARIO_ID = "warren-robotic-welder-thermal-drift";
export const DEFAULT_ROLE: Role = "executive";
export const DEFAULT_WINDOW: TimeWindow = "72h";
export const DEFAULT_COMPARE_MODE: CompareMode = "live";

export const roleLabels: Record<Role, string> = {
  executive: "Executive",
  "operations-supervisor": "Operations",
  "maintenance-manager": "Maintenance",
  technician: "Technician",
};

export const riskBandLabels: Record<RiskBand, string> = {
  healthy: "Healthy",
  watch: "Watch",
  warning: "Warning",
  critical: "Critical",
};

const riskBandPriority: Record<RiskBand, number> = {
  healthy: 0,
  watch: 1,
  warning: 2,
  critical: 3,
};

const workOrderProgress: Record<WorkOrderStatus, number> = {
  draft: 0,
  assigned: 0.1,
  in_progress: 0.45,
  completed: 0.75,
  verified: 1,
};

const fallbackDrivers = {
  conveyor: ["bearing vibration", "motor thermal rise"],
  "robotic-welder": ["tip temperature drift", "current instability"],
  "hydraulic-press": ["pressure spread", "cycle deviation"],
} as const;

const fallbackAction = {
  conveyor:
    "Maintain standard conveyor inspection cadence and verify lubrication during the next planned window.",
  "robotic-welder":
    "Hold the welder on standard verification and confirm thermal stability during the next planned stop.",
  "hydraulic-press":
    "Keep the press on normal inspection cadence and confirm pressure repeatability at the next PM window.",
} as const;

const heroOrderIdsByPlant: Record<string, string> = {
  "detroit-hq": "wo-det-1701",
  "warren-mi": "wo-war-2001",
  "eastaboga-al": "wo-eas-1221",
  "lansing-mi": "wo-lan-2048",
};

const healthySeedByAssetType: Record<Asset["assetType"], ScenarioAssetSeed> = {
  conveyor: {
    healthScore: 88,
    anomalyScore: 0.16,
    riskBand: "healthy",
    failureRisk24h: 0.07,
    failureRisk72h: 0.14,
    predictedStoppageWindow: null,
    topDrivers: [...fallbackDrivers.conveyor],
    drift: 0.08,
    recommendedAction: fallbackAction.conveyor,
    lineImpact: "Line protection remains stable through the next shift.",
  },
  "robotic-welder": {
    healthScore: 86,
    anomalyScore: 0.18,
    riskBand: "healthy",
    failureRisk24h: 0.08,
    failureRisk72h: 0.16,
    predictedStoppageWindow: null,
    topDrivers: [...fallbackDrivers["robotic-welder"]],
    drift: 0.09,
    recommendedAction: fallbackAction["robotic-welder"],
    lineImpact: "Nominal cycle timing with no line exposure expected.",
  },
  "hydraulic-press": {
    healthScore: 87,
    anomalyScore: 0.15,
    riskBand: "healthy",
    failureRisk24h: 0.06,
    failureRisk72h: 0.13,
    predictedStoppageWindow: null,
    topDrivers: [...fallbackDrivers["hydraulic-press"]],
    drift: 0.07,
    recommendedAction: fallbackAction["hydraulic-press"],
    lineImpact: "Press repeatability remains inside the expected operating band.",
  },
};
const telemetrySeriesCache = new Map<string, TelemetryPoint[]>();
const MAX_TELEMETRY_CACHE_ENTRIES = 256;
const defaultTelemetryProfiles: Record<
  Asset["assetType"],
  NonNullable<ScenarioAssetSeed["telemetryProfile"]>
> = {
  conveyor: {
    onset: 0.38,
    escalation: 0.79,
    focusStart24h: 0.65,
    volatility: 0.22,
    bursts: [
      { at: 0.76, width: 0.05, magnitude: 0.14 },
      { at: 0.9, width: 0.04, magnitude: 0.18 },
    ],
  },
  "robotic-welder": {
    onset: 0.26,
    escalation: 0.71,
    focusStart24h: 0.62,
    volatility: 0.48,
    bursts: [
      { at: 0.62, width: 0.05, magnitude: 0.2 },
      { at: 0.82, width: 0.04, magnitude: 0.28 },
    ],
  },
  "hydraulic-press": {
    onset: 0.29,
    escalation: 0.69,
    focusStart24h: 0.59,
    volatility: 0.44,
    bursts: [
      { at: 0.58, width: 0.06, magnitude: 0.18 },
      { at: 0.84, width: 0.05, magnitude: 0.24 },
    ],
  },
};

function smoothStep(edge0: number, edge1: number, value: number) {
  if (edge0 === edge1) {
    return value < edge0 ? 0 : 1;
  }

  const normalized = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return normalized * normalized * (3 - 2 * normalized);
}

function getTelemetryProfile(
  asset: Asset,
  seed: ScenarioAssetSeed,
): NonNullable<ScenarioAssetSeed["telemetryProfile"]> {
  const baseProfile = defaultTelemetryProfiles[asset.assetType];

  return {
    ...baseProfile,
    ...seed.telemetryProfile,
    bursts: seed.telemetryProfile?.bursts ?? baseProfile.bursts,
  };
}

function getScenarioById(id: string) {
  return scenarios.find((scenario) => scenario.id === id) ?? scenarios[0];
}

function getPlaybook(code: string) {
  return playbooks.find((playbook) => playbook.code === code) ?? playbooks[0];
}

export function getUserById(id?: string) {
  return users.find((user) => user.id === id);
}

export function getRoleUser(role: Role) {
  return users.find((user) => user.role === role);
}

function createChecklist(template: WorkOrderTemplate): WorkOrder["checklist"] {
  return getPlaybook(template.playbookCode).steps.map((step, index) => ({
    id: `${template.id}-check-${index + 1}`,
    workOrderId: template.id,
    label: step,
    completed: false,
  }));
}

function instantiateWorkOrder(template: WorkOrderTemplate): WorkOrder {
  return {
    ...template,
    checklist: createChecklist(template),
  };
}

function getHeroWorkOrderId(scenario: ScenarioSeed) {
  return heroOrderIdsByPlant[scenario.heroPlantId ?? ""] ?? `wo-net-${scenario.id}`;
}

function getHeroWorkOrderTemplate(
  scenario: ScenarioSeed,
  assigneeId?: string,
): WorkOrderTemplate | null {
  if (!scenario.heroAssetId) {
    return null;
  }

  const asset = assets.find((entry) => entry.id === scenario.heroAssetId);

  if (!asset) {
    return null;
  }

  const playbook = getPlaybook(asset.playbookCode);
  const title =
    scenario.assetStates[asset.id]?.recommendedAction.split(",")[0] ?? playbook.title;

  return {
    id: getHeroWorkOrderId(scenario),
    alertId: getAlertIdForAsset(asset.id),
    assetId: asset.id,
    assignedTo: assigneeId,
    priority:
      scenario.assetStates[asset.id]?.riskBand === "critical" ? "urgent" : "high",
    status: assigneeId ? "assigned" : "draft",
    title,
    dueAt: "2026-04-23T20:00:00Z",
    playbookCode: asset.playbookCode,
    notes:
      "Generated from the active scenario. Use this work order to walk the audience from triage to completion.",
  };
}

export function createInitialSessionState(): DemoSessionState {
  const scenario = getScenarioById(DEFAULT_SCENARIO_ID);
  const workOrders = Object.fromEntries(
    seededWorkOrders.map((template) => {
      const order = instantiateWorkOrder(template);
      return [order.id, order];
    }),
  );

  return {
    scenarioId: scenario.id,
    role: DEFAULT_ROLE,
    selectedPlantId: scenario.heroPlantId ?? plants[0].id,
    selectedLineId: scenario.heroLineId,
    window: DEFAULT_WINDOW,
    compareMode: DEFAULT_COMPARE_MODE,
    workOrders,
    alertStatuses: {},
  };
}

function getFallbackSeed(asset: Asset): ScenarioAssetSeed {
  return healthySeedByAssetType[asset.assetType];
}

function interpolateSeed(seed: ScenarioAssetSeed, progress: number): ScenarioAssetSeed {
  if (progress <= 0 || seed.recoveryHealthScore === undefined) {
    return seed;
  }

  const lerp = (from: number, to: number) => from + (to - from) * progress;

  return {
    ...seed,
    healthScore: Math.round(lerp(seed.healthScore, seed.recoveryHealthScore)),
    anomalyScore: Number(
      lerp(seed.anomalyScore, seed.recoveryAnomalyScore ?? seed.anomalyScore).toFixed(2),
    ),
    riskBand:
      progress >= 1
        ? seed.recoveryRiskBand ?? seed.riskBand
        : progress >= 0.65 && seed.recoveryRiskBand
          ? seed.recoveryRiskBand
          : seed.riskBand,
    failureRisk24h: Number(
      lerp(seed.failureRisk24h, seed.recoveryFailureRisk24h ?? seed.failureRisk24h).toFixed(2),
    ),
    failureRisk72h: Number(
      lerp(seed.failureRisk72h, seed.recoveryFailureRisk72h ?? seed.failureRisk72h).toFixed(2),
    ),
    predictedStoppageWindow:
      progress >= 1 ? seed.recoveryWindow ?? null : seed.predictedStoppageWindow,
    drift: Number((seed.drift * (1 - progress * 0.72)).toFixed(2)),
  };
}

function getAssetScenarioSeed(
  asset: Asset,
  scenario: ScenarioSeed,
  workOrders: Record<string, WorkOrder>,
): ScenarioAssetSeed {
  const baseSeed = scenario.assetStates[asset.id] ?? getFallbackSeed(asset);
  const relatedOrder = Object.values(workOrders).find((workOrder) => workOrder.assetId === asset.id);

  if (!relatedOrder) {
    return baseSeed;
  }

  return interpolateSeed(baseSeed, workOrderProgress[relatedOrder.status]);
}

function formatSeriesLabel(date: Date, hours: number) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: hours === 24 ? "2-digit" : undefined,
    month: hours === 72 ? "short" : undefined,
    day: hours === 72 ? "numeric" : undefined,
    hour12: true,
    timeZone: "America/New_York",
  })
    .format(date)
    .replace(":00", "");
}

function buildTelemetrySeries(
  asset: Asset,
  sensors: SensorTemplate[],
  seed: ScenarioAssetSeed,
  window: TimeWindow,
  baseline = false,
): TelemetryPoint[] {
  const telemetryProfile = getTelemetryProfile(asset, seed);
  const cacheKey = [
    asset.id,
    window,
    baseline ? "baseline" : "live",
    seed.healthScore,
    seed.anomalyScore,
    seed.failureRisk24h,
    seed.failureRisk72h,
    seed.riskBand,
    seed.drift,
    telemetryProfile.onset,
    telemetryProfile.escalation,
    telemetryProfile.focusStart24h ?? "default",
    telemetryProfile.volatility,
    JSON.stringify(telemetryProfile.bursts ?? []),
  ].join("|");
  const cachedSeries = telemetrySeriesCache.get(cacheKey);

  if (cachedSeries) {
    return cachedSeries;
  }

  const hours = window === "24h" ? 24 : 72;
  const now = new Date(NOW_ISO).getTime();
  const points = hours * 4 + 1;
  const series = sensors.flatMap((sensor) => {
    return Array.from({ length: points }, (_, index) => {
      const progress = points === 1 ? 1 : index / (points - 1);
      const timestamp = new Date(now - (points - 1 - index) * 15 * 60 * 1000);
      const seedValue = asset.id.length * 7 + sensor.key.length * 13;
      const focusStart =
        window === "24h"
          ? clamp(
              telemetryProfile.focusStart24h ??
                Math.max(telemetryProfile.escalation - 0.12, 0.56),
              0.42,
              0.92,
            )
          : 0;
      const storyProgress =
        window === "24h" ? focusStart + progress * (1 - focusStart) : progress;
      const volatilityScale = baseline
        ? 0.64
        : 1 + telemetryProfile.volatility * (window === "24h" ? 0.94 : 0.38);
      const slowWave =
        Math.sin(index * (window === "24h" ? 0.31 : 0.16) + seedValue) *
        sensor.healthyVariance *
        volatilityScale;
      const fastWave =
        Math.cos(index * (window === "24h" ? 0.67 : 0.39) + seedValue * 0.37) *
        sensor.healthyVariance *
        0.45 *
        volatilityScale;
      const intensity = baseline ? 0.08 : seed.drift;
      const driftRamp = baseline
        ? 0.18 + progress * 0.12
        : smoothStep(
            Math.max(telemetryProfile.onset - 0.08, 0),
            telemetryProfile.onset + 0.08,
            storyProgress,
          );
      const escalationRamp = baseline
        ? 0.08
        : smoothStep(
            telemetryProfile.escalation - 0.08,
            telemetryProfile.escalation + 0.05,
            storyProgress,
          );
      const burstLift = baseline
        ? 0
        : (telemetryProfile.bursts ?? []).reduce((total, burst) => {
            const width = Math.max(burst.width, 0.01);
            const distance = storyProgress - burst.at;

            return (
              total +
              burst.magnitude *
                Math.exp(-(distance * distance) / (2 * width * width))
            );
          }, 0);
      const driftProgress = baseline
        ? 0.12 + progress * 0.08
        : 0.16 + driftRamp * 0.44 + escalationRamp * 0.56 + burstLift * 0.34;
      const scenarioBias = baseline
        ? 0
        : sensor.direction === "up"
          ? driftRamp * sensor.warningDelta * 0.42 +
            escalationRamp * sensor.criticalDelta * 0.64 +
            burstLift * sensor.criticalDelta * 0.24
          : sensor.direction === "down"
            ? -(driftRamp * sensor.warningDelta * 0.18) -
              (escalationRamp * sensor.criticalDelta * 0.22) -
              (burstLift * sensor.criticalDelta * 0.1)
            : Math.sin(index * 0.81 + seedValue * 0.11) *
              (driftRamp * sensor.warningDelta * 0.34 +
                escalationRamp * sensor.criticalDelta * 0.46 +
                burstLift * sensor.criticalDelta * 0.2);
      const directionalDelta =
        sensor.direction === "up"
          ? intensity * driftProgress * sensor.criticalDelta * 0.82 + scenarioBias
          : sensor.direction === "down"
            ? -intensity * driftProgress * sensor.criticalDelta * 0.45 + scenarioBias
            : scenarioBias;
      const value = Number(
        (sensor.baseValue + slowWave + fastWave + directionalDelta).toFixed(
          sensor.baseValue < 5 ? 2 : 1,
        ),
      );

      return {
        timestamp: timestamp.toISOString(),
        label: formatSeriesLabel(timestamp, hours),
        sensorKey: sensor.key,
        value,
        baseline: sensor.baseValue,
      };
    });
  });

  if (telemetrySeriesCache.size >= MAX_TELEMETRY_CACHE_ENTRIES) {
    const oldestKey = telemetrySeriesCache.keys().next().value;

    if (oldestKey) {
      telemetrySeriesCache.delete(oldestKey);
    }
  }

  telemetrySeriesCache.set(cacheKey, series);

  return series;
}

function compareRiskBand(left: RiskBand, right: RiskBand) {
  return riskBandPriority[right] - riskBandPriority[left];
}

function getAlertIdForAsset(assetId: string) {
  const seeded = seededAlerts.find((alert) => alert.assetId === assetId);
  return seeded?.id ?? `alert-${assetId.replace("asset-", "")}`;
}

function buildAlerts(
  scenario: ScenarioSeed,
  workOrders: Record<string, WorkOrder>,
  alertStatuses: Record<string, AlertStatus>,
): Alert[] {
  return Object.entries(scenario.assetStates)
    .filter(([, seed]) => seed.alertTitle)
    .map(([assetId, seed]) => {
      const asset = assets.find((entry) => entry.id === assetId)!;
      const seededAlert = seededAlerts.find((entry) => entry.assetId === assetId);
      const relatedOrder = Object.values(workOrders).find((workOrder) => workOrder.assetId === assetId);
      const status =
        relatedOrder?.status === "verified"
          ? "resolved"
          : alertStatuses[getAlertIdForAsset(assetId)] ?? seed.alertStatus ?? seededAlert?.status ?? "new";

      return {
        id: getAlertIdForAsset(assetId),
        assetId,
        plantId: asset.plantId,
        lineId: asset.lineId,
        severity: seed.riskBand,
        title: seed.alertTitle!,
        triggerReason: seed.alertReason ?? seededAlert?.triggerReason ?? seed.recommendedAction,
        status,
        createdAt: seededAlert?.createdAt ?? NOW_ISO,
        ownerId: seededAlert?.ownerId,
      } satisfies Alert;
    })
    .sort((left, right) => {
      const severityDelta = compareRiskBand(left.severity, right.severity);
      if (severityDelta !== 0) {
        return severityDelta;
      }

      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    });
}

function buildWorkOrders(workOrders: Record<string, WorkOrder>) {
  return Object.values(workOrders).sort(
    (left, right) => new Date(left.dueAt).getTime() - new Date(right.dueAt).getTime(),
  );
}

type RiskWindowSubject = Pick<AssetSnapshot, "failureRisk24h" | "failureRisk72h">;

export function getWindowRisk(window: TimeWindow, subject: RiskWindowSubject) {
  return window === "24h" ? subject.failureRisk24h : subject.failureRisk72h;
}

export function getAlternateWindow(window: TimeWindow): TimeWindow {
  return window === "24h" ? "72h" : "24h";
}

export function getWindowRiskLabel(window: TimeWindow) {
  return window;
}

function getWindowScale(window: TimeWindow) {
  return window === "24h" ? 0.58 : 1;
}

function severityHours(asset: AssetSnapshot, window: TimeWindow) {
  const factor =
    asset.riskBand === "critical"
      ? 4.6
      : asset.riskBand === "warning"
        ? 2.7
        : asset.riskBand === "watch"
          ? 1.4
          : 0.5;

  return Number((getWindowRisk(window, asset) * factor).toFixed(1));
}

function createExecutiveMetrics(
  snapshot: Omit<DemoSnapshot, "executiveMetrics">,
): ExecutiveMetric[] {
  const plantsAtRisk = snapshot.plants.filter((plant) => plant.riskBand !== "healthy").length;
  const exposure = snapshot.resolvedStory
    ? Math.max(snapshot.projectedDowntimeHours - snapshot.avoidedDowntimeHours, 1.4)
    : snapshot.projectedDowntimeHours;

  return [
    {
      id: "portfolio-health",
      label: "Portfolio Health",
      value: `${Math.round(snapshot.portfolioHealth)}`,
      delta: snapshot.resolvedStory ? "+11 after intervention" : "-9 vs baseline",
      detail: "Blended health score across the active Bridgewater portfolio.",
    },
    {
      id: "plants-at-risk",
      label: "Plants At Risk",
      value: `${plantsAtRisk} / 4`,
      delta: snapshot.resolvedStory ? "1 plant stabilized" : `${snapshot.openCriticalIssues.length} critical issue open`,
      detail: "Facilities currently running with watch, warning, or critical exposure.",
    },
    {
      id: "downtime-exposure",
      label: "Projected Downtime",
      value: `${exposure.toFixed(1)} hrs`,
      delta: snapshot.resolvedStory
        ? `${snapshot.avoidedDowntimeHours.toFixed(1)} hrs protected`
        : `${(snapshot.scenario.businessImpact.avoidedDowntimeHours * getWindowScale(snapshot.window)).toFixed(1)} hrs recoverable`,
      detail: `Estimated line-impact exposure inside the active ${snapshot.window} planning horizon.`,
    },
    {
      id: "protected-value",
      label: snapshot.resolvedStory ? "Protected Value" : "Value At Risk",
      value: formatCurrency(snapshot.protectedValue),
      delta: snapshot.resolvedStory
        ? `${formatCurrency(snapshot.overtimeAvoidanceValue)} overtime avoided`
        : `${formatCurrency(snapshot.overtimeAvoidanceValue)} overtime at stake`,
      detail: `Incident-scale value story built for the client-facing demo narrative in the active ${snapshot.window} horizon.`,
    },
  ];
}

function buildExplanation(asset: AssetSnapshot, scenarioId: string): ExplanationPayload {
  const isRecovered = asset.activeWorkOrder?.status === "verified";
  const impact = isRecovered
    ? `${asset.plant.name} is back inside a manageable buffer after verification. The system is still watching ${asset.topDrivers[0]}, but the immediate stoppage window has cleared.`
    : `${asset.lineImpact} ${asset.plant.name} is the operating context for this signal, so the maintenance action is framed against real plant throughput impact.`;

  return {
    assetId: asset.id,
    scenarioId,
    assetType: asset.assetType,
    plantName: asset.plant.name,
    topDrivers: asset.topDrivers,
    healthScore: asset.healthScore,
    anomalyScore: asset.anomalyScore,
    failureRisk24h: asset.failureRisk24h,
    failureRisk72h: asset.failureRisk72h,
    recommendedAction: asset.recommendedAction,
    summary: isRecovered
      ? `The prior anomaly pattern on ${asset.code} has fallen back inside a controllable range after maintenance verification.`
      : `${asset.code} is flagged because ${asset.topDrivers.join(", ")} moved outside the learned operating profile for this asset.`,
    impact,
    confidenceNote: isRecovered
      ? `Grounded in the verified Bridgewater demo work-order state for ${asset.plant.name}.`
      : `Grounded in the active ${scenarioId} scenario state and the current Bridgewater telemetry pattern for ${asset.code}.`,
  };
}

export function buildDemoSnapshot(sessionState: DemoSessionState): DemoSnapshot {
  const scenario = getScenarioById(sessionState.scenarioId);
  const window = sessionState.window;
  const currentAlerts = buildAlerts(scenario, sessionState.workOrders, sessionState.alertStatuses);
  const currentWorkOrders = buildWorkOrders(sessionState.workOrders);

  const assetSnapshots: AssetSnapshot[] = assets.map((asset) => {
    const plant = plants.find((entry) => entry.id === asset.plantId)!;
    const line = lines.find((entry) => entry.id === asset.lineId)!;
    const seed = getAssetScenarioSeed(asset, scenario, sessionState.workOrders);
    const sensors = sensorTemplatesByAssetType[asset.assetType];
    const activeAlert = currentAlerts.find((alert) => alert.assetId === asset.id);
    const activeWorkOrder = currentWorkOrders.find((order) => order.assetId === asset.id);

    return {
      ...asset,
      plant,
      line,
      healthScore: seed.healthScore,
      anomalyScore: seed.anomalyScore,
      riskBand: seed.riskBand,
      failureRisk24h: seed.failureRisk24h,
      failureRisk72h: seed.failureRisk72h,
      predictedStoppageWindow: seed.predictedStoppageWindow,
      topDrivers: seed.topDrivers,
      recommendedAction: seed.recommendedAction,
      lineImpact: seed.lineImpact,
      telemetry: buildTelemetrySeries(asset, sensors, seed, sessionState.window),
      baselineTelemetry: buildTelemetrySeries(
        asset,
        sensors,
        healthySeedByAssetType[asset.assetType],
        sessionState.window,
        true,
      ),
      sensors,
      activeAlert,
      activeWorkOrder,
    };
  });

  const plantSnapshots: PlantSnapshot[] = plants.map((plant) => {
    const plantLines = lines.filter((line) => line.plantId === plant.id);
    const plantAssets = assetSnapshots.filter((asset) => asset.plantId === plant.id);
    const riskBand = plantAssets.reduce<RiskBand>((highest, asset) => {
      return compareRiskBand(highest, asset.riskBand) < 0 ? highest : asset.riskBand;
    }, "healthy");
    const openCriticalIssues = plantAssets.filter(
      (asset) => asset.activeAlert?.severity === "critical" && asset.activeAlert.status !== "resolved",
    ).length;
    const downtimeExposureHours = Number(
      plantAssets.reduce((total, asset) => total + severityHours(asset, window), 0).toFixed(1),
    );
    const baseBacklog =
      {
        "detroit-hq": 6.5,
        "warren-mi": 9.2,
        "eastaboga-al": 8.1,
        "lansing-mi": 10.8,
      }[plant.id] ?? 6.5;
    const maintenanceBacklogHours = Number(
      (
        baseBacklog +
        plantAssets.reduce(
          (total, asset) => total + getWindowRisk(window, asset) * (window === "24h" ? 1.6 : 2.4),
          0,
        )
      ).toFixed(1),
    );
    const projectedWindow =
      [...plantAssets]
        .sort((left, right) => getWindowRisk(window, right) - getWindowRisk(window, left))
        .find((asset) => asset.predictedStoppageWindow)?.predictedStoppageWindow ??
      `Stable within ${window === "24h" ? "24" : "72"} hours`;

    return {
      ...plant,
      lines: plantLines,
      assets: plantAssets,
      riskBand,
      healthScore: Math.round(average(plantAssets.map((asset) => asset.healthScore))),
      openCriticalIssues,
      downtimeExposureHours,
      maintenanceBacklogHours,
      projectedWindow,
    };
  });

  const selectedPlant =
    plantSnapshots.find((plant) => plant.id === sessionState.selectedPlantId) ??
    plantSnapshots.find((plant) => plant.id === scenario.heroPlantId) ??
    plantSnapshots[0];
  const heroAsset = scenario.heroAssetId
    ? assetSnapshots.find((asset) => asset.id === scenario.heroAssetId) ?? null
    : null;
  const explanationByAsset = Object.fromEntries(
    assetSnapshots.map((asset) => [asset.id, buildExplanation(asset, scenario.id)]),
  );
  const topRiskAssets = [...assetSnapshots]
    .sort((left, right) => {
      const severityDelta = compareRiskBand(left.riskBand, right.riskBand);
      if (severityDelta !== 0) {
        return severityDelta;
      }
      return getWindowRisk(window, right) - getWindowRisk(window, left);
    })
    .slice(0, 5);
  const openCriticalIssues = currentAlerts.filter(
    (alert) => alert.severity === "critical" && alert.status !== "resolved",
  );
  const resolvedStory = heroAsset?.activeWorkOrder?.status === "verified";
  const windowScale = getWindowScale(window);
  const projectedDowntimeHours = Number(
    plantSnapshots.reduce((total, plant) => total + plant.downtimeExposureHours, 0).toFixed(1),
  );
  const protectedValue = Math.round(scenario.businessImpact.protectedRevenue * windowScale);
  const overtimeAvoidanceValue = Math.round(
    scenario.businessImpact.overtimeAvoidance * windowScale,
  );
  const avoidedDowntimeBase = scenario.businessImpact.avoidedDowntimeHours * windowScale;
  const avoidedDowntimeHours = resolvedStory
    ? Number(avoidedDowntimeBase.toFixed(1))
    : Number(Math.max(0, avoidedDowntimeBase * 0.18).toFixed(1));
  const portfolioHealth = average(plantSnapshots.map((plant) => plant.healthScore));

  const baseSnapshot = {
    brand: brandConfig,
    scenario,
    window,
    selectedPlant,
    plants: plantSnapshots,
    assets: assetSnapshots,
    alerts: currentAlerts,
    workOrders: currentWorkOrders,
    explanationByAsset,
    heroAsset,
    topRiskAssets,
    openCriticalIssues,
    projectedDowntimeHours,
    backlogHours: Number(plantSnapshots.reduce((total, plant) => total + plant.maintenanceBacklogHours, 0).toFixed(1)),
    protectedValue,
    overtimeAvoidanceValue,
    avoidedDowntimeHours,
    portfolioHealth,
    resolvedStory,
  };

  return {
    ...baseSnapshot,
    executiveMetrics: createExecutiveMetrics(baseSnapshot),
  };
}

export function formatRiskBandClass(riskBand: RiskBand) {
  return {
    healthy: "var(--success)",
    watch: "var(--warning-soft)",
    warning: "var(--warning)",
    critical: "var(--critical)",
  }[riskBand];
}

export function getScenarioOptions() {
  return scenarios;
}

export function getPlantOptions() {
  return plants;
}

export function getLineOptions(plantId?: string) {
  return lines.filter((line) => !plantId || line.plantId === plantId);
}

export function getAssetById(assetId: string) {
  return assets.find((asset) => asset.id === assetId);
}

export function getAlertById(alertId: string, snapshot: DemoSnapshot) {
  return snapshot.alerts.find((alert) => alert.id === alertId);
}

export function getWorkOrderById(workOrderId: string, snapshot: DemoSnapshot) {
  return snapshot.workOrders.find((workOrder) => workOrder.id === workOrderId);
}

export function createHeroWorkOrderForScenario(
  sessionState: DemoSessionState,
  scenarioId: string,
  assigneeId?: string,
): DemoSessionState {
  const scenario = getScenarioById(scenarioId);
  const template = getHeroWorkOrderTemplate(scenario, assigneeId);

  if (!template || sessionState.workOrders[template.id]) {
    return sessionState;
  }

  const nextOrder = instantiateWorkOrder(template);
  const heroAlertId = getAlertIdForAsset(template.assetId);

  return {
    ...sessionState,
    selectedPlantId: scenario.heroPlantId ?? sessionState.selectedPlantId,
    selectedLineId: scenario.heroLineId ?? sessionState.selectedLineId,
    workOrders: {
      ...sessionState.workOrders,
      [nextOrder.id]: nextOrder,
    },
    alertStatuses: {
      ...sessionState.alertStatuses,
      [heroAlertId]: "in-review",
    },
  };
}

export function updateWorkOrderStatus(
  sessionState: DemoSessionState,
  workOrderId: string,
  status: WorkOrderStatus,
): DemoSessionState {
  const currentOrder = sessionState.workOrders[workOrderId];

  if (!currentOrder) {
    return sessionState;
  }

  const nextAlertStatus: AlertStatus | undefined =
    status === "verified" ? "resolved" : status === "draft" ? "new" : "in-review";

  return {
    ...sessionState,
    workOrders: {
      ...sessionState.workOrders,
      [workOrderId]: {
        ...currentOrder,
        status,
      },
    },
    alertStatuses: nextAlertStatus
      ? {
          ...sessionState.alertStatuses,
          [currentOrder.alertId]: nextAlertStatus,
        }
      : sessionState.alertStatuses,
  };
}

export function toggleChecklistItem(
  sessionState: DemoSessionState,
  workOrderId: string,
  itemId: string,
): DemoSessionState {
  const currentOrder = sessionState.workOrders[workOrderId];

  if (!currentOrder) {
    return sessionState;
  }

  return {
    ...sessionState,
    workOrders: {
      ...sessionState.workOrders,
      [workOrderId]: {
        ...currentOrder,
        checklist: currentOrder.checklist.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item,
        ),
      },
    },
  };
}

export function updateWorkOrderNotes(
  sessionState: DemoSessionState,
  workOrderId: string,
  notes: string,
): DemoSessionState {
  const currentOrder = sessionState.workOrders[workOrderId];

  if (!currentOrder) {
    return sessionState;
  }

  return {
    ...sessionState,
    workOrders: {
      ...sessionState.workOrders,
      [workOrderId]: {
        ...currentOrder,
        notes,
      },
    },
  };
}

export function assignWorkOrder(
  sessionState: DemoSessionState,
  workOrderId: string,
  assigneeId: string,
): DemoSessionState {
  const currentOrder = sessionState.workOrders[workOrderId];

  if (!currentOrder) {
    return sessionState;
  }

  return {
    ...sessionState,
    workOrders: {
      ...sessionState.workOrders,
      [workOrderId]: {
        ...currentOrder,
        assignedTo: assigneeId,
        status: currentOrder.status === "draft" ? "assigned" : currentOrder.status,
      },
    },
  };
}

export function setAlertStatus(
  sessionState: DemoSessionState,
  alertId: string,
  status: AlertStatus,
): DemoSessionState {
  return {
    ...sessionState,
    alertStatuses: {
      ...sessionState.alertStatuses,
      [alertId]: status,
    },
  };
}

export function getKpiLabel(metric: ExecutiveMetric) {
  return `${metric.label}: ${metric.value} (${metric.delta})`;
}

export function getExecutiveSummaryLine(snapshot: DemoSnapshot) {
  const topPlant = [...snapshot.plants].sort(
    (left, right) => right.downtimeExposureHours - left.downtimeExposureHours,
  )[0];

  return `${topPlant.name} leads the portfolio in projected exposure at ${topPlant.downtimeExposureHours.toFixed(1)} line-hours, while ${snapshot.heroAsset?.code ?? "the lead asset"} anchors the current demo story.`;
}

export function getTopPlantNarrative(snapshot: DemoSnapshot) {
  return snapshot.plants
    .map((plant) => ({
      id: plant.id,
      label: plant.name,
      status: riskBandLabels[plant.riskBand],
      headline: `${Math.round(plant.healthScore)} health`,
      detail: `${plant.openCriticalIssues} critical | ${plant.downtimeExposureHours.toFixed(1)}h exposure`,
    }))
    .sort((left, right) => {
      const leftPlant = snapshot.plants.find((plant) => plant.id === left.id)!;
      const rightPlant = snapshot.plants.find((plant) => plant.id === right.id)!;
      return compareRiskBand(leftPlant.riskBand, rightPlant.riskBand);
    });
}

export function getImpactSummary(snapshot: DemoSnapshot) {
  return {
    protectedValueLabel: formatCurrency(snapshot.protectedValue),
    avoidedDowntimeLabel: `${snapshot.avoidedDowntimeHours.toFixed(1)} hrs`,
    backlogLabel: `${snapshot.backlogHours.toFixed(1)} hrs`,
    portfolioHealthLabel: formatCompactNumber(snapshot.portfolioHealth),
    scenarioRiskLabel: formatPercent(
      snapshot.heroAsset ? getWindowRisk(snapshot.window, snapshot.heroAsset) : 0,
    ),
  };
}
