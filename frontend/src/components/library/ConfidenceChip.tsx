/**
 * ConfidenceChip — the guardrail-1 enforcement primitive.
 *
 * Honesty guardrail 1 (README): every surfaced confidence value must show its
 * calibration STATE. No bare numbers presented as earned. This component is the
 * single place that rule is enforced; every surface composes it instead of
 * rendering a raw number.
 *
 * THREE EXPLICIT STATES:
 *  - "baseline"               Backed by source + reasoning, NOT yet calibrated on
 *                             Mox outcomes. THIS IS THE DEMO DEFAULT — the data is
 *                             representative, so almost every number is baseline.
 *  - "provenance-backed"      A baseline atom whose source/reasoning chain is
 *                             explicitly attached and drillable. Rendered as a
 *                             reinforcement of baseline (still not calibrated).
 *  - "earned-through-outcome" Calibrated against real Mox outcomes via the deposit
 *                             loop. NEVER apply this to a representative demo number
 *                             as if it were real (guardrail 2). It exists to
 *                             illustrate what the live earning loop PRODUCES over
 *                             time, not to dress up a fixture.
 *
 * HARD RULE: the component cannot render a confidence value without its state.
 * The `state` prop is required. If you only have a number, you have a bug.
 *
 * USAGE:
 *   // A representative number with its source attached (the demo default):
 *   <ConfidenceChip state="provenance-backed" value={0.82} verification="verified" />
 *
 *   // A baseline number with no drillable source yet:
 *   <ConfidenceChip state="baseline" value={0.74} />
 *
 *   // Illustrating the earning loop's output (narration only — not a fixture):
 *   <ConfidenceChip state="earned-through-outcome" value={0.93} verification="verified" />
 *
 *   // State-only chip (e.g. on a qualitative finding with no scalar):
 *   <ConfidenceChip state="baseline" />
 *
 * Tailwind v4 / React 19. Dark zinc palette matching frontend/src/app/page.tsx.
 * Self-contained: no external deps beyond React. Importable directly or via the
 * library barrel.
 */

import type { ReactNode } from "react";

export type ConfidenceState =
  | "baseline"
  | "provenance-backed"
  | "earned-through-outcome";

export type VerificationLevel = "verified" | "asserted";

export interface ConfidenceChipProps {
  /** REQUIRED. The calibration state. A value can never render without one. */
  state: ConfidenceState;
  /**
   * Optional confidence scalar in [0,1]. Rendered as a percentage. When omitted,
   * the chip is a state-only badge (valid for qualitative findings).
   */
  value?: number;
  /** Optional atom-level sub-label: was the underlying fact verified or asserted. */
  verification?: VerificationLevel;
  /** Optional extra classes for layout (does not override palette). */
  className?: string;
  /** Optional override tooltip; a sensible default is derived from the state. */
  title?: string;
}

interface StateStyle {
  label: string;
  /** chip container classes */
  chip: string;
  /** dot indicator classes */
  dot: string;
  defaultTitle: string;
}

const STATE_STYLES: Record<ConfidenceState, StateStyle> = {
  baseline: {
    label: "baseline",
    chip: "border-zinc-700 bg-zinc-900/70 text-zinc-300",
    dot: "bg-zinc-400",
    defaultTitle:
      "Baseline. Backed by source and reasoning. Calibration against your actual outcomes begins when your data is wired.",
  },
  "provenance-backed": {
    label: "provenance-backed",
    chip: "border-sky-800/70 bg-sky-950/40 text-sky-200",
    dot: "bg-sky-400",
    defaultTitle:
      "Provenance-backed. The source and reasoning chain are attached and drillable. Still baseline — not yet calibrated on your outcomes.",
  },
  "earned-through-outcome": {
    label: "earned · through outcome",
    chip: "border-emerald-800/70 bg-emerald-950/40 text-emerald-200",
    dot: "bg-emerald-400",
    defaultTitle:
      "Earned through outcome. Calibrated against real outcomes via the deposit loop. Illustrative only in this demo — never applied to a representative number.",
  },
};

function formatValue(value: number): string {
  const clamped = Math.max(0, Math.min(1, value));
  return `${Math.round(clamped * 100)}%`;
}

/**
 * The guardrail-1 confidence primitive. Always renders the state alongside any
 * value. Use on every surfaced number in the demo.
 */
export function ConfidenceChip({
  state,
  value,
  verification,
  className,
  title,
}: ConfidenceChipProps): ReactNode {
  const style = STATE_STYLES[state];
  const hasValue = typeof value === "number" && Number.isFinite(value);

  return (
    <span
      title={title ?? style.defaultTitle}
      data-confidence-state={state}
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5",
        "text-xs font-medium leading-none tracking-tight",
        "align-middle whitespace-nowrap",
        style.chip,
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        aria-hidden="true"
        className={["h-1.5 w-1.5 shrink-0 rounded-full", style.dot].join(" ")}
      />
      {hasValue && (
        <span className="font-semibold tabular-nums">{formatValue(value)}</span>
      )}
      <span className="opacity-90">{style.label}</span>
      {verification && (
        <span className="border-l border-current/30 pl-1.5 opacity-70">
          {verification}
        </span>
      )}
    </span>
  );
}

export default ConfidenceChip;
