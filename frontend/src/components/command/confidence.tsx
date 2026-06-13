/**
 * Confidence adapter — bridges the engine's confidence payload to the shared
 * ConfidenceChip (guardrail 1: the chip carries its state, always).
 *
 * The engine emits four states: baseline, provenance-backed,
 * earned-through-outcome, and `provisional` (used for the APS-blocked twin
 * atoms — backed by the ground-truth doc but not yet provenance-complete). The
 * shared ConfidenceChip only models the three calibration states. We map
 * `provisional` to `baseline` (it is NOT earned and NOT yet fully provenance-
 * backed) and surface the engine's own label/note verbatim via the chip title,
 * so nothing about the honesty state is lost or upgraded.
 */

import { ConfidenceChip } from "@/components/library";
import type { ConfidenceState } from "@/components/library";
import type { EngineConfidence } from "@/lib/engine";

function toChipState(engineState: string): ConfidenceState {
  switch (engineState) {
    case "provenance-backed":
      return "provenance-backed";
    case "earned-through-outcome":
      return "earned-through-outcome";
    case "provisional":
    case "baseline":
    default:
      // provisional is never upgraded — it renders as baseline with its own
      // note (e.g. "PROVISIONAL pending APS extraction") shown in the title.
      return "baseline";
  }
}

/** Render an engine confidence object as the shared, state-bearing chip. */
export function EngineConfidenceChip({
  confidence,
  className,
}: {
  confidence: EngineConfidence;
  className?: string;
}) {
  const title = [confidence.label, confidence.note].filter(Boolean).join(" — ");
  return (
    <ConfidenceChip
      state={toChipState(confidence.state)}
      value={confidence.value}
      title={title || undefined}
      className={className}
    />
  );
}

/**
 * Render the first (lead) confidence chip for a component. Components can carry
 * several chips (e.g. plan-review = finding + cited code sections); the lead is
 * the focal atom's. Use ConfidenceChipRow for the full set.
 */
export function LeadConfidenceChip({
  confidence,
  className,
}: {
  confidence: EngineConfidence[];
  className?: string;
}) {
  if (!confidence || confidence.length === 0) return null;
  return <EngineConfidenceChip confidence={confidence[0]} className={className} />;
}

/** Render every confidence chip a component carries (each with its state). */
export function ConfidenceChipRow({
  confidence,
  className,
}: {
  confidence: EngineConfidence[];
  className?: string;
}) {
  if (!confidence || confidence.length === 0) return null;
  return (
    <div className={["flex flex-wrap items-center gap-1.5", className ?? ""].join(" ")}>
      {confidence.map((c, i) => (
        <EngineConfidenceChip key={`${c.state}-${i}`} confidence={c} />
      ))}
    </div>
  );
}
