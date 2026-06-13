/**
 * Walkthrough barrel — the guided demo-walkthrough engine.
 *
 *   import {
 *     WalkthroughProvider, useWalkthrough, WalkthroughNarration,
 *     BEATS, type Beat,
 *   } from "@/components/walkthrough";
 *
 * WalkthroughProvider is mounted in the app shell (layout.tsx). The header drives
 * start/next/prev/exit; surfaces render <WalkthroughNarration onlyOnSurface="…"/>.
 */

export { WalkthroughProvider, useWalkthrough } from "./WalkthroughProvider";
export type { WalkthroughContextValue } from "./WalkthroughProvider";

export { WalkthroughNarration } from "./WalkthroughNarration";
export type { WalkthroughNarrationProps } from "./WalkthroughNarration";

export { BEATS, BEAT_COUNT, getBeat, getBeatIndex } from "./beats";
export type { Beat } from "./beats";
