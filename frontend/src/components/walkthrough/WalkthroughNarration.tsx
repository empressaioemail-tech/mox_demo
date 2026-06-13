"use client";

/**
 * WalkthroughNarration — the on-screen coach-mark / narration card.
 *
 * Renders the current walkthrough beat's prose so the surface tells Mox's story
 * as the presenter advances. Surfaces drop this where they want the narration to
 * appear (typically near the top of the surface). It renders nothing when the
 * walkthrough is inactive, or — if `onlyOnSurface` is set — when the active beat
 * does not belong to the surface it is mounted on.
 *
 * Usage on a surface page:
 *   <WalkthroughNarration onlyOnSurface="/twin" />
 *
 * The header owns Next/Prev; this card is read-only narration plus an optional
 * compact step indicator.
 */

import { useWalkthrough } from "./WalkthroughProvider";

export interface WalkthroughNarrationProps {
  /**
   * If set, only render when the active beat's surface matches this route.
   * Prevents a beat's narration from showing on a surface it doesn't belong to.
   */
  onlyOnSurface?: string;
  /** Hide the small "Beat n of N" indicator. */
  hideStepIndicator?: boolean;
  className?: string;
}

export function WalkthroughNarration({
  onlyOnSurface,
  hideStepIndicator = false,
  className,
}: WalkthroughNarrationProps) {
  const { active, beat, index, beats } = useWalkthrough();

  if (!active || !beat) return null;
  if (onlyOnSurface && beat.surface !== onlyOnSurface) return null;

  return (
    <aside
      role="note"
      aria-label="Walkthrough narration"
      data-beat={beat.id}
      className={[
        "rounded-xl border border-sky-800/50 bg-sky-950/30 p-4 shadow-lg shadow-sky-950/20",
        "backdrop-blur-sm",
        className ?? "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-sky-400">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" />
          Walkthrough
          <span className="text-sky-300/70">· {beat.title}</span>
        </p>
        {!hideStepIndicator && (
          <span className="font-mono text-[10px] text-sky-400/70">
            Beat {index + 1} of {beats.length}
          </span>
        )}
      </div>

      <p className="mt-2 text-sm leading-relaxed text-sky-50">
        {beat.narration}
      </p>

      <p className="mt-2 text-[11px] text-sky-300/70">
        <span className="font-medium text-sky-300">Do:</span> {beat.hint}
      </p>

      {beat.sayAloud && (
        <p className="mt-2 border-l-2 border-sky-700/60 pl-3 text-xs italic leading-relaxed text-sky-200/80">
          “{beat.sayAloud}”
        </p>
      )}
    </aside>
  );
}

export default WalkthroughNarration;
