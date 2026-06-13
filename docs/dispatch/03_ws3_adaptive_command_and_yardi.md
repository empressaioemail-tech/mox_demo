# WS-3 Adaptive command + Yardi layer (dispatch brief)

Objective: two hero surfaces. (A) The adaptive command: the intent bar plus the assembler that renders engine output as components, the clearest expression of the adaptive interface. (B) The intelligence layer overlaying the real Yardi screenshots: read plus assist plus capture.

Depends on: WS-1 (atoms), WS-2 (engine).

Read first: `README.md`, `docs/property_ground_truth.md`. Reference the existing extension mockup `mox_html_original/mox_02_extension (1).html` for the overlay UX, and `hauska-brief-extension` for the pattern.

### Part A: adaptive command

- An intent bar. On submit, call the engine (WS-2), render the returned ordered components.
- The hero intents are rehearsed to known-good paths: "show me this deal", "vet the proposed building", "why is this flagged", "open a unit", "generate the LP view".
- The deposit-loop UI (accept/edit/reject) on surfaced items, wired to the engine write path. Show the surface react after a correction (the loop is live).

### Part B: intelligence layer on Yardi

Overlay component that sits on the Yardi screenshots in `yardi_screenshots/`. It surfaces intelligence derived from the atom store (not pixel-scraping), with a "following you" affordance like the extension mockup. Screen-to-beat map:

- `Yardi_Work-Orders-RV50-1.png`: pull vendor history across the portfolio, summarize, draft a reply, code the invoice to deposit (the ABC Plumbing assist plus capture).
- `Yardi_Budget-Variance-RV55-1.png` and `Yardi_Expense-Analysis-RV19-1.png`: surface the anomaly/variance flag with its reasoning chain and source (the leak beat).
- `Yardi_Financial-Overview-RV54-1.png` and `Yardi_Property-Operations-RV35-1.png`: in-context KPI insight with provenance.

Acceptance:
- Typing a hero intent assembles the right components live.
- The Yardi overlay surfaces atom-derived intelligence in context on the real screenshots, with source and confidence.
- Accept/edit/reject feeds the deposit loop and the surface reflects it.

Guardrails (hard):
- The overlay is the surface of the twin (atom-derived), not DOM scraping (guardrail 4).
- Confidence chips carry their state (guardrail 1).
- Capture is assist-first (the assist earns the capture); never framed as a keystroke monitor.
- No claim of writing back into Yardi (guardrail 6). The overlay reads, assists, and captures to our core only.

Repos to reference: `hauska-brief-extension`, `hauska-atom-contract`.
