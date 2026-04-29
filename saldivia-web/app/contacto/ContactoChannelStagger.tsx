"use client";

import { StaggerInView, StaggerItem } from "../components/motion";

export function ContactoChannelStagger() {
  return (
    <StaggerInView className="grid gap-4 sm:gap-6" stagger={0.12}>
      <StaggerItem>
        <div className="ui-surface-card group p-5 hover:bg-surface-container-highest sm:p-8">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-secondary-container text-on-secondary-container">
              <span className="material-symbols-outlined">shopping_cart</span>
            </div>
            <div className="space-y-1">
              <span className="text-machined text-[10px] font-bold text-secondary">Departamento</span>
              <h3 className="text-lg font-bold text-primary sm:text-xl">Ventas Especializadas</h3>
              <p className="pt-2 text-on-surface-variant">ventas@saldivia.com.ar</p>
              <p className="font-medium text-on-surface-variant">+54 (0341) 492-1234</p>
            </div>
          </div>
        </div>
      </StaggerItem>
      <StaggerItem>
        <div className="ui-surface-card group p-5 hover:bg-surface-container-highest sm:p-8">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-secondary-container text-on-secondary-container">
              <span className="material-symbols-outlined">build</span>
            </div>
            <div className="space-y-1">
              <span className="text-machined text-[10px] font-bold text-secondary">Mantenimiento</span>
              <h3 className="text-lg font-bold text-primary sm:text-xl">Postventa &amp; Repuestos</h3>
              <p className="pt-2 text-on-surface-variant">postventa@saldivia.com.ar</p>
              <p className="font-medium text-on-surface-variant">+54 (0341) 492-5678</p>
            </div>
          </div>
        </div>
      </StaggerItem>
      <StaggerItem>
        <div className="ui-surface-card group p-5 hover:bg-surface-container-highest sm:p-8">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-secondary-container text-on-secondary-container">
              <span className="material-symbols-outlined">corporate_fare</span>
            </div>
            <div className="space-y-1">
              <span className="text-machined text-[10px] font-bold text-secondary">General</span>
              <h3 className="text-lg font-bold text-primary sm:text-xl">Administración Central</h3>
              <p className="pt-2 text-on-surface-variant">info@saldivia.com.ar</p>
              <p className="font-medium text-on-surface-variant">+54 (0341) 492-0000</p>
            </div>
          </div>
        </div>
      </StaggerItem>
    </StaggerInView>
  );
}
