import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  footerLegalLinks,
  footerMainLinks,
  getSocialInstagramHref,
  getSocialLinkedinHref,
} from "../data/footer-links";
import FooterNewsletter from "./FooterNewsletter";

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

export default function Footer() {
  const instagramHref = getSocialInstagramHref();
  const linkedinHref = getSocialLinkedinHref();

  return (
    <footer className="w-full border-t border-white/10 bg-primary text-[#faf9fc]">
      <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-8 px-6 py-14 md:grid-cols-3 md:px-10 md:py-16 lg:px-12">
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
          <p className="max-w-xs text-sm font-normal normal-case leading-relaxed text-[#c4c6cf]">
            Líderes en fabricación de carrocerías de alta gama para el transporte de pasajeros.
            Ingeniería argentina con proyección internacional.
          </p>
          <div className="flex gap-2">
            <SocialLink
              href={instagramHref || "/contacto"}
              external={Boolean(instagramHref)}
              ariaLabel={instagramHref ? "Instagram (se abre en una pestaña nueva)" : "Contacto"}
              icon={<span className="material-symbols-outlined">photo_camera</span>}
            />
            <SocialLink
              href={linkedinHref || "/contacto"}
              external={Boolean(linkedinHref)}
              ariaLabel={linkedinHref ? "LinkedIn (se abre en una pestaña nueva)" : "Contacto"}
              icon={<span className="material-symbols-outlined">work</span>}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="mb-6 font-headline text-sm font-bold uppercase tracking-wide text-white">
              Links
            </h2>
            <ul className="space-y-4">
              {footerMainLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs font-bold uppercase tracking-wider text-[#c4c6cf] transition-colors hover:text-accent-blue"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-6 font-headline text-sm font-bold uppercase tracking-wide text-white">
              Legal
            </h2>
            <ul className="space-y-4">
              {footerLegalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs font-bold uppercase tracking-wider text-[#c4c6cf] transition-colors hover:text-accent-blue"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-headline text-sm font-bold uppercase tracking-wide text-white">
            Newsletter
          </h2>
          <p className="text-xs leading-relaxed text-[#c4c6cf]">
            Novedades de producto e industria. Sin spam.
          </p>
          <FooterNewsletter />
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-8 text-center md:px-12">
        <p className="font-headline text-xs font-bold uppercase tracking-widest text-[#c4c6cf]">
          © {new Date().getFullYear()} Saldivia. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
