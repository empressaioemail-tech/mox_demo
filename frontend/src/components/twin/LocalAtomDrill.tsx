"use client";

/**
 * LocalAtomDrill — the provenance affordance for the twin. STATIC: it drills
 * into the atom bundled at build time (ATOMS_BY_ID), so it works on Vercel with
 * no backend. This is the "provenance on every fact" surface (hard guardrail):
 * any fact in the twin renders a <DrillLink> that opens this drawer showing the
 * atom's reasoning, provenance edges + citations, freshness, and its
 * ConfidenceChip WITH state (guardrail 1).
 */

import { useEffect, useState } from "react";
import { ConfidenceChip } from "@/components/library";
import { ATOMS_BY_ID, toChipState } from "./atoms";

export function DrillLink({
  atomId,
  label,
  className,
}: {
  atomId: string;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const known = Boolean(ATOMS_BY_ID[atomId]);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={`Drill to source atom: ${atomId}`}
        className={[
          "inline-flex items-center gap-1 rounded border border-zinc-700 bg-zinc-900/70 px-1.5 py-0.5",
          "font-mono text-[10px] uppercase tracking-wide text-zinc-400",
          "transition hover:border-sky-700 hover:text-sky-300",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" />
        </svg>
        {label ?? "lineage"}
        {!known && <span className="opacity-60">·n/a</span>}
      </button>
      {open && <AtomDrawer atomId={atomId} onClose={() => setOpen(false)} />}
    </>
  );
}

function AtomDrawer({ atomId, onClose }: { atomId: string; onClose: () => void }) {
  const atom = ATOMS_BY_ID[atomId];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Source atom lineage"
    >
      <button
        type="button"
        aria-label="Close lineage"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="relative flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-zinc-800 bg-zinc-950/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Source atom · lineage
            </p>
            <p className="mt-1 break-all font-mono text-xs text-zinc-300">{atomId}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-100"
          >
            Close
          </button>
        </div>

        <div className="flex-1 space-y-5 px-5 py-5 text-sm">
          {!atom && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-zinc-400">
              <p className="font-medium text-zinc-200">Source not bundled for this subject.</p>
              <p className="mt-2 text-zinc-500">
                This twin ships a curated public-free atom set. Atoms outside that set
                (e.g. tenant-private detail) are resolved through the gated engine when
                wired, not bundled into the static deploy.
              </p>
            </div>
          )}

          {atom && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-zinc-400">
                  {atom.entityType}
                </span>
                <ConfidenceChip
                  state={toChipState(atom.confidence.state)}
                  value={atom.confidence.value}
                  verification="verified"
                  title={atom.confidence.stateNote}
                />
                {atom.accessPolicy && (
                  <span className="rounded border border-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
                    {atom.accessPolicy}
                  </span>
                )}
              </div>

              {(atom.provisional || atom.seeded) && (
                <p className="rounded-lg border border-amber-900/50 bg-amber-950/30 p-3 text-xs leading-relaxed text-amber-200/90">
                  {atom.provisional
                    ? `Provisional: ${atom.provisionalReason ?? "geometry/spatial refs backfill from APS Model Derivative (Part A)."}`
                    : `Seeded: ${atom.seededNote ?? "representative seed values, not actuals."}`}
                </p>
              )}

              {atom.confidence.stateNote && (
                <p className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 text-xs leading-relaxed text-zinc-400">
                  {atom.confidence.stateNote}
                </p>
              )}

              {atom.reasoning && (
                <section>
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    Reasoning
                  </h3>
                  <p className="mt-1.5 whitespace-pre-wrap leading-relaxed text-zinc-300">
                    {atom.reasoning}
                  </p>
                </section>
              )}

              {atom.provenance && atom.provenance.length > 0 && (
                <section>
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    Provenance · sources
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {atom.provenance.map((p, i) => (
                      <li key={i} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-zinc-400">
                            {p.role}
                          </span>
                          {p.tool && (
                            <span className="font-mono text-[10px] text-zinc-500">{p.tool}</span>
                          )}
                          {p.status && (
                            <span className="font-mono text-[10px] text-amber-300/80">{p.status}</span>
                          )}
                        </div>
                        {p.citation && (
                          <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">{p.citation}</p>
                        )}
                        {p.note && (
                          <p className="mt-1 text-xs leading-relaxed text-zinc-500">{p.note}</p>
                        )}
                        {p.derivedFromAtom && (
                          <p className="mt-1 break-all font-mono text-[10px] text-zinc-500">
                            derived from {p.derivedFromAtom}
                          </p>
                        )}
                        {p.url && (
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-block break-all font-mono text-[10px] text-sky-400 hover:text-sky-300"
                          >
                            {p.url}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {atom.freshness && (
                <section>
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    Freshness
                  </h3>
                  <dl className="mt-1.5 grid grid-cols-2 gap-1 text-xs text-zinc-400">
                    {Object.entries(atom.freshness).map(([k, v]) => (
                      <div key={k} className="flex gap-1.5">
                        <dt className="text-zinc-500">{k}:</dt>
                        <dd className="font-mono text-zinc-300">{String(v)}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
