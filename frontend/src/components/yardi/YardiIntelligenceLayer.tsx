"use client";

/**
 * YardiIntelligenceLayer — Part B surface. The real Yardi screenshots with the
 * Mox "following you" assist overlay riding on top. Switch screens to walk the
 * screen-to-beat map. The overlay's intelligence is atom-derived (read from the
 * engine / atom store), NOT scraped from the screenshot (guardrail 4).
 *
 * Opening framing (README guardrail 5): the engine is real, the data is
 * representative, wiring it to your Yardi is what the first phase does.
 */

import Image from "next/image";
import { useState } from "react";
import { AssistOverlay } from "./AssistOverlay";
import { YARDI_BEATS } from "./beats";

export function YardiIntelligenceLayer() {
  const [activeSlug, setActiveSlug] = useState(YARDI_BEATS[0].slug);
  const beat = YARDI_BEATS.find((b) => b.slug === activeSlug) ?? YARDI_BEATS[0];

  return (
    <div className="space-y-5">
      {/* Screen switcher */}
      <div className="flex flex-wrap gap-1.5">
        {YARDI_BEATS.map((b) => (
          <button
            key={b.slug}
            type="button"
            onClick={() => setActiveSlug(b.slug)}
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
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
        {/* Faux browser chrome */}
        <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/80 px-3 py-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
          </div>
          <div className="ml-2 flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1 font-mono text-[10px] text-zinc-500">
            <span className="text-zinc-600">yardi.com</span> · {beat.tab}
          </div>
        </div>

        {/* Screenshot + overlay */}
        <div className="relative">
          <div
            className="relative w-full"
            style={{ aspectRatio: String(beat.aspect) }}
          >
            <Image
              src={beat.image}
              alt={`${beat.tab} (Yardi screenshot — read-only)`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
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
          </div>

          {/* The "following you" overlay panel */}
          <div className="absolute right-3 top-3 z-20 max-h-[calc(100%-1.5rem)] overflow-y-auto">
            <AssistOverlay key={beat.slug} beat={beat} />
          </div>

          {/* "Active across" affordance — follows the person, not the app */}
          <div className="absolute bottom-3 left-3 z-20 hidden rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2.5 backdrop-blur sm:block">
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
