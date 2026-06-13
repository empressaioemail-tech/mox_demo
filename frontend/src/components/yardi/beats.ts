/**
 * Yardi screen-to-beat map (Part B).
 *
 * Each Yardi screenshot gets an intelligence beat. CRITICAL (guardrail 4): the
 * overlay is the surface of the TWIN — it reads from the atom store / engine,
 * it does NOT pixel-scrape the screenshot DOM. The beats below are atom-derived
 * assist content; the variance/leak and KPI beats also pull live from the
 * engine (POST /api/intent) at render time so the source + confidence shown are
 * the engine's, not hand-typed.
 *
 * Capture is assist-first (guardrail: the assist earns the capture). NO claim of
 * writing back into Yardi (guardrail 6): read + assist + capture to OUR core.
 */

export type BeatKind = "work-order" | "variance" | "kpi";

export interface AssistAction {
  /** Short verb label for the assist button. */
  label: string;
  /** What the assist produces (shown as the result body). */
  detail: string;
}

/**
 * The Manage cost-driver framing for a beat — the bottom-line story.
 * Each Yardi screen maps to a controllable-opex leak the intelligence catches
 * (one of ARM_MANAGE.costDrivers / leakPoints) and what catching it saves.
 * Figures are REPRESENTATIVE (render REPRESENTATIVE_DATA_NOTE alongside).
 */
export interface CostDriverFraming {
  /** The controllable cost driver this beat sits on (ARM_MANAGE.costDrivers). */
  driver: string;
  /** The leak the intelligence catches on this screen (ARM_MANAGE.leakPoints). */
  leak: string;
  /** What catching it saves — the bottom-line, representative. */
  saves: string;
}

export interface CaptureSpan {
  key: string;
  value: string;
}

export interface YardiBeat {
  slug: string;
  /** The screenshot served from /public/yardi. */
  image: string;
  /** Aspect ratio (width/height) of the screenshot for the frame. */
  aspect: number;
  /** Tab label (the faux-browser context). */
  tab: string;
  /** The "following you" context line — what Mox sees you doing. */
  context: string;
  beatKind: BeatKind;
  /**
   * The Manage cost-driver framing — maps this Yardi screen to a controllable
   * -opex leak and what catching it saves (the bottom-line story).
   */
  costDriver: CostDriverFraming;
  /** What this work item belongs to (the "this belongs to" link card). */
  belongsTo?: { label: string; meta: string };
  /** Assist actions — the assist that earns the capture. */
  assists: AssistAction[];
  /**
   * For the work-order beat: the drafted reply (the ABC Plumbing assist).
   * Atom-derived from vendor + rate + SLA + coding atoms.
   */
  draftReply?: string;
  /** Spans captured to OUR core (private to Mox, never pooled). */
  captureSpans: CaptureSpan[];
  captureTitle: string;
  captureSub: string;
  /**
   * The atom this beat's capture is recorded against (the deposit loop). For
   * the variance/finding beats this is the live finding atom; for work orders
   * it is the operating atom the vendor coding belongs to.
   */
  captureAtomId: string;
  /**
   * If set, the beat hydrates its intelligence (reasoning chain + source +
   * confidence) live from the engine by running this intent and reading the
   * named component kind. This is what makes it atom-derived, not typed.
   */
  liveIntent?: { intent: string; componentKind: string };
  /** Where on the screenshot the insight pin sits (percent of frame). */
  pin: { top: string; left: string };
  /** Static fallback reasoning if the engine is unreachable. */
  fallback: {
    headline: string;
    reasoning: string;
    source: string;
    confidenceState: string;
    confidenceValue?: number;
    confidenceLabel: string;
  };
}

export const YARDI_BEATS: YardiBeat[] = [
  {
    slug: "work-orders",
    image: "/yardi/work-orders.png",
    aspect: 984 / 508,
    tab: "Yardi · Work Orders",
    context: "Reading a vendor work order with ABC Plumbing",
    beatKind: "work-order",
    costDriver: {
      driver: "Repairs & maintenance (R&M)",
      leak: "Vendor-invoice coding — invoices coded correctly and to the right account, not miscoded into the wrong line at close.",
      saves:
        "Correct coding the first time keeps R&M from leaking into the wrong account, and the master-rate check stops overbilling — part of the 18–23% reduction in controllable line items.",
    },
    belongsTo: {
      label: "ABC Plumbing — open work order",
      meta: "plumbing · R&M · vendor on master rate",
    },
    assists: [
      {
        label: "Pull ABC Plumbing history across the portfolio",
        detail:
          "ABC Plumbing appears on prior R&M work orders across the owned book. Master-rate vendor; typical close inside SLA. Pattern: covered plumbing repairs code to R&M plumbing.",
      },
      {
        label: "Summarize the thread",
        detail:
          "Vendor confirming scope on an open plumbing repair; awaiting a coded invoice so it clears the monthly close.",
      },
      {
        label: "Draft a reply from Mox patterns",
        detail: "Reply drafted below from the master-rate + coding patterns.",
      },
    ],
    draftReply:
      "Thanks — confirming the scope. Per our master rate this is a covered R&M plumbing repair. Please schedule this week and send the invoice coded to R&M · plumbing so it clears the monthly close on time.",
    captureSpans: [
      { key: "vendor", value: "ABC Plumbing" },
      { key: "rate", value: "master R&M" },
      { key: "coding", value: "R&M · plumbing" },
      { key: "SLA", value: "within window" },
    ],
    captureTitle: "Code the invoice to your core",
    captureSub: "your decision becomes calibrated history",
    captureAtomId: "did:hauska:operating-proforma:nelray-5story",
    pin: { top: "34%", left: "62%" },
    fallback: {
      headline: "Vendor history + draft reply + coding",
      reasoning:
        "ABC Plumbing is a known master-rate vendor across the owned book. Covered plumbing repairs code to R&M · plumbing; the assist drafts the reply and proposes the coding so it clears close.",
      source:
        "Operating atoms (vendor / rate / coding patterns), shaped like your book — read from our core, not scraped from Yardi.",
      confidenceState: "baseline",
      confidenceValue: 0.4,
      confidenceLabel: "Confidence: baseline (representative operating pattern)",
    },
  },
  {
    slug: "budget-variance",
    image: "/yardi/budget-variance.png",
    aspect: 2119 / 1171,
    tab: "Yardi · Budget Variance",
    context: "Reviewing a budget-variance line that runs hot",
    beatKind: "variance",
    costDriver: {
      driver: "Common-area utilities",
      leak: "Water-leak catch — a common-area water/sewer line running hot, caught in month one instead of month nine.",
      saves:
        "Catching a utilities anomaly early — rather than nine months of leaked water billed to the property — is exactly where the controllable-line reduction shows up at close.",
    },
    assists: [
      {
        label: "Explain the variance",
        detail:
          "The water/sewer line runs over budget — the reasoning chain and source are pulled from our core below.",
      },
      {
        label: "Trace the line to its underwrite",
        detail:
          "Cross-reference the controllable line item against the seed underwrite and the operating pattern.",
      },
    ],
    captureSpans: [
      { key: "line", value: "water / sewer" },
      { key: "signal", value: "over budget" },
      { key: "hypothesis", value: "possible leak" },
    ],
    captureTitle: "Capture the anomaly to your core",
    captureSub: "the flag and your call become calibrated history",
    captureAtomId: "did:hauska:operating-proforma:nelray-5story",
    liveIntent: {
      intent: "show me variance and anomalies in operating",
      componentKind: "variance-anomaly-card",
    },
    pin: { top: "40%", left: "58%" },
    fallback: {
      headline: "Variance flag with reasoning chain",
      reasoning:
        "A controllable expense line deviates from its underwrite basis. Flagged honestly as projected-vs-tracked: the building is proposed, so the engine surfaces what is not-yet-measurable rather than asserting a measured overrun.",
      source:
        "Operating pro-forma atom (controllable line items), read from our core.",
      confidenceState: "baseline",
      confidenceValue: 0.4,
      confidenceLabel: "Confidence: baseline (projected; not yet calibrated)",
    },
  },
  {
    slug: "expense-analysis",
    image: "/yardi/expense-analysis.png",
    aspect: 2124 / 1116,
    tab: "Yardi · Expense Analysis",
    context: "Scanning expense analysis for the controllable lines",
    beatKind: "variance",
    costDriver: {
      driver: "Turnover & make-ready",
      leak: "Turnover-band flag — units drifting outside the make-ready cost band, surfaced against the owned-book pattern.",
      saves:
        "Flagging make-ready spend that drifts outside the band keeps turnover cost in line with the underwrite — another controllable line the engine holds down at close.",
    },
    assists: [
      {
        label: "Flag the anomalous line",
        detail:
          "The engine surfaces the controllable-line anomaly with its reasoning chain and source below.",
      },
      {
        label: "Compare to the owned-book pattern",
        detail:
          "Controllable line items sit ~19% below market in the seed underwrite — the analysis target.",
      },
    ],
    captureSpans: [
      { key: "metric", value: "controllable line items" },
      { key: "vs market", value: "-19.4%" },
      { key: "review", value: "flagged" },
    ],
    captureTitle: "Capture the finding to your core",
    captureSub: "your review becomes calibrated history",
    captureAtomId: "did:hauska:operating-proforma:nelray-5story",
    liveIntent: {
      intent: "show me variance and anomalies in operating",
      componentKind: "variance-anomaly-card",
    },
    pin: { top: "46%", left: "50%" },
    fallback: {
      headline: "Expense anomaly with source",
      reasoning:
        "Controllable line items are tracked against market and the seed underwrite. The engine flags deviations and is explicit that the not-yet-built asset has no measured actuals yet.",
      source: "Operating pro-forma atom (expense lines), read from our core.",
      confidenceState: "baseline",
      confidenceValue: 0.4,
      confidenceLabel: "Confidence: baseline (projected)",
    },
  },
  {
    slug: "financial-overview",
    image: "/yardi/financial-overview.png",
    aspect: 983 / 508,
    tab: "Yardi · Financial Overview",
    context: "Viewing the financial overview",
    beatKind: "kpi",
    costDriver: {
      driver: "Contract services",
      leak: "Vendors missing SLA — contract-service performance flagged against the agreement, in context on the KPI read.",
      saves:
        "Surfacing the close cycle and contract-service SLA in context means the controllable lines stay visible while they can still be acted on, not discovered after close.",
    },
    assists: [
      {
        label: "Surface the underwrite KPIs",
        detail:
          "Occupancy, rent lift, cap rate and the close cycle — each with its provenance and confidence state — below.",
      },
    ],
    captureSpans: [
      { key: "occupancy", value: "94%" },
      { key: "cap rate", value: "7.4%" },
      { key: "close cycle", value: "4.2 days" },
    ],
    captureTitle: "Pin the KPI read to your core",
    captureSub: "your context becomes calibrated history",
    captureAtomId: "did:hauska:operating-proforma:nelray-5story",
    liveIntent: {
      intent: "generate the LP view",
      componentKind: "kpi-card",
    },
    pin: { top: "38%", left: "55%" },
    fallback: {
      headline: "In-context KPI insight with provenance",
      reasoning:
        "The headline operating KPIs are projected from the seed underwrite for the proposed asset. NOI-vs-underwrite is explicitly not-yet-measurable until it operates.",
      source:
        "Operating pro-forma atom; metric naming consistent with the Mox mockups.",
      confidenceState: "baseline",
      confidenceValue: 0.4,
      confidenceLabel: "Confidence: baseline (projected underwrite)",
    },
  },
  {
    slug: "property-operations",
    image: "/yardi/property-operations.png",
    aspect: 795 / 508,
    tab: "Yardi · Property Operations",
    context: "Viewing property operations",
    beatKind: "kpi",
    costDriver: {
      driver: "On-site payroll & marketing",
      leak: "Staffing and marketing read in context — the controllable people/leasing lines surfaced against the operating pattern, each with its state.",
      saves:
        "Keeping on-site payroll and marketing visible against the operating pattern is how those controllable lines stay inside the 18–23% reduction story.",
    },
    assists: [
      {
        label: "Surface the operating KPIs",
        detail:
          "Stabilized occupancy and rent lift for the proposed asset — each carrying its confidence state — below.",
      },
    ],
    captureSpans: [
      { key: "occupancy", value: "94%" },
      { key: "rent lift", value: "$215/u/mo" },
    ],
    captureTitle: "Pin the operations read to your core",
    captureSub: "your context becomes calibrated history",
    captureAtomId: "did:hauska:operating-proforma:nelray-5story",
    liveIntent: {
      intent: "generate the LP view",
      componentKind: "kpi-card",
    },
    pin: { top: "42%", left: "48%" },
    fallback: {
      headline: "In-context operating insight with provenance",
      reasoning:
        "Operating KPIs are projected from the seed underwrite. Every value is shown with its state; nothing is presented as earned-calibrated for a not-yet-built asset.",
      source: "Operating pro-forma atom, read from our core.",
      confidenceState: "baseline",
      confidenceValue: 0.4,
      confidenceLabel: "Confidence: baseline (projected)",
    },
  },
];

export const YARDI_BEATS_BY_SLUG: Record<string, YardiBeat> =
  Object.fromEntries(YARDI_BEATS.map((b) => [b.slug, b]));
