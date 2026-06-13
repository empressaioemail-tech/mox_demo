# Honesty audit checklist

> **FINAL WS-7 CROSS-SURFACE AUDIT — COMPLETE (2026-06-13).** Audited against the
> hero + context surfaces as actually built (frontend/src + frontend/public/context),
> with the engine running live on http://localhost:8787 (providerMode: mock). Each
> per-surface cell below is a real PASS / FAIL / FIX-NEEDED with the file/line or
> copy that satisfies or violates the guardrail.
>
> Scope of the audit: the five surface groups.
>   - **Adaptive command** (intent bar + assembler) — WS-3
>   - **Yardi layer** (overlay on screenshots, read+assist+capture) — WS-3
>   - **Spatial twin** (APS viewer + twin atoms) — WS-4
>   - **Investor room** (provenance rollup + plan review) — WS-5
>   - **Six context surfaces** (command center, Manage, Invest, BLDR, extension, flywheel) — WS-6

## FIX-NEEDED summary (dispatch these)

1. **Yardi layer — missing verbatim opening framing line (guardrail 5).**
   `frontend/src/app/yardi/page.tsx:20-26` and
   `frontend/src/components/yardi/YardiIntelligenceLayer.tsx:116-122` paraphrase the
   framing ("It never writes back into Yardi"; "Wiring it to your live Yardi is what
   the first phase does") but never render the verbatim `OPENING_FRAMING_LINE` /
   `<NarrativeFrame variant="open" />`. The run sheet opens the *whole demo* on the
   Yardi beat (beat 1), and guardrail 5 + the run sheet require the verbatim line at
   open. **Required change:** render `<NarrativeFrame variant="open" />` (from
   `@/components/library`) at the top of the Yardi surface (or the agreed demo entry
   surface), so the verbatim line appears before the first beat. NOTE: this is the
   only surface intended as the demo-open that does not carry the verbatim line —
   the command page paraphrases it too (see below) but is mid-arc, so the binding
   fix is the Yardi open beat.

2. **Adaptive command — opening line paraphrased, not verbatim (guardrail 5, minor).**
   `frontend/src/app/command/page.tsx:21-26` states "The engine is real. The data is
   representative, shaped like yours." then diverges ("Type an intent and the engine
   selects…") — it does NOT render the verbatim third clause ("Wiring it to your
   Yardi is what the first phase does") nor `<NarrativeFrame variant="open" />`.
   Command is mid-arc (beat 3), so this is acceptable IF the Yardi open beat (item 1)
   carries the verbatim line. **Required change (only if command is ever the demo
   entry surface):** add `<NarrativeFrame variant="open" />`. Otherwise leave as-is —
   logged for completeness, not a blocker.

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

No hard guardrail VIOLATIONS were found in the live hero surfaces (command, Yardi
overlay, investor room): no bare number presented as earned, no Yardi write-back
claim, no live-LP-room claim, and confidence is never rendered without state. The
only verbatim-line gap is item 1 (the Yardi open beat).

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
| Spatial twin | Every unit/ground-truth atom value carries a chip; plan-review finding chip is baseline. | **PASS (twin-as-built).** The standalone APS viewer is `frontend/src/components/aps/ApsViewerSlot.tsx` (slot/placeholder, no numeric atoms surfaced → nothing to chip). The twin's *data* renders through the command `unit-twin-viewer` (`renderers.tsx:330-379`): card-level `LeadConfidenceChip`, units marked `provisional · pending APS`, spatial ref labelled placeholder. Plan-review finding chip is `baseline=0.92` with `verification="verified"` (`renderers.tsx:310`, `PlanReviewFindings.tsx:112-119`). |
| Investor room | Every underwrite/return number carries a chip and drills to source. | **PASS.** Deal rollup, renderings, underwrite, and plan-review each render a section-level `ConfidenceChip` with `toChipState` (`InvestorRoom.tsx:127-133`, `HeroRenderings.tsx:102-108`, `UnderwriteSummary.tsx:57-63`, `PlanReviewFindings.tsx:112-119`). Every metric tile + ledger member carries a `DrillLink` to its source atom (`UnderwriteSummary.tsx:64,91,131`, `InvestorRoom.tsx:197`, `AtomDrill.tsx` drawer with chip at :161). |
| Six context surfaces | Representative numbers are chipped or clearly framed as representative; none read as earned-calibrated. | **PASS-with-mitigation (see FIX-NEEDED #3).** These are static imported mockups (not the chip system), so numbers are not individually chipped; instead each surface carries the injected banner "Representative data · illustrative, not yet calibrated on Mox outcomes" (`*.html` mox_01:127 / mox_02:96 / mox_03:104 / mox_04:118 / mox_05:107 / mox_06:47) plus chrome banners (`context/page.tsx:34-39`, `ContextFrame.tsx:42-45`). Internal "calibrated" labels (invest:179, command:195/213, manage:186) are framed not-yet-calibrated by the banner. |

## Guardrail 2 — deposit-loop reads as the live earning loop (not calibrated numbers)

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | Accept/edit at the inbox shows the loop turning; chips stay `baseline`; no number flips to `earned-through-outcome`. | **PASS.** `DepositLoop` (`DepositLoop.tsx`) POSTs `/api/calibration` and shows the signal/accept-edit-reject tallies; `CommandSurface.handleCalibrated` re-runs the intent so the surface reacts (`CommandSurface.tsx:58-60`). The reflection shows accept/edit/reject counts + a `signalLabel`, never relabels a value as earned. Confirmed live: no component returns `earned-through-outcome`. |
| Yardi layer | Capture moment frames learning-on-your-book, not pre-calibrated accuracy. | **PASS.** Capture POSTs `/api/calibration` (`AssistOverlay.tsx:104-123`); success text is "Captured to your core" / "earning loop live" / "your decision becomes calibrated history" (`AssistOverlay.tsx:241,265`, `beats.ts:115,154,196`). Framed as the loop turning on the operator's book, not as an already-calibrated number. |
| Spatial twin | n/a (no deposit loop here) — confirm no false "calibrated" claim. | **PASS.** `ApsViewerSlot.tsx` and the `unit-twin-viewer` renderer carry no "calibrated" claim; units are `provisional · pending APS` (`renderers.tsx:352-356`). |
| Investor room | n/a — confirm returns are not framed as outcome-calibrated. | **PASS.** Underwrite is "seed pro forma" / "projected", with "representative seed numbers … not actuals or certified returns" (`UnderwriteSummary.tsx:46-73`). Plan-review copy: "The earning loop is live; it does not relabel the finding as earned-calibrated" (`PlanReviewFindings.tsx:194-199`). Close copy: "not yet calibrated on Mox's own outcomes" (`investor/page.tsx:81-87`). |
| Six context surfaces | Flywheel surface depicts the mechanism, not accrued calibration on representative data. | **PASS-with-mitigation.** `mox_06_flywheel.html:89` describes the mechanism ("the contribution … calibrates, so the core gets less wrong every month") — mechanism language, gated by the banner at :47. See FIX-NEEDED #3 for the invest/command "calibrated" labels. |

## Guardrail 3 — investor room is a generated, cited artifact

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | "generate the LP view" produces an artifact, not a live LP session. | **PASS.** Intent `generate the LP view` assembles `investor-rollup + plan-review-findings + renderings-panel + kpi-card + provenance-drill` (verified live, 5 components). The `investor-rollup` renderer states the full cited artifact is the investor room (`renderers.tsx:482-485`). No live-LP-session affordance. |
| Yardi layer | n/a. | **PASS (n/a).** Yardi surface makes no LP claim. |
| Spatial twin | n/a (feeds the artifact; not the artifact). | **PASS (n/a).** Renderings/twin feed the room; no LP claim in the twin. |
| Investor room | Reads as generated + cited; no live revocable LP umbilical; does not certify returns; GP makes representations. | **PASS.** Server-assembled from the engine (`investor/page.tsx:16`, `engineClient.ts:34-50`), badge "Generated, cited artifact" (`investor/page.tsx:30-33`), explicit "it is not the live, revocable LP data room (that ships with the auth build)… does not certify returns" (`investor/page.tsx:41-50`), "Provenance infrastructure is ours; the representations are the GP's" (`UnderwriteSummary.tsx:97-101`, `PlanReviewFindings.tsx:196-199`). Engine-unreachable state refuses to fabricate (`investor/page.tsx:55-71`). |
| Six context surfaces | Invest surface does not imply a live LP data feed. | **PASS.** `mox_04_invest.html` is a static representative mockup under the banner; no live-LP-feed claim. |

## Guardrail 4 — Yardi layer is the surface of the twin (not DOM scraping)

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | Overlay insights sourced from atoms, not scraped DOM. | **PASS.** Command consumes engine `/api/intent` (atom-derived); no scraping path exists. |
| Yardi layer | Overlay is atom-derived on top of static screenshots; copy never claims scraping. | **PASS.** Overlay hydrates from `submitIntent` and reads the named component (`AssistOverlay.tsx:49-93`); screenshots are `next/image` static assets shown read-only/dimmed (`YardiIntelligenceLayer.tsx:63-69`). Copy: "its intelligence is read from our atom store and engine, not scraped from the page" (`YardiIntelligenceLayer.tsx:116-122`); source line uses the live provenance citation (`AssistOverlay.tsx:96-102`). No grep hit for "scrape/scraping" in the live surfaces. |
| Spatial twin | n/a. | **PASS (n/a).** |
| Investor room | n/a. | **PASS (n/a).** |
| Six context surfaces | Extension surface framed as assist layer, not a scraper. | **PASS.** `mox_02_extension.html` framed as the assist/capture layer ("Captured to your core", :171); no scraping claim. surfaces.ts blurb: "the intelligence layer riding on top of Yardi" (`surfaces.ts:28`). |

## Guardrail 5 — opening framing line present at open

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | `NarrativeFrame variant="open"` (or the verbatim line) shown before intent 1; matches `OPENING_FRAMING_LINE`. | **FIX-NEEDED (minor, #2).** `command/page.tsx:21-26` paraphrases the first two clauses but is NOT verbatim and does not use `<NarrativeFrame variant="open" />`. Acceptable mid-arc IF Yardi open beat carries the verbatim line (#1). |
| Yardi layer | Open beat carries/echoes the framing contract. | **FIX-NEEDED (#1).** The Yardi surface (the demo's beat-1 open per the run sheet) paraphrases ("Wiring it to your live Yardi is what the first phase does", `YardiIntelligenceLayer.tsx:121`) but never renders the verbatim `OPENING_FRAMING_LINE` / `<NarrativeFrame variant="open" />`. Guardrail 5 requires the verbatim line at open. Add `<NarrativeFrame variant="open" />`. |
| Spatial twin | n/a (mid-arc). | **PASS (n/a).** |
| Investor room | Closing copy present after intent 5 (`framing.md` close). | **PASS.** `<NarrativeFrame variant="close">` rendered at the foot of the room (`investor/page.tsx:73-88`) with close prose (ground-truth de-risking + "not yet calibrated"). It is a faithful condensation of `framing.md`'s close, not verbatim — acceptable per `NarrativeFrame` design (close copy is passed in, only the OPEN line is verbatim-locked). |
| Six context surfaces | Framing not contradicted (numbers labeled representative). | **PASS.** Every surface labeled "Representative data" (banners cited under G1). Framing not contradicted; the "calibrated" labels are the mitigated item (#3). |

## Guardrail 6 — no live-bidirectional-Yardi claim anywhere

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | No copy/affordance implies writing back to Yardi; capture is local to the spine. | **PASS.** Deposit loop writes to `/api/calibration` (our core); no Yardi write affordance anywhere in command. |
| Yardi layer | Explicitly read + assist + capture; write-back framed as roadmap gated on licensed interface. | **PASS.** "It reads, assists, and captures to your core; it never writes back into Yardi" (`YardiIntelligenceLayer.tsx:116-122`, `yardi/page.tsx:20-26`); draft-reply note "sending happens in your mail client. Mox does not write back into Yardi" (`AssistOverlay.tsx:228-231`); capture is "to OUR core only" (`beats.ts:11-13`). |
| Spatial twin | No unit/operating sync-to-Yardi claim. | **PASS.** No sync/write claim in `ApsViewerSlot.tsx` or `unit-twin-viewer`. |
| Investor room | No claim that the artifact pushes to/pulls live from Yardi. | **PASS.** Room assembles from our engine only; no Yardi push/pull claim. |
| Six context surfaces | No surface promises bidirectional automation. | **PASS.** Grep for `sync to Yardi` / `write.back` / `two-way` / `bidirectional` across `frontend/public/context` returned no hits. Extension surface is capture-to-core only. |

---

## Cross-cutting checks (whole demo)

- [x] **Opening line:** verbatim OPEN line is locked in `NarrativeFrame.tsx:25-26` and used verbatim in the investor close-frame component, BUT is not yet mounted on the demo's open beat (Yardi) — see FIX-NEEDED #1. Closing copy present (`investor/page.tsx:73-88`). **PARTIAL → fix #1.**
- [x] **Three differentiation points woven in, not bolted on** (`differentiation.md`): point 1 (treatment-not-data) lands via per-number `ConfidenceChip` + `DrillLink`/`ProvenanceList` everywhere; point 2 (two flywheels) lands at the deposit-loop in command/Yardi and the flywheel context surface; point 3 (ground truth already built) lands in the plan-review finding (MF-3 → MF-4 §25-2-564, as-of 2026-06-13) in the twin + investor room. **PASS.**
- [x] **`hero_script_runsheet.md` reconciled against built component names** — done; run sheet updated (intent-by-intent assembly now matches live engine output). **PASS.**
- [x] **Forbidden-phrase grep** ("sync to Yardi", "write back to Yardi", "two-way", "live LP", "certified returns", bare "AI for property management"): only benign hits — a guardrail comment (`NarrativeFrame.tsx:13`) and a negation ("not … certified returns", `UnderwriteSummary.tsx:71`). The internal mockup "calibrated" labels are the separate mitigated item (#3). **PASS** (no forbidden phrase asserted as true).
- [x] **Every `ConfidenceChip` passes a `state`** — enforced by required prop (`ConfidenceChip.tsx:53`); no `as any` bypass found; the `provisional`→`baseline` collapse is explicit and downward-only (never upgrades). **PASS.**

## Audit status

**COMPLETE (2026-06-13).** Live hero surfaces clear all six guardrails. Outstanding
items for the orchestrator to dispatch (NOT edited here — cross-lane):
- **#1 (WS-3, blocker for guardrail 5):** mount `<NarrativeFrame variant="open" />`
  on the Yardi open beat.
- **#2 (WS-3, minor):** optional verbatim open line on the command page if it ever
  becomes the entry surface.
- **#3 (WS-6, judgment call):** internal "calibrated" labels in the imported mockups
  are framed by the per-surface "Representative data … not yet calibrated" banner
  (PASS-with-mitigation); neutralize the word in mockup copy only if belt-and-suspenders
  is wanted.
