# WS-2 Engine (dispatch brief)

Objective: build the real engine. Given an intent string, it selects and orders components and populates them from atoms, and it enforces the gate at read. This is the adaptive-assembly core that makes the surface feel adaptive rather than hardcoded.

Depends on: WS-0 (scaffold). Parallel with WS-1: develop against stub atoms, integrate WS-1 fixtures when ready.

Read first: `README.md`, the honesty guardrails in `README.md`.

Deliverables:
- An intent-to-assembly function: an LLM selects and orders components from a registered component catalog for a given intent, and binds each to the atoms that populate it.
- A component catalog/registry: KPI card, provenance drill, variance/anomaly card, action-inbox, unit-twin viewer slot, plan-review findings, investor rollup, renderings panel.
- The gate: filters atoms by `accessPolicy` and product key at read time (follow the hauska-mcp-server pattern, X-Hauska-Key header; a wrong or missing key resolves to public only). Enforces tenant-private versus public partition.
- A read API the frontend calls (intent in, ordered populated components out).
- The deposit-loop write path: accept/edit/reject on a surfaced item records a calibration event and the engine reflects it.

Acceptance:
- A hero intent returns an ordered component set populated from seed atoms.
- The gate permits/denies atoms by `accessPolicy`; a missing key returns public only.
- A deposit-loop action records a calibration event that the engine can reflect.

Guardrails (hard):
- Confidence values are surfaced with their state; never a bare number presented as earned.
- The gate enforces the two-flywheel partition (tenant-private never leaks to a public context).
- Assembly is genuinely engine-driven on the hero intents (rehearsed rails are fine); it is not a hardcoded clickthrough. This is guardrail 4 (surface of the twin, not a trick) at the engine level.

Repos to reference: `hauska-mcp-server` (gate and product-key pattern), `hauska-atom-contract` (atom shapes), `hauska-engine`.
