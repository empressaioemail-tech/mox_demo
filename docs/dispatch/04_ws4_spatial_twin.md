# WS-4 Spatial twin (dispatch brief)

Objective: the spatial twin. The APS viewer on the proposed building, composed with the twin atoms and the ground truth above it. This is the digital twin Miguel asked for, made literal and walkable.

Depends on: WS-1 (unit atoms + URN), WS-R (proven APS path), WS-2 (engine for the side panel).

Read first: `README.md`, `docs/property_ground_truth.md`.

Deliverables:
- An APS viewer embed (SVF2, the URN from WS-1/WS-R) in the frontend.
- Selecting a unit/room loads its `unit` atom.
- A side panel rendering the composed twin: the spatial unit, the (seeded) operating layer, and the ground-truth layer above it (parcel, zoning, code) with provenance chips on every fact.
- The building-level view surfaces the entitlement finding (5-story versus MF-3) reachable from the twin.
- The deposit-loop on a flag in the panel.

Acceptance:
- The model renders in the browser.
- Selecting a room surfaces its unit atom and the composed layers with provenance.
- The MF-3 entitlement finding is reachable from the building level, with its citation.

Guardrails (hard):
- Confidence chips carry state (guardrail 1).
- Provenance on every fact.
- Honest framing: representative data, real engine.

Repos to reference: Revit Connector (RVT extraction reuse, shared with WS-1), `hauska-atom-contract`.
