import type { AccessPolicy } from "@hauska/atom-contract";

/**
 * The presented atom envelope used across the Mox demo, per data/README.md and
 * data/SUBSTRATE_NOTES.md. This mirrors backend/src/types/atom.ts so the ported
 * engine binds the real WS-1 fixture shape without reshaping it: identity +
 * provenance + reasoning + confidence{value,state} + freshness + accessPolicy.
 *
 * This module is server-only — the engine never ships to the client bundle.
 */

/** Confidence state vocabulary (honesty guardrail 1: state is always surfaced). */
export type ConfidenceState =
  | "baseline"
  | "provenance-backed"
  | "earned-calibrated"
  | "provisional";

export interface AtomConfidence {
  /** Numeric value — NEVER surfaced bare; always paired with `state`. */
  value: number;
  state: ConfidenceState;
  /** Optional human-facing chip label. */
  chipLabel?: string;
  /** Why the confidence is in this state; what would move it. */
  stateNote?: string;
}

export interface AtomProvenanceEntry {
  role: string;
  tool?: string;
  repo?: string;
  produced?: string;
  citation?: string;
  url?: string;
  derivedFromAtom?: string;
  fetchedAt?: string | null;
  [key: string]: unknown;
}

export interface AtomFreshness {
  asOf?: string;
  asOfDate?: string;
  fetchedAt?: string | null;
  codeEdition?: string;
  [key: string]: unknown;
}

/** A composition edge on a molecule atom (deal.json), @hauska/atom-contract shape. */
export interface AtomCompositionEdge {
  childEntityType: string;
  childMode: string;
  dataKey: string;
}

/** The loaded, presented atom (a /data fixture). */
export interface Atom {
  atomId: string;
  entityType: string;
  entityId: string;
  jurisdictionTenant: string;
  schemaVersion?: string;
  contentHash?: string;
  provisional?: boolean;
  payload: Record<string, unknown>;
  provenance: AtomProvenanceEntry[];
  reasoning?: string;
  confidence: AtomConfidence;
  freshness?: AtomFreshness;
  accessPolicy: AccessPolicy;
  /** Molecule-only: composition edges + member rows (deal.json). */
  composition?: AtomCompositionEdge[];
  members?: Record<string, Array<{ atomDid?: string; [key: string]: unknown }>>;
  /** Allow the extra per-entity fields the fixtures carry. */
  [key: string]: unknown;
}
