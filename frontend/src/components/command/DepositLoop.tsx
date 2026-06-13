"use client";

/**
 * DepositLoop — the accept/edit/reject control wired to the engine write path
 * (POST /api/calibration). This is the guardrail-2 moment made tangible: the
 * earning loop is LIVE (a correction is recorded and reflected), without
 * claiming the displayed numbers are already calibrated.
 *
 * After a correction we (a) show the updated reflection inline and (b) call
 * onRecorded so the parent re-runs the intent — the surface visibly reacts.
 */

import { useState } from "react";
import {
  recordCalibration,
  type CalibrationAction,
  type CalibrationSummary,
} from "@/lib/engine";

export function DepositLoop({
  atomId,
  itemId,
  summary,
  onRecorded,
  compact = false,
}: {
  /** The real atom DID the calibration is recorded against. */
  atomId: string;
  /** Optional sub-item (e.g. a specific resolution path). */
  itemId?: string;
  /** The current reflection for this atom (from the engine assembly). */
  summary?: CalibrationSummary;
  /** Called after a successful record so the parent can re-run the intent. */
  onRecorded?: (result: CalibrationSummary) => void;
  compact?: boolean;
}) {
  const [busy, setBusy] = useState<CalibrationAction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState("");
  const [local, setLocal] = useState<CalibrationSummary | undefined>(summary);

  async function fire(action: CalibrationAction, withNote?: string) {
    setBusy(action);
    setError(null);
    try {
      const res = await recordCalibration({
        atomId,
        action,
        itemId,
        note: withNote,
      });
      setLocal(res.reflection);
      setEditing(false);
      setNote("");
      onRecorded?.(res.reflection);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to record");
    } finally {
      setBusy(null);
    }
  }

  const reflection = local ?? summary;

  return (
    <div
      className={[
        "rounded-lg border border-zinc-800 bg-zinc-950/50",
        compact ? "px-2.5 py-2" : "px-3 py-2.5",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          Deposit loop
        </span>
        <div className="flex gap-1.5">
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => fire("accept")}
            className="rounded-md border border-emerald-800/70 bg-emerald-950/40 px-2.5 py-1 text-xs font-medium text-emerald-200 transition hover:bg-emerald-900/40 disabled:opacity-50"
          >
            {busy === "accept" ? "…" : "Accept"}
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => setEditing((v) => !v)}
            className="rounded-md border border-sky-800/70 bg-sky-950/40 px-2.5 py-1 text-xs font-medium text-sky-200 transition hover:bg-sky-900/40 disabled:opacity-50"
          >
            Edit
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => fire("reject")}
            className="rounded-md border border-red-900/70 bg-red-950/40 px-2.5 py-1 text-xs font-medium text-red-200 transition hover:bg-red-900/40 disabled:opacity-50"
          >
            {busy === "reject" ? "…" : "Reject"}
          </button>
        </div>
      </div>

      {editing && (
        <div className="mt-2 flex flex-col gap-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Your correction (becomes calibrated history)…"
            rows={2}
            className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-sky-700"
          />
          <div className="flex gap-1.5">
            <button
              type="button"
              disabled={busy !== null || note.trim().length === 0}
              onClick={() => fire("edit", note.trim())}
              className="rounded-md border border-sky-800/70 bg-sky-950/40 px-2.5 py-1 text-xs font-medium text-sky-200 transition hover:bg-sky-900/40 disabled:opacity-50"
            >
              {busy === "edit" ? "Recording…" : "Submit correction"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setNote("");
              }}
              className="rounded-md border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 transition hover:text-zinc-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {reflection && (
        <p className="mt-2 text-[11px] leading-snug text-zinc-500">
          {reflection.signalLabel}
          {reflection.total > 0 && (
            <span className="text-zinc-600">
              {" "}
              ({reflection.accepts} accept · {reflection.edits} edit ·{" "}
              {reflection.rejects} reject)
            </span>
          )}
        </p>
      )}
      {error && <p className="mt-1 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}
