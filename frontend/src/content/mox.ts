/**
 * mox.ts — the shared Mox business-content module.
 *
 * A typed, single source of truth for Mox company facts, the three operating
 * arms + the JV, each arm's cost drivers / leak points / persona, and the
 * narrative through-line. Surface agents import from here so copy rings true
 * and stays consistent across every surface:
 *
 *   import { MOX, ARMS, getArm, THROUGH_LINE, REPRESENTATIVE_DATA_NOTE } from "@/content/mox";
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HONESTY (hard constraint — README guardrails 1, 2, 5):
 * Any financial figure in this module is REPRESENTATIVE / ILLUSTRATIVE, shaped
 * like Mox's book but NOT real Mox actuals or calibrated outcomes. Every figure
 * carries the `representative: true` marker and `REPRESENTATIVE_DATA_NOTE` is
 * provided so surfaces can render the disclaimer inline. Never present a figure
 * from this module as an earned / calibrated Mox result.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Types ────────────────────────────────────────────────────────────────────

/** A figure that is representative/illustrative, not a real Mox actual. */
export interface RepresentativeFigure {
  /** Human-readable label, e.g. "Controllable opex reduction". */
  label: string;
  /** Display string exactly as it should render, e.g. "18–23%". */
  display: string;
  /** Always true in this demo — surfaces should render the disclaimer. */
  representative: true;
}

/** One of Mox's three operating arms, or the JV. */
export type ArmId = "manage" | "invest" | "build" | "jv";

export interface MoxArm {
  id: ArmId;
  /** Short name used in nav/tabs, e.g. "Manage". */
  name: string;
  /** Full product/line name, e.g. "BLDR by Mox". */
  fullName: string;
  /** One-line role of this arm in the business. */
  role: string;
  /** Headline claim for the arm (representative where numeric). */
  headline: string;
  /** The controllable cost drivers this arm lives or dies on. */
  costDrivers: string[];
  /**
   * Where intelligence shows up — the leaks / variances / anomalies / gaps the
   * product catches, each tied to a cost driver. Empty for the JV.
   */
  leakPoints: string[];
  /** The persona who lives in this arm day to day. */
  persona: string;
  /**
   * The bottom-line story for this arm: the single sentence connecting the
   * captured intelligence back to dollars on the cost drivers above.
   */
  bottomLineImpact: string;
  /** Optional representative figure attached to the arm's headline. */
  figure?: RepresentativeFigure;
}

// ── Company facts ─────────────────────────────────────────────────────────────

export const MOX = {
  name: "Mox",
  /** 2024 rebrand from Internacional Realty. */
  formerName: "Internacional Realty",
  rebrandYear: 2024,
  descriptor: "Vertically integrated Austin multifamily operator",
  hq: "Austin, TX",
  facts: {
    communities: "~40 communities",
    residences: "~10,400 residences",
    employees: "~300 employees",
    markets: "Five Texas markets",
    inHousePayroll: "Owns an in-house payroll company",
  },
  /** System of record. The product rides on top — read + assist + capture only. */
  systemOfRecord: {
    platform: "Yardi",
    products: ["Voyager", "Breeze"],
    residentFacing: "RentCafe",
    /** Guardrail 6: no live bidirectional write-back claim. */
    relationship:
      "System of record. The intelligence layer reads, assists, and captures to your core — it never writes back into Yardi.",
  },
} as const;

// ── The three arms + the JV ───────────────────────────────────────────────────

export const ARM_MANAGE: MoxArm = {
  id: "manage",
  name: "Manage",
  fullName: "Manage (the operating engine)",
  role: "Third-party property management for institutional and private owners — the daily operating engine.",
  headline: "18–23% reduction in controllable line items.",
  costDrivers: [
    "Repairs & maintenance (R&M)",
    "On-site payroll / staffing",
    "Turnover & make-ready",
    "Common-area utilities",
    "Contract services",
    "Marketing",
  ],
  leakPoints: [
    "Water-leak catch (common-area utilities) — high water for months caught in month one, not month nine.",
    "Vendor-invoice coding (R&M) — invoices coded correctly and to the right account.",
    "Turnover-band flag (make-ready) — units drifting outside the make-ready cost band.",
    "Vendors missing SLA — contract-service performance flagged against the agreement.",
  ],
  persona: "Property accounting — monthly close and variance.",
  bottomLineImpact:
    "Every controllable line item the system watches — R&M, payroll, make-ready, utilities — is where the captured intelligence shows up as fewer dollars leaked at month-end close.",
  figure: {
    label: "Controllable line-item reduction",
    display: "18–23%",
    representative: true,
  },
};

export const ARM_INVEST: MoxArm = {
  id: "invest",
  name: "Invest",
  fullName: "Invest (the capital arm)",
  role: "Majority and JV ownership, acquisitions, asset management, disposition, and raising LP capital.",
  headline: "Underwrite against your own portfolio actuals, not broker promises.",
  costDrivers: [
    "Underwriting accuracy — the gap between broker pro-forma and real operating cost",
    "Payroll per unit",
    "R&M per unit",
    "Turnover per unit",
    "Insurance (a large, rising Texas swing)",
    "Cost of capital",
  ],
  leakPoints: [
    "Broker pro-forma vs. portfolio actuals — the operating-cost gap the deck hides.",
    "Insurance swing — the rising Texas line modeled against real history.",
    "Cost of capital — a verifiable track record lowers it.",
  ],
  persona: "CFO / acquisitions.",
  bottomLineImpact:
    "Underwriting against Mox's own portfolio actuals instead of broker promises closes the pro-forma gap, and a verifiable track record lowers the cost of capital. This is where 'land more investors' lands.",
};

export const ARM_BUILD: MoxArm = {
  id: "build",
  name: "BLDR",
  fullName: "BLDR by Mox",
  role: "Construction and renovation for value-add repositioning, plus third-party construction management.",
  headline: "Catch the entitlement gap before submission — not months into carrying cost.",
  costDrivers: [
    "Per-unit renovation cost",
    "Subcontractor reliability / pricing",
    "Materials",
    "Resubmission & carrying cost from permit + entitlement delays",
  ],
  leakPoints: [
    "The Nelray MF-3 plan-review catch — a 5-story building flagged on MF-3 land (caps at 40 ft / 36 units per acre) before submission, surfacing the MF-4 rezoning or variance path and avoiding months of carrying cost.",
    "Subcontractor reliability / pricing — performance and bids checked against history.",
  ],
  persona: "Construction.",
  bottomLineImpact:
    "Flagging the entitlement gap before submission avoids months of resubmission and carrying cost — the largest swing on the build cost drivers.",
};

export const ARM_JV: MoxArm = {
  id: "jv",
  name: "Impact Housing",
  fullName: "Mox Impact Housing (JV with Shepherd Equities)",
  role: "Affordable / mixed-income partnerships with government agencies and non-profits.",
  headline: "A different regulatory and reporting regime, on the same spine.",
  costDrivers: [
    "Regulatory compliance & reporting",
    "Mixed-income underwriting constraints",
  ],
  leakPoints: [],
  persona: "Partnership / compliance.",
  bottomLineImpact:
    "The same captured intelligence carries the distinct affordable-housing regulatory and reporting regime — different rules, one spine.",
};

/** All arms in canonical order (three arms, then the JV). */
export const ARMS: MoxArm[] = [ARM_MANAGE, ARM_INVEST, ARM_BUILD, ARM_JV];

/** Lookup by id; returns undefined for an unknown id. */
export function getArm(id: ArmId): MoxArm | undefined {
  return ARMS.find((a) => a.id === id);
}

// ── The through-line ──────────────────────────────────────────────────────────

export const THROUGH_LINE = {
  /** The one-paragraph thesis tying all the arms together. */
  thesis:
    "Every arm produces operating data today — scattered across Yardi, email, broker decks, and disconnected tools, and mostly lost after use. The product captures that work, turns it into intelligence Mox OWNS, and feeds it back so the next decision is less wrong. The cost drivers in each arm are exactly where that shows up as dollars — the bottom-line story.",
  /** Punchy headline form for hero placement. */
  headline: "Capture the work. Own the intelligence. Feed it back.",
  /** The data-sovereignty point (from the close). */
  sovereignty:
    "On the spine, your data is yours. It carries its provenance, travels with the asset, and gets sharper every time your team touches it.",
} as const;

// ── Reusable copy blocks ──────────────────────────────────────────────────────

/**
 * The honesty disclaimer surfaces render next to any figure from this module.
 * Guardrails 1, 2, 5: representative, not calibrated on Mox outcomes.
 */
export const REPRESENTATIVE_DATA_NOTE =
  "Representative / illustrative figures shaped like Mox's book — not real Mox actuals, and not yet calibrated on Mox outcomes.";

/** The verbatim opening framing line (mirrors NarrativeFrame's OPENING_FRAMING_LINE). */
export const OPENING_FRAMING_LINE =
  "The engine is real. The data is representative, shaped like yours. Wiring it to your Yardi is what the first phase does.";

/** Short reusable headlines for hero placement across surfaces. */
export const HEADLINES = {
  os: "One operating system across Manage, Invest, and Build.",
  ownership:
    "The intelligence your team produces every day, captured and owned — instead of lost after use.",
  groundTruth:
    "The shared ground truth — code, zoning, parcel — already built, and nobody else has it.",
  twoFlywheels:
    "Two flywheels: your private operating intelligence compounds on your own outcomes; the shared ground truth sharpens as the whole network feeds it.",
} as const;

/** Per-arm one-line "bottom-line impact" copy, keyed by arm id. */
export const BOTTOM_LINE_BY_ARM: Record<ArmId, string> = {
  manage: ARM_MANAGE.bottomLineImpact,
  invest: ARM_INVEST.bottomLineImpact,
  build: ARM_BUILD.bottomLineImpact,
  jv: ARM_JV.bottomLineImpact,
};

export default MOX;
