import { NextResponse } from "next/server";

import {
  HAUSKA_KEY_HEADER,
  atomStore,
  filterAtoms,
  resolveSubject,
} from "@/lib/engine/index";

/**
 * GET /api/atoms/:id — serve a single atom (gated). Atom IDs are DIDs
 * (did:hauska:finding:nelray-607-611/mf3-...) which contain '/', so this is a
 * catch-all route: the segments are rejoined into the full DID. The client
 * encodes the DID, so a single encoded segment is also handled.
 *
 * 404 if missing OR gated out — a tenant-private atom is indistinguishable from
 * not-found for a public caller (no leakage).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string[] }> },
) {
  const { id } = await params;
  const atomId = decodeURIComponent((id ?? []).join("/"));
  const subject = resolveSubject(req.headers.get(HAUSKA_KEY_HEADER));
  const atom = atomStore.get(atomId);
  if (!atom) {
    return NextResponse.json({ error: "atom not found" }, { status: 404 });
  }
  const { kept } = filterAtoms(subject, [atom]);
  if (kept.length === 0) {
    // Tenant-private leakage prevented: indistinguishable from not-found.
    return NextResponse.json({ error: "atom not found" }, { status: 404 });
  }
  return NextResponse.json(
    { atom: kept[0] },
    { headers: { "Cache-Control": "no-store" } },
  );
}
