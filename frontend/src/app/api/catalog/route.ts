import { NextResponse } from "next/server";

import { catalogSummary } from "@/lib/engine/index";

/** GET /api/catalog — catalog introspection (what the engine can assemble). */

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ components: catalogSummary() });
}
