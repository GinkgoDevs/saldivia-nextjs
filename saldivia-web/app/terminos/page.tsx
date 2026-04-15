import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y condiciones | Saldivia",
  description: "Términos de uso del sitio web Saldivia.",
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-surface pt-24 pb-16 text-on-surface">
      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <p className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-accent-blue">
          Legal
        </p>
        <h1 className="mt-3 font-headline text-3xl font-extrabold text-primary md:text-4xl">
          Términos y condiciones de uso
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Última actualización: abril de 2026
        </p>
        <div className="mt-10 max-w-none space-y-4 font-headline text-sm leading-relaxed text-on-surface-variant">
          <p>
            El acceso y uso de este sitio web implica la aceptación de estos términos. Si no estás
            de acuerdo, te pedimos que no utilices el sitio.
          </p>
          <h2 className="mt-8 text-lg font-bold text-primary">Información del sitio</h2>
          <p>
            Los contenidos (textos, imágenes, marcas y diseño) son propiedad de Saldivia o se
            utilizan con licencia. Queda prohibida la reproducción sin autorización expresa.
          </p>
          <h2 className="mt-8 text-lg font-bold text-primary">Productos y cotizaciones</h2>
          <p>
            Las especificaciones y disponibilidad de productos pueden variar. Las cotizaciones
            formales se confirman por canales comerciales oficiales.
          </p>
          <h2 className="mt-8 text-lg font-bold text-primary">Limitación de responsabilidad</h2>
          <p>
            El sitio se ofrece &quot;tal cual&quot;. Saldivia no garantiza ausencia de errores
            técnicos ni interrupciones. No nos hacemos responsables por daños derivados del uso del
            sitio salvo lo exigido por ley.
          </p>
          <p className="mt-8 text-xs text-on-surface-variant/80">
            Texto base para revisión legal. Completar cláusulas según tu modelo de negocio y
            jurisdicción.
          </p>
        </div>
        <p className="mt-10">
          <Link
            href="/"
            className="font-headline text-sm font-semibold text-accent-blue hover:underline"
          >
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}
