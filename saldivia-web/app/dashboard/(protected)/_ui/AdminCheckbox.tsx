import type { InputHTMLAttributes } from "react";
import { cn } from "@/app/components/ui/cn";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  description?: string;
};

export function AdminCheckbox({ id, label, description, className, ...props }: Props) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex min-h-11 cursor-pointer items-start gap-3 rounded-sm border border-outline-variant/25 bg-surface-container-low/30 p-3 transition-colors hover:bg-surface-container-low/60",
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        className="mt-1 size-4 shrink-0 cursor-pointer accent-primary"
        {...props}
      />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-on-surface">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-[11px] leading-relaxed text-on-surface-variant">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
