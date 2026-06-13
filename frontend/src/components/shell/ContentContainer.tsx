/**
 * ContentContainer — the responsive content wrapper surfaces opt into.
 *
 * The demo is shown full-screen on a big display. Surfaces should NOT box their
 * content in a narrow max-w-3xl column on a projector. This container gives a
 * sensible reading width that scales up to large displays, with comfortable
 * gutters, and accounts for the sticky header height.
 *
 *   import { ContentContainer } from "@/components/shell";
 *   <ContentContainer>…surface content…</ContentContainer>
 *
 * Widths:
 *   "prose"   — narrower reading column for text-heavy surfaces (max-w-4xl)
 *   "wide"    — the default; comfortable on laptop → large display (max-w-7xl)
 *   "full"    — full-bleed for viewer/twin surfaces (no max width, just gutters)
 *
 * This is a server component (no client deps) so any surface can use it.
 */

import type { ReactNode } from "react";

export type ContainerWidth = "prose" | "wide" | "full";

export interface ContentContainerProps {
  children: ReactNode;
  width?: ContainerWidth;
  /** Remove the default vertical padding (for surfaces managing their own). */
  flush?: boolean;
  className?: string;
}

const WIDTHS: Record<ContainerWidth, string> = {
  prose: "max-w-4xl",
  wide: "max-w-7xl",
  full: "max-w-none",
};

export function ContentContainer({
  children,
  width = "wide",
  flush = false,
  className,
}: ContentContainerProps) {
  return (
    <div
      className={[
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        WIDTHS[width],
        flush ? "" : "py-8 lg:py-12",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export default ContentContainer;
