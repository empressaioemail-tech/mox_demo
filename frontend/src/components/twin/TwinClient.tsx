"use client";

/**
 * TwinClient — the /twin orchestrator. Two views: the BUILDING view (the
 * spatial face + APS drop-in slot + composed ground truth + the entitlement
 * finding) and the UNIT drill-down (room imagery alongside the composed twin
 * atom panel). Fully static — renders from the bundled atoms, no backend
 * required (Vercel-safe). The engine is progressive enhancement only.
 */

import { useState } from "react";
import { BuildingView } from "./BuildingView";
import { UnitDrilldown } from "./UnitDrilldown";

type View = "building" | "unit";

export function TwinClient() {
  const [view, setView] = useState<View>("building");

  return (
    <div className="space-y-6">
      <div className="flex gap-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-1">
        <button
          type="button"
          onClick={() => setView("building")}
          className={[
            "flex-1 rounded-md px-3 py-2 text-sm font-medium transition",
            view === "building" ? "bg-zinc-100 text-zinc-900" : "text-zinc-400 hover:text-zinc-100",
          ].join(" ")}
        >
          Building view
        </button>
        <button
          type="button"
          onClick={() => setView("unit")}
          className={[
            "flex-1 rounded-md px-3 py-2 text-sm font-medium transition",
            view === "unit" ? "bg-zinc-100 text-zinc-900" : "text-zinc-400 hover:text-zinc-100",
          ].join(" ")}
        >
          Unit drill-down
        </button>
      </div>

      {view === "building" ? (
        <BuildingView onOpenUnit={() => setView("unit")} />
      ) : (
        <UnitDrilldown />
      )}
    </div>
  );
}
