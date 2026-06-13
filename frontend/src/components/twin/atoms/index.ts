/**
 * WS-4 twin atom loader — STATIC, build-time bundle.
 *
 * The deployed twin must render WITHOUT a live backend (Vercel, no engine).
 * So the public-free atoms it needs are copied into this directory from the
 * canonical data/ store (WS-1) and imported at build time. No fetch, no engine
 * dependency at render. The engine is used only for progressive enhancement
 * (the deposit loop and live lineage), never required.
 *
 * The operating atom (proforma-nelray) is tenant-private; it is bundled here for
 * DISPLAY ONLY because the twin is the operator's own view (per the WS-4 brief).
 * It is never presented as public or pooled into shared ground truth.
 */

import buildingJson from "./building.json";
import unit2brJson from "./unit-typical-2br.json";
import unit1brJson from "./unit-typical-1br.json";
import zoningJson from "./zoning-mf3.json";
import code562Json from "./code-25-2-562.json";
import code491Json from "./code-25-2-491.json";
import code564Json from "./code-25-2-564-mf4.json";
import floodJson from "./flood.json";
import parcel226623Json from "./parcel-226623.json";
import parcel607Json from "./parcel-607-nelray.json";
import parcel609Json from "./parcel-609-nelray.json";
import entitlementJson from "./entitlement-finding.json";
import proformaJson from "./proforma-nelray.json";

/** Minimal atom shape the twin reads. Unknown extra fields are tolerated. */
export interface TwinConfidence {
  value: number;
  /** baseline | provenance-backed | provisional | earned-through-outcome */
  state: string;
  stateNote?: string;
  chipLabel?: string;
}

export interface TwinProvenance {
  role: string;
  tool?: string;
  repo?: string;
  citation?: string;
  url?: string;
  note?: string;
  derivedFromAtom?: string;
  status?: string;
  produced?: string;
}

export interface TwinAtom {
  atomId: string;
  entityType: string;
  entityId: string;
  provisional?: boolean;
  provisionalReason?: string;
  seeded?: boolean;
  seededNote?: string;
  payload: Record<string, unknown>;
  provenance: TwinProvenance[];
  reasoning?: string;
  confidence: TwinConfidence;
  freshness?: Record<string, unknown>;
  accessPolicy?: string;
}

// Cast through unknown: the JSON fixtures are wider than the read view above.
const asAtom = (j: unknown): TwinAtom => j as TwinAtom;

export const building = asAtom(buildingJson);
export const unit2br = asAtom(unit2brJson);
export const unit1br = asAtom(unit1brJson);
export const zoningMf3 = asAtom(zoningJson);
export const code562 = asAtom(code562Json);
export const code491 = asAtom(code491Json);
export const code564 = asAtom(code564Json);
export const flood = asAtom(floodJson);
export const parcel226623 = asAtom(parcel226623Json);
export const parcel607 = asAtom(parcel607Json);
export const parcel609 = asAtom(parcel609Json);
export const entitlementFinding = asAtom(entitlementJson);
export const operatingProforma = asAtom(proformaJson);

/** All atoms, keyed by atomId, for local lineage lookup without the engine. */
export const ATOMS_BY_ID: Record<string, TwinAtom> = Object.fromEntries(
  [
    building,
    unit2br,
    unit1br,
    zoningMf3,
    code562,
    code491,
    code564,
    flood,
    parcel226623,
    parcel607,
    parcel609,
    entitlementFinding,
    operatingProforma,
  ].map((a) => [a.atomId, a]),
);

/** Map an atom confidence `state` string to the ConfidenceChip union (guardrail 1). */
export function toChipState(
  state: string,
): "baseline" | "provenance-backed" | "earned-through-outcome" {
  if (state === "provenance-backed") return "provenance-backed";
  if (state === "earned-through-outcome") return "earned-through-outcome";
  // "baseline", "provisional", and anything else collapse to baseline — never
  // presented as earned (guardrail 1). The stateNote carries the precise state.
  return "baseline";
}
