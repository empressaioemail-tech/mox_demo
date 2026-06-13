"use client";

/**
 * usePrefersReducedMotion — reactive prefers-reduced-motion hook.
 *
 * Returns true when the user has requested reduced motion. The adaptive
 * primitives use this to collapse all animation to an instant appearance, so
 * the "magical assembly" never becomes an accessibility problem.
 *
 * SSR-safe: returns false on the server / before mount, then updates.
 */

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(QUERY);
    setReduced(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export default usePrefersReducedMotion;
