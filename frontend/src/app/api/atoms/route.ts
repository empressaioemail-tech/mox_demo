import { NextResponse } from "next/server";

import {
  HAUSKA_KEY_HEADER,
  atomStore,
  filterAtoms,
  resolveSubject,
} from "@/lib/engine/index";

/**
 * GET /api/atoms — list atoms (gated). The gate filters by X-Hauska-Key at read
 * time: no key / wrong key => public-only (tenant-private dropped); the Mox
 * tenant key unlocks the tenant-private operating pro forma + deal molecule. The
 * public `count` is therefore strictly less than the keyed `count`.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const subject = resolveSubject(req.headers.get(HAUSKA_KEY_HEADER));
  const { kept, denied } = filterAtoms(subject, atomStore.all());
  return NextResponse.json(
    {
      subject: { label: subject.label, tenant: subject.jurisdictionTenant },
      count: kept.length,
      atoms: kept,
      gatedOut: denied,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
