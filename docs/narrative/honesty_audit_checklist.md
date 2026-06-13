# Honesty audit checklist

> **FINAL WS-7 CROSS-SURFACE RE-AUDIT — COMPLETE (2026-06-13, asset-twin pass).**
> Re-audited against the hero + context surfaces as actually built (frontend/src +
> frontend/public), NOW INCLUDING the new asset-based spatial twin at `/twin`, with
> the engine running live on http://localhost:8787 (providerMode: mock, 14 atoms).
> Each per-surface cell below is a real PASS / FAIL / FIX-NEEDED with the file/line
> or copy that satisfies or violates the guardrail.
>
> **What changed since the prior pass (verified against code, not assumed):**
>   - **Guardrail-5 Yardi blocker is RESOLVED.** `frontend/src/app/yardi/page.tsx:29`
>     now mounts `<NarrativeFrame variant="open" />`, and the home hub
>     `frontend/src/app/page.tsx:49` mounts it too. The verbatim
>     `OPENING_FRAMING_LINE` ("The engine is real. The data is representative,
>     shaped like yours. Wiring it to your Yardi is what the first phase does.",
>     locked at `NarrativeFrame.tsx:25-26`) now renders on the Yardi open beat. The
>     prior FIX-NEEDED #1 is closed.
>   - **NEW SURFACE — spatial twin (`/twin`).** Built on the operator's REAL building
>     assets (curated renderings/elevations/floor plans/interior elevations under
>     `frontend/public/twin/` + reused `public/renderings/`), composed with the twin
>     atoms (`frontend/src/components/twin/atoms/`). The live APS SVF2 viewer is
>     BLOCKED on an Autodesk account-level entitlement (AUTH-001 on all scopes,
>     fresh app included) and is staged as a labeled drop-in slot
>     ("Live 3D model — wiring on APS activation.", `ApsViewerSlot.tsx:16`). Audited
>     below against all six guardrails.
>
> Scope of the audit: six surface groups.
>   - **Adaptive command** (intent bar + assembler) — WS-3
>   - **Yardi layer** (overlay on screenshots, read+assist+capture) — WS-3
>   - **Spatial twin** (`/twin`: asset-based hero + APS drop-in slot + twin atoms) — WS-4
>   - **Investor room** (provenance rollup + plan review) — WS-5
>   - **Six context surfaces** (command center, Manage, Invest, BLDR, extension, flywheel) — WS-6

## FIX-NEEDED summary (dispatch these)

> **ZERO hard guardrail violations across all six surface groups (including `/twin`).**
> The prior guardrail-5 Yardi blocker (old #1) is RESOLVED. The remaining entries are
> the minor command-page note (no longer a blocker) and the mitigated context-mockup
> "calibrated" labels. Nothing here blocks deploy.

1. **RESOLVED (was the blocker) — Yardi opening framing line now verbatim
   (guardrail 5).** `frontend/src/app/yardi/page.tsx:29` mounts
   `<NarrativeFrame variant="open" />`, which renders the verbatim
   `OPENING_FRAMING_LINE` (`NarrativeFrame.tsx:25-26,53-55`) before the first beat;
   the home hub (`frontend/src/app/page.tsx:49`) carries it too. Confirmed verbatim:
   *"The engine is real. The data is representative, shaped like yours. Wiring it to
   your Yardi is what the first phase does."* No change required.

2. **Adaptive command — opening line paraphrased, not verbatim (guardrail 5, minor,
   NOT a blocker).** `frontend/src/app/command/page.tsx:20-26` states "The engine is
   real. The data is representative, shaped like yours." then diverges ("Type an
   intent and the engine selects…") — it does NOT render the verbatim third clause
   nor `<NarrativeFrame variant="open" />`. Command is mid-arc (beat 3) and the demo
   entry beats (Yardi + home) both now carry the verbatim line, so this is
   acceptable. **Optional change (only if command ever becomes the demo entry
   surface):** add `<NarrativeFrame variant="open" />`. Logged for completeness.

3. **Context surfaces — internal "calibrated" labels in the imported mockups
   (guardrails 1 & 2, MITIGATED — verify the mitigation is acceptable).** The six
   imported HTML mockups contain hard-coded copy that reads as earned-calibration on
   representative numbers:
     - `frontend/public/context/mox_04_invest.html:179` — "Underwrite confidence:
       calibrated" + "Expense load reflects what Mox actually delivers."
     - `frontend/public/context/mox_01_command.html:195` — row "Underwrite
       confidence: **calibrated**".
     - `frontend/public/context/mox_01_command.html:213` — "Calibrated against 1,840
       actual renew or churn outcomes".
     - `frontend/public/context/mox_03_manage.html:186` — "Calibrated against 38
       confirmed invoices across 9 communities".
     - `frontend/public/context/mox_06_flywheel.html:89` — "The contribution does not
       just accumulate, it calibrates … gets less wrong every month".
   **Mitigation in place:** every context surface injects a prominent banner —
   `frontend/public/context/*.html` (mox_01:127, mox_02:96, mox_03:104, mox_04:118,
   mox_05:107, mox_06:47): *"Representative data · illustrative, not yet calibrated on
   Mox outcomes"* — plus the index/chrome banners
   (`frontend/src/app/context/page.tsx:34-39`,
   `frontend/src/components/context/ContextFrame.tsx:42-45`). The banner explicitly
   frames the whole surface as not-yet-calibrated, which is exactly what guardrail 1's
   context-surface bar requires ("clearly framed as representative"). **Verdict:
   PASS-with-mitigation.** No code change required UNLESS the orchestrator wants the
   internal "calibrated" word neutralized in the mockup copy for belt-and-suspenders;
   if so, that is a WS-6 edit (not WS-7's lane). Recorded here so the decision is
   explicit rather than silent.

No hard guardrail VIOLATIONS were found in ANY live surface (command, Yardi overlay,
spatial twin `/twin`, investor room, context): no bare number presented as earned, no
Yardi write-back claim, no live-LP-room claim, no false "live APS/Revit 3D viewer"
claim, and confidence is never rendered without state. The prior verbatim-line gap
(old #1, Yardi open beat) is now resolved.

---

## The six guardrails

1. **Confidence shown with its state visible.** Every surfaced number carries a
   `ConfidenceChip` with an explicit state (`baseline` / `provenance-backed` /
   `earned-through-outcome`). No bare numbers presented as earned.
2. **Deposit-loop shows the earning loop is live**, not that displayed numbers are
   already calibrated.
3. **Investor room is a generated, cited artifact**, not the live revocable LP
   umbilical (gated on the auth build).
4. **The Yardi intelligence layer is the surface of the twin**, atom-derived — not
   DOM scraping.
5. **Opening framing line present** at open (verbatim, `framing.md`).
6. **No live-bidirectional-Yardi claim anywhere.** Read + assist + capture only;
   write-back is a roadmap item gated on a licensed interface.

> **Twin-specific honesty (new this pass):** the `/twin` surface must NOT misrepresent
> itself as a live APS/Revit 3D viewer. The asset-based hero (renderings/elevations/
> plans) is the ACTIVE twin; the live-3D viewer is a labeled, staged drop-in slot
> pending Autodesk account entitlement. Both the APS drop-in slot and the APS
> extraction (WS-R / WS-1 Part A, which backfills geometry/URN/areas) must be clearly
> labeled as pending. **Verified PASS:** `BuildingView.tsx:88` states "This
> asset-based twin is the active spatial face — it is NOT a live APS/Revit viewer.";
> the slot label is fixed verbatim "Live 3D model — wiring on APS activation."
> (`ApsViewerSlot.tsx:16,55-60`); the building atom is `provisional` with the APS
> block spelled out (`building.json:7-8,18-22,55-58`); units carry the
> "backfill from the APS Model Derivative (WS-1 Part A)" note (`UnitDrilldown.tsx:176-180`).

> Enforcement primitive: `frontend/src/components/library/ConfidenceChip.tsx` makes
> the `state` prop REQUIRED (line 53) and has no path to render a value without a
> state. The engine emits a 4th state `provisional`, which the adapters
> (`frontend/src/components/command/confidence.tsx:18-31`,
> `frontend/src/components/investor/engineClient.ts:118-126`) collapse to `baseline`
> (never upgraded), carrying the precise note in the chip title — honest.

---

## Guardrail 1 — every confidence value carries its state

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | Every KPI/anomaly/inbox value renders `ConfidenceChip` with a state; no bare numerals. | **PASS.** Every component header carries `LeadConfidenceChip` (`renderers.tsx:62,98,140,173,338,392,439`) → `EngineConfidenceChip` → shared `ConfidenceChip` (`confidence.tsx:34-50`). Plan-review/investor render the full chip row (`renderers.tsx:310,488`). KPI/variance metric *tiles* show the numeral with the state chip at card level + a "not yet measurable" guard for null metrics (`primitives.tsx:131-153`) — card-scoped state, no bare-earned number. No `earned-through-outcome` appears in live output (verified: states are baseline / provenance-backed / provisional only). |
| Yardi layer | Every overlay insight value carries a chip; state is `baseline`/`provenance-backed`. | **PASS.** The insight always renders a chip: live → `EngineConfidenceChip`, fallback → `<ConfidenceChip state="baseline" …>` (`AssistOverlay.tsx:165-173`). Fallback states are all `baseline` (`beats.ts:124,168,210,247,283`). Capture-span values (e.g. `occupancy: 94%`) are framed as the captured-decision payload, not asserted as earned metrics. |
| Spatial twin (`/twin`) | Every building/unit/ground-truth atom value carries a chip with state; entitlement finding chip is baseline; no bare numbers. | **PASS.** Every fact in `/twin` renders `ConfidenceChip` via `toChipState` (which collapses `provisional`→`baseline`, never upgrades, `atoms/index.ts:103-111`): building hero (`BuildingView.tsx:46-52`), ground-truth parcel/zoning/code/flood facts (`GroundTruthLayer.tsx:45-51,103-108`), spatial unit metadata (`UnitDrilldown.tsx:157-161`), operating pro-forma (`OperatingLayer.tsx:52-57`), and the entitlement finding `baseline=0.92` `verification="verified"` (`EntitlementFinding.tsx:70-76`, `entitlement-finding.json:77-82`). The lineage drawer re-renders the chip with state on drill (`LocalAtomDrill.tsx:119-124`). Provisional/seeded atoms (building=0.5 provisional, units, operating seed) are chipped baseline + carry an explicit provisional/seed note (`LocalAtomDrill.tsx:132-138`). The APS drop-in slot surfaces no numeric atom → nothing to chip (`ApsViewerSlot.tsx`). No `earned-through-outcome` anywhere in `/twin`. |
| Investor room | Every underwrite/return number carries a chip and drills to source. | **PASS.** Deal rollup, renderings, underwrite, and plan-review each render a section-level `ConfidenceChip` with `toChipState` (`InvestorRoom.tsx:127-133`, `HeroRenderings.tsx:102-108`, `UnderwriteSummary.tsx:57-63`, `PlanReviewFindings.tsx:112-119`). Every metric tile + ledger member carries a `DrillLink` to its source atom (`UnderwriteSummary.tsx:64,91,131`, `InvestorRoom.tsx:197`, `AtomDrill.tsx` drawer with chip at :161). |
| Six context surfaces | Representative numbers are chipped or clearly framed as representative; none read as earned-calibrated. | **PASS-with-mitigation (see FIX-NEEDED #3).** These are static imported mockups (not the chip system), so numbers are not individually chipped; instead each surface carries the injected banner "Representative data · illustrative, not yet calibrated on Mox outcomes" (`*.html` mox_01:127 / mox_02:96 / mox_03:104 / mox_04:118 / mox_05:107 / mox_06:47) plus chrome banners (`context/page.tsx:34-39`, `ContextFrame.tsx:42-45`). Internal "calibrated" labels (invest:179, command:195/213, manage:186) are framed not-yet-calibrated by the banner. |

## Guardrail 2 — deposit-loop reads as the live earning loop (not calibrated numbers)

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | Accept/edit at the inbox shows the loop turning; chips stay `baseline`; no number flips to `earned-through-outcome`. | **PASS.** `DepositLoop` (`DepositLoop.tsx`) POSTs `/api/calibration` and shows the signal/accept-edit-reject tallies; `CommandSurface.handleCalibrated` re-runs the intent so the surface reacts (`CommandSurface.tsx:58-60`). The reflection shows accept/edit/reject counts + a `signalLabel`, never relabels a value as earned. Confirmed live: no component returns `earned-through-outcome`. |
| Yardi layer | Capture moment frames learning-on-your-book, not pre-calibrated accuracy. | **PASS.** Capture POSTs `/api/calibration` (`AssistOverlay.tsx:104-123`); success text is "Captured to your core" / "earning loop live" / "your decision becomes calibrated history" (`AssistOverlay.tsx:241,265`, `beats.ts:115,154,196`). Framed as the loop turning on the operator's book, not as an already-calibrated number. |
| Spatial twin (`/twin`) | Deposit loop (now present on the finding) shows the loop turning, not pre-calibrated numbers; no false "calibrated" claim. | **PASS.** `/twin` now carries the deposit loop ON the entitlement finding: accept/edit/reject POSTs to `/api/calibration` when the engine is reachable, degrades to a local-intent note otherwise (`EntitlementFinding.tsx:40-50,119-184`, `engineClient.ts:47-70`). Copy is explicit: "The earning loop records your signal — it does not relabel the number as earned (guardrail 2). Calibration on Mox outcomes begins when your data is wired." (`EntitlementFinding.tsx:129-133`). Operating layer is "seeded pro forma … projected", "Representative seed values shaped like the operator's book, not actuals" (`OperatingLayer.tsx:45-49,74-77`); the finding atom states it is "NOT calibrated on Mox plan-review outcomes … never presented as earned-calibrated" (`entitlement-finding.json:81`). No number flips to earned. |
| Investor room | n/a — confirm returns are not framed as outcome-calibrated. | **PASS.** Underwrite is "seed pro forma" / "projected", with "representative seed numbers … not actuals or certified returns" (`UnderwriteSummary.tsx:46-73`). Plan-review copy: "The earning loop is live; it does not relabel the finding as earned-calibrated" (`PlanReviewFindings.tsx:194-199`). Close copy: "not yet calibrated on Mox's own outcomes" (`investor/page.tsx:81-87`). |
| Six context surfaces | Flywheel surface depicts the mechanism, not accrued calibration on representative data. | **PASS-with-mitigation.** `mox_06_flywheel.html:89` describes the mechanism ("the contribution … calibrates, so the core gets less wrong every month") — mechanism language, gated by the banner at :47. See FIX-NEEDED #3 for the invest/command "calibrated" labels. |

## Guardrail 3 — investor room is a generated, cited artifact

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | "generate the LP view" produces an artifact, not a live LP session. | **PASS.** Intent `generate the LP view` assembles `investor-rollup + plan-review-findings + renderings-panel + kpi-card + provenance-drill` (verified live, 5 components). The `investor-rollup` renderer states the full cited artifact is the investor room (`renderers.tsx:482-485`). No live-LP-session affordance. |
| Yardi layer | n/a. | **PASS (n/a).** Yardi surface makes no LP claim. |
| Spatial twin (`/twin`) | n/a (feeds the artifact; not the artifact). | **PASS (n/a).** The twin's renderings/atoms/finding feed the investor room; `/twin` makes no LP-room or live-LP claim. The operating pro-forma is explicitly tenant-private and "never pooled into shared ground truth" (`OperatingLayer.tsx:74-77`). |
| Investor room | Reads as generated + cited; no live revocable LP umbilical; does not certify returns; GP makes representations. | **PASS.** Server-assembled from the engine (`investor/page.tsx:16`, `engineClient.ts:34-50`), badge "Generated, cited artifact" (`investor/page.tsx:30-33`), explicit "it is not the live, revocable LP data room (that ships with the auth build)… does not certify returns" (`investor/page.tsx:41-50`), "Provenance infrastructure is ours; the representations are the GP's" (`UnderwriteSummary.tsx:97-101`, `PlanReviewFindings.tsx:196-199`). Engine-unreachable state refuses to fabricate (`investor/page.tsx:55-71`). |
| Six context surfaces | Invest surface does not imply a live LP data feed. | **PASS.** `mox_04_invest.html` is a static representative mockup under the banner; no live-LP-feed claim. |

## Guardrail 4 — Yardi layer is the surface of the twin (not DOM scraping)

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | Overlay insights sourced from atoms, not scraped DOM. | **PASS.** Command consumes engine `/api/intent` (atom-derived); no scraping path exists. |
| Yardi layer | Overlay is atom-derived on top of static screenshots; copy never claims scraping. | **PASS.** Overlay hydrates from `submitIntent` and reads the named component (`AssistOverlay.tsx:49-93`); screenshots are `next/image` static assets shown read-only/dimmed (`YardiIntelligenceLayer.tsx:63-69`). Copy: "its intelligence is read from our atom store and engine, not scraped from the page" (`YardiIntelligenceLayer.tsx:116-122`); source line uses the live provenance citation (`AssistOverlay.tsx:96-102`). No grep hit for "scrape/scraping" in the live surfaces. |
| Spatial twin (`/twin`) | n/a (not a Yardi surface); twin atoms are substrate/asset-derived, not scraped; honesty — the asset twin must NOT pose as a live APS/Revit 3D viewer. | **PASS.** Ground truth is "Substrate-derived. Every fact drills to its atom." (`GroundTruthLayer.tsx:83-85`); imagery is curated Revit exports, not scraped. Twin honesty holds: "This asset-based twin is the active spatial face — it is NOT a live APS/Revit viewer." (`BuildingView.tsx:84-89`); the live-3D viewer is the labeled drop-in slot "Live 3D model — wiring on APS activation." (`ApsViewerSlot.tsx:16,55-60`). No scraping path; no false-live-viewer claim (grep for live-viewer / scrape phrases in `components/twin` returned no hits). |
| Investor room | n/a. | **PASS (n/a).** |
| Six context surfaces | Extension surface framed as assist layer, not a scraper. | **PASS.** `mox_02_extension.html` framed as the assist/capture layer ("Captured to your core", :171); no scraping claim. surfaces.ts blurb: "the intelligence layer riding on top of Yardi" (`surfaces.ts:28`). |

## Guardrail 5 — opening framing line present at open

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | `NarrativeFrame variant="open"` (or the verbatim line) shown before intent 1; matches `OPENING_FRAMING_LINE`. | **PASS-with-note (#2, not a blocker).** `command/page.tsx:20-26` paraphrases the first two clauses, not verbatim, and does not mount `<NarrativeFrame variant="open" />`. Acceptable: command is mid-arc and the demo entry beats (Yardi + home) both carry the verbatim line. Optional fix only if command ever becomes the entry surface. |
| Yardi layer | Open beat carries the verbatim framing line. | **PASS (RESOLVED — was the FIX-NEEDED blocker).** `frontend/src/app/yardi/page.tsx:29` now mounts `<NarrativeFrame variant="open" />`, rendering the verbatim `OPENING_FRAMING_LINE` ("The engine is real. The data is representative, shaped like yours. Wiring it to your Yardi is what the first phase does.", `NarrativeFrame.tsx:25-26,53-55`) before the first beat. The home hub mounts it too (`page.tsx:49`). The prior paraphrase in the header still stands as supporting copy, but the verbatim line now renders. |
| Spatial twin (`/twin`) | n/a (mid-arc, beat 2); framing not contradicted. | **PASS (n/a).** `/twin` is mid-arc and does not need the open line; its framing is consistent — "The data is representative; the engine and the substrate-derived ground truth are real." (`twin/page.tsx:29-38`). |
| Investor room | Closing copy present after intent 5 (`framing.md` close). | **PASS.** `<NarrativeFrame variant="close">` rendered at the foot of the room (`investor/page.tsx:73-88`) with close prose (ground-truth de-risking + "not yet calibrated"). It is a faithful condensation of `framing.md`'s close, not verbatim — acceptable per `NarrativeFrame` design (close copy is passed in, only the OPEN line is verbatim-locked). |
| Six context surfaces | Framing not contradicted (numbers labeled representative). | **PASS.** Every surface labeled "Representative data" (banners cited under G1). Framing not contradicted; the "calibrated" labels are the mitigated item (#3). |

## Guardrail 6 — no live-bidirectional-Yardi claim anywhere

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | No copy/affordance implies writing back to Yardi; capture is local to the spine. | **PASS.** Deposit loop writes to `/api/calibration` (our core); no Yardi write affordance anywhere in command. |
| Yardi layer | Explicitly read + assist + capture; write-back framed as roadmap gated on licensed interface. | **PASS.** "It reads, assists, and captures to your core; it never writes back into Yardi" (`YardiIntelligenceLayer.tsx:116-122`, `yardi/page.tsx:20-26`); draft-reply note "sending happens in your mail client. Mox does not write back into Yardi" (`AssistOverlay.tsx:228-231`); capture is "to OUR core only" (`beats.ts:11-13`). |
| Spatial twin (`/twin`) | No unit/operating sync-to-Yardi or write-back claim. | **PASS.** No sync/write/bidirectional/two-way claim anywhere in `frontend/src/components/twin` (grep returned no hits). The deposit loop on the finding writes only to OUR `/api/calibration` (`EntitlementFinding.tsx:40-50`, `engineClient.ts:56`), never to Yardi; the operating layer is tenant-private and explicitly "never pooled" (`OperatingLayer.tsx:74-77`). |
| Investor room | No claim that the artifact pushes to/pulls live from Yardi. | **PASS.** Room assembles from our engine only; no Yardi push/pull claim. |
| Six context surfaces | No surface promises bidirectional automation. | **PASS.** Grep for `sync to Yardi` / `write.back` / `two-way` / `bidirectional` across `frontend/public/context` returned no hits. Extension surface is capture-to-core only. |

---

## Cross-cutting checks (whole demo)

- [x] **Opening line:** verbatim OPEN line is locked in `NarrativeFrame.tsx:25-26`, used verbatim in the investor close-frame component, AND now mounted on the demo's open beat — `<NarrativeFrame variant="open" />` renders on the Yardi surface (`yardi/page.tsx:29`) and the home hub (`page.tsx:49`). Closing copy present (`investor/page.tsx:73-88`). **PASS (was PARTIAL; old fix #1 resolved).**
- [x] **Three differentiation points woven in, not bolted on** (`differentiation.md`): point 1 (treatment-not-data) lands via per-number `ConfidenceChip` + `DrillLink` everywhere (now including the `/twin` ground-truth/unit/finding facts); point 2 (two flywheels) lands at the deposit-loop in command/Yardi AND the `/twin` finding + the flywheel context surface; point 3 (ground truth already built) lands in the plan-review finding (MF-3 40 ft / 36 u-ac → MF-4 §25-2-564 60 ft, as-of 2026-06-13) reachable from the building level of `/twin` (`EntitlementFinding.tsx`, `entitlement-finding.json`) AND in the investor room. **PASS.**
- [x] **`hero_script_runsheet.md` reconciled against built component names** — done; run sheet updated (intent-by-intent assembly now matches live engine output). **PASS.**
- [x] **Forbidden-phrase grep** ("sync to Yardi", "write back to Yardi", "two-way", "live LP", "certified returns", bare "AI for property management"): only benign hits — a guardrail comment (`NarrativeFrame.tsx:13`) and a negation ("not … certified returns", `UnderwriteSummary.tsx:71`). The internal mockup "calibrated" labels are the separate mitigated item (#3). **PASS** (no forbidden phrase asserted as true).
- [x] **Every `ConfidenceChip` passes a `state`** — enforced by required prop (`ConfidenceChip.tsx:53`); no `as any` bypass found; the `provisional`→`baseline` collapse is explicit and downward-only (never upgrades). **PASS.**

## Audit status

**COMPLETE (2026-06-13, asset-twin re-audit).** All six surface groups — adaptive
command, Yardi layer, **spatial twin (`/twin`)**, investor room, and the six context
surfaces — clear all six guardrails. **ZERO hard guardrail violations.** The prior
guardrail-5 Yardi blocker is RESOLVED (verbatim `OPENING_FRAMING_LINE` now mounted on
the Yardi open beat + home hub). The new `/twin` surface passes all six: confidence
chips carry state everywhere, every fact drills to a cited atom, it does NOT pose as a
live APS/Revit 3D viewer (the asset-based hero is the active twin; the live-3D slot and
the APS extraction WS-R/WS-1 Part A are clearly labeled pending Autodesk entitlement),
and the MF-3 entitlement finding is reachable from the building level with citation +
as-of date.

Nothing blocks deploy. Two non-blocking items remain logged (NOT edited here —
cross-lane):
- **#2 (WS-3, minor, optional):** the command page paraphrases the open line and does
  not mount `<NarrativeFrame variant="open" />`; only needed if command ever becomes
  the demo entry surface (the Yardi + home open beats already carry the verbatim line).
  No file:line fix required for deploy.
- **#3 (WS-6, judgment call):** internal "calibrated" labels in the imported context
  mockups are framed by the per-surface "Representative data … not yet calibrated"
  banner (PASS-with-mitigation); neutralize the word in mockup copy only if
  belt-and-suspenders is wanted.

(Old #1 — the Yardi open-beat verbatim-line blocker — is CLOSED.)
