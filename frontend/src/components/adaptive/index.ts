/**
 * Adaptive barrel — the reveal / transition primitives that make a surface feel
 * like it assembles itself live.
 *
 *   import {
 *     AdaptiveReveal, AssemblingSequence, useStaggeredReveal,
 *     usePrefersReducedMotion,
 *   } from "@/components/adaptive";
 *
 * All primitives respect prefers-reduced-motion (collapse to instant appearance).
 * Built on framer-motion.
 */

export { AdaptiveReveal } from "./AdaptiveReveal";
export type { AdaptiveRevealProps, RevealVariant } from "./AdaptiveReveal";

export { AssemblingSequence } from "./AssemblingSequence";
export type { AssemblingSequenceProps } from "./AssemblingSequence";

export { useStaggeredReveal } from "./useStaggeredReveal";
export type { StaggerOptions } from "./useStaggeredReveal";

export { usePrefersReducedMotion } from "./usePrefersReducedMotion";
