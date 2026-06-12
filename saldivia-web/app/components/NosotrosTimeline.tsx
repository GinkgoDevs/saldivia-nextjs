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

/* ─── cronología ─────────────────────────────────────── */
const CRONOLOGIA = [
  {
    year: 1995,
    body: "Comienza oficialmente nuestra historia el 10 de agosto de 1995.",
    icon: "flag",
  },
  {
    year: 1998,
    body: "Se produce la primera carrocería completa, el modelo LAS, en nuestra planta fabril original.",
    icon: "precision_manufacturing",
    imgSrc: "/historia/1998.jpg",
    imgAlt: "Primera carrocería LAS en planta fabril, 1998",
  },
  {
    year: 2000,
    body: "Presentamos ARIES I, una familia de carrocerías que se convertiría en referente del segmento de buses de mediano porte.",
    icon: "directions_bus",
    imgSrc: "/historia/2000.jpg",
    imgAlt: "Presentación de ARIES I, 2000",
  },
  {
    year: 2005,
    body: "Lanzamiento de ARIES Facelift, incorporando importantes mejoras de diseño e ingeniería.",
    icon: "design_services",
    imgSrc: "/historia/2005.jpg",
    imgAlt: "Lanzamiento de ARIES Facelift, 2005",
  },
  {
    year: 2011,
    body: "Presentación del minibús A305.",
    icon: "airport_shuttle",
  },
  {
    year: 2012,
    body: "Un año clave para la compañía: nace la generación ARIES GT y se inaugura la nueva planta industrial en el Parque Industrial Alvear.",
    icon: "factory",
    imgSrc: "/historia/2012.jpg",
    imgAlt: "Nueva planta industrial en Parque Industrial Alvear, 2012",
  },
  {
    year: 2017,
    body: "Desarrollo del prototipo A405, un proyecto conceptual que impulsó nuevas soluciones tecnológicas para futuros modelos.",
    icon: "science",
  },
  {
    year: 2018,
    body: "Lanzamiento de NUEVO ARIES 365, una nueva generación de carrocerías diseñada para competir a nivel internacional.",
    icon: "public",
  },
  {
    year: 2019,
    body: "Se concretan las primeras exportaciones y comienza la ampliación de la gama de productos.",
    icon: "flight_takeoff",
  },
  {
    year: 2021,
    body: "Presentación de ARIES TRUCK, desarrollado para responder a las necesidades de la industria minera.",
    icon: "local_shipping",
  },
  {
    year: 2023,
    body: "Lanzamiento del NA 315, nuestro primer modelo urbano de piso bajo.",
    icon: "commute",
  },
  {
    year: 2024,
    body: "Presentación del NA 405, nuevo modelo de larga distancia de doble piso.",
    icon: "layers",
  },
  {
    year: 2025,
    body: "Tras casi dos décadas sale de la línea de montaje la última unidad del clásico ARIES y nace el NA 330 MD, marcando el inicio de una nueva etapa.",
    icon: "celebration",
  },
] as const;

const NODE_COLORS = ["bg-primary", "bg-secondary", "technical-gradient"] as const;

/* ─── item individual ───────────────────────────────── */
function ChronologyItem({
  item,
  index,
}: {
  item: (typeof CRONOLOGIA)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const year = useCountUp(item.year, inView);
  const isLeft = index % 2 === 0;
  const nodeColor = NODE_COLORS[index % NODE_COLORS.length];
  const hasImage = "imgSrc" in item && item.imgSrc;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.03, ease: [0.22, 1, 0.36, 1] }}
      className={`group flex flex-col items-center gap-6 sm:gap-8 ${hasImage ? "lg:flex-row lg:gap-12" : "lg:flex-row lg:gap-10"}`}
    >
      <div
        className={`w-full ${
          hasImage ? "lg:w-1/2" : "lg:w-[calc(50%-2.5rem)]"
        } ${
          isLeft
            ? "order-2 text-left lg:order-1 lg:text-right"
            : "order-2 text-left lg:order-3"
        } ${!hasImage && isLeft ? "lg:ml-auto" : ""}`}
      >
        <div
          className={`rounded bg-surface-container-lowest p-5 shadow-sm sm:p-6 border-l-4 border-secondary ${
            isLeft ? "lg:border-l-0 lg:border-r-4" : ""
          }`}
        >
          <span className="mb-2 block text-3xl font-black tabular-nums text-secondary sm:text-4xl">
            {year}
          </span>
          <p className="text-sm leading-relaxed text-on-surface-variant sm:text-base">{item.body}</p>
        </div>
      </div>

      <div
        className={`order-1 z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded font-black text-white shadow-xl ring-4 ring-surface-container-lowest sm:h-14 sm:w-14 sm:ring-8 ${nodeColor} lg:order-2`}
      >
        <span className="material-symbols-outlined text-xl sm:text-2xl">{item.icon}</span>
      </div>

      {hasImage ? (
        <div className={`w-full lg:w-1/2 ${isLeft ? "order-3" : "order-3 lg:order-1"}`}>
          <div className="h-52 overflow-hidden rounded-lg shadow-2xl grayscale transition-all duration-500 group-hover:grayscale-0 sm:h-64">
            <img
              className="h-full w-full object-cover"
              alt={"imgAlt" in item ? item.imgAlt : `Saldivia ${item.year}`}
              src={item.imgSrc}
            />
          </div>
        </div>
      ) : (
        <div className="hidden w-[calc(50%-2.5rem)] lg:block lg:order-3" aria-hidden />
      )}
    </motion.div>
  );
}

/* ─── stat card con count-up ────────────────────────── */
function StatCard({
  value,
  prefix = "",
  suffix = "",
  label,
  sublabel,
  icon,
  featured = false,
}: {
  value?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sublabel?: string;
  icon: string;
  featured?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const count = useCountUp(value ?? 0, inView && value !== undefined);

  if (featured) {
    return (
      <div ref={ref} className="relative overflow-hidden bg-primary p-6 sm:p-8">
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined" style={{ fontSize: "180px" }}>{icon}</span>
        </div>
        <div className="relative z-10">
          <h4 className="mb-2 text-xs font-black uppercase tracking-widest text-secondary-container">{label}</h4>
          {value !== undefined && (
            <div className="mb-3 text-5xl font-black tracking-tighter text-white sm:text-6xl">
              {prefix}{count.toLocaleString()}{suffix}
            </div>
          )}
          {sublabel && <p className="text-sm text-on-primary-container">{sublabel}</p>}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex flex-col justify-center border-t-4 border-secondary bg-surface-container-highest p-6">
      <span className="material-symbols-outlined mb-3 text-3xl text-secondary">{icon}</span>
      {value !== undefined && (
        <div className="mb-1 text-4xl font-black tracking-tighter text-primary">
          {prefix}{count.toLocaleString()}{suffix}
        </div>
      )}
      <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{label}</p>
    </div>
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
    <section
      className="relative border-y border-outline-variant/30 bg-surface-container-high py-16 sm:py-20 md:py-24"
      ref={sectionRef}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(32,149,212,0.12),transparent_42%),radial-gradient(circle_at_82%_88%,rgba(13,44,79,0.16),transparent_48%)]"
      />
      <div className="container mx-auto px-4 sm:px-6">

        {/* ─── Reflexión introductoria ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 sm:mb-28 md:mb-36"
        >
          <div className="relative flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">

            {/* Izquierda: texto */}
            <div className="relative lg:w-3/5">
              <div className="absolute -left-6 -top-10 h-72 w-72 rounded-full opacity-5 blur-3xl technical-gradient pointer-events-none" />

              <div className="relative mb-6 flex items-center gap-4">
                <span className="h-px w-14 bg-secondary" />
                <span className="text-xs font-bold uppercase tracking-[0.45em] text-secondary">
                  Nuestra Historia
                </span>
              </div>

              <div className="flex max-w-3xl flex-col gap-6">
                <p className="text-lg leading-relaxed text-on-surface-variant sm:text-xl">
                  Lo que comenzó como un proyecto industrial con grandes aspiraciones se transformó en una empresa
                  referente del sector, con más de 4.100 unidades producidas, una amplia diversidad de modelos y una
                  planta industrial de 14.500 m² cubiertos sobre un predio de 2,6 hectáreas en el Parque Industrial
                  Alvear.
                </p>
                <p className="text-lg leading-relaxed text-on-surface-variant sm:text-xl">
                  A lo largo de nuestra historia hemos evolucionado constantemente, incorporando nuevas tecnologías,
                  perfeccionando procesos y desarrollando generaciones de productos que marcaron hitos en la industria.
                  Desde la primera carrocería LAS hasta la actual familia Nuevo Aries, cada modelo refleja nuestro
                  compromiso con la mejora continua y la búsqueda de soluciones adaptadas a las necesidades de nuestros
                  clientes.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                {[
                  { icon: "verified", label: "Calidad" },
                  { icon: "lightbulb", label: "Innovación" },
                  { icon: "support_agent", label: "Postventa" },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 bg-secondary-container px-4 py-2 text-xs font-bold uppercase tracking-widest text-on-secondary-container"
                  >
                    <span className="material-symbols-outlined text-sm">{icon}</span>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Derecha: stats */}
            <div className="flex flex-col gap-4 lg:w-2/5 lg:pt-4">
              <StatCard
                value={4100}
                prefix="+"
                label="Producción Histórica"
                sublabel="Unidades producidas con una amplia diversidad de modelos."
                icon="directions_bus"
                featured
              />
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  label="Expertos Industriales"
                  icon="groups"
                />
                <StatCard
                  value={12}
                  label="Patentes de Diseño"
                  icon="military_tech"
                />
              </div>
            </div>

          </div>
        </motion.div>

        <div className="relative rounded-xl border border-outline-variant/35 bg-surface-container-low/95 shadow-sm px-4 py-12 sm:px-6 sm:py-14 md:px-8 md:py-16">
          <div className="mb-12 text-center sm:mb-16 md:mb-20">
            <h2 className="mb-3 text-2xl font-black uppercase tracking-tighter text-primary sm:mb-4 sm:text-3xl md:text-4xl">
              Cronología
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

            <div className="space-y-10 sm:space-y-12 md:space-y-14 lg:space-y-16">
              {CRONOLOGIA.map((item, index) => (
                <ChronologyItem key={item.year} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
