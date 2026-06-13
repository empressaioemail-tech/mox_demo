# Honesty audit checklist

> The template for the final WS-7 cross-surface audit pass. It enumerates all six
> honesty guardrails (README §"Honesty guardrails") and, per surface, what to
> verify. **Per-surface results are marked `PENDING — verify after build`** and
> get filled in once the hero surfaces exist.
>
> Scope of the audit: the five surface groups below.
>   - **Adaptive command** (intent bar + assembler) — WS-3
>   - **Yardi layer** (overlay on screenshots, read+assist+capture) — WS-3
>   - **Spatial twin** (APS viewer + twin atoms) — WS-4
>   - **Investor room** (provenance rollup + plan review) — WS-5
>   - **Six context surfaces** (command center, Manage, Invest, BLDR, extension, flywheel) — WS-6
>
> How to use: for each guardrail, walk each surface and replace the PENDING line
> with PASS / FAIL + a one-line note (and a fix ticket if FAIL).

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

---

## Guardrail 1 — every confidence value carries its state

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | Every KPI/anomaly/inbox value renders `ConfidenceChip` with a state; no bare numerals. | PENDING — verify after build |
| Yardi layer | Every overlay insight value carries a chip; state is `baseline`/`provenance-backed`. | PENDING — verify after build |
| Spatial twin | Every unit/ground-truth atom value carries a chip; plan-review finding chip is baseline. | PENDING — verify after build |
| Investor room | Every underwrite/return number carries a chip and drills to source. | PENDING — verify after build |
| Six context surfaces | Representative numbers are chipped or clearly framed as representative; none read as earned-calibrated. | PENDING — verify after build |

## Guardrail 2 — deposit-loop reads as the live earning loop (not calibrated numbers)

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | Accept/edit at the inbox shows the loop turning; chips stay `baseline`; no number flips to `earned-through-outcome`. | PENDING — verify after build |
| Yardi layer | Capture moment frames learning-on-your-book, not pre-calibrated accuracy. | PENDING — verify after build |
| Spatial twin | n/a (no deposit loop here) — confirm no false "calibrated" claim. | PENDING — verify after build |
| Investor room | n/a — confirm returns are not framed as outcome-calibrated. | PENDING — verify after build |
| Six context surfaces | Flywheel surface depicts the mechanism, not accrued calibration on representative data. | PENDING — verify after build |

## Guardrail 3 — investor room is a generated, cited artifact

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | "generate the LP view" produces an artifact, not a live LP session. | PENDING — verify after build |
| Yardi layer | n/a. | PENDING — verify after build |
| Spatial twin | n/a (feeds the artifact; not the artifact). | PENDING — verify after build |
| Investor room | Reads as generated + cited; no live revocable LP umbilical; does not certify returns; GP makes representations. | PENDING — verify after build |
| Six context surfaces | Invest surface does not imply a live LP data feed. | PENDING — verify after build |

## Guardrail 4 — Yardi layer is the surface of the twin (not DOM scraping)

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | Overlay insights sourced from atoms, not scraped DOM. | PENDING — verify after build |
| Yardi layer | Overlay is atom-derived on top of static screenshots; copy never claims scraping. | PENDING — verify after build |
| Spatial twin | n/a. | PENDING — verify after build |
| Investor room | n/a. | PENDING — verify after build |
| Six context surfaces | Extension surface framed as assist layer, not a scraper. | PENDING — verify after build |

## Guardrail 5 — opening framing line present at open

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | `NarrativeFrame variant="open"` (or the verbatim line) shown before intent 1; matches `OPENING_FRAMING_LINE`. | PENDING — verify after build |
| Yardi layer | Open beat carries/echoes the framing contract. | PENDING — verify after build |
| Spatial twin | n/a (mid-arc). | PENDING — verify after build |
| Investor room | Closing copy present after intent 5 (`framing.md` close). | PENDING — verify after build |
| Six context surfaces | Framing not contradicted (numbers labeled representative). | PENDING — verify after build |

## Guardrail 6 — no live-bidirectional-Yardi claim anywhere

| Surface | What to verify | Result |
|---|---|---|
| Adaptive command | No copy/affordance implies writing back to Yardi; capture is local to the spine. | PENDING — verify after build |
| Yardi layer | Explicitly read + assist + capture; write-back framed as roadmap gated on licensed interface. | PENDING — verify after build |
| Spatial twin | No unit/operating sync-to-Yardi claim. | PENDING — verify after build |
| Investor room | No claim that the artifact pushes to/pulls live from Yardi. | PENDING — verify after build |
| Six context surfaces | No surface promises bidirectional automation. | PENDING — verify after build |

---

## Cross-cutting checks (whole demo)

- [ ] PENDING — opening line verbatim and closing copy present (guardrail 5 + `framing.md`).
- [ ] PENDING — the three differentiation points are woven into surfaces, not bolted on (`differentiation.md`).
- [ ] PENDING — `hero_script_runsheet.md` reconciled against built component names.
- [ ] PENDING — grep the built copy for forbidden phrases: any "sync to Yardi", "write back to Yardi", "two-way", "live LP", "certified returns", or bare "AI for property management".
- [ ] PENDING — every `ConfidenceChip` usage passes a `state` (TypeScript enforces this; spot-check no `as any` bypasses).

## Audit status

**DEFERRED.** The full cross-surface audit runs after the hero surfaces (WS-3/4/5)
and context surfaces (WS-6) exist. This file is the template; results above remain
`PENDING — verify after build` until that pass.
