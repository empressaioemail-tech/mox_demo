import { NextResponse } from "next/server";

import { LLM_MODEL, atomStore, providerMode } from "@/lib/engine/index";

/** GET /api/health — liveness + engine summary (the self-contained engine). */

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "mox-demo (self-contained engine)",
    engine: {
      providerMode,
      model: providerMode === "anthropic" ? LLM_MODEL : null,
      atomsLoaded: atomStore.size(),
    },
  });
}
