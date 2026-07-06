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
  return (
    <nav aria-label="Pasos del formulario" className="border-b border-outline-variant/20 bg-surface-container-low/50 px-4 py-4 sm:px-6">
      <ol className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
        {steps.map((step, index) => {
          const done = index < current;
          const active = index === current;
          const clickable = onStepClick && (done || active);

          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-start gap-2.5 sm:flex-col sm:items-center sm:text-center">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick(index)}
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                  active && "bg-primary text-on-primary",
                  done && "bg-secondary/20 text-secondary",
                  !active && !done && "bg-surface-container-high text-on-surface-variant",
                  clickable && "cursor-pointer hover:ring-2 hover:ring-primary/30",
                  !clickable && "cursor-default",
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="size-4" aria-hidden /> : index + 1}
              </button>
              <div className="min-w-0 sm:mt-2">
                <p
                  className={cn(
                    "text-sm font-semibold leading-tight",
                    active ? "text-primary" : done ? "text-on-surface" : "text-on-surface-variant",
                  )}
                >
                  {step.title}
                </p>
                <p className="mt-0.5 hidden text-xs text-on-surface-variant sm:block">{step.hint}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-sm text-on-surface-variant sm:hidden">{steps[current]?.hint}</p>
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
  return <div className="space-y-5">{children}</div>;
}
