"use client";

/**
 * AssemblingSequence — reveals a list of children one-by-one, as if the engine
 * is assembling the surface live.
 *
 * This is the centerpiece of the "typing an intent makes the surface assemble
 * itself" feel. Each child fades/rises in on a stagger. Optionally shows a brief
 * "assembling…" shimmer header while the sequence plays. Respects
 * prefers-reduced-motion (everything appears at once, no shimmer).
 *
 *   <AssemblingSequence>
 *     <KpiCard … />
 *     <PlanReviewFindings … />
 *     <ProvenanceDrill … />
 *   </AssemblingSequence>
 *
 *   // with the assembling shimmer label and a wider stagger:
 *   <AssemblingSequence shimmer label="Assembling the deal…" step={0.12}>
 *     {components.map((c) => <Component key={c.id} … />)}
 *   </AssemblingSequence>
 *
 * Re-runs the sequence when `replayKey` changes (e.g. a new intent was typed).
 */

import { Children, isValidElement, type ReactNode } from "react";
import { AdaptiveReveal, type RevealVariant } from "./AdaptiveReveal";
import { useStaggeredReveal } from "./useStaggeredReveal";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export interface AssemblingSequenceProps {
  children: ReactNode;
  /** Motion variant applied to each child. Default "rise". */
  variant?: RevealVariant;
  /** Delay before the first item (seconds). Default 0.05. */
  base?: number;
  /** Gap between items (seconds). Default 0.1. */
  step?: number;
  /** Cap on the per-item delay (seconds). Default 1.1. */
  max?: number;
  /** Show a brief "assembling…" shimmer header while the sequence plays. */
  shimmer?: boolean;
  /** Label for the shimmer header. Default "Assembling…". */
  label?: string;
  /**
   * Change this to replay the whole assembly (e.g. a new intent). Forwarded as
   * the React key prefix so each child remounts and re-animates.
   */
  replayKey?: string | number;
  className?: string;
}

export function AssemblingSequence({
  children,
  variant = "rise",
  base = 0.05,
  step = 0.1,
  max = 1.1,
  shimmer = false,
  label = "Assembling…",
  replayKey,
  className,
}: AssemblingSequenceProps) {
  const reduced = usePrefersReducedMotion();
  const items = Children.toArray(children).filter(isValidElement);
  const delays = useStaggeredReveal(items.length, { base, step, max });

  return (
    <div className={className} data-assembling-sequence>
      {shimmer && !reduced && (
        <div
          key={`shimmer-${replayKey ?? "0"}`}
          className="assembling-shimmer mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-zinc-500"
          // shimmer fades out as the sequence completes
          style={{
            animation: "mox-assembling-fade 0.9s ease-out forwards",
          }}
        >
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" />
          {label}
        </div>
      )}
      {items.map((child, i) => (
        <AdaptiveReveal
          key={`${replayKey ?? "0"}-${i}`}
          variant={variant}
          delay={delays[i]}
        >
          {child}
        </AdaptiveReveal>
      ))}
    </div>
  );
}

export default AssemblingSequence;
