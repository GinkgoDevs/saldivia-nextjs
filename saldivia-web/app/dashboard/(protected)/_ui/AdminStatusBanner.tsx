import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/app/components/ui/cn";

type Variant = "info" | "success" | "error";

type Props = {
  children: string;
  variant?: Variant;
  className?: string;
};

const STYLES: Record<Variant, string> = {
  info: "border-outline-variant/40 bg-surface-container-high text-on-surface",
  success: "border-emerald-600/30 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100",
  error: "border-red-600/30 bg-red-50 text-red-950 dark:bg-red-950/30 dark:text-red-100",
};

const ICONS: Record<Variant, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  error: AlertCircle,
};

export function AdminStatusBanner({ children, variant = "info", className }: Props) {
  const Icon = ICONS[variant];
  return (
    <p
      role="status"
      className={cn(
        "flex items-start gap-2 rounded-sm border px-3 py-2.5 text-sm leading-relaxed",
        STYLES[variant],
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}
