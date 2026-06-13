import Link from "next/link";
import type { Metadata } from "next";
import { NarrativeFrame } from "@/components/library";
import { InvestorRoom } from "@/components/investor/InvestorRoom";
import { assembleLpView } from "@/components/investor/engineClient";

export const metadata: Metadata = {
  title: "Investor room — Mox · 607-611 Nelray",
  description:
    "A generated, cited data-room artifact for the Nelray redevelopment: hero renderings, the underwrite, and the entitlement plan review — every number drillable to its source.",
};

// The artifact reflects the live engine + calibration loop on each load.
export const dynamic = "force-dynamic";

export default async function InvestorPage() {
  const result = await assembleLpView();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-14">
        <header className="space-y-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm font-medium text-zinc-400 transition hover:text-zinc-100"
            >
              ← Home
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-800/70 bg-sky-950/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-sky-200">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              Generated, cited artifact
            </span>
          </div>
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
            Mox · investor / data room
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            What you hand an LP, instead of a static PDF
          </h1>
          <p className="max-w-2xl text-zinc-400">
            A provenance-backed data room for the Nelray deal — the renderings,
            the underwrite, and the entitlement plan review in one surface, with
            the code risk already vetted. Every number drills to the source atom
            it came from. This is a generated, cited artifact assembled by the
            engine; it is not the live, revocable LP data room (that ships with
            the auth build). The provenance infrastructure is ours; the
            representations are the GP&apos;s — this surface does not certify
            returns.
          </p>
        </header>

        {result ? (
          <InvestorRoom result={result} />
        ) : (
          <div className="rounded-xl border border-amber-900/50 bg-amber-950/20 p-6">
            <h2 className="text-lg font-semibold text-amber-100">
              Engine unreachable
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-amber-200/80">
              The data room assembles itself live from the engine
              (POST&nbsp;/api/intent on the backend). It could not be reached.
              Start the backend with{" "}
              <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-xs">
                cd backend &amp;&amp; npm run dev
              </code>{" "}
              and reload. Honesty over a fabricated fallback: we do not fake the
              assembled artifact.
            </p>
          </div>
        )}

        <NarrativeFrame variant="close">
          <p>
            The half of this no operator or off-the-shelf tool has is the cited
            ground truth: the parcels, the Austin Land Development Code sections,
            and the entitlement finding — each produced by our place/parcel/code
            substrate and drillable to source. That is what de-risks the deal
            before a dollar is raised.
          </p>
          <p className="text-sm text-zinc-400">
            Confidence is shown with its state. Almost everything here is
            baseline / provenance-backed — representative and sourced, not yet
            calibrated on Mox&apos;s own outcomes. The accept / edit / reject
            controls on the plan review feed the earning loop; calibration
            begins when your data is wired.
          </p>
        </NarrativeFrame>
      </main>
    </div>
  );
}
