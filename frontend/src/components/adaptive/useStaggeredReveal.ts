"use client";

/**
 * useStaggeredReveal — per-item delays for a staggered reveal sequence.
 *
 * Returns an array of delays (seconds) for `count` items, so a list animates in
 * one-by-one rather than all at once. Respects prefers-reduced-motion (all delays
 * collapse to 0). Use with <AdaptiveReveal index=…> or feed delays directly to a
 * motion component.
 *
 *   const delays = useStaggeredReveal(items.length);
 *   items.map((it, i) => <AdaptiveReveal key={i} delay={delays[i]}>…</AdaptiveReveal>)
 */

import { useMemo } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export interface StaggerOptions {
  /** Delay before the first item (seconds). Default 0. */
  base?: number;
  /** Gap between successive items (seconds). Default 0.08. */
  step?: number;
  /** Cap the per-item delay so long lists don't drag (seconds). Default 0.9. */
  max?: number;
}

export function useStaggeredReveal(
  count: number,
  options: StaggerOptions = {}
): number[] {
  const { base = 0, step = 0.08, max = 0.9 } = options;
  const reduced = usePrefersReducedMotion();

  return useMemo(() => {
    if (reduced) return Array.from({ length: count }, () => 0);
    return Array.from({ length: count }, (_, i) =>
      Math.min(base + i * step, max)
    );
  }, [count, base, step, max, reduced]);
}

export default useStaggeredReveal;
