"use client";

/**
 * CommandSurface — the adaptive command: an intent bar that, on submit, calls
 * the engine and renders the returned ordered components as real React
 * components (one renderer per componentKind, each carrying its confidence chip
 * WITH state + drillable provenance).
 *
 * THE MAGICAL REVEAL: on each submit the assembled components appear in the
 * frame one-by-one — as if the engine is wiring the surface together live. This
 * is <AssemblingSequence> with a replayKey set to the intent + an assembly
 * counter, so the whole sequence re-runs (re-staggers) on every submit, with a
 * brief "assembling…" shimmer. Respects prefers-reduced-motion (instant).
 *
 * RBAC: tenant-private / operating-internal views are role-gated inside the
 * renderers (see arms.ts), so switching the header role to LP visibly redacts
 * them. A live banner here tells the audience what the current role can see.
 *
 * The deposit loop on surfaced items writes a calibration event and re-runs the
 * current intent, so the surface reflects the live earning loop (guardrail 2) —
 * the reflection labels update in place; numbers are never relabeled as earned.
 */

import { useCallback, useEffect, useState } from "react";
import {
  submitIntent,
  HERO_INTENTS,
  type AssemblyResult,
} from "@/lib/engine";
import { AssemblingSequence } from "@/components/adaptive";
import { useRole } from "@/components/rbac";
import { REPRESENTATIVE_DATA_NOTE, THROUGH_LINE } from "@/content/mox";
import { ComponentRenderer } from "./renderers";

export function CommandSurface() {
  // Pre-fill the primary hero intent so the bar is presenter-ready on load.
  const [intent, setIntent] = useState<string>(HERO_INTENTS[0]);
  const [result, setResult] = useState<AssemblyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // The last submitted intent (state, not a ref — it drives render: the active
  // hero-button highlight, the shimmer label, and the reveal replayKey).
  const [submitted, setSubmitted] = useState<string>("");
  // Bumped on every successful assembly so the reveal re-runs even when the
  // same intent is re-submitted (e.g. after a deposit-loop correction).
  const [assemblyCount, setAssemblyCount] = useState(0);
  const { roleDef, isExternal } = useRole();

  const run = useCallback(async (value: string) => {
    const text = value.trim();
    if (!text) return;
    setSubmitted(text);
    setLoading(true);
    setError(null);
    try {
      const res = await submitIntent(text, true);
      setResult(res);
      setAssemblyCount((n) => n + 1);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not reach the engine.",
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Open on the primary hero intent so the surface is alive on first paint.
  // This is the legitimate effect use: kicking off an external (engine) call on
  // mount, not deriving render state.
  useEffect(() => {
    // Defer to a microtask so the engine call (and its setState) is not invoked
    // synchronously in the effect body.
    void Promise.resolve().then(() => run(HERO_INTENTS[0]));
  }, [run]);

  // After a deposit-loop correction, re-run the current intent so the surface
  // reacts: the calibration reflection labels update live (the loop is real).
  const handleCalibrated = useCallback(() => {
    if (submitted) void run(submitted);
  }, [run, submitted]);

  // The replay key changes on every assembly, so the reveal re-staggers each
  // submit — the headline "assembles itself live" effect.
  const replayKey = `${submitted}#${assemblyCount}`;

  return (
    <div className="space-y-6">
      {/* Intent bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void run(intent);
        }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/70 px-3 py-2.5 focus-within:border-sky-700">
          <span className="font-mono text-xs text-zinc-500">intent</span>
          <input
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            placeholder="Express intent — e.g. show me this deal"
            className="flex-1 bg-transparent text-base text-zinc-100 outline-none placeholder:text-zinc-600"
            aria-label="Intent"
          />
          <button
            type="submit"
            disabled={loading || intent.trim().length === 0}
            className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-white disabled:opacity-50"
          >
            {loading ? "Assembling…" : "Assemble"}
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {HERO_INTENTS.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => {
                setIntent(h);
                void run(h);
              }}
              className={[
                "rounded-full border px-3 py-1 text-xs transition",
                submitted === h
                  ? "border-sky-700 bg-sky-950/40 text-sky-200"
                  : "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200",
              ].join(" ")}
            >
              {h}
            </button>
          ))}
        </div>
      </form>

      {/* Live role banner — what the current role can see (RBAC made legible). */}
      <div
        className={[
          "flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border px-3 py-2 text-xs",
          isExternal
            ? "border-amber-900/50 bg-amber-950/20 text-amber-200/90"
            : "border-zinc-800 bg-zinc-900/50 text-zinc-400",
        ].join(" ")}
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          role
        </span>
        <span className="font-medium text-zinc-200">{roleDef.name}</span>
        <span className="text-zinc-500">·</span>
        <span>
          {isExternal
            ? "External LP — operating internals redact below; only the curated, cited views remain."
            : "Internal — full operating visibility. Switch the header role to LP to watch the operating views redact."}
        </span>
      </div>

      {/* Assembly meta */}
      {result && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
          <span>
            engine:{" "}
            <span className="text-zinc-300">{result.providerMode}</span>
            {result.model ? ` · ${result.model}` : ""}
          </span>
          <span>
            view:{" "}
            <span className="text-zinc-300">{result.subject.label}</span>
            {result.subject.tenant ? ` (${result.subject.tenant})` : " (public)"}
          </span>
          <span>
            assembled{" "}
            <span className="text-zinc-300">{result.components.length}</span>{" "}
            component{result.components.length === 1 ? "" : "s"}
          </span>
          {result.gatedOut.length > 0 && (
            <span>
              gated out:{" "}
              <span className="text-zinc-300">{result.gatedOut.length}</span>
            </span>
          )}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* The assembled, ordered components — revealed one-by-one on each submit. */}
      {result && result.components.length > 0 && (
        <AssemblingSequence
          replayKey={replayKey}
          shimmer
          label={`Assembling “${submitted}”…`}
          base={0.08}
          step={0.16}
          variant="rise"
          className="grid gap-4 lg:grid-cols-2 xl:[&>*:first-child]:col-span-2"
        >
          {result.components.map((c, i) => (
            <ComponentRenderer
              key={`${c.componentKind}-${i}`}
              component={c}
              onCalibrated={handleCalibrated}
            />
          ))}
        </AssemblingSequence>
      )}

      {result && result.components.length === 0 && !loading && (
        <p className="text-sm text-zinc-500">
          The engine assembled no components for that intent. Try a hero intent
          above.
        </p>
      )}

      {/* Bottom-line through-line + representative-data honesty note. */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-xs leading-relaxed text-zinc-500">
        <p className="text-zinc-400">{THROUGH_LINE.thesis}</p>
        <p className="mt-2 text-zinc-600">{REPRESENTATIVE_DATA_NOTE}</p>
      </div>
    </div>
  );
}
