"use client";

/**
 * CommandSurface — Part A, the adaptive command: an intent bar that, on submit,
 * calls the WS-2 engine and renders the returned ordered components as real
 * React components (one renderer per componentKind, each carrying its
 * confidence chip WITH state + provenance).
 *
 * The deposit loop on surfaced items writes a calibration event and then
 * re-runs the current intent, so the surface visibly reflects the loop is live
 * (guardrail 2) — the reflection labels on each component update in place.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  submitIntent,
  HERO_INTENTS,
  type AssemblyResult,
} from "@/lib/engine";
import { ComponentRenderer } from "./renderers";

export function CommandSurface() {
  const [intent, setIntent] = useState("");
  const [result, setResult] = useState<AssemblyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastIntent = useRef<string>("");

  const run = useCallback(async (value: string) => {
    const text = value.trim();
    if (!text) return;
    lastIntent.current = text;
    setLoading(true);
    setError(null);
    try {
      const res = await submitIntent(text, true);
      setResult(res);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not reach the engine. Is the backend running on 8787?",
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Open on the primary hero intent so the surface is alive on first paint.
  useEffect(() => {
    setIntent(HERO_INTENTS[0]);
    void run(HERO_INTENTS[0]);
  }, [run]);

  // After a deposit-loop correction, re-run the current intent so the surface
  // reacts: the calibration reflection labels update live (the loop is real).
  const handleCalibrated = useCallback(() => {
    if (lastIntent.current) void run(lastIntent.current);
  }, [run]);

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
        <div className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/70 px-3 py-2 focus-within:border-sky-700">
          <span className="font-mono text-xs text-zinc-500">intent</span>
          <input
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            placeholder="Express intent — e.g. show me this deal"
            className="flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
            aria-label="Intent"
          />
          <button
            type="submit"
            disabled={loading || intent.trim().length === 0}
            className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-semibold text-zinc-900 transition hover:bg-white disabled:opacity-50"
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
                lastIntent.current === h
                  ? "border-sky-700 bg-sky-950/40 text-sky-200"
                  : "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200",
              ].join(" ")}
            >
              {h}
            </button>
          ))}
        </div>
      </form>

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

      {/* The assembled, ordered components */}
      {result && result.components.length > 0 && (
        <div className="space-y-4">
          {result.components.map((c, i) => (
            <ComponentRenderer
              key={`${c.componentKind}-${i}`}
              component={c}
              onCalibrated={handleCalibrated}
            />
          ))}
        </div>
      )}

      {result && result.components.length === 0 && !loading && (
        <p className="text-sm text-zinc-500">
          The engine assembled no components for that intent. Try a hero intent
          above.
        </p>
      )}
    </div>
  );
}
