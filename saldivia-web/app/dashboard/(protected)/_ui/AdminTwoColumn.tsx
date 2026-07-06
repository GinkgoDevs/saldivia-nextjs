import type { ReactNode } from "react";
import { cn } from "@/app/components/ui/cn";

type Props = {
  list: ReactNode;
  form: ReactNode;
  className?: string;
  listClassName?: string;
  formClassName?: string;
};

export function AdminTwoColumn({ list, form, className, listClassName, formClassName }: Props) {
  return (
    <div className={cn("grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:gap-10", className)}>
      <div className={listClassName}>{list}</div>
      <div
        className={cn(
          "lg:sticky lg:top-6 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto",
          formClassName,
        )}
      >
        {form}
      </div>
    </div>
  );
}
