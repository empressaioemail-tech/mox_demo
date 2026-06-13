# Atom fixtures (`/data`)

Seed JSON fixtures for the Mox demo atom store. Populated by **WS-1 Spine**.

Each fixture file is a contract-shaped atom. Required fields (per `@hauska/atom-contract`):

- **Identity:** `atomId` (logical id) + `contentHash`
- **Provenance:** source edges with citations
- **Reasoning:** how the atom was derived
- **Confidence:** value plus state (`baseline`, `provenance-backed`, etc. — never bare earned numbers)
- **Freshness:** as-of date
- **accessPolicy:** `tenant-private` for operating atoms; `public-free` or `public-paid` for ground truth

Expected fixtures (WS-1):

| File | Entity type | accessPolicy |
|------|-------------|--------------|
| `building.json` | building twin | public-free |
| `units/*.json` | unit (Bed 1, Bed 2, MSTR, …) | public-free |
| `parcels/*.json` | parcel (607, 609, 611 Nelray) | public-free |
| `zoning-mf3.json` | zoning | public-free |
| `code-*.json` | code citation | public-free |
| `flood.json` | flood | public-free |
| `entitlement-finding.json` | plan-review hero finding | public-free |
| `deal.json` | deal molecule | tenant-private |

See `docs/property_ground_truth.md` for validation facts.
