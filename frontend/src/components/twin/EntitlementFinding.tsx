"use client";

/**
 * EntitlementFinding — the hero MF-3 plan-review finding, reachable from the
 * building level. 5-story vs MF-3 (40 ft / 36 u-ac), with the §25-2-562 citation,
 * the as-of date, resolution paths, a baseline/provenance-backed ConfidenceChip
 * (guardrail 1 — shown with its state, never as earned), and a DrillLink.
 *
 * It also carries the DEPOSIT-LOOP affordance (accept / edit / reject). When the
 * engine is reachable the action POSTs to /api/calibration (the earning loop is
 * live); when it is not (the deployed static twin), it degrades gracefully —
 * the intent is recorded locally and the UI says so. Per guardrail 2 a recorded
 * signal NEVER relabels the number as earned-calibrated.
 */

import { useState } from "react";
import { ConfidenceChip } from "@/components/library";
import { getArm, REPRESENTATIVE_DATA_NOTE } from "@/content/mox";
import { DrillLink } from "./LocalAtomDrill";
import { entitlementFinding, code562, code564, toChipState } from "./atoms";
import { recordCalibration, engineConfigured } from "./engineClient";

const BUILD = getArm("build");

type Action = "accept" | "edit" | "reject";

export function EntitlementFinding() {
  const p = entitlementFinding.payload as {
    headline: string;
    text: string;
    severity: string;
    violatedStandard?: { standard: string; proposed: string };
    resolutionPaths?: Array<{ path: string; description: string; citation: string }>;
    asOfDate?: string;
  };
  const conf = entitlementFinding.confidence;

  const [recorded, setRecorded] = useState<Action | null>(null);
  const [mode, setMode] = useState<"idle" | "sending" | "local" | "engine">("idle");
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState(false);

  async function act(action: Action) {
    setMode("sending");
    const result = await recordCalibration({
      atomId: entitlementFinding.atomId,
      action,
      note: note || undefined,
    });
    setRecorded(action);
    setMode(result ? "engine" : "local");
    setEditing(false);
  }

  return (
    <section
      id="entitlement-finding"
      className="scroll-mt-6 rounded-xl border border-amber-900/50 bg-amber-950/15 p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-900/50 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-amber-200">
              {p.severity}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Entitlement finding · building level
            </span>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-zinc-100">{p.headline}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-amber-300/80">
            <span className="rounded border border-amber-900/50 bg-amber-950/40 px-1.5 py-0.5 text-amber-200">
              {BUILD?.fullName ?? "BLDR by Mox"}
            </span>
            <span className="text-zinc-500">· the build-arm bottom line</span>
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <ConfidenceChip
            state={toChipState(conf.state)}
            value={conf.value}
            verification="verified"
            title={conf.stateNote}
          />
          <DrillLink atomId={entitlementFinding.atomId} label="finding atom" />
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-zinc-300">{p.text}</p>

      {p.violatedStandard && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">Standard</p>
            <p className="mt-0.5 text-sm text-zinc-200">{p.violatedStandard.standard}</p>
            <DrillLink atomId={code562.atomId} label="§25-2-562" className="mt-2" />
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">Proposed</p>
            <p className="mt-0.5 text-sm text-zinc-200">{p.violatedStandard.proposed}</p>
            <p className="mt-1 text-[11px] text-amber-300/80">exceeds the MF-3 envelope</p>
          </div>
        </div>
      )}

      {p.resolutionPaths && p.resolutionPaths.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">Resolution paths</p>
          <ul className="mt-1.5 space-y-1.5">
            {p.resolutionPaths.map((rp) => (
              <li key={rp.path} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 text-sm">
                <span className="font-medium capitalize text-zinc-200">{rp.path}</span>
                <span className="text-zinc-400"> — {rp.description}</span>
                <span className="mt-1 flex items-center gap-2">
                  <span className="font-mono text-[10px] text-zinc-500">{rp.citation}</span>
                  {rp.path === "rezone" && <DrillLink atomId={code564.atomId} label="§25-2-564" />}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-3 font-mono text-[10px] text-zinc-500">
        as-of {p.asOfDate} · {conf.chipLabel ?? "Confidence: baseline (provenance-backed)"}
      </p>

      {/* ---- BLDR bottom-line framing: the catch maps to the build cost drivers ---- */}
      <div className="mt-4 rounded-lg border border-amber-900/40 bg-amber-950/20 p-3">
        <p className="text-[11px] uppercase tracking-wide text-amber-300/80">
          Why this is the {BUILD?.name ?? "BLDR"} win
        </p>
        <p className="mt-1 text-sm leading-relaxed text-zinc-300">
          {BUILD?.bottomLineImpact ??
            "Flagging the entitlement gap before submission avoids months of resubmission and carrying cost — the largest swing on the build cost drivers."}
        </p>
        {BUILD && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {BUILD.costDrivers.map((d) => (
              <li
                key={d}
                className={[
                  "rounded border px-2 py-0.5 text-[11px]",
                  d.toLowerCase().includes("carrying")
                    ? "border-amber-800/60 bg-amber-950/40 text-amber-200"
                    : "border-zinc-800 bg-zinc-950/60 text-zinc-400",
                ].join(" ")}
              >
                {d}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-[10px] leading-relaxed text-zinc-500">
          Caught on the spatial twin, at the building level, before a dollar of
          carrying cost is committed — not months into plan review. {REPRESENTATIVE_DATA_NOTE}
        </p>
      </div>

      {/* ---- Deposit loop ---- */}
      <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium text-zinc-300">
            Calibrate this finding (deposit loop)
          </p>
          <span className="font-mono text-[10px] text-zinc-500">
            {engineConfigured() ? "engine reachable" : "static deploy · local intent"}
          </span>
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
          Accept, edit, or reject. The earning loop records your signal — it does
          not relabel the number as earned (guardrail 2). Calibration on Mox
          outcomes begins when your data is wired.
        </p>

        {editing && (
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What would you change? (optional note recorded with the edit)"
            className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 p-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-sky-700 focus:outline-none"
            rows={2}
          />
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => act("accept")}
            disabled={mode === "sending"}
            className="rounded-md border border-emerald-800/70 bg-emerald-950/40 px-2.5 py-1 text-xs font-medium text-emerald-200 transition hover:border-emerald-600 disabled:opacity-50"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => (editing ? act("edit") : setEditing(true))}
            disabled={mode === "sending"}
            className="rounded-md border border-sky-800/70 bg-sky-950/40 px-2.5 py-1 text-xs font-medium text-sky-200 transition hover:border-sky-600 disabled:opacity-50"
          >
            {editing ? "Submit edit" : "Edit"}
          </button>
          <button
            type="button"
            onClick={() => act("reject")}
            disabled={mode === "sending"}
            className="rounded-md border border-rose-800/70 bg-rose-950/40 px-2.5 py-1 text-xs font-medium text-rose-200 transition hover:border-rose-600 disabled:opacity-50"
          >
            Reject
          </button>

          {recorded && mode === "engine" && (
            <span className="text-[11px] text-emerald-300/90">
              Recorded “{recorded}” to the engine (/api/calibration). Signal logged.
            </span>
          )}
          {recorded && mode === "local" && (
            <span className="text-[11px] text-amber-300/90">
              Engine not reachable — “{recorded}” recorded locally for this session.
              It will post when the backend is wired.
            </span>
          )}
          {mode === "sending" && <span className="text-[11px] text-zinc-400">recording…</span>}
        </div>
      </div>
    </section>
  );
}
