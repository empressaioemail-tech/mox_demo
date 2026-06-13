"use client";

/**
 * APS viewer drop-in slot.
 *
 * The live APS SVF2 viewer is BLOCKED on an Autodesk account-level entitlement
 * issue (AUTH-001 on all scopes, even on a fresh app — not our code). So the
 * active twin is asset-based (renderings / elevations / plans). This component
 * is the STAGED SEAM: it holds the spot, shows the building atom's APS model URN
 * placeholder concept, and is wired to drop in the real viewer with no rework
 * once APS activates — load @aps_sdk + GuiViewer3D against `apsModelUrn` here.
 *
 * Label is fixed verbatim per the WS-4 brief.
 */

export const APS_SLOT_LABEL = "Live 3D model — wiring on APS activation.";

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

  return (
    <div
      data-slot="aps-viewer"
      className={[
        "relative overflow-hidden rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* faux 3D-grid backdrop so the slot reads as a viewport, not an empty box */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)",
        }}
      />
      <div className="relative flex min-h-56 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-sky-800/70 bg-sky-950/40 px-3 py-1 text-xs font-medium text-sky-200">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" />
          Drop-in slot
        </span>
        <p className="text-base font-medium text-zinc-100">{APS_SLOT_LABEL}</p>
        <p className="max-w-md text-xs leading-relaxed text-zinc-400">
          The asset-based twin (renderings, elevations, floor plans) is the active
          spatial face below. The live APS SVF2 viewer drops in here on Autodesk
          account activation — the seam is staged so it lands with no rework.
        </p>
        <div className="mt-1 flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            building atom · apsModelUrn
          </span>
          <code className="max-w-full truncate rounded border border-zinc-800 bg-zinc-950 px-2 py-1 font-mono text-[11px] text-zinc-400">
            {urn}
          </code>
          {isPlaceholder && (
            <span className="text-[10px] text-amber-300/80">
              placeholder — backfills from the Model Derivative (WS-1 Part A)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
