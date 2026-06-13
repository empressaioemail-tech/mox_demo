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
> **RECONCILED 2026-06-13 (final WS-7 audit).** The assembly columns below have been
> updated to the *actual* live engine output (POST /api/intent, X-Hauska-Key:
> mox-tenant-key, providerMode mock). Two structural facts the original draft got
> wrong, now corrected throughout: (a) the **Yardi intelligence layer is its own
> surface** (`/yardi`), NOT a component the engine assembles — the engine never
> returns a "Yardi" component, so "ride over a Yardi screen" is a *staging* note for
> the presenter, not an assembly fact; (b) the engine **always appends a
> `provenance-drill`** component, and surfaces the entitlement flag via
> **`plan-review-findings` + `action-inbox`**, not a `variance-anomaly-card`, on the
> deal/why-flagged intents. Component names in the catalog are confirmed against
> `frontend/src/lib/engine.ts` `ComponentKind`.

## The arc (four narrative beats, one operating system)

The demo moves through four positions. The five hero intents below sit on this arc:

1. **Open on Yardi** — untouched, intelligence layer riding on top. Kills the
   rip-and-replace fear before anything else happens.
2. **Spatial twin** — pull back to the proposed building, the real model; units are
   atoms, ground truth sits above them.
3. **Command surface** — the adaptive intent bar assembling views on demand; the
   deposit loop turning.
4. **Investor room** — the generated, cited artifact that de-risks the deal and
   lands the "more investors" thesis.

Say the **opening framing line verbatim** before intent 1. Say the **closing copy**
after intent 5. (Both in `framing.md`.)

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
- **Beat:** Spatial twin → ground-truth layer (beat 4, building level).
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
  This is differentiation point 3 landing.

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
- **Beat:** Spatial twin — unit level (beat 4, unit detail).
- **Actual assembly (verified live):** `unit-twin-viewer` (the unit atoms — name,
  unit type, rooms; rendered `provisional · pending APS` with a placeholder spatial
  ref) + `renderings-panel` (the proposed building it sits in) + `provenance-drill`.
  Each unit carries a card-level **ConfidenceChip** with state; the appended
  provenance drill exposes source + reasoning. NOTE: the spatial ref is a labelled
  placeholder pending the APS backfill (`renderers.tsx:369-371`) — honest about the
  APS-blocked state, not a faked 3D view.
- **Say:** "Every unit is an atom. Click in and you see the space, its operating
  layer, and the ground truth stacked above it."
- **Honesty:** Representative operating data, baseline chips. The spatial model is
  real (the Nelray RVT). No live-Yardi unit sync implied (guardrail 6).

### Intent 5 — "generate the LP view"
- **Type:** `generate the LP view`
- **Beat:** Investor room (beat 5). The close.
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
- **Honesty (guardrail 3):** The investor room reads as a generated, cited artifact,
  NOT the live revocable LP umbilical (gated on the auth build). We provide the
  provenance infrastructure; the GP makes the representations. Do not present it as
  certifying returns.

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

## Reconciliation checklist (RECONCILED 2026-06-13 — final audit)

- [x] Each intent's typed string matches the built parser — the five `HERO_INTENTS`
  (`frontend/src/lib/engine.ts:154-160`) match verbatim and all five return
  components live (verified against the running engine).
- [x] Each component in the assembly columns exists and is named per
  `ComponentKind` — assembly columns above REWRITTEN to the actual live output.
  Corrections logged inline: intent 1 has no "Yardi" component (separate surface);
  intents 1-3 surface the entitlement flag via `plan-review-findings` + `action-inbox`,
  not `variance-anomaly-card`; every assembly appends `provenance-drill`.
- [x] Every numeric value renders a `ConfidenceChip` with state — enforced by the
  required `state` prop (`ConfidenceChip.tsx:53`); live states are baseline /
  provenance-backed / provisional; no `earned-through-outcome`.
- [~] Opening line before intent 1 — **FIX-NEEDED:** the verbatim `OPENING_FRAMING_LINE`
  is not yet mounted on the Yardi open beat (see `honesty_audit_checklist.md`
  FIX-NEEDED #1). Closing copy after intent 5 is present (`investor/page.tsx:73-88`).
- [x] Deposit-loop moment shows the live loop, not calibrated numbers — `DepositLoop`
  + `action-inbox`/plan-review accept-edit-reject record to `/api/calibration` and
  re-run; no number flips to earned (guardrail 2).
- [x] Investor room reads as a generated, cited artifact (guardrail 3) — confirmed.
- [x] No live-bidirectional-Yardi claim anywhere (guardrail 6) — confirmed by grep +
  read of every surface.
