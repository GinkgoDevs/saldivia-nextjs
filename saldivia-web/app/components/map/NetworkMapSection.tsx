"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { Location, LocationType } from "@/types/location";
import { useLocations } from "@/hooks/useLocations";
import { MapFilters } from "./MapFilters";
import { LocationCard } from "./LocationCard";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0d1520] rounded-xl">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#2095D4]/30 border-t-[#2095D4] rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-sm mt-3">Cargando mapa…</p>
      </div>
    </div>
  ),
});

export default function NetworkMapSection() {
  const [activeType, setActiveType] = useState<LocationType | undefined>(undefined);
  const [activeProvince, setActiveProvince] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [listOpen, setListOpen] = useState(false);

  // Fetch all once, filter client-side
  const { data: allLocations, loading, error } = useLocations({});

  const provinces = useMemo(() => {
    if (!allLocations) return [];
    return Array.from(new Set(allLocations.map((l) => l.province))).sort();
  }, [allLocations]);

  const displayedLocations = useMemo(() => {
    if (!allLocations) return [];
    return allLocations.filter((loc) => {
      if (activeType && loc.type !== activeType) return false;
      if (activeProvince && loc.province !== activeProvince) return false;
      return true;
    });
  }, [allLocations, activeType, activeProvince]);

  function handleSelectLocation(loc: Location) {
    setSelectedLocation(loc);
    setListOpen(true);
  }

  return (
    <section
      className="bg-[#081b31] py-16 md:py-24 industrial-grid"
      id="red-servicio"
      aria-labelledby="red-servicio-heading"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-2 block font-headline text-xs font-bold uppercase tracking-[0.26em] text-[#2095D4]">
            Cobertura nacional
          </p>
          <h2
            id="red-servicio-heading"
            className="font-headline text-3xl font-black uppercase tracking-tighter text-white md:text-4xl"
          >
            Red de Servicio
          </h2>
          <div className="mt-4 h-px w-24 bg-gradient-to-r from-[#2095D4] to-transparent" />
          <p className="mt-4 max-w-xl font-headline text-sm leading-relaxed text-slate-400">
            Encontrá el taller autorizado, distribuidor o concesionario más cercano en todo el país.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <MapFilters
            activeType={activeType}
            activeProvince={activeProvince}
            provinces={provinces}
            onTypeChange={setActiveType}
            onProvinceChange={setActiveProvince}
          />
        </div>

        {/* Map + List */}
        <div className="flex flex-col lg:flex-row gap-4 lg:h-[520px]">
          {/* Map */}
          <div className="lg:flex-[3] h-[380px] lg:h-full rounded-xl overflow-hidden border border-white/10">
            {error ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#0d1520] text-slate-500 text-sm gap-2">
                <span className="material-symbols-outlined text-3xl">map_off</span>
                No se pudo cargar el mapa. Verificá tu conexión.
              </div>
            ) : (
              <MapView
                locations={displayedLocations}
                selectedLocation={selectedLocation}
                onSelectLocation={handleSelectLocation}
              />
            )}
          </div>

          {/* Location list sidebar */}
          <div className="lg:flex-[2] flex flex-col min-h-0">
            {/* Mobile toggle */}
            <button
              className="lg:hidden flex items-center justify-between w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg mb-2 text-white text-sm font-bold"
              onClick={() => setListOpen(!listOpen)}
              aria-expanded={listOpen}
            >
              <span>
                {loading
                  ? "Cargando…"
                  : `${displayedLocations.length} resultado${displayedLocations.length !== 1 ? "s" : ""}`}
              </span>
              <span className="material-symbols-outlined text-xl">
                {listOpen ? "expand_less" : "expand_more"}
              </span>
            </button>

            <div
              className={[
                "overflow-y-auto space-y-2 flex-1 min-h-0",
                listOpen ? "flex flex-col" : "hidden lg:flex lg:flex-col",
              ].join(" ")}
            >
              {loading ? (
                <div className="flex-1 flex items-center justify-center py-8 text-slate-500 text-sm">
                  Buscando ubicaciones…
                </div>
              ) : displayedLocations.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-10 text-center text-slate-500 text-sm gap-2">
                  <span className="material-symbols-outlined text-3xl">location_off</span>
                  No hay ubicaciones con los filtros actuales.
                </div>
              ) : (
                displayedLocations.map((loc) => (
                  <LocationCard
                    key={loc.id}
                    location={loc}
                    selected={selectedLocation?.id === loc.id}
                    onClick={() => handleSelectLocation(loc)}
                  />
                ))
              )}
            </div>

            {!loading && displayedLocations.length > 0 && (
              <p className="hidden lg:block mt-2 text-slate-600 text-xs text-right shrink-0">
                {displayedLocations.length} punto{displayedLocations.length !== 1 ? "s" : ""} de servicio
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
