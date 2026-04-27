# Bridgewater Mockup Presenter Script

## Goal

Tell one clean story:

1. Bridgewater can see equipment risk before failure.
2. Different teams share the same operating picture.
3. Action happens before downtime hits the plant.

## Recommended 5-7 Minute Flow

### 1. Open on `/portfolio`

Say:

- "This is a Bridgewater-specific operating picture across Detroit, Warren, Eastaboga, and Lansing."
- "We are not starting from a single asset screen. We are starting from network prioritization."
- "Warren is intentionally leading the story because its robotic welder is approaching a likely stoppage window inside the next shift."

Point out:

- four public plants
- Warren as the highest-risk facility
- top at-risk asset list
- avoided single vehicle-count KPI because public site counts conflict

### 2. Move to `/executive`

Say:

- "This is where the operational story becomes a business story."
- "The numbers are incident-sized and believable, not inflated enterprise vanity metrics."
- "The goal is to show protected value, avoided downtime, and maintenance prioritization."

Point out:

- projected downtime
- protected value
- exposure by plant
- executive actions

### 3. Move to `/operations`

Say:

- "Operations needs to know what line is exposed and when the buffer disappears."
- "The Warren Seat Line A story is driven by thermal rise, current instability, and slower cycle time on RW-WAR-01."

Point out:

- line switcher
- predicted stoppage window
- live vs compare mode
- current alerts table

### 4. Move to `/maintenance`

Say:

- "Maintenance now takes the signal and turns it into action."
- "The explanation stays deterministic so the story is stable in a live client meeting."
- "We assign the work before failure, not after downtime."

Action:

- create and assign the Warren work order if it is not already active

Point out:

- triage queue
- explanation panel
- work-order composer
- playbook and recommended action

### 5. Move to `/technician`

Say:

- "This view is stripped down on purpose so a technician can work from a tablet or mobile device."
- "The workflow is checklist-first, with notes and verification in one place."

Action:

- move the work order through `in progress`
- then `completed`
- then `verified`

### 6. Return to `/executive`

Say:

- "Now the story resolves."
- "The risk compresses, the value shifts from at-risk to protected, and leadership sees what was prevented."

Point out:

- reduced downtime exposure
- protected value state
- stabilized Warren plant status

## Backup Scenario Options

- `Detroit Conveyor Bearing Wear`: softer early-warning story
- `Eastaboga Hydraulic Pressure Instability`: maintenance-focused explanation story
- `Lansing Backlog Pressure`: prioritization story without one catastrophic failure

## Demo Control Tips

- Use `/demo-control` if you need to reset or jump the story stage quickly.
- If the audience wants a different example, switch scenarios there and return to `/portfolio`.
- If time is short, cut straight from `/portfolio` to `/maintenance` and then `/executive`.
