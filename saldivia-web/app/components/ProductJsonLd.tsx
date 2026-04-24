import { getSiteUrl } from "@/lib/site-url";

type Props = {
  name: string;
  description: string | null;
  imageUrl: string;
  slug: string;
};

export function ProductJsonLd({ name, description, imageUrl, slug }: Props) {
  const base = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: (description?.trim() || name).slice(0, 2000),
    image: imageUrl.startsWith("http") ? imageUrl : `${base}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`,
    url: `${base}/producto/${encodeURIComponent(slug)}`,
    brand: { "@type": "Brand", name: "Saldivia Carrocerías" },
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
