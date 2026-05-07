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
    <HeroStagger className="flex max-w-4xl flex-col gap-6 md:max-w-5xl md:gap-8 lg:gap-10">
      <span className="inline-flex w-fit items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.32em] text-secondary-container shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md sm:text-[11px]">
        <span
          className="h-2 w-2 shrink-0 rounded-full bg-secondary-container shadow-[0_0_14px_rgba(88,188,253,0.85)]"
          aria-hidden
        />
        {familyLabel}
      </span>
      <h1 className="font-display text-[clamp(2.35rem,5.5vw+0.85rem,5rem)] font-black leading-[0.98] tracking-[-0.045em] text-white drop-shadow-[0_4px_48px_rgba(0,0,0,0.42)]">
        {name}
      </h1>
      <div
        className="h-1 w-24 rounded-full bg-gradient-to-r from-saldivia-blue via-secondary-container to-transparent shadow-[0_0_28px_rgba(32,149,212,0.45)] sm:h-1.5 sm:w-32 md:w-40"
        aria-hidden
      />
      <p className="max-w-2xl border-l-[3px] border-secondary-container/55 pl-6 text-base font-normal leading-[1.65] text-white/[0.88] md:max-w-2xl md:pl-8 md:text-lg lg:text-xl">
        {description}
      </p>
      <div className="pt-1 md:pt-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass({ variant: "primary", size: "lg" })}
            >
              Descargar ficha (PDF)
            </a>
          )}
          <Link
            href="/contacto"
            className={buttonClass({
              variant: "outline",
              size: "lg",
              className:
                "border-white/45 bg-white/[0.04] text-white backdrop-blur-sm hover:border-secondary-container/70 hover:bg-white/[0.12]",
            })}
          >
            Cotizar unidad
          </Link>
        </div>
      </div>
    </HeroStagger>
  );
}
