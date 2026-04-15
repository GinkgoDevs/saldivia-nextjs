import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de privacidad | Saldivia",
  description: "Política de privacidad y tratamiento de datos personales.",
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-surface pt-24 pb-16 text-on-surface">
      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <p className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-accent-blue">
          Legal
        </p>
        <h1 className="mt-3 font-headline text-3xl font-extrabold text-primary md:text-4xl">
          Política de privacidad
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Última actualización: abril de 2026
        </p>
        <div className="mt-10 max-w-none space-y-4 font-headline text-sm leading-relaxed text-on-surface-variant">
          <p>
            Saldivia se compromete a proteger la privacidad de las personas que visitan este sitio
            web o se comunican con nosotros. Esta página describe de forma general qué información
            puede recopilarse y cómo se utiliza.
          </p>
          <h2 className="mt-8 text-lg font-bold text-primary">Datos que podemos recibir</h2>
          <p>
            Al completar formularios de contacto, cotización o newsletter, podemos recibir nombre,
            email, teléfono y el mensaje que nos envíes. También se registran datos técnicos
            habituales del navegador (por ejemplo dirección IP aproximada) con fines de seguridad y
            estadísticas agregadas.
          </p>
          <h2 className="mt-8 text-lg font-bold text-primary">Finalidad</h2>
          <p>
            Usamos estos datos para responder consultas, gestionar relaciones comerciales y mejorar
            nuestros servicios. No vendemos listas de contacto a terceros.
          </p>
          <h2 className="mt-8 text-lg font-bold text-primary">Tus derechos</h2>
          <p>
            Podés solicitar acceso, rectificación o baja de tus datos escribiendo a través de{" "}
            <Link href="/contacto" className="font-semibold text-accent-blue hover:underline">
              contacto
            </Link>
            .
          </p>
          <p className="mt-8 text-xs text-on-surface-variant/80">
            Este texto es orientativo. Ajustalo con asesoría legal según la normativa aplicable en
            Argentina (Ley 25.326 y complementarias).
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
