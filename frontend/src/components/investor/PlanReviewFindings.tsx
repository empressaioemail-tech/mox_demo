"use client";

/**
 * PlanReviewFindings — the entitlement + plan-review section. Acceptance:
 * "the plan-review findings render with code citations; the MF-3 entitlement
 * finding is present and prominent."
 *
 * The hero finding: a proposed 5-story building exceeds the MF-3 envelope
 * (40 ft height / 36 units per acre); the resolution path is a rezone to MF-4+
 * or a Board-of-Adjustment variance. It is rendered the way the BLDR mockup
 * (mox_html_original/mox_05_build.html) and the legacy findings engine render
 * findings — severity, full reasoning text, code citations, and accept / edit /
 * reject controls — and the controls are wired to the deposit loop
 * (POST /api/calibration). The finding carries a code citation and an as-of date
 * (hard guardrail), and its confidence chip shows state (guardrail 1).
 *
 * The earning loop is LIVE (it records the signal) but the number is never
 * relabeled as earned-calibrated (guardrail 2).
 */

import { useState } from "react";
import { ConfidenceChip } from "@/components/library";
import { DrillLink } from "./AtomDrill";
import { recordCalibration, toChipState } from "./engineClient";
import type {
  CalibrationSummary,
  EngineConfidence,
  PlanReviewData,
} from "./types";

const FINDING_ATOM_ID =
  "did:hauska:finding:nelray-607-611/mf3-height-density-exceedance";

type ActionState =
  | { kind: "idle" }
  | { kind: "editing"; itemId: string; draft: string }
  | { kind: "busy"; itemId: string }
  | { kind: "done"; itemId: string; action: string; label: string }
  | { kind: "error"; itemId: string };

interface SurfaceItem {
  itemId: string;
  kind: "finding" | "resolution-path";
  headline: string;
  detail?: string;
  citation?: string;
}

export function PlanReviewFindings({
  data,
  confidence,
  calibration,
}: {
  data: PlanReviewData;
  /** finding chip + each cited code-section chip (confidence[0] is the finding) */
  confidence: EngineConfidence[];
  calibration: CalibrationSummary[];
}) {
  const findingConf = confidence[0];
  const findingCalib = calibration.find((c) => c.atomId === FINDING_ATOM_ID);

  // The deposit-loop items: the finding itself + each resolution path.
  const items: SurfaceItem[] = [
    {
      itemId: FINDING_ATOM_ID,
      kind: "finding",
      headline: data.headline,
      detail: data.text,
    },
    ...(data.resolutionPaths ?? []).map((p, i) => ({
      itemId: `${FINDING_ATOM_ID}#path-${i}`,
      kind: "resolution-path" as const,
      headline:
        p.path === "rezone"
          ? "Resolution path · Rezone to MF-4+"
          : "Resolution path · Board of Adjustment variance",
      detail: p.description,
      citation: p.citation,
    })),
  ];

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Pre-submission plan review · entitlement
          </p>
          <h2 className="mt-1 text-lg font-semibold text-zinc-100">
            The code risk, vetted before a dollar is raised
          </h2>
          <p className="mt-0.5 text-sm text-zinc-400">
            We run the review the authority will run, against Austin&apos;s Land
            Development Code, so the entitlement gap is on the table up front.
          </p>
        </div>
        <span className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-zinc-300">
          {data.severity === "blocker" ? "1 blocker" : data.severity} · before
          you file
        </span>
      </div>

      {/* Hero finding card — prominent. */}
      <div className="mt-4 rounded-lg border border-red-900/50 bg-red-950/10 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-red-500/20 font-mono text-sm font-semibold text-red-300">
            !
          </span>
          <span className="rounded bg-red-500/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-red-300">
            {data.severity}
          </span>
          {findingConf && (
            <ConfidenceChip
              state={toChipState(findingConf.state)}
              value={findingConf.value}
              verification="verified"
              title={findingConf.note}
            />
          )}
          {data.asOfDate && (
            <span className="font-mono text-[10px] text-zinc-500">
              as of {data.asOfDate}
            </span>
          )}
          <DrillLink atomId={FINDING_ATOM_ID} label="finding atom" />
        </div>

        <h3 className="mt-3 text-base font-semibold text-zinc-100">
          {data.headline}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-300">
          {data.text}
        </p>

        {data.violatedStandard && (
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-md border border-zinc-800 bg-zinc-950/60 p-2.5">
              <p className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">
                MF-3 standard
              </p>
              <p className="mt-0.5 text-xs text-zinc-300">
                {data.violatedStandard.standard}
              </p>
            </div>
            <div className="rounded-md border border-zinc-800 bg-zinc-950/60 p-2.5">
              <p className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">
                Proposed
              </p>
              <p className="mt-0.5 text-xs text-zinc-300">
                {data.violatedStandard.proposed}{" "}
                {data.violatedStandard.exceeds && (
                  <span className="text-red-300">· exceeds</span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Code citations — always shown, never collapsed (legacy pattern). */}
        {data.citations && data.citations.length > 0 && (
          <div className="mt-3 flex flex-wrap items-baseline gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">
              Cites
            </span>
            {data.citations.map((c) => (
              <span
                key={c.atomId}
                className="inline-flex items-center gap-1.5"
              >
                <code className="rounded bg-sky-950/40 px-1.5 py-0.5 font-mono text-[10px] text-sky-200">
                  §{c.sectionNumber}
                  {c.title ? ` · ${c.title}` : ""}
                </code>
                <DrillLink atomId={c.atomId} label="code" />
              </span>
            ))}
          </div>
        )}

        {findingCalib && (
          <p className="mt-3 font-mono text-[10px] text-zinc-500">
            {findingCalib.signalLabel}
          </p>
        )}
      </div>

      {/* Deposit-loop items: the finding + each resolution path, accept/edit/reject. */}
      <div className="mt-4 divide-y divide-zinc-800 rounded-lg border border-zinc-800 bg-zinc-950/40">
        {items.map((item) => (
          <FindingItemRow key={item.itemId} item={item} />
        ))}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">
        Accept / edit / reject record a calibration signal on the engine
        (deposit loop). The earning loop is live; it does not relabel the
        finding as earned-calibrated. We provide the cited finding; the GP makes
        the entitlement representation.
      </p>
    </section>
  );
}

function FindingItemRow({ item }: { item: SurfaceItem }) {
  const [state, setState] = useState<ActionState>({ kind: "idle" });

  async function act(action: "accept" | "edit" | "reject", note?: string) {
    setState({ kind: "busy", itemId: item.itemId });
    const result = await recordCalibration({
      atomId: FINDING_ATOM_ID,
      action,
      itemId: item.itemId,
      note,
    });
    if (result) {
      setState({
        kind: "done",
        itemId: item.itemId,
        action,
        label: result.reflection.signalLabel,
      });
    } else {
      setState({ kind: "error", itemId: item.itemId });
    }
  }

  const busy = state.kind === "busy";
  const done = state.kind === "done" ? state : null;
  const editing = state.kind === "editing" ? state : null;

  return (
    <div className="flex flex-col gap-2 p-3.5">
      <div className="flex items-start gap-3">
        <span
          className={[
            "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded font-mono text-[11px] font-semibold",
            item.kind === "finding"
              ? "bg-red-500/20 text-red-300"
              : "bg-zinc-700/40 text-zinc-300",
          ].join(" ")}
        >
          {item.kind === "finding" ? "!" : "→"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-zinc-200">{item.headline}</p>
          {item.detail && (
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              {item.detail}
            </p>
          )}
          {item.citation && (
            <code className="mt-1.5 inline-block rounded bg-sky-950/40 px-1.5 py-0.5 font-mono text-[10px] text-sky-200">
              {item.citation}
            </code>
          )}
        </div>

        {!editing && !done && (
          <div className="flex shrink-0 gap-1.5">
            <button
              type="button"
              disabled={busy}
              onClick={() => void act("accept")}
              className="rounded-md border border-emerald-800/60 bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-200 transition hover:border-emerald-600 disabled:opacity-50"
            >
              Accept
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                setState({ kind: "editing", itemId: item.itemId, draft: "" })
              }
              className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-zinc-300 transition hover:border-zinc-500 disabled:opacity-50"
            >
              Edit
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void act("reject")}
              className="rounded-md border border-red-900/60 bg-red-950/30 px-2.5 py-1 text-xs font-semibold text-red-200 transition hover:border-red-700 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {editing && (
        <div className="ml-8 flex flex-col gap-2">
          <textarea
            value={editing.draft}
            onChange={(e) =>
              setState({
                kind: "editing",
                itemId: item.itemId,
                draft: e.target.value,
              })
            }
            rows={2}
            placeholder="Your correction / note (recorded as an edit signal)…"
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-2.5 py-2 text-xs text-zinc-200 outline-none focus:border-sky-700"
          />
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => void act("edit", editing.draft || undefined)}
              className="rounded-md border border-sky-800/60 bg-sky-950/40 px-2.5 py-1 text-xs font-semibold text-sky-200 transition hover:border-sky-600"
            >
              Submit edit
            </button>
            <button
              type="button"
              onClick={() => setState({ kind: "idle" })}
              className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-400 transition hover:border-zinc-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {done && (
        <p className="ml-8 font-mono text-[10px] text-emerald-300/90">
          Recorded {done.action} · {done.label}
        </p>
      )}
      {state.kind === "error" && (
        <p className="ml-8 font-mono text-[10px] text-red-300">
          Could not record — engine unreachable.
        </p>
      )}
    </div>
  );
}
