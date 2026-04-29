"use client";

import { HeroStagger } from "@/app/components/motion";
import { buttonClass } from "@/app/components/ui/Button";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  familyLabel: string;
  name: string;
  description: ReactNode;
  pdfUrl: string | null;
};

export function ProductoHeroStagger({ familyLabel, name, description, pdfUrl }: Props) {
  return (
    <HeroStagger>
      <span className="mb-0 inline-block bg-saldivia-blue px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white sm:mb-1">
        {familyLabel}
      </span>
      <h1 className="text-3xl font-black leading-tight tracking-tighter text-white sm:text-4xl sm:leading-none md:text-6xl lg:text-7xl">
        {name}
      </h1>
      <p className="max-w-2xl text-base font-light leading-relaxed text-on-primary-container sm:text-lg md:text-xl">
        {description}
      </p>
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass({ variant: "primary", size: "md" })}
            >
              Descargar ficha (PDF)
            </a>
          )}
          <Link
            href="/contacto"
            className={buttonClass({
              variant: "outline",
              size: "md",
              className: "border-white/40 text-white hover:bg-white/10",
            })}
          >
            Cotizar
          </Link>
        </div>
      </div>
    </HeroStagger>
  );
}
