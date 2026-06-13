"use client";

/**
 * RoleProvider — role context + the useRole / useCanSee hooks.
 *
 * Mounted once in the app shell (layout.tsx). Holds the current role and exposes
 * what it can see. The story it drives: Mox controls who sees what across the
 * whole system. Switching to the external LP role visibly redacts/hides operating
 * internals on every surface that gates on it.
 *
 * The selected role persists in sessionStorage so it survives route changes
 * within a demo session (and resets on a fresh tab — sensible for a live demo).
 *
 * API:
 *   const { role, roleDef, setRole, canSee, isExternal } = useRole();
 *   const canSeeOps = useCanSee("operating-internals");   // boolean shorthand
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_ROLE,
  getRole,
  isRoleId,
  roleCanSee,
  type Resource,
  type RoleDef,
  type RoleId,
} from "./roles";

const STORAGE_KEY = "mox-demo-role";

export interface RoleContextValue {
  /** The current role id. */
  role: RoleId;
  /** The full definition of the current role. */
  roleDef: RoleDef;
  /** Switch the active role (persists to sessionStorage). */
  setRole: (role: RoleId) => void;
  /** Whether the current role can see a given resource. */
  canSee: (resource: Resource) => boolean;
  /** Whether the current role is external (the LP). */
  isExternal: boolean;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({
  children,
  initialRole = DEFAULT_ROLE,
}: {
  children: ReactNode;
  initialRole?: RoleId;
}) {
  const [role, setRoleState] = useState<RoleId>(initialRole);

  // Rehydrate from sessionStorage after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored && isRoleId(stored)) setRoleState(stored);
    } catch {
      /* sessionStorage unavailable — fall back to initialRole */
    }
  }, []);

  const setRole = useCallback((next: RoleId) => {
    setRoleState(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore persistence failure */
    }
  }, []);

  const value = useMemo<RoleContextValue>(() => {
    const roleDef = getRole(role);
    return {
      role,
      roleDef,
      setRole,
      canSee: (resource: Resource) => roleCanSee(role, resource),
      isExternal: roleDef.external,
    };
  }, [role, setRole]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

/**
 * Access the current role and visibility helpers. Must be called inside a
 * <RoleProvider> (mounted in the app shell).
 */
export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error("useRole must be used within a <RoleProvider> (app shell).");
  }
  return ctx;
}

/**
 * Boolean shorthand: can the current role see this resource?
 *   const showOps = useCanSee("operating-internals");
 */
export function useCanSee(resource: Resource): boolean {
  return useRole().canSee(resource);
}
