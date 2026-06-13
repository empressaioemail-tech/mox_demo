"use client";

/**
 * WalkthroughControls — the header's walkthrough cluster.
 *
 * Start / Prev / Next / Exit plus the current-beat indicator. Lets the presenter
 * re-engage the walkthrough from anywhere. Inactive state shows a single "Start
 * walkthrough" button; active state shows Prev · "Beat n/N · Title" · Next and an
 * Exit affordance.
 *
 * Used inside <DemoHeader>. Relies only on useWalkthrough().
 */

import { useWalkthrough } from "@/components/walkthrough";

export interface WalkthroughControlsProps {
  className?: string;
  /** Compact mode trims labels for the narrow header. */
  compact?: boolean;
}

const btn =
  "inline-flex items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-200 transition hover:border-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40";

export function WalkthroughControls({
  className,
  compact = false,
}: WalkthroughControlsProps) {
  const { active, beat, index, beats, start, next, prev, exit, isFirst, isLast } =
    useWalkthrough();

  if (!active) {
    return (
      <button
        type="button"
        onClick={() => start(0)}
        className={[
          "inline-flex items-center gap-1.5 rounded-md border border-sky-700/70 bg-sky-950/40 px-2.5 py-1 text-xs font-semibold text-sky-200 transition hover:border-sky-500 hover:text-sky-100",
          className ?? "",
        ].join(" ")}
      >
        <span aria-hidden="true">▶</span>
        {compact ? "Walkthrough" : "Start walkthrough"}
      </button>
    );
  }

  return (
    <div className={["flex items-center gap-1.5", className ?? ""].join(" ")}>
      <button
        type="button"
        onClick={prev}
        disabled={isFirst}
        className={btn}
        aria-label="Previous beat"
      >
        ‹ Prev
      </button>

      <div
        className="flex min-w-0 flex-col items-center px-1 leading-tight"
        aria-live="polite"
      >
        <span className="font-mono text-[10px] text-sky-400/80">
          {index + 1}/{beats.length}
        </span>
        {!compact && (
          <span className="max-w-[10rem] truncate text-[11px] font-medium text-zinc-200">
            {beat?.title}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={next}
        disabled={isLast}
        className={btn}
        aria-label="Next beat"
      >
        Next ›
      </button>

      <button
        type="button"
        onClick={exit}
        className="ml-0.5 inline-flex items-center justify-center rounded-md px-1.5 py-1 text-xs text-zinc-500 transition hover:text-zinc-200"
        aria-label="Exit walkthrough"
        title="Exit walkthrough"
      >
        ✕
      </button>
    </div>
  );
}

export default WalkthroughControls;
