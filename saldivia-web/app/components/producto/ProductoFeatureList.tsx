"use client";

import { StaggerInView, StaggerItem } from "@/app/components/motion";

const features = [
  "Estructura en perfiles tubulares de acero al carbono de alta resistencia.",
  "Revestimiento externo con acabados y procesos de pintura bajo control industrial.",
  "Interior diseñable según servicio, confort y normativa de aplicación.",
] as const;

export function ProductoFeatureList() {
  return (
    <StaggerInView className="mt-10 grid list-none grid-cols-1 gap-6 md:grid-cols-2" stagger={0.08}>
      {features.map((feature) => (
        <StaggerItem key={feature} className="flex items-start gap-3">
          <span className="material-symbols-outlined mt-0.5 text-saldivia-blue">check_circle</span>
          <span className="text-sm font-medium leading-relaxed text-on-surface-variant">{feature}</span>
        </StaggerItem>
      ))}
    </StaggerInView>
  );
}
