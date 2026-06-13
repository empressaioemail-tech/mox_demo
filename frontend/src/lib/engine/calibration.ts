import { randomUUID } from "node:crypto";

/**
 * The deposit-loop calibration — STATELESS for serverless (ported and adapted
 * from backend/src/engine/calibration.ts).
 *
 * Vercel serverless is stateless across invocations, so a module-level store
 * would NOT reliably persist. Instead the CLIENT accumulates accept/edit/reject
 * events and sends them back with each /api/intent (as `priorEvents`) and each
 * /api/calibration call (as `priorEvents`). The engine reflects them in that
 * same response — the earning loop is visibly LIVE after a correction without
 * any persistent server.
 *
 * Honesty guardrail 2: this proves the EARNING LOOP is live — it does NOT
 * relabel a baseline confidence as earned-calibrated off a click. The engine
 * surfaces "N calibration signals recorded" as a separate, honest fact
 * alongside the atom's own (still baseline / provenance-backed) confidence.
 */

export type CalibrationAction = "accept" | "edit" | "reject";

export interface CalibrationEvent {
  eventId: string;
  atomId: string;
  /** The surfaced item within the atom (e.g. a resolution path), optional. */
  itemId?: string;
  action: CalibrationAction;
  /** Operator note / the edited value, for `edit`/`reject`. */
  note?: string;
  /** Who deposited it (demo: free-text actor). */
  actor?: string;
  recordedAt: string;
}

export interface CalibrationSummary {
  atomId: string;
  total: number;
  accepts: number;
  edits: number;
  rejects: number;
  /** Honest label: the loop is live; this is signal count, not earned-calibrated. */
  signalLabel: string;
  lastRecordedAt?: string;
}

/** Build one calibration event server-side (stamps eventId + recordedAt). */
export function makeEvent(input: {
  atomId: string;
  action: CalibrationAction;
  itemId?: string;
  note?: string;
  actor?: string;
}): CalibrationEvent {
  return {
    eventId: randomUUID(),
    atomId: input.atomId,
    itemId: input.itemId,
    action: input.action,
    note: input.note,
    actor: input.actor,
    recordedAt: new Date().toISOString(),
  };
}

/** Coerce arbitrary client-supplied JSON into a clean CalibrationEvent[]. */
export function sanitizeEvents(raw: unknown): CalibrationEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: CalibrationEvent[] = [];
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const e = r as Record<string, unknown>;
    const atomId = typeof e.atomId === "string" ? e.atomId : undefined;
    const action = e.action;
    if (!atomId) continue;
    if (action !== "accept" && action !== "edit" && action !== "reject") continue;
    out.push({
      eventId: typeof e.eventId === "string" ? e.eventId : randomUUID(),
      atomId,
      itemId: typeof e.itemId === "string" ? e.itemId : undefined,
      action,
      note: typeof e.note === "string" ? e.note : undefined,
      actor: typeof e.actor === "string" ? e.actor : undefined,
      recordedAt:
        typeof e.recordedAt === "string" ? e.recordedAt : new Date().toISOString(),
    });
  }
  return out;
}

/**
 * The reflection: how the engine reads the deposit loop back for an atom, given
 * the client-accumulated events. Pure function of (atomId, events) — no state.
 */
export function summaryFor(
  atomId: string,
  events: CalibrationEvent[],
): CalibrationSummary {
  const evs = events.filter((e) => e.atomId === atomId);
  const accepts = evs.filter((e) => e.action === "accept").length;
  const edits = evs.filter((e) => e.action === "edit").length;
  const rejects = evs.filter((e) => e.action === "reject").length;
  const last = evs[evs.length - 1]?.recordedAt;
  return {
    atomId,
    total: evs.length,
    accepts,
    edits,
    rejects,
    signalLabel:
      evs.length === 0
        ? "No calibration signals yet (earning loop is live)"
        : `${evs.length} calibration signal${evs.length === 1 ? "" : "s"} recorded — earning loop live (not yet earned-calibrated)`,
    lastRecordedAt: last,
  };
}
