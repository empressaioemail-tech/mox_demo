# Demo run sheet and framing copy

> The rehearsal doc and the demo-day script. This was the front half of WS-7: it locked the narrative and the honesty framing before the surfaces were finalized.
>
> **CANONICAL-AUTHORITY NOTE (2026-06-13, iteration 2 — engine/RBAC/redaction/Sketchfab pass).** This doc remains canonical for the **framing lines** (Open / Transition / Close, below), the **confidence-chip rules**, the **differentiation thread**, and the **audience matching** — use those verbatim. For the **intent-by-intent component assembly and the surface-by-surface beat mapping**, the canonical source is **`docs/narrative/hero_script_runsheet.md`**, reconciled cell-by-cell against the live engine output (same-origin POST `/api/intent`) and the built surfaces. Iteration-2 facts that shipped, reconciled below: (1) the engine is SELF-CONTAINED via same-origin Next.js API routes (no separate backend); (2) the **as-built guided walkthrough is five beats** — **open-yardi → spatial-twin → open-unit → adaptive-command → investor-room** (`frontend/src/components/walkthrough/beats.ts`), driven by **persistent header walkthrough controls + a role switcher** on every surface; (3) the spatial twin's 3D face is a **Sketchfab rendered, navigable embed** of the proposed design (staged behind `NEXT_PUBLIC_SKETCHFAB_MODEL_ID`, graceful fallback when unset) — NOT APS, NOT live tenant data; (4) **RBAC** redacts tenant-private operating internals for the external LP role, and the **investor room adds operator redact/replace** controls. The legacy operating-first beat sketch (catch-the-leak / action-inbox) lives on the Yardi overlay + command surface and is folded into the beats below. If this doc and `hero_script_runsheet.md` ever conflict on assembly/surfaces, `hero_script_runsheet.md` wins.

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

## The five beats (as-built guided walkthrough)

The guided walkthrough (`frontend/src/components/walkthrough/beats.ts`) drives these
five beats in order. The header carries persistent walkthrough controls (start / prev
/ next / exit + beat indicator) and the role switcher on every surface, so the demo is
always drivable. The legacy operating beats (catch-the-leak, action inbox) are not
separate walkthrough stops — they live on the Yardi overlay and the command surface
and are reachable as the operating story within beats 1 and 4.

### Beat 1 — open-yardi (`/yardi`)
- Action: open on the Yardi surface with the intelligence layer riding on top. The
  overlay surfaces one in-context insight with a source and a baseline confidence chip
  (atom-derived, read-only over a static screenshot). The verbatim opening line renders
  here (`<NarrativeFrame variant="open" />`).
- Say (verbatim, the Open line): "The engine is real. The data is representative,
  shaped like yours. Wiring it to your Yardi is what the first phase does." Then: "This
  is your Yardi. Untouched. Watch what our layer adds." The operating story (the
  water-leak catch, the action inbox) lives in this overlay and the command surface.
- Answers: the rip-and-replace fear (Felicia). Nobody migrates.
- Honesty: the overlay is atom-derived, not screen-scraping (guardrail 4). It reads,
  assists, and captures to our core — it never writes back into Yardi (guardrail 6).
  Chip baseline.

### Beat 2 — spatial-twin (`/twin`, Building view)
- Action: pull back to the proposed building. The 3D slot is a **Sketchfab rendered,
  navigable embed** of the proposed design (or a graceful "rendered 3D model — wiring
  up" fallback when no model id is set). Then the hero gallery of curated renderings +
  elevations (the active asset-based twin), building-level floor plans, the composed
  ground-truth layer (parcel / zoning / code / flood, each fact chipped + drillable),
  and the **MF-3 entitlement finding reachable from the building level**.
- Say (Transition line, then): "This is the proposed building, the real model. Above it
  sits the parcel and the code, the ground truth we bring that you could never build
  yourself." Then the finding: "a five-story building on MF-3 land, which caps at forty
  feet and thirty-six units an acre. It needs a rezoning to MF-4 or a variance, flagged
  before you ever submit."
- Answers: the digital twin Miguel asked for, and the property-intelligence differentiator.
- Honesty (IMPORTANT): the 3D face is a **Sketchfab RENDERING of the proposed design**
  — NOT APS, NOT a measured as-built, NOT live tenant data
  (`ApsViewerSlot.tsx` / `SketchfabEmbed.tsx`). Do not present it as a live APS/Revit
  viewer. The building atom geometry/URN and per-room geometry are **provisional pending
  the APS Model Derivative backfill (WS-1 Part A)**, stated on-surface. The entitlement
  finding carries the §25-2-562 code citation + as-of date (2026-06-13); chip baseline.
  Verify the MF-4 (§25-2-564, 60 ft) height and variance path before showing.

### Beat 3 — open-unit (`/twin`, Unit drill-down)
- Action: switch to Unit drill-down, pick a unit type (Typical 2BR / 1BR), and click a
  **room chip** (Bed 1, MSTR, Kitchen, etc.) — its floor plan + interior elevation load
  alongside the composed atom panel: spatial unit metadata + the (tenant-private)
  operating layer + the ground-truth layer, every fact with a provenance chip + drill.
- Say: "Every unit is an atom. Click in and you walk it room by room — the space, its
  operating layer, and the ground truth stacked above it, each fact carrying its source."
- Honesty: plan/elevation imagery is curated Revit export, NOT a live 3D view; room
  geometry is provisional pending APS extraction. The operating layer is representative
  seed, tenant-private, never pooled — and is **RBAC-gated** (`RoleGate
  resource="operating-internals"`), so switching the header role to LP blacks it out
  while the space + ground truth stay.

### Beat 4 — adaptive-command (`/command`)
- Action: type an intent; the engine selects, orders, and populates components live,
  each carrying provenance + confidence. The action inbox routes flags by role.
- Deposit-loop moment: accept or edit one flagged item, then: "and that correction just
  taught the system. It gets less wrong every month, and you own that learning." The
  chip stays baseline; the loop records a SIGNAL (client-accumulated, stateless), it
  does NOT relabel a number as calibrated (guardrail 2).
- RBAC moment: switch the header role to Investor / LP and the operating / financial
  views visibly redact (`RoleGate`), while public ground truth + the investor rollup
  stay. Say: "Mox controls who sees what — an external partner never sees the operating
  internals."
- Answers: catch what humans cannot hold (Miguel); who manages the flags across the
  portfolio (Felicia).
- Honesty: reasoning chain + source are real structure; chips baseline; no write-back.

### Beat 5 — investor-room (`/investor`)
- Action: "generate the LP view for this deal." The room assembles (live, same-origin
  engine): hero renderings, the underwrite / return summary (a provenance chip on every
  number, each drilling to source), the MF-3 entitlement / plan-review section, and the
  de-risking ledger.
- Redaction moment (operator): use the per-field Show / Redact / Replace controls to
  redact or replace a sensitive line — e.g. replace the list price with the
  representative band `~$4–5M`, or the exact address with "North Loop, Austin TX".
- Role-switch moment (preview as LP): switch the header role to Investor / LP. Redacted
  fields black out; replaced fields show the representative substitute with an amber
  "representative" chip; operating internals redact. "This is exactly what the LP
  receives — the curated, cited view, never tenant-private operating internals."
- Say: "This is what you hand an LP instead of a static PDF. Every number traces to its
  source. The code risk on the parcel is already vetted — jurisdictional diligence no
  other GP can show, and it is what lowers your cost of capital."
- Answers: land more investors, provable not asserted (Miguel and Sean).
- Honesty: a generated, cited artifact, not the live revocable LP room (gated on the
  auth build). We provide the provenance infrastructure; the GP makes the
  representations. Do not present it as certifying returns. Replace values are always
  clearly representative (ranges / rounded / labeled), never a fabricated exact figure.
  Presenter caveat: the lineage drill on the underwrite is currently role-blind (see
  honesty audit FIX-NEEDED #1) — avoid drilling the pro-forma atom while in LP role
  until that ships.

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
