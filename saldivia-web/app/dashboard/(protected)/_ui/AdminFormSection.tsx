import type { ReactNode } from "react";
import { cn } from "@/app/components/ui/cn";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function AdminFormSection({ title, description, children, className }: Props) {
  return (
    <fieldset
      className={cn(
        "space-y-4 rounded-sm border border-outline-variant/25 bg-surface-container-low/40 p-4",
        className,
      )}
    >
      <legend className="px-1 text-xs font-bold uppercase tracking-wide text-secondary">{title}</legend>
      {description ? (
        <p className="-mt-2 text-[11px] leading-relaxed text-on-surface-variant">{description}</p>
      ) : null}
      {children}
    </fieldset>
  );
}
