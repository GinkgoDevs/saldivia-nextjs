import type { HTMLAttributes } from "react";
import { cn } from "./cn";

type ChipVariant = "hero" | "surface";

type UIChipProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: ChipVariant;
};

const VARIANT_CLASS: Record<ChipVariant, string> = {
  hero: "ui-chip",
  surface:
    "inline-flex min-h-[36px] items-center rounded-curve-sm border border-outline-variant/35 bg-surface-container-low px-3 py-1.5 font-headline text-[11px] font-bold uppercase tracking-[0.16em] text-primary",
};

export function Chip({ className, variant = "surface", ...props }: UIChipProps) {
  return (
    <span className={cn(VARIANT_CLASS[variant], className)} {...props} />
  );
}
