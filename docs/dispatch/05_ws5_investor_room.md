# WS-5 Investor room + plan review (dispatch brief)

Objective: the apex surface. A provenance-backed investor/data room for the Nelray deal, with the plan review embedded, using the real renderings. This is where our property intelligence visibly enhances the application and de-risks the deal, and where the "land more investors" thesis lands.

Depends on: WS-1 (atoms, ground truth, the entitlement finding), WS-2 (engine), the findings/plan-review engine from `legacy-design-tools`, the property/parcel/code intel from `hauska-engine`.

Read first: `README.md`, `docs/property_ground_truth.md`.

Deliverables:
- A data-room surface for the deal: hero renderings (from `apartment_bldg/.../Renderings/` and the exterior elevations), the underwrite/return summary (seeded pro-forma) with every number carrying a provenance chip and a clickable lineage down to its source atom.
- The entitlement and plan-review section: the MF-3 finding (5-story exceeds 40 ft / 36 units per acre, path is rezone to MF-4+ or variance) plus the proposed-building review against Austin code, rendered as cited findings with accept/edit/reject (like the BLDR mockup `mox_html_original/mox_05_build.html`).
- The "what an LP gets" framing: this is what you hand an LP instead of a static PDF, with the code risk already vetted.

Acceptance:
- Every headline number drills to its source atom.
- The plan-review findings render with code citations; the MF-3 entitlement finding is present and prominent.
- Renderings are present and carry the deal.
- The honesty framing is visible: a generated, cited artifact.

Guardrails (hard):
- Generated, cited artifact only; do not imply the live, revocable LP data room ships today (guardrail 3).
- Confidence chips carry state (guardrail 1).
- The entitlement finding carries a code citation and an as-of date.
- We provide the provenance infrastructure; the GP (Mox) makes the representations. Do not present the surface as certifying returns.

Repos to reference: `legacy-design-tools` (findings/plan-review engine), `hauska-engine` (property/parcel/code), `hauska-atom-contract`.
