/**
 * WS-5 Investor room — typed views of the WS-2 engine wire.
 *
 * These mirror the shapes the backend AdaptiveEngine returns from
 * POST /api/intent (see backend/src/engine/engine.ts + catalog.ts). They are a
 * read-only contract: WS-5 owns these views, the engine owns the wire. We type
 * only the fields the data room renders; unknown extras are tolerated.
 */

/** Confidence chip carried by every value-bearing component (guardrail 1). */
export interface EngineConfidence {
  value: number;
  /** baseline | provenance-backed | provisional | earned-through-outcome */
  state: string;
  label: string;
  note?: string;
}

export interface EngineProvenance {
  role: string;
  tool?: string;
  citation?: string;
  url?: string;
  derivedFromAtom?: string;
}

/** Deposit-loop reflection per bound atom (earning loop live, not earned). */
export interface CalibrationSummary {
  atomId: string;
  total: number;
  accepts: number;
  edits: number;
  rejects: number;
  signalLabel: string;
  lastRecordedAt?: string;
}

export type ComponentKind =
  | "kpi-card"
  | "provenance-drill"
  | "variance-anomaly-card"
  | "action-inbox"
  | "unit-twin-viewer"
  | "plan-review-findings"
  | "investor-rollup"
  | "renderings-panel";

export interface PopulatedComponent {
  componentKind: ComponentKind;
  title: string;
  boundAtomIds: string[];
  data: Record<string, unknown>;
  confidence: EngineConfidence[];
  provenance: EngineProvenance[];
  rationale?: string;
  calibration: CalibrationSummary[];
}

export interface AssemblyResult {
  intent: string;
  providerMode: "mock" | "anthropic";
  model?: string;
  subject: { label: string; tenant: string | null };
  components: PopulatedComponent[];
  gatedOut: Array<{ atomId: string; accessPolicy: string; reason: string }>;
}

// ---- per-component data payloads (the fields we render) --------------------

export interface KpiMetric {
  key: string;
  label: string;
  value: number | null;
  unit: string;
  note?: string;
  mockupRef?: string;
}

export interface KpiCardData {
  basis?: string;
  underwriteConfidenceLabel?: string;
  metrics: KpiMetric[];
}

export interface ResolutionPath {
  path: string;
  description: string;
  citation: string;
}

export interface CitedSection {
  atomId: string;
  sectionNumber?: string;
  title?: string;
}

export interface PlanReviewData {
  headline: string;
  text: string;
  severity: string;
  violatedStandard?: {
    standard: string;
    proposed: string;
    exceeds: boolean;
  };
  resolutionPaths?: ResolutionPath[];
  asOfDate?: string;
  citations?: CitedSection[];
}

export interface InvestorRollupData {
  name?: string;
  address?: string;
  listPrice?: number;
  site?: {
    siteDid?: string;
    acres?: number;
    sqFt?: number;
    lotCount?: number;
    currentImprovements?: string;
  };
  heroFinding?: string;
  members?: Record<
    string,
    Array<{
      atomId?: string;
      atomDid?: string;
      entityType?: string;
      confidence?: EngineConfidence;
      gatedOut?: boolean;
    }>
  >;
}

export interface RenderingsPanelData {
  name?: string;
  buildingType?: string;
  proposedStories?: number;
  status?: string;
  provisional?: boolean;
}

/** A single source atom, returned by GET /api/atoms/:id (gated). */
export interface AtomEnvelope {
  atom: {
    atomId: string;
    entityType: string;
    entityId: string;
    reasoning?: string;
    confidence: EngineConfidence;
    provenance?: EngineProvenance[];
    freshness?: Record<string, unknown>;
    payload?: Record<string, unknown>;
    accessPolicy?: string;
  };
}

/** A curated hero rendering placed under frontend/public/renderings/. */
export interface HeroImage {
  src: string;
  alt: string;
  caption: string;
  kind: "elevation" | "interior";
}
