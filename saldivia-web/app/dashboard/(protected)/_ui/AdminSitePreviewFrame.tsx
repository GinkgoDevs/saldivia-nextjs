import type { ReactNode } from "react";
import { cn } from "@/app/components/ui/cn";

type Props = {
  maxWidth?: string;
  frameClassName?: string;
  hint?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AdminSitePreviewFrame({
  maxWidth = "max-w-sm",
  frameClassName,
  hint,
  children,
  footer,
}: Props) {
  return (
    <div className="space-y-2">
      {hint ? <p className="text-[11px] leading-relaxed text-on-surface-variant">{hint}</p> : null}
      <div className={cn("mx-auto w-full", maxWidth)}>
        <div className={cn("overflow-hidden", frameClassName)}>
          {children}
          {footer}
        </div>
      </div>
    </div>
  );
}
