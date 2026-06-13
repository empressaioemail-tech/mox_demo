import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContextFrame } from "@/components/context/ContextFrame";
import { CONTEXT_SURFACES, getSurface } from "@/components/context/surfaces";

type Params = { slug: string };

// Pre-render all six context surfaces as static routes.
export function generateStaticParams(): Params[] {
  return CONTEXT_SURFACES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const surface = getSurface(slug);
  if (!surface) return { title: "Context surface — Mox" };
  return {
    title: `${surface.name} — Mox context`,
    description: surface.blurb,
  };
}

export default async function ContextSurfacePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const surface = getSurface(slug);
  if (!surface) notFound();
  return <ContextFrame surface={surface} />;
}
