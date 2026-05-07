"use client";

import { FadeUp, StaggerInView, StaggerItem } from "@/app/components/motion";

const defaultFeatures = [
  "Estructura en perfiles tubulares de acero al carbono de alta resistencia.",
  "Revestimiento externo con acabados y procesos de pintura bajo control industrial.",
  "Interior diseñable según servicio, confort y normativa de aplicación.",
] as const;

type Props = { items?: string[] };

export function ProductoFeatureList({ items }: Props) {
  const list = items && items.length > 0 ? items : [...defaultFeatures];
  if (items && items.length === 0) {
    return null;
  }
  return (
    <>
      <FadeUp size="sm">
        <div className="mb-8 mt-12 sm:mt-14 sm:mb-10 md:mb-12">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-primary sm:text-3xl md:text-4xl">
            Características
          </h2>
          <div className="mt-3 h-1 w-20 bg-saldivia-blue sm:mt-4 sm:w-24" />
        </div>
      </FadeUp>
      <StaggerInView className="grid list-none grid-cols-1 gap-6 md:grid-cols-2" stagger={0.08}>
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
