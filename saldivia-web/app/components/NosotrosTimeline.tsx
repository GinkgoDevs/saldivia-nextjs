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
    imgSrc: "/historia/1995.jpg",
    imgAlt: "Evolución de los logos Saldivia y MCM desde 1995",
    imgFit: "contain",
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
    imgSrc: "/historia/2011.png",
    imgAlt: "Presentación del minibús A305, 2011",
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
    imgSrc: "/historia/2017.png",
    imgAlt: "Prototipo A405, 2017",
  },
  {
    year: 2018,
    body: "Lanzamiento de NUEVO ARIES 365, una nueva generación de carrocerías diseñada para competir a nivel internacional.",
    icon: "public",
    imgSrc: "/historia/2018.jpg",
    imgAlt: "Lanzamiento de Nuevo Aries 365, 2018",
  },
  {
    year: 2019,
    body: "Se concretan las primeras exportaciones y comienza la ampliación de la gama de productos.",
    icon: "flight_takeoff",
    imgSrc: "/historia/2019.jpg",
    imgAlt: "Primeras exportaciones Saldivia, 2019",
  },
  {
    year: 2021,
    body: "Presentación de ARIES TRUCK, desarrollado para responder a las necesidades de la industria minera.",
    icon: "local_shipping",
    imgSrc: "/historia/2021.jpg",
    imgAlt: "Presentación de Aries Truck, 2021",
  },
  {
    year: 2023,
    body: "Lanzamiento del NA 315, nuestro primer modelo urbano de piso bajo.",
    icon: "commute",
    imgSrc: "/historia/2023.jpg",
    imgAlt: "Lanzamiento del NA 315, 2023",
  },
  {
    year: 2024,
    body: "Presentación del NA 405, nuevo modelo de larga distancia de doble piso.",
    icon: "layers",
    imgSrc: "/historia/2024.png",
    imgAlt: "Presentación del NA 405, 2024",
  },
  {
    year: 2025,
    body: "Tras casi dos décadas sale de la línea de montaje la última unidad del clásico ARIES y nace el NA 330 MD, marcando el inicio de una nueva etapa.",
    icon: "celebration",
    imgSrc: "/historia/2025.jpg",
    imgAlt: "NA 330 MD y fin de línea del clásico Aries, 2025",
  },
] as const;

const NODE_COLORS = ["bg-primary-brand", "bg-secondary", "technical-gradient"] as const;

function ChronologyCard({
  year,
  body,
  alignRight = false,
}: {
  year: number;
  body: string;
  alignRight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg bg-surface-container-lowest p-5 shadow-sm sm:p-6 border-l-4 border-secondary ${
        alignRight ? "lg:border-l-0 lg:border-r-4 lg:text-right" : ""
      }`}
    >
      <span className="mb-2 block text-3xl font-black tabular-nums text-secondary sm:text-4xl">
        {year}
      </span>
      <p className="text-sm leading-relaxed text-on-surface-variant sm:text-base">{body}</p>
    </div>
  );
}

function ChronologyMedia({
  imgSrc,
  imgAlt,
  icon,
  imgFit = "cover",
}: {
  imgSrc?: string;
  imgAlt?: string;
  icon: string;
  imgFit?: "cover" | "contain";
}) {
  if (imgSrc) {
    return (
      <div
        className={`h-52 overflow-hidden rounded-lg shadow-2xl sm:h-64 lg:h-72 ${
          imgFit === "contain" ? "bg-white" : ""
        }`}
      >
        <img
          className={`h-full w-full object-center ${
            imgFit === "contain" ? "object-contain p-2 sm:p-3" : "object-cover"
          }`}
          alt={imgAlt ?? ""}
          src={imgSrc}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="hidden h-52 items-center justify-center rounded-lg border border-white/10 bg-white/5 sm:h-64 lg:flex"
    >
      <span className="material-symbols-outlined text-6xl text-accent-blue/30">{icon}</span>
    </div>
  );
}

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
  const textOnLeft = index % 2 === 0;
  const nodeColor = NODE_COLORS[index % NODE_COLORS.length];
  const imgSrc = "imgSrc" in item ? item.imgSrc : undefined;
  const imgAlt = "imgAlt" in item ? item.imgAlt : undefined;
  const imgFit = "imgFit" in item ? item.imgFit : undefined;

  const card = <ChronologyCard year={year} body={item.body} alignRight={textOnLeft} />;
  const media = (
    <ChronologyMedia
      imgSrc={imgSrc}
      imgAlt={imgAlt ?? `Saldivia ${item.year}`}
      icon={item.icon}
      imgFit={imgFit}
    />
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.03, ease: [0.22, 1, 0.36, 1] }}
      className="group grid grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-10 lg:gap-y-0"
    >
      <div className={`order-3 w-full ${textOnLeft ? "lg:order-1" : "hidden lg:order-1 lg:block"}`}>
        {textOnLeft ? card : media}
      </div>

      <div
        className={`order-1 z-10 flex h-12 w-12 shrink-0 items-center justify-center justify-self-center rounded font-black text-white shadow-xl ring-4 ring-[#081b31] sm:h-14 sm:w-14 sm:ring-6 ${nodeColor} lg:order-2`}
      >
        <span className="material-symbols-outlined text-xl sm:text-2xl">{item.icon}</span>
      </div>

      <div className={`order-4 w-full ${textOnLeft ? "hidden lg:order-3 lg:block" : "lg:order-3"}`}>
        {textOnLeft ? media : card}
      </div>

      {imgSrc ? (
        <div className="order-5 w-full lg:hidden">{media}</div>
      ) : null}
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
  staticValue,
}: {
  value?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sublabel?: string;
  icon: string;
  featured?: boolean;
  staticValue?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const count = useCountUp(value ?? 0, inView && value !== undefined);
  const display = staticValue ?? `${prefix}${count.toLocaleString("es-AR")}${suffix}`;

  if (featured) {
    return (
      <div ref={ref} className="relative overflow-hidden bg-primary-brand p-6 sm:p-8">
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined" style={{ fontSize: "180px" }}>{icon}</span>
        </div>
        <div className="relative z-10">
          <h4 className="mb-2 text-xs font-black uppercase tracking-widest text-accent-blue">{label}</h4>
          <div className="mb-3 text-5xl font-black tracking-tighter text-white sm:text-6xl">
            {display}
          </div>
          {sublabel && <p className="text-sm text-on-primary-container">{sublabel}</p>}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex flex-col justify-center border-t-4 border-secondary bg-surface-container-highest p-6">
      <span className="material-symbols-outlined mb-3 text-3xl text-secondary">{icon}</span>
      <div className="mb-1 text-4xl font-black tracking-tighter text-primary">
        {display}
      </div>
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
    <>
      <section className="relative border-b border-outline-variant/30 bg-surface-container-high py-16 sm:py-20 md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(32,149,212,0.12),transparent_42%),radial-gradient(circle_at_82%_88%,rgba(13,44,79,0.16),transparent_48%)]"
        />
        <div className="container relative mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
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
                    value={14500}
                    suffix=" m²"
                    label="Planta Industrial"
                    icon="factory"
                  />
                  <StatCard
                    staticValue="2,6 ha"
                    label="Superficie del Predio"
                    icon="landscape"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-[#081b31] py-16 text-on-primary sm:py-20 md:py-24 industrial-grid"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-brand/40 via-transparent to-black/30"
        />
        <div className="container relative mx-auto px-4 sm:px-6">
          <div className="mb-12 text-center sm:mb-16 md:mb-20">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.35em] text-accent-blue">
              Nuestra historia
            </span>
            <h2 className="mb-3 text-2xl font-black uppercase tracking-tighter text-white sm:mb-4 sm:text-3xl md:text-4xl">
              Cronología
            </h2>
            <div className="mx-auto h-1 w-20 technical-gradient sm:w-24" />
          </div>

          <div className="relative">
            <div className="absolute bottom-0 left-1/2 top-0 hidden w-[2px] -translate-x-1/2 overflow-hidden lg:block">
              <div className="absolute inset-0 bg-white/10" />
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
      </section>
    </>
  );
}
