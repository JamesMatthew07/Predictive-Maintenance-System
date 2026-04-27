# Bridgewater Screen Map

## Purpose

This document locks the Phase 0 information architecture for the Bridgewater predictive maintenance mockup.

It translates the phased plan into a concrete, buildable UI map that:

- feels visibly custom-made for Bridgewater Interiors
- supports a multi-plant executive story
- keeps one primary incident flow simple and demo-friendly
- aligns screen design with the seeded data model

## Product Framing

Working product name:

- `Bridgewater Predictive Maintenance Command Center`

Alternative internal label:

- `BWI Asset Health Console`

Recommended UX framing:

- this is not a generic analytics dashboard
- this is Bridgewater's operational risk and maintenance coordination layer
- the UI should feel like an enterprise operating console for a just-in-time manufacturer

## Visual Direction

### Visual Thesis

Bridgewater's brand shell should feel disciplined, industrial, and executive-ready.

Use:

- brand navy `#12284C` for the application shell
- light blue `#6FB1C8` for active states and controlled emphasis
- white and light neutral surfaces for tables, charts, and workspaces
- semantic operational colors only for health and severity states

### Typography

- `Roboto` for the primary UI language
- `Geist Mono` for telemetry, timestamps, asset IDs, and KPI deltas

### Core Design Rules

- default to a clean application shell, not a marketing homepage
- use real Bridgewater plant names in navigation, selectors, and overview labels
- let the first viewport answer one question per screen
- prefer one dominant surface plus one supporting surface per page
- use drawers and inspector panels for secondary context

## Navigation Model

### Primary Navigation

Recommended left-nav structure:

- `Portfolio`
- `Executive`
- `Operations`
- `Maintenance`
- `Technician`
- `Demo Control`

Recommended utility controls in top bar:

- plant selector
- scenario badge
- time window selector
- last update timestamp
- role indicator

### Route Map

Recommended route tree:

```text
/(app)
  /portfolio
  /executive
  /operations
  /maintenance
  /technician
  /demo-control
  /plants/[plantId]
  /assets/[assetId]
  /work-orders/[workOrderId]
```

Recommended query parameters:

- `plant`
- `line`
- `scenario`
- `window`
- `role`

Example:

```text
/operations?plant=warren-mi&line=seat-line-a&scenario=warren-robotic-welder-thermal-drift
```

## Role Model

### Executive

Primary question:

- Which Bridgewater plant is most exposed right now, and what is the business risk?

### Operations Supervisor

Primary question:

- What line is most likely to stop, and how soon?

### Maintenance Manager

Primary question:

- Which alert should be triaged first, and what action should be assigned?

### Technician

Primary question:

- What exactly do I need to do, in what order, and how do I close the work?

## Screen-by-Screen Map

### 1. `/portfolio`

**Purpose**

Create the strongest first impression for enterprise visibility across all four Bridgewater plants.

**Primary audience**

- executive
- seller or presenter during the opening minute of the demo

**What this screen must answer**

- Where is Bridgewater at risk across the network right now?

**Primary regions**

- portfolio KPI ribbon
- four-plant risk comparison grid or heatmap
- top at-risk assets list
- maintenance backlog summary
- open critical issue rail

**Required content**

- all four plants visible:
  - Detroit
  - Warren
  - Eastaboga
  - Lansing
- plant health rollup
- risk band by plant
- open critical alerts by plant
- projected downtime exposure

**Key interactions**

- click a plant card to open `/plants/[plantId]`
- click a flagged asset to open `/assets/[assetId]`
- switch scenario globally

**Design note**

This should be the most polished screen in the product.

### 2. `/executive`

**Purpose**

Translate operational risk into business impact.

**Primary audience**

- executive leadership
- client stakeholders

**What this screen must answer**

- Why does predictive maintenance matter financially and operationally?

**Primary regions**

- portfolio headline metrics
- projected downtime risk
- avoided downtime estimate
- maintenance backlog pressure
- plant comparison trend
- top 3 executive actions or watchouts

**Required content**

- enterprise health score
- number of critical assets
- projected stoppage window
- avoided downtime hours
- estimated maintenance savings or overtime avoidance

**Key interactions**

- drill from plant summary to plant detail
- click a risk driver to open supporting asset context

**Design note**

This screen should feel boardroom-ready, with less operational clutter than the other pages.

### 3. `/plants/[plantId]`

**Purpose**

Provide a Bridgewater plant-specific operating snapshot.

**Primary audience**

- executive drilling deeper
- operations supervisor
- maintenance manager

**What this screen must answer**

- What is happening inside this specific facility?

**Primary regions**

- plant header with address and supported vehicle programs
- line status summary
- asset health grid
- active alerts
- maintenance queue
- line or asset trend strip

**Required content**

- real plant metadata from Bridgewater public site
- plant-level vehicle program context
- lines within that plant
- flagged assets and predicted stoppage windows

**Key interactions**

- open operations context filtered to the plant
- open maintenance context filtered to the plant
- open asset detail

### 4. `/operations`

**Purpose**

Let operations understand where throughput risk is emerging.

**Primary audience**

- operations supervisor

**What this screen must answer**

- Which line is exposed, which asset is driving the risk, and when do we expect impact?

**Primary regions**

- plant and line filter bar
- line status strip
- at-risk asset list
- current alerts table
- predicted stoppage timeline
- sensor trend visualization

**Required content**

- line health
- estimated stoppage window
- affected asset
- top contributing signals
- severity and escalation status

**Key interactions**

- click an asset row to open asset detail drawer or page
- escalate to maintenance workspace
- compare normal vs degraded trend

**Design note**

This should feel like the operational control surface, with higher data density than the executive view.

### 5. `/maintenance`

**Purpose**

Turn risk signals into concrete maintenance action.

**Primary audience**

- maintenance manager

**What this screen must answer**

- What should be triaged first, why, and who should be assigned?

**Primary regions**

- alert triage list
- selected alert inspector
- asset history panel
- AI explanation panel
- recommended playbook panel
- work-order composer

**Required content**

- alert severity
- contributing telemetry drivers
- latest anomaly and risk scores
- recommended action
- assignee options
- due time and urgency

**Key interactions**

- acknowledge alert
- create work order
- assign technician
- move alert state

**Design note**

This page should be the most workflow-oriented page in the app.

### 6. `/technician`

**Purpose**

Provide a clean task-execution screen with minimal distraction.

**Primary audience**

- technician

**What this screen must answer**

- What do I need to do now, and how do I prove the job is complete?

**Primary regions**

- assigned job summary
- step checklist
- required notes
- verification panel
- completion action

**Required content**

- work-order ID
- asset and plant
- issue summary
- checklist tasks
- estimated duration
- completion and verification controls

**Key interactions**

- start work
- mark checklist items
- add notes
- complete work
- submit verification

**Design note**

This should be the most stripped-down screen in the product and should translate well to tablet width.

### 7. `/assets/[assetId]`

**Purpose**

Show the full story of a single asset.

**Primary audience**

- operations
- maintenance
- presenter when explaining the AI layer

**What this screen must answer**

- Why is this asset flagged, what changed, and what should happen next?

**Primary regions**

- asset header
- health score and risk band
- 24h and 72h failure risk
- sensor trends
- anomaly marker timeline
- explanation panel
- related alerts and work orders

**Required content**

- asset class
- line and plant
- last maintenance event
- trend markers
- explanation driver list

**Key interactions**

- open related work order
- create new work order
- compare healthy vs degraded profile

### 8. `/work-orders/[workOrderId]`

**Purpose**

Provide a focused view of work-order lifecycle and accountability.

**Primary audience**

- maintenance manager
- technician

**What this screen must answer**

- What is the current status of the job and what remains before closure?

**Primary regions**

- work-order summary
- status progression
- assignment block
- task detail
- notes and verification

**Key interactions**

- change status
- reassign
- complete
- verify
- close

### 9. `/demo-control`

**Purpose**

Give the presenter deterministic control over the demo narrative.

**Primary audience**

- presenter only

**What this screen must answer**

- What scenario is active, and how can the story be advanced or reset?

**Primary regions**

- scenario selector
- plant selector
- inject fault controls
- normal vs degraded compare toggle
- reset controls
- optional presenter notes

**Key interactions**

- switch scenario
- reset app state
- jump to hero incident
- preload executive-safe state

**Design note**

This can be more utilitarian than the rest of the app and may be hidden from non-demo users.

## Demo Story Walkthrough

Recommended default live flow:

1. Start on `/portfolio`
2. Show that all four Bridgewater plants are visible
3. Highlight Warren as the highest-risk facility
4. Drill into `/executive` to show financial and operational exposure
5. Move into `/plants/warren-mi`
6. Open `/operations?plant=warren-mi`
7. Show robotic welder degradation and predicted stoppage timing
8. Move into `/maintenance?plant=warren-mi`
9. Create and assign a work order
10. Open `/technician`
11. Complete the task
12. Return to `/executive` or `/portfolio` to show avoided downtime

## Default Hero Scenario

Recommended default primary demo:

- plant: `warren-mi`
- line: `seat-line-a`
- asset: `RW-WAR-01`
- scenario: `warren-robotic-welder-thermal-drift`

Why this is the best hero scenario:

- supports a clean multi-plant to single-asset drill-down
- makes operations impact easy to explain
- gives maintenance and technician screens a natural continuation
- feels credible in a JIT manufacturing context

## Mobile And Tablet Guidance

### Mobile priority

Mobile-friendly first:

- technician
- work order detail
- asset quick view

Desktop-first:

- portfolio
- executive
- operations
- maintenance

### Tablet behavior

- convert multi-column workspaces into stacked sections
- preserve inspector panels as bottom sheets or side sheets
- keep top-level KPIs visible without requiring scrolling past filters

## Implementation Priority

### Must Build First

- `/portfolio`
- `/executive`
- `/operations`
- `/maintenance`
- `/technician`
- `/demo-control`

### Build As Full Pages Or Drawers Depending On Time

- `/plants/[plantId]`
- `/assets/[assetId]`
- `/work-orders/[workOrderId]`

## Acceptance Criteria

Phase 0 screen map is locked when:

- every route has a clear owner and purpose
- the demo walkthrough can be told without improvising navigation
- the seeded data model can populate every required region
- the UI clearly feels like Bridgewater's operating environment rather than a generic template
