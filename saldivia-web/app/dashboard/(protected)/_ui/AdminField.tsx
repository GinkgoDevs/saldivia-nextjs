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
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-xs font-bold text-secondary">
        {label}
        {required ? <span className="ml-0.5 text-red-600">*</span> : null}
      </label>
      {hint ? <p className="text-[11px] leading-relaxed text-on-surface-variant">{hint}</p> : null}
      {children}
    </div>
  );
}
