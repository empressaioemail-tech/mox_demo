import type { ComponentKind } from "./catalog";
import { catalogSummary } from "./catalog";

/**
 * The intent -> assembly LLM boundary. A provider takes an intent string plus
 * the catalog and an inventory of the (gated) atoms available, and returns an
 * ORDERED list of component selections, each naming the component kind and the
 * atom DIDs to bind it to.
 *
 * Two implementations:
 *  - MockProvider: deterministic, rehearsed rails for the five hero intents.
 *    Active when no LLM_API_KEY is present. Per the guardrail, rehearsed rails
 *    for hero intents are fine; the assembly is still genuinely engine-driven
 *    (catalog selection + atom binding happen in the engine, not hardcoded
 *    component payloads).
 *  - AnthropicProvider: wires @anthropic-ai/sdk; the model selects+orders
 *    components from the catalog via a structured-output tool call. Active when
 *    LLM_API_KEY (or ANTHROPIC_API_KEY) is set.
 */

export interface AtomInventoryItem {
  atomId: string;
  entityType: string;
  entityId: string;
  accessPolicy: string;
  confidenceState: string;
  hero?: boolean;
}

export interface ComponentSelection {
  componentKind: ComponentKind;
  /** Atom DIDs to bind. Empty => engine auto-binds by entityType. */
  atomIds: string[];
  /** Why the engine placed this component (for transparency). */
  rationale?: string;
}

export interface AssemblyPlan {
  intent: string;
  /** Ordered component selections. */
  components: ComponentSelection[];
  providerMode: "mock" | "anthropic";
  model?: string;
}

export interface AssemblyProvider {
  readonly mode: "mock" | "anthropic";
  plan(
    intent: string,
    inventory: AtomInventoryItem[],
  ): Promise<AssemblyPlan>;
}

/** Normalize an intent string to a hero-intent key (rehearsed rails). */
export function classifyIntent(intent: string): string {
  const s = intent.toLowerCase();
  if (/(lp|investor|data ?room|raise|de-?risk)/.test(s)) return "generate-lp-view";
  if (/(vet|review|plan|propos|building|entitlement|flag)/.test(s)) {
    if (/(why|flag)/.test(s)) return "why-flagged";
    return "vet-building";
  }
  if (/(unit|apartment|floor ?plan|room|twin)/.test(s)) return "open-unit";
  if (/(deal|show me|overview|nelray|property)/.test(s)) return "show-deal";
  return "show-deal"; // safe default rail
}

// ---- Mock provider ----------------------------------------------------------

const ENTITLEMENT_FINDING =
  "did:hauska:finding:nelray-607-611/mf3-height-density-exceedance";
const DEAL = "did:hauska:deal:nelray-607-611";
const PROFORMA = "did:hauska:operating-proforma:nelray-5story";
const BUILDING = "did:hauska:building:nelray-5story-apartment";
const UNIT_2BR = "did:hauska:unit:nelray-5story/typical-2br";
const UNIT_1BR = "did:hauska:unit:nelray-5story/typical-1br";

/**
 * Rehearsed rails: for each hero intent, an ordered set of component selections.
 * The engine still does the real work (gates the atoms, binds each component to
 * its atoms, carries confidence with state). atomIds left empty are auto-bound
 * by the engine from the gated inventory by entityType.
 */
const HERO_RAILS: Record<string, ComponentSelection[]> = {
  "show-deal": [
    { componentKind: "investor-rollup", atomIds: [DEAL], rationale: "deal overview composes the molecule" },
    { componentKind: "kpi-card", atomIds: [PROFORMA], rationale: "operating beats" },
    { componentKind: "plan-review-findings", atomIds: [ENTITLEMENT_FINDING], rationale: "surface the hero entitlement finding" },
    { componentKind: "provenance-drill", atomIds: [ENTITLEMENT_FINDING], rationale: "every number carries provenance" },
  ],
  "vet-building": [
    { componentKind: "plan-review-findings", atomIds: [ENTITLEMENT_FINDING], rationale: "the proposed 5-story vs MF-3 envelope" },
    { componentKind: "renderings-panel", atomIds: [BUILDING], rationale: "the proposed building twin" },
    { componentKind: "action-inbox", atomIds: [ENTITLEMENT_FINDING], rationale: "resolution paths as deposit-loop items" },
    { componentKind: "provenance-drill", atomIds: [ENTITLEMENT_FINDING], rationale: "code citations behind the flag" },
  ],
  "why-flagged": [
    { componentKind: "plan-review-findings", atomIds: [ENTITLEMENT_FINDING], rationale: "what is flagged and why" },
    { componentKind: "provenance-drill", atomIds: [ENTITLEMENT_FINDING], rationale: "the §25-2-562/§25-2-564 basis" },
    { componentKind: "action-inbox", atomIds: [ENTITLEMENT_FINDING], rationale: "rezone vs variance, accept/edit/reject" },
  ],
  "open-unit": [
    { componentKind: "unit-twin-viewer", atomIds: [UNIT_2BR, UNIT_1BR], rationale: "unit room layouts" },
    { componentKind: "renderings-panel", atomIds: [BUILDING], rationale: "the building the units sit in" },
    { componentKind: "provenance-drill", atomIds: [UNIT_2BR], rationale: "twin-source provenance (provisional pending APS)" },
  ],
  "generate-lp-view": [
    { componentKind: "investor-rollup", atomIds: [DEAL], rationale: "the cited de-risking artifact" },
    { componentKind: "plan-review-findings", atomIds: [ENTITLEMENT_FINDING], rationale: "entitlement gap on the table before a dollar is raised" },
    { componentKind: "renderings-panel", atomIds: [BUILDING], rationale: "investor-room hero imagery" },
    { componentKind: "kpi-card", atomIds: [PROFORMA], rationale: "underwrite (tenant-private — gated)" },
    { componentKind: "provenance-drill", atomIds: [DEAL], rationale: "provenance rollup" },
  ],
};

export class MockProvider implements AssemblyProvider {
  readonly mode = "mock" as const;

  async plan(intent: string, inventory: AtomInventoryItem[]): Promise<AssemblyPlan> {
    const key = classifyIntent(intent);
    const rail = HERO_RAILS[key] ?? HERO_RAILS["show-deal"];
    const available = new Set(inventory.map((i) => i.atomId));
    // Drop any rail atomIds the subject is not gated to see; keep the component
    // if at least one bound atom remains, else let the engine auto-bind.
    const components: ComponentSelection[] = rail.map((sel) => ({
      componentKind: sel.componentKind,
      atomIds: sel.atomIds.filter((id) => available.has(id)),
      rationale: sel.rationale,
    }));
    return { intent, components, providerMode: "mock" };
  }
}

// ---- Anthropic provider -----------------------------------------------------

/**
 * Minimal structural type for the optional @anthropic-ai/sdk client surface we
 * use. The SDK is not a frontend dependency (keyless deploy uses MockProvider),
 * so we type only the `messages.create` shape rather than import the package.
 */
interface AnthropicClient {
  messages: {
    create(args: unknown): Promise<{ content: Array<{ type: string }> }>;
  };
}

/**
 * Wires @anthropic-ai/sdk. The model is given the catalog and the gated atom
 * inventory and must call the `emit_assembly` tool with an ordered component
 * list. We use a forced tool call for structured output. Matches the reference
 * repos' use of the Anthropic SDK; model is configurable (defaults to a current
 * Claude model).
 */
export class AnthropicProvider implements AssemblyProvider {
  readonly mode = "anthropic" as const;
  private readonly apiKey: string;
  readonly model: string;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async plan(intent: string, inventory: AtomInventoryItem[]): Promise<AssemblyPlan> {
    // Dynamic import of the OPTIONAL @anthropic-ai/sdk. The demo deploys keyless
    // (MockProvider), so the SDK is not a frontend dependency. The specifier is
    // built indirectly so the bundler does not try to resolve it at build time;
    // it is only loaded at runtime when an LLM key is present. Install the SDK
    // and set LLM_API_KEY to activate this path.
    const sdkSpecifier = ["@anthropic-ai", "sdk"].join("/");
    const mod: { default: new (opts: { apiKey: string }) => AnthropicClient } =
      await import(/* webpackIgnore: true */ /* @vite-ignore */ sdkSpecifier);
    const Anthropic = mod.default;
    const client = new Anthropic({ apiKey: this.apiKey });

    const componentKinds = catalogSummary().map((c) => c.kind);
    const system = [
      "You are the assembly engine for the Mox adaptive property-intelligence surface.",
      "Given a user intent and an inventory of available atoms (already access-gated),",
      "select and ORDER components from the catalog and bind each to the atoms that populate it.",
      "Only use component kinds from the catalog. Only bind atomIds present in the inventory.",
      "Prefer surfacing the hero entitlement finding when the intent concerns the building or review.",
      "Confidence is surfaced by the engine with its state; never assert a number as earned.",
      "Catalog:",
      JSON.stringify(catalogSummary()),
    ].join("\n");

    const userText = [
      `Intent: ${intent}`,
      "Available atoms (gated):",
      JSON.stringify(inventory),
    ].join("\n");

    const response = await client.messages.create({
      model: this.model,
      max_tokens: 2048,
      system,
      tools: [
        {
          name: "emit_assembly",
          description:
            "Emit the ordered set of components to render for this intent, each bound to atom DIDs.",
          input_schema: {
            type: "object",
            properties: {
              components: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    componentKind: { type: "string", enum: componentKinds },
                    atomIds: { type: "array", items: { type: "string" } },
                    rationale: { type: "string" },
                  },
                  required: ["componentKind", "atomIds"],
                },
              },
            },
            required: ["components"],
          },
        },
      ],
      tool_choice: { type: "tool", name: "emit_assembly" },
      messages: [{ role: "user", content: userText }],
    });

    // response is `any` here (the SDK import is dynamic + optional), so type the
    // content block explicitly to find the forced tool_use block.
    const toolUse = (response.content as Array<{ type: string }>).find(
      (b) => b.type === "tool_use",
    ) as { input?: unknown } | undefined;
    const input = (toolUse?.input ?? {}) as {
      components?: ComponentSelection[];
    };
    const available = new Set(inventory.map((i) => i.atomId));
    const components: ComponentSelection[] = (input.components ?? [])
      .filter((c) => componentKinds.includes(c.componentKind))
      .map((c) => ({
        componentKind: c.componentKind,
        atomIds: (c.atomIds ?? []).filter((id) => available.has(id)),
        rationale: c.rationale,
      }));

    return { intent, components, providerMode: "anthropic", model: this.model };
  }
}
