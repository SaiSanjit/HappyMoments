"use client";

import * as React from "react";
import { clsx } from "clsx";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  padded?: boolean;
  /** Use a lighter inner padding when content is dense. */
  compact?: boolean;
};

/** Cream-paper card — soft border, restrained shadow. */
export function Card({ padded, compact, className, children, ...rest }: Props) {
  return (
    <div
      {...rest}
      className={clsx(
        "bg-[var(--crm-surface)] border border-[var(--border)] rounded-[var(--r-lg)]",
        "shadow-[0_2px_4px_rgba(28,25,21,0.04),0_1px_0_rgba(28,25,21,0.03)]",
        padded && (compact ? "p-4" : "p-[22px]"),
        className,
      )}
    >
      {children}
    </div>
  );
}
