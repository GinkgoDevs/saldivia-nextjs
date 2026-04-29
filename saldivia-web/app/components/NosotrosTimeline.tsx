"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

/* ─── count-up ─────────────────────────────────────── */
function easeOutCubic(t: number) { return 1 - (1 - t) ** 3; }

function useCountUp(end: number, enabled: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!enabled) { setValue(0); return; }
    let raf = 0, cancelled = false;
    const start = performance.now();
    const tick = (now: number) => {
      if (cancelled) return;
      const t = Math.min(1, (now - start) / 1600);
      setValue(Math.round(easeOutCubic(t) * end));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, [enabled, end]);
  return value;
}

/* ─── datos ─────────────────────────────────────────── */
const ITEMS = [
  {
    year: 1988,
    title: "EL NACIMIENTO DEL GIGANTE",
    body: "Fundación de Saldivia como taller especializado en mantenimiento pesado. El inicio de un sueño basado en la robustez estructural.",
    icon: "factory",
    tags: ["ORIGEN", "PASIÓN"],
    side: "left" as const,
    nodeColor: "bg-primary",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUhz9LWXaVud5PgInl9OtqbGeOwEoNB1vcTPQ8MNejdXm1GK7niy2OyQRQ85yueYFGfchvxtLzwCHvzZlZQzFZLD7-zVA6trRFq50kxcYtL4kBNQHMgwjDKqkNPmAvJsc-tCFiEwPMyTSSac0t4Qc3zE_EIo354wRIE-YTcgF1i9rn_ERcPSHGetZbetiC2zL-ckZncIDR7p-xtu0RguPPl5x0qOrAtJ5TNCBRDVBo2KOhndp2Qb2Uj4Y139RyeeVMlMZJ6IM7VJpF",
    imgAlt: "Industrial workshop 1988",
  },
  {
    year: 2005,
    title: "INGENIERÍA PROPIA",
    body: "Presentación del primer chasis desarrollado íntegramente por Saldivia. Marcamos el inicio de una era de independencia tecnológica.",
    icon: "precision_manufacturing",
    tags: ["CHASIS", "INNOVACIÓN"],
    side: "right" as const,
    nodeColor: "bg-secondary",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDliWzV3M-UWKH5-1ss4GfBt-T2JaTVHdyQeNz59G_dbJxk2xkb6d1mZlKc1_SP-eXo2_W0vXldYKO0Q63hc_4M22KoC2AuZXog_l3gZidh2S0te39iilEdgXvdPDPi87NL2M81gnvxM_zbypAdn8wTivHeh9fYznw3ED-lAXmAtYT9i08wREhX2RkBoE8XKjT1E7VpJg5NpxSojND74u4BwceTLllKexXclnoD1oliKElkhwNAhH9OiIfWDm9K4rE8KPXXsVuijX9V",
    imgAlt: "Engineering 2005",
  },
  {
    year: 2015,
    title: "LIDERAZGO REGIONAL",
    body: "Expansión de la planta industrial a 25,000m². Saldivia se posiciona como el carrocero líder en soluciones personalizadas.",
    icon: "public",
    tags: ["CRECIMIENTO", "CAPACIDAD"],
    side: "left" as const,
    nodeColor: "bg-primary",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiTFG7DhNGyoDqVv6EBvMzw_ImM8oYQZVvZNBxoEwuiBYLD-0C3kb25UwxAErLnyPoce4eHmZItnT2MFLnkGCkN3nrNIAB-G67LKqX3KX-v7Atjf1MVTyLLVnHoEaSeWQD4bULHjUNBtun6FaFrd6mUTYuz2CKSGVwkMjoyDfj6HNlPWWGqmoiYHOUsmuq2g_bmgl_hM2qHX--M29E_husSlCr-IuWC-q36W7Cb4sPQTXmJA4R8_zdbEGceRYGDvufSWripCImM5q",
    imgAlt: "Fleet expansion 2015",
  },
  {
    year: 2024,
    title: "SISTEMAS INTELIGENTES",
    body: "Integración de telemetría avanzada y sistemas de asistencia al conductor de última generación. El futuro es digital.",
    icon: "bolt",
    tags: ["SMART BUS", "DATOS"],
    side: "right" as const,
    nodeColor: "technical-gradient",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOeSF4qyLXEOT_k71T_v1K52ayE4kQASEKIvriTYlHwivddTHVpisPXZ266D7SbPeBndrt6R8jftKMd4sRRzvnsgVb51TCgJWN-yvcaW7uICzMXB7Ztp3b73bJTF826CpA8MZmEZ-vLQ36QXuTznz0W9smFygHbQ-IZWvDEPefzdAYqBAptuanlNoK0qw64Q4AjDlgG1Ak8FCsmjRhujy_QDmNPDv4kXrR6cAV33WE8lDxTP9Q_eoQeBoRmKCeIO3S-d14Uwi33_pz",
    imgAlt: "Smart systems 2024",
  },
] as const;

/* ─── item individual ───────────────────────────────── */
function TimelineItem({ item }: { item: typeof ITEMS[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const year = useCountUp(item.year, inView);
  const isLeft = item.side === "left";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col items-center gap-8 sm:gap-10 lg:flex-row lg:gap-12"
    >
      {/* Tarjeta */}
      <div
        className={`w-full lg:w-1/2 ${
          isLeft
            ? "order-2 text-left lg:order-1 lg:text-right"
            : "order-2 text-left lg:order-3"
        }`}
      >
        <div
          className={`rounded bg-surface-container-low p-5 shadow-sm sm:p-8 border-l-4 border-secondary ${
            isLeft ? "lg:border-l-0 lg:border-r-4" : ""
          }`}
        >
          <span className="mb-2 block text-4xl font-black tabular-nums text-secondary sm:text-5xl">
            {year}
          </span>
          <h3 className="mb-3 text-lg font-bold uppercase tracking-tight text-primary sm:mb-4 sm:text-xl">{item.title}</h3>
          <p className="text-sm leading-relaxed text-on-surface-variant sm:text-base">{item.body}</p>
          <div className={`mt-5 flex flex-wrap gap-2 sm:mt-6 ${isLeft ? "lg:justify-end" : ""}`}>
            {item.tags.map((tag) => (
              <span key={tag} className="bg-secondary-container text-on-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-tighter">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Nodo central */}
      <div
        className={`order-1 z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded font-black text-white shadow-xl ring-4 ring-surface sm:h-16 sm:w-16 sm:ring-8 ${item.nodeColor} lg:order-2`}
      >
        <span className="material-symbols-outlined text-2xl sm:text-[28px]">{item.icon}</span>
      </div>

      {/* Imagen */}
      <div className={`w-full lg:w-1/2 ${isLeft ? "order-3" : "order-3 lg:order-1"}`}>
        <div className="h-52 overflow-hidden rounded-lg shadow-2xl grayscale transition-all duration-500 hover:grayscale-0 sm:h-64">
          <img className="w-full h-full object-cover" alt={item.imgAlt} src={item.imgSrc} />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── componente principal ──────────────────────────── */
export default function NosotrosTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 60%"],
  });

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative bg-surface py-14 sm:py-20 md:py-24" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6">

        {/* ─── Reflexión introductoria ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 sm:mb-24 md:mb-32"
        >
          <div className="relative overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low px-6 py-7 sm:px-10 sm:py-8 md:px-14 md:py-9">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-5 blur-3xl technical-gradient pointer-events-none" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-10">
              {/* Texto */}
              <div className="flex-1 text-center sm:text-left">
                <span className="mb-3 block text-base font-black uppercase tracking-[0.2em] text-secondary sm:text-lg">
                  Nuestra Esencia
                </span>
                <p className="text-sm leading-relaxed text-on-surface-variant sm:text-base">
                  Nuestra principal característica radica en la{" "}
                  <strong className="font-bold text-primary">agilidad en todo el proceso</strong>,
                  desde los primeros contactos hasta la entrega de la unidad, obteniendo el{" "}
                  <strong className="font-bold text-secondary">tiempo de fabricación más bajo del mercado</strong>.
                  Con nuestra{" "}
                  <strong className="font-bold text-primary">atención intensiva al cliente y post venta</strong>{" "}
                  logramos la máxima satisfacción. La calidad es un objetivo primordial:{" "}
                  <strong className="font-bold text-secondary">certificados ISO&nbsp;9001</strong>.
                </p>
              </div>

              {/* Divisor */}
              <div className="hidden h-16 w-px shrink-0 bg-outline-variant/30 sm:block" />

              {/* Chips */}
              <div className="flex shrink-0 flex-wrap justify-center gap-2 sm:flex-col sm:justify-start sm:gap-2">
                {[
                  { icon: "speed", label: "Fabricación Ágil" },
                  { icon: "support_agent", label: "Atención Intensiva" },
                  { icon: "verified", label: "ISO 9001" },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 bg-secondary-container px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-on-secondary-container sm:px-4 sm:py-2 sm:text-xs"
                  >
                    <span className="material-symbols-outlined text-sm">{icon}</span>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mb-12 text-center sm:mb-16 md:mb-24">
          <h2 className="mb-3 text-2xl font-black uppercase tracking-tighter text-primary sm:mb-4 sm:text-3xl md:text-4xl">
            Línea de Tiempo Industrial
          </h2>
          <div className="mx-auto h-1 w-20 technical-gradient sm:w-24" />
        </div>

        <div className="relative">
          {/* Línea vertical animada */}
          <div className="absolute bottom-0 left-1/2 top-0 hidden w-[2px] -translate-x-1/2 overflow-hidden lg:block">
            <div className="absolute inset-0 bg-outline-variant/20" />
            <motion.div
              className="absolute left-0 right-0 top-0 origin-top technical-gradient"
              style={{ scaleY: lineScaleY, height: "100%" }}
            />
          </div>

          <div className="space-y-16 sm:space-y-24 md:space-y-28 lg:space-y-32">
            {ITEMS.map((item) => (
              <TimelineItem key={item.year} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
