/**
 * WS-4 twin engine client — PROGRESSIVE ENHANCEMENT ONLY.
 *
 * The deployed twin renders fully from the bundled atoms (atoms/index.ts) with
 * NO network. This client is used only to POST the deposit-loop signal. The
 * engine now lives INSIDE this Next.js app as a same-origin API route, so the
 * call is a relative "/api/calibration" — no NEXT_PUBLIC_BACKEND_URL, no local
 * backend. Every call still fails soft: on any error the twin degrades
 * gracefully (local fallback / note); it never blocks render.
 */

"use client";

export const HAUSKA_KEY = "mox-tenant-key";
export const HAUSKA_KEY_HEADER = "X-Hauska-Key";

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
 * Record an accept / edit / reject on a flagged finding (the deposit loop),
 * same-origin. Returns the engine reflection, or null if the call fails (the
 * caller then records intent locally). The earning loop is LIVE — it records the
 * signal — but it never relabels the number as earned-calibrated (guardrail 2).
 */
export async function recordCalibration(input: {
  atomId: string;
  action: "accept" | "edit" | "reject";
  itemId?: string;
  note?: string;
}): Promise<CalibrationResult | null> {
  try {
    const res = await fetch(`/api/calibration`, {
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

/**
 * The engine is now bundled into this app as a same-origin API route, so it is
 * always available on the deployment that serves the twin. Retained for the UI
 * affordance hint that other components call.
 */
export function engineConfigured(): boolean {
  return true;
}
