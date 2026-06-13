import { ContentContainer } from "@/components/shell";
import { WalkthroughNarration } from "@/components/walkthrough";
import { NarrativeFrame } from "@/components/library";
import { HEADLINES } from "@/content/mox";
import { CommandSurface } from "@/components/command/CommandSurface";

export const metadata = {
  title: "Adaptive command — Mox",
  description:
    "Express intent; the engine assembles the relevant components live, every number carrying its provenance and confidence state.",
};

export default function CommandPage() {
  return (
    // Full-screen surface: the app shell owns the background + sticky header;
    // ContentContainer scales the content from laptop to projector (no narrow
    // max-w-3xl boxing).
    <ContentContainer width="wide">
      <div className="flex flex-col gap-6">
        {/* Walkthrough narration for the "adaptive-command" beat — renders only
            when the guided walkthrough is active on /command. */}
        <WalkthroughNarration onlyOnSurface="/command" />

        <header className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            Adaptive command · the operator&apos;s single surface
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Express intent — the surface assembles itself
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-zinc-400">
            One surface across Manage, Invest, and Build. Type an intent and the
            engine selects, orders, and binds the components live — every number
            carrying its provenance and its confidence state, each assembled view
            tied to where in an arm it saves money. Correct anything via the
            deposit loop and the surface reacts: the earning loop is live.
          </p>
          <p className="max-w-3xl text-sm font-medium text-zinc-300">
            {HEADLINES.os}
          </p>
        </header>

        <NarrativeFrame variant="open" />

        <CommandSurface />
      </div>
    </ContentContainer>
  );
}
