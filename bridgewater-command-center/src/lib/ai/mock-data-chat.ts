import {
  getAlternateWindow,
  getWindowRisk,
  getWindowRiskLabel,
  riskBandLabels,
} from "@/lib/engine/demo-engine";
import type { AssetSnapshot, DemoSnapshot, PlantSnapshot } from "@/lib/types";
import { formatCurrency, formatPercent, titleCase } from "@/lib/utils";

const domainTerms = [
  "asset",
  "assets",
  "alert",
  "alerts",
  "backlog",
  "bridgewater",
  "critical",
  "detroit",
  "downtime",
  "eastaboga",
  "executive",
  "exposure",
  "health",
  "kpi",
  "lansing",
  "line",
  "maintenance",
  "operations",
  "plant",
  "plants",
  "portfolio",
  "risk",
  "scenario",
  "technician",
  "telemetry",
  "warren",
  "work order",
  "work-order",
  "workorder",
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function formatPlantLine(plant: PlantSnapshot) {
  return `${plant.name}: ${riskBandLabels[plant.riskBand]} risk, ${plant.healthScore} health, ${plant.downtimeExposureHours.toFixed(1)}h exposure, ${plant.openCriticalIssues} open critical issue(s), ${plant.maintenanceBacklogHours.toFixed(1)}h backlog.`;
}

function formatAssetLine(asset: AssetSnapshot, window: DemoSnapshot["window"]) {
  return `${asset.code} (${asset.name}, ${asset.plant.name} / ${asset.line.name}): ${riskBandLabels[asset.riskBand]} risk, ${asset.healthScore} health, ${formatPercent(getWindowRisk(window, asset))} ${getWindowRiskLabel(window)} risk.`;
}

export type MockDataChatContext = ReturnType<typeof buildMockDataChatContext>;

export function hasMockDataQuestionScope(question: string, snapshot: DemoSnapshot) {
  const normalized = normalize(question);
  const dataTerms = [
    ...snapshot.plants.flatMap((plant) => [plant.id, plant.name, plant.city, plant.state, ...plant.vehiclePrograms]),
    ...snapshot.assets.flatMap((asset) => [asset.id, asset.code, asset.name, asset.assetType, asset.line.name, asset.zoneLabel]),
    ...snapshot.alerts.flatMap((alert) => [alert.id, alert.title, alert.status, alert.severity]),
    ...snapshot.workOrders.flatMap((order) => [order.id, order.title, order.status, order.playbookCode]),
    snapshot.scenario.id,
    snapshot.scenario.name,
  ];

  return [...domainTerms, ...dataTerms].some((term) => normalized.includes(normalize(term)));
}

export function buildMockDataChatContext(snapshot: DemoSnapshot) {
  return {
    company: "Bridgewater Interiors",
    activeWindow: snapshot.window,
    selectedPlant: snapshot.selectedPlant.name,
    scenario: {
      id: snapshot.scenario.id,
      name: snapshot.scenario.name,
      executiveSummary: snapshot.scenario.executiveSummary,
      operationsNarrative: snapshot.scenario.operationsNarrative,
      maintenanceNarrative: snapshot.scenario.maintenanceNarrative,
      executiveActions: snapshot.scenario.executiveActions,
      presenterNotes: snapshot.scenario.presenterNotes,
    },
    portfolio: {
      health: Math.round(snapshot.portfolioHealth),
      projectedDowntimeHours: snapshot.projectedDowntimeHours,
      backlogHours: snapshot.backlogHours,
      protectedValue: snapshot.protectedValue,
      overtimeAvoidanceValue: snapshot.overtimeAvoidanceValue,
      avoidedDowntimeHours: snapshot.avoidedDowntimeHours,
      resolvedStory: snapshot.resolvedStory,
    },
    plants: snapshot.plants.map((plant) => ({
      id: plant.id,
      name: plant.name,
      label: plant.label,
      city: plant.city,
      state: plant.state,
      address: plant.address,
      vehiclePrograms: plant.vehiclePrograms,
      operationalFocus: plant.operationalFocus,
      riskBand: plant.riskBand,
      healthScore: plant.healthScore,
      openCriticalIssues: plant.openCriticalIssues,
      downtimeExposureHours: plant.downtimeExposureHours,
      maintenanceBacklogHours: plant.maintenanceBacklogHours,
      projectedWindow: plant.projectedWindow,
    })),
    assets: snapshot.assets.map((asset) => ({
      id: asset.id,
      code: asset.code,
      name: asset.name,
      assetType: asset.assetType,
      plant: asset.plant.name,
      line: asset.line.name,
      zoneLabel: asset.zoneLabel,
      healthScore: asset.healthScore,
      anomalyScore: asset.anomalyScore,
      riskBand: asset.riskBand,
      failureRisk24h: asset.failureRisk24h,
      failureRisk72h: asset.failureRisk72h,
      predictedStoppageWindow: asset.predictedStoppageWindow,
      topDrivers: asset.topDrivers,
      recommendedAction: asset.recommendedAction,
      lineImpact: asset.lineImpact,
      activeAlert: asset.activeAlert
        ? {
            title: asset.activeAlert.title,
            status: asset.activeAlert.status,
            severity: asset.activeAlert.severity,
            triggerReason: asset.activeAlert.triggerReason,
          }
        : null,
      activeWorkOrder: asset.activeWorkOrder
        ? {
            id: asset.activeWorkOrder.id,
            status: asset.activeWorkOrder.status,
            priority: asset.activeWorkOrder.priority,
            title: asset.activeWorkOrder.title,
            dueAt: asset.activeWorkOrder.dueAt,
          }
        : null,
    })),
    alerts: snapshot.alerts.map((alert) => ({
      id: alert.id,
      assetId: alert.assetId,
      title: alert.title,
      severity: alert.severity,
      status: alert.status,
      triggerReason: alert.triggerReason,
      createdAt: alert.createdAt,
    })),
    workOrders: snapshot.workOrders.map((order) => ({
      id: order.id,
      assetId: order.assetId,
      priority: order.priority,
      status: order.status,
      title: order.title,
      dueAt: order.dueAt,
      playbookCode: order.playbookCode,
      notes: order.notes,
      checklist: order.checklist.map((item) => ({
        label: item.label,
        completed: item.completed,
      })),
    })),
    executiveMetrics: snapshot.executiveMetrics,
    topRiskAssets: snapshot.topRiskAssets.map((asset) => asset.code),
    openCriticalIssues: snapshot.openCriticalIssues.map((alert) => alert.id),
  };
}

function findPlant(question: string, snapshot: DemoSnapshot) {
  const normalized = normalize(question);

  return snapshot.plants.find((plant) =>
    [plant.id, plant.name, plant.city, plant.state, plant.label].some((term) =>
      normalized.includes(normalize(term)),
    ),
  );
}

function findAsset(question: string, snapshot: DemoSnapshot) {
  const normalized = normalize(question);

  return snapshot.assets.find((asset) =>
    [asset.id, asset.code, asset.name, asset.assetType, asset.zoneLabel].some((term) =>
      normalized.includes(normalize(term)),
    ),
  );
}

function includesAny(question: string, terms: string[]) {
  const normalized = normalize(question);

  return terms.some((term) => normalized.includes(term));
}

export function answerMockDataQuestion(question: string, snapshot: DemoSnapshot) {
  const trimmed = question.trim();

  if (!trimmed) {
    return "Ask a question about the active Bridgewater operating data: plants, assets, risk, alerts, work orders, scenario metrics, or recommended actions.";
  }

  if (!hasMockDataQuestionScope(trimmed, snapshot)) {
    return "I can only answer questions about this Bridgewater predictive-maintenance operating data. Ask about plants, assets, alerts, work orders, risk, KPIs, telemetry, scenarios, or recommended maintenance actions.";
  }

  const activeWindowLabel = getWindowRiskLabel(snapshot.window);
  const alternateWindow = getAlternateWindow(snapshot.window);
  const alternateWindowLabel = getWindowRiskLabel(alternateWindow);
  const asset = findAsset(trimmed, snapshot);
  const plant = findPlant(trimmed, snapshot);

  if (asset) {
    const alert = asset.activeAlert;
    const order = asset.activeWorkOrder;
    const explanation = snapshot.explanationByAsset[asset.id];

    return [
      formatAssetLine(asset, snapshot.window),
      `Alternate horizon: ${formatPercent(getWindowRisk(alternateWindow, asset))} ${alternateWindowLabel} risk.`,
      `Drivers: ${asset.topDrivers.join(", ")}.`,
      `Recommended action: ${asset.recommendedAction}`,
      `Line impact: ${asset.lineImpact}`,
      alert ? `Active alert: ${alert.title} (${alert.status}).` : "Active alert: none in the current scenario.",
      order ? `Work order: ${order.id}, ${titleCase(order.status.replace("_", " "))}, priority ${order.priority}.` : "Work order: none active for this asset.",
      explanation ? `Explanation: ${explanation.summary}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (plant) {
    const riskiestAssets = [...plant.assets]
      .sort((left, right) => getWindowRisk(snapshot.window, right) - getWindowRisk(snapshot.window, left))
      .slice(0, 3)
      .map((entry) => formatAssetLine(entry, snapshot.window));

    return [
      formatPlantLine(plant),
      `Address: ${plant.address}.`,
      `Programs: ${plant.vehiclePrograms.join(", ")}.`,
      `Operational focus: ${plant.operationalFocus}`,
      `Projected window: ${plant.projectedWindow}.`,
      `Highest-risk assets:\n${riskiestAssets.map((line) => `- ${line}`).join("\n")}`,
    ].join("\n");
  }

  if (includesAny(trimmed, ["top", "highest", "riskiest", "critical", "priority"])) {
    const topAssets = snapshot.topRiskAssets
      .map((entry, index) => `${index + 1}. ${formatAssetLine(entry, snapshot.window)}`)
      .join("\n");

    return [
      `Top asset priorities in the active ${activeWindowLabel} window:`,
      topAssets,
      "",
      `Open critical alerts: ${snapshot.openCriticalIssues.length}.`,
      `Lead scenario: ${snapshot.scenario.name}.`,
    ].join("\n");
  }

  if (includesAny(trimmed, ["alert", "alerts", "issue", "issues"])) {
    if (snapshot.alerts.length === 0) {
      return "There are no active alerts in the current operating state.";
    }

    return [
      `Current alerts (${snapshot.alerts.length}):`,
      snapshot.alerts
        .map((alert) => {
          const alertAsset = snapshot.assets.find((entry) => entry.id === alert.assetId);
          return `- ${alert.title}: ${riskBandLabels[alert.severity]} severity, ${alert.status}, ${alertAsset?.code ?? alert.assetId}. ${alert.triggerReason}`;
        })
        .join("\n"),
    ].join("\n");
  }

  if (includesAny(trimmed, ["work order", "workorder", "work orders", "dispatch", "technician"])) {
    if (snapshot.workOrders.length === 0) {
      return "There are no active work orders in the current operating state.";
    }

    return [
      `Current work orders (${snapshot.workOrders.length}):`,
      snapshot.workOrders
        .map((order) => {
          const orderAsset = snapshot.assets.find((entry) => entry.id === order.assetId);
          return `- ${order.id}: ${titleCase(order.status.replace("_", " "))}, ${order.priority} priority, ${orderAsset?.code ?? order.assetId}, due ${order.dueAt}.`;
        })
        .join("\n"),
    ].join("\n");
  }

  if (includesAny(trimmed, ["kpi", "metric", "executive", "value", "downtime", "portfolio", "business"])) {
    return [
      `Portfolio health: ${Math.round(snapshot.portfolioHealth)}.`,
      `Projected downtime: ${snapshot.projectedDowntimeHours.toFixed(1)} hrs.`,
      `Protected value: ${formatCurrency(snapshot.protectedValue)}.`,
      `Overtime avoidance: ${formatCurrency(snapshot.overtimeAvoidanceValue)}.`,
      `Avoided downtime: ${snapshot.avoidedDowntimeHours.toFixed(1)} hrs.`,
      `Backlog pressure: ${snapshot.backlogHours.toFixed(1)} hrs.`,
      "",
      "Executive metrics:",
      snapshot.executiveMetrics.map((metric) => `- ${metric.label}: ${metric.value} (${metric.delta})`).join("\n"),
    ].join("\n");
  }

  if (includesAny(trimmed, ["scenario", "story", "narrative", "current state"])) {
    return [
      `Active scenario: ${snapshot.scenario.name}.`,
      `Executive summary: ${snapshot.scenario.executiveSummary}`,
      `Operations narrative: ${snapshot.scenario.operationsNarrative}`,
      `Maintenance narrative: ${snapshot.scenario.maintenanceNarrative}`,
      `Hero asset: ${snapshot.heroAsset ? `${snapshot.heroAsset.code} in ${snapshot.heroAsset.plant.name}` : "none"}.`,
    ].join("\n");
  }

  return [
    "Here is the current operating overview:",
    `- Active scenario: ${snapshot.scenario.name}`,
    `- Active plant: ${snapshot.selectedPlant.name}`,
    `- Portfolio health: ${Math.round(snapshot.portfolioHealth)}`,
    `- Projected downtime: ${snapshot.projectedDowntimeHours.toFixed(1)} hrs`,
    `- Open alerts: ${snapshot.alerts.length}`,
    `- Work orders: ${snapshot.workOrders.length}`,
    "",
    "Ask a more specific question about a plant, asset code, alert, work order, KPI, or recommendation for a narrower answer.",
  ].join("\n");
}
