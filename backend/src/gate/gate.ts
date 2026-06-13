import type { AccessPolicy } from "@hauska/atom-contract";

import type { Atom } from "../types/atom.js";

/**
 * The gate. Replicates the hauska-mcp-server access-policy pattern
 * (src/access-policy.ts + src/auth.ts): a caller presents a product key via
 * the X-Hauska-Key header; the key resolves to a subject (tier + tenant); the
 * gate filters atoms by their accessPolicy against that subject at READ time.
 *
 * The hard guardrail (honesty guardrail / two-flywheel partition): a missing
 * or unrecognized key resolves to the PUBLIC-ONLY subject, so tenant-private
 * atoms (the operating pro forma, the deal molecule) NEVER leak into a public
 * context. Mirrors auth.ts: "No X-Hauska-Key header -> free-tier path".
 */

export type SubjectTier = "free_anonymous" | "free" | "paid";

export interface AccessSubject {
  tier: SubjectTier;
  /** The tenant this key is bound to (null for anonymous/public callers). */
  jurisdictionTenant: string | null;
  /** Hauska/Mox operator key — may read tenant-private + platform-internal. */
  platformInternal: boolean;
  /** Human-facing label for audit/debug surfaces. */
  label: string;
}

/** The public-only subject a missing/wrong key resolves to. */
export const PUBLIC_SUBJECT: AccessSubject = {
  tier: "free_anonymous",
  jurisdictionTenant: null,
  platformInternal: false,
  label: "public (no key)",
};

/**
 * Demo product-key table. In hauska-mcp-server the key is hashed and looked up
 * in a DB (keys.ts/db.ts); here the registry is a static, in-memory map keyed
 * by the raw product key so the demo runs with no datastore. Keys are read
 * from the request header only and are never logged.
 *
 * The Mox tenant key unlocks the tenant-private side of the two-flywheel model
 * (jurisdictionTenant "mox-tenant", matching deal.json / proforma-nelray.json).
 */
const KEY_REGISTRY: Record<string, AccessSubject> = {
  "mox-tenant-key": {
    tier: "paid",
    jurisdictionTenant: "mox-tenant",
    platformInternal: false,
    label: "Mox tenant",
  },
  "mox-operator-key": {
    tier: "paid",
    jurisdictionTenant: "mox-tenant",
    platformInternal: true,
    label: "Mox operator (platform-internal)",
  },
  "public-paid-key": {
    tier: "paid",
    jurisdictionTenant: null,
    platformInternal: false,
    label: "public paid",
  },
};

export const HAUSKA_KEY_HEADER = "x-hauska-key";

/** Resolve the X-Hauska-Key header to a subject. Missing/wrong => public only. */
export function resolveSubject(rawKey: string | undefined | null): AccessSubject {
  const key = rawKey?.trim();
  if (!key) return PUBLIC_SUBJECT;
  const subject = KEY_REGISTRY[key];
  if (!subject) return PUBLIC_SUBJECT; // wrong key resolves to PUBLIC ONLY
  return subject;
}

function isPaidTier(tier: SubjectTier): boolean {
  return tier !== "free_anonymous" && tier !== "free";
}

/**
 * Read decision for one atom. Mirrors canReadAccessTarget in
 * hauska-mcp-server/src/access-policy.ts. The per-instance accessPolicy on the
 * atom wins (the fixtures all carry it).
 */
export function canRead(subject: AccessSubject, atom: Atom): boolean {
  const policy: AccessPolicy = atom.accessPolicy;
  switch (policy) {
    case "public-free":
      return true;
    case "public-paid":
      return isPaidTier(subject.tier);
    case "platform-internal":
      return subject.platformInternal;
    case "tenant-private":
      if (subject.platformInternal) return true;
      if (!subject.jurisdictionTenant) return false;
      return subject.jurisdictionTenant === atom.jurisdictionTenant;
    case "tenant-shared":
      if (subject.platformInternal) return true;
      if (!subject.jurisdictionTenant) return false;
      return subject.jurisdictionTenant === atom.jurisdictionTenant;
    default:
      return false; // deny unknown policies (closed by default)
  }
}

export interface GateResult {
  kept: Atom[];
  denied: Array<{ atomId: string; accessPolicy: AccessPolicy; reason: string }>;
}

/** Filter a set of atoms for a subject, recording denials for audit. */
export function filterAtoms(subject: AccessSubject, atoms: Atom[]): GateResult {
  const kept: Atom[] = [];
  const denied: GateResult["denied"] = [];
  for (const atom of atoms) {
    if (canRead(subject, atom)) {
      kept.push(atom);
    } else {
      denied.push({
        atomId: atom.atomId,
        accessPolicy: atom.accessPolicy,
        reason: `subject '${subject.label}' may not read ${atom.accessPolicy} atom in tenant '${atom.jurisdictionTenant}'`,
      });
    }
  }
  return { kept, denied };
}
