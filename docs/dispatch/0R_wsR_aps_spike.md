# WS-R APS spike (dispatch brief)

Objective: de-risk the one real technical unknown by proving the Autodesk Platform Services path end to end on the actual RVT, before WS-1 and WS-4 depend on it. Minimal proof, no product UI.

Runs early, in parallel with WS-1. Depends only on the APS app credentials (the manual portal step: create an APS app under the `mox_demo` hub, get client id and secret, put them in `.env`).

Read first: `README.md`, `docs/property_ground_truth.md`.

Deliverables:
- A script that: authenticates to APS (2-legged OAuth), creates an OSS bucket, uploads `apartment_bldg/Apartments-20260613T130315Z-3-001/Apartments/Working Files/5 Story Apartment.rvt`, starts a Model Derivative job (SVF2 for the viewer plus property/metadata extraction), polls to completion, and prints the model URN.
- A minimal viewer page that loads the URN and renders the model in a browser.
- A dump of the extracted properties (rooms, areas, levels, families) to confirm the metadata is usable for atoms.

Acceptance:
- The viewer renders the 5-story model in a browser.
- The metadata dump shows rooms/units/areas/levels.
- Translation of the full RVT completes; note the timing and any size limits hit.

Guardrails (hard): credentials from `.env` only; never commit secrets; do not commit OSS artifacts or the RVT. The Autodesk account password is not used here.

Hand-off: the URN, the auth/upload/translate script, and the metadata shape feed WS-1 (Part A) and WS-4.
