/**
 * Engine client — the single place the hero surfaces talk to the engine.
 *
 * The engine now lives INSIDE this Next.js app as server-side API route
 * handlers (frontend/src/app/api/*, backed by frontend/src/lib/engine/). These
 * helpers therefore call SAME-ORIGIN relative "/api/..." paths — no
 * NEXT_PUBLIC_BACKEND_URL, no local backend. That is the fix for the deployed
 * "Failed to fetch" / "Engine unreachable" bug: on Vercel the surfaces hit the
 * same deployment that serves them.
 *
 * Every value-bearing component carries its confidence WITH state (guardrail 1).
 * The deposit loop (accept/edit/reject) records a calibration EVENT; because
 * Vercel serverless is stateless, the client accumulates those events and
 * replays them with each intent so the surface visibly reflects the loop is live
 * (guardrail 2) — without a persistent server.
 */

/** The keyed view (full tenant atoms incl. operating). No key = public-only. */
export const HAUSKA_TENANT_KEY = "mox-tenant-key";
const HAUSKA_KEY_HEADER = "X-Hauska-Key";

// ---- engine output types (mirror frontend/src/lib/engine/catalog.ts) -------

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
  /** baseline | provenance-backed | earned-calibrated | provisional */
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

/** A client-accumulated calibration event (stateless serverless deposit loop). */
export interface CalibrationEvent {
  eventId: string;
  atomId: string;
  itemId?: string;
  action: CalibrationAction;
  note?: string;
  actor?: string;
  recordedAt: string;
}

export interface CalibrationResult {
  recorded: CalibrationEvent;
  reflection: CalibrationSummary;
}

// ---- client-side calibration event accumulation ----------------------------
//
// The earning loop must survive a stateless server. We keep the events the user
// has deposited this session in sessionStorage and replay them with each intent
// + each calibration call so the reflection (signal count) is live after a
// correction. This is honest: it is a count of signals, never a relabel of the
// number as earned-calibrated.

const CAL_STORE_KEY = "mox.calibrationEvents";

function loadEvents(): CalibrationEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(CAL_STORE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as CalibrationEvent[]) : [];
  } catch {
    return [];
  }
}

function saveEvents(events: CalibrationEvent[]): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(CAL_STORE_KEY, JSON.stringify(events));
  } catch {
    /* sessionStorage unavailable — degrade to in-memory for this call only */
  }
}

/** The accumulated deposit-loop events (read-only snapshot). */
export function calibrationEvents(): CalibrationEvent[] {
  return loadEvents();
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
 *
 * The client-accumulated calibration events are replayed so the reflection is
 * live across the stateless server.
 */
export async function submitIntent(
  intent: string,
  useKey = true,
): Promise<AssemblyResult> {
  const res = await fetch(`/api/intent`, {
    method: "POST",
    headers: headers(useKey),
    body: JSON.stringify({ intent, calibrationEvents: loadEvents() }),
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
 * (e.g. the entitlement finding), accumulates it client-side, and returns the
 * updated reflection the engine will surface — the earning loop made visible,
 * honestly (signal count, never relabeled as earned-calibrated).
 */
export async function recordCalibration(args: {
  atomId: string;
  action: CalibrationAction;
  itemId?: string;
  note?: string;
  useKey?: boolean;
}): Promise<CalibrationResult> {
  const { atomId, action, itemId, note, useKey = true } = args;
  const prior = loadEvents();
  const res = await fetch(`/api/calibration`, {
    method: "POST",
    headers: headers(useKey),
    body: JSON.stringify({ atomId, action, itemId, note, priorEvents: prior }),
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Calibration returned ${res.status}${detail ? `: ${detail}` : ""}`,
    );
  }
  const result = (await res.json()) as CalibrationResult;
  // Accumulate the freshly recorded event so it replays on the next intent.
  saveEvents([...prior, result.recorded]);
  return result;
}

/** The rehearsed hero intents (known-good paths). */
export const HERO_INTENTS = [
  "show me this deal",
  "vet the proposed building",
  "why is this flagged",
  "open a unit",
  "generate the LP view",
] as const;
