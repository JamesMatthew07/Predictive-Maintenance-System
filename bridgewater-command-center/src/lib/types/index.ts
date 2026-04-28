export type RiskBand = "healthy" | "watch" | "warning" | "critical";
export type ProductFamily = "seating" | "overhead" | "center-console";
export type AssetType = "conveyor" | "robotic-welder" | "hydraulic-press";
export type Role =
  | "executive"
  | "operations-supervisor"
  | "maintenance-manager"
  | "technician";
export type WorkOrderStatus =
  | "draft"
  | "assigned"
  | "in_progress"
  | "completed"
  | "verified";
export type AlertStatus = "new" | "acknowledged" | "in-review" | "resolved";
export type TimeWindow = "24h" | "72h";
export type CompareMode = "live" | "compare";
export type SensorDirection = "up" | "down" | "unstable";
export type SensorKey =
  | "vibration"
  | "motor-temperature"
  | "motor-current"
  | "belt-speed"
  | "tip-temperature"
  | "current-draw"
  | "cycle-time"
  | "hydraulic-pressure"
  | "oil-temperature"
  | "cycle-deviation";

export type BrandConfig = {
  appName: string;
  companyName: string;
  shellLabel: string;
  tagline: string;
  logoWhiteUrl: string;
  logoBlueUrl: string;
  favicon32Url: string;
  appIcon192Url: string;
  appleTouchIcon180Url: string;
  colors: {
    navy: string;
    sky: string;
    white: string;
    neutral: string;
    ink: string;
    steel: string;
    success: string;
    warning: string;
    critical: string;
  };
};

export type Plant = {
  id: string;
  name: string;
  label: string;
  city: string;
  state: string;
  address: string;
  isHeadquarters: boolean;
  vehiclePrograms: string[];
  summary: string;
  operationalFocus: string;
};

export type Line = {
  id: string;
  plantId: string;
  name: string;
  productFamily: ProductFamily;
  status: RiskBand;
  taktTimeSeconds: number;
  throughputUnitsPerHour: number;
};

export type Asset = {
  id: string;
  plantId: string;
  lineId: string;
  code: string;
  name: string;
  assetType: AssetType;
  status: RiskBand;
  lastMaintenanceAt: string;
  playbookCode: string;
  zoneLabel: string;
};

export type SensorTemplate = {
  key: SensorKey;
  label: string;
  unit: string;
  direction: SensorDirection;
  baseValue: number;
  healthyVariance: number;
  warningDelta: number;
  criticalDelta: number;
  weight: number;
};

export type User = {
  id: string;
  name: string;
  role: Role;
  title: string;
  defaultPlantId?: string;
  shift: string;
};

export type Playbook = {
  code: string;
  assetType: AssetType;
  title: string;
  overview: string;
  estimatedDurationMinutes: number;
  steps: string[];
  verification: string[];
};

export type ScenarioAssetSeed = {
  healthScore: number;
  anomalyScore: number;
  riskBand: RiskBand;
  failureRisk24h: number;
  failureRisk72h: number;
  predictedStoppageWindow: string | null;
  topDrivers: string[];
  drift: number;
  recommendedAction: string;
  lineImpact: string;
  telemetryProfile?: {
    onset: number;
    escalation: number;
    focusStart24h?: number;
    volatility: number;
    bursts?: Array<{
      at: number;
      width: number;
      magnitude: number;
    }>;
  };
  alertTitle?: string;
  alertReason?: string;
  alertStatus?: AlertStatus;
  recoveryHealthScore?: number;
  recoveryAnomalyScore?: number;
  recoveryRiskBand?: RiskBand;
  recoveryFailureRisk24h?: number;
  recoveryFailureRisk72h?: number;
  recoveryWindow?: string | null;
};

export type ScenarioSeed = {
  id: string;
  name: string;
  heroPlantId?: string;
  heroLineId?: string;
  heroAssetId?: string;
  affectedAssetIds: string[];
  executiveSummary: string;
  operationsNarrative: string;
  maintenanceNarrative: string;
  businessImpact: {
    projectedDowntimeHours: number;
    avoidedDowntimeHours: number;
    protectedRevenue: number;
    overtimeAvoidance: number;
    backlogHours: number;
    openCriticalIssues: number;
  };
  executiveActions: string[];
  presenterNotes: string[];
  notificationPreview?: {
    channel: string;
    title: string;
    body: string;
  };
  assetStates: Record<string, ScenarioAssetSeed>;
};

export type Alert = {
  id: string;
  assetId: string;
  plantId: string;
  lineId: string;
  severity: RiskBand;
  title: string;
  triggerReason: string;
  status: AlertStatus;
  createdAt: string;
  ownerId?: string;
};

export type WorkOrderTemplate = {
  id: string;
  alertId: string;
  assetId: string;
  assignedTo?: string;
  priority: "high" | "urgent";
  status: WorkOrderStatus;
  title: string;
  dueAt: string;
  playbookCode: string;
  notes: string;
};

export type WorkOrderChecklistItem = {
  id: string;
  workOrderId: string;
  label: string;
  completed: boolean;
};

export type TelemetryPoint = {
  timestamp: string;
  label: string;
  sensorKey: SensorKey;
  value: number;
  baseline: number;
};

export type AssetSnapshot = Asset & {
  plant: Plant;
  line: Line;
  healthScore: number;
  anomalyScore: number;
  riskBand: RiskBand;
  failureRisk24h: number;
  failureRisk72h: number;
  predictedStoppageWindow: string | null;
  topDrivers: string[];
  recommendedAction: string;
  lineImpact: string;
  telemetry: TelemetryPoint[];
  baselineTelemetry: TelemetryPoint[];
  sensors: SensorTemplate[];
  activeAlert?: Alert;
  activeWorkOrder?: WorkOrder;
};

export type PlantSnapshot = Plant & {
  lines: Line[];
  assets: AssetSnapshot[];
  riskBand: RiskBand;
  healthScore: number;
  openCriticalIssues: number;
  downtimeExposureHours: number;
  maintenanceBacklogHours: number;
  projectedWindow: string;
};

export type ExecutiveMetric = {
  id: string;
  label: string;
  value: string;
  delta: string;
  detail: string;
};

export type WorkOrder = {
  id: string;
  alertId: string;
  assetId: string;
  assignedTo?: string;
  priority: "high" | "urgent";
  status: WorkOrderStatus;
  title: string;
  dueAt: string;
  playbookCode: string;
  notes: string;
  checklist: WorkOrderChecklistItem[];
};

export type ExplanationPayload = {
  assetId: string;
  scenarioId: string;
  assetType: AssetType;
  plantName: string;
  topDrivers: string[];
  healthScore: number;
  anomalyScore: number;
  failureRisk24h: number;
  failureRisk72h: number;
  recommendedAction: string;
  summary: string;
  impact: string;
  confidenceNote?: string;
};

export type ExplanationSource = "deterministic" | "live" | "fallback";
export type ExplanationStatus = "idle" | "loading" | "ready";

export type ExplanationState = {
  signature: string;
  status: ExplanationStatus;
  source: ExplanationSource;
  payload: ExplanationPayload;
  generatedAt?: string;
  detail?: string;
  model?: string;
};

export type AiExplanationRequest = {
  signature: string;
  assetId: string;
  assetCode: string;
  assetName: string;
  assetType: AssetType;
  plantName: string;
  lineName: string;
  zoneLabel: string;
  scenarioId: string;
  scenarioName: string;
  window: TimeWindow;
  compareMode: CompareMode;
  healthScore: number;
  anomalyScore: number;
  riskBand: RiskBand;
  failureRisk24h: number;
  failureRisk72h: number;
  predictedStoppageWindow: string | null;
  topDrivers: string[];
  recommendedAction: string;
  lineImpact: string;
  lastMaintenanceAt: string;
  activeAlert:
    | {
        title: string;
        reason: string;
        status: AlertStatus;
      }
    | null;
  activeWorkOrder:
    | {
        id: string;
        status: WorkOrderStatus;
        priority: "high" | "urgent";
      }
    | null;
  fallbackExplanation: ExplanationPayload;
};

export type AiExplanationResponse = {
  source: Extract<ExplanationSource, "live" | "fallback">;
  payload: ExplanationPayload;
  generatedAt: string;
  detail?: string;
  model?: string;
};

export type DemoSessionState = {
  scenarioId: string;
  role: Role;
  selectedPlantId: string;
  selectedLineId?: string;
  window: TimeWindow;
  compareMode: CompareMode;
  workOrders: Record<string, WorkOrder>;
  alertStatuses: Record<string, AlertStatus>;
};

export type DemoSnapshot = {
  brand: BrandConfig;
  scenario: ScenarioSeed;
  window: TimeWindow;
  selectedPlant: PlantSnapshot;
  plants: PlantSnapshot[];
  assets: AssetSnapshot[];
  alerts: Alert[];
  workOrders: WorkOrder[];
  executiveMetrics: ExecutiveMetric[];
  explanationByAsset: Record<string, ExplanationPayload>;
  heroAsset: AssetSnapshot | null;
  topRiskAssets: AssetSnapshot[];
  openCriticalIssues: Alert[];
  projectedDowntimeHours: number;
  backlogHours: number;
  protectedValue: number;
  overtimeAvoidanceValue: number;
  avoidedDowntimeHours: number;
  portfolioHealth: number;
  resolvedStory: boolean;
};
