import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { Atom } from "../types/atom.js";

/**
 * Atom store. Loads the WS-1 seed fixtures from /data (read-only; this
 * workstream owns backend/ and only READS data/). Every *.json under the
 * data root is a presented atom envelope (data/README.md); we load them all,
 * index by atomId (the DID), and expose lookups the engine binds against.
 */

const HERE = fileURLToPath(import.meta.url);
// backend/src/atoms/store.ts -> repo root is four levels up.
const REPO_ROOT = resolve(HERE, "..", "..", "..", "..");

function defaultDataDir(): string {
  return process.env.MOX_DATA_DIR
    ? resolve(process.env.MOX_DATA_DIR)
    : join(REPO_ROOT, "data");
}

function walkJson(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...walkJson(full));
    } else if (entry.endsWith(".json")) {
      out.push(full);
    }
  }
  return out;
}

function isAtom(value: unknown): value is Atom {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.atomId === "string" &&
    typeof v.entityType === "string" &&
    typeof v.accessPolicy === "string" &&
    typeof v.confidence === "object" &&
    v.confidence !== null
  );
}

export class AtomStore {
  private readonly byId = new Map<string, Atom>();
  readonly dataDir: string;

  constructor(dataDir = defaultDataDir()) {
    this.dataDir = dataDir;
    this.load();
  }

  private load(): void {
    const files = walkJson(this.dataDir);
    for (const file of files) {
      let parsed: unknown;
      try {
        parsed = JSON.parse(readFileSync(file, "utf8"));
      } catch (err) {
        // A non-atom JSON (e.g. tooling config) — skip, don't crash the store.
        continue;
      }
      if (isAtom(parsed)) {
        this.byId.set(parsed.atomId, parsed);
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
