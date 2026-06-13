import Link from "next/link";
import type { Metadata } from "next";
import { CONTEXT_SURFACES } from "@/components/context/surfaces";

export const metadata: Metadata = {
  title: "Context surfaces — Mox",
  description:
    "The six Mox surfaces as navigable context: Command, Extension, Manage, Invest, BLDR, Flywheel.",
};

export default function ContextIndex() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16">
        <header className="space-y-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm font-medium text-zinc-400 transition hover:text-zinc-100"
            >
              ← Home
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 shadow-[0_0_0_3px_rgba(161,161,170,0.18)]" />
              Representative data
            </span>
          </div>
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
            Mox · context
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Context surfaces
          </h1>
          <p className="max-w-2xl text-zinc-400">
            The six Mox surfaces, navigable so the demo reads as one operating
            system rather than a single feature. These are context for scope —
            secondary to the live hero surfaces — and their numbers are
            illustrative placeholders, not yet calibrated on Mox outcomes.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONTEXT_SURFACES.map((s, i) => (
            <Link
              key={s.slug}
              href={`/context/${s.slug}`}
              className="group flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-600 hover:bg-zinc-900"
            >
              <span className="font-mono text-xs text-zinc-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="text-lg font-semibold text-zinc-100 group-hover:text-white">
                {s.name}
              </h2>
              <p className="text-sm text-zinc-400">{s.blurb}</p>
              <span className="mt-auto pt-3 text-sm font-medium text-zinc-500 transition group-hover:text-zinc-300">
                Open surface →
              </span>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
