"use client";

import type { FormEvent, ReactNode } from "react";
import { AdminStepIndicator, type WizardStep } from "./AdminStepWizard";

type Props = {
  id: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  steps?: WizardStep[];
  currentStep?: number;
  onStepClick?: (index: number) => void;
};

export function AdminFullscreenForm({
  id,
  onSubmit,
  children,
  steps,
  currentStep = 0,
  onStepClick,
}: Props) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {steps && steps.length > 0 ? (
        <AdminStepIndicator steps={steps} current={currentStep} onStepClick={onStepClick} />
      ) : null}
      <form id={id} className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={onSubmit}>
        <div className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden px-4 py-3 sm:px-5">
          <div className="mx-auto w-full max-w-3xl space-y-3">{children}</div>
        </div>
      </form>
    </div>
  );
}
