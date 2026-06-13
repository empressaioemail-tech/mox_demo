import { serve } from "@hono/node-server";
import { Hono, type Context } from "hono";

import { AtomStore } from "./atoms/store.js";
import type { BackendConfig } from "./config.js";
import { CalibrationStore } from "./engine/calibration.js";
import { catalogSummary } from "./engine/catalog.js";
import { AdaptiveEngine } from "./engine/engine.js";
import {
  AnthropicProvider,
  MockProvider,
  type AssemblyProvider,
} from "./engine/provider.js";
import { HAUSKA_KEY_HEADER, filterAtoms, resolveSubject } from "./gate/gate.js";
import { DEMO_ATOM_STUB } from "./types/atom.js";

export interface AppDeps {
  store: AtomStore;
  engine: AdaptiveEngine;
  calibration: CalibrationStore;
  provider: AssemblyProvider;
}

export function buildDeps(config: BackendConfig): AppDeps {
  const store = new AtomStore();
  const calibration = new CalibrationStore(config.calibrationPath);
  const provider: AssemblyProvider = config.llmApiKey
    ? new AnthropicProvider(config.llmApiKey, config.llmModel)
    : new MockProvider();
  const engine = new AdaptiveEngine(store, provider, calibration);
  return { store, engine, calibration, provider };
}

export function buildApp(config: BackendConfig, deps: AppDeps = buildDeps(config)): Hono {
  const app = new Hono();
  const { store, engine, calibration, provider } = deps;

  app.get("/health", (c) =>
    c.json({
      status: "ok",
      service: "mox-demo-backend",
      startedAt: config.startedAt,
      engine: {
        providerMode: provider.mode,
        model: provider.mode === "anthropic" ? config.llmModel : null,
        atomsLoaded: store.size(),
        calibrationEvents: calibration.all().length,
      },
    }),
  );

  // Catalog introspection (what the engine can assemble).
  app.get("/api/catalog", (c) => c.json({ components: catalogSummary() }));

  /**
   * The read API the frontend calls: intent in -> ordered, populated
   * components out. GET (intent query param) or POST ({ intent }). The
   * X-Hauska-Key header gates which atoms populate the components.
   */
  async function handleIntent(c: Context, intent: string) {
    if (!intent.trim()) {
      return c.json({ error: "intent is required" }, 400);
    }
    const subject = resolveSubject(c.req.header(HAUSKA_KEY_HEADER));
    const result = await engine.assemble(intent, subject);
    return c.json(result);
  }

  app.post("/api/intent", async (c) => {
    const body = await c.req
      .json<{ intent?: string }>()
      .catch(() => ({}) as { intent?: string });
    return handleIntent(c, body.intent ?? "");
  });

  app.get("/api/intent", async (c) => {
    return handleIntent(c, c.req.query("intent") ?? "");
  });

  /** List/serve atoms (gated). The gate filters by X-Hauska-Key at read time. */
  app.get("/api/atoms", (c) => {
    const subject = resolveSubject(c.req.header(HAUSKA_KEY_HEADER));
    const { kept, denied } = filterAtoms(subject, store.all());
    return c.json({
      subject: { label: subject.label, tenant: subject.jurisdictionTenant },
      count: kept.length,
      atoms: kept,
      gatedOut: denied,
      stub: DEMO_ATOM_STUB,
    });
  });

  /** Serve a single atom (gated). 404 if missing OR gated out (no leakage). */
  app.get("/api/atoms/:id{.+}", (c) => {
    const subject = resolveSubject(c.req.header(HAUSKA_KEY_HEADER));
    const atom = store.get(c.req.param("id"));
    if (!atom) return c.json({ error: "atom not found" }, 404);
    const { kept } = filterAtoms(subject, [atom]);
    if (kept.length === 0) {
      // Tenant-private leakage prevented: indistinguishable from not-found.
      return c.json({ error: "atom not found" }, 404);
    }
    return c.json({ atom: kept[0] });
  });

  /**
   * The deposit-loop write path: accept/edit/reject on a surfaced item records
   * a calibration event. Requires a key that can READ the atom (you cannot
   * calibrate an atom you cannot see) — preserves the gate on writes too.
   */
  app.post("/api/calibration", async (c) => {
    const subject = resolveSubject(c.req.header(HAUSKA_KEY_HEADER));
    type CalibrationBody = {
      atomId?: string;
      action?: string;
      itemId?: string;
      note?: string;
      actor?: string;
    };
    const body = await c.req
      .json<CalibrationBody>()
      .catch(() => ({}) as CalibrationBody);
    const { atomId, action } = body;
    if (!atomId || !action) {
      return c.json({ error: "atomId and action are required" }, 400);
    }
    if (!["accept", "edit", "reject"].includes(action)) {
      return c.json({ error: "action must be accept|edit|reject" }, 400);
    }
    const atom = store.get(atomId);
    if (!atom) return c.json({ error: "atom not found" }, 404);
    const { kept } = filterAtoms(subject, [atom]);
    if (kept.length === 0) {
      return c.json({ error: "atom not found" }, 404); // gate on writes too
    }
    const event = calibration.record({
      atomId,
      action: action as "accept" | "edit" | "reject",
      itemId: body.itemId,
      note: body.note,
      actor: body.actor ?? subject.label,
    });
    // Reflect immediately: return the updated calibration summary the engine
    // will surface (earning loop live; not relabeled as earned-calibrated).
    return c.json({ recorded: event, reflection: calibration.summaryFor(atomId) });
  });

  /** Read the calibration reflection for an atom (gated). */
  app.get("/api/calibration/:id{.+}", (c) => {
    const subject = resolveSubject(c.req.header(HAUSKA_KEY_HEADER));
    const atomId = c.req.param("id");
    const atom = store.get(atomId);
    if (!atom) return c.json({ error: "atom not found" }, 404);
    const { kept } = filterAtoms(subject, [atom]);
    if (kept.length === 0) return c.json({ error: "atom not found" }, 404);
    return c.json({
      summary: calibration.summaryFor(atomId),
      events: calibration.eventsFor(atomId),
    });
  });

  return app;
}

export function startServer(app: Hono, port: number): void {
  serve({ fetch: app.fetch, port });
  console.log(`mox-demo backend listening on http://localhost:${port}`);
}
