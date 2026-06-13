import Link from "next/link";
import type { Metadata } from "next";
import { ContentContainer } from "@/components/shell";
import { ContextIndexCards } from "@/components/context/ContextIndexCards";
import { HEADLINES } from "@/content/mox";

export const metadata: Metadata = {
  title: "Context surfaces — Mox",
  description:
    "The six Mox surfaces as navigable context: Command, Extension, Manage, Invest, BLDR, Flywheel.",
};

export default function ContextIndex() {
  return (
    <ContentContainer width="wide">
      <div className="flex flex-col gap-10">
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
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Context surfaces
          </h1>
          <p className="max-w-3xl text-zinc-400">
            The six Mox surfaces, navigable so the demo reads as one operating
            system across the business — Manage, Invest, and Build — rather than
            a single feature. Each surface is tagged with the arm and persona it
            serves. These are context for scope — secondary to the live hero
            surfaces — and their numbers are illustrative placeholders, not yet
            calibrated on Mox outcomes.
          </p>
          <p className="max-w-3xl text-sm text-zinc-500">{HEADLINES.os}</p>
        </header>

        <ContextIndexCards />
      </div>
    </ContentContainer>
  );
}
