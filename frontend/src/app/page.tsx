import Link from "next/link";
import { ApsViewerSlot } from "@/components/aps/ApsViewerSlot";
import { CONTEXT_SURFACES } from "@/components/context/surfaces";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16">
        <header className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
            Mox demo
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Adaptive surface scaffold
          </h1>
          <p className="text-zinc-400">
            607–611 Nelray Blvd, Austin TX — WS-0 foundation. The engine is
            real; fixtures and hero surfaces land in WS-1 onward.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-zinc-300">Spatial twin</h2>
          <ApsViewerSlot />
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium text-zinc-300">
              Context surfaces
            </h2>
            <Link
              href="/context"
              className="text-sm font-medium text-zinc-400 transition hover:text-zinc-100"
            >
              View all →
            </Link>
          </div>
          <p className="text-sm text-zinc-500">
            The six Mox surfaces as navigable context, so the demo reads as one
            operating system. Secondary to the hero surfaces; numbers are
            representative.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CONTEXT_SURFACES.map((s) => (
              <Link
                key={s.slug}
                href={`/context/${s.slug}`}
                className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-100"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-400">
          <p>
            Component library:{" "}
            <code className="text-zinc-300">src/components/library/</code>
          </p>
          <p className="mt-2">
            Backend health:{" "}
            <code className="text-zinc-300">
              {process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8787"}
              /health
            </code>
          </p>
        </section>
      </main>
    </div>
  );
}
