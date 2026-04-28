"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  assignWorkOrder,
  buildDemoSnapshot,
  createHeroWorkOrderForScenario,
  createInitialSessionState,
  DEFAULT_COMPARE_MODE,
  DEFAULT_WINDOW,
  getLineOptions,
  getPlantOptions,
  getScenarioOptions,
  roleLabels,
  setAlertStatus,
  toggleChecklistItem,
  updateWorkOrderNotes,
  updateWorkOrderStatus,
} from "@/lib/engine/demo-engine";
import {
  buildAiExplanationRequest,
  buildExplanationSignature,
} from "@/lib/ai/explanation-utils";
import type {
  AiExplanationResponse,
  AlertStatus,
  CompareMode,
  DemoSessionState,
  ExplanationState,
  Role,
  TimeWindow,
  WorkOrderStatus,
} from "@/lib/types";

type DemoContextValue = {
  state: DemoSessionState;
  snapshot: ReturnType<typeof buildDemoSnapshot>;
  roles: typeof roleLabels;
  scenarios: ReturnType<typeof getScenarioOptions>;
  plants: ReturnType<typeof getPlantOptions>;
  setScenarioId: (scenarioId: string) => void;
  setRole: (role: Role) => void;
  setPlantId: (plantId: string) => void;
  setLineId: (lineId?: string) => void;
  setWindow: (window: TimeWindow) => void;
  setCompareMode: (mode: CompareMode) => void;
  createHeroWorkOrder: (assigneeId?: string) => void;
  setWorkOrderStatus: (workOrderId: string, status: WorkOrderStatus) => void;
  setWorkOrderAssignee: (workOrderId: string, assigneeId: string) => void;
  toggleChecklistItem: (workOrderId: string, itemId: string) => void;
  setWorkOrderNotes: (workOrderId: string, notes: string) => void;
  setAlertStatus: (alertId: string, status: AlertStatus) => void;
  getAssetExplanationState: (assetId: string) => ExplanationState | null;
  requestAssetExplanation: (assetId: string) => Promise<void>;
  resetDemo: () => void;
};

const STORAGE_KEY = "bridgewater-demo-session";

const DemoContext = createContext<DemoContextValue | null>(null);

function readStoredState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as DemoSessionState;

    return {
      ...createInitialSessionState(),
      ...parsed,
      window: parsed.window ?? DEFAULT_WINDOW,
      compareMode: parsed.compareMode ?? DEFAULT_COMPARE_MODE,
    };
  } catch {
    return null;
  }
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoSessionState>(createInitialSessionState);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [aiExplanationCache, setAiExplanationCache] = useState<
    Record<string, ExplanationState>
  >({});
  const inFlightExplanationRequests = useRef(new Map<string, Promise<void>>());
  const persistState = useEffectEvent((nextState: DemoSessionState) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  });

  useEffect(() => {
    const stored = readStoredState();
    const frame = window.requestAnimationFrame(() => {
      if (stored) {
        setState(stored);
      }

      setHasHydrated(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    persistState(state);
  }, [hasHydrated, state]);

  const snapshot = useMemo(() => buildDemoSnapshot(state), [state]);
  const getAssetExplanationState = (assetId: string) => {
    const asset = snapshot.assets.find((entry) => entry.id === assetId);
    const fallback = snapshot.explanationByAsset[assetId];

    if (!asset || !fallback) {
      return null;
    }

    const signature = buildExplanationSignature(
      asset,
      fallback,
      state.window,
      state.compareMode,
    );

    return (
      aiExplanationCache[signature] ?? {
        signature,
        status: "idle",
        source: "deterministic",
        payload: fallback,
      }
    );
  };
  const requestAssetExplanation = async (assetId: string) => {
    const asset = snapshot.assets.find((entry) => entry.id === assetId);
    const fallback = snapshot.explanationByAsset[assetId];

    if (!asset || !fallback) {
      return;
    }

    const signature = buildExplanationSignature(
      asset,
      fallback,
      state.window,
      state.compareMode,
    );
    const existing = aiExplanationCache[signature];
    const inFlight = inFlightExplanationRequests.current.get(signature);

    if (existing && existing.status === "ready") {
      return;
    }

    if (inFlight) {
      await inFlight;
      return;
    }

    setAiExplanationCache((current) => ({
      ...current,
      [signature]: {
        signature,
        status: "loading",
        source: "deterministic",
        payload: fallback,
        detail: "Refreshing the Bridgewater narrative with OpenAI.",
      },
    }));

    const requestPayload = buildAiExplanationRequest(
      asset,
      snapshot.scenario,
      fallback,
      state.window,
      state.compareMode,
    );
    const requestPromise = (async () => {
      try {
        const response = await fetch("/api/ai/explanation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
          cache: "no-store",
        });
        const payload = (await response.json()) as AiExplanationResponse | { detail?: string };

        if (!response.ok || !("payload" in payload) || !("source" in payload)) {
          throw new Error(
            "detail" in payload && payload.detail
              ? payload.detail
              : "OpenAI explanation request failed.",
          );
        }

        setAiExplanationCache((current) => ({
          ...current,
          [signature]: {
            signature,
            status: "ready",
            source: payload.source,
            payload: payload.payload,
            generatedAt: payload.generatedAt,
            detail: payload.detail,
            model: payload.model,
          },
        }));
      } catch (error) {
        const detail =
          error instanceof Error
            ? error.message
            : "OpenAI was unavailable, so the deterministic Bridgewater explanation is being used.";

        setAiExplanationCache((current) => ({
          ...current,
          [signature]: {
            signature,
            status: "ready",
            source: "fallback",
            payload: fallback,
            detail,
          },
        }));
      } finally {
        inFlightExplanationRequests.current.delete(signature);
      }
    })();

    inFlightExplanationRequests.current.set(signature, requestPromise);
    await requestPromise;
  };

  return (
    <DemoContext.Provider
      value={{
        state,
        snapshot,
        roles: roleLabels,
        scenarios: getScenarioOptions(),
        plants: getPlantOptions(),
        setScenarioId: (scenarioId) =>
          startTransition(() => {
            setState((current) => {
              const scenario = getScenarioOptions().find((entry) => entry.id === scenarioId);

              return {
                ...current,
                scenarioId,
                selectedPlantId: scenario?.heroPlantId ?? current.selectedPlantId,
                selectedLineId: scenario?.heroLineId,
              };
            });
          }),
        setRole: (role) =>
          setState((current) => ({
            ...current,
            role,
          })),
        setPlantId: (plantId) =>
          setState((current) => ({
            ...current,
            selectedPlantId: plantId,
            selectedLineId: getLineOptions(plantId)[0]?.id,
          })),
        setLineId: (lineId) =>
          setState((current) => ({
            ...current,
            selectedLineId: lineId,
          })),
        setWindow: (window) =>
          setState((current) => ({
            ...current,
            window,
          })),
        setCompareMode: (compareMode) =>
          setState((current) => ({
            ...current,
            compareMode,
          })),
        createHeroWorkOrder: (assigneeId) =>
          setState((current) =>
            createHeroWorkOrderForScenario(current, current.scenarioId, assigneeId),
          ),
        setWorkOrderStatus: (workOrderId, status) =>
          setState((current) => updateWorkOrderStatus(current, workOrderId, status)),
        setWorkOrderAssignee: (workOrderId, assigneeId) =>
          setState((current) => assignWorkOrder(current, workOrderId, assigneeId)),
        toggleChecklistItem: (workOrderId, itemId) =>
          setState((current) => toggleChecklistItem(current, workOrderId, itemId)),
        setWorkOrderNotes: (workOrderId, notes) =>
          setState((current) => updateWorkOrderNotes(current, workOrderId, notes)),
        setAlertStatus: (alertId, status) =>
          setState((current) => setAlertStatus(current, alertId, status)),
        getAssetExplanationState,
        requestAssetExplanation,
        resetDemo: () => startTransition(() => setState(createInitialSessionState())),
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);

  if (!context) {
    throw new Error("useDemo must be used within DemoProvider");
  }

  return context;
}
