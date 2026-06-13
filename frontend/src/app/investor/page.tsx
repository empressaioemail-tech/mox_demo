import Link from "next/link";
import type { Metadata } from "next";
import { ContentContainer } from "@/components/shell";
import { InvestorRoom } from "@/components/investor/InvestorRoom";
import { assembleLpView } from "@/components/investor/engineClient";

export const metadata: Metadata = {
  title: "Investor room — Mox · 607-611 Nelray",
  description:
    "A generated, cited data-room artifact for the Nelray redevelopment: hero renderings, the underwrite, and the entitlement plan review — every number drillable to its source, and redactable before you share it with an LP.",
};

// The artifact reflects the live engine + calibration loop on each load.
export const dynamic = "force-dynamic";

export default async function InvestorPage() {
  const result = await assembleLpView();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <ContentContainer width="wide" className="flex flex-col gap-8">
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
            Mox · investor / data room · Invest arm
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            What you hand an LP, instead of a static PDF
          </h1>
          <p className="max-w-3xl text-zinc-400">
            A provenance-backed data room for the Nelray deal — the renderings,
            the underwrite, and the entitlement plan review in one surface, with
            the code risk already vetted. Every number drills to the source atom
            it came from. As the operator, you control the presentation: redact
            or replace any sensitive line before you share it with a partner.
            This is a generated, cited artifact assembled by the engine; it is
            not the live, revocable LP data room (that ships with the auth
            build). The provenance infrastructure is ours; the representations
            are the GP&apos;s — this surface does not certify returns.
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
              (POST&nbsp;/api/intent, now same-origin on this deployment). It
              could not be reached. In local dev, ensure the app is running and
              reload. Honesty over a fabricated fallback: we do not fake the
              assembled artifact.
            </p>
          </div>
        )}
      </ContentContainer>
    </div>
  );
}
