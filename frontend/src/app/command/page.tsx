import { CommandSurface } from "@/components/command/CommandSurface";

export const metadata = {
  title: "Adaptive command — Mox",
  description:
    "Express intent; the engine assembles the relevant components live, every number carrying its provenance and confidence state.",
};

export default function CommandPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12">
        <header className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            Adaptive command
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Express intent — the surface assembles itself
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
            The engine is real. The data is representative, shaped like yours.
            Type an intent and the engine selects, orders, and binds the
            components — every number carrying its provenance and its confidence
            state. Correct anything via the deposit loop and the surface reacts:
            the earning loop is live.
          </p>
        </header>

        <CommandSurface />
      </main>
    </div>
  );
}
