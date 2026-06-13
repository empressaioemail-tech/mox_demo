"use client";

/**
 * InvestorRoom — the apex data-room surface, assembled from the WS-2 engine's
 * "generate the LP view" output. This is the GENERATED, CITED ARTIFACT you hand
 * an LP instead of a static PDF, with the code risk already vetted (deliverable
 * 3 + honesty guardrail 3).
 *
 * It ASSEMBLES adaptively (the "magical" feel) in the engine's narrative order:
 *   hero renderings → underwrite / return summary → MF-3 plan-review finding →
 *   de-risking ledger — each section revealing in sequence, reinforcing that the
 *   engine assembles this artifact live.
 *
 * Every surfaced number drills to its source atom; every chip carries state.
 *
 * RBAC SHOWCASE — redact / replace: an internal operator (executive /
 * acquisitions) can redact or replace individual sensitive fields before sharing
 * with an LP, and previewing as the LP role shows exactly what they receive. The
 * controls live in RedactionControls.tsx; this file wires sensitive lines to them
 * and frames the Invest bottom-line.
 */

import { ConfidenceChip, NarrativeFrame } from "@/components/library";
import {
  AssemblingSequence,
  usePrefersReducedMotion,
} from "@/components/adaptive";
import { WalkthroughNarration } from "@/components/walkthrough";
import { useRole } from "@/components/rbac";
import { ARM_INVEST, REPRESENTATIVE_DATA_NOTE } from "@/content/mox";
import { DrillLink } from "./AtomDrill";
import { HeroRenderings } from "./HeroRenderings";
import { PlanReviewFindings } from "./PlanReviewFindings";
import { UnderwriteSummary } from "./UnderwriteSummary";
import {
  RedactionProvider,
  RedactionBar,
  RedactionMenu,
  RedactableValue,
} from "./RedactionControls";
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
  return (
    <RedactionProvider>
      <InvestorRoomInner result={result} />
    </RedactionProvider>
  );
}

function InvestorRoomInner({ result }: { result: AssemblyResult }) {
  const reduced = usePrefersReducedMotion();
  const rollup = pick(result, "investor-rollup");
  const renderings = pick(result, "renderings-panel");
  const kpi = pick(result, "kpi-card");
  const planReview = pick(result, "plan-review-findings");

  const rollupData = (rollup?.data ?? {}) as unknown as InvestorRollupData;

  // The artifact assembles in narrative order. Each section reveals on a stagger
  // (AssemblingSequence), reinforcing "the engine assembles this artifact live".
  // Reduced motion collapses to instant appearance.
  const sections: React.ReactNode[] = [];

  // 1) Hero renderings — present and carrying the deal.
  if (renderings) {
    sections.push(
      <HeroRenderings
        key="renderings"
        data={renderings.data as unknown as RenderingsPanelData}
        confidence={renderings.confidence[0]}
      />,
    );
  }

  // 2) Underwrite / return summary — every number drills, sensitive lines redactable.
  if (kpi) {
    sections.push(
      <UnderwriteSummary
        key="kpi"
        data={kpi.data as unknown as KpiCardData}
        confidence={kpi.confidence[0]}
        listPrice={rollupData.listPrice}
      />,
    );
  }

  // 3) The hero plan-review / entitlement finding with accept/edit/reject.
  if (planReview) {
    sections.push(
      <PlanReviewFindings
        key="plan-review"
        data={planReview.data as unknown as PlanReviewData}
        confidence={planReview.confidence}
        calibration={planReview.calibration}
      />,
    );
  }

  // 4) The de-risking ledger — the cited ground truth that lowers cost of capital.
  if (rollup) {
    sections.push(
      <DealLedger
        key="ledger"
        data={rollupData}
        dealConfidence={rollup.confidence[0]}
      />,
    );
  }

  return (
    <div className="space-y-6">
      <WalkthroughNarration onlyOnSurface="/investor" />

      {/* The operator's editorial control banner (internal roles only). */}
      <RedactionBar />

      {/* The "what an LP gets" header summary, from the deal molecule. */}
      {rollup && (
        <DealHeader data={rollupData} dealConfidence={rollup.confidence[0]} />
      )}

      <AssemblingSequence
        shimmer={!reduced}
        label="Assembling the LP view…"
        step={0.14}
        base={0.1}
      >
        {sections}
      </AssemblingSequence>

      {/* The Invest bottom-line: what you hand an LP, and why it lowers cost of capital. */}
      <InvestBottomLine />

      <p className="text-center font-mono text-[10px] uppercase tracking-widest text-zinc-600">
        Assembled live by the engine · provider: {result.providerMode}
        {result.model ? ` (${result.model})` : ""} · intent: &ldquo;
        {result.intent}&rdquo;
      </p>
    </div>
  );
}

/** The deal header: name, address (redactable), site facts (list price redactable). */
function DealHeader({
  data,
  dealConfidence,
}: {
  data: InvestorRollupData;
  dealConfidence?: PopulatedComponent["confidence"][number];
}) {
  const listPriceText =
    data.listPrice !== undefined ? `$${(data.listPrice / 1e6).toFixed(2)}M` : "—";

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Data room · the deal
          </p>
          <h2 className="mt-1 text-xl font-semibold text-zinc-100">
            {data.name ?? "607-611 Nelray Blvd — North Loop Redevelopment"}
          </h2>
          {/* Exact address — a sensitive line the operator may redact/replace. */}
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
            <RedactableValue
              fieldKey="deal.address"
              label="Exact site address"
              replacement={
                <span className="text-zinc-300">North Loop, Austin TX</span>
              }
            >
              {data.address ?? "607-611 Nelray Blvd, Austin, TX"}
            </RedactableValue>
            <RedactionMenu fieldKey="deal.address" label="Exact site address" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {dealConfidence && (
            <ConfidenceChip
              state={toChipState(dealConfidence.state)}
              value={dealConfidence.value}
              title={dealConfidence.note}
            />
          )}
          <DrillLink
            atomId="did:hauska:deal:nelray-607-611"
            label="deal molecule"
          />
        </div>
      </div>

      {data.site && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Fact
            label="Site"
            value={`${data.site.acres} ac`}
            sub={`${data.site.sqFt?.toLocaleString()} sq ft`}
          />
          <Fact label="Lots" value={`${data.site.lotCount}`} sub="contiguous" />
          <Fact
            label="List price"
            valueNode={
              <span className="flex flex-wrap items-center gap-1.5">
                <RedactableValue
                  fieldKey="deal.listPrice"
                  label="List price"
                  replacement={<span className="text-zinc-200">~$4–5M</span>}
                >
                  {listPriceText}
                </RedactableValue>
              </span>
            }
            sub="redevelopment"
            control={
              <RedactionMenu fieldKey="deal.listPrice" label="List price" />
            }
          />
          <Fact label="Proposed" value="5 stories" sub="ground-up" />
        </div>
      )}

      {data.site?.currentImprovements && (
        <p className="mt-3 text-xs text-zinc-500">
          Currently {data.site.currentImprovements}.
        </p>
      )}
    </section>
  );
}

/** The cited de-risking ledger — each member drills to its atom. */
function DealLedger({
  data,
  dealConfidence,
}: {
  data: InvestorRollupData;
  dealConfidence?: PopulatedComponent["confidence"][number];
}) {
  const members = data.members ?? {};
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            De-risking ledger · cited ground truth
          </p>
          <h2 className="mt-1 text-lg font-semibold text-zinc-100">
            The half no operator or off-the-shelf tool has
          </h2>
          <p className="mt-0.5 text-sm text-zinc-400">
            The parcels, the Austin code sections, and the entitlement finding —
            each drillable to source. This is what de-risks the deal before a
            dollar is raised, and what lowers the cost of capital.
          </p>
        </div>
        {dealConfidence && (
          <ConfidenceChip
            state={toChipState(dealConfidence.state)}
            value={dealConfidence.value}
            title={dealConfidence.note}
          />
        )}
      </div>

      <div className="mt-4 divide-y divide-zinc-800 rounded-lg border border-zinc-800 bg-zinc-950/40">
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
    </section>
  );
}

/** The closing Invest bottom-line, framed via NarrativeFrame + ARM_INVEST. */
function InvestBottomLine() {
  const { isExternal: isLp } = useRole();
  return (
    <NarrativeFrame variant="close">
      <p>
        This is what you hand an LP instead of a static PDF: the renderings, the
        underwrite, and the entitlement plan review in one cited surface, with
        the code risk already vetted.{" "}
        <span className="text-zinc-100">{ARM_INVEST.headline}</span>{" "}
        {ARM_INVEST.bottomLineImpact}
      </p>
      <p className="text-sm text-zinc-400">
        The underwriting gap the broker deck hides — payroll/unit, R&amp;M/unit,
        turnover/unit, and the large rising Texas insurance swing — closes when
        the deal is underwritten against Mox&apos;s own portfolio actuals. The
        verifiable, drillable track record is what lowers the cost of capital.
        {isLp ? (
          <>
            {" "}
            You are viewing this as an external LP: you see only the curated,
            cited artifact and the operator&apos;s shared values — never
            tenant-private operating internals.
          </>
        ) : (
          <>
            {" "}
            You control the presentation: redact or replace any sensitive line
            above, then switch the header role to LP to preview exactly what the
            partner receives.
          </>
        )}
      </p>
      <p className="text-[11px] text-zinc-500">
        {REPRESENTATIVE_DATA_NOTE} Confidence is shown with its state; almost
        everything here is baseline / provenance-backed. The accept / edit /
        reject controls on the plan review feed the earning loop; calibration
        begins when your data is wired. This surface does not certify returns —
        the provenance infrastructure is ours, the representations are the
        GP&apos;s.
      </p>
    </NarrativeFrame>
  );
}

function Fact({
  label,
  value,
  valueNode,
  sub,
  control,
}: {
  label: string;
  value?: string;
  valueNode?: React.ReactNode;
  sub?: string;
  control?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
      <div className="flex items-center justify-between gap-1">
        <p className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">
          {label}
        </p>
        {control}
      </div>
      <div className="mt-1 text-lg font-semibold text-zinc-100">
        {valueNode ?? value}
      </div>
      {sub && <p className="text-[11px] text-zinc-500">{sub}</p>}
    </div>
  );
}
