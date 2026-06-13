import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";

/**
 * The deposit-loop calibration store. When the operator accepts / edits /
 * rejects a surfaced item, that records a calibration EVENT. The engine
 * reflects these events back: an atom that has accumulated calibration events
 * carries a calibration summary the surface can show.
 *
 * Honesty guardrail 2: this proves the EARNING LOOP is live — it does NOT
 * relabel a baseline confidence as earned-calibrated off a single click. The
 * engine surfaces "N calibration signals recorded" as a separate, honest fact
 * alongside the atom's own (still baseline / provenance-backed) confidence.
 *
 * Persistence is a JSON file (in-memory mirror for fast reads); fine for the
 * demo per the brief.
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

export class CalibrationStore {
  private events: CalibrationEvent[] = [];
  private readonly path?: string;

  constructor(path?: string) {
    this.path = path;
    if (path && existsSync(path)) {
      try {
        const parsed = JSON.parse(readFileSync(path, "utf8"));
        if (Array.isArray(parsed)) this.events = parsed as CalibrationEvent[];
      } catch {
        this.events = [];
      }
    }
  }

  private persist(): void {
    if (!this.path) return;
    mkdirSync(dirname(this.path), { recursive: true });
    writeFileSync(this.path, JSON.stringify(this.events, null, 2), "utf8");
  }

  record(input: {
    atomId: string;
    action: CalibrationAction;
    itemId?: string;
    note?: string;
    actor?: string;
  }): CalibrationEvent {
    const event: CalibrationEvent = {
      eventId: randomUUID(),
      atomId: input.atomId,
      itemId: input.itemId,
      action: input.action,
      note: input.note,
      actor: input.actor,
      recordedAt: new Date().toISOString(),
    };
    this.events.push(event);
    this.persist();
    return event;
  }

  eventsFor(atomId: string): CalibrationEvent[] {
    return this.events.filter((e) => e.atomId === atomId);
  }

  all(): CalibrationEvent[] {
    return [...this.events];
  }

  /** The reflection: how the engine reads the deposit loop back for an atom. */
  summaryFor(atomId: string): CalibrationSummary {
    const evs = this.eventsFor(atomId);
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
}
