"use client";

/**
 * BuildingView — the spatial face of the proposed 5-story building. The 3D slot
 * (Sketchfab rendered model when configured, graceful fallback otherwise) leads,
 * then a hero gallery of curated renderings + exterior elevations (the active
 * asset-based twin), building-level orientation floor plans, the composed
 * ground-truth layer, and the MF-3 entitlement finding — the BLDR bottom-line win.
 *
 * Building-level layers reveal in a staggered, intentional sequence
 * (AssemblingSequence) so the surface assembles itself rather than popping in.
 */

import { useState } from "react";
import { ConfidenceChip } from "@/components/library";
import { AssemblingSequence } from "@/components/adaptive";
import { ApsViewerSlot } from "@/components/aps/ApsViewerSlot";
import { DrillLink } from "./LocalAtomDrill";
import { GroundTruthLayer } from "./GroundTruthLayer";
import { EntitlementFinding } from "./EntitlementFinding";
import { BUILDING_IMAGES, LEVEL_PLANS } from "./assets";
import { building, toChipState } from "./atoms";

export function BuildingView({ onOpenUnit }: { onOpenUnit?: () => void }) {
  const [active, setActive] = useState(0);
  const hero = BUILDING_IMAGES[active];
  const p = building.payload as {
    name: string;
    buildingType: string;
    proposedStories: number;
    status: string;
    spatialRef: { apsModelUrn: string };
  };

  return (
    <AssemblingSequence className="space-y-6" step={0.12} max={0.9}>
      {/* The 3D model slot — Sketchfab rendered model (or graceful fallback) */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <ApsViewerSlot apsModelUrn={p.spatialRef.apsModelUrn} />
      </section>

      {/* Hero gallery — the active asset-based twin */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Spatial twin · proposed building (asset-based)
            </p>
            <h2 className="mt-1 text-lg font-semibold text-zinc-100">{p.name}</h2>
            <p className="mt-0.5 text-sm text-zinc-400">
              {p.buildingType} · {p.proposedStories} stories · {p.status}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <ConfidenceChip
              state={toChipState(building.confidence.state)}
              value={building.confidence.value}
              title={building.confidence.stateNote}
            />
            <DrillLink atomId={building.atomId} label="building atom" />
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-zinc-800 bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.src}
            alt={hero.alt}
            className="aspect-[16/9] w-full bg-zinc-950 object-contain"
            loading="eager"
          />
        </div>
        <p className="mt-2 text-xs text-zinc-400">{hero.caption}</p>

        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
          {BUILDING_IMAGES.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${img.caption}`}
              className={[
                "overflow-hidden rounded-md border bg-zinc-950 transition",
                i === active ? "border-sky-600 ring-1 ring-sky-700" : "border-zinc-800 hover:border-zinc-600",
              ].join(" ")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} className="aspect-square w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">
          Curated, optimized renderings and elevations from the operator-controlled
          Revit model (5&nbsp;Story&nbsp;Apartment.rvt). The full model and the bulk
          image set remain private and uncommitted. These are renderings of the
          proposed design — the click-to-source atom layer below carries the data.
        </p>
      </section>

      {/* Building-level orientation floor plans */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          Building-level orientation · floor plans
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {LEVEL_PLANS.map((plan) => (
            <figure key={plan.src}>
              <div className="overflow-hidden rounded-lg border border-zinc-800 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={plan.src} alt={plan.alt} className="aspect-[4/3] w-full object-contain" loading="lazy" />
              </div>
              <figcaption className="mt-1.5 text-xs text-zinc-400">{plan.caption}</figcaption>
            </figure>
          ))}
        </div>
        {onOpenUnit && (
          <button
            type="button"
            onClick={onOpenUnit}
            className="mt-4 rounded-md border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-sky-700 hover:text-sky-200"
          >
            Open a unit → walk it room by room
          </button>
        )}
      </section>

      {/* Composed ground-truth layer */}
      <GroundTruthLayer />

      {/* The hero entitlement finding, reachable from the building level */}
      <EntitlementFinding />
    </AssemblingSequence>
  );
}
