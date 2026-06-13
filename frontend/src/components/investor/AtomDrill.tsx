"use client";

/**
 * AtomDrill — the clickable lineage from a surfaced number down to its source
 * atom. Acceptance: "every headline number drills to its source atom."
 *
 * `<DrillLink atomId=... label=...>` renders a small, clickable cite affordance.
 * Clicking opens a drawer that fetches the atom from the gated atom API
 * (GET /api/atoms/:id) and shows its reasoning, provenance edges + citations,
 * freshness/as-of, and its confidence chip WITH state (guardrail 1). This is the
 * "every number carries its provenance" surface, drilled live through the engine.
 */

import { useCallback, useEffect, useState } from "react";
import { ConfidenceChip } from "@/components/library";
import { fetchAtom, toChipState } from "./engineClient";
import type { AtomEnvelope } from "./types";

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
      </button>
      {open && <AtomDrawer atomId={atomId} onClose={() => setOpen(false)} />}
    </>
  );
}

function AtomDrawer({
  atomId,
  onClose,
}: {
  atomId: string;
  onClose: () => void;
}) {
  const [env, setEnv] = useState<AtomEnvelope | null>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );

  const load = useCallback(async () => {
    setStatus("loading");
    const result = await fetchAtom(atomId);
    if (result?.atom) {
      setEnv(result);
      setStatus("loaded");
    } else {
      setStatus("error");
    }
  }, [atomId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const atom = env?.atom;

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
            <p className="mt-1 break-all font-mono text-xs text-zinc-300">
              {atomId}
            </p>
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
          {status === "loading" && (
            <p className="text-zinc-500">Drilling to source…</p>
          )}

          {status === "error" && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-zinc-400">
              <p className="font-medium text-zinc-200">
                Source not available for this subject.
              </p>
              <p className="mt-2 text-zinc-500">
                The atom is either not found or gated out for this access key.
                The gate is honest: a gated-out atom is indistinguishable from
                not-found, so no tenant-private data leaks.
              </p>
              <button
                type="button"
                onClick={() => void load()}
                className="mt-3 rounded-md border border-zinc-700 px-2.5 py-1 text-xs text-zinc-300 transition hover:border-zinc-500"
              >
                Retry
              </button>
            </div>
          )}

          {status === "loaded" && atom && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-zinc-400">
                  {atom.entityType}
                </span>
                <ConfidenceChip
                  state={toChipState(atom.confidence.state)}
                  value={atom.confidence.value}
                  verification="verified"
                  title={atom.confidence.note}
                />
              </div>

              {atom.confidence.note && (
                <p className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 text-xs leading-relaxed text-zinc-400">
                  {atom.confidence.note}
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
                      <li
                        key={i}
                        className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-zinc-400">
                            {p.role}
                          </span>
                          {p.tool && (
                            <span className="font-mono text-[10px] text-zinc-500">
                              {p.tool}
                            </span>
                          )}
                        </div>
                        {p.citation && (
                          <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">
                            {p.citation}
                          </p>
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
                        <dd className="font-mono text-zinc-300">
                          {String(v)}
                        </dd>
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
