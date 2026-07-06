import type { SelectHTMLAttributes } from "react";
import { cn } from "@/app/components/ui/cn";

type Props = SelectHTMLAttributes<HTMLSelectElement>;

export function AdminSelect({ className, children, ...props }: Props) {
  return (
    <select
      className={cn(
        "h-11 w-full cursor-pointer rounded-curve-sm border border-outline-variant/40 bg-surface-container-lowest px-3 text-sm text-on-surface outline-none transition-colors duration-200",
        "focus:border-secondary/50 focus:ring-2 focus:ring-secondary/20",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
