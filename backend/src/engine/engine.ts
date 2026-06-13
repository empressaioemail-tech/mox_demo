import type { AtomStore } from "../atoms/store.js";
import type { AccessSubject } from "../gate/gate.js";
import { filterAtoms } from "../gate/gate.js";
import type { CalibrationStore, CalibrationSummary } from "./calibration.js";
import type { BindContext, PopulatedComponent } from "./catalog.js";
import { CATALOG_BY_KIND } from "./catalog.js";
import type {
  AssemblyProvider,
  AtomInventoryItem,
  ComponentSelection,
} from "./provider.js";
import type { Atom } from "../types/atom.js";

/**
 * The adaptive-assembly engine. Pipeline:
 *   1. Gate: filter all atoms for the subject (X-Hauska-Key). The provider and
 *      the binders only ever see atoms the subject may read.
 *   2. Plan: the provider (mock or Anthropic) selects + orders components from
 *      the catalog and names the atoms to bind each to.
 *   3. Bind: for each selection, pull the named (gated) atoms — or auto-bind by
 *      the component's `bindsTo` entityTypes — and run the catalog binder to
 *      produce the populated component, carrying confidence WITH its state.
 *   4. Reflect: attach the deposit-loop calibration summary to each component's
 *      bound atoms (the earning loop made visible, honestly).
 */

export interface AssembledComponent extends PopulatedComponent {
  rationale?: string;
  /** Deposit-loop reflection per bound atom (calibration is live, not earned). */
  calibration: CalibrationSummary[];
}

export interface AssemblyResult {
  intent: string;
  providerMode: "mock" | "anthropic";
  model?: string;
  subject: { label: string; tenant: string | null };
  /** Ordered, populated components. */
  components: AssembledComponent[];
  /** Atoms the gate denied for this subject (audit / honesty surface). */
  gatedOut: Array<{ atomId: string; accessPolicy: string; reason: string }>;
}

export class AdaptiveEngine {
  constructor(
    private readonly store: AtomStore,
    private readonly provider: AssemblyProvider,
    private readonly calibration: CalibrationStore,
  ) {}

  private inventory(atoms: Atom[]): AtomInventoryItem[] {
    return atoms.map((a) => ({
      atomId: a.atomId,
      entityType: a.entityType,
      entityId: a.entityId,
      accessPolicy: a.accessPolicy,
      confidenceState: a.confidence.state,
      hero:
        a.entityType === "finding" &&
        a.entityId.endsWith("mf3-height-density-exceedance"),
    }));
  }

  async assemble(intent: string, subject: AccessSubject): Promise<AssemblyResult> {
    // 1. Gate.
    const { kept, denied } = filterAtoms(subject, this.store.all());
    const gatedById = new Map(kept.map((a) => [a.atomId, a]));
    const ctx: BindContext = { get: (id) => gatedById.get(id) };

    // 2. Plan.
    const plan = await this.provider.plan(intent, this.inventory(kept));

    // 3 + 4. Bind + reflect.
    const components: AssembledComponent[] = [];
    for (const sel of plan.components) {
      const entry = CATALOG_BY_KIND[sel.componentKind];
      if (!entry) continue;
      const atoms = this.resolveBindAtoms(sel, entry.bindsTo, kept, gatedById);
      if (atoms.length === 0) continue; // nothing gated-in to populate it
      const populated = entry.bind(atoms, ctx);
      if (!populated) continue;
      const calibration = populated.boundAtomIds.map((id) =>
        this.calibration.summaryFor(id),
      );
      components.push({ ...populated, rationale: sel.rationale, calibration });
    }

    return {
      intent,
      providerMode: plan.providerMode,
      model: plan.model,
      subject: { label: subject.label, tenant: subject.jurisdictionTenant },
      components,
      gatedOut: denied,
    };
  }

  /** Resolve the atoms to bind: explicit DIDs (gated) first, else auto by type. */
  private resolveBindAtoms(
    sel: ComponentSelection,
    bindsTo: string[],
    kept: Atom[],
    gatedById: Map<string, Atom>,
  ): Atom[] {
    if (sel.atomIds.length > 0) {
      const explicit = sel.atomIds
        .map((id) => gatedById.get(id))
        .filter((a): a is Atom => a !== undefined);
      if (explicit.length > 0) return explicit;
    }
    // Auto-bind: every gated atom whose entityType this component binds to.
    return kept.filter((a) => bindsTo.includes(a.entityType));
  }
}
