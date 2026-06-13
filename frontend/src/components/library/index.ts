/**
 * Component library barrel.
 *
 * Re-exports the shared library primitives so surfaces import from one place:
 *   import { ConfidenceChip, NarrativeFrame } from "@/components/library";
 *
 * Owned states: WS-0 wiring types (types.ts) and the WS-7 honesty primitives
 * (ConfidenceChip, NarrativeFrame). Other workstreams may add their components
 * here without clobbering these exports.
 */

export type { ComponentAtomMeta } from "./types";
export { SCAFFOLD_META } from "./types";

export {
  ConfidenceChip,
  default as ConfidenceChipDefault,
} from "./ConfidenceChip";
export type {
  ConfidenceChipProps,
  ConfidenceState,
  VerificationLevel,
} from "./ConfidenceChip";

export {
  NarrativeFrame,
  OPENING_FRAMING_LINE,
  default as NarrativeFrameDefault,
} from "./NarrativeFrame";
export type { NarrativeFrameProps } from "./NarrativeFrame";
