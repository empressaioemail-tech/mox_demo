// WS-6 context surfaces: the six existing Mox mockups, imported as navigable
// context so the demo reads as one operating system. Seeded-static — no live
// engine. Source mockups live at frontend/public/context/*.html and are
// rendered via iframe (see ContextFrame). They are deliberately secondary to
// the hero surfaces: context for scope, not the focus of function.

export type ContextSurface = {
  /** Clean URL slug, e.g. /context/command */
  slug: string;
  /** Short surface name for nav + tabs */
  name: string;
  /** One-line description of what the surface shows */
  blurb: string;
  /** Static HTML file under /public/context */
  file: string;
  /**
   * How this surface maps into the broader Mox operating system: the arm /
   * persona it serves and a one-line note tying it to the bottom-line story.
   * Lets the context chrome read as the same OS across Mox's business, not a
   * disconnected gallery. `armId` references @/content/mox ARMS where one maps.
   */
  framing: {
    /** Short arm/role label, e.g. "Manage · property accounting". */
    arm: string;
    /** The arm id in @/content/mox, or null where the surface spans all arms. */
    armId: "manage" | "invest" | "build" | "jv" | null;
    /** One line tying the surface to the operating system / bottom line. */
    note: string;
  };
};

export const CONTEXT_SURFACES: ContextSurface[] = [
  {
    slug: "command",
    name: "Command",
    blurb: "Intelligence command center — the daily operating view across the portfolio.",
    file: "/context/mox_01_command.html",
    framing: {
      arm: "Across all arms · operator",
      armId: null,
      note: "The daily operating view that spans Manage, Invest, and Build — one inbox of decisions across the whole business.",
    },
  },
  {
    slug: "extension",
    name: "Extension",
    blurb: "Assist browser extension — the intelligence layer riding on top of Yardi.",
    file: "/context/mox_02_extension.html",
    framing: {
      arm: "Manage · on-site & property accounting",
      armId: "manage",
      note: "The layer that rides on top of Yardi — reads, assists, captures to your core. No rip-and-replace.",
    },
  },
  {
    slug: "manage",
    name: "Manage",
    blurb:
      "Operating engine — the leak, repair history, and monthly close beats live here.",
    file: "/context/mox_03_manage.html",
    framing: {
      arm: "Manage · property accounting",
      armId: "manage",
      note: "Where controllable line items — R&M, payroll, make-ready, utilities — show up as fewer dollars leaked at month-end close.",
    },
  },
  {
    slug: "invest",
    name: "Invest",
    blurb: "Capital side — the LP / investor-facing view of the deal.",
    file: "/context/mox_04_invest.html",
    framing: {
      arm: "Invest · CFO / acquisitions",
      armId: "invest",
      note: "Underwrite against your own portfolio actuals, not broker promises — a verifiable track record lowers the cost of capital.",
    },
  },
  {
    slug: "build",
    name: "BLDR",
    blurb: "Construction side — schedules, scope, and the build pipeline.",
    file: "/context/mox_05_build.html",
    framing: {
      arm: "BLDR by Mox · construction",
      armId: "build",
      note: "Catch the entitlement gap before submission — not months into carrying cost.",
    },
  },
  {
    slug: "flywheel",
    name: "Flywheel",
    blurb: "The shared-ground-truth flywheel — how the surfaces compound into one OS.",
    file: "/context/mox_06_flywheel.html",
    framing: {
      arm: "Across all arms · the spine",
      armId: null,
      note: "Capture the work, own the intelligence, feed it back — how the surfaces compound into one operating system.",
    },
  },
];

export function getSurface(slug: string): ContextSurface | undefined {
  return CONTEXT_SURFACES.find((s) => s.slug === slug);
}
