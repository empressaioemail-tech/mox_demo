"use client";

/**
 * 3D-model slot for the spatial twin.
 *
 * The live APS SVF2 viewer is OFF THE CRITICAL PATH (an Autodesk account-level
 * entitlement gap, AUTH-001 on every scope — not our code). The 3D face of the
 * twin is now a SKETCHFAB-rendered embed of the proposed building design.
 *
 * This component is config-driven via NEXT_PUBLIC_SKETCHFAB_MODEL_ID (NEXT_PUBLIC
 * so it inlines client-side at build):
 *
 *   - SET   → render the live <SketchfabEmbed> and label the slot
 *             "Proposed building — rendered model + site."
 *   - UNSET → graceful fallback: a small "rendered 3D model — wiring up" note over
 *             a faux-viewport backdrop (NO broken iframe). The asset/renderings
 *             hero + the click-to-data atom layer stay the active spatial face.
 *
 * HONESTY: whatever renders here is a RENDERING of the PROPOSED design, not live
 * tenant data and not a measured as-built. The `apsModelUrn` is still surfaced as
 * the staged seam for the eventual measured model (Part A backfill).
 */

import { SketchfabEmbed } from "@/components/twin/SketchfabEmbed";

/** The Sketchfab model id, inlined at build from the env. Empty string if unset. */
export const SKETCHFAB_MODEL_ID =
  process.env.NEXT_PUBLIC_SKETCHFAB_MODEL_ID ?? "";

export function ApsViewerSlot({
  apsModelUrn,
  className,
}: {
  /** The building atom's apsModelUrn (placeholder until Part A backfills it). */
  apsModelUrn?: string;
  className?: string;
}) {
  const urn = apsModelUrn ?? "PLACEHOLDER_APS_URN_BACKFILL_PART_A";
  const isPlaceholder = urn.startsWith("PLACEHOLDER");
  const modelId = SKETCHFAB_MODEL_ID.trim();
  const hasModel = modelId.length > 0;

  return (
    <div
      data-slot="aps-viewer"
      data-mode={hasModel ? "sketchfab" : "fallback"}
      className={["space-y-2", className ?? ""].filter(Boolean).join(" ")}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          {hasModel
            ? "Proposed building — rendered model + site"
            : "Proposed building — rendered 3D model"}
        </p>
        <span className="inline-flex items-center gap-2 rounded-full border border-sky-800/70 bg-sky-950/40 px-2.5 py-0.5 text-[11px] font-medium text-sky-200">
          <span
            className={[
              "h-1.5 w-1.5 rounded-full",
              hasModel ? "bg-sky-400" : "animate-pulse bg-amber-400",
            ].join(" ")}
          />
          {hasModel ? "Live 3D rendering" : "Rendered 3D model — wiring up"}
        </span>
      </div>

      {hasModel ? (
        <SketchfabEmbed
          modelId={modelId}
          title="Proposed 5-story building — rendered Sketchfab model"
        />
      ) : (
        <FallbackSlot />
      )}

      <p className="text-[11px] leading-relaxed text-zinc-500">
        A rendering of the <span className="text-zinc-400">proposed design</span> —
        not live tenant data and not a measured as-built. The measured model
        (APS / Model Derivative) backfills the same seam later.
        {" · "}
        <span className="font-mono text-[10px] text-zinc-600">
          building atom · apsModelUrn{" "}
          <code className="rounded border border-zinc-800 bg-zinc-950 px-1 py-0.5 text-zinc-500">
            {urn}
          </code>
          {isPlaceholder && (
            <span className="ml-1 text-amber-300/70">
              placeholder — backfills from the Model Derivative (Part A)
            </span>
          )}
        </span>
      </p>
    </div>
  );
}

/** The no-model fallback: a faux viewport with an honest note (no broken iframe). */
function FallbackSlot() {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse at center, black 35%, transparent 80%)",
        }}
      />
      <div className="relative flex h-full flex-col items-center justify-center gap-3 px-6 py-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-800/60 bg-amber-950/30 px-3 py-1 text-xs font-medium text-amber-200">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
          Rendered 3D model — wiring up
        </span>
        <p className="max-w-md text-xs leading-relaxed text-zinc-400">
          A rendered, orbitable 3D model of the proposed building drops in here
          (Sketchfab). The asset-based twin below — renderings, elevations, floor
          plans — is the active spatial face, and every fact stays
          click-to-source.
        </p>
      </div>
    </div>
  );
}

export default ApsViewerSlot;
