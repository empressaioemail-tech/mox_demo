/**
 * WS-5 engine client. Talks to the engine, which now lives INSIDE this Next.js
 * app as same-origin API route handlers (frontend/src/app/api/*). No
 * NEXT_PUBLIC_BACKEND_URL, no local backend — the fix for the deployed
 * "Engine unreachable" bug.
 *
 * The investor room is a GENERATED, CITED ARTIFACT (honesty guardrail 3): it
 * assembles itself from the live engine output for the "generate the LP view"
 * intent, then drills every surfaced number to its source atom through the same
 * gated atom API. It does NOT stand up the live, revocable LP umbilical; it is
 * the artifact you would hand an LP instead of a static PDF.
 *
 * Note on origins: fetchAtom + recordCalibration run in client components, so
 * they use SAME-ORIGIN relative paths. assembleLpView runs in a server
 * component, where relative fetch has no origin — it derives the same-origin
 * absolute base from the incoming request headers (next/headers), still hitting
 * this deployment's own /api.
 */

import type { AssemblyResult, AtomEnvelope } from "./types";

/** The tenant key the demo runs under (mirrors the engine gate registry). */
export const HAUSKA_KEY = "mox-tenant-key";
export const HAUSKA_KEY_HEADER = "X-Hauska-Key";

/** The intent that assembles the investor / data-room surface. */
export const LP_VIEW_INTENT = "generate the LP view";

/**
 * Server-side: resolve this deployment's own origin from the request headers so
 * a server component can fetch its own same-origin /api. Falls back to a
 * localhost dev origin. Dynamically imports next/headers so this module stays
 * importable from client components (which never call this path).
 */
async function sameOriginBase(): Promise<string> {
  try {
    const { headers } = await import("next/headers");
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    if (host) {
      const proto =
        h.get("x-forwarded-proto") ??
        (host.startsWith("localhost") || host.startsWith("127.")
          ? "http"
          : "https");
      return `${proto}://${host}`;
    }
  } catch {
    /* not in a request scope */
  }
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * Server-side: assemble the LP view from the engine via same-origin /api/intent.
 * Returns null on any failure so the page renders an honest "engine unreachable"
 * state rather than crash. No-store so the artifact reflects the live engine.
 */
export async function assembleLpView(): Promise<AssemblyResult | null> {
  try {
    const base = await sameOriginBase();
    const res = await fetch(`${base}/api/intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [HAUSKA_KEY_HEADER]: HAUSKA_KEY,
      },
      body: JSON.stringify({ intent: LP_VIEW_INTENT }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as AssemblyResult;
  } catch {
    return null;
  }
}

/**
 * Client-side: drill a single atom to its source (gated), same-origin. Used by
 * the lineage drawer so every headline number resolves down to the atom it came
 * from. Returns null if the atom is missing or gated out (the gate is honest: a
 * gated-out atom is indistinguishable from not-found).
 */
export async function fetchAtom(atomId: string): Promise<AtomEnvelope | null> {
  try {
    const res = await fetch(`/api/atoms/${encodeURIComponent(atomId)}`, {
      headers: { [HAUSKA_KEY_HEADER]: HAUSKA_KEY },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as AtomEnvelope;
  } catch {
    return null;
  }
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
 * Client-side: record an accept / edit / reject on a surfaced finding item,
 * same-origin. This is the deposit-loop write path (POST /api/calibration). The
 * earning loop is LIVE — it records the signal — but it does NOT relabel the
 * number as earned-calibrated (guardrail 2). Returns the updated reflection.
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

/** Map an engine confidence `state` string to the ConfidenceChip union. */
export function toChipState(
  state: string,
): "baseline" | "provenance-backed" | "earned-through-outcome" {
  if (state === "provenance-backed") return "provenance-backed";
  if (state === "earned-through-outcome") return "earned-through-outcome";
  // "baseline", "provisional", and anything else collapse to baseline — never
  // presented as earned (guardrail 1). The note carries the precise state.
  return "baseline";
}
