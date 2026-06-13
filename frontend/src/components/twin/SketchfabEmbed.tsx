"use client";

/**
 * SketchfabEmbed — a clean, reusable Sketchfab iframe for the proposed building.
 *
 * APS (Autodesk SVF2) is off the critical path (an account-level entitlement gap),
 * so the live 3D face of the twin is a Sketchfab-rendered embed of the proposed
 * design instead. This component takes a Sketchfab MODEL ID and renders the
 * standard embed iframe with minimal chrome, a gentle autospin/orbit, a
 * dark/transparent backdrop, and a responsive 16:9 frame.
 *
 *   <SketchfabEmbed modelId="abcdef0123456789" title="Proposed building" />
 *
 * HONESTY: this is a RENDERING of the proposed design — not live tenant data,
 * not a measured as-built. The caller labels it as such; this component just
 * renders the frame.
 *
 * Embed URL: https://sketchfab.com/models/<id>/embed?<params>
 * Params are documented at https://sketchfab.com/developers/viewer/embed-options.
 */

import { useMemo } from "react";

export interface SketchfabEmbedProps {
  /** The Sketchfab model id (the hash in the model URL). Required. */
  modelId: string;
  /** Accessible iframe title. Default describes the proposed building. */
  title?: string;
  /**
   * Autospin speed (radians/sec-ish; Sketchfab's own scale). 0 disables.
   * Default a gentle orbit.
   */
  autospin?: number;
  /** Start the model spinning/animating automatically. Default true. */
  autostart?: boolean;
  /** Hex background (no leading #). Default a dark zinc to match the surface. */
  background?: string;
  /** Transparent backdrop (lets the surface show through). Default true. */
  transparent?: boolean;
  className?: string;
}

/**
 * Build the Sketchfab embed src with minimal-chrome + gentle-orbit params.
 * Exported for testing / reuse; the component memoizes it.
 */
export function sketchfabEmbedSrc(
  modelId: string,
  opts: {
    autospin?: number;
    autostart?: boolean;
    background?: string;
    transparent?: boolean;
  } = {},
): string {
  const {
    autospin = 0.3,
    autostart = true,
    background = "18181b", // zinc-950-ish
    transparent = true,
  } = opts;

  const params: Record<string, string> = {
    // minimal chrome
    ui_infos: "0",
    ui_controls: "1",
    ui_stop: "0",
    ui_watermark: "0",
    ui_watermark_link: "0",
    ui_help: "0",
    ui_settings: "0",
    ui_inspector: "0",
    ui_vr: "0",
    ui_ar: "0",
    ui_hint: "0",
    ui_annotations: "0",
    ui_loading: "1",
    // gentle motion
    autospin: String(autospin),
    autostart: autostart ? "1" : "0",
    orbit_constraint_pan: "1",
    // dark / transparent backdrop
    transparent: transparent ? "1" : "0",
    dnt: "1", // do-not-track
  };
  if (!transparent) params.background = background;

  const qs = new URLSearchParams(params).toString();
  return `https://sketchfab.com/models/${encodeURIComponent(modelId)}/embed?${qs}`;
}

export function SketchfabEmbed({
  modelId,
  title = "Proposed building — rendered 3D model",
  autospin,
  autostart,
  background,
  transparent,
  className,
}: SketchfabEmbedProps) {
  const src = useMemo(
    () => sketchfabEmbedSrc(modelId, { autospin, autostart, background, transparent }),
    [modelId, autospin, autostart, background, transparent],
  );

  return (
    <div
      data-slot="sketchfab-embed"
      className={[
        "relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <iframe
        title={title}
        src={src}
        className="absolute inset-0 h-full w-full"
        allow="autoplay; fullscreen; xr-spatial-tracking; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}

export default SketchfabEmbed;
