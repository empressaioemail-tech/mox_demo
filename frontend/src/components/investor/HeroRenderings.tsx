"use client";

/**
 * HeroRenderings — the curated hero imagery for the data room. Acceptance:
 * "renderings are present and carry the deal."
 *
 * These are a CURATED SMALL set (<=8) optimized from the operator's Revit
 * renderings + exterior elevations (the bulk stays gitignored under
 * apartment_bldg/). The North-East and East elevations carry the 5-story massing
 * — i.e. they are the visual face of the entitlement finding (5 stories vs the
 * MF-3 40 ft envelope); the interiors carry the unit quality the underwrite
 * prices in. Sourced from the building twin atom (RVT-derived).
 */

import { useState } from "react";
import { ConfidenceChip } from "@/components/library";
import { DrillLink } from "./AtomDrill";
import type { EngineConfidence, HeroImage, RenderingsPanelData } from "./types";
import { toChipState } from "./engineClient";

const BUILDING_ATOM_ID = "did:hauska:building:nelray-5story-apartment";

/** The curated set placed under frontend/public/renderings/ (see WS-5 report). */
export const HERO_IMAGES: HeroImage[] = [
  {
    src: "/renderings/exterior-north-east.webp",
    alt: "North-east exterior elevation of the proposed 5-story apartment",
    caption:
      "North-east elevation — the proposed 5-story massing (the height the MF-3 finding flags)",
    kind: "elevation",
  },
  {
    src: "/renderings/exterior-east.webp",
    alt: "East exterior elevation showing five floors",
    caption: "East elevation — five floors over the 40 ft MF-3 envelope",
    kind: "elevation",
  },
  {
    src: "/renderings/interior-living.webp",
    alt: "Photoreal living room rendering",
    caption: "Typical living area",
    kind: "interior",
  },
  {
    src: "/renderings/interior-kitchen-dining.webp",
    alt: "Photoreal kitchen and dining rendering",
    caption: "Kitchen and dining",
    kind: "interior",
  },
  {
    src: "/renderings/interior-dining.webp",
    alt: "Photoreal open kitchen and dining rendering",
    caption: "Open kitchen / dining",
    kind: "interior",
  },
  {
    src: "/renderings/interior-living-2.webp",
    alt: "Photoreal living room with feature wall",
    caption: "Living area, feature wall",
    kind: "interior",
  },
  {
    src: "/renderings/interior-foyer.webp",
    alt: "Photoreal entry / foyer rendering",
    caption: "Unit entry / foyer",
    kind: "interior",
  },
  {
    src: "/renderings/interior-bedroom.webp",
    alt: "Photoreal bedroom anteroom rendering",
    caption: "Bedroom suite",
    kind: "interior",
  },
];

export function HeroRenderings({
  data,
  confidence,
}: {
  data: RenderingsPanelData;
  confidence?: EngineConfidence;
}) {
  const [active, setActive] = useState(0);
  const hero = HERO_IMAGES[active];

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Proposed building · renderings
          </p>
          <h2 className="mt-1 text-lg font-semibold text-zinc-100">
            {data.name ?? "5 Story Apartment (proposed)"}
          </h2>
          <p className="mt-0.5 text-sm text-zinc-400">
            {data.buildingType ?? "multifamily-apartment"} ·{" "}
            {data.proposedStories ?? 5} stories · {data.status ?? "proposed"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {confidence && (
            <ConfidenceChip
              state={toChipState(confidence.state)}
              value={confidence.value}
              title={confidence.note}
            />
          )}
          <DrillLink atomId={BUILDING_ATOM_ID} label="building atom" />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-zinc-800 bg-black">
        {/* Renderings are static optimized assets; the building twin atom is the
            provenance. eslint-disable next/no-img-element: intentional <img>. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.src}
          alt={hero.alt}
          className="aspect-[16/9] w-full object-contain bg-zinc-950"
          loading="eager"
        />
      </div>
      <p className="mt-2 text-xs text-zinc-400">{hero.caption}</p>

      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
        {HERO_IMAGES.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show ${img.caption}`}
            className={[
              "overflow-hidden rounded-md border bg-zinc-950 transition",
              i === active
                ? "border-sky-600 ring-1 ring-sky-700"
                : "border-zinc-800 hover:border-zinc-600",
            ].join(" ")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              className="aspect-square w-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">
        Imagery rendered from the operator-controlled Revit model
        (5&nbsp;Story&nbsp;Apartment.rvt). A curated set is shown here; the full
        model and renderings remain private. The two elevations are the proposed
        5-story massing the entitlement finding below reviews against Austin code.
      </p>
    </section>
  );
}
