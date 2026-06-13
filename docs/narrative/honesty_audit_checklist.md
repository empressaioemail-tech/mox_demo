# Honesty audit checklist

> **WS-7 HONESTY RE-AUDIT — ITERATION 2 (2026-06-13, self-contained-engine /
> RBAC / redaction / Sketchfab pass).**
> Re-audited against the as-built code (`frontend/src`) with the engine now living
> INSIDE the Next.js app as same-origin API route handlers
> (`frontend/src/app/api/*` + `frontend/src/lib/engine/*`) — no separate backend,
> no `NEXT_PUBLIC_BACKEND_URL`. Each per-surface cell below is a real
> PASS / FAIL / FIX-NEEDED with the file/line that satisfies or violates the
> guardrail. Verified against the built code, not copy.
>
> **What iteration 2 added (all re-scored below):**
>   - **Self-contained engine via same-origin API routes.** The gate
>     (`frontend/src/lib/engine/gate.ts`) is ported intact: a missing/unrecognized
>     `X-Hauska-Key` resolves to `PUBLIC_SUBJECT` and `canRead` denies every
>     `tenant-private` atom to it (`gate.ts:68-74,85-105`). `deal.json` and
>     `proforma-nelray.json` are the only `tenant-private` atoms; both are gated out
>     of a public/no-key context. **Two-flywheel partition holds.** Calibration is
>     now CLIENT-ACCUMULATED + stateless (`frontend/src/lib/engine/calibration.ts`),
>     and reads as the LIVE earning loop — it reflects a signal COUNT and never
>     relabels a number as earned-calibrated (`calibration.ts:109-113`).
>   - **RBAC across surfaces** (`frontend/src/components/rbac/*`) with a header role
>     switcher. Switching to the external **LP** role redacts tenant-private
>     operating internals on the surfaces that gate on them (Yardi overlay, command
>     operating views, twin operating layer). See guardrail-RBAC section for the ONE
>     leak found (FIX-NEEDED #1, the investor lineage drawer).
>   - **Investor REDACTION / REPLACE** (`RedactionControls.tsx` +
>     `UnderwriteSummary.tsx` + `InvestorRoom.tsx`). Replace values are clearly
>     REPRESENTATIVE (ranges / rounded / `~` + an amber "representative" chip), never
>     a fabricated exact figure presented as real. Redacted fields are blacked out
>     for the LP.
>   - **Mox content module** (`frontend/src/content/mox.ts`) woven into every
>     surface. Every numeric figure is representative/illustrative or an attributed
>     published claim; `REPRESENTATIVE_DATA_NOTE` is rendered next to figures.
>   - **Adaptive reveal + guided walkthrough** (`frontend/src/components/adaptive/*`,
>     `frontend/src/components/walkthrough/*`). Presentation only — the "assembling"
>     stagger introduces no false claim of live computation/calibration.
>   - **Spatial twin 3D is now a SKETCHFAB rendered embed** staged behind
>     `NEXT_PUBLIC_SKETCHFAB_MODEL_ID` (`ApsViewerSlot.tsx` + `SketchfabEmbed.tsx`),
>     labeled "a rendering of the proposed design — not live tenant data and not a
>     measured as-built." It does NOT pose as a live APS/Revit 3D viewer.
>
> Scope of the audit: five hero surface groups + the new cross-cutting features.
>   - **Adaptive command** (`/command`) — intent bar + assembler — WS-3
>   - **Yardi layer** (`/yardi`) — overlay on screenshots, read+assist+capture — WS-3
>   - **Spatial twin** (`/twin`) — asset hero + Sketchfab 3D slot + twin atoms — WS-4
>   - **Investor room** (`/investor`) — provenance rollup + plan review + redaction — WS-5
>   - **Six context surfaces** (imported HTML mockups) — WS-6
>   - **Cross-cutting:** engine/gate, RBAC, redaction, mox content, walkthrough.

## FIX-NEEDED summary (dispatch these)

> **ZERO hard violations of the six README guardrails across every live surface.**
> Confidence is never bare; the earning loop is never relabeled as calibrated; the
> investor room is a generated cited artifact that does not certify returns; the
> Yardi layer is atom-derived with no write-back claim; the verbatim opening line
> renders on the demo entry surfaces; and the twin makes no live-APS/Revit-3D claim.
>
> The items below are RBAC / belt-and-suspenders, NOT hard guardrail violations.
> **#1 is a genuine RBAC leak** that contradicts the on-screen "the LP never sees
> tenant-private operating internals" claim — recommend fixing before redeploy.

1. **FIX-NEEDED (RBAC leak — recommend fix before redeploy). The investor-room
   lineage drawer (`DrillLink` → `AtomDrawer`) is NOT role-aware, so the LP role can
   drill into the tenant-private operating pro-forma atom even when the displayed
   metric was redacted/replaced.**
   - The drawer fetches via `fetchAtom` (`frontend/src/components/investor/engineClient.ts:84-95`),
     which ALWAYS sends `HAUSKA_KEY = "mox-tenant-key"` (`engineClient.ts:23`).
   - `UnderwriteSummary` renders a `DrillLink atomId={PROFORMA_ATOM_ID}` next to every
     redactable metric (`UnderwriteSummary.tsx:90,119,175`), and `InvestorRoom`'s
     `DealHeader`/`DealLedger` render `DrillLink` to `did:hauska:deal:nelray-607-611`
     and the operating member (`InvestorRoom.tsx:204-207,328-330`).
   - Net effect: an external-LP viewer can click "pro-forma atom" / "source" / "deal
     molecule" and the `AtomDrawer` (`AtomDrill.tsx:75-84,155-251`) opens the FULL
     `tenant-private` operating-proforma / deal atom — reasoning, provenance,
     freshness, confidence note — regardless of the operator's redact/replace
     choices. This contradicts the LP copy in `InvestorRoom.tsx:360-366`
     ("never tenant-private operating internals") and `RoleGate.tsx:75-77`.
   - **Severity: MEDIUM, not a hard guardrail violation.** What leaks is the
     *representative seed* pro-forma atom, explicitly labeled "representative seed
     values shaped like the operator's book, not actuals" (`proforma-nelray.json:8,37,41`)
     — no real Mox actual or earned-calibrated number leaks (so guardrails 1 & 2
     hold). But it breaks the iteration-2 "Mox controls who sees what" RBAC story for
     the LP role. **Suggested fix (frontend lane, not WS-7's):** make the drawer
     role-aware — hide/replace `DrillLink` on redactable fields for the LP role
     (gate `DrillLink` on the field's `RedactionMode` for the LP), OR have
     `AtomDrawer`/`fetchAtom` refuse to surface `tenant-private` atoms when the
     active role is external (`isExternal`). Exact files:
     `frontend/src/components/investor/AtomDrill.tsx` +
     `frontend/src/components/investor/engineClient.ts:84-95`
     (and the `DrillLink` call sites in `UnderwriteSummary.tsx` / `InvestorRoom.tsx`).

2. **NOTE (by-design, NOT a leak). The underwrite return summary itself shows
   per-unit operating figures to the LP by default.** The kpi-card / underwrite
   (rent/unit, expense load, cap rate, etc., sourced from `proforma-nelray.json`)
   renders to the LP because the LP `canSee` includes `investor-room` (`roles.ts:144-147`)
   — an underwrite IS what an LP receives. These figures are redactable/replaceable
   per field (`UnderwriteSummary.tsx:113-124`, `RedactionControls.tsx`). This is
   distinct from the `operating-internals` RESOURCE (variance / R&M / work orders /
   action inbox), which IS gated from the LP everywhere
   (`renderers.tsx:578-588`, `AssistOverlay.tsx:174-178,289-293`,
   `UnitDrilldown.tsx:219-225`). So the RBAC claim holds at the resource granularity.
   Recorded so the distinction is explicit. **Not a fix.**

3. **Context surfaces — internal "calibrated" labels in the imported mockups
   (guardrails 1 & 2, MITIGATED, carried forward from iteration 1).** The six
   imported HTML mockups contain hard-coded copy that reads as earned-calibration on
   representative numbers (e.g. `mox_04_invest.html` "Underwrite confidence:
   calibrated"; `mox_01_command.html` "Calibrated against 1,840 … outcomes";
   `mox_03_manage.html` "Calibrated against 38 confirmed invoices …";
   `mox_06_flywheel.html` "it calibrates … gets less wrong every month"). Each
   surface injects the prominent banner *"Representative data · illustrative, not yet
   calibrated on Mox outcomes"* plus chrome banners (`context/page.tsx`,
   `ContextFrame.tsx`). **PASS-with-mitigation.** No code change required unless the
   orchestrator wants the word neutralized in the mockup copy (a WS-6 edit, not
   WS-7's lane).

No hard guardrail VIOLATIONS were found in ANY live surface (command, Yardi overlay,
spatial twin, investor room, context). No bare number presented as earned, no Yardi
write-back claim, no live-LP-umbilical claim, no false "live APS/Revit 3D viewer"
claim, and confidence is never rendered without state.

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
5. **Opening framing line present** at open (verbatim, `framing.md` /
   `NarrativeFrame.OPENING_FRAMING_LINE`).
6. **No live-bidirectional-Yardi claim anywhere.** Read + assist + capture only;
   write-back is a roadmap item gated on a licensed interface.

> **Twin-specific honesty:** the `/twin` surface must NOT misrepresent itself as a
> live APS/Revit 3D viewer. **Verified PASS (iteration 2):** the 3D slot is now a
> Sketchfab-rendered embed of the PROPOSED design, config-driven via
> `NEXT_PUBLIC_SKETCHFAB_MODEL_ID` (`ApsViewerSlot.tsx:26-28,40-41`). When the model
> id is set it renders `<SketchfabEmbed>` and labels the slot "Proposed building —
> rendered model + site" / "Live 3D rendering" (`ApsViewerSlot.tsx:51-63`); when
> unset it shows a graceful fallback ("Rendered 3D model — wiring up", no broken
> iframe, `ApsViewerSlot.tsx:97-125`). Either way the footnote reads "a rendering of
> the proposed design — not live tenant data and not a measured as-built. The
> measured model (APS / Model Derivative) backfills the same seam later"
> (`ApsViewerSlot.tsx:75-91`; `SketchfabEmbed.tsx:14-17`). The building atom is
> `provisional` with the APS backfill spelled out (`building.json:58`); units carry
> the "backfill from the APS Model Derivative (WS-1 Part A)" note
> (`UnitDrilldown.tsx:206-210`). The asset-based hero (renderings/elevations/plans)
> is the active spatial face (`BuildingView.tsx:42-99`).

> **Enforcement primitive:** `ConfidenceChip.tsx:53` makes the `state` prop REQUIRED
> and has no path to render a value without a state. The engine emits a 4th state
> `provisional`, which the adapters (`command/confidence.tsx`,
> `investor/engineClient.ts:140-148`, `twin/atoms` `toChipState`) collapse to
> `baseline` (never upgraded), carrying the precise note in the chip title — honest.
> No `earned-through-outcome` appears in live output (every atom `stateNote` says
> "not earned-calibrated"; the provider hardcodes no earned state).

---

## Guardrail 1 — every confidence value carries its state

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | Every KPI/anomaly/inbox value renders `ConfidenceChip` with a state; no bare numerals. | **PASS.** Every component header carries a lead chip → `EngineConfidenceChip` → shared `ConfidenceChip` (`command/confidence.tsx`). Metric tiles show the numeral with a card-level state chip + a "not yet measurable" guard for null metrics (`primitives.tsx`). RBAC: tenant-private views are wrapped in `RoleGate` (`renderers.tsx:578-588`) so for the LP they REDACT rather than showing bare numbers. No `earned-through-outcome` in live output. |
| Yardi layer | Every overlay insight value carries a chip; state is `baseline`/`provenance-backed`. | **PASS.** The insight always renders a chip: live → `EngineConfidenceChip`, fallback → `<ConfidenceChip state="baseline">` (`AssistOverlay.tsx:194-200`). Fallback states are all `baseline` (`yardi/beats.ts`). The whole insight block is inside a `RoleGate resource="operating-internals"` (`AssistOverlay.tsx:174-178`) so the LP sees a labeled redaction, not a bare number. |
| Spatial twin (`/twin`) | Every building/unit/ground-truth atom value carries a chip with state; entitlement finding chip baseline; no bare numbers. | **PASS.** Every fact renders `ConfidenceChip` via `toChipState` (collapses `provisional`→`baseline`, never upgrades): building hero (`BuildingView.tsx:55-59`), ground truth (`GroundTruthLayer.tsx`), unit metadata (`UnitDrilldown.tsx`), operating pro forma (`OperatingLayer.tsx:52-57`), entitlement finding baseline (`EntitlementFinding.tsx`). The Sketchfab/3D slot surfaces no numeric atom (`ApsViewerSlot.tsx`) → nothing to chip. The operating layer is `RoleGate`-wrapped so the LP gets a redaction placeholder, not bare numbers. |
| Investor room | Every underwrite/return number carries a chip and drills to source; redacted/replaced fields are clearly marked. | **PASS.** Deal header, renderings, underwrite, plan review, ledger each render a `ConfidenceChip` with `toChipState` (`InvestorRoom.tsx:197-203,284-290`, `HeroRenderings.tsx`, `UnderwriteSummary.tsx:83-89`, `PlanReviewFindings.tsx`). Replaced values still carry the amber "representative" chip for the LP (`RedactionControls.tsx:179-192`); redacted values show the labeled blackout (`RedactionControls.tsx:230-254`) — never a bare unlabeled number. Every metric tile carries a `DrillLink` (see FIX-NEEDED #1 re: that drill being role-blind). |
| Six context surfaces | Representative numbers chipped or framed as representative; none read as earned-calibrated. | **PASS-with-mitigation (FIX-NEEDED #3).** Static mockups carry the injected "Representative data · illustrative, not yet calibrated on Mox outcomes" banner + chrome banners. Internal "calibrated" labels are framed not-yet-calibrated by the banner. |
| Mox content module | Every figure representative/illustrative or an attributed published claim; disclaimer available. | **PASS.** Only numeric content is the "18–23%" Manage headline — a `RepresentativeFigure` with `representative:true` (`mox.ts:98,116-120`), the published Mox controllable-line-item claim — and company facts (~40 communities / ~10,400 residences / ~300 employees / five markets, `mox.ts:73-79`), which are real published company facts, not financial actuals. NO bare per-unit cost or savings $ figure is presented as a real Mox actual (per-unit figures live only in the seed `proforma-nelray.json`, labeled representative). `REPRESENTATIVE_DATA_NOTE` (`mox.ts:211-212`) is rendered next to figures (`AssistOverlay.tsx:231`, `InvestorRoom.tsx:377`). |

## Guardrail 2 — deposit-loop reads as the live earning loop (not calibrated numbers)

| Surface | What to verify | Result |
|---|---|---|
| Engine / calibration | The client-accumulated, stateless loop reflects a SIGNAL COUNT and never relabels a number as earned-calibrated. | **PASS.** `summaryFor` returns `signalLabel` = "N calibration signals recorded — earning loop live (not yet earned-calibrated)" (`calibration.ts:109-113`); the engine attaches it per bound atom as a separate fact alongside the atom's own (still baseline) confidence (`engine.ts:84-96`). The `/api/calibration` route gates writes on read access (`api/calibration/route.ts:59-62`) and returns the same reflection. No path upgrades a chip to earned. |
| Adaptive command | Accept/edit at the inbox shows the loop turning; chips stay `baseline`; no number flips to earned. | **PASS.** `DepositLoop` POSTs `/api/calibration` and shows the tallies; `CommandSurface.handleCalibrated` re-runs the intent so the surface reacts. The reflection shows accept/edit/reject counts + the honest `signalLabel`, never relabels a value as earned. |
| Yardi layer | Capture frames learning-on-your-book, not pre-calibrated accuracy. | **PASS.** Capture POSTs `/api/calibration`; success copy is "Captured to your core" / "earning loop live" (`AssistOverlay.tsx`, `yardi/beats.ts`). Framed as the loop turning, not an already-calibrated number. |
| Spatial twin (`/twin`) | Deposit loop on the finding shows the loop turning, not pre-calibrated numbers. | **PASS.** The entitlement finding carries the loop: accept/edit/reject POSTs to `/api/calibration` when reachable, degrades to a local-intent note otherwise (`EntitlementFinding.tsx:10-12,40-50`, `twin/engineClient.ts:36-57`). Copy: "The earning loop records your signal — it does not relabel the number as earned (guardrail 2). Calibration on Mox outcomes begins when your data is wired." (`EntitlementFinding.tsx:170-173`). Operating layer: "Representative seed values … not actuals — never pooled" (`OperatingLayer.tsx:74-77`). |
| Investor room | Returns not framed as outcome-calibrated; the loop on the plan review is honest. | **PASS.** Underwrite is "seed pro forma" / "projected", "representative seed numbers … not actuals or certified returns" (`UnderwriteSummary.tsx:73-99`). Close copy: "the accept / edit / reject controls on the plan review feed the earning loop; calibration begins when your data is wired" (`InvestorRoom.tsx:376-383`). |
| Six context surfaces | Flywheel depicts the mechanism, not accrued calibration on representative data. | **PASS-with-mitigation (FIX-NEEDED #3).** `mox_06_flywheel.html` describes the mechanism, gated by the banner. |

## Guardrail 3 — investor room is a generated, cited artifact

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | "generate the LP view" produces an artifact, not a live LP session. | **PASS.** Intent assembles `investor-rollup + plan-review-findings + renderings-panel + kpi-card + provenance-drill`. The `investor-rollup` renderer is the cited artifact; no live-LP-session affordance. |
| Spatial twin (`/twin`) | n/a (feeds the artifact; not the artifact). | **PASS (n/a).** Twin feeds renderings/atoms/finding to the room; makes no LP claim. The operating pro forma is "tenant-private … never pooled" (`OperatingLayer.tsx:74-77`). |
| Investor room | Generated + cited; no live revocable LP umbilical; does not certify returns; GP makes representations; redaction is editorial control over the artifact. | **PASS.** Server-assembled from the engine same-origin (`investor/page.tsx`, `engineClient.ts:59-76`), "Assembled live by the engine" footer (`InvestorRoom.tsx:152-156`), close copy "This surface does not certify returns — the provenance infrastructure is ours, the representations are the GP's" (`InvestorRoom.tsx:376-383`); `UnderwriteSummary.tsx:97` "not actuals or certified returns". The redaction layer is framed as the operator's editorial control over THEIR artifact, "Replaced values are clearly representative — never fabricated as real" (`RedactionControls.tsx:25-29,373-380`). Engine-unreachable → honest "engine unreachable" state, no fabrication. |
| Six context surfaces | Invest surface does not imply a live LP data feed. | **PASS.** Static mockup under the banner; no live-LP-feed claim. |

## Guardrail 4 — Yardi layer is the surface of the twin (not DOM scraping)

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | Overlay insights sourced from atoms, not scraped DOM. | **PASS.** Command consumes engine `/api/intent` (atom-derived); no scraping path. |
| Yardi layer | Overlay atom-derived on static screenshots; copy never claims scraping. | **PASS.** Overlay hydrates from `submitIntent` / engine output (`AssistOverlay.tsx`); screenshots are `next/image` static assets shown read-only. Copy: "its intelligence is read from our atom store and engine, not scraped from the page" (`YardiIntelligenceLayer.tsx`). No scrape/scraping grep hit in the live surfaces. |
| Spatial twin (`/twin`) | Twin atoms substrate/asset-derived, not scraped; no live-APS/Revit-3D pose. | **PASS.** Ground truth is "Substrate-derived. Every fact drills to its atom." (`GroundTruthLayer.tsx`); imagery is curated Revit exports. 3D slot is a Sketchfab rendering of the proposed design, explicitly "not live tenant data and not a measured as-built" (`ApsViewerSlot.tsx:75-78`); the asset hero is "NOT a live APS/Revit viewer" framing carried by the slot + atom notes. |
| Investor room | n/a. | **PASS (n/a).** |
| Six context surfaces | Extension surface framed as assist layer, not a scraper. | **PASS.** Capture-to-core framing; no scraping claim. |

## Guardrail 5 — opening framing line present at open

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | `NarrativeFrame variant="open"` shown before intent 1; matches `OPENING_FRAMING_LINE`. | **PASS (improved since iteration 1).** `command/page.tsx:43` now mounts `<NarrativeFrame variant="open" />`, rendering the verbatim line (`NarrativeFrame.tsx:25-26,53-55`). The prior iteration-1 paraphrase note is closed. |
| Yardi layer | Open beat carries the verbatim framing line. | **PASS.** `yardi/page.tsx:35` mounts `<NarrativeFrame variant="open" />`. The walkthrough "open-yardi" beat also carries the verbatim `sayAloud` line (`walkthrough/beats.ts:42-43`). |
| Spatial twin (`/twin`) | n/a (mid-arc); framing not contradicted. | **PASS (n/a).** Framing consistent: "The data is representative; the engine and the substrate-derived ground truth are real." (`twin/page.tsx`). |
| Investor room | Closing copy present after intent 5. | **PASS.** `<NarrativeFrame variant="close">` at the foot (`InvestorRoom.tsx:347-384`). The walkthrough "investor-room" beat carries the verbatim close `sayAloud` (`walkthrough/beats.ts:78-79`). |
| Home hub | Open line present. | **PASS.** `page.tsx:81` mounts `<NarrativeFrame variant="open" />`. |
| Six context surfaces | Framing not contradicted. | **PASS.** Every surface labeled "Representative data"; the "calibrated" labels are the mitigated item (#3). |

## Guardrail 6 — no live-bidirectional-Yardi claim anywhere

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | No affordance implies writing back to Yardi; capture is local to the spine. | **PASS.** Deposit loop writes to `/api/calibration` (our core); no Yardi write affordance. |
| Yardi layer | Explicitly read + assist + capture; write-back framed as roadmap. | **PASS.** "It reads, assists, and captures to your core; it never writes back into Yardi" (`YardiIntelligenceLayer.tsx`, `mox.ts:85-87`); draft-reply note "sending happens in your mail client. Mox does not write back into Yardi" (`AssistOverlay.tsx:276-279`). |
| Spatial twin (`/twin`) | No unit/operating sync-to-Yardi or write-back claim. | **PASS.** No sync/write/bidirectional claim in `components/twin`; the loop writes only to `/api/calibration`. |
| Investor room | No claim the artifact pushes to / pulls live from Yardi. | **PASS.** Assembles from our engine only; no Yardi push/pull claim. |
| Six context surfaces | No surface promises bidirectional automation. | **PASS.** Extension surface is capture-to-core only. |

---

## Guardrail RBAC (iteration-2 cross-cutting) — "Mox controls who sees what" is TRUE in code

> Not one of the six README guardrails, but the iteration-2 RBAC story must be TRUE
> in the code, not just copy. The role definitions (`roles.ts`) give the external LP
> `canSee = [investor-room, ground-truth]` only (`roles.ts:144-147`); every other
> role is internal. `RoleGate` redacts/hides by resource (`RoleGate.tsx:52-79`).

| Surface | Tenant-private operating internals gated for the LP? | Result |
|---|---|---|
| Command (`/command`) | Operating/financial views wrapped in `RoleGate`. | **PASS.** `kpi-card` gates on `financial-actuals`; `variance-anomaly-card` + `action-inbox` gate on `operating-internals` (`arms.ts:61-86`); every component routes through `FramedComponent` which wraps tenant-private ones in `RoleGate … redact` (`renderers.tsx:560-588,604-612`). The LP sees labeled redactions; public ground truth + the investor rollup stay visible. |
| Yardi (`/yardi`) | Insight block + capture footer gated. | **PASS.** Both the insight body (`AssistOverlay.tsx:174-178`) and the capture-to-core footer (`AssistOverlay.tsx:289-293`) are `RoleGate resource="operating-internals" redact`. Only the benign "what Mox sees you doing" context line is ungated. |
| Spatial twin (`/twin`) | Tenant-private operating layer gated; public building/ground-truth visible. | **PASS.** `OperatingLayer` is the only tenant-private block and is wrapped in `RoleGate resource="operating-internals" redact` (`UnitDrilldown.tsx:219-225`) — and `OperatingLayer` is rendered NOWHERE else (verified single use). The building view (renderings/plans/ground-truth/finding) is public-class content and intentionally visible. |
| Investor room (`/investor`) | LP sees the curated artifact (intended) + the redaction RESULT. | **PASS with FIX-NEEDED #1.** The room is the LP's whole view (`investor-room` resource). Operator can redact/replace sensitive lines; the LP sees the result (`RedactionControls.tsx`). **The one leak:** the lineage `DrillLink` is role-blind and lets the LP drill the tenant-private pro-forma/deal atom regardless of redaction (FIX-NEEDED #1). What leaks is the representative seed atom (labeled as such), so it is NOT a guardrail-1/2 violation, but it breaks the RBAC claim for the LP role. |
| Redaction REPLACE values | Replace substitutes are clearly representative, never fabricated-exact. | **PASS.** `representativeBand` produces ranges / `~`-rounded values (`UnderwriteSummary.tsx:38-55`); listPrice/address replacements are ranges/generic ("~$4–5M", "North Loop, Austin TX", `InvestorRoom.tsx:187-189,226`); every LP-facing replace renders the amber "representative" chip (`RedactionControls.tsx:179-192`). No fabricated exact figure presented as real. |

---

## Cross-cutting checks (whole demo)

- [x] **Self-contained engine / two-flywheel partition:** the gate denies every
  `tenant-private` atom to a missing/wrong key (`gate.ts:68-105`); only `deal.json`
  and `proforma-nelray.json` are tenant-private; a public/no-key `/api/atoms` returns
  strictly fewer atoms. **PASS.**
- [x] **Opening line:** verbatim OPEN line locked in `NarrativeFrame.tsx:25-26`,
  mounted on `/yardi` (`yardi/page.tsx:35`), home (`page.tsx:81`), AND `/command`
  (`command/page.tsx:43`); also the verbatim `sayAloud` on the walkthrough open beat.
  Closing copy present (`InvestorRoom.tsx:347-384`). **PASS.**
- [x] **Adaptive reveal / walkthrough introduce no false claim:** `AssemblingSequence`
  is a staggered reveal of already-assembled components (`AssemblingSequence.tsx`);
  the "Assembling…" shimmer is presentation, not a claim of live calibration. The
  walkthrough narration is faithful to the run sheet and carries the honesty framing
  (chip stays baseline, generated artifact not umbilical, provisional geometry, never
  writes back) (`walkthrough/beats.ts`). **PASS.**
- [x] **Three differentiation points woven in** (`differentiation.md`): point 1
  (treatment-not-data) via per-number `ConfidenceChip` + `DrillLink` everywhere;
  point 2 (two flywheels) at the deposit loop + the gate's tenant-private partition +
  the flywheel context surface; point 3 (ground truth already built) in the MF-3
  plan-review finding reachable from the building level + the investor room. **PASS.**
- [x] **Forbidden-phrase grep** ("write back", "two-way", "bidirectional", "sync to
  Yardi", "certified returns"): only benign hits — guardrail comments
  (`mox.ts:85`, `NarrativeFrame.tsx:13`) and negations (`AssistOverlay.tsx:278`
  "does not write back into Yardi", `UnderwriteSummary.tsx:97` "not … certified
  returns"). **PASS** (no forbidden phrase asserted as true).
- [x] **Every `ConfidenceChip` passes a `state`** — enforced by required prop
  (`ConfidenceChip.tsx:53`); `provisional`/`earned-calibrated` engine states collapse
  to `baseline` downward-only; no `earned-through-outcome` in live output. **PASS.**

## Audit status

**COMPLETE — iteration 2 (2026-06-13).** All five hero surface groups plus the new
cross-cutting features (self-contained engine, RBAC, investor redaction, mox content,
adaptive reveal + walkthrough, Sketchfab twin) clear all six README guardrails:
**ZERO hard guardrail violations.** Confidence always carries state; the earning loop
is never relabeled as calibrated; the investor room is a generated cited artifact that
does not certify returns; the Yardi layer is atom-derived with no write-back claim;
the verbatim opening line renders on `/yardi`, home, and `/command`; and the twin's 3D
face is a labeled Sketchfab rendering of the proposed design, not a live APS/Revit
viewer or live tenant data.

**One RBAC FIX-NEEDED before redeploy (FIX-NEEDED #1):** the investor-room lineage
drawer is role-blind and lets the external-LP role drill the tenant-private (but
representative-seed) pro-forma/deal atom, contradicting the on-screen "the LP never
sees tenant-private operating internals" claim. Medium severity — it is not a hard
guardrail-1/2 violation (the leaked atom is explicitly representative seed, never a
real Mox actual or earned-calibrated number), but it should be made role-aware. Files:
`frontend/src/components/investor/AtomDrill.tsx` +
`frontend/src/components/investor/engineClient.ts:84-95` + the `DrillLink` call sites.

Two non-blocking items logged (NOT WS-7's lane to edit): #2 (by-design — the
underwrite shows redactable per-unit figures to the LP, correct at resource
granularity) and #3 (WS-6 judgment call — internal "calibrated" labels in the imported
context mockups, mitigated by the per-surface "not yet calibrated" banner).
