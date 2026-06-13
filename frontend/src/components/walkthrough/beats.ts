/**
 * beats.ts — the ordered demo beats for the guided walkthrough.
 *
 * The five-beat arc (from docs/narrative/hero_script_runsheet.md and
 * docs/demo_run_sheet.md):
 *   opens on Yardi (kill rip-and-replace fear) → spatial twin → adaptive command
 *   → investor room — threaded with the Mox business story.
 *
 * Each beat is presenter-driven (manual Next/Prev). Narration prose is verbatim
 * or closely derived from the run sheets. Surfaces render the current beat's
 * narration via <WalkthroughNarration/>.
 *
 * Pure data (no React) so it can be imported by the provider and by surfaces.
 */

export interface Beat {
  /** Stable id, also used in sessionStorage / URLs. */
  id: string;
  /** Short title for the beat indicator in the header. */
  title: string;
  /** The surface route this beat lives on. The header navigates here on Next/Prev. */
  surface: string;
  /**
   * The intent or action hint — what the presenter types or does on this beat
   * (e.g. a hero intent string, or "open on the Yardi surface").
   */
  hint: string;
  /** The narration prose shown on the coach-mark / narration card. */
  narration: string;
  /** Optional verbatim framing line to say out loud (open / transition / close). */
  sayAloud?: string;
}

export const BEATS: Beat[] = [
  {
    id: "open-yardi",
    title: "Open on Yardi",
    surface: "/yardi",
    hint: 'Stage the Yardi surface, then type "show me this deal"',
    narration:
      "This is your Yardi. Untouched — the same screen your team uses every day. Watch what our layer adds. It reads the work in front of you, assists from our core, and captures your decisions back. It never writes back into Yardi. This kills the rip-and-replace fear: nobody migrates, nobody logs into a new system.",
    sayAloud:
      "The engine is real. The data is representative, shaped like yours. Wiring it to your Yardi is what the first phase does.",
  },
  {
    id: "spatial-twin",
    title: "Spatial twin",
    surface: "/twin",
    hint: 'Building view → "vet the proposed building"',
    narration:
      "This is the proposed building, the real model. Every unit is an atom. Above it sits the parcel and the code — the ground truth we bring that you could never build yourself. And here is what the system caught: a five-story building on MF-3 land, which caps at forty feet and thirty-six units an acre. It needs MF-4 rezoning or a variance — flagged before you ever submit.",
    sayAloud:
      "That is the everyday operating layer. Now let me show you a real Austin redevelopment running through the same system, the kind of deal your Invest team underwrites.",
  },
  {
    id: "open-unit",
    title: "Open a unit",
    surface: "/twin",
    hint: 'Unit drill-down → "open a unit"',
    narration:
      "Every unit is an atom. Click in and you walk it room by room — the space, its operating layer, and the ground truth stacked above it, each fact carrying its source. The room geometry is provisional, pending the APS model extraction; the plan and elevation imagery is curated from the real Revit set, not a live 3D view.",
  },
  {
    id: "adaptive-command",
    title: "Adaptive command",
    surface: "/command",
    hint: 'Type an intent; accept one flagged item (the deposit loop)',
    narration:
      "Type intent; the engine selects, orders, and populates the components live, each carrying its provenance and confidence. You do not drown in flags — you get an inbox of decisions, routed to the right person. Accept or edit one, and that correction just taught the system. It gets less wrong every month, and you own that learning. The chip stays baseline — that is HOW it earns over time, on your book.",
  },
  {
    id: "investor-room",
    title: "Investor room",
    surface: "/investor",
    hint: 'Type "generate the LP view for this deal"; switch role to LP',
    narration:
      "This is what you hand an LP instead of a static PDF. Every number traces to its source. The code risk on the parcel is already vetted — jurisdictional diligence no other GP can show, and it is what lowers your cost of capital. Switch the role to LP and the operating internals redact: an external partner sees only this curated, cited view. It is a generated artifact, not a live umbilical — you provide the provenance, the GP makes the representations.",
    sayAloud:
      "Everything you just saw runs on a spine you own. To get your own data out of Yardi today costs about twenty-five thousand dollars per interface per year, with Yardi's permission. On the spine, your data is yours, it travels with the asset, and it gets sharper every time your team touches it.",
  },
];

export const BEAT_COUNT = BEATS.length;

export function getBeat(id: string): Beat | undefined {
  return BEATS.find((b) => b.id === id);
}

export function getBeatIndex(id: string): number {
  return BEATS.findIndex((b) => b.id === id);
}
