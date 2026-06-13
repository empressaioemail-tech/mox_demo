"use client";

/**
 * RedactionControls — the operator's editorial control over the LP artifact.
 *
 * THE HEADLINE RBAC FEATURE: before sharing the data room with an LP, an internal
 * operator (executive / acquisitions) can REDACT or REPLACE individual sensitive
 * fields — specific $ figures, operating internals, exact addresses. Three modes
 * per field:
 *   - show     → the real value (the default)
 *   - redact   → blacked out, with a labeled "redacted by operator" chip
 *   - replace  → swapped for a clearly-representative placeholder (a rounded /
 *                ranged value or a generic substitute)
 *
 * Tied to RBAC (the showcase):
 *   - role = executive | acquisitions  → the OPERATOR. Sees the per-field controls
 *     and a "LP will see" preview indicator on every changed field.
 *   - role = lp                        → the LP. Sees the RESULT of the operator's
 *     choices (redacted fields blacked out, replaced fields showing the substitute)
 *     and NONE of the controls.
 *
 * Choices persist in React state + sessionStorage, so toggling the header role
 * shows the effect live without losing the operator's edits.
 *
 * Honesty: this is the operator's editorial control over THEIR artifact. The
 * provenance infrastructure is ours; the representations are the GP's; the surface
 * does not certify returns. Replaced values are always clearly representative,
 * never fabricated-as-real.
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
import { useRole } from "@/components/rbac";

export type RedactionMode = "show" | "redact" | "replace";

/** Roles that operate the artifact (see + drive the redaction controls). */
const OPERATOR_ROLES = ["executive", "acquisitions"] as const;

const STORAGE_KEY = "mox-investor-redactions";

interface RedactionContextValue {
  /** Current mode for a field key (defaults to "show"). */
  getMode: (key: string) => RedactionMode;
  /** Set the mode for a field key. */
  setMode: (key: string, mode: RedactionMode) => void;
  /** Reset every field back to "show". */
  resetAll: () => void;
  /** How many fields are currently redacted or replaced. */
  changedCount: number;
  /** Whether the current role operates the artifact (sees the controls). */
  isOperator: boolean;
  /** Whether the current role is the external LP (sees only the result). */
  isLp: boolean;
}

const RedactionContext = createContext<RedactionContextValue | null>(null);

export function RedactionProvider({ children }: { children: ReactNode }) {
  const { role } = useRole();
  const [modes, setModes] = useState<Record<string, RedactionMode>>({});

  // Rehydrate the operator's choices after mount. We intentionally read storage
  // in an effect (not a lazy initializer) so the server and first client render
  // agree, then sync the stored choices in — same hydration-safe pattern as
  // RoleProvider. The one-time post-mount setState is deliberate.
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, RedactionMode>;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (parsed && typeof parsed === "object") setModes(parsed);
      }
    } catch {
      /* sessionStorage unavailable — start clean */
    }
  }, []);

  const persist = useCallback((next: Record<string, RedactionMode>) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore persistence failure */
    }
  }, []);

  const setMode = useCallback(
    (key: string, mode: RedactionMode) => {
      setModes((prev) => {
        const next = { ...prev };
        if (mode === "show") delete next[key];
        else next[key] = mode;
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const resetAll = useCallback(() => {
    setModes({});
    persist({});
  }, [persist]);

  const value = useMemo<RedactionContextValue>(() => {
    const isOperator = (OPERATOR_ROLES as readonly string[]).includes(role);
    return {
      getMode: (key: string) => modes[key] ?? "show",
      setMode,
      resetAll,
      changedCount: Object.keys(modes).length,
      isOperator,
      isLp: role === "lp",
    };
  }, [modes, role, setMode, resetAll]);

  return (
    <RedactionContext.Provider value={value}>
      {children}
    </RedactionContext.Provider>
  );
}

export function useRedaction(): RedactionContextValue {
  const ctx = useContext(RedactionContext);
  if (!ctx) {
    throw new Error(
      "useRedaction must be used within a <RedactionProvider> (InvestorRoom).",
    );
  }
  return ctx;
}

/**
 * RedactableValue — wraps a single sensitive value. Renders by (mode × role):
 *
 *   show                 → the real children, unchanged.
 *   redact, operator     → the real children, dimmed, with a "LP will see: redacted"
 *                          preview marker + an [edit] affordance via RedactionMenu
 *                          (the menu is rendered separately by the caller).
 *   redact, lp           → a blackout bar + "redacted by operator" chip.
 *   replace, operator    → the real children with a "LP will see: <replacement>"
 *                          preview marker.
 *   replace, lp          → the representative replacement value.
 *
 * The `label` is a human name for the field used in the operator menu and the
 * redaction chips. `replacement` is the clearly-representative substitute shown to
 * the LP when the field is replaced (required if `replace` is ever used).
 */
export function RedactableValue({
  fieldKey,
  label,
  replacement,
  children,
  className,
}: {
  fieldKey: string;
  label: string;
  replacement?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const { getMode, isLp } = useRedaction();
  const mode = getMode(fieldKey);

  // The LP sees only the result of the operator's choices.
  if (isLp) {
    if (mode === "redact") {
      return <RedactedBlackout label={label} className={className} />;
    }
    if (mode === "replace") {
      return (
        <span
          className={["inline-flex items-center gap-1.5", className ?? ""]
            .filter(Boolean)
            .join(" ")}
          title="Representative value substituted by the operator before sharing."
        >
          {replacement ?? <em className="text-zinc-400">representative</em>}
          <span className="rounded border border-amber-800/60 bg-amber-950/30 px-1 py-0.5 font-mono text-[9px] uppercase tracking-wide text-amber-300/90">
            representative
          </span>
        </span>
      );
    }
    return <span className={className}>{children}</span>;
  }

  // The operator sees the real value, plus an inline "LP will see" preview when
  // the field has been changed.
  return (
    <span
      className={["inline-flex flex-wrap items-center gap-1.5", className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className={
          mode === "redact"
            ? "text-zinc-400 line-through decoration-amber-600/70"
            : undefined
        }
      >
        {children}
      </span>
      {mode === "redact" && (
        <LpPreviewTag>LP will see: redacted</LpPreviewTag>
      )}
      {mode === "replace" && (
        <LpPreviewTag>
          LP will see:{" "}
          <span className="text-amber-200">
            {replacement ?? "representative"}
          </span>
        </LpPreviewTag>
      )}
    </span>
  );
}

/** The blackout bar shown to the LP for a redacted field. */
function RedactedBlackout({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      data-redacted="operator"
      title={`${label} — redacted by the operator before sharing.`}
      className={[
        "inline-flex items-center gap-1.5 align-middle",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="inline-block h-3.5 w-16 rounded-sm bg-zinc-700/90" />
      <span className="rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 font-mono text-[9px] uppercase tracking-wide text-zinc-500">
        redacted by operator
      </span>
    </span>
  );
}

/** The "LP will see" preview marker the operator sees on a changed field. */
function LpPreviewTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-amber-800/50 bg-amber-950/20 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-amber-300/90">
      <span className="inline-block h-1 w-1 rounded-full bg-amber-400" />
      {children}
    </span>
  );
}

/**
 * RedactionMenu — the operator's per-field show / redact / replace control.
 * Hidden entirely from the LP (the caller gates it, but it also no-ops for the
 * LP defensively). Compact segmented control; the active mode is highlighted.
 */
export function RedactionMenu({
  fieldKey,
  label,
  canReplace = true,
}: {
  fieldKey: string;
  label: string;
  /** Whether a "replace" option is offered (some fields only support redact). */
  canReplace?: boolean;
}) {
  const { getMode, setMode, isOperator } = useRedaction();
  if (!isOperator) return null;
  const mode = getMode(fieldKey);

  const options: Array<{ id: RedactionMode; text: string }> = [
    { id: "show", text: "Show" },
    { id: "redact", text: "Redact" },
    ...(canReplace ? [{ id: "replace" as const, text: "Replace" }] : []),
  ];

  return (
    <span
      className="inline-flex overflow-hidden rounded-md border border-zinc-700"
      role="group"
      aria-label={`Sharing control for ${label}`}
    >
      {options.map((opt, i) => {
        const activeStyle =
          opt.id === "show"
            ? "bg-zinc-700 text-zinc-100"
            : opt.id === "redact"
              ? "bg-zinc-700 text-amber-200"
              : "bg-amber-900/50 text-amber-100";
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={mode === opt.id}
            onClick={() => setMode(fieldKey, opt.id)}
            title={
              opt.id === "show"
                ? `Show the real value to the LP`
                : opt.id === "redact"
                  ? `Black out "${label}" before sharing with the LP`
                  : `Swap "${label}" for a representative value before sharing`
            }
            className={[
              "px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide transition",
              i > 0 ? "border-l border-zinc-700" : "",
              mode === opt.id
                ? activeStyle
                : "bg-zinc-900 text-zinc-500 hover:text-zinc-300",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {opt.text}
          </button>
        );
      })}
    </span>
  );
}

/**
 * RedactionBar — the operator-only banner at the top of the data room. Explains
 * the control, shows a live preview-state badge, and offers "reset all". Hidden
 * from the LP. Includes the honesty note.
 */
export function RedactionBar() {
  const { isOperator, isLp, changedCount, resetAll } = useRedaction();
  if (isLp || !isOperator) return null;

  return (
    <div className="rounded-xl border border-amber-900/40 bg-amber-950/15 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-amber-800/60 bg-amber-950/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-200">
            Operator controls
          </span>
          <p className="text-sm text-amber-100/90">
            You control the investor presentation. Redact or replace any
            sensitive line before you share it with an LP.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wide text-amber-300/80">
            {changedCount === 0
              ? "LP sees the full artifact"
              : `${changedCount} field${changedCount === 1 ? "" : "s"} altered for the LP`}
          </span>
          {changedCount > 0 && (
            <button
              type="button"
              onClick={resetAll}
              className="rounded-md border border-amber-800/60 bg-amber-950/30 px-2 py-1 text-xs font-medium text-amber-200 transition hover:border-amber-600"
            >
              Reset all
            </button>
          )}
        </div>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-amber-200/60">
        Switch the header role to{" "}
        <span className="font-medium text-amber-200/90">Investor / LP</span> to
        preview exactly what the LP receives. Editorial control is the
        operator&apos;s; the provenance infrastructure is ours, the
        representations are the GP&apos;s. Replaced values are clearly
        representative — never fabricated as real.
      </p>
    </div>
  );
}
