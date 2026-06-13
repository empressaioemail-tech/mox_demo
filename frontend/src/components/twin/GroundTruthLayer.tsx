"use client";

/**
 * GroundTruthLayer — the composed parcel / zoning / code / flood layer that sits
 * ABOVE the spatial twin. Every fact carries a ConfidenceChip (guardrail 1) and
 * a DrillLink to its source atom (provenance on every fact). This is the half of
 * the stack no operator or off-the-shelf tool has, made visible.
 *
 * Shared by the building view and the unit drill-down (the ground truth is the
 * same site regardless of which room you're standing in).
 */

import { ConfidenceChip } from "@/components/library";
import { DrillLink } from "./LocalAtomDrill";
import {
  zoningMf3,
  code562,
  code491,
  flood,
  parcel226623,
  parcel607,
  parcel609,
  toChipState,
  type TwinAtom,
} from "./atoms";

function Fact({
  label,
  value,
  atom,
  drillLabel,
}: {
  label: string;
  value: React.ReactNode;
  atom: TwinAtom;
  drillLabel: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-zinc-800/70 py-2 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</p>
        <p className="mt-0.5 text-sm text-zinc-200">{value}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <ConfidenceChip
          state={toChipState(atom.confidence.state)}
          value={atom.confidence.value}
          title={atom.confidence.stateNote}
        />
        <DrillLink atomId={atom.atomId} label={drillLabel} />
      </div>
    </div>
  );
}

export function GroundTruthLayer() {
  const zp = zoningMf3.payload as {
    districtCode: string;
    districtName: string;
    standards: { maxHeightFt: number; maxDensityUnitsPerAcre: number; maxFloorToAreaRatio: string; maxImperviousCoverPct: number };
    derivedSiteCapacity: { siteAcres: number; maxUnitsByDensityBeforeBonuses: number };
  };
  const c491 = code491.payload as { mf3DimensionalStandards: { maxBuildingCoveragePct: number; setbacksFt: Record<string, number> } };
  const fl = flood.payload as { femaFloodZone: string; inSpecialFloodHazardArea: boolean };

  const parcels: Array<{ atom: TwinAtom; label: string }> = [
    { atom: parcel226623, label: "parcel 611" },
    { atom: parcel607, label: "parcel 607" },
    { atom: parcel609, label: "parcel 609" },
  ];

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Ground-truth layer · above the twin
          </p>
          <h3 className="mt-1 text-base font-semibold text-zinc-100">
            Parcel · zoning · code · flood
          </h3>
        </div>
        <p className="text-[11px] text-zinc-500">
          Substrate-derived. Every fact drills to its atom.
        </p>
      </div>

      {/* Parcels — the three-lot assemblage */}
      <div className="mt-4">
        <p className="text-[11px] uppercase tracking-wide text-zinc-500">
          Site assemblage · three contiguous MF-3 lots
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {parcels.map(({ atom, label }) => {
            const p = atom.payload as { situsAddress: string; currentUse: string; zoningDistrict: string };
            return (
              <div key={atom.atomId} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                <p className="text-sm font-medium text-zinc-200">{p.situsAddress}</p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {p.zoningDistrict} · {p.currentUse}
                </p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <ConfidenceChip
                    state={toChipState(atom.confidence.state)}
                    value={atom.confidence.value}
                    title={atom.confidence.stateNote}
                  />
                  <DrillLink atomId={atom.atomId} label={label} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zoning + code dimensional facts */}
      <div className="mt-5">
        <Fact
          label={`Zoning · ${zp.districtCode}`}
          value={`${zp.districtName}`}
          atom={zoningMf3}
          drillLabel="zoning"
        />
        <Fact
          label="Max height (MF-3) · §25-2-562"
          value={`${zp.standards.maxHeightFt} ft (≈3 stories)`}
          atom={code562}
          drillLabel="§25-2-562"
        />
        <Fact
          label="Max density (MF-3) · §25-2-562"
          value={`${zp.standards.maxDensityUnitsPerAcre} units/acre · ~${zp.derivedSiteCapacity.maxUnitsByDensityBeforeBonuses} units on ${zp.derivedSiteCapacity.siteAcres} ac`}
          atom={code562}
          drillLabel="§25-2-562"
        />
        <Fact
          label="Site dimensional standards · §25-2-491"
          value={`FAR ${zp.standards.maxFloorToAreaRatio} · coverage ${c491.mf3DimensionalStandards.maxBuildingCoveragePct}% · impervious ${zp.standards.maxImperviousCoverPct}% · setbacks ${c491.mf3DimensionalStandards.setbacksFt.frontStreetYard}/${c491.mf3DimensionalStandards.setbacksFt.interiorSideYard}/${c491.mf3DimensionalStandards.setbacksFt.rearYard} ft`}
          atom={code491}
          drillLabel="§25-2-491"
        />
        <Fact
          label="FEMA flood zone"
          value={`Zone ${fl.femaFloodZone} · ${fl.inSpecialFloodHazardArea ? "in SFHA" : "minimal hazard, outside SFHA"}`}
          atom={flood}
          drillLabel="flood"
        />
      </div>
    </section>
  );
}
