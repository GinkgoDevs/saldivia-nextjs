"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/app/components/ui/cn";

export type AdminToastVariant = "info" | "success" | "error";

type ToastItem = {
  id: string;
  text: string;
  variant: AdminToastVariant;
};

const DURATION: Record<AdminToastVariant, number> = {
  info: 4500,
  success: 4000,
  error: 6500,
};

const STYLES: Record<AdminToastVariant, string> = {
  info: "border-outline-variant/40 bg-surface-container-lowest text-on-surface shadow-lg",
  success:
    "border-emerald-600/30 bg-emerald-50 text-emerald-950 shadow-lg dark:bg-emerald-950/90 dark:text-emerald-50",
  error: "border-red-600/30 bg-red-50 text-red-950 shadow-lg dark:bg-red-950/90 dark:text-red-50",
};

const ICONS: Record<AdminToastVariant, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  error: AlertCircle,
};

let pushToast: ((toast: Omit<ToastItem, "id">) => void) | null = null;

function show(variant: AdminToastVariant, text: string) {
  if (!text.trim()) return;
  pushToast?.({ variant, text });
}

export const adminToast = {
  info: (text: string) => show("info", text),
  success: (text: string) => show("success", text),
  error: (text: string) => show("error", text),
};

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  const Icon = ICONS[toast.variant];

  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), DURATION[toast.variant]);
    return () => window.clearTimeout(timer);
  }, [toast.id, toast.variant, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-sm border px-3 py-3 text-sm leading-snug transition-all duration-200",
        STYLES[toast.variant],
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p className="min-w-0 flex-1">{toast.text}</p>
      <button
        type="button"
        aria-label="Cerrar notificación"
        className="shrink-0 rounded-sm p-0.5 opacity-70 transition-opacity hover:opacity-100"
        onClick={() => onDismiss(toast.id)}
      >
        <X className="size-4" aria-hidden />
      </button>
    </div>
  );
}

export function AdminToastHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev.slice(-4), { ...toast, id }]);
  }, []);

  useEffect(() => {
    pushToast = add;
    return () => {
      pushToast = null;
    };
  }, [add]);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notificaciones"
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(100vw-2rem,24rem)] flex-col gap-2"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
}
