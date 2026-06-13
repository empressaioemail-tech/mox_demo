"use client";

/**
 * RoleGate — declarative show/hide/redact wrapper driven by the current role.
 *
 * Surfaces wrap role-sensitive content in a gate. The most important demo moment:
 * wrapping operating internals in <RoleGate resource="operating-internals"> means
 * switching to the external LP role makes that block visibly redact — proving Mox
 * controls who sees what.
 *
 * Two ways to gate:
 *   1. By resource (preferred — uses the role's visibility map):
 *        <RoleGate resource="operating-internals">…</RoleGate>
 *   2. By explicit role allow-list:
 *        <RoleGate role={["executive", "acquisitions"]}>…</RoleGate>
 *
 * When the gate fails, by default the children are hidden. Pass `redact` to show
 * a labeled redaction placeholder instead (better for the demo — the audience
 * SEES that something was withheld), or pass `fallback` for custom content.
 */

import type { ReactNode } from "react";
import { useRole } from "./RoleProvider";
import type { Resource, RoleId } from "./roles";

export interface RoleGateProps {
  children: ReactNode;
  /** Gate by resource (uses the current role's visibility map). */
  resource?: Resource;
  /** Gate by an explicit allow-list of roles. */
  role?: RoleId | RoleId[];
  /**
   * When denied, render a labeled redaction placeholder instead of nothing.
   * Recommended for the demo so withholding is visible. Ignored if `fallback`
   * is provided.
   */
  redact?: boolean;
  /** Optional label for the redaction placeholder. */
  redactLabel?: string;
  /** Custom content to render when denied (overrides `redact`). */
  fallback?: ReactNode;
}

export function RoleGate({
  children,
  resource,
  role,
  redact = false,
  redactLabel,
  fallback,
}: RoleGateProps) {
  const { role: current, canSee, roleDef } = useRole();

  let allowed = true;
  if (resource) allowed = canSee(resource);
  if (role) {
    const allow = Array.isArray(role) ? role : [role];
    allowed = allowed && allow.includes(current);
  }

  if (allowed) return <>{children}</>;
  if (fallback !== undefined) return <>{fallback}</>;
  if (!redact) return null;

  return (
    <div
      data-redacted-for={current}
      className="rounded-lg border border-dashed border-zinc-700 bg-zinc-900/40 px-4 py-3 text-xs text-zinc-500"
    >
      <span className="font-medium text-zinc-400">
        {redactLabel ?? "Redacted"}
      </span>
      {" — not visible to "}
      <span className="text-zinc-300">{roleDef.name}</span>
      {roleDef.external
        ? ". An external LP sees only the curated investor view, never tenant-private operating data."
        : ". This role does not have visibility into this resource."}
    </div>
  );
}

export default RoleGate;
