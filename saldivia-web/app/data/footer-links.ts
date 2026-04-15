/** Enlaces del footer: rutas internas y redes (opcional vía .env). */

export const footerMainLinks = [
  { label: "Inicio", href: "/" },
  { label: "Modelos", href: "/flota" },
  { label: "Tecnología", href: "/tecnologia" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Postventa", href: "/postventa" },
  { label: "Contacto", href: "/contacto" },
] as const;

export const footerLegalLinks = [
  { label: "Privacidad", href: "/privacidad" },
  { label: "Términos", href: "/terminos" },
  { label: "Soporte", href: "/postventa" },
  { label: "Distribuidores", href: "/contacto" },
] as const;

export function getSocialInstagramHref(): string {
  return process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM?.trim() || "";
}

export function getSocialLinkedinHref(): string {
  return process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN?.trim() || "";
}
