import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  footerLegalLinks,
  footerMainLinks,
  getSocialInstagramHref,
  getSocialLinkedinHref,
} from "../data/footer-links";

function SocialLink({
  href,
  external,
  ariaLabel,
  icon,
}: {
  href: string;
  external: boolean;
  ariaLabel: string;
  icon: ReactNode;
}) {
  const className =
    "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-white transition-colors hover:text-accent-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-primary";

  if (external) {
    return (
      <a
        href={href}
        className={className}
        aria-label={ariaLabel}
        target="_blank"
        rel="noopener noreferrer"
      >
        {icon}
      </a>
    );
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {icon}
    </Link>
  );
}

const footerNavLinkClass =
  "inline-block py-1 text-sm font-semibold uppercase tracking-wide text-[#c4c6cf] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:text-base";

export default function Footer() {
  const instagramHref = getSocialInstagramHref();
  const linkedinHref = getSocialLinkedinHref();

  return (
    <footer className="w-full border-t border-white/10 bg-primary text-[#faf9fc]">
      <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-2 md:gap-12 md:px-10 md:py-16 lg:px-12">
        <div className="space-y-6">
          <Link
            href="/"
            className="relative block h-9 w-[140px] shrink-0 md:h-10 md:w-[160px]"
            aria-label="Saldivia — inicio"
          >
            <Image
              src="/logo-saldivia.png"
              alt=""
              fill
              className="object-contain object-left"
              sizes="160px"
            />
          </Link>
          <p className="max-w-sm text-base font-normal normal-case leading-relaxed text-[#c4c6cf] md:text-lg md:leading-relaxed">
            Líderes en fabricación de carrocerías de alta gama para el transporte de pasajeros.{" "}
            Ingeniería y diseño argentinos con proyección internacional.
          </p>
          <div className="flex gap-2">
            <SocialLink
              href={instagramHref || "/trabaja-con-nosotros"}
              external={Boolean(instagramHref)}
              ariaLabel={instagramHref ? "Instagram (se abre en una pestaña nueva)" : "Contacto"}
              icon={<span className="material-symbols-outlined">photo_camera</span>}
            />
            <SocialLink
              href={linkedinHref || "/trabaja-con-nosotros"}
              external={Boolean(linkedinHref)}
              ariaLabel={linkedinHref ? "LinkedIn (se abre en una pestaña nueva)" : "Contacto"}
              icon={<span className="material-symbols-outlined">work</span>}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:gap-12">
          <nav aria-label="Enlaces del sitio">
            <h2 className="mb-5 font-headline text-sm font-bold uppercase tracking-wide text-white sm:mb-6 sm:text-base">
              Links
            </h2>
            <ul className="space-y-3 sm:space-y-4">
              {footerMainLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={footerNavLinkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Enlaces legales">
            <h2 className="mb-5 font-headline text-sm font-bold uppercase tracking-wide text-white sm:mb-6 sm:text-base">
              Legal
            </h2>
            <ul className="space-y-3 sm:space-y-4">
              {footerLegalLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={footerNavLinkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-8 text-center md:px-12">
        <p className="font-headline text-sm font-bold uppercase tracking-widest text-[#c4c6cf] sm:text-base">
          © {new Date().getFullYear()} Saldivia. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
