import type { AccessPolicy } from "@hauska/atom-contract";

/** Shared contract types for component library atoms (WS-0 wiring check). */
export interface ComponentAtomMeta {
  entityType: string;
  accessPolicy: AccessPolicy;
}

export const SCAFFOLD_META: ComponentAtomMeta = {
  entityType: "scaffold",
  accessPolicy: "public-free",
};
