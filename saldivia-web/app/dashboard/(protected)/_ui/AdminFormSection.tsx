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
        "space-y-2.5 rounded-sm border border-outline-variant/25 bg-surface-container-low/40 p-3",
        className,
      )}
    >
      <legend className="px-1 text-[11px] font-bold uppercase tracking-wide text-secondary">{title}</legend>
      {description ? (
        <p className="-mt-1 line-clamp-2 text-[10px] leading-snug text-on-surface-variant">{description}</p>
      ) : null}
      {children}
    </fieldset>
  );
}
