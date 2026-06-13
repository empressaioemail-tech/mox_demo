/**
 * RBAC barrel — role-based access primitives for the Mox demo shell.
 *
 *   import {
 *     RoleProvider, useRole, useCanSee, RoleGate, RoleSwitcher,
 *     ROLES, ROLE_LIST, type RoleId, type Resource,
 *   } from "@/components/rbac";
 *
 * RoleProvider is mounted in the app shell (layout.tsx). Surfaces consume
 * useRole()/useCanSee() and wrap role-sensitive blocks in <RoleGate>.
 */

export { RoleProvider, useRole, useCanSee } from "./RoleProvider";
export type { RoleContextValue } from "./RoleProvider";

export { RoleGate } from "./RoleGate";
export type { RoleGateProps } from "./RoleGate";

export { RoleSwitcher } from "./RoleSwitcher";
export type { RoleSwitcherProps } from "./RoleSwitcher";

export {
  ROLES,
  ROLE_LIST,
  ALL_RESOURCES,
  DEFAULT_ROLE,
  getRole,
  roleCanSee,
  isRoleId,
} from "./roles";
export type { RoleId, RoleDef, Resource } from "./roles";
