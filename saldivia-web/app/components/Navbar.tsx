"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Modelos", href: "/flota" },
  { label: "Tecnología", href: "#" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Postventa", href: "/postventa" },
  { label: "Contacto", href: "/contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#faf9fc] shadow-[0px_12px_32px_rgba(13,44,79,0.08)]"
          : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">
        <a
          href="/"
          className="relative block h-9 w-[140px] shrink-0 md:h-10 md:w-[160px] transition-opacity duration-300"
        >
          <Image
            src="/logo-saldivia.png"
            alt="Saldivia"
            fill
            className="object-contain object-left"
            sizes="160px"
            priority
          />
        </a>

        <nav className="hidden md:flex gap-8 items-center font-headline tracking-tight">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href) && link.href !== "#";

            return (
              <a
                key={link.href + link.label}
                href={link.href}
                className={`font-medium transition-all duration-200 ${
                  isActive
                    ? "text-accent-blue border-b-2 border-accent-blue pb-1"
                    : scrolled
                    ? "text-on-surface-variant hover:text-primary"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <button
          className={`px-6 py-2.5 rounded font-bold transition-all duration-200 hover:opacity-90 active:scale-95 ${
            scrolled
              ? "bg-primary text-white"
              : "bg-white/10 border border-white/30 text-white backdrop-blur-sm hover:bg-white/20"
          }`}
        >
          Cotizar
        </button>
      </div>
    </header>
  );
}
