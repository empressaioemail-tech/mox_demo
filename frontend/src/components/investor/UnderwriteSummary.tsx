"use client";

/**
 * UnderwriteSummary — the seeded pro-forma underwrite / return summary. Every
 * number carries a provenance chip (ConfidenceChip, with state) and a clickable
 * lineage down to its source atom (the operating-proforma atom). Acceptance:
 * "every headline number drills to its source atom."
 *
 * Honesty: this is a SEED projection for a not-yet-built asset (guardrails 1+2).
 * The underwrite confidence is baseline / projected — explicitly NOT calibrated
 * on this asset's outcomes, and the surface does NOT certify returns (the GP
 * makes the representations; we provide the provenance infrastructure).
 */

import { ConfidenceChip } from "@/components/library";
import { DrillLink } from "./AtomDrill";
import { toChipState } from "./engineClient";
import type { EngineConfidence, KpiCardData, KpiMetric } from "./types";

const PROFORMA_ATOM_ID = "did:hauska:operating-proforma:nelray-5story";

function formatValue(m: KpiMetric): string {
  if (m.value === null || m.value === undefined) return "—";
  if (m.unit === "$/u/mo") return `$${m.value.toLocaleString()}`;
  if (m.unit === "%") return `${m.value}%`;
  if (m.unit === "days") return `${m.value} d`;
  if (m.unit === "units") return `${m.value}`;
  return `${m.value} ${m.unit}`;
}

export function UnderwriteSummary({
  data,
  confidence,
  listPrice,
}: {
  data: KpiCardData;
  confidence?: EngineConfidence;
  listPrice?: number;
}) {
  const metrics = data.metrics ?? [];

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Underwrite · seed pro forma
          </p>
          <h2 className="mt-1 text-lg font-semibold text-zinc-100">
            Return summary
          </h2>
          <p className="mt-0.5 text-sm text-zinc-400">
            {data.basis ?? "projected (ground-up redevelopment)"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {confidence && (
            <ConfidenceChip
              state={toChipState(confidence.state)}
              value={confidence.value}
              title={confidence.note}
            />
          )}
          <DrillLink atomId={PROFORMA_ATOM_ID} label="pro-forma atom" />
        </div>
      </div>

      {data.underwriteConfidenceLabel && (
        <p className="mt-3 rounded-lg border border-amber-900/50 bg-amber-950/20 px-3 py-2 text-xs leading-relaxed text-amber-200/90">
          {data.underwriteConfidenceLabel}. These are representative seed numbers
          shaped like the operator&apos;s book, not actuals or certified returns.
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {listPrice !== undefined && (
          <MetricCard
            label="List price"
            value={`$${listPrice.toLocaleString()}`}
            note="Redevelopment listing (Aug 2024)"
            atomId="did:hauska:deal:nelray-607-611"
            drillLabel="deal atom"
          />
        )}
        {metrics.map((m) => (
          <MetricCard
            key={m.key}
            label={m.label}
            value={formatValue(m)}
            note={m.note}
            atomId={PROFORMA_ATOM_ID}
            drillLabel="source"
          />
        ))}
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-zinc-500">
        Every figure above resolves to its source atom — click{" "}
        <span className="font-mono text-zinc-400">lineage</span> on any tile.
        Provenance infrastructure is ours; the representations are the GP&apos;s.
      </p>
    </section>
  );
}

function MetricCard({
  label,
  value,
  note,
  atomId,
  drillLabel,
}: {
  label: string;
  value: string;
  note?: string;
  atomId: string;
  drillLabel: string;
}) {
  return (
    <div className="flex flex-col rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
      <div className="font-mono text-2xl font-medium tracking-tight text-zinc-100 tabular-nums">
        {value}
      </div>
      <div className="mt-1 text-xs font-medium text-zinc-300">{label}</div>
      {note && (
        <div className="mt-1 text-[11px] leading-snug text-zinc-500">
          {note}
        </div>
      )}
      <div className="mt-2">
        <DrillLink atomId={atomId} label={drillLabel} />
      </div>
    </div>
  );
}
