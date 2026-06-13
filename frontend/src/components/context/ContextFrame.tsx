import Link from "next/link";
import { CONTEXT_SURFACES, type ContextSurface } from "./surfaces";

/**
 * WS-6 — renders a single context surface (one of the six polished mockups)
 * inside an iframe, wrapped in a thin chrome that keeps the demo reading as one
 * OS. The chrome matches the dark hero style; the mockup itself is untouched
 * except for an injected "Representative data" guardrail banner.
 */
export function ContextFrame({ surface }: { surface: ContextSurface }) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <header className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-zinc-800 bg-zinc-950/80 px-6 py-3 backdrop-blur">
        <Link
          href="/context"
          className="text-sm font-medium text-zinc-400 transition hover:text-zinc-100"
        >
          ← Context surfaces
        </Link>

        <nav className="flex flex-wrap items-center gap-1">
          {CONTEXT_SURFACES.map((s) => {
            const active = s.slug === surface.slug;
            return (
              <Link
                key={s.slug}
                href={`/context/${s.slug}`}
                aria-current={active ? "page" : undefined}
                className={
                  "rounded-md px-2.5 py-1 text-xs font-medium transition " +
                  (active
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100")
                }
              >
                {s.name}
              </Link>
            );
          })}
        </nav>

        <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 shadow-[0_0_0_3px_rgba(161,161,170,0.18)]" />
          Representative data · context surface
        </span>
      </header>

      <iframe
        src={surface.file}
        title={`${surface.name} — Mox context surface`}
        className="min-h-0 w-full flex-1 border-0 bg-zinc-950"
      />
    </div>
  );
}
