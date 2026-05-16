"use client";

import * as React from "react";
import { clsx } from "clsx";

type Variant = "primary" | "accent" | "ghost" | "quiet";
type Size = "sm" | "md" | "lg" | "icon" | "icon-sm";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  asChild?: false;
};

/**
 * Button — Happy Moments premium variants.
 *  - primary: ink-on-cream (default action)
 *  - accent:  terracotta-on-white (most-promoted action)
 *  - ghost:   bordered, transparent (secondary)
 *  - quiet:   no border (tertiary / utility)
 */
export function Button({
  variant = "ghost",
  size = "md",
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={clsx(
        "inline-flex items-center gap-2 font-medium whitespace-nowrap select-none",
        "transition-[background,border-color,color] duration-150",
        "active:translate-y-[0.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
        size === "sm"      && "h-[30px] px-[11px] text-[12px] rounded-[10px]",
        size === "md"      && "h-[36px] px-[14px] text-[13px] rounded-[14px]",
        size === "lg"      && "h-[44px] px-[20px] text-[14px] rounded-[14px]",
        size === "icon"    && "h-[36px] w-[36px] justify-center rounded-[14px]",
        size === "icon-sm" && "h-[30px] w-[30px] justify-center rounded-[10px]",
        variant === "primary" && "bg-[var(--text)] text-[var(--bg2)] border border-[var(--text)] hover:bg-[#2a2520]",
        variant === "accent"  && "bg-[var(--crm-accent)] text-white border border-[var(--crm-accent)] hover:bg-[#a44d31] hover:border-[#a44d31]",
        variant === "ghost"   && "bg-transparent text-[var(--text2)] border border-[var(--border)] hover:bg-[var(--bg2)]",
        variant === "quiet"   && "bg-transparent text-[var(--text3)] border border-transparent hover:bg-[var(--bg3)] hover:text-[var(--text)]",
        className,
      )}
    >
      {children}
    </button>
  );
}
