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
      className="flex flex-col lg:flex-row items-center gap-12 group"
    >
      {/* Tarjeta */}
      <div className={`lg:w-1/2 ${isLeft ? "order-2 lg:order-1 text-right" : "order-2 text-left lg:order-3"}`}>
        <div className={`bg-surface-container-low p-8 rounded shadow-sm ${isLeft ? "border-r-4" : "border-l-4"} border-secondary`}>
          <span className="text-secondary font-black text-5xl block mb-2 tabular-nums">
            {year}
          </span>
          <h3 className="text-xl font-bold text-primary uppercase tracking-tight mb-4">{item.title}</h3>
          <p className="text-on-surface-variant leading-relaxed">{item.body}</p>
          <div className={`mt-6 flex gap-2 ${isLeft ? "justify-end" : ""}`}>
            {item.tags.map((tag) => (
              <span key={tag} className="bg-secondary-container text-on-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-tighter">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Nodo central */}
      <div className={`z-10 ${item.nodeColor} w-16 h-16 rounded flex items-center justify-center text-white font-black shrink-0 shadow-xl ring-8 ring-surface order-1 lg:order-2`}>
        <span className="material-symbols-outlined">{item.icon}</span>
      </div>

      {/* Imagen */}
      <div className={`lg:w-1/2 ${isLeft ? "order-3" : "order-3 lg:order-1"}`}>
        <div className="h-64 rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 shadow-2xl">
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
    <section className="py-24 bg-surface relative" ref={sectionRef}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl font-black text-primary tracking-tighter uppercase mb-4">
            Línea de Tiempo Industrial
          </h2>
          <div className="w-24 h-1 technical-gradient mx-auto" />
        </div>

        <div className="relative">
          {/* Línea vertical animada */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[2px] overflow-hidden">
            <div className="absolute inset-0 bg-outline-variant/20" />
            <motion.div
              className="absolute top-0 left-0 right-0 technical-gradient origin-top"
              style={{ scaleY: lineScaleY, height: "100%" }}
            />
          </div>

          <div className="space-y-32">
            {ITEMS.map((item) => (
              <TimelineItem key={item.year} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
