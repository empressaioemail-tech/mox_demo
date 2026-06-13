# Substrate notes — which substrate tool/corpus produced which ground-truth atom

WS-1 Spine, Parts B and C. Part A (RVT -> APS upload + Model Derivative) is
BLOCKED pending APS credentials in `.env`; building/unit atoms are provisional
with placeholder URNs (see below).

The differentiator the operator asked for is that the ground-truth atoms are
produced by **our own place/parcel/code substrate**, not by scraping or
hand-entry. Where a tool requires a live key/service this environment cannot
run (the Place API requires `PLACE_API_ENABLED=true` + a brokerage/cortex key;
the retrieval API serves the code corpus), the atom values are derived from the
substrate's curated corpus data and the verified facts in
`docs/property_ground_truth.md`, and each atom's `provenance`/`reasoning`
records exactly which substrate tool/corpus produced it. No values were
hand-faked to contradict the substrate; unconfirmed values are held as
`TBD-SUBSTRATE-RESOLVED` with `baseline` confidence.

## Map: atom -> substrate tool / corpus

| Atom file | entityType | Substrate tool / corpus | Repo | What it produced |
|---|---|---|---|---|
| `parcels/parcel-226623.json` | parcel | `resolve_place` -> `get_place_layers` (parcel layer); operator-confirmed Travis CAD link | hauska-mcp-server | placeKey + Travis CAD geographic ID 226623 (anchor lot, situs 611) |
| `parcels/parcel-607-nelray.json` | parcel | `resolve_place` -> `get_place_layers` (parcel layer) | hauska-mcp-server | placeKey + parcel-layer ref for the 607 lot (geographic ID pending live fetch) |
| `parcels/parcel-609-nelray.json` | parcel | `resolve_place` -> `get_place_layers` (parcel layer) | hauska-mcp-server | placeKey + parcel-layer ref for the 609 lot (geographic ID pending live fetch) |
| `zoning-mf3.json` | zoning-district | `search_atoms` / `get_atom` over the Austin LDC code corpus | hauska-engine | MF-3 standards (40 ft, 36 u/ac, FAR, coverage, impervious, setbacks) |
| `code-25-2-562.json` | code-section | Austin LDC code corpus (Municode productId 15303), curated query set | hauska-engine | §25-2-562 MF-3 district regulations + key standards |
| `code-25-2-491.json` | code-section | Austin LDC code corpus | hauska-engine | §25-2-491 site development regulations (FAR/coverage/impervious/setbacks table) |
| `code-25-2-564-mf4.json` | code-section | Austin LDC code corpus | hauska-engine | §25-2-564 MF-4 (60 ft) — rezone-path verification |
| `flood.json` | flood-zone | `get_place_dossier` (`federalSummaryRefs` flood layer) + LDC corpus (Ch 25-7) | hauska-mcp-server / hauska-engine | FEMA Zone X determination + applicable drainage/flood-load code refs |
| `entitlement-finding.json` | finding | composes building twin x zoning atom x §25-2-564; validated vs ground-truth doc | hauska-engine + mox_demo | HERO: 5-story exceeds MF-3 (40 ft / 36 u/ac); paths = rezone MF-4 or BOA variance |
| `building.json` | building | `aps-model-derivative` (**BLOCKED, Part A**); room/story inventory from ground-truth doc | (APS) / mox_demo | provisional building twin; placeholder APS URN |
| `units/unit-typical-2br.json` | unit | `aps-model-derivative` (**BLOCKED, Part A**); room names from ground-truth doc | (APS) / mox_demo | provisional 2BR unit twin (Bed 1, Bed 2, MSTR, Kitchen, Living, Baths) |
| `units/unit-typical-1br.json` | unit | `aps-model-derivative` (**BLOCKED, Part A**); room names from ground-truth doc | (APS) / mox_demo | provisional 1BR unit twin (MSTR, Kitchen, Living, Baths) |
| `operating/proforma-nelray.json` | operating-proforma | operator seed; metric naming from mockups | mox_demo | seeded pro-forma operating atom (tenant-private) |
| `deal.json` | deal | WS-1 Part C composition | mox_demo | deal molecule composing all of the above |

## Key substrate references (read access, on disk)

- **Place / parcel resolution:** `hauska-mcp-server/src/tools.ts` (tools
  `resolve_place`, `get_place_layers`, `get_place_dossier`) and
  `hauska-mcp-server/src/legacy-client.ts` (`ResolvePlaceResponse`,
  `PlaceLayerRef`, `GetPlaceLayersResponse`, `GetPlaceDossierResponse`). These
  are `BROKERAGE_TIER` tools gated on a product key; the gate itself is WS-2's
  job. They need `PLACE_API_ENABLED=true`, which this environment does not have,
  so parcel atoms record the call path and hold the live-fetch-only values as
  placeholders.
- **Code corpus:** the Austin LDC is ingested via the Municode JSON adapter as a
  separate product (productId 15303, "Land Development Code"), per
  `hauska-engine/tools/migrate-legacy-codes/src/austin-ldc-curated-queries.ts`
  (`AUSTIN_LDC_JURISDICTION = "austin_tx"`, Title 25 Ch 25-2 Zoning curated
  queries). Corpus snapshot at
  `hauska-engine/services/retrieval-api/corpus/snapshot.json` contains the MF-3
  district text. Code atoms are retrieved via `search_atoms` / `get_atom`.
- **Atom shapes:** `@hauska/atom-contract` (`AccessPolicy`, `ContextSummary`,
  `AtomRegistration`, composition) plus `hauska-engine/packages/atoms/src/`
  (`BaseAtomInstance` identity: `entityType` + `entityId` + `jurisdictionTenant`
  + `contentHash` + `sourceAdapter`/`sourceUrl`/`fetchedAt`; DID
  `did:hauska:<entityType>:<localId>` from `did.ts`). The presented atom
  envelope (provenance edges + reasoning + confidence/state + freshness) follows
  `hauska-mcp-server/src/atom-shape.ts` (`AtomProvenanceEntry`) and the
  per-instance fields in this repo's `data/README.md`.

## Confidence states used (honesty guardrail)

Every atom carries `confidence.value` + `confidence.state`. States used:

- `provenance-backed` — value sourced from a substrate corpus/tool with a
  citation and cross-checked against the ground-truth doc (zoning, code,
  parcel 226623).
- `baseline` — substrate-resolved or composed but not yet operator-confirmed or
  not yet observed in outcomes (sibling parcels, flood, the hero finding, the
  operating pro forma, the deal molecule). **The hero entitlement finding is
  deliberately `baseline` (provenance-backed), NOT earned-calibrated**, per the
  WS-1 acceptance criterion and the honesty guardrails.
- `provisional` — atom incomplete pending the blocked APS extraction (building,
  units).

No atom is presented as `earned-calibrated`. The mockups' "Underwrite
confidence: calibrated" chip applies to the operator's 18-asset owned book
(which has earned outcomes); the Nelray deal is a new, not-yet-built asset, so
its operating pro forma is explicitly `baseline` / projected.

## Two-flywheel partition (accessPolicy)

- **Public ground truth** (`public-free`): parcels, zoning, code sections,
  flood, entitlement finding. The shared-ground-truth flywheel.
- **Private operating** (`tenant-private`): the operating pro forma and the deal
  molecule (which carries the private operating side and the assembled deal).
  Never pooled into shared ground truth.

## Part A backfill checklist (for the agent who lands APS credentials)

1. Put `APS_CLIENT_ID` / `APS_CLIENT_SECRET` in `.env` (never commit).
2. Upload `5 Story Apartment.rvt` to an APS OSS bucket; run Model Derivative
   (SVF2 + metadata). Record the model URN.
3. Replace every `PLACEHOLDER_APS_URN_BACKFILL_PART_A` (in `building.json`,
   `units/*.json`, `deal.json`) with the real URN.
4. Backfill per-element spatial refs (`apsDbIds`, level/room dbIds) and areas
   from the derivative metadata; flip `provisional: true` -> `false` and the
   confidence `state` from `provisional` to `provenance-backed` on the building
   and unit atoms.
5. Finalize the entitlement finding's `proposed` height from the APS-extracted
   building height (currently "5 stories (~55-60 ft)").
