"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Globe,
  Home,
  ImageIcon,
  LayoutDashboard,
  Layers,
  LogOut,
  Map,
  MapPin,
  Menu,
  Package,
  X,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buttonClass } from "@/app/components/ui/Button";
import ThemeToggle from "@/app/components/ThemeToggle";
import { cn } from "@/app/components/ui/cn";
import { AdminToastHost } from "./_ui/admin-ui";

const NAV_GROUPS = [
  {
    title: "General",
    items: [{ href: "/dashboard", label: "Inicio", icon: LayoutDashboard, exact: true }],
  },
  {
    title: "Catálogo",
    items: [
      { href: "/dashboard/models", label: "Modelos", icon: Package },
      { href: "/dashboard/model-images", label: "Galería", icon: ImageIcon },
    ],
  },
  {
    title: "Home",
    items: [
      { href: "/dashboard/home-hero", label: "Hero inicio", icon: Layers },
      { href: "/dashboard/home-showcase", label: "Showcase", icon: Globe },
    ],
  },
  {
    title: "Mapa",
    items: [
      { href: "/dashboard/locations", label: "Ubicaciones", icon: MapPin },
      { href: "/dashboard/province-projects", label: "Proyectos", icon: Map },
    ],
  },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function DashboardBrand() {
  return (
    <Link
      href="/dashboard"
      className="relative block h-8 w-[110px] shrink-0 sm:w-[120px] lg:h-9"
      aria-label="Saldivia — panel admin"
    >
      <Image
        src="/logo-saldivia.png"
        alt="Saldivia"
        fill
        className="object-contain object-left"
        sizes="120px"
        priority
      />
    </Link>
  );
}

export function DashboardFrame({
  email,
  children,
}: {
  email?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/dashboard/login");
    router.refresh();
  }

  const navLink = (item: (typeof NAV_GROUPS)[number]["items"][number], mobile = false) => {
    const active = isActive(pathname, item.href, "exact" in item ? item.exact : false);
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => mobile && setMobileOpen(false)}
        className={cn(
          "flex min-h-11 cursor-pointer items-center gap-2.5 rounded-sm px-3 py-2 text-sm font-medium transition-colors duration-200",
          mobile ? "w-full" : "w-full",
          active
            ? "bg-secondary-container/30 text-primary"
            : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
        )}
      >
        <Icon className="size-4 shrink-0" aria-hidden />
        {item.label}
      </Link>
    );
  };

  const sidebarFooter = (mobile = false) => (
    <div
      className={cn(
        "shrink-0 space-y-0.5 border-t border-outline-variant/20 pt-3",
        mobile && "mt-4 border-outline-variant/25 pt-4",
      )}
    >
      <div className="flex items-center justify-between px-3 pb-2">
        <span className="text-xs font-medium text-on-surface-variant">Tema</span>
        <ThemeToggle />
      </div>
      <Link
        href="/"
        onClick={() => mobile && setMobileOpen(false)}
        className={cn(
          "flex min-h-11 cursor-pointer items-center gap-2.5 rounded-sm px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface",
          mobile && "w-full",
        )}
      >
        <Home className="size-4 shrink-0" aria-hidden />
        Volver al sitio
      </Link>
      <button
        type="button"
        onClick={() => void signOut()}
        className={cn(
          buttonClass({ variant: "ghost", size: "sm" }),
          "flex w-full min-h-11 cursor-pointer items-center gap-2.5 px-3 text-on-surface-variant",
        )}
      >
        <LogOut className="size-4 shrink-0" aria-hidden />
        Cerrar sesión
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface font-headline text-on-surface">
      <AdminToastHost />
      {/* Mobile header */}
      <header className="sticky top-0 z-40 border-b border-outline-variant/35 bg-surface-container-lowest/95 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <DashboardBrand />
            <p className="mt-1 truncate text-xs text-on-surface-variant">{email ?? "Admin"}</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              className={buttonClass({ variant: "outline", size: "sm", className: "min-h-11 min-w-11 p-0" })}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {mobileOpen ? (
          <nav className="flex max-h-[min(70dvh,calc(100dvh-4.5rem))] flex-col border-t border-outline-variant/25 px-3 py-4">
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain">
              {NAV_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">
                    {group.title}
                  </p>
                  <div className="space-y-0.5">{group.items.map((item) => navLink(item, true))}</div>
                </div>
              ))}
            </div>
            {sidebarFooter(true)}
          </nav>
        ) : null}
      </header>

      <div className="mx-auto flex w-full max-w-screen-2xl">
        {/* Desktop sidebar — altura completa; nav scrollea si hace falta */}
        <aside className="sticky top-0 hidden h-[calc(100dvh/0.9)] max-h-[calc(100dvh/0.9)] w-56 shrink-0 flex-col border-r border-outline-variant/30 bg-surface-container-lowest lg:flex">
          <div className="flex min-h-0 flex-1 flex-col px-3 py-4">
            <div className="mb-4 shrink-0 px-2">
              <DashboardBrand />
              <p className="mt-2 truncate text-xs text-on-surface-variant">{email ?? "Panel admin"}</p>
            </div>
            <nav
              className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain py-1"
              aria-label="Navegación del panel"
            >
              {NAV_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">
                    {group.title}
                  </p>
                  <div className="space-y-0.5">{group.items.map((item) => navLink(item))}</div>
                </div>
              ))}
            </nav>
            {sidebarFooter()}
          </div>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
