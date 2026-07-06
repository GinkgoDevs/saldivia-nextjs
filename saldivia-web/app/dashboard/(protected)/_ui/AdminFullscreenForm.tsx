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
    <>
      {steps && steps.length > 0 ? (
        <AdminStepIndicator steps={steps} current={currentStep} onStepClick={onStepClick} />
      ) : null}
      <form id={id} className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto max-w-3xl space-y-5">{children}</div>
        </div>
      </form>
    </>
  );
}
