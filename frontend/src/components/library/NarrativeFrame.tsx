/**
 * NarrativeFrame — renders the canonical framing copy at the open and close of
 * the demo (honesty guardrail 5: the opening framing line must be present).
 *
 * The opening line is fixed verbatim in this component so a surface cannot drift
 * from the canonical wording. The closing copy is longer demo prose and is passed
 * in (see docs/narrative/framing.md for the canonical text), so the same frame
 * serves both ends without hardcoding paragraphs.
 *
 * Honesty notes baked in:
 *  - Opening line is the README/run-sheet verbatim string and cannot be edited
 *    via props (only positioned via `variant="open"`).
 *  - This component carries NO live-bidirectional-Yardi claim (guardrail 6).
 *
 * USAGE:
 *   <NarrativeFrame variant="open" />
 *   <NarrativeFrame variant="close">{closingCopyNodes}</NarrativeFrame>
 *
 * Tailwind v4 / React 19. Dark zinc palette matching frontend/src/app/page.tsx.
 */

import type { ReactNode } from "react";

/** The canonical opening framing line. Verbatim — do not alter. */
export const OPENING_FRAMING_LINE =
  "The engine is real. The data is representative, shaped like yours. Wiring it to your Yardi is what the first phase does.";

export interface NarrativeFrameProps {
  variant: "open" | "close";
  /** Closing copy nodes (canonical text in docs/narrative/framing.md). */
  children?: ReactNode;
  className?: string;
}

export function NarrativeFrame({
  variant,
  children,
  className,
}: NarrativeFrameProps): ReactNode {
  const base = [
    "rounded-lg border border-zinc-800 bg-zinc-900/50 px-5 py-4",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  if (variant === "open") {
    return (
      <section className={base} data-narrative-frame="open">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
          Framing
        </p>
        <p className="mt-2 text-lg font-medium leading-snug text-zinc-100">
          {OPENING_FRAMING_LINE}
        </p>
      </section>
    );
  }

  return (
    <section className={base} data-narrative-frame="close">
      <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
        Closing
      </p>
      <div className="mt-2 space-y-3 text-zinc-300">{children}</div>
    </section>
  );
}

export default NarrativeFrame;
