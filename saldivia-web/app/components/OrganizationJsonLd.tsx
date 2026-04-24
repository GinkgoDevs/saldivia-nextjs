import { getSiteUrl } from "@/lib/site-url";

const ORG = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Saldivia Carrocerías",
  url: "" as string,
  description:
    "Fabricación de carrocerías para el transporte de pasajeros en Argentina. Más de 40 años de excelencia industrial.",
} as const;

export function OrganizationJsonLd() {
  const base = getSiteUrl();
  const data = { ...ORG, url: base };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
