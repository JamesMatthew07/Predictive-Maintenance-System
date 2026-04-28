import type {
  AiExplanationRequest,
  AssetSnapshot,
  CompareMode,
  ExplanationPayload,
  ScenarioSeed,
  TimeWindow,
} from "@/lib/types";

export function buildExplanationSignature(
  asset: AssetSnapshot,
  fallback: ExplanationPayload,
  window: TimeWindow,
  compareMode: CompareMode,
) {
  return [
    asset.id,
    fallback.scenarioId,
    asset.riskBand,
    asset.healthScore,
    asset.anomalyScore,
    asset.failureRisk24h,
    asset.failureRisk72h,
    asset.activeAlert?.status ?? "no-alert",
    asset.activeWorkOrder?.status ?? "no-order",
    window,
    compareMode,
  ].join("|");
}

export function buildAiExplanationRequest(
  asset: AssetSnapshot,
  scenario: ScenarioSeed,
  fallback: ExplanationPayload,
  window: TimeWindow,
  compareMode: CompareMode,
): AiExplanationRequest {
  const signature = buildExplanationSignature(asset, fallback, window, compareMode);

  return {
    signature,
    assetId: asset.id,
    assetCode: asset.code,
    assetName: asset.name,
    assetType: asset.assetType,
    plantName: asset.plant.name,
    lineName: asset.line.name,
    zoneLabel: asset.zoneLabel,
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    window,
    compareMode,
    healthScore: asset.healthScore,
    anomalyScore: asset.anomalyScore,
    riskBand: asset.riskBand,
    failureRisk24h: asset.failureRisk24h,
    failureRisk72h: asset.failureRisk72h,
    predictedStoppageWindow: asset.predictedStoppageWindow,
    topDrivers: asset.topDrivers,
    recommendedAction: asset.recommendedAction,
    lineImpact: asset.lineImpact,
    lastMaintenanceAt: asset.lastMaintenanceAt,
    activeAlert: asset.activeAlert
      ? {
          title: asset.activeAlert.title,
          reason: asset.activeAlert.triggerReason,
          status: asset.activeAlert.status,
        }
      : null,
    activeWorkOrder: asset.activeWorkOrder
      ? {
          id: asset.activeWorkOrder.id,
          status: asset.activeWorkOrder.status,
          priority: asset.activeWorkOrder.priority,
        }
      : null,
    fallbackExplanation: fallback,
  };
}
