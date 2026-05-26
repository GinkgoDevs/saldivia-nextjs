"use client";

import Link from "next/link";
import { StaggerInView, StaggerItem } from "../components/motion";
import { buttonClass } from "../components/ui/Button";

const items = [
  { icon: "precision_manufacturing" as const, title: "Repuestos Originales", desc: "Componentes de ingeniería con certificación de fábrica para garantizar durabilidad.", link: "Ver Catálogo" },
  { icon: "build_circle" as const, title: "Soporte Técnico", desc: "Asistencia directa de especialistas en mecánica y electrónica de buses.", link: "Solicitar Ayuda" },
  { icon: "history" as const, title: "Garantía Saldivia", desc: "Información detallada sobre coberturas y procesos de reclamo técnico.", link: "Consultar Cobertura" },
  { icon: "location_on" as const, title: "Red Nacional", desc: "Encuentre su punto de asistencia oficial más cercano en todo el territorio.", link: "Ver Mapa" },
] as const;

export function PostventaServiceGrid() {
  return (
    <StaggerInView className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4" stagger={0.11}>
      {items.map((item, i) => (
        <StaggerItem
          key={item.title}
          className={`bg-surface-container-lowest p-5 shadow-[0px_12px_32px_rgba(13,44,79,0.08)] sm:p-6 md:p-8 ${
            i === 0 ? "border-t-4 border-secondary" : ""
          }`}
        >
          <span className="material-symbols-outlined mb-4 block text-3xl text-secondary">{item.icon}</span>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">{item.title}</h3>
          <p className="mb-6 text-sm text-on-surface-variant">{item.desc}</p>
          <Link
            className={buttonClass({
              variant: "link-cta",
              size: "sm",
              className: "min-h-0 px-0 py-0 text-secondary hover:text-primary",
            })}
            href="/trabaja-con-nosotros"
          >
            {item.link} <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </StaggerItem>
      ))}
    </StaggerInView>
  );
}
