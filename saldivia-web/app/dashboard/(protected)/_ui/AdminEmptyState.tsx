import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/app/components/ui/cn";

type Props = {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  action?: ReactNode;
  compact?: boolean;
  as?: "li" | "div";
  className?: string;
};

export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  action,
  compact,
  as: Tag = "li",
  className,
}: Props) {
  return (
    <Tag
      className={cn(
        "flex flex-col items-center justify-center rounded-sm border border-dashed border-outline-variant/35 bg-surface-container-low/25 text-center",
        compact ? "px-4 py-5" : "px-6 py-10",
        className,
      )}
    >
      <div
        className="flex size-11 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant"
        aria-hidden
      >
        <Icon className="size-5" />
      </div>
      <p className="mt-3 text-sm font-semibold text-on-surface">{title}</p>
      <div className="mt-1 max-w-md text-xs leading-relaxed text-on-surface-variant">{description}</div>
      {action ? <div className="mt-4">{action}</div> : null}
    </Tag>
  );
}
