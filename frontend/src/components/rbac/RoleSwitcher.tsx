"use client";

/**
 * RoleSwitcher — the header control that changes the active role.
 *
 * A compact dropdown listing every Mox role from most-privileged (Executive) to
 * most-restricted (external LP). Changing it drives <RoleGate> across every
 * surface. The external LP option is visually marked so the presenter can land
 * the "this is all the LP ever sees" beat.
 *
 * Used inside <DemoHeader>. Self-contained; relies only on useRole().
 */

import { useRole } from "./RoleProvider";
import { ROLE_LIST, type RoleId } from "./roles";

export interface RoleSwitcherProps {
  className?: string;
  /** Compact mode hides the descriptive caption (for the narrow header bar). */
  compact?: boolean;
}

export function RoleSwitcher({ className, compact = false }: RoleSwitcherProps) {
  const { role, roleDef, setRole } = useRole();

  return (
    <div className={["flex items-center gap-2", className ?? ""].join(" ")}>
      <label className="flex items-center gap-2">
        <span className="hidden text-[10px] font-medium uppercase tracking-widest text-zinc-500 sm:inline">
          Viewing as
        </span>
        <span className="relative inline-flex items-center">
          <select
            aria-label="Viewing as role"
            value={role}
            onChange={(e) => setRole(e.target.value as RoleId)}
            className={[
              "appearance-none rounded-md border bg-zinc-900 py-1 pl-2.5 pr-7",
              "text-xs font-medium text-zinc-200",
              "transition hover:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500",
              roleDef.external
                ? "border-amber-700/70 text-amber-200"
                : "border-zinc-700",
            ].join(" ")}
          >
            {ROLE_LIST.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
                {r.external ? " (external)" : ""}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="pointer-events-none absolute right-2 h-3 w-3 text-zinc-500"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </label>
      {!compact && (
        <span
          className={[
            "hidden max-w-[18rem] truncate text-[11px] leading-tight md:inline",
            roleDef.external ? "text-amber-300/80" : "text-zinc-500",
          ].join(" ")}
          title={roleDef.description}
        >
          {roleDef.external ? "External — curated view only" : roleDef.arm}
        </span>
      )}
    </div>
  );
}

export default RoleSwitcher;
