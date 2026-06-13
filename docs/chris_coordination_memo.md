# Coordination memo for Chris (and his agent)

> Read this first. It orients you to the repo, the division of labor, and the few things that are fixed versus the wide space that is Chris's to shape. Chris is the product designer; the build fleet provided the framework and the function, and Chris leans heavily on the adaptive UI to make it feel like the real thing.

## What this repo is

`mox_demo` is a lightly functional, real-engine demo for Mox, a vertically integrated Austin multifamily operator. It shows what the Hauska/Mox stack does and, to a degree, what the adaptive interface feels and acts like. It is a sales artifact, not a product build, but the engine underneath is real and the data is representative (a real Austin redevelopment, the Nelray project).

## Read order

1. `README.md` — the build plan, architecture, surfaces, and the six honesty guardrails.
2. `docs/demo_run_sheet.md` — the demo-day script: the five beats, the framing lines, the confidence-chip states. This is the narrative spine.
3. `docs/adaptive_ui_vision.md` — the adaptive UI vision Chris leans on. The centerpiece.
4. `docs/property_ground_truth.md` — the real parcel, zoning, the entitlement finding, the asset inventory.
5. `mox_html_original/` — the six existing mockups. This is the visual starting point and the design language (charcoal and white, Mox brand, the component patterns). Elevate from here.
6. `docs/dispatch/` — one brief per workstream, describing what each surface does and which data backs it.

## The division of labor

The build fleet (a separate orchestrated set of agents) builds the function: the scaffold, the data spine (Revit to spatial twin, ground truth from our substrate), the engine (intent to component assembly), and the surfaces. Chris and his agent own the design: the look, the motion, the component aesthetics, and above all the feel of the adaptive interface. In short, we provided the framework; Chris makes it feel inevitable.

Practically, that means Chris's agent works the frontend design layer: the component library, the adaptive command choreography (how components assemble, reflow, and recede as intent changes), the provenance and confidence chips, the deposit-loop interaction, the spatial-twin panel, and the investor room. Coordinate with the build fleet on branch hygiene so design polish and function do not collide; design against the component contracts the engine produces.

## What is fixed (do not change without checking with Nick)

- The six honesty guardrails in `README.md`. These are hard. Most relevant to design: every number carries a confidence chip with its state (everything is `baseline · provenance-backed` in this demo, never shown as earned-calibrated); the investor room reads as a generated, cited artifact, not a live LP portal; the Yardi layer reads as riding over Yardi, never replacing it.
- The narrative arc and the five beats in `docs/demo_run_sheet.md`. The framing lines (open, transition, close) are verbatim. Design serves this arc; it does not rewrite it.
- The Mox brand and the real data (the Nelray deal, the entitlement finding, the renderings).

## What is Chris's canvas (lean in here)

- The adaptive command surface and the choreography of assembly. This is the centerpiece. Make intent-to-interface feel fluid and alive, like intelligence living in the workspace.
- The component design system. The mockups are the floor, not the ceiling. Refine the cards, the chips, the drills, the inbox, the twin panel, the investor room into a coherent, elevated language.
- Motion, hierarchy, and the feel of confidence and provenance being first-class rather than decorative.
- The spatial twin experience (the APS viewer plus the composed panel) and the investor room, where the renderings carry the deal.

## The one thing to internalize

The adaptive UI is the product's soul, and it is the thing Mox could not picture from words in the first meeting. The demo's job is to let them feel it. Chris's design is what turns "they described something" into "I get it now." Everything else in this repo exists to give that feeling something real to stand on.

## Suggested kickoff for Chris's agent

"Read docs/chris_coordination_memo.md, then README.md, docs/demo_run_sheet.md, and docs/adaptive_ui_vision.md, then study mox_html_original/ as the design language. I am the product-design layer for this Mox demo. Propose a design pass on the adaptive command surface and the component system that elevates the mockups while honoring the honesty guardrails and the five-beat run sheet. Show me the plan before building."
