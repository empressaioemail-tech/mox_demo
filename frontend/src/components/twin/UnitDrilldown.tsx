"use client";

/**
 * UnitDrilldown — the unit/room drill-down view. Selecting a room loads that
 * room's floor plan + interior elevation(s) ALONGSIDE the composed twin atom
 * panel: the spatial unit metadata (from the unit atom), the seeded operating
 * layer (operating atom), and the ground-truth layer (parcel/zoning/code). Every
 * fact carries a ConfidenceChip (guardrail 1) and a DrillLink (provenance).
 *
 * THE "MAGICAL" REVEAL: selecting a room replays an AssemblingSequence keyed on
 * the room (+ unit). The room plan reveals first, then the interior elevation,
 * then the composed atom panel — staggered and intentional, not all at once.
 * Respects prefers-reduced-motion (collapses to instant).
 *
 * RBAC: the seeded operating layer is tenant-private — wrapped in
 * <RoleGate resource="operating-internals" redact> so switching to the external
 * LP role visibly redacts it. twin-spatial + ground-truth stay visible to the LP.
 *
 * Room names come straight from the unit atoms (Bed 1, Bed 2, MSTR, Kitchen,
 * Living, Baths). 1BR omits Bed 1 / Bed 2; the room grid reflects the atom.
 */

import { useState } from "react";
import { ConfidenceChip } from "@/components/library";
import { AdaptiveReveal } from "@/components/adaptive";
import { RoleGate } from "@/components/rbac";
import { DrillLink } from "./LocalAtomDrill";
import { OperatingLayer } from "./OperatingLayer";
import { GroundTruthLayer } from "./GroundTruthLayer";
import { ROOM_IMAGES } from "./assets";
import { unit2br, unit1br, toChipState, type TwinAtom } from "./atoms";

interface Room {
  name: string;
  role: string;
}

function unitRooms(atom: TwinAtom): Room[] {
  return (atom.payload as { rooms: Room[] }).rooms;
}

export function UnitDrilldown() {
  const units: Array<{ atom: TwinAtom; label: string }> = [
    { atom: unit2br, label: "Typical 2BR" },
    { atom: unit1br, label: "Typical 1BR" },
  ];
  const [unitIdx, setUnitIdx] = useState(0);
  const unit = units[unitIdx].atom;
  const rooms = unitRooms(unit);

  const [roomName, setRoomName] = useState<string>(rooms[0]?.name ?? "Living");
  // Guard: if switching to 1BR while on Bed 1/2, fall back to the first room.
  const activeRoom = rooms.find((r) => r.name === roomName) ?? rooms[0];
  const roomKey = activeRoom?.name ?? "Living";
  const imagery = ROOM_IMAGES[roomKey] ?? { plan: undefined, elevations: [] };
  const unitPayload = unit.payload as { name: string; unitType: string };

  // Re-keys the staggered reveal so it replays each time the room (or unit)
  // changes — the room's plan, then its elevation, then the composed panel.
  const replayKey = `${unit.atomId}:${roomKey}`;

  // Each block reveals on its own beat; index drives the stagger delay.
  let beat = 0;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Unit drill-down · composed twin
          </p>
          <h2 className="mt-1 text-lg font-semibold text-zinc-100">
            Walk a unit, room by room
          </h2>
        </div>
        {/* Unit type toggle */}
        <div className="flex gap-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-1">
          {units.map((u, i) => (
            <button
              key={u.atom.atomId}
              type="button"
              onClick={() => {
                setUnitIdx(i);
                const next = unitRooms(u.atom);
                if (!next.some((r) => r.name === roomName)) setRoomName(next[0].name);
              }}
              className={[
                "rounded-md px-3 py-1 text-xs font-medium transition",
                i === unitIdx
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-100",
              ].join(" ")}
            >
              {u.label}
            </button>
          ))}
        </div>
      </div>

      {/* Room selector — names from the unit atom */}
      <div className="flex flex-wrap gap-2">
        {rooms.map((r) => (
          <button
            key={r.name}
            type="button"
            onClick={() => setRoomName(r.name)}
            className={[
              "rounded-full border px-3 py-1 text-xs font-medium transition",
              r.name === roomKey
                ? "border-sky-600 bg-sky-950/50 text-sky-100"
                : "border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200",
            ].join(" ")}
          >
            {r.name}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* LEFT: the room's plan + interior elevation imagery */}
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                {unitPayload.unitType} · {roomKey} · plan + interior elevation
              </p>
              <DrillLink atomId={unit.atomId} label="unit atom" />
            </div>

            {/* Beat 1 — the room plan reveals first */}
            {imagery.plan && (
              <AdaptiveReveal key={`${replayKey}-plan`} index={beat++} step={0.14} variant="rise">
                <figure className="mt-3">
                  <div className="overflow-hidden rounded-lg border border-zinc-800 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagery.plan.src}
                      alt={imagery.plan.alt}
                      className="aspect-[4/3] w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="mt-1.5 text-xs text-zinc-400">
                    {imagery.plan.caption}
                  </figcaption>
                </figure>
              </AdaptiveReveal>
            )}

            {/* Beat 2 — the interior elevation(s) follow */}
            {imagery.elevations.map((el) => (
              <AdaptiveReveal key={`${replayKey}-${el.src}`} index={beat++} step={0.14} variant="rise">
                <figure className="mt-3">
                  <div className="overflow-hidden rounded-lg border border-zinc-800 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={el.src}
                      alt={el.alt}
                      className="aspect-[4/3] w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="mt-1.5 text-xs text-zinc-400">{el.caption}</figcaption>
                </figure>
              </AdaptiveReveal>
            ))}

            <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">
              Plan + interior elevation are curated, optimized exports from the
              operator&apos;s Revit model (5&nbsp;Story&nbsp;Apartment.rvt). The full
              model and the ~133-image elevation set remain private and uncommitted.
            </p>
          </div>

          {/* Beat 3 — spatial unit metadata (from the unit atom) */}
          <AdaptiveReveal key={`${replayKey}-meta`} index={beat++} step={0.14} variant="rise">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  Spatial unit metadata
                </p>
                <ConfidenceChip
                  state={toChipState(unit.confidence.state)}
                  value={unit.confidence.value}
                  title={unit.confidence.stateNote}
                />
              </div>
              <p className="mt-2 text-sm font-medium text-zinc-100">{unitPayload.name}</p>
              <p className="text-xs text-zinc-500">{unitPayload.unitType}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {rooms.map((r) => (
                  <li
                    key={r.name}
                    className={[
                      "rounded border px-2 py-0.5 text-[11px]",
                      r.name === roomKey
                        ? "border-sky-700 bg-sky-950/40 text-sky-100"
                        : "border-zinc-800 bg-zinc-950/60 text-zinc-300",
                    ].join(" ")}
                  >
                    {r.name}
                    <span className="ml-1 text-zinc-600">· {r.role}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] leading-relaxed text-amber-300/80">
                Provisional: room boundaries, areas, and per-room spatial refs
                backfill from the APS Model Derivative (WS-1 Part A). Room inventory
                is documented from the floor-plan set.
              </p>
            </div>
          </AdaptiveReveal>
        </div>

        {/* RIGHT: the composed layers (operating + ground truth) */}
        <div className="space-y-4">
          {/* Beat 4 — the operating layer (tenant-private; redacts for the LP) */}
          <AdaptiveReveal key={`${replayKey}-operating`} index={beat++} step={0.14} variant="rise">
            <RoleGate
              resource="operating-internals"
              redact
              redactLabel="Operating layer (tenant-private)"
            >
              <OperatingLayer />
            </RoleGate>
          </AdaptiveReveal>

          {/* Beat 5 — the ground-truth layer (visible to the LP too) */}
          <AdaptiveReveal key={`${replayKey}-ground`} index={beat++} step={0.14} variant="rise">
            <GroundTruthLayer />
          </AdaptiveReveal>
        </div>
      </div>
    </section>
  );
}
