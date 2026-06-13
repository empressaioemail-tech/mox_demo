# Property ground truth: 607-611 Nelray Blvd

> The real asset behind the demo. This is the verified seed and validation set. WS-1 should regenerate this ground truth through our own place and code substrate (the Hauska place/parcel/code tools), not by hand. That regeneration, with provenance and confidence on every atom, is the differentiation proving itself. This doc is what the substrate output is checked against. Every factual claim here carries a source.

## The deal

- Address: 607-611 Nelray Blvd, Austin, TX 78751. Neighborhood: North Loop.
- Type: ground-up redevelopment. Currently two duplexes and one single-family home, fully leased. Listed at $2,200,000 as a redevelopment opportunity (listed Aug 2024).
- Land: 0.56 acres, 24,477 sq ft, three contiguous lots.
- Zoning: MF-3 (Multifamily Residence Medium Density).
- The proposed building: the RVT in this repo, a 5-story apartment building.

Source: [Rocket Homes listing 607-611 Nelray](https://rocket.com/homes/listings/607-611-nelray-blvd-austin-tx-78751), [LoopNet 611 Nelray property record](https://www.loopnet.com/property/611-nelray-blvd-austin-tx-78751/48453-226606/).

## Parcels (all lots in the listing must be in the plan)

The listing spans three contiguous lots (607, 609/611 Nelray). One Travis CAD parcel is confirmed as geographic ID 226623 (the operator-provided Travis CAD link). The remaining two parcel IDs are a WS-1 task: pull them via our place/parcel substrate (resolve_place / get_place_dossier) so all three lots are represented as parcel atoms, then assemble them into the site for the deal molecule. Do not ship the deal with only one lot.

Source: operator-provided Travis CAD property detail (parcel 226623); Travis Central Appraisal District.

## Zoning standards: MF-3 (verified headline, full pull is a WS-1 substrate task)

- Maximum height: 40 feet.
- Maximum density: 36 units per acre (so roughly 20 units on 0.56 acres before bonuses).
- FAR, building coverage, impervious cover, and setbacks: pull from the code via our substrate (Austin LDC site development regulations). Do not hand-assert these; the point is that the substrate produces them with citations.

Source: [Austin Land Development Code §25-2-562 (MF-3 district regulations)](http://austin-tx.elaws.us/code/ldc_title25_ch25-2_subchc_art3_div1_sec25-2-562), [Cherrywood Neighborhood Association land use terms](https://www.cherrywood.org/land-use-terms).

## The hero finding (the plan-review beat)

A proposed 5-story building does not fit MF-3. MF-3 caps height at 40 feet (roughly three stories) and density at 36 units per acre. The proposed building exceeds the height envelope and, depending on unit count, likely the density cap. Our system flags this before submission and surfaces the path: rezoning to a higher multifamily district (MF-4, which allows 60 feet, or above) or a height/density variance through the Board of Adjustment.

This is the single best demonstration of property intelligence enhancing the application, and it is real, on the real parcel. In the investor room it reads as de-risking: the entitlement gap and its resolution path are on the table before a dollar is raised. The plan-review atom must carry the code citation, the as-of date, and a confidence chip in the baseline (provenance-backed) state.

Verify the exact MF-4 height and the variance path through the substrate before the finding ships; the headline (5 stories exceeds MF-3 40 ft) is verified above.

## Design and rendering assets (for the investor room, twin, and plan review)

Under `apartment_bldg/Apartments-20260613T130315Z-3-001/Apartments/`:

- `Working Files/5 Story Apartment.rvt` — the model (twin source). Carlos variants exist; use the primary unless told otherwise.
- `Renderings/` — ~33 photoreal renderings (Image26-45, PSX_20230619_*). Investor room hero imagery.
- `Exterior Elevations/` — 7 elevations (East, North-East, North-West, North, South, West, Balcony). Investor room and plan review.
- `Floor Plans/` — first-floor and fifth-floor plans, plus unit-level plans (Bed 1, Bed 2, MSTR, Kitchen, Living, Baths). Drives the unit twin layout.
- `Interior Elevations/` — per-room, per-floor (the bulk of the 133 PNGs).
- `Schedules/` — wall schedule and key notes (real construction schedules). Useful for the twin and BLDR.
- `PDF_Plans/Apartment Structural.pdf` — structural set.

These are heavy; keep them gitignored. Reference by path, do not commit.

## Use-our-substrate directive

The operator's instruction is to use as much of our site substrate as possible. Concretely, WS-1 produces the ground-truth atoms for this parcel by calling our own place/parcel/code tools (hauska-engine place tools, the property/parcel engine, the code corpus), not by scraping or hand-entry. The atoms that result (parcel, zoning, code, flood, the entitlement finding) are the shared-ground-truth flywheel made visible, and they are the half of the stack no operator or off-the-shelf AI has. Validate the substrate output against the verified facts above.
