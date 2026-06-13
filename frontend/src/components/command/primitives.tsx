/**
 * Shared primitives for the command renderers: the card shell, the provenance
 * list, and small atoms. Dark zinc palette matching the rest of the demo.
 */

import type { ReactNode } from "react";
import type { ProvenanceRef } from "@/lib/engine";

/** The card shell every rendered component sits in. */
export function ComponentCard({
  kind,
  title,
  rationale,
  headerRight,
  children,
}: {
  kind: string;
  title: string;
  rationale?: string;
  headerRight?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
      <header className="flex items-start justify-between gap-3 border-b border-zinc-800 bg-zinc-900/70 px-4 py-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            {kind}
          </p>
          <h3 className="truncate text-sm font-semibold text-zinc-100">
            {title}
          </h3>
          {rationale && (
            <p className="mt-0.5 text-xs italic text-zinc-500">{rationale}</p>
          )}
        </div>
        {headerRight && <div className="shrink-0">{headerRight}</div>}
      </header>
      <div className="px-4 py-4">{children}</div>
    </section>
  );
}

/** A drillable provenance list — the "every number carries its source" surface. */
export function ProvenanceList({
  provenance,
  label = "Provenance",
}: {
  provenance: ProvenanceRef[];
  label?: string;
}) {
  if (!provenance || provenance.length === 0) return null;
  // De-dupe identical refs (the engine flattens composed atoms).
  const seen = new Set<string>();
  const rows = provenance.filter((p) => {
    const k = `${p.role}|${p.tool}|${p.citation}|${p.url}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return (
    <details className="group mt-3 rounded-lg border border-zinc-800 bg-zinc-950/40">
      <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200">
        <span>
          {label} · {rows.length} source{rows.length === 1 ? "" : "s"}
        </span>
        <span className="text-zinc-600 transition group-open:rotate-180">▾</span>
      </summary>
      <ul className="space-y-2 border-t border-zinc-800 px-3 py-2">
        {rows.map((p, i) => (
          <li key={i} className="text-xs leading-relaxed text-zinc-400">
            <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">
              {p.role}
            </span>
            {p.tool && <span className="text-zinc-500"> · {p.tool}</span>}
            {p.citation && (
              <p className="mt-0.5 text-zinc-300">{p.citation}</p>
            )}
            {p.url && (
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="mt-0.5 inline-block break-all text-sky-400 hover:text-sky-300"
              >
                {p.url}
              </a>
            )}
            {p.derivedFromAtom && (
              <p className="mt-0.5 font-mono text-[10px] text-zinc-600">
                ↳ {p.derivedFromAtom}
              </p>
            )}
          </li>
        ))}
      </ul>
    </details>
  );
}

/** A small severity pill (blocker / warning). */
export function SeverityPill({ severity }: { severity?: string }) {
  if (!severity) return null;
  const isBlocker = severity === "blocker";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        isBlocker
          ? "border-red-900/70 bg-red-950/40 text-red-300"
          : "border-amber-900/70 bg-amber-950/40 text-amber-300",
      ].join(" ")}
    >
      {severity}
    </span>
  );
}

/** A labelled metric value (used by KPI + variance). */
export function MetricTile({
  label,
  value,
  unit,
  note,
}: {
  label: string;
  value: number | null;
  unit?: string;
  note?: string;
}) {
  const measurable = value !== null && value !== undefined;
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2.5">
      <p className="text-[11px] text-zinc-500">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-zinc-100">
        {measurable ? (
          <>
            {value}
            {unit && (
              <span className="ml-1 text-xs font-normal text-zinc-500">
                {unit}
              </span>
            )}
          </>
        ) : (
          <span className="text-sm font-normal text-zinc-500">
            not yet measurable
          </span>
        )}
      </p>
      {note && <p className="mt-1 text-[11px] leading-snug text-zinc-600">{note}</p>}
    </div>
  );
}

/** A read-only field row (key/value). */
export function Field({ label, value }: { label: string; value: ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-zinc-500">{label}</span>
      <span className="text-right text-zinc-200">{value}</span>
    </div>
  );
}
