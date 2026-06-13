import { YardiIntelligenceLayer } from "@/components/yardi/YardiIntelligenceLayer";

export const metadata = {
  title: "Intelligence layer on Yardi — Mox",
  description:
    "An intelligence layer riding on top of Yardi: read, assist, and capture to your core. The overlay is the surface of the twin, not DOM scraping.",
};

export default function YardiPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12">
        <header className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            Intelligence layer
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Mox rides on top of Yardi — untouched
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
            One capture layer that follows the person across every system they
            already work in — no rip-and-replace, no integration to build. It
            reads the work in front of you, assists from our core, and captures
            your decisions back to your core. It never writes back into Yardi.
          </p>
        </header>

        <YardiIntelligenceLayer />
      </main>
    </div>
  );
}
