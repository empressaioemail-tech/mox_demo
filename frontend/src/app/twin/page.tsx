import { ContentContainer } from "@/components/shell";
import { TwinClient } from "@/components/twin/TwinClient";

export const metadata = {
  title: "Spatial twin — Mox demo",
  description:
    "The spatial twin of the proposed Nelray building: a rendered 3D model, real assets, composed atoms, ground truth above it.",
};

export default function TwinPage() {
  return (
    <ContentContainer width="full">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
          Spatial twin · BLDR by Mox
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">
          607–611 Nelray Blvd · proposed 5-story building
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-zinc-400">
          The digital twin, made walkable. A rendered 3D model of the proposed
          building leads, composed with the operator&apos;s real Revit assets
          (renderings, elevations, plans), the unit atoms, the seeded operating
          layer, and the ground-truth layer above it — every fact carrying its
          provenance and confidence state. The build-arm headline: the system
          caught a 5-story design on MF-3 land before submission, flagging the
          MF-4 rezoning path and the months of carrying cost it avoids. The 3D
          face is a rendering of the proposed design, not live tenant data; the
          data is representative, while the engine and the substrate-derived
          ground truth are real.
        </p>
      </header>

      <div className="mt-8">
        <TwinClient />
      </div>
    </ContentContainer>
  );
}
