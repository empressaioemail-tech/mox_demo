import { NextResponse } from "next/server";

import {
  HAUSKA_KEY_HEADER,
  engine,
  resolveSubject,
  sanitizeEvents,
} from "@/lib/engine/index";

/**
 * POST /api/intent — same-origin engine read path.
 *
 * Body: { intent: string, calibrationEvents?: CalibrationEvent[] }.
 * Header: X-Hauska-Key (missing/wrong => public-only; tenant-private gated out).
 *
 * Returns the ordered, populated components for the intent. The optional
 * `calibrationEvents` is the client-accumulated deposit-loop history (stateless
 * serverless) — the engine reflects it into each component's bound atoms so the
 * earning loop is visibly live after a correction, without a persistent server.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    intent?: string;
    calibrationEvents?: unknown;
  };
  const intent = (body.intent ?? "").trim();
  if (!intent) {
    return NextResponse.json({ error: "intent is required" }, { status: 400 });
  }
  const subject = resolveSubject(req.headers.get(HAUSKA_KEY_HEADER));
  const events = sanitizeEvents(body.calibrationEvents);
  const result = await engine.assemble(intent, subject, events);
  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}
