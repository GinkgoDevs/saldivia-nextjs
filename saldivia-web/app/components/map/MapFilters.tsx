"use client";

import type { LocationType } from "@/types/location";

const TYPES: { value: LocationType; label: string; color: string }[] = [
  { value: "taller", label: "Talleres", color: "#f97316" },
  { value: "distribuidor", label: "Distribuidores", color: "#2095D4" },
  { value: "concesionario", label: "Concesionarios", color: "#10b981" },
];

type Props = {
  activeType: LocationType | undefined;
  activeProvince: string;
  provinces: string[];
  onTypeChange: (type: LocationType | undefined) => void;
  onProvinceChange: (province: string) => void;
};

export function MapFilters({
  activeType,
  activeProvince,
  provinces,
  onTypeChange,
  onProvinceChange,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
      <div className="flex gap-2 flex-wrap">
        {TYPES.map((t) => {
          const active = activeType === t.value;
          return (
            <button
              key={t.value}
              onClick={() => onTypeChange(active ? undefined : t.value)}
              className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              style={
                active
                  ? { background: t.color, borderColor: t.color, color: "#fff" }
                  : {
                      background: "transparent",
                      borderColor: `${t.color}50`,
                      color: t.color,
                    }
              }
              aria-pressed={active}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {provinces.length > 0 && (
        <select
          value={activeProvince}
          onChange={(e) => onProvinceChange(e.target.value)}
          aria-label="Filtrar por provincia"
          className="bg-white/5 border border-white/15 text-slate-300 text-xs rounded-full px-4 py-2 focus:outline-none focus:border-[#2095D4]/50 cursor-pointer"
        >
          <option value="">Todas las provincias</option>
          {provinces.map((p) => (
            <option key={p} value={p} className="bg-[#0d1f35] text-slate-200">
              {p}
            </option>
          ))}
        </select>
      )}

      {(activeType || activeProvince) && (
        <button
          onClick={() => {
            onTypeChange(undefined);
            onProvinceChange("");
          }}
          className="text-xs text-slate-400 hover:text-white underline underline-offset-2 transition-colors"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
