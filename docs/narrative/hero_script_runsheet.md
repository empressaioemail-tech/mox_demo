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
| Variance / anomaly card | Flags an outlier with its reasoning and source. |
| Action inbox | Triaged flags routed by role, each with recommendation + accept/edit/reject. |
| Unit-twin viewer slot | APS viewer slot + the unit's spatial/operating/ground-truth atom stack. |
| Plan-review findings | The entitlement finding (MF-3 cap) with code citation + as-of date. |
| Investor rollup | Underwrite + return summary, every number drilling to source. |
| Renderings panel | Hero photoreal renderings of the proposed building. |

Every numeric value rendered by any of these composes `ConfidenceChip` with an
explicit state (guardrail 1). In this demo the state is `baseline` /
`provenance-backed`.

---

## The five hero intents

### Intent 1 — "show me this deal"
- **Type:** `show me this deal`
- **Beat:** Open on Yardi (beat 1). This is the first thing the room sees.
- **Expected assembly:** A deal-overview view. **KPI card** cluster (asking price,
  land area, lots, zoning headline) each with a **ConfidenceChip** (`baseline`),
  riding as the intelligence layer over a Yardi screen
  (`Yardi_Property-Operations` / `Yardi_Financial-Overview`). One in-context
  insight surfaced via a **provenance drill**.
- **Say:** "This is your Yardi. Untouched. Watch what our layer adds." Then the deal
  at a glance.
- **Honesty:** The overlay is atom-derived, not DOM scraping (guardrail 4). No
  write-back implied (guardrail 6). Chips baseline.

### Intent 2 — "vet the proposed building"
- **Type:** `vet the proposed building`
- **Beat:** Spatial twin → ground-truth layer (beat 4, building level).
- **Expected assembly:** **Unit-twin viewer slot** loads the proposed 5-story
  Nelray model. Above the building sits the ground-truth atom stack (parcel,
  zoning, code) each with a **provenance drill** and a **ConfidenceChip**. This
  intent surfaces the **plan-review findings** card: the MF-3 entitlement gap.
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
- **Expected assembly:** **Variance / anomaly card** assembles for the flagged
  item, with the reasoning chain and the **provenance drill** to source. In the
  operating context this is the R&M / water-leak anomaly; in the deal context it
  drills the entitlement flag from intent 2.
- **Say (operating):** Tell the water-leak story (water ran high for months, a human
  finally caught an off-site underground leak), then: "the system would have
  flagged that in month one, not month nine."
- **Honesty:** Reasoning chain and source are real structure; chip baseline. The
  "treatment not the data" differentiation point (point 1) lands here.

### Intent 4 — "open a unit"
- **Type:** `open a unit`
- **Beat:** Spatial twin — unit level (beat 4, unit detail).
- **Expected assembly:** **Unit-twin viewer slot** focuses a single unit (Bed 1,
  MSTR, Kitchen, etc. from the floor plans). The unit-twin panel composes the
  spatial unit + a seeded operating layer + the ground-truth layer above, each atom
  with a **ConfidenceChip** and **provenance drill**.
- **Say:** "Every unit is an atom. Click in and you see the space, its operating
  layer, and the ground truth stacked above it."
- **Honesty:** Representative operating data, baseline chips. The spatial model is
  real (the Nelray RVT). No live-Yardi unit sync implied (guardrail 6).

### Intent 5 — "generate the LP view"
- **Type:** `generate the LP view`
- **Beat:** Investor room (beat 5). The close.
- **Expected assembly:** The investor room assembles as a **generated, cited
  artifact**: **Renderings panel** (hero photoreal renderings) + **Investor
  rollup** (underwrite + return summary, every number with a **provenance drill**
  and a **ConfidenceChip**) + the **plan-review findings** section (the MF-3
  finding + proposed-building review against Austin code, cited) + the "what an LP
  gets" framing.
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

## Reconciliation checklist (fill in the final audit)

- [ ] PENDING — confirm each intent's typed string matches the built intent parser.
- [ ] PENDING — confirm each component in the assembly column exists and is named as above (or update names).
- [ ] PENDING — confirm every numeric value across all five intents renders a `ConfidenceChip` with state.
- [ ] PENDING — confirm opening line present before intent 1, closing copy after intent 5.
- [ ] PENDING — confirm deposit-loop moment shows the live loop, not calibrated numbers.
- [ ] PENDING — confirm investor room reads as a generated cited artifact (guardrail 3).
- [ ] PENDING — confirm no live-bidirectional-Yardi claim appears anywhere (guardrail 6).
