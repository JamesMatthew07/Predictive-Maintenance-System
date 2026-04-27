# Predictive Maintenance Mockup Scope

## Purpose
This mockup is meant to demonstrate the value of a predictive maintenance system to a potential client through a polished, believable product experience.

It is not a production build and should not attempt to implement the full platform architecture described in the main system plan.

## Mockup Goal
Show how Bridgewater Interiors could use predictive maintenance to:
- identify at-risk equipment before failure
- prioritize maintenance actions
- reduce unplanned downtime in a just-in-time manufacturing environment
- give executives, operations leaders, and maintenance teams a shared view of equipment risk

## Recommended Scope
Build a focused, interactive web mockup with simulated data for one plant, one line, and a small set of assets.

Recommended demo assets:
- 1 conveyor
- 1 robotic welder
- 1 hydraulic press

Recommended user roles:
- executive
- operations supervisor
- maintenance manager
- technician

## In Scope
- Responsive web UI with polished client-demo visuals
- Seeded and simulated telemetry data
- Lightweight AI-based health score, anomaly score, and failure risk indicators
- Alerts generated from predefined rules or scripted scenarios
- Work-order creation and status updates inside the app
- Role-based screen variations for the main users
- Fault-injection or scenario toggles for demo control
- AI explanation panel for why an asset is flagged

## Core Screens
- Executive dashboard
  - plant summary
  - open critical issues
  - downtime risk snapshot
  - maintenance backlog summary
- Operations dashboard
  - line status
  - at-risk assets
  - current alerts
  - predicted stoppage window
- Maintenance workspace
  - alert triage list
  - asset health history
  - recommended action/playbook
  - work-order creation and assignment
- Technician work-order view
  - assigned task
  - checklist
  - notes
  - completion and verification
- Demo control panel
  - choose scenario
  - inject fault
  - replay normal vs degraded behavior

## Demo Story
The mockup should support one simple, strong story:

1. A conveyor or robotic welder begins showing abnormal behavior.
2. The system flags rising risk before failure.
3. Operations sees the affected line and timing risk.
4. Maintenance reviews the asset history and creates or receives a work order.
5. A technician completes the task before a major breakdown occurs.
6. Leadership sees the avoided downtime and operational impact.

## AI Scope
The mockup should include real but lightweight AI behavior so the system feels credible during the client demo.

The goal is not to build a full production AI platform. The goal is to show that the product can:
- detect abnormal equipment behavior from telemetry patterns
- estimate short-term failure risk
- explain which signals are driving the risk
- recommend the next maintenance action

## Data and Intelligence Approach
For the mockup, use lightweight AI on top of seeded and simulated telemetry instead of full machine learning infrastructure.

Recommended approach:
- pre-seeded telemetry for normal and failure scenarios
- simple anomaly detection using rolling thresholds, z-scores, or a lightweight model such as Isolation Forest
- lightweight failure-risk scoring for 24h and 72h views
- AI explanation output that highlights the likely contributing signals such as vibration, temperature, or pressure drift
- deterministic maintenance recommendations by asset type
- scripted scenarios to ensure the demo stays predictable and controllable

This keeps the demo credible while still showing actual AI behavior, without introducing unnecessary backend, training, or MLOps complexity.

## Out of Scope
- Real edge agent deployment
- Live IoT ingestion from plant equipment
- Full enterprise SSO integration
- Multi-plant production-scale architecture
- Public API design and adapter framework
- Advanced ML pipelines, model training infrastructure, and MLOps tooling
- Full audit, observability, and performance hardening
- Real CMMS, MES, Teams, or ERP integrations
- LLM-generated root-cause analysis or autonomous maintenance decisions

## Suggested Build Shape
The mockup should feel real, but be intentionally lightweight.

Recommended implementation approach:
- frontend-first experience
- mock API routes or lightweight backend
- seeded JSON or database fixtures
- scenario-driven state changes
- no heavy infrastructure unless needed for the demo

## Success Criteria
The mockup is successful if a client can clearly understand:
- what problem the system solves
- who uses it
- how an issue moves from detection to action
- how AI contributes to early detection and prioritization
- what business value it creates
- how it could later expand into a real production system

## Nice-to-Have Stretch Items
- side-by-side before vs after downtime comparison
- simple ROI widget
- asset trend charts with fault markers
- email or notification preview
- light admin screen for scenario setup

## Guardrails
- Prefer clarity over completeness.
- Prefer polished screens over deep backend functionality.
- Prefer one convincing end-to-end workflow over many partially finished features.
- Avoid building enterprise-scale architecture unless it directly improves the mockup experience.

## Final Recommendation
Treat this as a high-fidelity product demo, not as phase one of a full enterprise implementation.

If time is limited, prioritize:
- Executive dashboard
- Operations dashboard
- Maintenance workspace
- Technician work-order flow
- Fault simulation controls
