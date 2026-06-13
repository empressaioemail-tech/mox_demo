"use client";

import Link from "next/link";
import {
  NarrativeFrame,
  ConfidenceChip,
} from "@/components/library";
import { ContentContainer } from "@/components/shell";
import {
  AdaptiveReveal,
  AssemblingSequence,
} from "@/components/adaptive";
import { useWalkthrough } from "@/components/walkthrough";
import { CONTEXT_SURFACES } from "@/components/context/surfaces";
import {
  MOX,
  ARMS,
  THROUGH_LINE,
  REPRESENTATIVE_DATA_NOTE,
  type ArmId,
} from "@/content/mox";

const HERO_SURFACES = [
  {
    href: "/yardi",
    name: "Intelligence layer on Yardi",
    blurb:
      "The opening beat. An overlay that rides on top of Yardi — read, assist, capture to your core. No rip-and-replace.",
  },
  {
    href: "/command",
    name: "Adaptive command",
    blurb:
      "The intent bar plus the assembler. Type intent; the engine selects, orders, and populates components live, each carrying its provenance and confidence state.",
  },
  {
    href: "/twin",
    name: "Spatial twin",
    blurb:
      "A navigable rendered model of the proposed building — composed with the unit atoms and the ground-truth (parcel + code) layers stacked above it.",
  },
  {
    href: "/investor",
    name: "Investor / data room",
    blurb:
      "The apex. A generated, cited LP artifact — every number drills to its source atom, the MF-3 entitlement finding vetted before a dollar is raised.",
  },
];

// Which hero surface each arm is demonstrated on.
const ARM_SURFACE: Record<ArmId, { href: string; label: string }> = {
  manage: { href: "/yardi", label: "Yardi layer" },
  invest: { href: "/investor", label: "Investor room" },
  build: { href: "/twin", label: "Spatial twin" },
  jv: { href: "/command", label: "Adaptive command" },
};

export default function Home() {
  const { start } = useWalkthrough();

  return (
    <ContentContainer width="wide">
      <div className="flex flex-col gap-10">
        {/* Hero framing */}
        <AssemblingSequence variant="rise" base={0.04} step={0.09}>
          <header className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
              Mox demo
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              607–611 Nelray Blvd, Austin TX
            </h1>
            <p className="max-w-3xl text-zinc-400">
              A single adaptive surface, seeded from a real Revit model of a real
              Austin redevelopment, running a real engine on representative data.
              One operating system that helps your bottom line across the whole
              business — Manage, Invest, and Build.
            </p>
          </header>

          <NarrativeFrame variant="open" />

          {/* Guided walkthrough entry point */}
          <section className="rounded-xl border border-sky-900/60 bg-gradient-to-br from-sky-950/40 to-zinc-900/40 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-widest text-sky-300/80">
                  Start here
                </p>
                <h2 className="text-lg font-semibold text-zinc-100">
                  Start the guided walkthrough
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
                  Presenter-driven, five beats. Each beat lands on a hero surface
                  and threads the Mox business story. Use the controls in the
                  header to step Next / Prev once it begins.
                </p>
              </div>
              <button
                type="button"
                onClick={() => start(0)}
                className="shrink-0 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-sm transition hover:bg-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                Begin →
              </button>
            </div>
            <ol className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs">
              {[
                "Open on Yardi",
                "Spatial twin",
                "Open a unit",
                "Adaptive command",
                "Investor room",
              ].map((title, i) => (
                <li key={title} className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900/70 px-2.5 py-1 text-zinc-300">
                    <span className="font-mono text-[10px] text-sky-400">
                      {i + 1}
                    </span>
                    {title}
                  </span>
                  {i < 4 && <span className="text-zinc-600">→</span>}
                </li>
              ))}
            </ol>
          </section>
        </AssemblingSequence>

        {/* Hero surfaces */}
        <section className="space-y-3">
          <AdaptiveReveal whenInView variant="rise">
            <div className="space-y-1">
              <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-400">
                Hero surfaces
              </h2>
              <p className="text-sm text-zinc-500">
                Live, real engine, on the Nelray model. The demo runs the arc:
                Yardi → spatial twin → adaptive command → investor room.
              </p>
            </div>
          </AdaptiveReveal>
          <AssemblingSequence
            variant="rise"
            base={0.05}
            step={0.08}
            className="grid gap-3 sm:grid-cols-2"
          >
            {HERO_SURFACES.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-600 hover:bg-zinc-900"
              >
                <p className="text-base font-semibold text-zinc-100 group-hover:text-white">
                  {s.name}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                  {s.blurb}
                </p>
              </Link>
            ))}
          </AssemblingSequence>
        </section>

        {/* Mox business context — the bottom-line story */}
        <section className="space-y-4">
          <AdaptiveReveal whenInView variant="rise">
            <div className="flex flex-col gap-3 border-t border-zinc-800 pt-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-400">
                  Mox · the business
                </h2>
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-400"
                  title={REPRESENTATIVE_DATA_NOTE}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 shadow-[0_0_0_3px_rgba(161,161,170,0.18)]" />
                  Representative data
                </span>
              </div>
              <p className="max-w-3xl text-sm leading-relaxed text-zinc-400">
                {MOX.descriptor}, HQ {MOX.hq}. {MOX.facts.communities} and{" "}
                {MOX.facts.residences} across {MOX.facts.markets.toLowerCase()},{" "}
                {MOX.facts.employees}, with {MOX.facts.inHousePayroll.toLowerCase()}.{" "}
                {MOX.systemOfRecord.relationship}
              </p>
              <p className="max-w-3xl text-sm leading-relaxed text-zinc-300">
                {THROUGH_LINE.thesis}
              </p>
            </div>
          </AdaptiveReveal>

          <AssemblingSequence
            variant="rise"
            base={0.05}
            step={0.09}
            className="grid gap-3 lg:grid-cols-2"
          >
            {ARMS.map((arm) => {
              const surface = ARM_SURFACE[arm.id];
              return (
                <div
                  key={arm.id}
                  className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-zinc-100">
                        {arm.fullName}
                      </h3>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {arm.persona}
                      </p>
                    </div>
                    <ConfidenceChip
                      state="baseline"
                      title={REPRESENTATIVE_DATA_NOTE}
                    />
                  </div>

                  <p className="text-sm font-medium leading-snug text-zinc-200">
                    {arm.headline}
                  </p>

                  <p className="text-sm leading-relaxed text-zinc-400">
                    {arm.bottomLineImpact}
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                        Cost drivers
                      </p>
                      <ul className="mt-1.5 space-y-1 text-xs leading-relaxed text-zinc-400">
                        {arm.costDrivers.slice(0, 4).map((d) => (
                          <li key={d} className="flex gap-1.5">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                        Where intelligence shows up
                      </p>
                      {arm.leakPoints.length > 0 ? (
                        <ul className="mt-1.5 space-y-1 text-xs leading-relaxed text-zinc-400">
                          {arm.leakPoints.slice(0, 3).map((l) => (
                            <li key={l} className="flex gap-1.5">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-sky-500/70" />
                              <span>{l}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
                          Same spine, a distinct affordable-housing regulatory
                          and reporting regime.
                        </p>
                      )}
                    </div>
                  </div>

                  <Link
                    href={surface.href}
                    className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-md border border-zinc-700 px-2.5 py-1 text-xs font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
                  >
                    Demonstrated on {surface.label} →
                  </Link>
                </div>
              );
            })}
          </AssemblingSequence>

          <AdaptiveReveal whenInView variant="fade">
            <p className="max-w-3xl text-xs leading-relaxed text-zinc-500">
              {REPRESENTATIVE_DATA_NOTE}
            </p>
          </AdaptiveReveal>
        </section>

        {/* Context surfaces — secondary */}
        <section className="space-y-3">
          <AdaptiveReveal whenInView variant="rise">
            <div className="flex items-center justify-between gap-3 border-t border-zinc-800 pt-8">
              <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-400">
                Context surfaces
              </h2>
              <Link
                href="/context"
                className="text-sm font-medium text-zinc-400 transition hover:text-zinc-100"
              >
                View all →
              </Link>
            </div>
          </AdaptiveReveal>
          <AdaptiveReveal whenInView variant="fade">
            <p className="max-w-3xl text-sm text-zinc-500">
              The six Mox surfaces as navigable context, so the demo reads as one
              operating system. Secondary to the hero surfaces; numbers are
              representative, not yet calibrated on Mox outcomes.
            </p>
          </AdaptiveReveal>
          <AssemblingSequence
            variant="scale"
            base={0.04}
            step={0.05}
            className="grid grid-cols-2 gap-2 sm:grid-cols-3"
          >
            {CONTEXT_SURFACES.map((s) => (
              <Link
                key={s.slug}
                href={`/context/${s.slug}`}
                className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-100"
              >
                {s.name}
              </Link>
            ))}
          </AssemblingSequence>
        </section>

        <AdaptiveReveal whenInView variant="fade">
          <section className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-400">
            <p>
              Engine (self-contained, same-origin):{" "}
              <code className="text-zinc-300">/api/health</code>
            </p>
          </section>
        </AdaptiveReveal>
      </div>
    </ContentContainer>
  );
}
