import type { ReactNode } from "react";
import { cn } from "@/app/components/ui/cn";

type Props = {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
};

export function AdminField({ id, label, hint, required, children, className }: Props) {
  return (
    <div className={cn("space-y-1", className)}>
      <label htmlFor={id} className="block text-[11px] font-bold text-secondary">
        {label}
        {required ? <span className="ml-0.5 text-red-600">*</span> : null}
      </label>
      <p
        className={cn(
          "min-h-4 text-[10px] leading-snug text-on-surface-variant",
          !hint && "pointer-events-none select-none opacity-0",
        )}
        aria-hidden={!hint}
      >
        {hint ?? "\u00A0"}
      </p>
      {children}
    </div>
  );
}
