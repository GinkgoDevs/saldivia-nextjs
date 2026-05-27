"use client";

import { FadeUp, StaggerInView, StaggerItem } from "@/app/components/motion";

const defaultFeatures = [
  "Estructura en perfiles tubulares de acero al carbono de alta resistencia.",
  "Revestimiento externo con acabados y procesos de pintura bajo control industrial.",
  "Interior diseñable según servicio, confort y normativa de aplicación.",
] as const;

type Props = { items?: string[]; columns?: 1 | 2 };

export function ProductoFeatureList({ items, columns = 2 }: Props) {
  const list = items && items.length > 0 ? items : [...defaultFeatures];
  if (items && items.length === 0) {
    return null;
  }
  return (
    <>
      <FadeUp size="sm">
        <div className="mb-6 mt-10 sm:mb-8">
          <h2 className="text-xl font-black uppercase tracking-tighter text-primary sm:text-2xl md:text-3xl">
            Características
          </h2>
          <div className="mt-3 h-1 w-16 bg-saldivia-blue sm:w-20" />
        </div>
      </FadeUp>
      <StaggerInView
        className={`grid list-none gap-4 ${columns === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}
        stagger={0.08}
      >
      {list.map((feature) => (
        <StaggerItem key={feature} className="flex items-start gap-3">
          <span className="material-symbols-outlined mt-0.5 text-saldivia-blue">check_circle</span>
          <span className="text-sm font-medium leading-relaxed text-on-surface-variant">{feature}</span>
        </StaggerItem>
      ))}
      </StaggerInView>
    </>
  );
}
