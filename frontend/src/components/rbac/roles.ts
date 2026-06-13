/**
 * roles.ts — Mox role-based access definitions.
 *
 * Roles reflect Mox's org and pair with the engine's tenant-private vs. public
 * gate. The STORY this drives on screen: Mox controls who sees what across the
 * whole system. The external LP/Investor role sees ONLY the curated, redactable
 * investor view — never tenant-private operating internals. Switching to LP
 * visibly redacts/hides operating data on any surface that gates on it.
 *
 * This file is pure data + helpers (no React) so it can be imported anywhere.
 * React context lives in RoleProvider.tsx.
 */

// ── Resources ─────────────────────────────────────────────────────────────────

/**
 * The visibility resources surfaces gate on. Coarse-grained on purpose — this
 * is a demo of role-driven visibility, not a real authz system.
 *
 *  - operating-internals   Tenant-private operating data: variance, R&M, payroll,
 *                          turnover, work orders, the action inbox internals.
 *                          NEVER visible to an external LP.
 *  - financial-actuals     Underwrite actuals, portfolio cost-per-unit, cost of
 *                          capital. Internal finance + acquisitions.
 *  - construction          BLDR scope, schedules, subcontractor pricing.
 *  - investor-room         The curated, cited LP artifact. Visible to everyone,
 *                          including the external LP (it is the LP's whole view).
 *  - twin-spatial          The spatial twin / building model.
 *  - ground-truth          Parcel / zoning / code / entitlement findings (public-
 *                          ground-truth flywheel). Visible to all.
 *  - admin                 Role administration / system config (executive only).
 */
export type Resource =
  | "operating-internals"
  | "financial-actuals"
  | "construction"
  | "investor-room"
  | "twin-spatial"
  | "ground-truth"
  | "admin";

export const ALL_RESOURCES: Resource[] = [
  "operating-internals",
  "financial-actuals",
  "construction",
  "investor-room",
  "twin-spatial",
  "ground-truth",
  "admin",
];

// ── Roles ─────────────────────────────────────────────────────────────────────

export type RoleId =
  | "executive"
  | "accounting"
  | "acquisitions"
  | "construction"
  | "lp";

export interface RoleDef {
  id: RoleId;
  /** Short name for the switcher, e.g. "CFO / Executive". */
  name: string;
  /** Which Mox arm this role primarily lives in (for narration). */
  arm: string;
  /** One-line description shown in the switcher and as a caption. */
  description: string;
  /** Whether this role is external to Mox (the LP). External = most restricted. */
  external: boolean;
  /** The resources this role can see. Anything not listed is hidden/redacted. */
  canSee: Resource[];
}

/**
 * Canonical role definitions, ordered from most-privileged (internal exec) to
 * most-restricted (external LP). Mirrors Mox's org from the business context.
 */
export const ROLES: Record<RoleId, RoleDef> = {
  executive: {
    id: "executive",
    name: "Executive / CFO",
    arm: "Invest",
    description:
      "Full internal visibility across every arm — the operating engine, capital, and build.",
    external: false,
    canSee: [
      "operating-internals",
      "financial-actuals",
      "construction",
      "investor-room",
      "twin-spatial",
      "ground-truth",
      "admin",
    ],
  },
  accounting: {
    id: "accounting",
    name: "Property Accounting",
    arm: "Manage",
    description:
      "Monthly close and variance — the operating engine. Sees operating internals, not the capital underwrite or LP room.",
    external: false,
    canSee: [
      "operating-internals",
      "twin-spatial",
      "ground-truth",
    ],
  },
  acquisitions: {
    id: "acquisitions",
    name: "Acquisitions",
    arm: "Invest",
    description:
      "Underwriting and asset management — the capital arm. Sees financial actuals, the twin, and the investor room.",
    external: false,
    canSee: [
      "financial-actuals",
      "investor-room",
      "twin-spatial",
      "ground-truth",
    ],
  },
  construction: {
    id: "construction",
    name: "Construction (BLDR)",
    arm: "Build",
    description:
      "Scope, schedules, and the plan-review catch — BLDR by Mox. Sees construction, the twin, and ground truth.",
    external: false,
    canSee: [
      "construction",
      "twin-spatial",
      "ground-truth",
    ],
  },
  lp: {
    id: "lp",
    name: "Investor / LP",
    arm: "External",
    description:
      "External limited partner. Sees ONLY the curated, cited investor room and public ground truth — never tenant-private operating data.",
    external: true,
    canSee: [
      "investor-room",
      "ground-truth",
    ],
  },
};

/** All roles in canonical (most → least privileged) order. */
export const ROLE_LIST: RoleDef[] = [
  ROLES.executive,
  ROLES.accounting,
  ROLES.acquisitions,
  ROLES.construction,
  ROLES.lp,
];

/** The default role the demo boots into (full internal visibility). */
export const DEFAULT_ROLE: RoleId = "executive";

// ── Helpers (pure) ─────────────────────────────────────────────────────────────

export function getRole(id: RoleId): RoleDef {
  return ROLES[id];
}

/** Whether a given role can see a resource. */
export function roleCanSee(role: RoleId, resource: Resource): boolean {
  return ROLES[role].canSee.includes(resource);
}

/** Type guard for an arbitrary string being a valid RoleId. */
export function isRoleId(value: string): value is RoleId {
  return value in ROLES;
}
