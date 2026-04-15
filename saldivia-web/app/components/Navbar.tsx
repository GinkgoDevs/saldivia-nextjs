"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { MegaMenuSegment } from "@/lib/supabase/mega-menu-models";
import { FLEET_SPECIALS_SECTION_ID } from "../data/flota-catalog";
import ThemeToggle from "./ThemeToggle";

const navLinksAfterModelos = [
  { label: "Tecnología", href: "#" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Postventa", href: "/postventa" },
  { label: "Contacto", href: "/contacto" },
];

/** Cierre al salir del trigger/puente/panel */
const MEGA_CLOSE_MS = 180;

function linkTone(scrolled: boolean, isActive: boolean) {
  if (isActive) {
    return "border-b-2 border-accent-blue pb-1 text-accent-blue dark:border-secondary-container dark:text-secondary-container";
  }
  return scrolled
    ? "text-on-surface-variant hover:text-primary dark:text-zinc-400 dark:hover:text-zinc-100"
    : "text-white/80 hover:text-white";
}

function ModelosMegaNav({
  scrolled,
  pathname,
  headerOffset,
  megaMenuFleet,
  onOpenChange,
}: {
  scrolled: boolean;
  pathname: string;
  headerOffset: number;
  megaMenuFleet: MegaMenuSegment[];
  onOpenChange?: (open: boolean) => void;
}) {
  const isActive =
    pathname.startsWith("/flota") || pathname.startsWith("/producto/");
  const triggerClass = `inline-flex items-center gap-0.5 text-base font-medium leading-normal tracking-normal transition-all duration-200 ${linkTone(
    scrolled,
    isActive
  )}`;

  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const [bridgeHover, setBridgeHover] = useState<{
    top: number;
    height: number;
  } | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const requestOpen = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, [cancelClose]);

  const requestClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), MEGA_CLOSE_MS);
  }, [cancelClose]);

  const closeNow = useCallback(() => {
    cancelClose();
    setOpen(false);
  }, [cancelClose]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNow();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeNow]);

  /** Velo debajo del header: fuera del área hover para que al salir del submenú se cierre */
  const backdropTop = headerOffset;
  const panelTop = Math.max(0, headerOffset - 1);

  const updateBridgeHover = useCallback(() => {
    if (!open || !triggerRef.current) {
      setBridgeHover(null);
      return;
    }
    const r = triggerRef.current.getBoundingClientRect();
    const top = r.bottom;
    /** Une el link con el panel; mínimo para que el hover no se pierda al bajar */
    const bottom = panelTop + 20;
    const height = Math.max(24, bottom - top);
    setBridgeHover({ top, height });
  }, [open, panelTop]);

  useLayoutEffect(() => {
    updateBridgeHover();
    if (!open) return;
    const onResizeScroll = () => updateBridgeHover();
    window.addEventListener("resize", onResizeScroll);
    window.addEventListener("scroll", onResizeScroll, true);
    return () => {
      window.removeEventListener("resize", onResizeScroll);
      window.removeEventListener("scroll", onResizeScroll, true);
    };
  }, [open, updateBridgeHover]);

  return (
    <>
      {/*
        Solo trigger + puente + panel cuentan como "submenú".
        El velo es hermano: al pasar al área atenuada (fuera del panel) el menú se cierra.
      */}
      <div
        ref={wrapperRef}
        className="relative"
        onMouseEnter={requestOpen}
        onMouseLeave={requestClose}
        onFocusCapture={requestOpen}
        onBlurCapture={(e) => {
          if (!wrapperRef.current?.contains(e.relatedTarget as Node | null)) {
            requestClose();
          }
        }}
      >
        <Link ref={triggerRef} href="/flota" className={triggerClass}>
          Modelos
          <span
            className={`material-symbols-outlined text-[1.125rem] leading-none opacity-70 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </Link>

        {/* Franja a ancho completo desde el link hasta el panel: mantiene hover sin incluir el velo */}
        {bridgeHover != null && bridgeHover.height > 0 && (
          <div
            aria-hidden
            className="pointer-events-auto fixed inset-x-0 z-[135] bg-transparent"
            style={{
              top: bridgeHover.top,
              height: bridgeHover.height,
            }}
          />
        )}

        <div
        className={`fixed inset-x-0 z-[140] w-full overflow-hidden border-b border-outline-variant/20 bg-[#faf9fc] !bg-[#faf9fc] shadow-[0_18px_40px_-8px_rgba(13,44,79,0.12)] transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:transition-opacity dark:border-white/10 dark:bg-[#111820] dark:!bg-[#111820] dark:shadow-[0_18px_40px_-8px_rgba(0,0,0,0.45)] ${
          open
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-2 opacity-0"
        }`}
        style={{ top: panelTop }}
        role="navigation"
        aria-label="Modelos: categorías y colectivos"
        aria-hidden={!open}
      >
        <div className="relative isolate mx-auto max-w-screen-2xl bg-[#faf9fc] !bg-[#faf9fc] px-6 py-6 dark:bg-[#111820] dark:!bg-[#111820] md:px-10 md:py-8">
          {/* Esquinas marca — mismo lenguaje que tarjetas /flota */}
          <div className="pointer-events-none absolute inset-4 md:inset-6">
            <div className="absolute left-0 top-0 h-9 w-9 border-l-[2px] border-t-[2px] border-accent-blue/90" />
            <div className="absolute right-0 top-0 h-9 w-9 border-r-[2px] border-t-[2px] border-accent-blue/90" />
            <div className="absolute bottom-0 left-0 h-9 w-9 border-b-[2px] border-l-[2px] border-accent-blue/90" />
            <div className="absolute bottom-0 right-0 h-9 w-9 border-b-[2px] border-r-[2px] border-accent-blue/90" />
          </div>

          <div className="relative grid gap-8 md:grid-cols-[minmax(200px,260px)_minmax(0,1fr)] md:gap-10 lg:gap-14">
            <div className="border-outline-variant/30 md:border-r md:pr-8 lg:pr-12 dark:border-white/10">
              <p className="mb-3 font-headline text-xs font-bold uppercase tracking-[0.12em] text-primary md:text-sm dark:text-zinc-200">
                Categorías
              </p>
              <ul className="space-y-0.5">
                {megaMenuFleet.map((seg) => (
                  <li key={seg.id}>
                    <Link
                      href={`/flota#${seg.id}`}
                      onClick={closeNow}
                      className="group/row flex items-center justify-between gap-3 rounded-sm px-2 py-2 font-headline text-base font-semibold leading-snug tracking-normal text-primary transition-colors hover:bg-surface-container-low hover:text-accent-blue dark:text-zinc-100 dark:hover:bg-white/5 dark:hover:text-secondary-container"
                    >
                      <span>{seg.title}</span>
                      <span className="material-symbols-outlined shrink-0 text-xl text-outline opacity-0 transition-opacity group-hover/row:opacity-100 dark:text-zinc-500">
                        south_west
                      </span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={`/flota#${FLEET_SPECIALS_SECTION_ID}`}
                    onClick={closeNow}
                    className="group/row flex items-center justify-between gap-3 rounded-sm px-2 py-2 font-headline text-base font-semibold leading-snug tracking-normal text-primary transition-colors hover:bg-surface-container-low hover:text-accent-blue dark:text-zinc-100 dark:hover:bg-white/5 dark:hover:text-secondary-container"
                  >
                    <span>Segmento especiales</span>
                    <span className="material-symbols-outlined shrink-0 text-xl text-outline opacity-0 transition-opacity group-hover/row:opacity-100 dark:text-zinc-500">
                      south_west
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="min-w-0">
              <p className="mb-3 font-headline text-xs font-bold uppercase tracking-[0.12em] text-primary md:text-sm dark:text-zinc-200">
                Colectivos
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-4 lg:grid-cols-3 lg:gap-x-10">
                {megaMenuFleet.map((seg) => (
                  <div key={seg.id} className="min-w-0">
                    <p className="mb-2 font-headline text-[11px] font-bold uppercase leading-normal tracking-[0.08em] text-on-surface md:text-xs dark:text-zinc-400">
                      {seg.title}
                    </p>
                    <ul className="space-y-0.5">
                      {seg.models.map((m) => (
                        <li key={m.slug}>
                          <Link
                            href={m.href}
                            onClick={closeNow}
                            className="block rounded-sm px-2 py-1.5 font-headline text-[15px] font-semibold leading-normal tracking-normal text-on-surface transition-colors hover:bg-primary/5 hover:text-primary dark:text-zinc-200 dark:hover:bg-white/5 dark:hover:text-white"
                          >
                            {m.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mt-6 border-t border-outline-variant/25 pt-4 md:mt-8 md:pt-5 dark:border-white/10">
            <Link
              href="/flota"
              onClick={closeNow}
              className="inline-flex min-h-[44px] items-center gap-2 font-headline text-sm font-bold uppercase tracking-wide text-accent-blue transition-colors hover:text-primary dark:text-secondary-container dark:hover:text-zinc-100"
            >
              <span className="h-px w-5 bg-accent-blue/80 dark:bg-secondary-container/90" />
              Ver catálogo completo
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
      </div>

      {/* Velo: no forma parte del hover del submenú; entrar aquí = fuera del menú */}
      <div
        role="presentation"
        className={`fixed inset-x-0 bottom-0 z-[130] bg-primary/[0.12] backdrop-blur-[2px] transition-[opacity,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none dark:bg-black/60 ${
          open
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
        style={{ top: backdropTop }}
        onMouseDown={(e) => {
          e.preventDefault();
          closeNow();
        }}
      />
    </>
  );
}

export default function Navbar({
  megaMenuFleet,
}: {
  megaMenuFleet: MegaMenuSegment[];
}) {
  const pathname = usePathname();
  /** Hero aún visible (home): barra transparente y enlaces claros. Fuera del hero o resto de rutas: barra sólida (evita texto blanco sobre secciones claras; estable con html { zoom }). */
  const [heroIntersects, setHeroIntersects] = useState(pathname === "/");
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [headerH, setHeaderH] = useState(80);

  useEffect(() => {
    if (pathname !== "/") {
      setHeroIntersects(false);
      return;
    }
    const hero = document.getElementById("saldivia-home-hero");
    if (!hero) {
      setHeroIntersects(false);
      return;
    }
    setHeroIntersects(true);
    const io = new IntersectionObserver(
      ([e]) => setHeroIntersects(e.isIntersecting),
      { root: null, rootMargin: "-72px 0px 0px 0px", threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);

  const solidNav = pathname !== "/" || !heroIntersects;

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const measure = () => setHeaderH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 z-50 w-full overflow-visible transition-[background-color,box-shadow] duration-300 ${
        solidNav
          ? megaMenuOpen
            ? "bg-[#faf9fc] shadow-none dark:bg-[#111820] dark:shadow-none"
            : "bg-[#faf9fc] shadow-[0px_12px_32px_rgba(13,44,79,0.08)] dark:bg-[#111820] dark:shadow-[0px_12px_32px_rgba(0,0,0,0.35)]"
          : "bg-transparent"
      }`}
    >
      <div className="relative z-[150] mx-auto flex w-full min-w-0 max-w-screen-2xl items-center gap-3 px-4 py-4 sm:gap-4 sm:px-6 md:gap-6 md:px-8">
        <Link
          href="/"
          className="relative block h-9 w-[120px] shrink-0 sm:w-[130px] md:h-10 md:w-[160px] transition-opacity duration-300"
        >
          <Image
            src="/logo-saldivia.png"
            alt="Saldivia"
            fill
            className="object-contain object-left"
            sizes="160px"
            priority
          />
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-4 font-headline text-base leading-normal tracking-normal md:flex lg:gap-8">
          <Link
            href="/"
            className={`font-medium transition-all duration-200 ${linkTone(
              solidNav,
              pathname === "/"
            )}`}
          >
            Home
          </Link>

          <ModelosMegaNav
            scrolled={solidNav}
            pathname={pathname}
            headerOffset={headerH}
            megaMenuFleet={megaMenuFleet}
            onOpenChange={setMegaMenuOpen}
          />

          {navLinksAfterModelos.map((link) => {
            const isActive =
              link.href !== "#" && pathname.startsWith(link.href);

            return (
              <Link
                key={link.href + link.label}
                href={link.href}
                className={`font-medium transition-all duration-200 ${linkTone(solidNav, isActive)}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 md:gap-3">
          <ThemeToggle scrolled={solidNav} />
          <button
            type="button"
            className={`min-h-[44px] px-6 py-2.5 text-base font-bold leading-tight transition-all duration-200 hover:opacity-90 active:scale-95 ${
              solidNav
                ? "rounded bg-primary text-white dark:bg-secondary-container dark:text-primary"
                : "rounded border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 dark:border-white/25 dark:bg-black/25 dark:text-zinc-100 dark:hover:bg-black/40"
            }`}
          >
            Cotizar
          </button>
        </div>
      </div>
    </header>
  );
}
