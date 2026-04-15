"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type Props = {
  /** Barra con fondo sólido (scroll) vs transparente sobre hero */
  scrolled: boolean;
};

/**
 * Toggle claro/oscuro: objetivo táctil ≥44px, foco visible, etiqueta para lectores de pantalla.
 */
export default function ThemeToggle({ scrolled }: Props) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className="h-11 w-11 shrink-0 rounded border border-outline-variant/30 bg-surface-container-low/80 dark:border-white/15 dark:bg-white/5"
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0a0f14] ${
        scrolled
          ? "border-outline-variant/45 bg-surface-container-low text-on-surface hover:bg-surface-container dark:border-white/12 dark:bg-white/[0.06] dark:text-zinc-100 dark:hover:bg-white/10"
          : "border-white/35 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 dark:border-white/25 dark:bg-black/25 dark:text-zinc-100 dark:hover:bg-black/35"
      }`}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      aria-pressed={isDark}
    >
      {isDark ? (
        <Sun className="h-[22px] w-[22px]" strokeWidth={2} aria-hidden />
      ) : (
        <Moon className="h-[22px] w-[22px]" strokeWidth={2} aria-hidden />
      )}
    </button>
  );
}
