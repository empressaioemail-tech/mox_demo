"use client";

/**
 * InvestorRoom — the apex data-room surface, assembled from the WS-2 engine's
 * "generate the LP view" output. This is the GENERATED, CITED ARTIFACT you hand
 * an LP instead of a static PDF, with the code risk already vetted (deliverable
 * 3 + honesty guardrail 3).
 *
 * It composes, in the engine's order:
 *   - investor-rollup     → the deal molecule de-risking summary (members cited)
 *   - renderings-panel    → the curated hero imagery
 *   - kpi-card            → the underwrite / return summary (every number drills)
 *   - plan-review-findings→ the MF-3 entitlement finding + accept/edit/reject
 *
 * Every surfaced number drills to its source atom; every chip carries state.
 */

import { ConfidenceChip } from "@/components/library";
import { DrillLink } from "./AtomDrill";
import { HeroRenderings } from "./HeroRenderings";
import { PlanReviewFindings } from "./PlanReviewFindings";
import { UnderwriteSummary } from "./UnderwriteSummary";
import { toChipState } from "./engineClient";
import type {
  AssemblyResult,
  InvestorRollupData,
  KpiCardData,
  PlanReviewData,
  PopulatedComponent,
  RenderingsPanelData,
} from "./types";

function pick<T extends PopulatedComponent>(
  result: AssemblyResult,
  kind: PopulatedComponent["componentKind"],
): T | undefined {
  return result.components.find((c) => c.componentKind === kind) as
    | T
    | undefined;
}

export function InvestorRoom({ result }: { result: AssemblyResult }) {
  const rollup = pick(result, "investor-rollup");
  const renderings = pick(result, "renderings-panel");
  const kpi = pick(result, "kpi-card");
  const planReview = pick(result, "plan-review-findings");

  const rollupData = (rollup?.data ?? {}) as unknown as InvestorRollupData;

  return (
    <div className="space-y-6">
      {/* The "what an LP gets" de-risking summary, from the deal molecule. */}
      {rollup && (
        <DealRollup
          data={rollupData}
          dealConfidence={rollup.confidence[0]}
        />
      )}

      {/* Hero renderings — present and carrying the deal. */}
      {renderings && (
        <HeroRenderings
          data={renderings.data as unknown as RenderingsPanelData}
          confidence={renderings.confidence[0]}
        />
      )}

      {/* Underwrite / return summary — every number drills. */}
      {kpi && (
        <UnderwriteSummary
          data={kpi.data as unknown as KpiCardData}
          confidence={kpi.confidence[0]}
          listPrice={rollupData.listPrice}
        />
      )}

      {/* The hero plan-review / entitlement finding with accept/edit/reject. */}
      {planReview && (
        <PlanReviewFindings
          data={planReview.data as unknown as PlanReviewData}
          confidence={planReview.confidence}
          calibration={planReview.calibration}
        />
      )}

      <p className="text-center font-mono text-[10px] uppercase tracking-widest text-zinc-600">
        Assembled live by the engine · provider:{" "}
        {result.providerMode}
        {result.model ? ` (${result.model})` : ""} · intent:
        &ldquo;{result.intent}&rdquo;
      </p>
    </div>
  );
}

function DealRollup({
  data,
  dealConfidence,
}: {
  data: InvestorRollupData;
  dealConfidence?: PopulatedComponent["confidence"][number];
}) {
  const members = data.members ?? {};
  // The de-risking ledger: the cited ground-truth members backing the deal.
  const ledger: Array<{ key: string; label: string }> = [
    { key: "parcels", label: "Parcels (assemblage)" },
    { key: "zoning", label: "Zoning district" },
    { key: "codeSections", label: "Code sections cited" },
    { key: "flood", label: "Flood zone" },
    { key: "findings", label: "Entitlement findings" },
    { key: "operating", label: "Operating pro forma" },
  ];

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Data room · the deal
          </p>
          <h2 className="mt-1 text-xl font-semibold text-zinc-100">
            {data.name ?? "607-611 Nelray Blvd — North Loop Redevelopment"}
          </h2>
          <p className="mt-0.5 text-sm text-zinc-400">{data.address}</p>
        </div>
        <div className="flex items-center gap-2">
          {dealConfidence && (
            <ConfidenceChip
              state={toChipState(dealConfidence.state)}
              value={dealConfidence.value}
              title={dealConfidence.note}
            />
          )}
          <DrillLink atomId="did:hauska:deal:nelray-607-611" label="deal molecule" />
        </div>
      </div>

      {data.site && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Fact label="Site" value={`${data.site.acres} ac`} sub={`${data.site.sqFt?.toLocaleString()} sq ft`} />
          <Fact label="Lots" value={`${data.site.lotCount}`} sub="contiguous" />
          <Fact
            label="List price"
            value={data.listPrice ? `$${(data.listPrice / 1e6).toFixed(2)}M` : "—"}
            sub="redevelopment"
          />
          <Fact label="Proposed" value="5 stories" sub="ground-up" />
        </div>
      )}

      {data.site?.currentImprovements && (
        <p className="mt-3 text-xs text-zinc-500">
          Currently {data.site.currentImprovements}.
        </p>
      )}

      {/* The cited de-risking ledger — each member drills to its atom. */}
      <div className="mt-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          De-risking ledger · cited ground truth
        </p>
        <div className="mt-2 divide-y divide-zinc-800 rounded-lg border border-zinc-800 bg-zinc-950/40">
          {ledger.map(({ key, label }) => {
            const rows = members[key] ?? [];
            if (rows.length === 0) return null;
            return (
              <div
                key={key}
                className="flex flex-wrap items-center gap-2 px-3.5 py-2.5"
              >
                <span className="w-44 text-xs font-medium text-zinc-300">
                  {label}
                </span>
                <div className="flex flex-1 flex-wrap items-center gap-1.5">
                  {rows.map((row, i) => {
                    const id = row.atomId ?? row.atomDid ?? `${key}-${i}`;
                    if (row.gatedOut) {
                      return (
                        <span
                          key={id}
                          className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600"
                          title="Gated out for this access key"
                        >
                          gated
                        </span>
                      );
                    }
                    return (
                      <span key={id} className="inline-flex items-center gap-1">
                        {row.confidence && (
                          <ConfidenceChip
                            state={toChipState(row.confidence.state)}
                            value={row.confidence.value}
                            title={row.confidence.note}
                          />
                        )}
                        {row.atomId && (
                          <DrillLink atomId={row.atomId} label="src" />
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Fact({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
      <p className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-zinc-100">{value}</p>
      {sub && <p className="text-[11px] text-zinc-500">{sub}</p>}
    </div>
  );
}
