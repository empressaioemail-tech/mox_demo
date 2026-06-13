import { ContentContainer } from "@/components/shell";
import { NarrativeFrame } from "@/components/library";
import { WalkthroughNarration } from "@/components/walkthrough";
import { YardiIntelligenceLayer } from "@/components/yardi/YardiIntelligenceLayer";

export const metadata = {
  title: "Intelligence layer on Yardi — Mox",
  description:
    "An intelligence layer riding on top of Yardi: read, assist, and capture to your core. The overlay is the surface of the twin, not DOM scraping. Mox's Manage arm — the operating engine where controllable-opex leaks get caught.",
};

export default function YardiPage() {
  return (
    <ContentContainer width="wide" className="flex flex-col gap-8">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          Intelligence layer · Manage
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Mox rides on top of Yardi — untouched
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-zinc-400">
          One capture layer that follows the person across every system they
          already work in — no rip-and-replace, no integration to build. It
          reads the work in front of you, assists from our core, and captures
          your decisions back to your core. It never writes back into Yardi.
          This is Mox&apos;s Manage arm — the operating engine, where the
          controllable-opex leaks get caught.
        </p>
      </header>

      {/* Opening beat narration (beat id "open-yardi") — kills rip-and-replace fear. */}
      <WalkthroughNarration onlyOnSurface="/yardi" />

      <NarrativeFrame variant="open" />

      <YardiIntelligenceLayer />
    </ContentContainer>
  );
}
