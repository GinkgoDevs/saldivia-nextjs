"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { Button, buttonClass } from "./ui/Button";

/** Orden solicitado: Home · Nosotros · Modelos · Contacto · Postventa · Trabaja con nosotros */
const NAV_LINKS = [
  { label: "Nosotros", href: "/nosotros" },
  { label: "Modelos", href: "/flota" },
  { label: "Contacto", href: "/contacto" },
  { label: "Postventa", href: "/postventa" },
  { label: "Trabaja con nosotros", href: "/trabaja-con-nosotros" },
] as const;

const SALES_TEL_DISPLAY = "+54 (0341) 492-1234";
const SALES_TEL_HREF = "tel:+543414921234";

function linkTone(scrolled: boolean, isActive: boolean) {
  if (isActive) {
    return "border-b-2 border-accent-blue pb-1 text-accent-blue";
  }
  return scrolled
    ? "text-on-surface-variant hover:text-on-surface"
    : "text-white/80 hover:text-white";
}

function isNavLinkActive(pathname: string, href: string) {
  if (href.includes("#")) {
    const base = href.split("#")[0];
    return base !== "" && pathname.startsWith(base);
  }
  return pathname.startsWith(href);
}

function MobileNavDrawer({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

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
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const focusable = panelRef.current.querySelector<HTMLElement>("a[href], button:not([disabled])");
    focusable?.focus();
  }, [open]);

  const closeAndNavigate = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[210] bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 ease-out motion-reduce:transition-none md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
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
        className={`fixed inset-y-0 right-0 z-[220] flex min-h-0 w-full max-w-[min(100vw,20rem)] flex-col overflow-hidden border-l border-outline-variant/30 bg-surface-container-lowest shadow-elev-2 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:hidden ${
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-outline-variant/25 px-3 py-2.5">
          <p className="font-headline text-xs font-bold uppercase tracking-[0.12em] text-on-surface">
            Menú
          </p>
          <Button
            type="button"
            onClick={onClose}
            variant="icon"
            className="text-on-surface ui-focus-ring"
            aria-label="Cerrar menú"
          >
            <span className="material-symbols-outlined text-2xl leading-none" aria-hidden>
              close
            </span>
          </Button>
        </div>

        <div className="relative min-h-0 flex-1 touch-manipulation">
          <nav
            className="h-full overflow-y-auto overscroll-contain px-3 py-3 pb-[7.5rem]"
            aria-label="Secciones"
          >
            <div className="flex flex-col gap-0.5">
              <Link
                href="/"
                onClick={closeAndNavigate}
                className={`flex min-h-[44px] cursor-pointer items-center rounded-md px-3 py-2 font-headline text-[15px] font-medium leading-snug transition-colors ui-focus-ring ${
                  pathname === "/"
                    ? "bg-accent-blue/10 text-accent-blue"
                    : "text-on-surface hover:bg-surface-container-low"
                }`}
              >
                Home
              </Link>

              {NAV_LINKS.map((link) => {
                const isActive = isNavLinkActive(pathname, link.href);
                return (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    onClick={closeAndNavigate}
                className={`flex min-h-[44px] cursor-pointer items-center rounded-md px-3 py-2 font-headline text-[15px] font-medium leading-snug transition-colors ui-focus-ring ${
                  isActive
                    ? "bg-accent-blue/10 text-accent-blue"
                    : "text-on-surface hover:bg-surface-container-low"
                }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div
            className="pointer-events-auto absolute inset-x-0 bottom-0 z-[2] border-t border-outline-variant/25 bg-surface-container-lowest/98 px-3 pt-2.5 shadow-elev-1 backdrop-blur-sm"
            role="region"
            aria-label="Trabaja con nosotros"
          >
            <div className="grid grid-cols-2 gap-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]">
              <Link
                href="/trabaja-con-nosotros"
                onClick={closeAndNavigate}
                className={buttonClass({
                  variant: "secondary",
                  size: "sm",
                  className: "rounded-curve-md px-2 text-[12px]",
                })}
              >
                Trabaja
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
    </>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const solidNav = hasScrolled || mobileNavOpen || pathname.startsWith("/dashboard");

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
    const updateScrollState = () => {
      setHasScrolled(window.scrollY > 0);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full overflow-visible transition-[background-color,box-shadow] duration-300 ${
        solidNav
          ? "bg-surface-container-lowest shadow-elev-1"
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

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-3 font-headline text-base leading-normal tracking-normal md:flex lg:gap-6 xl:gap-8">
          <Link
            href="/"
            className={`cursor-pointer font-medium transition-all duration-200 ui-focus-ring ${linkTone(
              solidNav,
              pathname === "/"
            )}`}
          >
            Home
          </Link>

          {NAV_LINKS.map((link) => {
            const isActive = isNavLinkActive(pathname, link.href);

            return (
              <Link
                key={link.href + link.label}
                href={link.href}
                className={`cursor-pointer whitespace-nowrap font-medium transition-all duration-200 ui-focus-ring ${linkTone(
                  solidNav,
                  isActive
                )}`}
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
            className={`md:hidden ${mobileNavOpen ? "max-md:hidden" : ""}`}
            aria-expanded={mobileNavOpen}
            aria-controls="saldivia-mobile-nav"
            aria-label="Abrir menú"
            onClick={() => setMobileNavOpen((o) => !o)}
          >
            <span
              className={`material-symbols-outlined text-2xl transition-opacity duration-200 ${
                solidNav ? "text-on-surface" : "text-white"
              }`}
              aria-hidden
            >
              menu
            </span>
          </Button>
        </div>
      </div>

      <MobileNavDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} pathname={pathname} />
    </header>
  );
}
