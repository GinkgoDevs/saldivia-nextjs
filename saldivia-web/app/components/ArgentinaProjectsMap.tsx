"use client";

import { useEffect, useMemo, useState } from "react";

import argentinaProvinceMapData from "./argentinaProvinceMapData.json";

type ProvinceShape = {
  id: string;
  name: string;
  centroid: [number, number];
  path: string;
};

type ProvinceProject = {
  title: string;
  location: string;
  description: string;
  segment: string;
  year: string;
};

const mapData = argentinaProvinceMapData as {
  viewBox: [number, number, number, number];
  provinces: ProvinceShape[];
};

const PROJECTS_BY_PROVINCE: Partial<Record<string, ProvinceProject[]>> = {
  "buenos-aires": [
    {
      title: "Renovacion de flota de larga distancia",
      location: "AMBA y corredor atlantico",
      description:
        "Configuraciones de alta capacidad para operaciones de larga distancia y recambio progresivo de unidades.",
      segment: "Larga distancia",
      year: "2025",
    },
    {
      title: "Implementacion de servicio ejecutivo",
      location: "La Plata",
      description:
        "Proyecto orientado a servicios ejecutivos con foco en confort interior, terminaciones premium y operacion intensiva.",
      segment: "Ejecutivo",
      year: "2024",
    },
    {
      title: "Recambio para corredor turistico",
      location: "Mar del Plata",
      description:
        "Incorporacion de unidades para recorridos turisticos y de media distancia con configuracion adaptable estacionalmente.",
      segment: "Turismo",
      year: "2025",
    },
    {
      title: "Programa de modernizacion suburbana",
      location: "Zona Oeste GBA",
      description:
        "Actualizacion de unidades para recorridos suburbanos con prioridad en robustez, accesibilidad y mantenimiento agil.",
      segment: "Suburbano",
      year: "2023",
    },
  ],
  cordoba: [
    {
      title: "Proyecto interurbano regional",
      location: "Cordoba Capital",
      description:
        "Unidades adaptadas para servicios interurbanos con foco en confort, mantenimiento y disponibilidad operativa.",
      segment: "Interurbano",
      year: "2024",
    },
  ],
  mendoza: [
    {
      title: "Operacion corredor andino",
      location: "Gran Mendoza",
      description:
        "Configuraciones reforzadas para recorridos exigentes con variacion termica y demanda intensiva.",
      segment: "Especiales",
      year: "2025",
    },
  ],
  salta: [
    {
      title: "Servicio para operacion minera",
      location: "Puna saltena",
      description:
        "Proyecto orientado a transporte de personal en altura con especificaciones para climas extremos.",
      segment: "Personal minero",
      year: "2024",
    },
  ],
  chubut: [
    {
      title: "Implementacion patagonica",
      location: "Trelew y Puerto Madryn",
      description:
        "Entrega de unidades para recorridos extensos en Patagonia con enfasis en robustez y postventa.",
      segment: "Regional",
      year: "2025",
    },
  ],
};

const DEFAULT_PROVINCE_ID = "buenos-aires";

export default function ArgentinaProjectsMap() {
  const provincesWithProjects = useMemo(
    () =>
      mapData.provinces.filter(
        (province) => (PROJECTS_BY_PROVINCE[province.id] ?? []).length > 0,
      ),
    [],
  );

  const provinceById = useMemo(
    () => new Map(mapData.provinces.map((province) => [province.id, province])),
    [],
  );

  const [selectedProvinceId, setSelectedProvinceId] =
    useState<string>(DEFAULT_PROVINCE_ID);
  const [hoveredProvinceId, setHoveredProvinceId] = useState<string | null>(
    null,
  );
  const [selectionLocked, setSelectionLocked] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  const activeProvinceId = selectionLocked
    ? selectedProvinceId
    : hoveredProvinceId ?? selectedProvinceId;
  const activeProvince =
    provinceById.get(activeProvinceId) ?? mapData.provinces[0] ?? null;
  const activeProjects = activeProvince
    ? PROJECTS_BY_PROVINCE[activeProvince.id] ?? []
    : [];
  const activeProject =
    activeProjects[selectedProjectIndex] ?? activeProjects[0] ?? null;

  useEffect(() => {
    setSelectedProjectIndex(0);
  }, [activeProvinceId]);

  if (!activeProvince) {
    return null;
  }

  return (
    <section className="border-y border-slate-200 bg-surface py-24 lg:overflow-visible">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-start gap-10 lg:items-stretch lg:grid-cols-[minmax(320px,0.78fr)_minmax(0,1.22fr)] xl:gap-12">
          <div className="order-2 lg:order-1 lg:h-full">
            <div className="lg:sticky lg:top-28">
              <div className="mb-4 max-w-xl">
                <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-blue">
                  Presencia Nacional
                </h2>
                <h3 className="font-headline text-3xl font-extrabold text-primary md:text-4xl">
                  Proyectos por provincia
                </h3>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0px_24px_60px_rgba(13,44,79,0.08)] md:p-6">
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-accent-blue">
                    Provincia activa
                  </span>
                  <span className="inline-flex items-center rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    {activeProjects.length} proyecto
                    {activeProjects.length === 1 ? "" : "s"}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    {selectionLocked ? "Seleccion fija" : "Hover activo"}
                  </span>
                  {selectionLocked ? (
                    <button
                      className="inline-flex items-center rounded-full border border-accent-blue/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent-blue transition-colors hover:bg-blue-50"
                      onClick={() => setSelectionLocked(false)}
                      type="button"
                    >
                      Liberar seleccion
                    </button>
                  ) : null}
                </div>

                <div className="mb-5">
                  <h4 className="font-headline text-2xl font-extrabold text-primary md:text-[2rem]">
                    {activeProvince.name}
                  </h4>
                  <p className="mt-2.5 max-w-lg text-[13px] leading-relaxed text-slate-500">
                    {activeProjects.length > 0
                      ? "Estos proyectos se muestran desde una estructura por provincia, para que despues puedas cargar, editar o ampliar el mapa sin tocar la logica del SVG."
                      : "Todavia no hay proyectos cargados para esta provincia. El mapa ya esta preparado para incorporarlos cuando quieras."}
                  </p>
                </div>

                <div className="space-y-3">
                  {activeProjects.length > 0 ? (
                    <>
                      {activeProjects.length > 1 ? (
                        <div className="flex flex-wrap gap-2">
                          {activeProjects.map((project, index) => {
                            const isSelected = index === selectedProjectIndex;
                            return (
                              <button
                                key={`${activeProvince.id}-${project.title}-tab`}
                                className={`rounded-full border px-3 py-1.5 text-left text-[10px] font-black uppercase tracking-[0.18em] transition-colors ${
                                  isSelected
                                    ? "border-accent-blue bg-blue-50 text-accent-blue"
                                    : "border-slate-200 bg-white text-slate-500 hover:border-accent-blue/40 hover:text-primary"
                                }`}
                                onClick={() => setSelectedProjectIndex(index)}
                                type="button"
                              >
                                Proyecto {index + 1}
                              </button>
                            );
                          })}
                        </div>
                      ) : null}

                      {activeProject ? (
                      <article
                        key={`${activeProvince.id}-${activeProject.title}`}
                        className="rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-4 transition-colors hover:border-accent-blue/50 hover:bg-white"
                      >
                        <div className="mb-2.5 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white">
                            {activeProject.segment}
                          </span>
                          <span className="inline-flex items-center rounded-full border border-slate-300 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                            {activeProject.year}
                          </span>
                        </div>
                        <h5 className="font-headline text-lg font-bold text-primary">
                          {activeProject.title}
                        </h5>
                        <p className="mt-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-accent-blue">
                          {activeProject.location}
                        </p>
                        <p className="mt-2.5 text-[13px] leading-relaxed text-slate-600">
                          {activeProject.description}
                        </p>
                      </article>
                      ) : null}
                    </>
                  ) : (
                    <div className="rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 p-5 text-[13px] leading-relaxed text-slate-500">
                      Podes dejar esta provincia sin contenido o agregar nuevos
                      proyectos para que se muestren automaticamente en el panel y
                      en los puntos destacados del mapa.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0px_32px_80px_rgba(13,44,79,0.08)] md:p-6">
              <div className="pointer-events-none absolute inset-x-8 top-6 z-10 flex items-center justify-between">
                <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 backdrop-blur">
                  Hover desktop
                </span>
                <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 backdrop-blur">
                  Tap mobile
                </span>
              </div>

              <div className="flex justify-center lg:max-h-[760px] xl:max-h-[820px]">
                <svg
                  className="h-auto w-full max-w-[520px]"
                  viewBox={mapData.viewBox.join(" ")}
                  xmlns="http://www.w3.org/2000/svg"
                  onMouseLeave={() => {
                    if (!selectionLocked) {
                      setHoveredProvinceId(null);
                    }
                  }}
                >
                  <defs>
                    <pattern
                      id="argentinaMapGrid"
                      width="32"
                      height="32"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 32 0 L 0 0 0 32"
                        fill="none"
                        stroke="rgb(226 232 240)"
                        strokeWidth="0.8"
                      />
                    </pattern>
                  </defs>

                  <rect
                    width={mapData.viewBox[2]}
                    height={mapData.viewBox[3]}
                    fill="url(#argentinaMapGrid)"
                    rx="28"
                  />

                  <g>
                    {mapData.provinces.map((province) => {
                      const projectCount =
                        (PROJECTS_BY_PROVINCE[province.id] ?? []).length;
                      const isActive = province.id === activeProvince.id;

                      return (
                        <path
                          key={province.id}
                          d={province.path}
                          className="cursor-pointer transition-all duration-200"
                          fill={
                            isActive
                              ? "#2095D4"
                              : projectCount > 0
                                ? "rgba(32,149,212,0.2)"
                                : "rgba(255,255,255,0.9)"
                          }
                          stroke={isActive ? "#0D2C4F" : "rgba(13,44,79,0.24)"}
                          strokeWidth={isActive ? 2.2 : 1.1}
                          onClick={() => {
                            setSelectedProvinceId(province.id);
                            setSelectionLocked(true);
                            setHoveredProvinceId(null);
                          }}
                          onFocus={() => {
                            setSelectedProvinceId(province.id);
                            setSelectionLocked(true);
                            setHoveredProvinceId(null);
                          }}
                          onMouseEnter={() => {
                            if (!selectionLocked) {
                              setHoveredProvinceId(province.id);
                            }
                          }}
                        />
                      );
                    })}
                  </g>

                  <g>
                    {provincesWithProjects.map((province) => {
                      const isActive = province.id === activeProvince.id;
                      return (
                        <g
                          key={`${province.id}-marker`}
                          transform={`translate(${province.centroid[0]} ${province.centroid[1]})`}
                        >
                          <circle
                            r={isActive ? 13 : 10}
                            fill="rgba(32,149,212,0.14)"
                            className="animate-pulse"
                          />
                          <circle
                            r={isActive ? 6 : 5}
                            fill="#0D2C4F"
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                        </g>
                      );
                    })}
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
