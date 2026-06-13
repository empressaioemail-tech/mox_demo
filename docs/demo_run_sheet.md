# Demo run sheet and framing copy

> The rehearsal doc and the demo-day script. This was the front half of WS-7: it locked the narrative and the honesty framing before the surfaces were finalized.
>
> **CANONICAL-AUTHORITY NOTE (2026-06-13, asset-twin pass).** This doc remains canonical for the **framing lines** (Open / Transition / Close, below), the **confidence-chip rules**, the **differentiation thread**, and the **audience matching** — use those verbatim. For the **intent-by-intent component assembly and the surface-by-surface beat mapping**, the canonical source is now **`docs/narrative/hero_script_runsheet.md`**, which is reconciled cell-by-cell against the live engine output (POST /api/intent) and the built surfaces. Where the beat descriptions in this doc once diverged from what shipped, they have been reconciled below to match reality (notably: the spatial twin is the asset-based `/twin` surface with the live APS 3D viewer staged as a labeled drop-in slot — NOT a live 3D viewer rendering; and the five-beat arc is Yardi → spatial twin → adaptive command → investor room). If this doc and `hero_script_runsheet.md` ever conflict on assembly/surfaces again, `hero_script_runsheet.md` wins.

## How the demo is shaped

One narrative across two data contexts. It starts in the everyday operating layer (representative portfolio data, the existing mockups, the Yardi intelligence layer) to prove the daily value and kill the rip-and-replace fear, then escalates to a real Austin redevelopment (the Nelray model, real parcel, real renderings) to prove the development and capital value, which is where the "land more investors" thesis lands. The transition line is scripted below so the two contexts read as one operating system, not two demos.

The bar is best foot forward, feels and acts like the real thing to a degree. Chris refines design after function lands.

## Framing lines (verbatim)

**Open.** "The engine is real. The data is representative, shaped like yours. Wiring it to your Yardi is what the first phase does."

**Transition (operating to deal).** "That is the everyday operating layer. Now let me show you a real Austin redevelopment running through the same system, the kind of deal your Invest team underwrites."

**Close.** "Everything you saw runs on a spine you own. The tools whose jobs it absorbs go away over time. And to get your own data out of Yardi today costs you about twenty-five thousand dollars per interface per year, with Yardi's permission. On the spine, your data is yours, it travels with the asset, and it gets sharper every time your team touches it."

## What makes this different (deliver this thread, do not bolt it on)

1. The treatment, not the data. Every number is an atom carrying its own provenance, reasoning, confidence, and a calibration state that tightens with use. A dashboard shows a number. An atom shows why, where it came from, how sure it is, and gets less wrong every month.
2. Two flywheels. Your private operating intelligence never pools and compounds on your own outcomes, a moat rivals cannot copy because they do not have your history. The shared ground truth (code, zoning, parcel) sharpens because the whole network feeds it.
3. The ground truth is already built and nobody else has it. The plan review proves it on screen.

## Confidence chip (canonical component, used on every number)

Every surfaced value carries a chip with its state. In this demo everything is in the baseline state, because the data is representative and not yet calibrated on Mox outcomes.

- `baseline · provenance-backed` (the demo default). Tooltip: "Backed by source and reasoning. Calibration against your actual outcomes begins when your data is wired."
- `earned · calibrated` exists in the component but is never applied to a representative number as if real. It appears only to illustrate what the deposit loop produces over time.
- Sub-label for verification: verified / asserted, per the atom.

Never show a bare number. Never present a representative number as earned-calibrated.

## The five beats

### Beat 1: open on Yardi (operating)
- Action: the demo opens on a Yardi screen (`Yardi_Property-Operations-RV35-1.png` or `Yardi_Financial-Overview-RV54-1.png`) with the intelligence layer riding on top. The overlay surfaces one in-context insight with a source and a baseline confidence chip.
- Say: "This is your Yardi. Untouched. The same screen your team uses every day. Watch what our layer adds."
- Answers: the rip-and-replace fear (Felicia). Nobody migrates, nobody logs into a new system.
- Honesty: the overlay is atom-derived, not screen-scraping. Chip is baseline.

### Beat 2: catch the leak (operating)
- Action: on `Yardi_Budget-Variance-RV55-1.png` / `Yardi_Expense-Analysis-RV19-1.png`, type "why is R&M high at this property this quarter?" or click the flag. The variance card assembles, surfaces the anomaly, shows the reasoning chain and the source.
- Say: tell the real water-leak story (a trailing-twelve where water ran high for months and a human finally caught an underground off-site leak), then: "the system would have flagged that in month one, not month nine."
- Answers: catch what humans cannot hold (Miguel).
- Honesty: the reasoning chain and source are real structure; the chip is baseline.

### Beat 3: the action inbox (operating)
- Action: type "show me what needs my attention across the portfolio." The action inbox assembles: triaged flags, each routed by role, each with a recommendation, a confidence chip, a source, and accept / edit / reject (the `mox_01_command` "needs your call" pattern). On `Yardi_Work-Orders-RV50-1.png` the same layer pulls ABC Plumbing history, drafts a reply, and codes the invoice to deposit.
- Say: "You do not drown in flags. You get an inbox of decisions, routed to the right person, each with its reasoning and its source."
- Answers: what do we do with the flags, who manages them across fifty deals (Felicia).
- Deposit-loop moment: accept or edit one item, then say: "and that correction just taught the system. It gets less wrong every month, and you own that learning." The chip stays baseline; the narration is that this is how it earns over time, on your book. Do not flip a representative number to calibrated.

### Transition
- Deliver the transition line. Switch to the Nelray hero data.

### Beat 4: walk the building (deal, real data) — the spatial twin at `/twin`
- Action: load the spatial twin at **`/twin`**. **Building view** (the active surface):
  a hero gallery of curated renderings + exterior elevations rendered from the
  operator's real Revit model, the **labeled APS drop-in slot** ("Live 3D model —
  wiring on APS activation"), building-level floor plans, the composed ground-truth
  layer (parcel / zoning / code / flood, each fact chipped + drillable), and the
  **MF-3 entitlement finding reachable from the building level**. Then switch to
  **Unit drill-down** ("vet the proposed building" → "open a unit"): pick a unit type,
  click a **room chip** (Bed 1, MSTR, Kitchen, etc.) — its **floor plan + interior
  elevation** load alongside the composed atom panel (spatial unit metadata + seeded
  operating layer + ground-truth layer), every fact with a provenance chip.
- Say: "This is the proposed building, the real model. Every unit is an atom. Above it sits the parcel and the code, the ground truth we bring that you could never build yourself." Then the finding: "and here is what the system caught. This is a five-story building on MF-3 land, which caps at forty feet and thirty-six units an acre. It needs a rezoning to MF-4 or a variance, flagged before you ever submit."
- Answers: the digital twin Miguel asked for, and the property-intelligence differentiator.
- Honesty (RECONCILED — important): the spatial face is the **asset-based twin
  (renderings / elevations / plans)**; the live APS SVF2 3D viewer is BLOCKED on an
  Autodesk account-level entitlement (AUTH-001) and is staged as a **labeled drop-in
  slot**, NOT a live 3D render — do not present the slot as a working 3D viewer. The
  building atom and per-room geometry are **provisional pending APS extraction (WS-1
  Part A)**, stated on-surface. Representative data; the entitlement finding carries
  the §25-2-562 code citation and an as-of date (2026-06-13); chip baseline. Verify
  the MF-4 (§25-2-564, 60 ft) height and variance path through the substrate before
  showing.

### Beat 5: generate the LP view (deal, real data)
- Action: type "generate the LP view for this deal." The investor room assembles: hero renderings, an underwrite and return summary with a provenance chip on every number drilling to its source, the entitlement and plan-review section (the MF-3 finding plus the proposed-building review against Austin code, cited findings), and the "what an LP gets" framing.
- Say: "This is what you hand an LP instead of a static PDF. Every number traces to its source. The code risk on the parcel is already vetted. That is jurisdictional diligence no other GP can show, and it is what lowers your cost of capital."
- Answers: land more investors, provable not asserted (Miguel and Sean).
- Honesty: a generated, cited artifact, not the live revocable LP room (gated on the auth build). We provide the provenance infrastructure; the GP makes the representations. Do not present it as certifying returns.

### Close
- Deliver the close line.

## Audience matching (who is in the room)

- Miguel (CEO, buys outcomes): substrate, atoms that travel, data rails, the digital twin, own-it-forever.
- Sean (CFO, grades ROI): verifiable, cited, before-and-after, the provenance drill, lower cost of capital.
- Felicia / operations: no new system, the assist gives before it captures, the action inbox.
- Beau / IT: data sovereignty, you can swap us out, read-only on Yardi, nothing migrates.

Avoid: "AI for property management" (sounds like the chatbots), "replace your PMS" (the red line), "train your team on AI," "vector database / embeddings / RAG." Drop the "five lenses / agents watching agents" framing in front of finance and IT.

## Demo-day logistics

- Run local off your own device on the frame TV, not through the room's Teams screen share (the last meeting lost five minutes and its momentum to that).
- Have a recorded backup of the five beats in your pocket.
- Rehearse the open, transition, and close lines until they are muscle memory.
