import type { Atom } from "./types";

/**
 * The component catalog/registry. Each entry is a component the engine can
 * place on the adaptive surface. The catalog declares, per component:
 *  - what it renders (kind + description, for the LLM to select against)
 *  - which atom entityTypes it can bind to (the binding contract)
 *  - a `bind` function that turns the selected atoms into the populated props
 *    the frontend renders, with confidence ALWAYS carried as {value, state}.
 *
 * The engine (mock or LLM) selects + orders components from this catalog for an
 * intent, then binds each to the atoms that populate it. This is what makes the
 * surface engine-driven rather than a hardcoded clickthrough.
 */

export type ComponentKind =
  | "kpi-card"
  | "provenance-drill"
  | "variance-anomaly-card"
  | "action-inbox"
  | "unit-twin-viewer"
  | "plan-review-findings"
  | "investor-rollup"
  | "renderings-panel";

/** Confidence surfaced with its state (guardrail 1) — never a bare number. */
export interface ConfidenceChip {
  value: number;
  state: string;
  label: string;
  note?: string;
}

export interface ProvenanceRef {
  role: string;
  tool?: string;
  citation?: string;
  url?: string;
  derivedFromAtom?: string;
}

/** A populated component instance returned to the frontend. */
export interface PopulatedComponent {
  componentKind: ComponentKind;
  title: string;
  /** The atom DIDs this component is bound to (the binding, made explicit). */
  boundAtomIds: string[];
  /** Component-specific populated payload. */
  data: Record<string, unknown>;
  /** Confidence chips carried for every value-bearing component (guardrail 1). */
  confidence: ConfidenceChip[];
  /** Flattened provenance for the provenance drill / data-room citations. */
  provenance: ProvenanceRef[];
}

export interface CatalogEntry {
  kind: ComponentKind;
  /** Short description the LLM selects against. */
  description: string;
  /** Atom entityTypes this component can bind to. */
  bindsTo: string[];
  /** Build a populated component from the atoms bound to it (already gated). */
  bind: (atoms: Atom[], ctx: BindContext) => PopulatedComponent | null;
}

export interface BindContext {
  /** Look up any gated atom by DID (for composition / cross-references). */
  get: (atomId: string) => Atom | undefined;
}

// ---- binding helpers -------------------------------------------------------

function chipLabel(a: Atom): string {
  const c = a.confidence;
  if (c.chipLabel) return c.chipLabel;
  // Never present a bare number as earned. Always show the state.
  return `Confidence: ${c.state}`;
}

function toChip(a: Atom): ConfidenceChip {
  return {
    value: a.confidence.value,
    state: a.confidence.state,
    label: chipLabel(a),
    note: a.confidence.stateNote,
  };
}

function toProvRefs(a: Atom): ProvenanceRef[] {
  return (a.provenance ?? []).map((p) => ({
    role: p.role,
    tool: p.tool,
    citation: p.citation,
    url: p.url,
    derivedFromAtom: p.derivedFromAtom,
  }));
}

function asRecord(v: unknown): Record<string, unknown> {
  return (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
}

// ---- the catalog ------------------------------------------------------------

export const CATALOG: CatalogEntry[] = [
  {
    kind: "kpi-card",
    description:
      "A headline KPI / metric card. Binds to the operating pro-forma or deal molecule. Surfaces the operating beats (occupancy, NOI vs underwrite, rent lift, cap rate) each with its confidence state.",
    bindsTo: ["operating-proforma", "deal"],
    bind(atoms) {
      const proforma = atoms.find((a) => a.entityType === "operating-proforma");
      if (!proforma) return null;
      const payload = asRecord(proforma.payload);
      const metrics = (payload.metrics as unknown[]) ?? [];
      return {
        componentKind: "kpi-card",
        title: String(payload.label ?? "Operating KPIs"),
        boundAtomIds: [proforma.atomId],
        data: {
          basis: payload.basis,
          underwriteConfidenceLabel: payload.underwriteConfidenceLabel,
          metrics,
        },
        confidence: [toChip(proforma)],
        provenance: toProvRefs(proforma),
      };
    },
  },
  {
    kind: "provenance-drill",
    description:
      "A provenance drill-down: for a focal atom, the source edges, the reasoning that derived it, the citations, and the confidence state. Used to show 'every number carries its provenance'. Binds to any atom.",
    bindsTo: [
      "finding",
      "zoning-district",
      "code-section",
      "parcel",
      "deal",
      "operating-proforma",
      "flood-zone",
      "building",
      "unit",
    ],
    bind(atoms) {
      // Prefer the hero finding if present, else the highest-provenance atom.
      const focal =
        atoms.find((a) => a.entityType === "finding") ??
        atoms.find((a) => a.confidence.state === "provenance-backed") ??
        atoms[0];
      if (!focal) return null;
      return {
        componentKind: "provenance-drill",
        title: `Provenance: ${focal.entityType} ${focal.entityId}`,
        boundAtomIds: [focal.atomId],
        data: {
          atomId: focal.atomId,
          entityType: focal.entityType,
          reasoning: focal.reasoning,
          freshness: focal.freshness,
          provenance: focal.provenance,
        },
        confidence: [toChip(focal)],
        provenance: toProvRefs(focal),
      };
    },
  },
  {
    kind: "variance-anomaly-card",
    description:
      "A variance / anomaly card: flags a metric that deviates from its underwrite, or a not-yet-measurable metric. Binds to the operating pro-forma. Honest about projected-vs-actual.",
    bindsTo: ["operating-proforma"],
    bind(atoms) {
      const proforma = atoms.find((a) => a.entityType === "operating-proforma");
      if (!proforma) return null;
      const payload = asRecord(proforma.payload);
      const metrics = ((payload.metrics as Array<Record<string, unknown>>) ?? []);
      const anomalies = metrics.filter(
        (m) => m.value === null || m.note !== undefined,
      );
      return {
        componentKind: "variance-anomaly-card",
        title: "Variance / not-yet-measurable",
        boundAtomIds: [proforma.atomId],
        data: {
          basis: payload.basis,
          anomalies,
        },
        confidence: [toChip(proforma)],
        provenance: toProvRefs(proforma),
      };
    },
  },
  {
    kind: "action-inbox",
    description:
      "An action inbox: surfaced items the operator can accept / edit / reject (the deposit-loop). For the entitlement finding it surfaces the resolution paths as actionable items. Binds to findings.",
    bindsTo: ["finding"],
    bind(atoms) {
      const finding = atoms.find((a) => a.entityType === "finding");
      if (!finding) return null;
      const payload = asRecord(finding.payload);
      const paths = (payload.resolutionPaths as unknown[]) ?? [];
      return {
        componentKind: "action-inbox",
        title: "Action inbox",
        boundAtomIds: [finding.atomId],
        data: {
          headline: payload.headline,
          severity: payload.severity,
          // Each surfaced item is deposit-loop-actionable (accept/edit/reject).
          items: [
            {
              itemId: finding.atomId,
              kind: "finding",
              headline: payload.headline,
              actions: ["accept", "edit", "reject"],
            },
            ...((paths as Array<Record<string, unknown>>).map((p, i) => ({
              itemId: `${finding.atomId}#path-${i}`,
              kind: "resolution-path",
              headline: p.description,
              actions: ["accept", "edit", "reject"],
            }))),
          ],
        },
        confidence: [toChip(finding)],
        provenance: toProvRefs(finding),
      };
    },
  },
  {
    kind: "unit-twin-viewer",
    description:
      "A unit-twin viewer slot: a unit's room layout from the building twin, with the APS spatial-ref status. Binds to unit atoms. Honest that spatial refs are provisional pending APS.",
    bindsTo: ["unit"],
    bind(atoms) {
      const units = atoms.filter((a) => a.entityType === "unit");
      if (units.length === 0) return null;
      return {
        componentKind: "unit-twin-viewer",
        title: "Unit twin",
        boundAtomIds: units.map((u) => u.atomId),
        data: {
          units: units.map((u) => {
            const payload = asRecord(u.payload);
            return {
              atomId: u.atomId,
              unitType: payload.unitType,
              name: payload.name,
              rooms: payload.rooms,
              spatialRef: payload.spatialRef,
              provisional: u.provisional === true,
            };
          }),
        },
        confidence: units.map(toChip),
        provenance: units.flatMap(toProvRefs),
      };
    },
  },
  {
    kind: "plan-review-findings",
    description:
      "The plan-review findings panel: the hero entitlement finding with the violated standard, the code citations, and the resolution paths (rezone MF-4 / BOA variance). Binds to findings + the code-sections they cite.",
    bindsTo: ["finding", "code-section", "zoning-district"],
    bind(atoms, ctx) {
      const finding = atoms.find((a) => a.entityType === "finding");
      if (!finding) return null;
      const payload = asRecord(finding.payload);
      const citations = (payload.citations as Array<Record<string, unknown>>) ?? [];
      // Bind each cited code-section to its actual atom (where gated-in).
      const citedAtoms = citations
        .map((c) => (typeof c.atomId === "string" ? ctx.get(c.atomId) : undefined))
        .filter((a): a is Atom => a !== undefined);
      return {
        componentKind: "plan-review-findings",
        title: "Plan review — entitlement finding",
        boundAtomIds: [finding.atomId, ...citedAtoms.map((a) => a.atomId)],
        data: {
          headline: payload.headline,
          text: payload.text,
          severity: payload.severity,
          violatedStandard: payload.violatedStandard,
          resolutionPaths: payload.resolutionPaths,
          asOfDate: payload.asOfDate,
          citations: citedAtoms.map((a) => ({
            atomId: a.atomId,
            sectionNumber: asRecord(a.payload).sectionNumber,
            title: asRecord(a.payload).title,
          })),
        },
        // Finding chip + each cited code-section's chip.
        confidence: [toChip(finding), ...citedAtoms.map(toChip)],
        provenance: [...toProvRefs(finding), ...citedAtoms.flatMap(toProvRefs)],
      };
    },
  },
  {
    kind: "investor-rollup",
    description:
      "The investor / data-room rollup: composes the deal molecule's members into a cited de-risking summary (deal headline, parcels, zoning, the entitlement finding, operating). Binds to the deal molecule.",
    bindsTo: ["deal"],
    bind(atoms, ctx) {
      const deal = atoms.find((a) => a.entityType === "deal");
      if (!deal) return null;
      const payload = asRecord(deal.payload);
      // Resolve member atoms the subject is allowed to see (gate already ran).
      const members = deal.members ?? {};
      const resolvedMembers: Record<string, unknown[]> = {};
      const memberChips: ConfidenceChip[] = [];
      const memberProv: ProvenanceRef[] = [];
      for (const [key, rows] of Object.entries(members)) {
        const resolved: unknown[] = [];
        for (const row of rows) {
          const did = typeof row.atomDid === "string" ? row.atomDid : undefined;
          const memberAtom = did ? ctx.get(did) : undefined;
          if (memberAtom) {
            resolved.push({
              atomId: memberAtom.atomId,
              entityType: memberAtom.entityType,
              confidence: toChip(memberAtom),
            });
            memberChips.push(toChip(memberAtom));
            memberProv.push(...toProvRefs(memberAtom));
          } else {
            // Member exists but is gated out for this subject — record absence.
            resolved.push({ atomDid: did, gatedOut: true });
          }
        }
        resolvedMembers[key] = resolved;
      }
      return {
        componentKind: "investor-rollup",
        title: String(payload.name ?? "Investor rollup"),
        boundAtomIds: [deal.atomId],
        data: {
          name: payload.name,
          address: payload.address,
          listPrice: payload.listPrice,
          site: payload.site,
          heroFinding: payload.heroFinding,
          members: resolvedMembers,
        },
        confidence: [toChip(deal), ...memberChips],
        provenance: [...toProvRefs(deal), ...memberProv],
      };
    },
  },
  {
    kind: "renderings-panel",
    description:
      "A renderings / elevations panel: references the proposed building's RVT-derived imagery (renderings, elevations) for the investor room. Binds to the building twin.",
    bindsTo: ["building"],
    bind(atoms) {
      const building = atoms.find((a) => a.entityType === "building");
      if (!building) return null;
      const payload = asRecord(building.payload);
      return {
        componentKind: "renderings-panel",
        title: String(payload.name ?? "Renderings"),
        boundAtomIds: [building.atomId],
        data: {
          name: payload.name,
          buildingType: payload.buildingType,
          proposedStories: payload.proposedStories,
          status: payload.status,
          sourceModel: payload.sourceModel,
          spatialRef: payload.spatialRef,
          levels: payload.levels,
          provisional: building.provisional === true,
        },
        confidence: [toChip(building)],
        provenance: toProvRefs(building),
      };
    },
  },
];

export const CATALOG_BY_KIND: Record<string, CatalogEntry> = Object.fromEntries(
  CATALOG.map((e) => [e.kind, e]),
);

/** Catalog summary the LLM provider selects against. */
export function catalogSummary(): Array<{
  kind: ComponentKind;
  description: string;
  bindsTo: string[];
}> {
  return CATALOG.map((e) => ({
    kind: e.kind,
    description: e.description,
    bindsTo: e.bindsTo,
  }));
}
