import Link from "next/link";
import { NarrativeFrame } from "@/components/library";
import { CONTEXT_SURFACES } from "@/components/context/surfaces";

const HERO_SURFACES = [
  {
    href: "/yardi",
    name: "Intelligence layer on Yardi",
    blurb:
      "The opening beat. An overlay that rides on top of Yardi — read, assist, capture to your core. No rip-and-replace.",
  },
  {
    href: "/command",
    name: "Adaptive command",
    blurb:
      "The intent bar plus the assembler. Type intent; the engine selects, orders, and populates components live, each carrying its provenance and confidence state.",
  },
  {
    href: "/twin",
    name: "Spatial twin",
    blurb:
      "The APS viewer on the proposed 5-story building, composed with the unit atoms and the ground-truth layer above it.",
  },
  {
    href: "/investor",
    name: "Investor / data room",
    blurb:
      "The apex. A generated, cited LP artifact — every number drills to its source atom, the MF-3 entitlement finding vetted before a dollar is raised.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16">
        <header className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
            Mox demo
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            607–611 Nelray Blvd, Austin TX
          </h1>
          <p className="text-zinc-400">
            A single adaptive surface, seeded from a real Revit model of a real
            Austin redevelopment, running a real engine on representative data.
          </p>
        </header>

        <NarrativeFrame variant="open" />

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-zinc-300">Hero surfaces</h2>
          <p className="text-sm text-zinc-500">
            Live, real engine, on the Nelray model. The demo runs the arc:
            Yardi → spatial twin → adaptive command → investor room.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {HERO_SURFACES.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition hover:border-zinc-600 hover:bg-zinc-900"
              >
                <p className="text-sm font-medium text-zinc-100 group-hover:text-white">
                  {s.name}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  {s.blurb}
                </p>
              </Link>
            ))}
          </div>
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
            representative, not yet calibrated on Mox outcomes.
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
            Backend engine:{" "}
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
