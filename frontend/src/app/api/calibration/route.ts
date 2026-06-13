import { NextResponse } from "next/server";

import {
  HAUSKA_KEY_HEADER,
  atomStore,
  filterAtoms,
  makeEvent,
  resolveSubject,
  sanitizeEvents,
  summaryFor,
  type CalibrationAction,
} from "@/lib/engine/index";

/**
 * POST /api/calibration — the deposit-loop write path (STATELESS serverless).
 *
 * Body: { atomId, action: accept|edit|reject, itemId?, note?, priorEvents? }.
 * Requires a key that can READ the atom (you cannot calibrate what you cannot
 * see) — the gate runs on writes too.
 *
 * Because Vercel serverless does not persist across invocations, the CLIENT
 * accumulates events and sends them back as `priorEvents`. The server stamps the
 * new event and returns the reflection computed over priorEvents + the new event
 * — the earning loop is visibly LIVE after a correction. Honest: this is a
 * signal count, never relabeled as earned-calibrated. The client persists the
 * returned `recorded` event and replays it on the next /api/intent call.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const subject = resolveSubject(req.headers.get(HAUSKA_KEY_HEADER));
  const body = (await req.json().catch(() => ({}))) as {
    atomId?: string;
    action?: string;
    itemId?: string;
    note?: string;
    actor?: string;
    priorEvents?: unknown;
  };
  const { atomId, action } = body;
  if (!atomId || !action) {
    return NextResponse.json(
      { error: "atomId and action are required" },
      { status: 400 },
    );
  }
  if (!["accept", "edit", "reject"].includes(action)) {
    return NextResponse.json(
      { error: "action must be accept|edit|reject" },
      { status: 400 },
    );
  }
  const atom = atomStore.get(atomId);
  if (!atom) {
    return NextResponse.json({ error: "atom not found" }, { status: 404 });
  }
  const { kept } = filterAtoms(subject, [atom]);
  if (kept.length === 0) {
    return NextResponse.json({ error: "atom not found" }, { status: 404 }); // gate on writes
  }

  const recorded = makeEvent({
    atomId,
    action: action as CalibrationAction,
    itemId: body.itemId,
    note: body.note,
    actor: body.actor ?? subject.label,
  });
  // Reflect immediately over the client-accumulated history + this event.
  const events = [...sanitizeEvents(body.priorEvents), recorded];
  return NextResponse.json(
    { recorded, reflection: summaryFor(atomId, events) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
