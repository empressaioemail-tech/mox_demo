"use client";

/**
 * YardiIntelligenceLayer — Part B surface. The real Yardi screenshots with the
 * Mox "following you" assist overlay riding on top. Switch screens to walk the
 * screen-to-beat map. The overlay's intelligence is atom-derived (read from the
 * engine / atom store), NOT scraped from the screenshot (guardrail 4).
 *
 * Opening framing (README guardrail 5): the engine is real, the data is
 * representative, wiring it to your Yardi is what the first phase does.
 *
 * Layout / overflow fix: on large widths the overlay FLOATS over the screenshot
 * (anchored top-right) and caps its height to the stage, scrolling only its own
 * body so nothing clips. Below `lg` the screenshot and overlay STACK vertically
 * (the overlay sits full-width beneath the screen) so the panel is never clipped
 * or forced to overflow awkwardly. Switching screens transitions smoothly via the
 * adaptive primitives (AdaptiveReveal keyed on the active slug re-reveals the
 * stage; AssemblingSequence inside the overlay re-runs its assembly).
 */

import Image from "next/image";
import { useState } from "react";
import { AdaptiveReveal } from "@/components/adaptive";
import { ARM_MANAGE, REPRESENTATIVE_DATA_NOTE } from "@/content/mox";
import { AssistOverlay } from "./AssistOverlay";
import { YARDI_BEATS } from "./beats";

export function YardiIntelligenceLayer() {
  const [activeSlug, setActiveSlug] = useState(YARDI_BEATS[0].slug);
  const beat = YARDI_BEATS.find((b) => b.slug === activeSlug) ?? YARDI_BEATS[0];

  return (
    <div className="space-y-5">
      {/* Manage framing — the operating engine where controllable-opex leaks get
          caught. Each screen below maps to a cost driver and what the catch saves. */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-amber-300/90">
          Mox · Manage — the operating engine
        </p>
        <p className="mt-1.5 text-sm font-medium text-zinc-100">
          {ARM_MANAGE.headline}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
          {ARM_MANAGE.bottomLineImpact} Each Yardi screen below is one
          controllable-opex leak the intelligence catches at the monthly close.
        </p>
        <p className="mt-2 text-[10px] leading-snug text-zinc-600">
          {REPRESENTATIVE_DATA_NOTE}
        </p>
      </div>

      {/* Screen switcher */}
      <div className="flex flex-wrap gap-1.5">
        {YARDI_BEATS.map((b) => (
          <button
            key={b.slug}
            type="button"
            onClick={() => setActiveSlug(b.slug)}
            aria-pressed={b.slug === activeSlug}
            className={[
              "rounded-full border px-3 py-1 text-xs transition",
              b.slug === activeSlug
                ? "border-sky-700 bg-sky-950/40 text-sky-200"
                : "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200",
            ].join(" ")}
          >
            {b.tab.replace("Yardi · ", "")}
          </button>
        ))}
      </div>

      {/* The stage: dimmed Yardi screenshot + the overlay riding on top */}
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
        {/* Faux browser chrome */}
        <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/80 px-3 py-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
          </div>
          <div className="ml-2 flex min-w-0 items-center gap-2 truncate rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1 font-mono text-[10px] text-zinc-500">
            <span className="text-zinc-600">yardi.com</span> · {beat.tab}
          </div>
        </div>

        {/* On lg+ the overlay floats over the screen; below lg it stacks under it.
            AdaptiveReveal keyed on slug = smooth transition between screens. */}
        <AdaptiveReveal key={beat.slug} variant="fade" duration={0.35}>
          <div className="flex flex-col lg:relative lg:block">
            {/* Screenshot */}
            <div
              className="relative w-full"
              style={{ aspectRatio: String(beat.aspect) }}
            >
              <Image
                src={beat.image}
                alt={`${beat.tab} (Yardi screenshot — read-only)`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover object-top opacity-40 saturate-50"
              />
              {/* Insight pin — anchors the overlay to a region of the screen */}
              <span
                className="absolute z-10 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                style={{ top: beat.pin.top, left: beat.pin.left }}
              >
                <span className="absolute h-5 w-5 animate-ping rounded-full bg-sky-500/40" />
                <span className="relative h-2.5 w-2.5 rounded-full border border-sky-300 bg-sky-400" />
              </span>

              {/* "Active across" affordance — follows the person, not the app.
                  Only shown over the screenshot at lg+ (stacked layout omits it
                  to keep the small-width view clean). */}
              <div className="absolute bottom-3 left-3 z-20 hidden rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2.5 backdrop-blur lg:block">
                <p className="mb-1.5 font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                  Active across
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Yardi", "Gmail", "LoopNet", "AHJ portals"].map((app, i) => (
                    <span
                      key={app}
                      className={[
                        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px]",
                        i === 0
                          ? "border-emerald-800/60 bg-emerald-950/30 text-emerald-300"
                          : "border-zinc-700 bg-zinc-800/50 text-zinc-400",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "h-1.5 w-1.5 rounded-sm",
                          i === 0 ? "bg-emerald-400" : "bg-zinc-600",
                        ].join(" ")}
                      />
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* The "following you" overlay panel. Stacked below the screen on
                small widths (full-width, no clipping); floated top-right and
                height-capped on lg+ so its body scrolls instead of overflowing. */}
            <div
              className={[
                "z-20 border-t border-zinc-800 bg-zinc-950/40 p-3 sm:p-4",
                // lg+: anchored top→bottom (definite height) so the overlay's
                // own max-h-full resolves and its body scrolls instead of
                // overflowing the stage.
                "lg:absolute lg:right-4 lg:top-4 lg:bottom-4 lg:flex lg:w-[360px] lg:max-w-[calc(100%-2rem)]",
                "lg:border-0 lg:bg-transparent lg:p-0",
              ].join(" ")}
            >
              <AssistOverlay key={beat.slug} beat={beat} />
            </div>
          </div>
        </AdaptiveReveal>
      </div>

      <p className="text-xs leading-relaxed text-zinc-500">
        The Yardi screen is untouched and read-only. The overlay is the surface
        of the twin — its intelligence is read from our atom store and engine,
        not scraped from the page. It reads, assists, and captures to your core;
        it never writes back into Yardi. Wiring it to your live Yardi is what the
        first phase does.
      </p>
    </div>
  );
}
