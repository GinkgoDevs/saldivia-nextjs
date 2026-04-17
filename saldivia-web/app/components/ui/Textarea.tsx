import type { TextareaHTMLAttributes } from "react";
import { cn } from "./cn";

type TextareaTone = "surface" | "inverse";

type UITextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  tone?: TextareaTone;
};

const TONE_CLASS: Record<TextareaTone, string> = {
  surface:
    "bg-surface-variant text-on-surface placeholder:text-outline border border-transparent focus:border-secondary/40 focus:bg-surface-container-lowest",
  inverse:
    "bg-white/10 text-white placeholder:text-white/45 border border-transparent focus:border-accent-blue/50",
};

export function Textarea({
  className,
  tone = "surface",
  ...props
}: UITextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full resize-none rounded-curve-sm px-4 py-3 font-headline text-sm outline-none transition-all duration-base ease-brand-fluid ui-focus-ring disabled:cursor-not-allowed disabled:opacity-60",
        TONE_CLASS[tone],
        className
      )}
      {...props}
    />
  );
}
