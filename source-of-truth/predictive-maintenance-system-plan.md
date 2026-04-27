# Predictive Maintenance System Plan

## Summary
- Build a single-tenant, multi-plant predictive maintenance platform for Bridgewater Interiors with web app only, hybrid edge-cloud architecture, simulated telemetry in v1, enterprise SSO + RBAC, native work-order management, and adapter-ready integration points for future CMMS/MES/IoT connectivity.
- The system will serve executives, plant/operations leaders, maintenance managers, reliability engineers, and technicians in one product, with role-specific views over the same underlying asset, alert, and work-order model.
- Default implementation stack: Next.js + TypeScript frontend, FastAPI + Python backend, Python worker services for feature engineering/model inference, PostgreSQL + TimescaleDB for transactional + time-series storage, Redis for queues/cache, Azure Entra ID (OIDC/SAML) for SSO, and Azure-first cloud deployment with a plant-side edge agent.

## Implementation Changes
- Create four deployable subsystems:
  - `web`: responsive role-based UI for dashboards, alerts, incidents, and work orders.
  - `api`: auth, asset registry, telemetry ingest, alert/work-order APIs, executive reporting.
  - `ml-worker`: feature pipelines, anomaly scoring, failure prediction, model registry tasks.
  - `edge-agent`: plant-side collector interface; in v1 it runs the simulator and publishes telemetry using the same contract future adapters will use.
- Adopt this core data model:
  - `Plant`, `Line`, `Asset`, `Sensor`, `TelemetryPoint`, `AssetHealthSnapshot`, `PredictionResult`, `Alert`, `Incident`, `WorkOrder`, `MaintenanceLog`, `User`, `Role`, `NotificationEvent`.
- Use this end-to-end data flow:
  - simulator emits telemetry per asset and sensor
  - edge agent batches and signs events
  - API validates, deduplicates, and writes raw telemetry to time-series storage
  - worker computes rolling features on `5m`, `1h`, and `24h` windows
  - models produce `anomaly_score`, `health_score`, and `failure_probability_24h/72h`
  - rules convert risk outputs into alerts/incidents
  - incidents can auto-create work orders based on severity and asset policy
  - dashboards and executive reports read from materialized health/operations views
- Build these product surfaces:
  - Executive dashboard: plant comparison, downtime risk, open critical incidents, maintenance backlog, ROI/OEE summary.
  - Operations dashboard: line status, at-risk assets, predicted stoppage windows, alert heatmaps.
  - Maintenance workspace: alert triage queue, asset history, health trends, work-order board, technician assignment.
  - Technician work-order UI: task details, checklist, notes, parts used, completion/verification.
  - Simulation control center: scenario selection, fault injection, plant/line/asset seeding, replay controls.
- Implement intelligence in two layers:
  - Anomaly detection per asset class using unsupervised time-series models for vibration/temperature/current/pressure drift.
  - Failure prediction for 24h and 72h windows using supervised models trained on simulated labeled failure scenarios.
- Keep recommendations deterministic in v1:
  - use rule-based maintenance playbooks by asset class and failure mode
  - do not include LLM-generated root-cause advice or prescriptive AI in v1
- Support these operational edge cases from day one:
  - duplicate telemetry: drop by `source_id + asset_id + sensor_key + timestamp`
  - late/out-of-order data: accept within `24h`, re-run feature windows asynchronously
  - missing telemetry: mark asset `stale`, suppress new failure predictions after threshold breach
  - edge disconnect: queue locally and retry with backoff; show sync health in admin UI
  - noisy spikes: require configurable persistence windows before promoting to critical alerts
  - role isolation: executives can see all plants; plant users are plant-scoped; technicians only see assigned work

## Public APIs / Interfaces / Types
- Expose these API groups under `/api/v1`:
  - `POST /telemetry/batch`
  - `GET /plants`, `GET /lines`, `GET /assets`, `GET /assets/:id`
  - `GET /assets/:id/health`, `GET /assets/:id/predictions`, `GET /assets/:id/history`
  - `GET /alerts`, `PATCH /alerts/:id`
  - `GET /incidents`, `POST /incidents/:id/work-orders`
  - `GET /work-orders`, `POST /work-orders`, `PATCH /work-orders/:id`
  - `GET /dashboards/executive`, `GET /dashboards/operations`, `GET /dashboards/maintenance`
  - `GET /me`, `GET /roles`
- Lock these interface contracts:
  - `TelemetryPoint`: `plant_code`, `line_code`, `asset_code`, `sensor_key`, `value`, `unit`, `timestamp`, `source_id`
  - `AssetHealthSnapshot`: `asset_id`, `health_score`, `risk_band`, `last_seen_at`, `stale`
  - `PredictionResult`: `asset_id`, `anomaly_score`, `failure_probability_24h`, `failure_probability_72h`, `model_version`
  - `Alert`: `severity`, `status`, `trigger_reason`, `acknowledged_by`, `linked_incident_id`
  - `WorkOrder`: `priority`, `status`, `assigned_to`, `due_at`, `playbook_code`, `verification_required`
- Define pluggable adapters now, even though live integrations are deferred:
  - `TelemetryAdapter`
  - `NotificationAdapter`
  - `ExternalWorkOrderAdapter`
  - `IdentityProviderAdapter`
- Use this work-order state machine:
  - `new -> acknowledged -> assigned -> in_progress -> blocked|completed -> verified -> closed`
  - `cancelled` allowed only from `new|acknowledged|assigned`

## Delivery Sequence
- Phase 1: Platform Foundation
  - scaffold services, CI/CD, auth, RBAC, shared types, asset registry, simulator, telemetry ingest, time-series storage
  - exit criteria: seeded plants/assets stream simulated data and users can authenticate into empty dashboards
- Phase 2: Health Monitoring
  - feature pipeline, anomaly detection, health snapshots, maintenance and operations dashboards, alerting rules
  - exit criteria: simulated faults produce visible risk escalation and alert creation within SLA
- Phase 3: Failure Prediction + Work Orders
  - 24h/72h prediction models, incident creation, auto/manual work-order generation, technician workflow, audit trail
  - exit criteria: severe simulated scenarios create actionable work orders end-to-end
- Phase 4: Executive Layer + Hardening
  - executive dashboards, backlog/ROI metrics, notification delivery, observability, admin controls, scenario replay
  - exit criteria: all user roles can complete their primary workflow without admin intervention
- Phase 5: Adapter Readiness
  - finalize connector SDK/contracts, webhook/auth patterns, import/export formats, integration test harness
  - exit criteria: a future team can add CMMS/MES/IoT adapters without changing core domain models or API shapes

## Test Plan
- Unit tests:
  - telemetry validation, deduplication, stale-asset logic, alert promotion/suppression, work-order state transitions, RBAC guards
- Integration tests:
  - simulator -> ingest -> feature pipeline -> prediction -> alert -> work order
  - late data reprocessing, edge reconnect replay, notification dispatch, executive aggregation accuracy
- Model tests:
  - anomaly precision on seeded drift scenarios
  - failure prediction recall on simulated failure classes
  - versioned inference reproducibility
- End-to-end tests:
  - executive reviews plant risk
  - ops supervisor drills into a line and acknowledges an alert
  - maintenance manager creates/assigns work
  - technician completes and submits verification
- Non-functional acceptance:
  - ingest at least `50,000 telemetry points/min`
  - dashboard refresh under `5s` for current status views
  - critical alert creation within `60s` of a simulated failure pattern
  - SSO login and role scoping enforced across all protected routes

## Assumptions
- Greenfield build; there are no existing repo constraints, migrations, or backward-compatibility requirements.
- v1 is simulated-data only, but all ingest and domain contracts must be production-shaped.
- The product is single-tenant for Bridgewater, but must support multiple plants and lines within the organization.
- Default monitored assets in simulation: conveyors, robotic welders, and hydraulic presses.
- Notification channels in v1 are in-app + email; Teams/CMMS/MES are planned through adapters, not implemented initially.
- Cloud default is Azure-first because it aligns well with enterprise SSO and a future manufacturing deployment model.
