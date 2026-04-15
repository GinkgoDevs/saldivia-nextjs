"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "./components/ThemeProvider";

/**
 * Capa única de providers del cliente para el layout raíz.
 * Agregar aquí (envueltos en orden) futuros contextos: Apollo, React Query, etc.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
