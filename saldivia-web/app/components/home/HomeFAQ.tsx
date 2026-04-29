"use client";

import { useState } from "react";
import { TrajectoryRail } from "../motion";
import { MotionReveal } from "./MotionReveal";

const faqs = [
  {
    question: "¿Cuánto demora el proceso de fabricación?",
    answer:
      "Aproximadamente 60 días desde el ingreso del chasis a la línea de producción.",
    icon: "schedule",
  },
  {
    question: "¿Puedo personalizar mi unidad?",
    answer:
      "Sí, existen parámetros estándar (STD) establecidos para la personalización de cada modelo.",
    icon: "tune",
  },
  {
    question: "¿Venden repuestos de la carrocería?",
    answer:
      "Sí, contamos con un stock permanente de piezas de uso frecuente. Las menos comunes se solicitan a pedido.",
    icon: "construction",
  },
  {
    question: "¿La carrocería tiene garantía?",
    answer: (
      <>
        Sí. Para más información podés contactarnos a{" "}
        <a
          href="mailto:postventa@saldiviabuses.com.ar"
          className="text-accent-blue underline underline-offset-2 hover:text-accent-blue/80 transition-colors duration-200"
        >
          postventa@saldiviabuses.com.ar
        </a>
        .
      </>
    ),
    icon: "verified_user",
  },
];

function FAQItem({
  faq,
  index,
  open,
  onToggle,
}: {
  faq: (typeof faqs)[number];
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`border-b border-outline-variant/20 last:border-b-0 transition-colors duration-200 ${
        open ? "bg-surface-container-lowest/60" : ""
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start gap-5 px-6 py-6 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-inset md:px-8 md:py-7"
      >
        {/* Icon */}
        <span
          className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-sm transition-colors duration-300 ${
            open ? "bg-accent-blue text-white" : "bg-primary/10 text-secondary"
          }`}
        >
          <span className="material-symbols-outlined text-xl">{faq.icon}</span>
        </span>

        {/* Number + Question */}
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="font-headline text-[10px] font-bold uppercase tracking-[0.22em] text-secondary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className={`font-headline text-base font-bold leading-snug tracking-tight transition-colors duration-200 md:text-lg ${
              open ? "text-accent-blue" : "text-primary group-hover:text-accent-blue"
            }`}
          >
            {faq.question}
          </span>
        </div>

        {/* Chevron */}
        <span
          className={`material-symbols-outlined mt-1 flex-shrink-0 text-2xl text-secondary transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "rotate-180 text-accent-blue" : "group-hover:text-accent-blue"
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Answer panel */}
      <div
        className={`overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ transitionProperty: "max-height, opacity" }}
      >
        <p className="pb-7 pl-[4.75rem] pr-6 font-headline text-sm leading-relaxed text-on-surface-variant md:text-base md:pr-8">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <MotionReveal>
      <section
        className="relative bg-surface py-20 md:py-24"
        aria-labelledby="home-faq-heading"
      >
        <TrajectoryRail side="left" height="55%" />

        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-14 text-center md:mb-16">
            <p className="ui-section-eyebrow">Preguntas frecuentes</p>
            <h2 id="home-faq-heading" className="ui-section-title">
              Todo lo que necesitás saber
            </h2>
            <div className="technical-gradient mx-auto mt-5 h-1 w-24" />
            <p className="ui-section-intro mx-auto">
              Respondemos las consultas más comunes sobre fabricación, personalización, repuestos y garantía.
            </p>
          </div>

          {/* Accordion */}
          <div className="mx-auto max-w-3xl">
            <div className="ui-surface-card overflow-hidden">
              {faqs.map((faq, i) => (
                <FAQItem
                  key={i}
                  faq={faq}
                  index={i}
                  open={openIndex === i}
                  onToggle={() => toggle(i)}
                />
              ))}
            </div>

            {/* Footnote */}
            <p className="mt-6 text-center font-headline text-xs text-on-surface-variant/60">
              ¿Tenés otra consulta?{" "}
              <a
                href="/contacto"
                className="text-accent-blue underline underline-offset-2 hover:text-accent-blue/80 transition-colors duration-200"
              >
                Contactanos directamente
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </MotionReveal>
  );
}
