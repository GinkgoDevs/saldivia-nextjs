"use client";

import Link from "next/link";
import { StaggerInView, StaggerItem } from "../components/motion";
import { buttonClass } from "../components/ui/Button";

export function NosotrosBentoGrid() {
  return (
    <StaggerInView className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3" stagger={0.11}>
      <StaggerItem className="group relative flex flex-col justify-between overflow-hidden bg-primary-brand p-6 md:col-span-2 sm:p-8 md:p-12">
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 transform opacity-10 transition-transform duration-700 group-hover:scale-110">
          <span className="material-symbols-outlined" style={{ fontSize: "240px" }}>
            directions_bus
          </span>
        </div>
        <div className="relative z-10">
          <h4 className="mb-2 text-sm font-black uppercase tracking-widest text-accent-blue">Producción Histórica</h4>
          <div className="mb-4 text-5xl font-black tracking-tighter text-white sm:text-6xl md:text-7xl">+4.100</div>
          <p className="max-w-sm text-base text-on-primary-container sm:text-lg">
            Unidades producidas con una amplia diversidad de modelos para el transporte de pasajeros.
          </p>
        </div>
        <Link
          className={buttonClass({
            variant: "link-cta",
            size: "sm",
            className: "mt-8 min-h-0 self-start px-0 py-0 text-white hover:text-accent-blue",
          })}
          href="/flota"
        >
          Ver nuestros modelos <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </StaggerItem>
      <StaggerItem className="flex flex-col justify-center border-t-4 border-secondary bg-surface-container-highest p-6 sm:p-8">
        <span className="material-symbols-outlined mb-4 text-4xl text-secondary">groups</span>
        <p className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Expertos Industriales</p>
      </StaggerItem>
      <StaggerItem className="flex flex-col justify-center border-t-4 border-secondary bg-surface-container-highest p-6 sm:p-8">
        <span className="material-symbols-outlined mb-4 text-4xl text-secondary">military_tech</span>
        <div className="mb-1 text-4xl font-black tracking-tighter text-primary">12</div>
        <p className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Patentes de Diseño</p>
      </StaggerItem>
    </StaggerInView>
  );
}
