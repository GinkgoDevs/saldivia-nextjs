"use client";

import { motion } from "framer-motion";

const pilares = [
  {
    icon: "architecture",
    title: "Ingeniería estructural",
    body:
      "Chasis, carrocería y cálculos orientados a seguridad, peso y vida útil. Contenido detallado en preparación.",
  },
  {
    icon: "electric_bolt",
    title: "Sistemas y eficiencia",
    body:
      "Integración eléctrica, climatización y soluciones para reducir consumo. Sección en construcción con datos de producto.",
  },
  {
    icon: "shield_lock",
    title: "Seguridad activa y pasiva",
    body:
      "Asistencias al conductor, visibilidad y cumplimiento normativo. Próximos releases con fichas técnicas descargables.",
  },
] as const;

const list = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 320, damping: 28 } },
};

export function TecnologiaPilaresGrid() {
  return (
    <motion.div
      className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
      variants={list}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-48px" }}
    >
      {pilares.map((p) => (
        <motion.article
          key={p.title}
          variants={item}
          className="flex flex-col border border-outline-variant/35 bg-surface-container-lowest p-8 shadow-[0px_12px_32px_rgba(13,44,79,0.08)] transition-colors duration-200 hover:border-accent-blue/35"
        >
          <span className="material-symbols-outlined mb-5 text-4xl text-secondary">{p.icon}</span>
          <h3 className="text-lg font-black uppercase tracking-tight text-primary">{p.title}</h3>
          <p className="mt-4 flex-1 text-sm leading-relaxed text-on-surface-variant">{p.body}</p>
          <div className="mt-6 h-1 w-full bg-surface-container-high" aria-hidden />
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-outline">Contenido ampliado próximamente</p>
        </motion.article>
      ))}
    </motion.div>
  );
}
