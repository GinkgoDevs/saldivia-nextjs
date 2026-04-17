"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { MegaMenuSegment } from "@/lib/supabase/mega-menu-models";
import { FLEET_SPECIALS_SECTION_ID } from "../data/flota-catalog";
import ThemeToggle from "./ThemeToggle";
import { Button, buttonClass } from "./ui/Button";

const navLinksAfterModelos = [
  { label: "Tecnología", href: "/tecnologia" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Postventa", href: "/postventa" },
  { label: "Contacto", href: "/contacto" },
];

/** Mismo teléfono comercial que en /contacto — contacto directo desde el menú móvil */
const SALES_TEL_DISPLAY = "+54 (0341) 492-1234";
const SALES_TEL_HREF = "tel:+543414921234";

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
        <Link
          ref={triggerRef}
          href="/flota"
          className={`cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9fc] dark:focus-visible:ring-offset-[#111820] ${triggerClass}`}
        >
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

function MobileNavDrawer({
  open,
  onClose,
  megaMenuFleet,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  megaMenuFleet: MegaMenuSegment[];
  pathname: string;
}) {
  const [fleetOpen, setFleetOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) setFleetOpen(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;
    const focusable = panelRef.current.querySelector<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    focusable?.focus();
  }, [open]);

  const closeAndNavigate = useCallback(() => {
    onClose();
  }, [onClose]);

  const modelosActive =
    pathname.startsWith("/flota") || pathname.startsWith("/producto/");

  return (
    <>
      <div
        className={`fixed inset-0 z-[210] bg-primary/[0.35] backdrop-blur-[2px] transition-opacity duration-300 ease-out motion-reduce:transition-none dark:bg-black/65 md:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        id="saldivia-mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Navegación principal"
        aria-hidden={!open}
        tabIndex={-1}
        className={`fixed inset-y-0 right-0 z-[220] flex min-h-0 w-full max-w-[min(100vw,20rem)] flex-col overflow-hidden border-l border-outline-variant/30 bg-[#faf9fc] shadow-[-12px_0_40px_-8px_rgba(13,44,79,0.18)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none dark:border-white/10 dark:bg-[#111820] dark:shadow-[-12px_0_40px_-8px_rgba(0,0,0,0.5)] md:hidden ${
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-outline-variant/25 px-3 py-2.5 dark:border-white/10">
          <p className="font-headline text-xs font-bold uppercase tracking-[0.12em] text-primary dark:text-zinc-200">
            Menú
          </p>
          <Button
            type="button"
            onClick={onClose}
            variant="icon"
            className="text-on-surface dark:text-zinc-100"
            aria-label="Cerrar menú"
          >
            <span className="material-symbols-outlined text-2xl leading-none" aria-hidden>
              close
            </span>
          </Button>
        </div>

        <div className="relative min-h-0 flex-1 touch-manipulation">
          <nav
            className="h-full overflow-y-auto overscroll-contain px-3 py-3 pb-[13.5rem]"
            aria-label="Secciones"
          >
          <div className="flex flex-col gap-0.5">
          <Link
            href="/"
            onClick={closeAndNavigate}
            className={`flex min-h-[44px] cursor-pointer items-center rounded-md px-3 py-2 font-headline text-[15px] font-medium leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9fc] dark:focus-visible:ring-offset-[#111820] ${
              pathname === "/"
                ? "bg-accent-blue/10 text-accent-blue dark:bg-secondary-container/15 dark:text-secondary-container"
                : "text-primary hover:bg-surface-container-low dark:text-zinc-100 dark:hover:bg-white/5"
            }`}
          >
            Home
          </Link>

          <div className="border-t border-outline-variant/20 pt-1.5 dark:border-white/10">
            <button
              type="button"
              onClick={() => setFleetOpen((v) => !v)}
              aria-expanded={fleetOpen}
              aria-controls="mobile-fleet-panel"
              id="mobile-fleet-trigger"
              className={`flex min-h-[44px] w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left font-headline text-[15px] font-medium leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9fc] dark:focus-visible:ring-offset-[#111820] ${
                modelosActive
                  ? "text-accent-blue dark:text-secondary-container"
                  : "text-primary hover:bg-surface-container-low dark:text-zinc-100 dark:hover:bg-white/5"
              }`}
            >
              <span>Modelos</span>
              <span
                className={`material-symbols-outlined text-xl transition-transform duration-200 motion-reduce:transition-none ${
                  fleetOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              >
                expand_more
              </span>
            </button>

            <div
              id="mobile-fleet-panel"
              role="region"
              aria-labelledby="mobile-fleet-trigger"
              hidden={!fleetOpen}
              className="mt-1 pb-2"
            >
              <div className="ml-1 space-y-3 border-l-2 border-accent-blue/35 pl-3 dark:border-secondary-container/40">
                {megaMenuFleet.map((seg) => (
                  <div key={seg.id} className="space-y-1">
                    <Link
                      href={`/flota#${seg.id}`}
                      onClick={closeAndNavigate}
                      className="flex min-h-[40px] cursor-pointer items-center rounded-md py-2 pl-1 font-headline text-sm font-bold uppercase tracking-wide text-on-surface transition-colors hover:text-accent-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:text-zinc-300 dark:hover:text-secondary-container"
                    >
                      {seg.title}
                    </Link>
                    <ul className="space-y-0.5">
                      {seg.models.map((m) => (
                        <li key={m.slug}>
                          <Link
                            href={m.href}
                            onClick={closeAndNavigate}
                            className="flex min-h-[44px] cursor-pointer items-center rounded-md px-2 py-2 font-headline text-[15px] font-semibold text-on-surface-variant transition-colors hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100"
                          >
                            {m.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <Link
                  href={`/flota#${FLEET_SPECIALS_SECTION_ID}`}
                  onClick={closeAndNavigate}
                  className="flex min-h-[44px] cursor-pointer items-center rounded-md py-2 pl-1 font-headline text-sm font-semibold text-primary transition-colors hover:text-accent-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:text-zinc-200"
                >
                  Segmento especiales
                </Link>
                <Link
                  href="/flota"
                  onClick={closeAndNavigate}
                  className={buttonClass({
                    variant: "link-cta",
                    size: "sm",
                    className: "min-h-[44px] justify-start rounded-md py-2 pl-1 text-left",
                  })}
                >
                  <span className="material-symbols-outlined text-lg" aria-hidden>
                    grid_view
                  </span>
                  Catálogo completo
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-outline-variant/20 pt-1.5 dark:border-white/10">
            {navLinksAfterModelos.map((link) => {
              const isActive =
                link.href !== "#" && pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  onClick={closeAndNavigate}
                  className={`flex min-h-[44px] cursor-pointer items-center rounded-md px-3 py-2 font-headline text-[15px] font-medium leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9fc] dark:focus-visible:ring-offset-[#111820] ${
                    isActive
                      ? "bg-accent-blue/10 text-accent-blue dark:bg-secondary-container/15 dark:text-secondary-container"
                      : "text-primary hover:bg-surface-container-low dark:text-zinc-100 dark:hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          </div>
        </nav>

        <div
          className="pointer-events-auto absolute inset-x-0 bottom-0 z-[2] border-t border-outline-variant/25 bg-[#faf9fc]/98 px-3 pt-2.5 shadow-[0_-10px_28px_-6px_rgba(13,44,79,0.12)] backdrop-blur-sm dark:border-white/10 dark:bg-[#111820]/98 dark:shadow-[0_-10px_28px_-6px_rgba(0,0,0,0.45)]"
          role="region"
          aria-label="Cotizar y contacto"
        >
          <p className="mb-1.5 font-headline text-[10px] font-bold uppercase tracking-[0.14em] text-on-surface-variant dark:text-zinc-500">
            ¿Necesitás presupuesto?
          </p>
          <div className="flex flex-col gap-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]">
            <Link
              href="/contacto"
              onClick={closeAndNavigate}
              className={buttonClass({
                variant: "secondary",
                size: "md",
                className: "w-full rounded-curve-md px-3 text-[15px]",
              })}
            >
              <span className="material-symbols-outlined text-[1.25rem]" aria-hidden>
                request_quote
              </span>
              Cotizar
            </Link>
            <div className="grid grid-cols-2 gap-1.5">
              <Link
                href="/contacto"
                onClick={closeAndNavigate}
                className={buttonClass({
                  variant: "outline",
                  size: "sm",
                  className: "rounded-curve-md px-2 text-[13px]",
                })}
              >
                Contacto
              </Link>
              <a
                href={SALES_TEL_HREF}
                className={buttonClass({
                  variant: "outline",
                  size: "sm",
                  className: "rounded-curve-md px-2 text-[13px]",
                })}
                aria-label={`Llamar a ${SALES_TEL_DISPLAY}`}
              >
                <span className="material-symbols-outlined text-[1.125rem]" aria-hidden>
                  call
                </span>
                Llamar
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
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
  const [desktopScrolled, setDesktopScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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

  const solidNav =
    pathname !== "/" || !heroIntersects || mobileNavOpen || desktopScrolled;

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const measure = () => setHeaderH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const closeIfDesktop = () => {
      if (mq.matches) setMobileNavOpen(false);
    };
    mq.addEventListener("change", closeIfDesktop);
    return () => mq.removeEventListener("change", closeIfDesktop);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const updateDesktopScrollState = () => {
      setDesktopScrolled(mq.matches && window.scrollY > 0);
    };

    updateDesktopScrollState();
    window.addEventListener("scroll", updateDesktopScrollState, { passive: true });
    mq.addEventListener("change", updateDesktopScrollState);

    return () => {
      window.removeEventListener("scroll", updateDesktopScrollState);
      mq.removeEventListener("change", updateDesktopScrollState);
    };
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
      <div className="relative z-[200] mx-auto flex w-full min-w-0 max-w-screen-2xl items-center gap-2 px-4 py-4 sm:gap-3 sm:px-6 md:gap-6 md:px-8">
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
            className={`cursor-pointer font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9fc] dark:focus-visible:ring-offset-[#111820] ${linkTone(
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
                className={`cursor-pointer font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9fc] dark:focus-visible:ring-offset-[#111820] ${linkTone(solidNav, isActive)}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
          <div className={mobileNavOpen ? "max-md:hidden" : "contents"}>
            <ThemeToggle scrolled={solidNav} />
          </div>
          <Button
            type="button"
            variant="icon"
            className={`md:hidden ${
              mobileNavOpen ? "max-md:hidden" : ""
            }`}
            aria-expanded={mobileNavOpen}
            aria-controls="saldivia-mobile-nav"
            aria-label="Abrir menú"
            onClick={() => setMobileNavOpen((o) => !o)}
          >
            <span
              className={`material-symbols-outlined text-2xl transition-opacity duration-200 ${
                solidNav
                  ? "text-primary dark:text-zinc-100"
                  : "text-white dark:text-zinc-100"
              }`}
              aria-hidden
            >
              menu
            </span>
          </Button>
          <Link
            href="/contacto"
            className={buttonClass({
              variant: solidNav ? "secondary" : "outline",
              size: "md",
              className: `hidden sm:px-6 sm:text-base md:inline-flex ${
                solidNav
                  ? "rounded-curve-pill text-white shadow-elev-1"
                  : "rounded-curve-pill border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white dark:border-white/25 dark:bg-black/25 dark:text-zinc-100 dark:hover:bg-black/40"
              }`,
            })}
          >
            Cotizar
          </Link>
        </div>
      </div>

      <MobileNavDrawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        megaMenuFleet={megaMenuFleet}
        pathname={pathname}
      />
    </header>
  );
}
