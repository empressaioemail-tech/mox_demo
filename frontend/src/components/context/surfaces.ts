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
};

export const CONTEXT_SURFACES: ContextSurface[] = [
  {
    slug: "command",
    name: "Command",
    blurb: "Intelligence command center — the daily operating view across the portfolio.",
    file: "/context/mox_01_command.html",
  },
  {
    slug: "extension",
    name: "Extension",
    blurb: "Assist browser extension — the intelligence layer riding on top of Yardi.",
    file: "/context/mox_02_extension.html",
  },
  {
    slug: "manage",
    name: "Manage",
    blurb:
      "Operating engine — the leak, repair history, and monthly close beats live here.",
    file: "/context/mox_03_manage.html",
  },
  {
    slug: "invest",
    name: "Invest",
    blurb: "Capital side — the LP / investor-facing view of the deal.",
    file: "/context/mox_04_invest.html",
  },
  {
    slug: "build",
    name: "BLDR",
    blurb: "Construction side — schedules, scope, and the build pipeline.",
    file: "/context/mox_05_build.html",
  },
  {
    slug: "flywheel",
    name: "Flywheel",
    blurb: "The shared-ground-truth flywheel — how the surfaces compound into one OS.",
    file: "/context/mox_06_flywheel.html",
  },
];

export function getSurface(slug: string): ContextSurface | undefined {
  return CONTEXT_SURFACES.find((s) => s.slug === slug);
}
