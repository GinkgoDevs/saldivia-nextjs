import type { InputHTMLAttributes } from "react";
import { cn } from "./cn";

type InputTone = "surface" | "inverse";

type UIInputProps = InputHTMLAttributes<HTMLInputElement> & {
  tone?: InputTone;
};

const TONE_CLASS: Record<InputTone, string> = {
  surface:
    "bg-surface-variant text-on-surface placeholder:text-outline border border-transparent focus:border-secondary/40 focus:bg-surface-container-lowest",
  inverse:
    "bg-white/10 text-white placeholder:text-white/45 border border-transparent focus:border-accent-blue/50",
};

export function Input({ className, tone = "surface", ...props }: UIInputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-curve-sm px-4 py-3 font-headline text-sm outline-none transition-all duration-base ease-brand-fluid ui-focus-ring disabled:cursor-not-allowed disabled:opacity-60",
        TONE_CLASS[tone],
        className
      )}
      {...props}
    />
  );
}
