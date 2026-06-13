# Hero-script run sheet

> **LIVING DOC.** This is the rehearsal script and the demo-day run sheet for the
> five hero intents. It maps each typed intent to the engine's component assembly
> and to the narrative beats. It MUST be reconciled against the built surfaces in
> the final WS-7 audit pass — the component names below are the target catalog and
> may be renamed as surfaces land. Until then, treat the assembly column as the
> contract the surfaces are built to satisfy.
>
> Canonical framing lines: `docs/narrative/framing.md`. Differentiation thread:
> `docs/narrative/differentiation.md`. Confidence-state rules:
> `frontend/src/components/library/ConfidenceChip.tsx`.
>
> **RE-RECONCILED 2026-06-13 (iteration 2 — self-contained engine / RBAC / redaction
> / Sketchfab pass).** The assembly columns below are the *actual* live engine output
> (POST `/api/intent` — now a SAME-ORIGIN Next.js API route, `X-Hauska-Key:
> mox-tenant-key`, providerMode mock). The engine lives INSIDE the app
> (`frontend/src/app/api/*` + `frontend/src/lib/engine/*`) — no separate backend, no
> `NEXT_PUBLIC_BACKEND_URL`. Structural facts the original draft got wrong, corrected
> throughout: (a) the **Yardi intelligence layer is its own surface** (`/yardi`), NOT
> a component the engine assembles — "ride over a Yardi screen" is a *staging* note
> for the presenter; (b) the engine **always appends a `provenance-drill`** component,
> and surfaces the entitlement flag via **`plan-review-findings` + `action-inbox`**,
> not a `variance-anomaly-card`, on the deal/why-flagged intents.
>
> **Iteration-2 walkthrough as-built (this is the canonical demo flow):**
> 1. **Persistent header controls.** Every page mounts a sticky `DemoHeader`
>    (`frontend/src/components/shell/DemoHeader.tsx`) carrying the WALKTHROUGH controls
>    (start / prev / next / exit + beat indicator) AND the ROLE SWITCHER
>    (`frontend/src/components/rbac/RoleSwitcher.tsx`) on every surface, so the
>    presenter is never lost full-screen.
> 2. **The guided walkthrough is five beats** (`frontend/src/components/walkthrough/beats.ts`),
>    in this order: **open-yardi → spatial-twin → open-unit → adaptive-command →
>    investor-room.** (Note: spatial-twin and open-unit are TWO beats, both on `/twin`;
>    adaptive-command is its own beat on `/command`.) Each beat carries verbatim
>    narration; the open/transition/close `sayAloud` lines are verbatim from `framing.md`.
> 3. **Beat 4 (the twin 3D face) is a SKETCHFAB rendered, navigable embed** — NOT APS.
>    Live APS SVF2 is off the critical path (account-entitlement gap). The slot
>    (`frontend/src/components/aps/ApsViewerSlot.tsx`) renders `<SketchfabEmbed>` when
>    `NEXT_PUBLIC_SKETCHFAB_MODEL_ID` is set, and a graceful "rendered 3D model —
>    wiring up" fallback (no broken iframe) when unset. Either way it is labeled a
>    RENDERING of the proposed design — not live tenant data, not a measured as-built.
> 4. **The verbatim `OPENING_FRAMING_LINE`** renders via `<NarrativeFrame variant="open" />`
>    on `/yardi` (`yardi/page.tsx:35`), the home hub (`page.tsx:81`), AND `/command`
>    (`command/page.tsx:43`).
> 5. **New demo moments:** the **RBAC role-switch** (switch the header role to
>    Investor / LP and the operating internals visibly redact across command, Yardi,
>    and twin) and the **investor redaction** (operator redacts/replaces sensitive
>    lines, then previews as the LP). Both are scripted into the investor beat below.

## The arc (five beats, one operating system)

The guided walkthrough (`frontend/src/components/walkthrough/beats.ts`) drives FIVE
beats, in this exact order:
**open-yardi → spatial-twin → open-unit → adaptive-command → investor-room.**

1. **open-yardi** (`/yardi`) — Yardi untouched, intelligence layer riding on top.
   Kills the rip-and-replace fear before anything else happens. The verbatim opening
   framing line renders here (`<NarrativeFrame variant="open" />`).
2. **spatial-twin** (`/twin`, Building view) — pull back to the proposed building.
   The 3D face is a **Sketchfab rendered, navigable embed** of the proposed design
   (or a graceful fallback when no model id is set) — NOT APS, NOT live tenant data.
   The asset-based hero (renderings/elevations/plans) is the active spatial face;
   ground truth (parcel / zoning / code / flood) sits above; the MF-3 entitlement
   finding is reachable from the building level.
3. **open-unit** (`/twin`, Unit drill-down) — walk a unit room by room; the space,
   its (tenant-private, RBAC-gated) operating layer, and the ground truth stacked
   above it, each fact carrying its source.
4. **adaptive-command** (`/command`) — the adaptive intent bar assembling views on
   demand; the deposit loop turning. **RBAC moment:** switch the header role to
   Investor / LP and the operating views visibly redact.
5. **investor-room** (`/investor`) — the generated, cited artifact that de-risks the
   deal and lands the "more investors" thesis. **Redaction moment:** the operator
   redacts/replaces sensitive lines, then previews as the LP.

The five hero intents ("show me this deal", "vet the proposed building", "why is this
flagged", "open a unit", "generate the LP view") are the typed entry points layered
onto these beats. The header carries persistent walkthrough + role-switcher controls
on every surface.

Say the **opening framing line verbatim** before beat 1 (it also renders on the
Yardi/home/command open beats and is the open-beat `sayAloud`). Say the **transition**
between the operating beats and the deal beats, and the **closing copy** after the
investor beat. (All in `framing.md`; also the beats' `sayAloud` fields.)

## Component catalog (target — reconcile in audit)

| Component | Role |
|---|---|
| KPI card | A surfaced metric; every value carries a `ConfidenceChip`. |
| Provenance drill | Expands any atom to source + reasoning chain. |
| Variance / anomaly card | Flags an outlier with its reasoning and source. Engine kind `variance-anomaly-card`. NOTE: assembled for operating-variance intents (e.g. the Yardi overlay's live intent "show me variance and anomalies in operating"); the *why-is-this-flagged* hero intent surfaces the entitlement flag via `plan-review-findings` + `action-inbox` instead. |
| Action inbox | Triaged flags routed by role, each with recommendation + accept/edit/reject (the deposit loop). Engine kind `action-inbox`. |
| Unit-twin viewer slot | APS viewer slot + the unit's spatial/operating/ground-truth atom stack. Engine kind `unit-twin-viewer`; units render `provisional · pending APS`. |
| Plan-review findings | The entitlement finding (MF-3 cap) with code citation + as-of date. Engine kind `plan-review-findings`. |
| Investor rollup | Underwrite + return summary (deal molecule), every number drilling to source. Engine kind `investor-rollup`. |
| Renderings panel | Hero photoreal renderings of the proposed building. Engine kind `renderings-panel`. |
| Provenance drill | Expands an atom to source + reasoning chain. Engine kind `provenance-drill` — the engine APPENDS this to every assembly. |

Confirmed engine `ComponentKind` set (`frontend/src/lib/engine.ts:22-30`):
`kpi-card`, `provenance-drill`, `variance-anomaly-card`, `action-inbox`,
`unit-twin-viewer`, `plan-review-findings`, `investor-rollup`, `renderings-panel`.

Every numeric value rendered by any of these composes `ConfidenceChip` with an
explicit state (guardrail 1). In this demo the live states are `baseline` /
`provenance-backed` / `provisional` (the latter collapses to `baseline` in the UI,
never upgraded). No value renders `earned-through-outcome` (verified live).

---

## The five hero intents

### Intent 1 — "show me this deal"
- **Type:** `show me this deal`
- **Beat:** Open on Yardi (beat 1). This is the first thing the room sees.
- **Actual assembly (verified live):** `investor-rollup` (the deal molecule — address,
  list price, site, the cited de-risking ledger) + `kpi-card` (the underwrite
  headline metrics) + `plan-review-findings` (the MF-3 entitlement flag) +
  `provenance-drill`. Each value carries a **ConfidenceChip** with state (live states
  baseline / provenance-backed / provisional). NOTE (corrected): the engine does NOT
  return a "Yardi" component — the Yardi intelligence layer is the separate `/yardi`
  surface. To open *on Yardi*, the presenter stages the `/yardi` surface first (which
  itself hydrates atom-derived insights from the engine), THEN runs this command
  intent to pull back to the deal at a glance.
- **Say:** "This is your Yardi. Untouched. Watch what our layer adds." (on the `/yardi`
  surface) → then "show me this deal" → the deal molecule, the underwrite, and the
  entitlement flag, every number with its provenance.
- **Honesty:** The Yardi overlay is atom-derived, not DOM scraping (guardrail 4). No
  write-back implied (guardrail 6). Chips carry state; nothing earned-calibrated.

### Intent 2 — "vet the proposed building"
- **Type:** `vet the proposed building`
- **Beat:** Spatial twin → ground-truth layer (beat 2, building level). On `/twin`
  this is the **Building view**: the **Sketchfab rendered 3D model slot** (or the
  graceful fallback), the renderings/elevations hero, the floor plans, the
  ground-truth layer, and the MF-3 entitlement finding
  (`frontend/src/components/twin/BuildingView.tsx` +
  `frontend/src/components/aps/ApsViewerSlot.tsx` + `EntitlementFinding.tsx`).
- **Actual assembly (verified live):** `plan-review-findings` (the MF-3 entitlement
  gap, lead) + `renderings-panel` (the proposed 5-story building) + `action-inbox`
  (the flag routed for accept/edit/reject — the deposit loop) + `provenance-drill`.
  NOTE (corrected): this intent does NOT return `unit-twin-viewer` (that is intent 4,
  "open a unit"); it leads with the plan-review finding and the renderings of the
  proposed building. Ground-truth atoms (parcel/zoning/code) surface as the cited
  members behind the finding's code citations + the appended provenance drill, each
  with a **ConfidenceChip** carrying state.
- **Say:** "This is the proposed building, the real model. Above it sits the parcel
  and the code — the ground truth we bring that you could never build yourself.
  And here is what the system caught: a five-story building on MF-3 land, which
  caps at forty feet and thirty-six units an acre. It needs MF-4 rezoning or a
  variance — flagged before you ever submit."
- **Honesty:** Plan-review atom carries code citation + as-of date + `baseline`
  chip. Verify MF-4 height and variance path through the substrate before showing.
  This is differentiation point 3 landing. The 3D slot is a **Sketchfab RENDERING of
  the proposed design** — NOT APS, NOT a measured as-built, NOT live tenant data
  (`ApsViewerSlot.tsx:75-91`); do not present it as a live APS/Revit viewer. Building
  geometry/URN is `provisional` pending the APS Model Derivative backfill (WS-1 Part A).

### Intent 3 — "why is this flagged"
- **Type:** `why is this flagged`
- **Beat:** Command surface — the drill (sits across beat 2 the leak, and beat 4
  the entitlement flag; same primitive either context).
- **Actual assembly (verified live):** `plan-review-findings` (the entitlement flag
  with its full reasoning text, MF-3 standard vs proposed, and code citations) +
  `provenance-drill` (source + reasoning chain) + `action-inbox` (accept/edit/reject
  — the deposit loop). NOTE (corrected): in the deal/entitlement context the engine
  surfaces the flag via `plan-review-findings` + `action-inbox`, NOT a
  `variance-anomaly-card`. The `variance-anomaly-card` is the *operating* primitive,
  reached via the Yardi overlay's live intent "show me variance and anomalies in
  operating" (`frontend/src/components/yardi/beats.ts`) — that is where the
  R&M / water-leak anomaly assembles.
- **Say (operating):** Tell the water-leak story (water ran high for months, a human
  finally caught an off-site underground leak), then: "the system would have
  flagged that in month one, not month nine."
- **Honesty:** Reasoning chain and source are real structure; chip baseline. The
  "treatment not the data" differentiation point (point 1) lands here.

### Intent 4 — "open a unit"
- **Type:** `open a unit`
- **Beat:** Spatial twin — unit level (beat 2, unit detail). **Primary surface: the
  `/twin` unit drill-down.**
- **Where it lands (asset-twin pass):** the natural home for this beat is the **`/twin`
  Unit drill-down view** (`frontend/src/components/twin/UnitDrilldown.tsx`). Toggle to
  "Unit drill-down", pick a unit type (Typical 2BR / 1BR), and the **room chips**
  (Bed 1, Bed 2, MSTR, Kitchen, Living, Baths — names straight from the unit atom)
  each load that room's **floor plan + interior elevation** (`assets.ts` `ROOM_IMAGES`)
  ALONGSIDE the **composed atom panel**: spatial unit metadata + the seeded operating
  layer (`OperatingLayer.tsx`) + the ground-truth layer (`GroundTruthLayer.tsx`).
  Every fact carries a **ConfidenceChip** with state and a **DrillLink** to its atom.
- **Actual engine assembly (verified live, command surface):** `unit-twin-viewer`
  (the unit atoms — name, unit type, rooms; rendered `provisional · pending APS` with
  a placeholder spatial ref) + `renderings-panel` (the proposed building it sits in) +
  `provenance-drill`. Each unit carries a card-level **ConfidenceChip** with state.
- **Honesty:** Room geometry/areas/per-room spatial refs are **provisional pending the
  APS Model Derivative backfill (WS-1 Part A)** — stated explicitly
  (`UnitDrilldown.tsx:206-210`); the room inventory is documented from the floor-plan
  set. Plan/elevation imagery is curated Revit export, NOT a live 3D view. Operating
  data is representative seed, baseline chips, tenant-private and never pooled
  (`OperatingLayer.tsx:74-77`). **RBAC:** the operating layer is wrapped in a
  `RoleGate resource="operating-internals"` (`UnitDrilldown.tsx:219-225`), so
  switching the header role to LP visibly redacts it — the unit space + ground truth
  stay; the tenant-private operating layer blacks out. No live-Yardi unit sync
  implied (guardrail 6).
- **Say:** "Every unit is an atom. Click in and you walk it room by room — the space,
  its operating layer, and the ground truth stacked above it, each fact carrying its
  source."

### Intent 5 — "generate the LP view"
- **Type:** `generate the LP view`
- **Beat:** Investor room (walkthrough beat 5, `investor-room`). The close.
- **Actual assembly (verified live):** `investor-rollup` (the deal molecule +
  cited de-risking ledger) + `plan-review-findings` (the MF-3 finding + code
  citations + as-of date) + `renderings-panel` (hero photoreal renderings) +
  `kpi-card` (the underwrite / return summary) + `provenance-drill`. The
  `/investor` page composes these in its own display order (rollup → renderings →
  underwrite → plan review → close frame); every number carries a **ConfidenceChip**
  with state and a **DrillLink** to its source atom. This matches the catalog
  (Renderings panel + Investor rollup + Plan-review findings) exactly; the engine
  additionally returns the underwrite as a `kpi-card` and appends `provenance-drill`.
- **Say:** "This is what you hand an LP instead of a static PDF. Every number traces
  to its source. The code risk on the parcel is already vetted — jurisdictional
  diligence no other GP can show, and it is what lowers your cost of capital."
- **Demo moment — REDACTION (operator → LP).** As the internal operator (Executive /
  Acquisitions), use the per-field controls (`RedactionControls.tsx`,
  `UnderwriteSummary.tsx` "Show / Redact / Replace") to redact or **replace** a
  sensitive line — e.g. replace the list price with the representative band `~$4–5M`,
  or the exact address with "North Loop, Austin TX". Say: "I control what the partner
  sees. Replace swaps in a clearly representative value; redact blacks it out."
- **Demo moment — ROLE SWITCH (preview as LP).** Switch the header role to
  **Investor / LP**. The redacted fields black out, replaced fields show the
  representative substitute with an amber "representative" chip, and the operating
  internals redact. Say: "This is exactly what the LP receives — the curated, cited
  view, never the tenant-private operating internals." (Honesty caveat for the
  presenter: the lineage `DrillLink` on the underwrite is currently role-blind — see
  honesty audit FIX-NEEDED #1 — so avoid drilling the pro-forma atom while in LP role
  until that ships; what it would surface is the labeled representative seed atom, not
  a real actual.)
- **Honesty (guardrail 3):** The investor room reads as a generated, cited artifact,
  NOT the live revocable LP umbilical (gated on the auth build). We provide the
  provenance infrastructure; the GP makes the representations. Do not present it as
  certifying returns. **Replace** values are always clearly representative
  (ranges / rounded / labeled), never a fabricated exact figure presented as real
  (`UnderwriteSummary.tsx:38-55`, `RedactionControls.tsx:179-192`).

---

## Deposit-loop moment (where the live earning loop is shown)

Within the command surface (most naturally off intent 3's action-inbox pattern):
accept or edit one flagged item, then say: "and that correction just taught the
system. It gets less wrong every month, and you own that learning."

The chip stays `baseline`. The narration is that this is HOW it earns over time, on
your book — **do not flip a representative number to `earned-through-outcome`**
(guardrail 2). This is differentiation point 2 (the private flywheel) turning on
screen.

---

## Reconciliation checklist (RECONCILED 2026-06-13 — iteration 2)

- [x] Engine is SAME-ORIGIN — POST `/api/intent` hits the in-app route handler
  (`frontend/src/app/api/intent/route.ts`), no `NEXT_PUBLIC_BACKEND_URL`, no separate
  backend. The five hero intents match the built parser and return the components
  shown above.
- [x] Each component in the assembly columns exists and is named per `ComponentKind`.
  Corrections logged inline: the engine returns no "Yardi" component (separate
  surface); the entitlement flag surfaces via `plan-review-findings` + `action-inbox`,
  not `variance-anomaly-card`; every assembly appends `provenance-drill`.
- [x] Every numeric value renders a `ConfidenceChip` with state — enforced by the
  required `state` prop (`ConfidenceChip.tsx:53`); live states are baseline /
  provenance-backed / provisional; no `earned-through-outcome`.
- [x] Opening line — the verbatim `OPENING_FRAMING_LINE` is mounted via
  `<NarrativeFrame variant="open" />` on `/yardi` (`yardi/page.tsx:35`), the home hub
  (`page.tsx:81`), AND `/command` (`command/page.tsx:43`); it is also the open-beat
  `sayAloud` (`walkthrough/beats.ts:42-43`). Closing copy after the investor beat is
  present (`InvestorRoom.tsx:347-384`). Guardrail 5 clears.
- [x] Five-beat walkthrough order is open-yardi → spatial-twin → open-unit →
  adaptive-command → investor-room (`walkthrough/beats.ts:34-81`); persistent header
  walkthrough controls + role switcher on every surface (`DemoHeader.tsx`).
- [x] Beat 4 (twin 3D) is a Sketchfab rendered embed (model-id set) / graceful
  fallback (unset), labeled a rendering of the proposed design — NOT APS, NOT live
  tenant data (`ApsViewerSlot.tsx`, `SketchfabEmbed.tsx`).
- [x] RBAC role-switch redacts tenant-private operating internals for the LP across
  command, Yardi, and twin (`renderers.tsx`, `AssistOverlay.tsx`, `UnitDrilldown.tsx`).
  **Caveat:** the investor lineage drawer is role-blind — honesty audit FIX-NEEDED #1.
- [x] Investor redaction/replace: replace values are clearly representative, redacted
  fields blacked out for the LP (`RedactionControls.tsx`, `UnderwriteSummary.tsx`).
- [x] Deposit-loop shows the live loop, not calibrated numbers — `DepositLoop` +
  plan-review accept/edit/reject POST `/api/calibration` (client-accumulated,
  stateless) and reflect a signal count; no number flips to earned (guardrail 2).
- [x] Investor room reads as a generated, cited artifact (guardrail 3) — confirmed.
- [x] No live-bidirectional-Yardi claim anywhere (guardrail 6) — confirmed by grep +
  read of every surface.
