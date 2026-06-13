/**
 * arms.ts — maps each engine componentKind to the Mox arm it speaks to, the
 * RBAC resource that governs who may see it, and the bottom-line cost-driver
 * framing woven onto the assembled view.
 *
 * This is the connective tissue for two of the surface's asks:
 *   1. RBAC: components carrying tenant-private / operating-internal data are
 *      gated on the right resource so switching the header role to LP visibly
 *      redacts them. Public ground-truth + the investor rollup stay visible.
 *   2. Bottom-line framing: each assembled view ties to where in an arm it saves
 *      money (the cost driver / leak point), pulled from @/content/mox so copy
 *      stays consistent with the rest of the demo.
 *
 * Pure data (no React) so it can be imported by renderers and the surface chrome.
 */

import type { ComponentKind } from "@/lib/engine";
import {
  ARM_BUILD,
  ARM_INVEST,
  ARM_MANAGE,
  BOTTOM_LINE_BY_ARM,
  type ArmId,
} from "@/content/mox";
import type { Resource } from "@/components/rbac";

export interface ComponentArmMeta {
  /** The Mox arm this view primarily speaks to. */
  arm: ArmId;
  /** Short arm label for the chip, e.g. "Manage". */
  armLabel: string;
  /**
   * The RBAC resource that governs visibility. Operating-internal /
   * tenant-private views gate on "operating-internals" (or "financial-actuals")
   * so an external LP sees a redaction. Public ground truth + the curated LP
   * rollup stay visible to everyone.
   */
  resource: Resource;
  /**
   * Whether this view is tenant-private operating data that must redact for the
   * external LP. Drives whether the renderer wraps its body in a RoleGate.
   */
  tenantPrivate: boolean;
  /** The cost driver / leak point this assembled view bears on. */
  costDriver: string;
  /** The one-line bottom-line impact (where it saves money) for the arm. */
  bottomLine: string;
}

const MANAGE_BOTTOM = BOTTOM_LINE_BY_ARM.manage;
const INVEST_BOTTOM = BOTTOM_LINE_BY_ARM.invest;
const BUILD_BOTTOM = BOTTOM_LINE_BY_ARM.build;

/**
 * Per-componentKind arm + resource + framing. Defaults (the fallback below)
 * treat anything unmapped as public ground truth (never gated) so the surface
 * never accidentally hides a component it can't classify.
 */
const META: Record<ComponentKind, ComponentArmMeta> = {
  // The underwrite KPIs — the capital arm, financial actuals (internal).
  "kpi-card": {
    arm: "invest",
    armLabel: ARM_INVEST.name,
    resource: "financial-actuals",
    tenantPrivate: true,
    costDriver: "Underwriting accuracy — broker pro-forma vs. portfolio actuals",
    bottomLine: INVEST_BOTTOM,
  },
  // Variance / anomaly — the operating engine, tenant-private operating data.
  "variance-anomaly-card": {
    arm: "manage",
    armLabel: ARM_MANAGE.name,
    resource: "operating-internals",
    tenantPrivate: true,
    costDriver: "Controllable line items — R&M, utilities, make-ready at close",
    bottomLine: MANAGE_BOTTOM,
  },
  // The action inbox — routed operating decisions, tenant-private.
  "action-inbox": {
    arm: "manage",
    armLabel: ARM_MANAGE.name,
    resource: "operating-internals",
    tenantPrivate: true,
    costDriver: "Decisions routed to the right person before dollars leak",
    bottomLine: MANAGE_BOTTOM,
  },
  // Provenance drill — the public ground-truth flywheel, visible to all.
  "provenance-drill": {
    arm: "build",
    armLabel: "Ground truth",
    resource: "ground-truth",
    tenantPrivate: false,
    costDriver: "Source-of-record trace — every fact carries its edge",
    bottomLine:
      "Provenance is the spine: every number traces to its source, which is what makes the intelligence yours and lowers the cost of trusting it.",
  },
  // Plan-review entitlement catch — BLDR, but the code/zoning is public ground
  // truth (the LP sees the vetted code risk; it lowers cost of capital).
  "plan-review-findings": {
    arm: "build",
    armLabel: ARM_BUILD.name,
    resource: "ground-truth",
    tenantPrivate: false,
    costDriver:
      "Resubmission & carrying cost — the entitlement gap caught before submission",
    bottomLine: BUILD_BOTTOM,
  },
  // The spatial twin units — the building model, visible to internal roles.
  "unit-twin-viewer": {
    arm: "build",
    armLabel: "Twin",
    resource: "twin-spatial",
    tenantPrivate: false,
    costDriver: "Per-unit basis — every unit an atom, room by room",
    bottomLine: BUILD_BOTTOM,
  },
  // Renderings — the build asset face.
  "renderings-panel": {
    arm: "build",
    armLabel: ARM_BUILD.name,
    resource: "twin-spatial",
    tenantPrivate: false,
    costDriver: "Build scope — the proposed model from the real Revit set",
    bottomLine: BUILD_BOTTOM,
  },
  // The investor rollup — the curated, cited LP artifact. Visible to the LP.
  "investor-rollup": {
    arm: "invest",
    armLabel: ARM_INVEST.name,
    resource: "investor-room",
    tenantPrivate: false,
    costDriver: "Cost of capital — a verifiable, cited de-risking artifact",
    bottomLine: INVEST_BOTTOM,
  },
};

const FALLBACK: ComponentArmMeta = {
  arm: "manage",
  armLabel: "Ground truth",
  resource: "ground-truth",
  tenantPrivate: false,
  costDriver: "Captured intelligence, owned by you",
  bottomLine:
    "The adaptive command is the operator's single surface across Manage, Invest, and Build — each assembled view ties back to a cost driver.",
};

export function armMetaFor(kind: ComponentKind | string): ComponentArmMeta {
  return META[kind as ComponentKind] ?? FALLBACK;
}
