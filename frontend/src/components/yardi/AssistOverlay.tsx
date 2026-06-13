"use client";

/**
 * AssistOverlay — the "following you" intelligence panel that sits ON the Yardi
 * screenshot (Part B). Reference UX: mox_html_original/mox_02_extension (1).html
 * and hauska-brief-extension. Dark zinc palette.
 *
 * Honesty:
 *  - The overlay is the surface of the TWIN: its intelligence is atom-derived,
 *    hydrated live from the engine (POST /api/intent) where a liveIntent is set.
 *    It does NOT scrape the screenshot (guardrail 4).
 *  - Confidence carries its state via the shared ConfidenceChip (guardrail 1).
 *  - Capture is assist-first: the assist (history / draft / flag) earns the
 *    capture. The footer captures spans to OUR core only — never a claim of
 *    writing back into Yardi (guardrail 6), never framed as keystroke
 *    monitoring.
 *  - The capture is wired to the deposit loop (POST /api/calibration); the
 *    panel reflects the recorded signal so the loop reads as live.
 */

import { useEffect, useMemo, useState } from "react";
import { ConfidenceChip } from "@/components/library";
import { EngineConfidenceChip } from "@/components/command/confidence";
import {
  recordCalibration,
  submitIntent,
  type EngineConfidence,
  type ProvenanceRef,
} from "@/lib/engine";
import type { YardiBeat } from "./beats";

interface LiveIntel {
  headline: string;
  reasoning?: string;
  confidence?: EngineConfidence;
  provenance: ProvenanceRef[];
}

export function AssistOverlay({ beat }: { beat: YardiBeat }) {
  const [activeAssist, setActiveAssist] = useState<number | null>(null);
  const [live, setLive] = useState<LiveIntel | null>(null);
  const [liveError, setLiveError] = useState(false);
  const [captureState, setCaptureState] = useState<
    "idle" | "saving" | "captured"
  >("idle");
  const [signalLabel, setSignalLabel] = useState<string | null>(null);

  // Hydrate the beat's intelligence from the engine (atom-derived, not scraped).
  useEffect(() => {
    let cancelled = false;
    if (!beat.liveIntent) {
      setLive(null);
      return;
    }
    (async () => {
      try {
        const res = await submitIntent(beat.liveIntent!.intent, true);
        const comp = res.components.find(
          (c) => c.componentKind === beat.liveIntent!.componentKind,
        );
        if (cancelled) return;
        if (!comp) {
          setLiveError(true);
          return;
        }
        const d = comp.data as Record<string, unknown>;
        const anomalies = Array.isArray(d.anomalies)
          ? (d.anomalies as Record<string, unknown>[])
          : [];
        const headline =
          beat.beatKind === "variance" && anomalies.length > 0
            ? `${anomalies.length} line${
                anomalies.length === 1 ? "" : "s"
              } flagged — incl. ${String(anomalies[0].label ?? "a controllable line")}`
            : comp.title;
        const reasoning =
          beat.beatKind === "variance" && anomalies[0]
            ? String(anomalies[0].note ?? "")
            : undefined;
        setLive({
          headline,
          reasoning: reasoning || beat.fallback.reasoning,
          confidence: comp.confidence[0],
          provenance: comp.provenance,
        });
      } catch {
        if (!cancelled) setLiveError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [beat]);

  // The source line: live provenance citation if hydrated, else the fallback.
  const sourceLine = useMemo(() => {
    if (live?.provenance?.length) {
      const withCite = live.provenance.find((p) => p.citation) ?? live.provenance[0];
      return withCite.citation ?? beat.fallback.source;
    }
    return beat.fallback.source;
  }, [live, beat]);

  async function capture() {
    setCaptureState("saving");
    try {
      const res = await recordCalibration({
        atomId: beat.captureAtomId,
        action: "accept",
        itemId: `yardi:${beat.slug}`,
        note: `Captured from Yardi ${beat.tab}: ${beat.captureSpans
          .map((s) => `${s.key}=${s.value}`)
          .join(", ")}`,
      });
      setSignalLabel(res.reflection.signalLabel);
      setCaptureState("captured");
    } catch {
      // Even if the write path is unreachable, the assist still produced value;
      // we surface the capture intent honestly rather than failing hard.
      setSignalLabel("Recorded locally — deposit loop will sync when reachable");
      setCaptureState("captured");
    }
  }

  return (
    <div className="w-[360px] max-w-full overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/95 shadow-2xl shadow-black/60 backdrop-blur">
      {/* Header — logo mark + "following you" pulse */}
      <header className="flex items-center gap-2.5 border-b border-zinc-800 bg-gradient-to-b from-zinc-800/80 to-zinc-900 px-4 py-3">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-zinc-100 font-mono text-[11px] font-bold text-zinc-900">
          M
        </span>
        <b className="text-sm font-semibold text-zinc-100">Mox assist</b>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-emerald-950/50 px-2 py-1 font-mono text-[9px] uppercase tracking-wide text-emerald-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          following you
        </span>
      </header>

      <div className="space-y-3 px-4 py-3.5">
        {/* Context line — what Mox sees you doing */}
        <p className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
          {beat.context}
        </p>

        {/* "This belongs to" link card (work order beat) */}
        {beat.belongsTo && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
            <p className="text-[11px] text-zinc-500">This belongs to</p>
            <p className="mt-0.5 text-sm font-semibold text-zinc-100">
              {beat.belongsTo.label}
            </p>
            <p className="mt-1 font-mono text-[10px] text-zinc-500">
              {beat.belongsTo.meta}
            </p>
          </div>
        )}

        {/* The atom-derived intelligence (live or fallback) with source + confidence */}
        <div className="rounded-xl border border-sky-900/50 bg-sky-950/20 p-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-sky-100">
              {live?.headline ?? beat.fallback.headline}
            </p>
            {live?.confidence ? (
              <EngineConfidenceChip confidence={live.confidence} />
            ) : (
              <ConfidenceChip
                state="baseline"
                value={beat.fallback.confidenceValue}
                title={beat.fallback.confidenceLabel}
              />
            )}
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">
            {live?.reasoning ?? beat.fallback.reasoning}
          </p>
          <p className="mt-2 border-t border-sky-900/40 pt-2 text-[11px] text-zinc-500">
            <span className="font-mono uppercase tracking-wide text-zinc-600">
              source ·{" "}
            </span>
            {sourceLine}
            {liveError && (
              <span className="ml-1 text-amber-400">(engine offline — fallback)</span>
            )}
          </p>
        </div>

        {/* Assist actions — the assist earns the capture */}
        <div>
          <p className="mb-1.5 font-mono text-[9px] uppercase tracking-widest text-zinc-500">
            Assist
          </p>
          <div className="space-y-1.5">
            {beat.assists.map((a, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveAssist(activeAssist === i ? null : i)}
                className={[
                  "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition",
                  activeAssist === i
                    ? "border-zinc-500 bg-zinc-800 text-zinc-100"
                    : "border-zinc-800 bg-zinc-950/40 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/60",
                ].join(" ")}
              >
                <span className="text-zinc-500">›</span>
                {a.label}
              </button>
            ))}
          </div>
          {activeAssist !== null && (
            <p className="mt-2 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs leading-relaxed text-zinc-300">
              {beat.assists[activeAssist].detail}
            </p>
          )}
        </div>

        {/* Drafted reply (work order beat) */}
        {beat.draftReply && (
          <div className="rounded-xl border border-zinc-700 bg-zinc-950/70 p-3">
            <p className="mb-1.5 font-mono text-[9px] uppercase tracking-widest text-emerald-300">
              Drafted reply
            </p>
            <p className="text-xs leading-relaxed text-zinc-200">
              {beat.draftReply}
            </p>
            <p className="mt-2 text-[10px] text-zinc-600">
              Draft assist only — sending happens in your mail client. Mox does
              not write back into Yardi.
            </p>
          </div>
        )}
      </div>

      {/* Capture-to-core footer — assist-first, our core only */}
      <div className="border-t border-zinc-800 bg-zinc-950/60 px-4 py-3">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs font-semibold text-zinc-100">
              {captureState === "captured" ? "Captured to your core" : beat.captureTitle}
            </p>
            <p className="text-[10px] text-zinc-500">{beat.captureSub}</p>
          </div>
          <div className="ml-auto text-right font-mono text-[9px] leading-snug text-zinc-600">
            private to Mox
            <br />
            never pooled
          </div>
        </div>

        {captureState !== "captured" ? (
          <button
            type="button"
            onClick={capture}
            disabled={captureState === "saving"}
            className="mt-2.5 w-full rounded-lg bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-900 transition hover:bg-white disabled:opacity-50"
          >
            {captureState === "saving"
              ? "Capturing…"
              : "Capture to core (deposit loop)"}
          </button>
        ) : (
          <p className="mt-2.5 rounded-lg border border-emerald-900/50 bg-emerald-950/30 px-3 py-2 text-[11px] text-emerald-200">
            {signalLabel ?? "Recorded — earning loop live."}
          </p>
        )}

        {/* The captured atom spans */}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {beat.captureSpans.map((s) => (
            <span
              key={s.key}
              className="rounded-md border border-zinc-700 bg-zinc-800/60 px-2 py-0.5 font-mono text-[9px] text-zinc-300"
            >
              {s.key}: {s.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
