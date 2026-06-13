"use client";

/**
 * OperatingLayer — the seeded operating layer of the composed twin (the
 * operator's own view). Reads the tenant-private pro-forma atom (display only;
 * the twin is the operator's surface). Every metric is BASELINE / projected —
 * the building is proposed, with no operating history — so the chip is shown
 * with its state and is explicitly NOT earned-calibrated (guardrails 1 & 2).
 */

import { ConfidenceChip } from "@/components/library";
import { DrillLink } from "./LocalAtomDrill";
import { operatingProforma, toChipState } from "./atoms";

interface Metric {
  key: string;
  label: string;
  value: number | null;
  unit: string;
  note?: string;
}

export function OperatingLayer() {
  const p = operatingProforma.payload as {
    label: string;
    basis: string;
    metrics: Metric[];
    underwriteConfidenceLabel?: string;
  };
  const conf = operatingProforma.confidence;

  function fmt(m: Metric): string {
    if (m.value === null) return m.note ? "—" : "—";
    if (m.unit === "%") return `${m.value}%`;
    if (m.unit === "$/u/mo") return `$${m.value}/u·mo`;
    if (m.unit === "days") return `${m.value} days`;
    if (m.unit === "units") return `${m.value} units`;
    return `${m.value} ${m.unit}`;
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Operating layer · seeded pro forma
          </p>
          <h3 className="mt-1 text-base font-semibold text-zinc-100">{p.label}</h3>
          <p className="mt-0.5 text-xs text-zinc-500">{p.basis}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <ConfidenceChip
            state={toChipState(conf.state)}
            value={conf.value}
            title={conf.stateNote}
          />
          <DrillLink atomId={operatingProforma.atomId} label="pro-forma" />
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {p.metrics.map((m) => (
          <div key={m.key} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">{m.label}</p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-zinc-100">{fmt(m)}</p>
            {m.note && <p className="mt-0.5 text-[11px] leading-snug text-zinc-500">{m.note}</p>}
          </div>
        ))}
      </div>

      {p.underwriteConfidenceLabel && (
        <p className="mt-3 text-[11px] text-zinc-500">{p.underwriteConfidenceLabel}</p>
      )}
      <p className="mt-1 text-[11px] text-zinc-600">
        Tenant-private. Representative seed values shaped like the operator&apos;s
        book, not actuals — never pooled into shared ground truth.
      </p>
    </section>
  );
}
