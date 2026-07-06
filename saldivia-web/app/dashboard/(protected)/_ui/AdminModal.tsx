"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { buttonClass } from "@/app/components/ui/Button";
import { cn } from "@/app/components/ui/cn";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  maxWidthClass?: string;
  /** Ocupa toda la pantalla; la cruz queda fija en la esquina del header. */
  fullscreen?: boolean;
  footer?: ReactNode;
};

export function AdminModal({
  open,
  onClose,
  title,
  children,
  className,
  maxWidthClass = "max-w-4xl",
  fullscreen = false,
  footer,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  if (fullscreen) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        className={cn("fixed inset-0 z-50 flex flex-col bg-surface-container-lowest", className)}
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-outline-variant/25 bg-surface-container-low px-4 py-2.5 sm:px-5">
          <h2
            id="admin-modal-title"
            className="min-w-0 truncate text-base font-bold uppercase tracking-tight text-primary sm:text-lg"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className={buttonClass({
              variant: "ghost",
              size: "sm",
              className: "min-h-11 min-w-11 shrink-0 cursor-pointer p-0",
            })}
          >
            <X className="size-5" aria-hidden />
          </button>
        </header>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        {footer ? (
          <footer className="shrink-0 border-t border-outline-variant/25 bg-surface-container-low px-4 py-2.5 sm:px-5">
            {footer}
          </footer>
        ) : null}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6 md:py-10">
      <button
        type="button"
        aria-label="Cerrar ventana"
        className="fixed inset-0 cursor-pointer bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        className={cn(
          "relative z-10 my-auto flex w-full flex-col overflow-hidden rounded-sm border border-outline-variant/30 bg-surface-container-lowest shadow-2xl",
          maxWidthClass,
          className,
        )}
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-outline-variant/25 bg-surface-container-low px-5 py-4">
          <h2 id="admin-modal-title" className="text-base font-bold uppercase tracking-tight text-primary sm:text-lg">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className={buttonClass({
              variant: "ghost",
              size: "sm",
              className: "min-h-10 min-w-10 shrink-0 cursor-pointer p-0",
            })}
          >
            <X className="size-5" aria-hidden />
          </button>
        </header>
        <div className="max-h-[min(78vh,820px)] overflow-y-auto px-5 py-5">{children}</div>
        {footer ? (
          <footer className="shrink-0 border-t border-outline-variant/25 bg-surface-container-low px-5 py-4">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}
