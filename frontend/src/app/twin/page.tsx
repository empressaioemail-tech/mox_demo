import Link from "next/link";
import { TwinClient } from "@/components/twin/TwinClient";

export const metadata = {
  title: "Spatial twin — Mox demo",
  description:
    "The spatial twin of the proposed 5-story Nelray building: real assets, composed atoms, ground truth above it.",
};

export default function TwinPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
        <header className="space-y-3">
          <Link
            href="/"
            className="text-xs font-medium text-zinc-500 transition hover:text-zinc-300"
          >
            ← Mox demo
          </Link>
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
              Spatial twin
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              607–611 Nelray Blvd · proposed 5-story building
            </h1>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
            The digital twin, made walkable. The proposed building rendered from
            the operator&apos;s real Revit assets (renderings, elevations, plans),
            composed with the unit atoms, the seeded operating layer, and the
            ground-truth layer above it — every fact carrying its provenance and
            confidence state. The live APS SVF2 viewer drops into the labeled slot
            on Autodesk account activation; until then the asset-based twin is the
            active spatial face. The data is representative; the engine and the
            substrate-derived ground truth are real.
          </p>
        </header>

        <TwinClient />
      </main>
    </div>
  );
}
