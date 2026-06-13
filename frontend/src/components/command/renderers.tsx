"use client";

/**
 * Component renderers — one per engine componentKind. The engine returns
 * ordered, populated components; this maps each to a real React component that
 * renders the bound data, its confidence chip (WITH state, guardrail 1), and a
 * drillable provenance list. Surfaced actionable items carry the deposit loop.
 *
 * Each renderer is a pure projection of the component's `data` payload (see
 * backend/src/engine/catalog.ts for the shapes). Unknown kinds fall back to a
 * raw JSON view so the surface never silently drops a component.
 */

import type { AssembledComponent, CalibrationSummary } from "@/lib/engine";
import {
  ConfidenceChipRow,
  LeadConfidenceChip,
} from "./confidence";
import { DepositLoop } from "./DepositLoop";
import {
  ComponentCard,
  Field,
  MetricTile,
  ProvenanceList,
  SeverityPill,
} from "./primitives";

type RendererProps = {
  component: AssembledComponent;
  /** Called when a deposit-loop action records, so the surface re-runs. */
  onCalibrated?: (atomId: string, reflection: CalibrationSummary) => void;
};

function rec(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}
function arr(v: unknown): Record<string, unknown>[] {
  return Array.isArray(v) ? (v as Record<string, unknown>[]) : [];
}
function str(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

/** Look up the reflection for a specific bound atom. */
function summaryFor(
  component: AssembledComponent,
  atomId: string,
): CalibrationSummary | undefined {
  return component.calibration.find((c) => c.atomId === atomId);
}

// ---- kpi-card --------------------------------------------------------------

function KpiCard({ component }: RendererProps) {
  const d = component.data;
  const metrics = arr(d.metrics);
  return (
    <ComponentCard
      kind="kpi-card"
      title={component.title}
      rationale={component.rationale}
      headerRight={<LeadConfidenceChip confidence={component.confidence} />}
    >
      {str(d.basis) && (
        <p className="mb-3 text-xs text-zinc-500">Basis: {str(d.basis)}</p>
      )}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {metrics.map((m, i) => (
          <MetricTile
            key={i}
            label={String(m.label ?? m.key)}
            value={(m.value as number | null) ?? null}
            unit={str(m.unit)}
            note={str(m.note)}
          />
        ))}
      </div>
      {str(d.underwriteConfidenceLabel) && (
        <p className="mt-3 text-[11px] italic text-zinc-500">
          {str(d.underwriteConfidenceLabel)}
        </p>
      )}
      <ProvenanceList provenance={component.provenance} />
    </ComponentCard>
  );
}

// ---- variance-anomaly-card -------------------------------------------------

function VarianceAnomalyCard({ component }: RendererProps) {
  const d = component.data;
  const anomalies = arr(d.anomalies);
  return (
    <ComponentCard
      kind="variance-anomaly-card"
      title={component.title}
      rationale={component.rationale}
      headerRight={<LeadConfidenceChip confidence={component.confidence} />}
    >
      {str(d.basis) && (
        <p className="mb-3 text-xs text-zinc-500">Basis: {str(d.basis)}</p>
      )}
      {anomalies.length === 0 ? (
        <p className="text-sm text-zinc-400">No variances flagged.</p>
      ) : (
        <ul className="space-y-2">
          {anomalies.map((m, i) => (
            <li
              key={i}
              className="rounded-lg border border-amber-900/50 bg-amber-950/20 px-3 py-2"
            >
              <p className="text-sm font-medium text-amber-200">
                {String(m.label ?? m.key)}
              </p>
              <p className="mt-0.5 text-xs text-zinc-400">
                {str(m.note) ??
                  (m.value === null
                    ? "Not yet measurable."
                    : `Value: ${String(m.value)}${str(m.unit) ?? ""}`)}
              </p>
            </li>
          ))}
        </ul>
      )}
      <ProvenanceList provenance={component.provenance} />
    </ComponentCard>
  );
}

// ---- provenance-drill ------------------------------------------------------

function ProvenanceDrill({ component }: RendererProps) {
  const d = component.data;
  const freshness = rec(d.freshness);
  return (
    <ComponentCard
      kind="provenance-drill"
      title={component.title}
      rationale={component.rationale}
      headerRight={<LeadConfidenceChip confidence={component.confidence} />}
    >
      <Field label="Atom" value={<span className="font-mono text-[11px]">{str(d.atomId)}</span>} />
      <Field label="Entity type" value={str(d.entityType)} />
      {str(freshness.asOf) && <Field label="As of" value={str(freshness.asOf)} />}
      {str(d.reasoning) && (
        <div className="mt-2 rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Reasoning
          </p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-300">
            {str(d.reasoning)}
          </p>
        </div>
      )}
      <ProvenanceList provenance={component.provenance} label="Source edges" />
    </ComponentCard>
  );
}

// ---- action-inbox ----------------------------------------------------------

function ActionInbox({ component, onCalibrated }: RendererProps) {
  const d = component.data;
  const items = arr(d.items);
  return (
    <ComponentCard
      kind="action-inbox"
      title={component.title}
      rationale={component.rationale}
      headerRight={
        <div className="flex items-center gap-2">
          <SeverityPill severity={str(d.severity)} />
          <LeadConfidenceChip confidence={component.confidence} />
        </div>
      }
    >
      {str(d.headline) && (
        <p className="mb-3 text-sm text-zinc-200">{str(d.headline)}</p>
      )}
      <ul className="space-y-3">
        {items.map((item, i) => {
          const itemId = str(item.itemId);
          // The deposit loop records against the finding atom (the first bound
          // atom), keyed by itemId for sub-items (resolution paths).
          const atomId = component.boundAtomIds[0];
          return (
            <li
              key={i}
              className="rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">
                    {str(item.kind)}
                  </span>
                  <p className="mt-0.5 text-sm text-zinc-200">
                    {str(item.headline) ?? itemId}
                  </p>
                </div>
              </div>
              {atomId && (
                <div className="mt-2">
                  <DepositLoop
                    atomId={atomId}
                    itemId={itemId !== atomId ? itemId : undefined}
                    summary={summaryFor(component, atomId)}
                    onRecorded={(r) => onCalibrated?.(atomId, r)}
                    compact
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <ProvenanceList provenance={component.provenance} />
    </ComponentCard>
  );
}

// ---- plan-review-findings --------------------------------------------------

function PlanReviewFindings({ component, onCalibrated }: RendererProps) {
  const d = component.data;
  const violated = rec(d.violatedStandard);
  const paths = arr(d.resolutionPaths);
  const citations = arr(d.citations);
  const findingAtom = component.boundAtomIds[0];
  return (
    <ComponentCard
      kind="plan-review-findings"
      title={component.title}
      rationale={component.rationale}
      headerRight={
        <div className="flex items-center gap-2">
          <SeverityPill severity={str(d.severity)} />
        </div>
      }
    >
      <p className="text-sm font-semibold text-zinc-100">{str(d.headline)}</p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{str(d.text)}</p>

      {Boolean(violated.standard) && (
        <div className="mt-3 rounded-lg border border-red-900/40 bg-red-950/20 px-3 py-2 text-xs">
          <p className="text-zinc-400">
            Standard:{" "}
            <span className="text-zinc-200">{String(violated.standard)}</span>
          </p>
          <p className="mt-1 text-zinc-400">
            Proposed:{" "}
            <span className="text-red-300">{String(violated.proposed)}</span>
            {violated.exceeds ? " — exceeds" : ""}
          </p>
        </div>
      )}

      {paths.length > 0 && (
        <div className="mt-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Resolution paths
          </p>
          <ul className="mt-1.5 space-y-1.5">
            {paths.map((p, i) => (
              <li
                key={i}
                className="rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2"
              >
                <p className="text-sm text-zinc-200">
                  {str(p.path) && (
                    <span className="mr-2 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] uppercase text-zinc-400">
                      {str(p.path)}
                    </span>
                  )}
                  {str(p.description)}
                </p>
                {str(p.citation) && (
                  <p className="mt-1 text-[11px] text-zinc-500">
                    {str(p.citation)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {citations.length > 0 && (
        <div className="mt-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Code citations
          </p>
          <ul className="mt-1.5 space-y-1">
            {citations.map((c, i) => (
              <li key={i} className="text-xs text-zinc-400">
                <span className="font-mono text-zinc-300">
                  §{str(c.sectionNumber)}
                </span>{" "}
                {str(c.title)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {str(d.asOfDate) && (
        <p className="mt-3 text-[11px] text-zinc-600">As of {str(d.asOfDate)}</p>
      )}

      <div className="mt-3">
        <ConfidenceChipRow confidence={component.confidence} />
      </div>

      {findingAtom && (
        <div className="mt-3">
          <DepositLoop
            atomId={findingAtom}
            summary={summaryFor(component, findingAtom)}
            onRecorded={(r) => onCalibrated?.(findingAtom, r)}
          />
        </div>
      )}

      <ProvenanceList provenance={component.provenance} />
    </ComponentCard>
  );
}

// ---- unit-twin-viewer ------------------------------------------------------

function UnitTwinViewer({ component }: RendererProps) {
  const d = component.data;
  const units = arr(d.units);
  return (
    <ComponentCard
      kind="unit-twin-viewer"
      title={component.title}
      rationale={component.rationale}
      headerRight={<LeadConfidenceChip confidence={component.confidence} />}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {units.map((u, i) => {
          const rooms = arr(u.rooms);
          return (
            <div
              key={i}
              className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-100">
                  {str(u.name) ?? str(u.unitType)}
                </p>
                {u.provisional === true && (
                  <span className="rounded-full border border-amber-900/60 bg-amber-950/30 px-2 py-0.5 text-[10px] text-amber-300">
                    provisional · pending APS
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-zinc-500">{str(u.unitType)}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {rooms.map((r, j) => (
                  <span
                    key={j}
                    className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[11px] text-zinc-300"
                  >
                    {str(r.name)}
                  </span>
                ))}
              </div>
              <p className="mt-2 font-mono text-[10px] text-zinc-600">
                spatial ref: placeholder (APS backfill)
              </p>
            </div>
          );
        })}
      </div>
      <ProvenanceList provenance={component.provenance} />
    </ComponentCard>
  );
}

// ---- renderings-panel ------------------------------------------------------

function RenderingsPanel({ component }: RendererProps) {
  const d = component.data;
  const levels = arr(d.levels);
  const sourceModel = rec(d.sourceModel);
  return (
    <ComponentCard
      kind="renderings-panel"
      title={component.title}
      rationale={component.rationale}
      headerRight={<LeadConfidenceChip confidence={component.confidence} />}
    >
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        <Field label="Type" value={str(d.buildingType)} />
        <Field label="Stories" value={String(d.proposedStories ?? "")} />
        <Field label="Status" value={str(d.status)} />
      </div>
      {levels.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {levels.map((l, i) => (
            <span
              key={i}
              className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-[11px] text-zinc-300"
            >
              {str(l.level)} · {str(l.name)}
            </span>
          ))}
        </div>
      )}
      <div className="mt-3 rounded-lg border border-dashed border-zinc-700 bg-zinc-950/40 px-3 py-3 text-center">
        <p className="text-xs text-zinc-500">
          Photoreal renderings + elevations load in the investor room (WS-5) and
          the APS viewer (WS-4).
        </p>
        {str(sourceModel.rvtPath) && (
          <p className="mt-1 font-mono text-[10px] text-zinc-600">
            source: {str(sourceModel.rvtPath)}
          </p>
        )}
      </div>
      <ProvenanceList provenance={component.provenance} />
    </ComponentCard>
  );
}

// ---- investor-rollup -------------------------------------------------------

function InvestorRollup({ component, onCalibrated }: RendererProps) {
  const d = component.data;
  const site = rec(d.site);
  const members = rec(d.members);
  const dealAtom = component.boundAtomIds[0];
  return (
    <ComponentCard
      kind="investor-rollup"
      title={component.title}
      rationale={component.rationale}
      headerRight={<LeadConfidenceChip confidence={component.confidence} />}
    >
      <Field label="Address" value={str(d.address)} />
      <Field
        label="List price"
        value={
          typeof d.listPrice === "number"
            ? `$${(d.listPrice as number).toLocaleString()}`
            : undefined
        }
      />
      <Field
        label="Site"
        value={
          site.acres
            ? `${site.acres} ac · ${site.sqFt} sq ft · ${site.lotCount} lots`
            : undefined
        }
      />
      {str(site.currentImprovements) && (
        <Field label="Current" value={str(site.currentImprovements)} />
      )}

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {Object.entries(members).map(([key, rows]) => {
          const list = Array.isArray(rows) ? rows : [];
          const visible = list.filter((r) => !rec(r).gatedOut).length;
          return (
            <div
              key={key}
              className="rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2"
            >
              <p className="text-[11px] capitalize text-zinc-500">
                {key.replace(/([A-Z])/g, " $1")}
              </p>
              <p className="text-sm font-semibold text-zinc-200">
                {visible} atom{visible === 1 ? "" : "s"}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-zinc-500">
        The full cited de-risking artifact (with the embedded plan review and
        renderings) is the investor room, WS-5.
      </p>

      <div className="mt-3">
        <ConfidenceChipRow confidence={component.confidence.slice(0, 6)} />
      </div>

      {dealAtom && (
        <div className="mt-3">
          <DepositLoop
            atomId={dealAtom}
            summary={summaryFor(component, dealAtom)}
            onRecorded={(r) => onCalibrated?.(dealAtom, r)}
          />
        </div>
      )}

      <ProvenanceList provenance={component.provenance} />
    </ComponentCard>
  );
}

// ---- fallback --------------------------------------------------------------

function RawFallback({ component }: RendererProps) {
  return (
    <ComponentCard
      kind={component.componentKind}
      title={component.title}
      rationale={component.rationale}
      headerRight={<LeadConfidenceChip confidence={component.confidence} />}
    >
      <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-3 text-[11px] text-zinc-400">
        {JSON.stringify(component.data, null, 2)}
      </pre>
      <ProvenanceList provenance={component.provenance} />
    </ComponentCard>
  );
}

// ---- dispatcher ------------------------------------------------------------

const RENDERERS: Record<string, (p: RendererProps) => React.ReactNode> = {
  "kpi-card": KpiCard,
  "variance-anomaly-card": VarianceAnomalyCard,
  "provenance-drill": ProvenanceDrill,
  "action-inbox": ActionInbox,
  "plan-review-findings": PlanReviewFindings,
  "unit-twin-viewer": UnitTwinViewer,
  "renderings-panel": RenderingsPanel,
  "investor-rollup": InvestorRollup,
};

export function ComponentRenderer(props: RendererProps) {
  const Renderer = RENDERERS[props.component.componentKind] ?? RawFallback;
  return <>{Renderer(props)}</>;
}
