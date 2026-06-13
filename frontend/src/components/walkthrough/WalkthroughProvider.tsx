"use client";

/**
 * WalkthroughProvider — the guided-walkthrough engine (React context).
 *
 * Holds the ordered list of demo beats and the current position. PRESENTER-DRIVEN:
 * Next/Prev are manual, there is no autoplay you cannot control. Position persists
 * in sessionStorage so navigating between routes keeps the beat.
 *
 * Mounted once in the app shell (layout.tsx). The header drives start/next/prev/
 * exit and shows the current beat indicator; surfaces read the active beat via
 * useWalkthrough() and render its prose with <WalkthroughNarration/>.
 *
 * Navigation: Next/Prev route to the beat's `surface` via Next.js router. The
 * provider exposes the active beat but does NOT force navigation on mount, so a
 * presenter can land on any surface directly and still re-engage the walkthrough.
 *
 * API (useWalkthrough):
 *   active            boolean — is the walkthrough running?
 *   index             number  — current beat index (0-based) when active
 *   beat              Beat | null — the current beat
 *   beats             Beat[]  — the full ordered list
 *   start(i?)         begin (optionally at an index), routes to that beat
 *   next() / prev()   move a beat (clamped), routes to it
 *   goTo(i)           jump to a beat index, routes to it
 *   exit()            stop the walkthrough (clears position)
 *   isFirst / isLast  booleans
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { BEATS, type Beat } from "./beats";

const STORAGE_KEY = "mox-demo-walkthrough";

interface PersistedState {
  active: boolean;
  index: number;
}

export interface WalkthroughContextValue {
  active: boolean;
  index: number;
  beat: Beat | null;
  beats: Beat[];
  start: (index?: number) => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  exit: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const WalkthroughContext = createContext<WalkthroughContextValue | null>(null);

function clampIndex(i: number): number {
  return Math.max(0, Math.min(BEATS.length - 1, i));
}

export function WalkthroughProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);

  // Rehydrate position after mount (avoids SSR mismatch).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedState;
        if (typeof parsed.index === "number") setIndex(clampIndex(parsed.index));
        if (typeof parsed.active === "boolean") setActive(parsed.active);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((state: PersistedState) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, []);

  /** Navigate to a beat's surface if we aren't already there. */
  const routeTo = useCallback(
    (i: number) => {
      const beat = BEATS[i];
      if (!beat) return;
      if (typeof window !== "undefined" && window.location.pathname === beat.surface) {
        return; // already on the right surface — don't churn the router
      }
      router.push(beat.surface);
    },
    [router]
  );

  const apply = useCallback(
    (nextActive: boolean, nextIndex: number, navigate: boolean) => {
      const clamped = clampIndex(nextIndex);
      setActive(nextActive);
      setIndex(clamped);
      persist({ active: nextActive, index: clamped });
      if (nextActive && navigate) routeTo(clamped);
    },
    [persist, routeTo]
  );

  const start = useCallback(
    (i = 0) => apply(true, i, true),
    [apply]
  );
  const next = useCallback(
    () => apply(true, index + 1, true),
    [apply, index]
  );
  const prev = useCallback(
    () => apply(true, index - 1, true),
    [apply, index]
  );
  const goTo = useCallback(
    (i: number) => apply(true, i, true),
    [apply]
  );
  const exit = useCallback(() => apply(false, 0, false), [apply]);

  const value = useMemo<WalkthroughContextValue>(
    () => ({
      active,
      index,
      beat: active ? BEATS[index] ?? null : null,
      beats: BEATS,
      start,
      next,
      prev,
      goTo,
      exit,
      isFirst: index === 0,
      isLast: index === BEATS.length - 1,
    }),
    [active, index, start, next, prev, goTo, exit]
  );

  return (
    <WalkthroughContext.Provider value={value}>
      {children}
    </WalkthroughContext.Provider>
  );
}

export function useWalkthrough(): WalkthroughContextValue {
  const ctx = useContext(WalkthroughContext);
  if (!ctx) {
    throw new Error(
      "useWalkthrough must be used within a <WalkthroughProvider> (app shell)."
    );
  }
  return ctx;
}
