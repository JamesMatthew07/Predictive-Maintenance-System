# Predictive Maintenance Mockup Phased Plan

## 1. Executive Summary

This mockup should be treated as a high-fidelity product demo for Bridgewater Interiors, not as the first cut of a production platform.

The best implementation shape for this scope is:

- `Next.js 16` frontend-first app
- `Tailwind CSS` + `shadcn/ui` for the design system and UI primitives
- local dummy data and seeded scenario state inside the app
- `Vercel` as the default deployment target
- `OpenAI` used only where it improves demo credibility without reducing predictability

Primary outcome:

- tell one strong story from early signal detection to maintenance action to avoided downtime

Recommended demo scope:

- enterprise view spanning Bridgewater Interiors' four public U.S. facilities
- one primary hero incident flow, plus healthy or rising-risk context in the other plants
- `6-8` demo assets across the network while keeping asset classes intentionally narrow
- core asset classes still anchored on conveyor, robotic welder, and hydraulic press
- four role perspectives: executive, operations supervisor, maintenance manager, technician
- official Bridgewater branding carried through the product shell, favicon, login/loading states, and executive presentation surfaces

## 2. Mockup Product Thesis

The product should feel like a modern industrial command center: calm, precise, and operationally credible.

It should communicate three ideas immediately:

1. the system can see risk before failure
2. different teams act on the same shared operating picture
3. AI helps prioritize and explain, but does not replace human maintenance judgment

### Bridgewater-Specific Inputs From The Public Website

Use the public Bridgewater site as the source for company framing, brand direction, and plant metadata.

Key company details to reflect in the mockup:

- founded in `1998`
- originally formed as a joint venture between `Epsilon Technologies` and `Johnson Controls`
- public site now references the joint venture with `Adient`
- described publicly as a leading U.S. automotive seating manufacturer
- specializes in `just-in-time (JIT)` manufacturing, sequencing, and delivery
- product categories called out publicly:
  - seating systems
  - overhead systems
  - center console systems
- public site positions Bridgewater as a certified `Minority Business Enterprise (MBE)` and one of the country's larger MBEs
- public site references approximately `2,400` employees across four facilities in two states

Important website consistency note:

- the homepage currently references `15` distinct car models
- the current About page references `11` different vehicle models
- for the mockup, use the per-plant vehicle lists on the Contact page as the most concrete plant-level source of truth, and treat the executive summary vehicle-count metric as configurable copy pending direct client confirmation

## 3. UX Direction

### Visual Thesis

Build a restrained, high-signal operations interface that feels clearly custom-made for Bridgewater Interiors rather than a generic SaaS dashboard.

Recommended design direction:

- shadcn/ui `new-york` style as the UI foundation
- Bridgewater's public web palette as the brand layer
- `Roboto` for main UI text to stay visually aligned with the existing public site
- `Geist Mono` or another clean mono face for telemetry, timestamps, IDs, and AI/risk metrics
- a mostly light application shell with brand navy used for global chrome, navigation, and executive framing
- semantic operational colors layered on top of the brand palette only where state clarity demands it

### Brand Adaptation From `bridgewater-interiors.com`

Publicly visible brand references captured from the live site:

- primary navy: `#12284C`
- secondary light blue: `#6FB1C8`
- primary white: `#FFFFFF`
- light neutral surface: `#F4F6F6`

Recommended application of those colors:

- use `#12284C` for sidebar, top navigation, executive summary bands, critical headers, and branded backgrounds
- use `#6FB1C8` for active tabs, accent lines, selected states, empty-state illustration accents, and controlled highlight surfaces
- use white and light neutral surfaces for charts, grids, work-order tables, and maintenance workspaces
- reserve amber, red, and green strictly for operational state semantics so the product stays both branded and readable

Official public brand assets to reference in implementation:

- logo white: `https://bridgewater-interiors.com/wp-content/uploads/2023/03/logo-white.png`
- logo blue: `https://bridgewater-interiors.com/wp-content/uploads/2023/03/logo-blue.png`
- favicon 32x32: `https://bridgewater-interiors.com/wp-content/uploads/2020/06/cropped-BWI_Site-Icon-v1-32x32.png`
- app icon 192x192: `https://bridgewater-interiors.com/wp-content/uploads/2020/06/cropped-BWI_Site-Icon-v1-192x192.png`
- apple touch icon 180x180: `https://bridgewater-interiors.com/wp-content/uploads/2020/06/cropped-BWI_Site-Icon-v1-180x180.png`

### Interaction Thesis

Use a small number of meaningful interactions:

- scenario toggles that visibly shift metrics, charts, and risk states
- timeline and trend motion that makes degradation feel progressive
- drill-in panels and drawers for asset detail, alert context, and work-order actions

### UI Composition Rules

- avoid homepage-style hero sections on core app pages
- avoid dashboard-card overload; use layout, charts, tables, split panels, and status strips
- keep copy operational and utility-first
- prefer 1-2 dominant surfaces per screen instead of many small widgets
- maintain strong hierarchy between plant summary, line risk, asset status, and action items
- keep the first viewport understandable in under 5 seconds

### Design System Recommendations

Use shadcn primitives as the basis for consistency:

- `Sidebar`, `Tabs`, `Table`, `Badge`, `Dialog`, `Sheet`, `AlertDialog`, `Popover`, `Tooltip`, `Separator`, `ScrollArea`, `Skeleton`
- shadcn chart patterns with `Recharts` for trend and risk visualization
- shared status tokens for `healthy`, `watch`, `warning`, `critical`, `stale`, `completed`

## 4. Mockup Architecture Recommendation

Because this is a controlled mockup, do not start with Supabase, Render, or a separate backend service.

Recommended architecture:

- App Router application in Next.js
- all seed data, scenarios, and rules stored locally in `lib` or `data`
- a small client-side or server-side scenario engine that mutates visible state
- optional mock API routes only if they help preserve a realistic contract
- optional OpenAI-backed explanation endpoint, with deterministic fallback copy
- a shared plant portfolio store that can power multi-plant executive views and plant-specific operational drill-ins without needing backend persistence

Recommended module layout:

```text
app/
  (app)/
    executive/page.tsx
    operations/page.tsx
    maintenance/page.tsx
    technician/page.tsx
    demo-control/page.tsx
    assets/[assetId]/page.tsx
components/
  layout/
  charts/
  alerts/
  assets/
  work-orders/
  demo/
lib/
  types/
  brand/
  plants/
  mock-data/
  scenarios/
  scoring/
  ai/
  utils/
```

### Bridgewater Plant Footprint To Model

Use the public locations and vehicle programs directly in seeded plant metadata.

| Plant | Public Label | Address | Supported Vehicles Listed Publicly |
| --- | --- | --- | --- |
| `detroit-hq` | Headquarters - Detroit, Michigan | 4617 W Fort St., Detroit, MI 48209-3208 | Ram Classic |
| `warren-mi` | Warren, Michigan | 7500 Tank Avenue, Warren, MI 48092-2707 | Ford F-150, RAM 1500 |
| `eastaboga-al` | Eastaboga, Alabama | 1 Bridgewater Dr., Eastaboga, AL 36260 | Honda Pilot, Honda Passport |
| `lansing-mi` | Lansing, Michigan | 2369 S Canal Rd., Lansing, MI 48917-8589 | Buick Enclave, Cadillac CT4, Cadillac CT5, Chevy Camaro |

Recommended mockup shape:

- all four plants visible in executive and portfolio views
- one primary plant in active degraded state during the demo
- one or two plants in `watch` state to show prioritization
- one plant fully healthy to provide contrast

## 5. AI Strategy For The Mockup

The AI layer should feel real, but remain stable and explainable during demos.

### Recommended split

- deterministic core logic:
  - anomaly score
  - health score
  - 24h and 72h failure risk
  - alert thresholds
  - recommended action by asset type and failure mode
- OpenAI-assisted explanation layer:
  - convert structured drivers into plain-language rationale
  - summarize why the asset was flagged
  - frame likely impact and next best maintenance action

### Important guardrail

Do not let live LLM output determine risk, alert state, or work-order creation.

Instead:

- use structured scoring as the source of truth
- pass stable structured inputs into OpenAI only for narrative explanation
- cache or pre-generate explanation outputs by scenario when possible
- keep a deterministic fallback if the model call is unavailable

### Example explanation input

- asset type
- scenario name
- top contributing signals
- latest health score
- latest anomaly score
- 24h/72h risk band
- recommended playbook

## 6. Phase Overview

| Phase | Focus | Estimated Duration | Main Outcome |
| --- | --- | --- | --- |
| 0 | Scope lock and storyboarding | 2-3 days | One approved demo story and information architecture |
| 1 | Foundation and design system | 3-4 days | Working app shell, theme, routes, and typed mock domain |
| 2 | Scenario engine and intelligence layer | 4-5 days | Seeded telemetry, scoring, alerts, and controllable scenarios |
| 3 | Dashboard and role surfaces | 5-7 days | Executive and operations views feel demo-ready |
| 4 | Maintenance and technician workflow | 4-5 days | End-to-end action flow from alert to completed work order |
| 5 | Demo controls, AI explanations, and value story | 3-4 days | Strong narrative support and polished demo interactions |
| 6 | QA, deployment, and demo packaging | 2-3 days | Stable Vercel deployment and rehearsal-ready demo |

Total recommended timeline: about `3-4 weeks` for a polished mockup, depending on design depth and revision cycles.

## 7. Detailed Phase Plan

### Phase 0 - Scope Lock And Demo Storyboarding

**Objective**

Lock the exact story, assets, personas, screens, and success criteria before implementation starts.

**Workstreams**

- Product / PM
  - confirm whether the mockup should represent all four public Bridgewater plants from day one
  - confirm plant, line, and naming convention for the demo
  - choose the primary hero plant and hero scenario for the client walkthrough
  - define the 5-7 minute demo sequence and who says what
  - agree on what must be interactive versus what can be static
- UX
  - map route structure and primary navigation
  - define screen hierarchy for executive, operations, maintenance, technician, and demo control
  - capture visual direction, palette, type system, spacing density, and status language
  - capture the Bridgewater-specific brand rules for logo use, favicon use, app icon use, and palette treatment
- Engineering
  - lock mockup architecture and folder structure
  - define shared TypeScript types for assets, telemetry, alerts, work orders, scenarios, and users
  - define plant metadata shape for the four public facilities and their vehicle programs
- AI
  - define the scoring model inputs and outputs
  - define explanation payload schema and deterministic fallback behavior

**Deliverables**

- approved demo narrative
- route map
- data model map
- Bridgewater brand reference sheet
- plant portfolio matrix
- scenario list
- low-fidelity screen inventory
- design direction note

**Exit Criteria**

- everyone agrees what the mockup is and what it is not
- there is one primary end-to-end story
- all core screens are named and justified

### Phase 1 - Foundation And Design System

**Objective**

Stand up the app shell, interaction framework, and reusable UI foundations.

**Workstreams**

- Frontend Engineering
  - initialize `Next.js 16` app structure
  - configure Tailwind and shadcn/ui
  - create the global layout shell, sidebar, top bar, and page containers
  - implement route scaffolds for all main screens
  - set up mock domain types and local data modules
  - integrate official Bridgewater logo and favicon references into the shell plan
- UX / UI
  - define theme tokens for background, panel, border, text, and semantic states
  - map Bridgewater navy and light blue into the app token system
  - create page templates for dashboard, detail, workspace, and mobile task views
  - establish chart, badge, alert, and table patterns
- Product
  - define role-based navigation differences
  - define persistent global controls such as plant, line, scenario, and time window filters
  - define how multi-plant executive context hands off to plant-specific operational workflows

**Deliverables**

- working app shell
- reusable layout and state components
- typography and color token system
- Bridgewater-branded app chrome
- route-level skeleton screens
- shared component usage rules

**Exit Criteria**

- all core routes exist and are navigable
- design system feels coherent and modern
- no production backend is required to continue

### Phase 2 - Scenario Engine And Intelligence Layer

**Objective**

Build the mock data engine that makes the experience believable and controllable.

**Workstreams**

- Data / AI Engineering
  - create seeded telemetry for each asset under normal and degraded conditions across the Bridgewater plant network
  - define scenarios such as:
    - portfolio baseline healthy
    - Detroit conveyor bearing wear
    - Warren robotic welder thermal drift
    - Eastaboga hydraulic pressure instability
    - Lansing backlog and risk accumulation
  - implement scoring functions for:
    - health score
    - anomaly score
    - failure probability 24h
    - failure probability 72h
  - implement alert logic and severity bands
  - map each risk pattern to a deterministic maintenance playbook
- Frontend Engineering
  - wire scenario changes into charts, KPI tiles, status bands, and alert tables
  - create a small state engine for scenario switching and fault injection
  - persist selected scenario in URL params or app state for shareable demo links
  - ensure executive and plant-level views can read the same scenario state without duplication
- Product / PM
  - define business-friendly labels for all statuses and AI outputs
  - ensure metric changes are obvious enough for a demo audience
  - define how plant-level vehicle and asset context appears without overwhelming the UI

**Deliverables**

- seeded telemetry fixtures
- scenario definition schema
- scoring utilities
- alert generation utilities
- shared scenario state manager

**Exit Criteria**

- switching scenarios updates the app consistently
- degraded conditions clearly surface before failure
- outputs look credible but remain deterministic

### Phase 3 - Dashboard And Role Surfaces

**Objective**

Make the executive and operations surfaces polished enough to anchor the demo.

**Workstreams**

- Executive Dashboard
  - enterprise portfolio KPIs
  - four-plant comparison strip or heatmap
  - open critical issues
  - downtime risk snapshot
  - maintenance backlog summary
  - optional avoided-downtime value summary
- Operations Dashboard
  - plant switcher or plant context selector
  - line status strip
  - at-risk assets list
  - current alerts
  - predicted stoppage window
  - timeline or trend chart with visible deterioration
- Shared UX
  - clear drill-down from KPI to asset or alert detail
  - clear drill-down from enterprise portfolio -> plant -> line -> asset
  - responsive layout behavior for laptop and tablet widths
  - consistent timestamp, state, and severity formatting

**Recommended screen acceptance**

- executive view answers "Which Bridgewater plant is most at risk and what is the business impact?"
- operations view answers "What line in this plant is exposed and what will stop first?"
- the user can move from overview to asset detail in 1-2 interactions

**Deliverables**

- executive dashboard
- operations dashboard
- asset detail drill-in patterns
- responsive chart and table states

**Exit Criteria**

- the first half of the demo can be delivered entirely through these screens
- the visual quality is client-facing, not placeholder-level

### Phase 4 - Maintenance Workspace And Technician Flow

**Objective**

Show how insight turns into action.

**Workstreams**

- Maintenance Workspace
  - alert triage queue
  - asset health history
  - explanation panel
  - recommended action or playbook
  - work-order creation and assignment flow
- Technician Flow
  - assigned work-order detail
  - checklist items
  - notes and verification fields
  - completion state and post-fix confirmation
- UX / PM
  - keep the maintenance flow grounded in real plant behavior
  - avoid overcomplicating with CMMS-like administration

**Recommended interactions**

- select alert -> open asset context drawer or detail page
- create work order from alert
- assign technician
- technician moves order from `assigned` to `in_progress` to `completed`
- verification updates asset state to recovered or stabilized

**Deliverables**

- maintenance workspace
- work-order composer
- technician task screen
- end-to-end work-order state transitions

**Exit Criteria**

- the second half of the demo shows a complete operational response
- the system clearly demonstrates avoided breakdown, not just warning generation

### Phase 5 - Demo Controls, AI Explanations, And Value Story

**Objective**

Add the controls and presentation layers that make the demo repeatable and persuasive.

**Workstreams**

- Demo Controls
  - scenario selector
  - plant selector
  - inject-fault control
  - replay or compare mode for normal vs degraded behavior
  - reset demo state
- AI Explanation Layer
  - structured explanation panel for why an asset is flagged
  - OpenAI-based narrative explanation from stable structured inputs
  - deterministic fallback explanation text
- Value Story
  - avoided downtime estimate
  - maintenance backlog effect
  - simple ROI widget
  - optional notification or escalation preview
  - multi-plant portfolio impact summary so leadership can see why this matters beyond one line

**Deliverables**

- demo control panel
- AI explanation experience
- business value widgets
- reset and replay behavior

**Exit Criteria**

- presenters can control the narrative during live demos
- AI feels useful and credible, not magical or unstable
- business value is visible by the end of the walkthrough

### Phase 6 - QA, Deployment, And Demo Packaging

**Objective**

Harden the mockup for live presentation and internal review.

**Workstreams**

- Quality
  - verify all scenario transitions
  - verify no broken loading, empty, or edge states
  - check responsive behavior on common laptop and tablet breakpoints
  - check accessibility for color contrast and focus states
- Performance
  - keep initial route loads snappy
  - ensure chart rendering and scenario toggles feel immediate
  - reduce any visible layout shift during navigation
- Deployment
  - configure environment variables for any OpenAI usage
  - deploy to Vercel
  - verify production build integrity
- Demo Packaging
  - create a presenter script
  - create a reset procedure before each meeting
  - prepare a backup deterministic mode in case AI output is disabled

**Deliverables**

- stable Vercel deployment
- QA checklist completion
- presenter script
- fallback demo mode

**Exit Criteria**

- team can rehearse the demo repeatedly without drift
- the app is stable enough for client-facing sessions
- there is a clear recovery path if a live AI call fails

## 8. Core Screen List

Recommended route map:

- `/portfolio`
- `/executive`
- `/plants/[plantId]`
- `/operations`
- `/maintenance`
- `/technician`
- `/demo-control`
- `/assets/[assetId]`
- `/work-orders/[workOrderId]` or drawer-based detail

## 9. Suggested Scenario Set

Keep the scenario count small and intentional, but make sure each one reinforces Bridgewater's real plant footprint.

### Scenario 1 - Portfolio Baseline Healthy

- all four plants visible
- all priority assets operating in normal range
- no critical alerts
- used to establish trust, enterprise visibility, and comparison

### Scenario 2 - Detroit Conveyor Bearing Wear

- vibration and temperature drift upward
- risk rises gradually
- tied to the Detroit headquarters plant context
- useful for showing early detection in a familiar plant with executive visibility

### Scenario 3 - Warren Robotic Welder Thermal Drift

- current draw and temperature instability
- operations impact becomes obvious
- useful for the line stoppage timing story
- strong candidate for the primary hero incident because it ties well to multi-plant executive-to-operations drill-down

### Scenario 4 - Eastaboga Hydraulic Pressure Instability

- pressure variance and cycle irregularity
- good secondary scenario for maintenance workspace depth

### Scenario 5 - Lansing Backlog Pressure

- no single asset fully failed yet
- multiple warning-state assets and growing maintenance backlog
- useful for showing prioritization and portfolio-level tradeoffs

## 10. Recommended Tracking Metrics

Use these as mockup success checks:

- user can understand the product in under 2 minutes
- first risk signal is visible before a failure event
- demo can move from alert to work order to completion in under 5 clicks per role
- scenario switch updates all major screens in under 1 second perceived time
- AI explanation is readable in under 20 seconds
- value story is explicit by the end of the demo

## 11. Key Risks And Mitigations

### Risk: the project becomes backend-heavy

Mitigation:

- keep data local by default
- only add mock API layers when they improve realism or code organization

### Risk: AI output feels inconsistent during demos

Mitigation:

- keep scoring deterministic
- use OpenAI only for explanation language
- cache or pre-generate outputs for known scenarios

### Risk: the mockup feels generic instead of Bridgewater-specific

Mitigation:

- use official public logo and favicon assets
- use the public Bridgewater navy and light-blue palette in the shell
- use real plant names, addresses, and vehicle programs in seeded data and selectors
- reflect public Bridgewater language such as JIT delivery, MBE leadership, and #MoreThanSeats only where it supports the story

### Risk: public website facts are not fully internally consistent

Mitigation:

- prefer the Contact page for plant and vehicle-program specifics
- keep aggregate company metrics configurable in seed data
- flag the `15 models` vs `11 models` discrepancy for client confirmation before final demo polish

### Risk: screens become generic dashboard mosaics

Mitigation:

- anchor each screen around one dominant decision-making surface
- reduce unnecessary cards and decorative UI
- keep copy operational, not marketing-heavy

### Risk: too many scenarios dilute the story

Mitigation:

- pick one primary hero scenario and 2-3 backups
- optimize for one convincing workflow while keeping the other Bridgewater plants visible as context

## 12. Final Recommendation

Build this mockup in phases, but optimize every phase around the same question:

"Will this make the live client demo clearer, more credible, and easier to control?"

For this specific engagement, add a second filter:

"Will this feel unmistakably like Bridgewater Interiors rather than a generic manufacturing demo?"

If the answer to either question is no, it likely belongs in a future production plan rather than this mockup.
