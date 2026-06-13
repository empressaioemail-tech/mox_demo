import type { Atom } from "../types";

/**
 * Atom store — STATIC, build-time bundle (server-only).
 *
 * The deployed demo runs on Vercel with NO local backend, so the WS-1 seed
 * fixtures are bundled into this directory (copied from /data) and imported as
 * static JSON. resolveJsonModule bundles them at build time — no `fs`, no
 * runtime path resolution, works in the Node serverless runtime out of the box.
 *
 * Mirror of backend/src/atoms/store.ts: load every fixture, index by atomId
 * (the DID), expose the lookups the engine binds against. The gate runs at READ
 * time over these (see ../gate); the store itself is ungated.
 *
 * 14 atoms: 12 public-free + 2 tenant-private (the operating pro forma + the
 * deal molecule). Tenant-private atoms are bundled for the engine to bind ONLY
 * when the X-Hauska-Key gates them in; the gate keeps them out of public context.
 */

import buildingJson from "./building.json";
import code491Json from "./code-25-2-491.json";
import code562Json from "./code-25-2-562.json";
import code564Json from "./code-25-2-564-mf4.json";
import dealJson from "./deal.json";
import entitlementJson from "./entitlement-finding.json";
import floodJson from "./flood.json";
import parcel226623Json from "./parcel-226623.json";
import parcel607Json from "./parcel-607-nelray.json";
import parcel609Json from "./parcel-609-nelray.json";
import proformaJson from "./proforma-nelray.json";
import unit1brJson from "./unit-typical-1br.json";
import unit2brJson from "./unit-typical-2br.json";
import zoningJson from "./zoning-mf3.json";

// Cast through unknown: the JSON fixtures are wider than the Atom read view.
const asAtom = (j: unknown): Atom => j as Atom;

const ALL_ATOMS: Atom[] = [
  buildingJson,
  code491Json,
  code562Json,
  code564Json,
  dealJson,
  entitlementJson,
  floodJson,
  parcel226623Json,
  parcel607Json,
  parcel609Json,
  proformaJson,
  unit1brJson,
  unit2brJson,
  zoningJson,
].map(asAtom);

export class AtomStore {
  private readonly byId = new Map<string, Atom>();

  constructor(atoms: Atom[] = ALL_ATOMS) {
    for (const atom of atoms) {
      if (atom && typeof atom.atomId === "string") {
        this.byId.set(atom.atomId, atom);
      }
    }
  }

  /** All loaded atoms (ungated — callers must run the gate before surfacing). */
  all(): Atom[] {
    return [...this.byId.values()];
  }

  get(atomId: string): Atom | undefined {
    return this.byId.get(atomId);
  }

  byEntityType(entityType: string): Atom[] {
    return this.all().filter((a) => a.entityType === entityType);
  }

  size(): number {
    return this.byId.size;
  }
}

/** A shared, module-level store instance (the fixtures are read-only). */
export const atomStore = new AtomStore();
