"use client";

import Link from "next/link";
import { AssemblingSequence } from "@/components/adaptive";
import { CONTEXT_SURFACES } from "./surfaces";

/**
 * The context-index card grid, revealed adaptively (client). Split out of the
 * server index page so that page can keep exporting Next metadata while the
 * cards still animate in. Each card carries its Mox arm/persona framing so the
 * gallery reads as one operating system across the business.
 */
export function ContextIndexCards() {
  return (
    <AssemblingSequence
      variant="rise"
      base={0.05}
      step={0.08}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {CONTEXT_SURFACES.map((s, i) => (
        <Link
          key={s.slug}
          href={`/context/${s.slug}`}
          className="group flex h-full flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-600 hover:bg-zinc-900"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs text-zinc-500">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="rounded-full border border-zinc-700/80 bg-zinc-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
              {s.framing.arm}
            </span>
          </div>
          <h2 className="text-lg font-semibold text-zinc-100 group-hover:text-white">
            {s.name}
          </h2>
          <p className="text-sm text-zinc-400">{s.blurb}</p>
          <p className="text-xs leading-relaxed text-zinc-500">
            {s.framing.note}
          </p>
          <span className="mt-auto pt-3 text-sm font-medium text-zinc-500 transition group-hover:text-zinc-300">
            Open surface →
          </span>
        </Link>
      ))}
    </AssemblingSequence>
  );
}

export default ContextIndexCards;
