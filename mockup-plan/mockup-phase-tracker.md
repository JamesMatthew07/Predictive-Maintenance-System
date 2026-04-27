# Mockup Phase Tracker

Use this file as the lightweight progress sheet for the predictive maintenance mockup.

Status legend:

- `not started`
- `in progress`
- `blocked`
- `in review`
- `done`

## Overall Milestone Tracker

| Phase | Status | Owner | Target Date | Notes |
| --- | --- | --- | --- | --- |
| Phase 0 - Scope lock and storyboarding | done | Codex | 2026-04-23 | Locked to four public plants, Warren hero scenario, role switching in-session, ROI in core scope, and deterministic AI fallback. |
| Phase 1 - Foundation and design system | done | Codex | 2026-04-23 | Next.js 16 app, Tailwind, shadcn/ui primitives, Bridgewater shell, local assets, typography, and route scaffolds are implemented in `bridgewater-command-center`. |
| Phase 2 - Scenario engine and intelligence layer | done | Codex | 2026-04-23 | Deterministic scenario state, seeded plant/asset model, telemetry generation, scoring, alert logic, and playbook mapping are implemented. |
| Phase 3 - Dashboard and role surfaces | done | Codex | 2026-04-24 | Portfolio, executive, plant, operations, and asset detail surfaces are implemented and browser-verified. |
| Phase 4 - Maintenance and technician workflow | done | Codex | 2026-04-24 | Maintenance triage, work-order dispatch, technician execution, and work-order detail flows are implemented and browser-verified. |
| Phase 5 - Demo controls, AI explanations, and value story | done | Codex | 2026-04-24 | Demo-control, deterministic explanation panels, live OpenAI explanation routing with fallback, compare mode, reset flow, and ROI/value storytelling are implemented. |
| Phase 6 - QA, deployment, and demo packaging | in progress | Codex | 2026-04-24 | Lint, production build, local dev verification, and presenter script are complete. Vercel deployment was not executed in this turn. |

## Detailed Checklist

### Phase 0 - Scope Lock And Storyboarding

- [x] Confirm the four public Bridgewater plants to include in the mockup
- [x] Confirm plant, line, and asset names for the demo
- [x] Confirm the primary hero scenario
- [x] Confirm which plant will host the primary hero incident
- [x] Approve the route map
- [x] Approve the core screen list
- [x] Approve scoring outputs and explanation schema
- [x] Approve UX direction and design tokens
- [x] Approve use of official public logo, favicon, and Bridgewater palette

### Phase 1 - Foundation And Design System

- [x] Scaffold the Next.js app shell
- [x] Configure Tailwind and shadcn/ui
- [x] Build navigation and layout shell
- [x] Add Bridgewater brand tokens, logo references, and favicon plan
- [x] Create shared types and local mock-data modules
- [x] Create plant metadata modules for Detroit, Warren, Eastaboga, and Lansing
- [x] Create route skeletons for all core screens
- [x] Finalize typography, color, and status tokens

### Phase 2 - Scenario Engine And Intelligence Layer

- [x] Seed normal and degraded telemetry across the plant network
- [x] Implement scenario state manager
- [x] Implement health, anomaly, and risk scoring
- [x] Implement alert generation rules
- [x] Map scenarios to deterministic playbooks
- [x] Map plant metadata to supported vehicle programs and asset context
- [x] Verify scenario switching updates the app consistently

### Phase 3 - Dashboard And Role Surfaces

- [x] Build portfolio or enterprise overview
- [x] Build executive dashboard
- [x] Build plant detail view
- [x] Build operations dashboard
- [x] Build asset detail drill-in
- [x] Connect charts and KPI surfaces to scenario state
- [x] Verify responsive behavior on laptop and tablet widths
- [x] Verify top-level business story is clear

### Phase 4 - Maintenance And Technician Workflow

- [x] Build alert triage view
- [x] Build asset history and explanation panel
- [x] Build work-order creation flow
- [x] Build assignment and status transition flow
- [x] Build technician task view
- [x] Verify end-to-end flow from alert to completed work

### Phase 5 - Demo Controls, AI Explanations, And Value Story

- [x] Build demo control panel
- [x] Add plant selector and multi-plant compare behavior
- [x] Add scenario reset and replay behaviors
- [x] Add OpenAI-backed explanation flow
- [x] Add deterministic fallback explanation flow
- [x] Add avoided downtime / ROI widget
- [x] Verify the presenter can control the story reliably

### Phase 6 - QA, Deployment, And Demo Packaging

- [x] Run visual QA across all core routes
- [x] Verify no broken loading, empty, or failure states
- [ ] Verify accessibility basics and contrast
- [x] Verify Bridgewater branding is consistent across shell, logo, favicon, and executive views
- [ ] Deploy to Vercel
- [x] Create presenter script
- [ ] Rehearse the end-to-end demo at least twice

## Open Decisions

- [x] Confirm whether OpenAI explanations should be live per interaction or pre-generated per scenario
- [x] Confirm whether technician flow should be mobile-first or desktop-first
- [x] Confirm whether ROI and notification preview are core scope or stretch scope
- [x] Confirm whether the demo should support role switching in one session or separate role entry points
- [x] Confirm whether to use `15` vehicle models or `11` as the executive summary metric because the current public website pages differ

Resolved assumptions:

- OpenAI explanations will be scenario-stable and deterministic first, with optional live generation only as a non-blocking enhancement.
- Technician experience is mobile/tablet friendly by default.
- ROI is core scope; notification preview remains stretch scope if time permits.
- Role switching works inside one active session.
- The executive layer will avoid a single enterprise vehicle-count KPI until Bridgewater confirms the website discrepancy.

## Change Log

| Date | Change | Owner |
| --- | --- | --- |
| 2026-04-23 | Initial phased tracker created | Codex |
| 2026-04-23 | Added Bridgewater screen map and seeded data model planning artifacts | Codex |
| 2026-04-23 | Locked implementation assumptions and moved active build phases into execution | Codex |
| 2026-04-24 | Completed the app build, deterministic scenario engine, route set, and browser QA pass | Codex |
| 2026-04-24 | Added live OpenAI explanation routing with deterministic fallback and UI status states | Codex |
| 2026-04-24 | Reduced asset-page latency with snapshot memoization, telemetry caching, and explanation request dedupe | Codex |
| 2026-04-24 | Expanded seeded telemetry profiles so 24h and 72h windows show distinct signal histories and clearer chart context | Codex |
| 2026-04-24 | Rewired KPI cards, risk rankings, and horizon labels so the 24h/72h toggle updates summary surfaces across routes | Codex |
| 2026-04-24 | Restored the original top-bar scenario selector design while keeping grouped scenario metadata in the option list | Codex |
| 2026-04-24 | Refined the top-bar command controls for stronger alignment, clearer grouping, and more consistent operator ergonomics | Codex |
| 2026-04-24 | Simplified the command header into a cleaner minimalist toolbar with reduced chrome and compact controls | Codex |
| 2026-04-24 | Replaced the scenario and plant selectors with reliable dropdown menu triggers so the clean header remains clickable | Codex |
| 2026-04-24 | Cleaned the maintenance work-order composer with a compact lifecycle rail and clearer playbook detail layout | Codex |
| 2026-04-24 | Fixed the maintenance status controls so labels no longer collide at narrow composer widths | Codex |
| 2026-04-24 | Added a polished Bridgewater-branded mock login page with lightweight demo credential validation | Codex |
| 2026-04-24 | Replaced the sidebar bottom explainer copy with a minimal logout action returning to the login page | Codex |
| 2026-04-27 | Converted the maintenance work-order status controls from action buttons into a compact dropdown selector | Codex |
| 2026-04-28 | Moved Live/Compare out of the global command bar and into the chart sections where it controls baseline overlays | Codex |
| 2026-04-28 | Fixed plant switching so the selected line resets to a valid line for the newly selected plant | Codex |
| 2026-04-28 | Reworked plant selection to use direct menu actions and navigate plant detail routes when switching plants | Codex |
| 2026-04-28 | Synced plant selection with matching plant scenarios so the top bar and page story no longer conflict | Codex |
| 2026-04-28 | Removed visible demo/mockup language from the login page and repositioned it as an internal workspace access screen | Codex |
| 2026-04-28 | Removed the top-bar role selector to simplify the global command controls | Codex |
| 2026-04-28 | Removed the Demo Control sidebar tab and deleted its route and screen from the app | Codex |
| 2026-04-28 | Scoped the technician workflow to the selected plant and added plant-specific work orders for each location | Codex |
