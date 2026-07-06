"use client";

import { HeroStagger } from "@/app/components/motion";
import {
  PAGE_HERO_EYEBROW_CLASS,
  PAGE_HERO_LEAD_CLASS,
  PAGE_HERO_TITLE_CLASS,
} from "@/app/components/PageHero";
import { buttonClass } from "@/app/components/ui/Button";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  name: string;
  description: ReactNode;
  pdfUrl: string | null;
};

export function ProductoHeroStagger({ name, description, pdfUrl }: Props) {
  return (
    <HeroStagger>
      <span className={PAGE_HERO_EYEBROW_CLASS}>Ficha de producto</span>
      <h1 className={PAGE_HERO_TITLE_CLASS}>{name}</h1>
      <p className={PAGE_HERO_LEAD_CLASS}>{description}</p>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        {pdfUrl ? (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass({ variant: "primary", size: "lg" })}
          >
            Descargar ficha (PDF)
          </a>
        ) : null}
        <Link
          href="/trabaja-con-nosotros"
          className={buttonClass({
            variant: "on-dark-outline",
            size: "lg",
          })}
        >
          Contacto comercial
        </Link>
      </div>
    </HeroStagger>
  );
}
