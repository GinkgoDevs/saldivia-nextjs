import type { ReactNode } from "react";
import { cn } from "@/app/components/ui/cn";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function AdminListPanel({ title, description, action, children, className }: Props) {
  return (
    <section className={className}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary">{title}</h2>
          {description ? (
            <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div
        className={cn(
          "mt-4 overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-lowest",
        )}
      >
        {children}
      </div>
    </section>
  );
}
