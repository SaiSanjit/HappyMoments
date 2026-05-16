"use client";

import * as React from "react";
import { clsx } from "clsx";

type Kind =
  | "new"
  | "contacted"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost"
  | "commit"
  | "confirmed"
  | "pending";

const MAP: Record<Kind, { bgVar: string; textVar: string; dotVar: string }> = {
  new:         { bgVar: "--crm-status-new-bg",      textVar: "--crm-status-new-text",      dotVar: "--crm-status-new-dot"      },
  contacted:   { bgVar: "--crm-status-progress-bg", textVar: "--crm-status-progress-text", dotVar: "--crm-status-progress-dot" },
  proposal:    { bgVar: "--crm-status-proposal-bg", textVar: "--crm-status-proposal-text", dotVar: "--crm-status-proposal-dot" },
  negotiation: { bgVar: "--crm-status-commit-bg",   textVar: "--crm-status-commit-text",   dotVar: "--crm-status-commit-dot"   },
  won:         { bgVar: "--crm-status-won-bg",      textVar: "--crm-status-won-text",      dotVar: "--crm-status-won-dot"      },
  lost:        { bgVar: "--crm-status-lost-bg",     textVar: "--crm-status-lost-text",     dotVar: "--crm-status-lost-dot"     },
  commit:      { bgVar: "--crm-status-commit-bg",   textVar: "--crm-status-commit-text",   dotVar: "--crm-status-commit-dot"   },
  confirmed:   { bgVar: "--crm-status-won-bg",      textVar: "--crm-status-won-text",      dotVar: "--crm-status-won-dot"      },
  pending:     { bgVar: "--crm-status-progress-bg", textVar: "--crm-status-progress-text", dotVar: "--crm-status-progress-dot" },
};

type Props = {
  kind?: Kind;
  /** Free-form override (use raw CSS vars too if needed) */
  bg?: string;
  fg?: string;
  dot?: string;
  showDot?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function StatusPill({ kind = "new", bg, fg, dot, showDot = true, className, children }: Props) {
  const m = MAP[kind];
  const _bg  = bg  ?? `var(${m.bgVar})`;
  const _fg  = fg  ?? `var(${m.textVar})`;
  const _dot = dot ?? `var(${m.dotVar})`;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-[6px] rounded-full px-[9px] py-[3px] text-[11px] font-semibold",
        className,
      )}
      style={{ background: _bg, color: _fg }}
    >
      {showDot && <span className="w-[5px] h-[5px] rounded-full" style={{ background: _dot, opacity: 0.85 }} />}
      {children}
    </span>
  );
}
