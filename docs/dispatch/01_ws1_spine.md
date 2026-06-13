# WS-1 Spine (dispatch brief)

Objective: build the data spine. The RVT becomes a spatial twin and a set of atoms; the parcel becomes ground-truth atoms produced by our own substrate; the deal becomes a molecule composing them. Everything downstream reads from this.

Depends on: WS-0 (scaffold). Parallel with WS-2 (engine).

Read first: `README.md`, `docs/property_ground_truth.md`.

### Part A: the building twin (RVT to APS)

1. Create an APS app in the Autodesk developer portal under the `mox_demo` hub (team Empressa Solutions). This yields a client id and secret. Put them in `.env` (APS_CLIENT_ID, APS_CLIENT_SECRET). Never commit them. The Autodesk account password is not used here.
2. Upload `apartment_bldg/Apartments-20260613T130315Z-3-001/Apartments/Working Files/5 Story Apartment.rvt` to an APS OSS bucket. Run Model Derivative: SVF2 for the viewer, plus metadata/property extraction. Record the model URN.
3. Extract rooms, areas, levels, and unit boundaries from the derivative metadata into atoms: one `building` atom, `unit` atoms composed under it (use the floor-plan room names: Bed 1, Bed 2, MSTR, Kitchen, Living, Baths), `level` references.
4. Reuse check first: the portfolio Revit Connector repo may already do RVT-to-data extraction. Prefer reuse over fresh.

### Part B: ground truth from our substrate (the differentiator)

5. Produce the parcel ground truth by calling our own place/parcel/code tools (hauska-engine place tools, the property/parcel engine, the code corpus via hauska-mcp-server), not by scraping or hand-entry. Generate atoms for: the three parcels (resolve all three lots in the listing, Travis CAD parcel 226623 plus the other two), zoning (MF-3 standards), applicable code, flood, and the entitlement finding.
6. The entitlement finding atom is the hero: proposed 5-story exceeds MF-3 (40 ft, 36 units/acre); path is rezoning to MF-4+ or a variance. It must carry the code citation, an as-of date, and a confidence chip in the baseline (provenance-backed) state. Validate against `docs/property_ground_truth.md`.

### Part C: compose

7. Build the `deal` molecule composing the building twin, the unit atoms, seeded pro-forma operating atoms (consistent in naming with the existing mockups), and the ground-truth atoms.

Deliverables:
- Atom fixtures (JSON) in `/data`: building, units, parcels (all three lots), zoning, code, flood, entitlement finding, deal molecule.
- The APS model URN and the extraction scripts.
- A short note on which substrate tools produced which ground-truth atoms.

Acceptance:
- The APS viewer can load the model URN (hand off to WS-4).
- Unit atoms exist with spatial references back to the model.
- All three listing lots are present as parcel atoms (not just one).
- Ground-truth atoms include the MF-3 entitlement finding with a code citation and provenance.
- Every atom carries the contract fields: identity (logical id plus content hash), provenance edges, reasoning, confidence plus state, freshness, and `accessPolicy`. Private operating atoms are `tenant-private`; parcel and code atoms are `public-free` or `public-paid`.

Guardrails (hard):
- Confidence atoms carry their state; nothing presented as earned-calibrated.
- The two-flywheel partition is correct in `accessPolicy`.
- Cite sources on every ground-truth atom.
- Never commit secrets or the heavy assets.

Repos to reference: `hauska-engine` (place/property tools), `hauska-mcp-server` (tool surface), `hauska-atom-contract` (atom shapes), Revit Connector (RVT extraction reuse).
