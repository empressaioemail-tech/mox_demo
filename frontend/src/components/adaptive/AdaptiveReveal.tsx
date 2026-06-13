"use client";

/**
 * AdaptiveReveal — wraps a child and fades/slides/scales it into the frame.
 *
 * The atom of the "magical, adaptive" feel: a single element appearing into the
 * surface intentionally rather than popping in. Configure the motion variant, and
 * a delay or stagger index so a group reveals one-by-one. Respects
 * prefers-reduced-motion (renders instantly, no transform).
 *
 *   <AdaptiveReveal>…</AdaptiveReveal>                       // default fade+rise
 *   <AdaptiveReveal index={2}>…</AdaptiveReveal>             // staggered by index
 *   <AdaptiveReveal variant="scale" delay={0.3}>…</…>        // explicit delay
 *   <AdaptiveReveal whenInView>…</AdaptiveReveal>            // reveal on scroll-in
 *
 * Built on framer-motion for quality; degrades to an immediate render under
 * reduced-motion.
 */

import { motion, type Variants } from "framer-motion";
import { useMemo, type ElementType, type ReactNode } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export type RevealVariant = "fade" | "rise" | "slide-left" | "slide-right" | "scale";

export interface AdaptiveRevealProps {
  children: ReactNode;
  /** Motion style. Default "rise" (fade + small upward translate). */
  variant?: RevealVariant;
  /** Explicit delay in seconds. Takes precedence over `index`. */
  delay?: number;
  /** Stagger index; multiplied by `step` to derive a delay. */
  index?: number;
  /** Per-index delay step (seconds) when using `index`. Default 0.08. */
  step?: number;
  /** Animation duration (seconds). Default 0.45. */
  duration?: number;
  /** Reveal when scrolled into view rather than on mount. Default false. */
  whenInView?: boolean;
  /** Render as a different element/component. Default "div". */
  as?: ElementType;
  className?: string;
}

const OFFSET = 12; // px translate for rise/slide

function hidden(variant: RevealVariant) {
  switch (variant) {
    case "fade":
      return { opacity: 0 };
    case "rise":
      return { opacity: 0, y: OFFSET };
    case "slide-left":
      return { opacity: 0, x: OFFSET };
    case "slide-right":
      return { opacity: 0, x: -OFFSET };
    case "scale":
      return { opacity: 0, scale: 0.96 };
  }
}

export function AdaptiveReveal({
  children,
  variant = "rise",
  delay,
  index = 0,
  step = 0.08,
  duration = 0.45,
  whenInView = false,
  as,
  className,
}: AdaptiveRevealProps) {
  const reduced = usePrefersReducedMotion();
  // Memoize the motion component so it isn't recreated each render (which would
  // break animation identity and violate React's "no components during render").
  // The common case (no `as`) uses the static motion.div directly.
  const MotionTag = useMemo(
    () => (as ? motion.create(as) : motion.div),
    [as]
  );

  if (reduced) {
    const Tag = (as ?? "div") as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  const resolvedDelay = delay ?? index * step;
  const variants: Variants = {
    hidden: hidden(variant),
    shown: { opacity: 1, x: 0, y: 0, scale: 1 },
  };

  const animateProps = whenInView
    ? { whileInView: "shown", viewport: { once: true, amount: 0.25 } as const }
    : { animate: "shown" };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      variants={variants}
      transition={{
        duration,
        delay: resolvedDelay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      {...animateProps}
    >
      {children}
    </MotionTag>
  );
}

export default AdaptiveReveal;
