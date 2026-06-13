# mox_demo

A lightly functional, real-engine demo for Mox. It shows what the Hauska/Mox stack does and, to a degree, what the adaptive interface feels and acts like. Function first (operator plus a multi-agent execution pass); design refinement is handed to Chris once function and content land.

The full strategic build plan lives in the doc set at `_prospects/mox/2026-06-13_mox_demo_build_plan.md`. This README is the operational version for builders.

## The demo in one paragraph

A single adaptive surface, Mox branded, seeded from a real Revit model of a real Austin redevelopment the operator controls, running a real engine on representative data. The viewer expresses intent ("show me this deal", "vet the proposed building", "open a unit", "generate the LP view") and the interface assembles the relevant components live, every number carrying its provenance and confidence. It opens on Yardi (untouched, an intelligence layer riding on top) to kill the rip-and-replace fear, pulls back to the spatial twin and the command surface, and closes on the investor room where our property intelligence visibly de-risks the deal. Bar: best foot forward, feels and acts like the real thing to a degree. Chris refines design after function lands.

## The real asset (drives the hero surfaces)

607-611 Nelray Blvd, Austin TX 78751 (North Loop). A ground-up redevelopment: 0.56 acres, three contiguous MF-3 lots, currently two duplexes and a single-family home, listed at $2.2M. The RVT is the proposed 5-story building. Full parcel, zoning, entitlement, and asset detail in `docs/property_ground_truth.md`. The operating beats (the leak, repair-history, monthly close) are shown on the existing six mockups as context, not forced onto a building that does not exist yet.

The hero finding: a proposed 5-story building on MF-3 land, which caps at 40 feet and 36 units/acre. Our system flags the entitlement gap (rezoning to MF-4+ or a variance) before submission. This is the property intelligence enhancing the application, on real data.

## Repo structure (target)

```
/frontend        Next.js app, deployed on Vercel. Adaptive surface, component library, APS viewer, context surfaces.
/backend         Engine (LLM component assembly + gate) and atom store. Runs local or low-lift VM.
/data            Seed atom fixtures (building, units, operating, ground truth, deal molecule).
/assets          Pointers to the RVT and renderings (the heavy files live under apartment_bldg/, gitignored).
/docs            Build plan, property ground truth, per-workstream dispatch briefs.
```

Source RVT: `apartment_bldg/Apartments-20260613T130315Z-3-001/Apartments/Working Files/5 Story Apartment.rvt`. Renderings, elevations, floor plans, schedules, and the structural PDF are in sibling folders (see `docs/property_ground_truth.md` for the inventory). These heavy files are gitignored; do not commit them.

## Architecture

- Frontend: Next.js on Vercel.
- Backend: engine plus atom store, local or VM, exposes the engine and a read API.
- Engine: real LLM component assembly plus the gate, consuming `@hauska/atom-contract` types.
- Twin: RVT to Autodesk Platform Services (APS) Model Derivative (SVF2 for the viewer, metadata for the data).
- Secrets: APS app client id and secret, and the LLM key, live in an untracked `.env`. Never commit secrets. The Autodesk account password is never used by the API and is never stored anywhere.

## Surfaces

Hero (live, real engine, on the Nelray model):
- Adaptive command (the intent bar plus assembler).
- Intelligence layer on Yardi (overlay on screenshots, read plus assist plus capture).
- Spatial twin (APS viewer on the RVT plus twin atoms).
- Investor / data room (provenance rollup with the plan review embedded, using the renderings).

Context (navigable, seeded static, near free): the six existing mockups, now in this repo at `mox_html_original/` (command center, Manage, Invest, BLDR, extension, flywheel).

## Workstreams (dependency order, no timelines)

Briefs in `docs/dispatch/`. Dispatch order: WS-0 first; then WS-1 and WS-2 in parallel; WS-3/4/5 gate on those; WS-6 can run early off WS-0; WS-7 threads throughout; WS-R (APS spike) runs early in parallel.

WS-0 Scaffold, WS-1 Spine, WS-2 Engine, WS-3 Adaptive command + Yardi layer, WS-4 Spatial twin, WS-5 Investor room + plan review, WS-6 Context surfaces, WS-7 Narrative + honesty, WS-R APS spike.

## Honesty guardrails (hard build constraints, premortem-cleared 2026-06-13)

1. Confidence shown with its state visible (baseline, provenance backed, not yet calibrated on Mox outcomes). No bare numbers presented as earned.
2. The deposit-loop moment shows the earning loop is live, not that displayed numbers are already calibrated.
3. The investor room shows a generated, cited artifact, not the live revocable LP umbilical (gated on the auth build).
4. The intelligence layer on Yardi is the surface of the twin, not DOM scraping.
5. Opening framing: "The engine is real. The data is representative, shaped like yours. Wiring it to your Yardi is what the first phase does."
6. No promise of live bidirectional Yardi automation. Read plus assist plus capture only; write-back is a roadmap item gated on a licensed interface.

## Run locally (WS-0)

Prerequisites: Node 18.18+, npm. Copy `.env.example` to `.env` and fill keys when available (not required for scaffold health checks).

```bash
# Backend (port 8787)
cd backend
npm install
npm run dev

# Frontend (port 3000) — separate terminal
cd frontend
npm install
npm run dev
```

Verify:

- Backend health: `curl http://localhost:8787/health`
- Frontend: `http://localhost:3000`
- Typecheck: `npm run typecheck` in both `frontend/` and `backend/`

## Deploy frontend (Vercel)

Root directory: `frontend/`. Framework preset: Next.js. Set `NEXT_PUBLIC_BACKEND_URL` to the deployed backend URL when WS-2+ wire the read API.

```bash
cd frontend
npx vercel
```
