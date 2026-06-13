import { atomStore } from "./atoms";
import { AdaptiveEngine } from "./engine";
import { AnthropicProvider, MockProvider, type AssemblyProvider } from "./provider";

/**
 * Engine entry point (server-only). Wires the atom store + provider into the
 * AdaptiveEngine and exposes a singleton for the Next.js API route handlers.
 *
 * Provider selection (mirrors backend/src/config.ts):
 *  - If LLM_API_KEY or ANTHROPIC_API_KEY is set -> AnthropicProvider
 *    (model from LLM_MODEL, default claude-sonnet-4-5).
 *  - Otherwise -> the deterministic MockProvider. The demo deploys KEYLESS:
 *    the mock covers the five hero intents, so the live URL works with no key.
 */

export const LLM_MODEL = process.env.LLM_MODEL?.trim() || "claude-sonnet-4-5";

function llmApiKey(): string | undefined {
  return (
    process.env.LLM_API_KEY?.trim() ||
    process.env.ANTHROPIC_API_KEY?.trim() ||
    undefined
  );
}

function buildProvider(): AssemblyProvider {
  const key = llmApiKey();
  return key ? new AnthropicProvider(key, LLM_MODEL) : new MockProvider();
}

// Singleton wiring. The store is read-only static JSON; the provider is chosen
// once per cold start (mock when keyless, which is the deployed default).
const provider = buildProvider();
export const engine = new AdaptiveEngine(atomStore, provider);
export const providerMode = provider.mode;

export { atomStore } from "./atoms";
export {
  HAUSKA_KEY_HEADER,
  PUBLIC_SUBJECT,
  filterAtoms,
  resolveSubject,
} from "./gate";
export { catalogSummary } from "./catalog";
export {
  makeEvent,
  sanitizeEvents,
  summaryFor,
  type CalibrationAction,
  type CalibrationEvent,
  type CalibrationSummary,
} from "./calibration";
export type { AssemblyResult, AssembledComponent } from "./engine";
export type { AccessSubject } from "./gate";
export type { Atom } from "./types";
