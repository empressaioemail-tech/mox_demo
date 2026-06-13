import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = fileURLToPath(import.meta.url);
const REPO_ROOT = resolve(HERE, "..", "..", "..");

export interface BackendConfig {
  port: number;
  startedAt: string;
  /** LLM key (Anthropic). Absent => deterministic mock provider. */
  llmApiKey?: string;
  /** Claude model id; matches the reference repos' Anthropic usage. */
  llmModel: string;
  /** Where the deposit-loop calibration JSON lives (backend-owned). */
  calibrationPath: string;
}

export function loadConfig(): BackendConfig {
  const port = Number(process.env.PORT ?? 8787);
  // Per operator decision: provider = Anthropic. Read the key from LLM_API_KEY
  // or ANTHROPIC_API_KEY; if neither is set the engine runs in MOCK mode.
  const llmApiKey =
    process.env.LLM_API_KEY?.trim() || process.env.ANTHROPIC_API_KEY?.trim() || undefined;
  // Reference repos reference claude-sonnet-4-5; default to that, overridable.
  const llmModel = process.env.LLM_MODEL?.trim() || "claude-sonnet-4-5";
  return {
    port: Number.isFinite(port) ? port : 8787,
    startedAt: new Date().toISOString(),
    llmApiKey,
    llmModel,
    calibrationPath:
      process.env.MOX_CALIBRATION_PATH?.trim() ||
      resolve(REPO_ROOT, "backend", ".data", "calibration.json"),
  };
}
