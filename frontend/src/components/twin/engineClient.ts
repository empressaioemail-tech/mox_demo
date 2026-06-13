/**
 * WS-4 twin engine client — PROGRESSIVE ENHANCEMENT ONLY.
 *
 * The deployed twin renders fully from the bundled atoms (atoms/index.ts) with
 * NO backend. This client is used only to (a) optionally refresh a drilled atom
 * from the live gated atom API, and (b) POST the deposit-loop signal. Every call
 * fails soft: on any error the twin degrades gracefully (local fallback / note),
 * it never blocks render. The deployed twin does not require the backend.
 */

export const HAUSKA_KEY = "mox-tenant-key";
export const HAUSKA_KEY_HEADER = "X-Hauska-Key";

function backendBase(): string | null {
  // Only attempt the engine if a backend URL is configured at build time, OR
  // we are on localhost (dev). On a plain Vercel deploy with no URL set we skip
  // the network entirely so there is no console noise / hanging request.
  const configured =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.BACKEND_URL ?? null;
  if (configured) return configured;
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:8787";
  }
  return null;
}

export interface CalibrationResult {
  recorded: { atomId: string; action: string; itemId?: string };
  reflection: {
    atomId: string;
    total: number;
    accepts: number;
    edits: number;
    rejects: number;
    signalLabel: string;
    lastRecordedAt?: string;
  };
}

/**
 * Record an accept / edit / reject on a flagged finding (the deposit loop).
 * Returns the engine reflection if reachable, or null if the backend is not
 * configured/reachable (the caller then records intent locally). The earning
 * loop is LIVE when reachable — it records the signal — but it never relabels
 * the number as earned-calibrated (guardrail 2).
 */
export async function recordCalibration(input: {
  atomId: string;
  action: "accept" | "edit" | "reject";
  itemId?: string;
  note?: string;
}): Promise<CalibrationResult | null> {
  const base = backendBase();
  if (!base) return null;
  try {
    const res = await fetch(`${base}/api/calibration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [HAUSKA_KEY_HEADER]: HAUSKA_KEY,
      },
      body: JSON.stringify(input),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as CalibrationResult;
  } catch {
    return null;
  }
}

/** Is the engine even configured for this deployment? (UI affordance hint.) */
export function engineConfigured(): boolean {
  return backendBase() !== null;
}
