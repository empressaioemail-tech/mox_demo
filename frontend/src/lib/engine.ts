/**
 * Engine client — the single place the hero surfaces talk to the WS-2 engine.
 *
 * The engine (backend/) takes an intent and returns ordered, populated
 * components. Every value-bearing component carries its confidence WITH state
 * (guardrail 1). The deposit loop (accept/edit/reject) writes a calibration
 * event; we re-run the intent after a correction so the surface visibly
 * reflects the loop is live (guardrail 2).
 *
 * Reference: backend/src/server.ts (the read + write API).
 */

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8787";

/** The keyed view (full tenant atoms incl. operating). No key = public-only. */
export const HAUSKA_TENANT_KEY = "mox-tenant-key";
const HAUSKA_KEY_HEADER = "X-Hauska-Key";

// ---- engine output types (mirror backend/src/engine/catalog.ts) ------------

export type ComponentKind =
  | "kpi-card"
  | "provenance-drill"
  | "variance-anomaly-card"
  | "action-inbox"
  | "unit-twin-viewer"
  | "plan-review-findings"
  | "investor-rollup"
  | "renderings-panel";

/** Confidence surfaced with its state (guardrail 1) — never a bare number. */
export interface EngineConfidence {
  value: number;
  /** baseline | provenance-backed | earned-through-outcome | provisional */
  state: string;
  label: string;
  note?: string;
}

export interface ProvenanceRef {
  role: string;
  tool?: string;
  citation?: string;
  url?: string;
  derivedFromAtom?: string;
}

export interface CalibrationSummary {
  atomId: string;
  total: number;
  accepts: number;
  edits: number;
  rejects: number;
  signalLabel: string;
  lastRecordedAt?: string;
}

export interface AssembledComponent {
  componentKind: ComponentKind;
  title: string;
  boundAtomIds: string[];
  data: Record<string, unknown>;
  confidence: EngineConfidence[];
  provenance: ProvenanceRef[];
  rationale?: string;
  calibration: CalibrationSummary[];
}

export interface AssemblyResult {
  intent: string;
  providerMode: "mock" | "anthropic";
  model?: string;
  subject: { label: string; tenant: string | null };
  components: AssembledComponent[];
  gatedOut: Array<{ atomId: string; accessPolicy: string; reason: string }>;
}

export type CalibrationAction = "accept" | "edit" | "reject";

export interface CalibrationResult {
  recorded: {
    atomId: string;
    action: CalibrationAction;
    itemId?: string;
    note?: string;
    actor?: string;
    recordedAt?: string;
  };
  reflection: CalibrationSummary;
}

// ---- calls -----------------------------------------------------------------

function headers(useKey: boolean): HeadersInit {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (useKey) h[HAUSKA_KEY_HEADER] = HAUSKA_TENANT_KEY;
  return h;
}

/**
 * Submit an intent; the engine assembles + binds + reflects, returning ordered
 * components. `useKey` true = full keyed tenant view (default for the hero
 * surface); false = public-only (the gate drops tenant-private atoms).
 */
export async function submitIntent(
  intent: string,
  useKey = true,
): Promise<AssemblyResult> {
  const res = await fetch(`${BACKEND_URL}/api/intent`, {
    method: "POST",
    headers: headers(useKey),
    body: JSON.stringify({ intent }),
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Engine returned ${res.status}${detail ? `: ${detail}` : ""}`,
    );
  }
  return (await res.json()) as AssemblyResult;
}

/**
 * The deposit-loop write path. Records a calibration event against a real atom
 * (e.g. the entitlement finding). Returns the updated reflection the engine
 * will surface next assembly — the earning loop made visible, honestly.
 */
export async function recordCalibration(args: {
  atomId: string;
  action: CalibrationAction;
  itemId?: string;
  note?: string;
  useKey?: boolean;
}): Promise<CalibrationResult> {
  const { atomId, action, itemId, note, useKey = true } = args;
  const res = await fetch(`${BACKEND_URL}/api/calibration`, {
    method: "POST",
    headers: headers(useKey),
    body: JSON.stringify({ atomId, action, itemId, note }),
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Calibration returned ${res.status}${detail ? `: ${detail}` : ""}`,
    );
  }
  return (await res.json()) as CalibrationResult;
}

/** The rehearsed hero intents (known-good paths). */
export const HERO_INTENTS = [
  "show me this deal",
  "vet the proposed building",
  "why is this flagged",
  "open a unit",
  "generate the LP view",
] as const;
