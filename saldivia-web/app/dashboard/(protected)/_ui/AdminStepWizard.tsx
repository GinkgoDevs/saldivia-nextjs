import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/app/components/ui/cn";

export type WizardStep = {
  id: string;
  title: string;
  hint: string;
};

type IndicatorProps = {
  steps: WizardStep[];
  current: number;
  onStepClick?: (index: number) => void;
};

export function AdminStepIndicator({ steps, current, onStepClick }: IndicatorProps) {
  const activeHint = steps[current]?.hint;

  return (
    <nav
      aria-label="Pasos del formulario"
      className="shrink-0 border-b border-outline-variant/20 bg-surface-container-low/50 px-4 py-2 sm:px-5"
    >
      <ol className="flex items-center justify-between gap-1 sm:gap-2">
        {steps.map((step, index) => {
          const done = index < current;
          const active = index === current;
          const clickable = onStepClick && (done || active);

          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-center gap-2 sm:flex-col sm:gap-1">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick(index)}
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors sm:size-8 sm:text-sm",
                  active && "bg-primary-brand text-on-primary",
                  done && "bg-secondary/20 text-secondary",
                  !active && !done && "bg-surface-container-high text-on-surface-variant",
                  clickable && "cursor-pointer hover:ring-2 hover:ring-primary/30",
                  !clickable && "cursor-default",
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="size-3.5 sm:size-4" aria-hidden /> : index + 1}
              </button>
              <p
                className={cn(
                  "min-w-0 truncate text-[11px] font-semibold leading-tight sm:text-center sm:text-xs",
                  active ? "text-primary" : done ? "text-on-surface" : "text-on-surface-variant",
                )}
              >
                {step.title}
              </p>
            </li>
          );
        })}
      </ol>
      {activeHint ? (
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-on-surface-variant">{activeHint}</p>
      ) : null}
    </nav>
  );
}

type PanelProps = {
  stepId: string;
  currentStepId: string;
  children: ReactNode;
};

export function AdminWizardPanel({ stepId, currentStepId, children }: PanelProps) {
  if (stepId !== currentStepId) return null;
  return <div className="space-y-3">{children}</div>;
}
