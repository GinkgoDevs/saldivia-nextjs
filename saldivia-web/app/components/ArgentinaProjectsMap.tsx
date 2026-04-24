"use client";

import { useEffect, useMemo, useState } from "react";

import { useProvinceProjects } from "@/hooks/useProvinceProjects";
import type { ProvinceProjectCard } from "@/lib/supabase/province-projects";
import argentinaProvinceMapData from "./argentinaProvinceMapData.json";

type ProvinceShape = {
  id: string;
  name: string;
  centroid: [number, number];
  path: string;
};

const mapData = argentinaProvinceMapData as {
  viewBox: [number, number, number, number];
  provinces: ProvinceShape[];
};

const FIRST_PROVINCE_ID = mapData.provinces[0]?.id ?? "buenos-aires";

function pathTooltip(provinceName: string, projects: ProvinceProjectCard[]): string {
  if (projects.length === 0) return provinceName;
  const names = projects.map((p) => p.title).join(" · ");
  return `${provinceName}: ${names}`;
}

export default function ArgentinaProjectsMap() {
  const { byProvince, loading, error } = useProvinceProjects();
  const projects = useMemo(() => byProvince ?? {}, [byProvince]);

  const provincesWithProjects = useMemo(
    () =>
      mapData.provinces.filter(
        (province) => (projects[province.id] ?? []).length > 0,
      ),
    [projects],
  );

  const provinceById = useMemo(
    () => new Map(mapData.provinces.map((province) => [province.id, province])),
    [],
  );

  const [selectedProvinceId, setSelectedProvinceId] = useState<string>(FIRST_PROVINCE_ID);
  const [hoveredProvinceId, setHoveredProvinceId] = useState<string | null>(null);
  const [selectionLocked, setSelectionLocked] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  useEffect(() => {
    if (!byProvince) return;
    const withData = mapData.provinces.find((p) => (byProvince[p.id] ?? []).length > 0);
    if (withData) setSelectedProvinceId(withData.id);
  }, [byProvince]);

  const activeProvinceId = selectionLocked
    ? selectedProvinceId
    : hoveredProvinceId ?? selectedProvinceId;
  const activeProvince = provinceById.get(activeProvinceId) ?? mapData.provinces[0] ?? null;
  const activeProjects = activeProvince ? (projects[activeProvince.id] ?? []) : [];
  const activeProject = activeProjects[selectedProjectIndex] ?? activeProjects[0] ?? null;

  useEffect(() => {
    setSelectedProjectIndex(0);
  }, [activeProvinceId]);

  if (!activeProvince) {
    return null;
  }

  return (
    <section
      className="border-y border-slate-200 bg-surface py-24 lg:overflow-visible"
      aria-label="Mapa de proyectos por provincia"
    >
      <div className="container mx-auto px-4 md:px-6">
        {error && (
          <p className="mb-4 rounded-sm border border-amber-200/80 bg-amber-50 px-4 py-2 text-sm text-amber-900">
            No se pudieron cargar los proyectos. Verificá Supabase o la tabla{" "}
            <code className="text-xs">province_projects</code>.
          </p>
        )}

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
                <p className="mt-2 text-sm text-slate-500">
                  Las provincias con entregas o proyectos se resaltan en el mapa. Pasá el cursor (o tocá
                  en móvil) para ver el detalle.
                </p>
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
                    {selectionLocked ? "Selección fija" : "Hover activo"}
                  </span>
                  {selectionLocked ? (
                    <button
                      className="inline-flex items-center rounded-full border border-accent-blue/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent-blue transition-colors hover:bg-blue-50"
                      onClick={() => setSelectionLocked(false)}
                      type="button"
                    >
                      Liberar selección
                    </button>
                  ) : null}
                </div>

                <div className="mb-5">
                  <h4 className="font-headline text-2xl font-extrabold text-primary md:text-[2rem]">
                    {activeProvince.name}
                  </h4>
                  <p className="mt-2.5 max-w-lg text-[13px] leading-relaxed text-slate-500">
                    {activeProjects.length > 0
                      ? "Proyectos y referencias en esta jurisdicción, cargados desde el panel de datos."
                      : "No hay proyectos publicados para esta provincia. Suma filas en la tabla province_projects (slug = id del mapa, ej. buenos-aires)."}
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
                      {loading
                        ? "Cargando datos de proyectos…"
                        : "No hay entradas para esta provincia. Cargá registros en Supabase (tabla province_projects) con el mismo identificador de provincia que el mapa (ej. cordoba, mendoza)."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div
              className={`relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0px_32px_80px_rgba(13,44,79,0.08)] md:p-6 ${loading ? "opacity-60" : ""}`}
            >
              {loading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 backdrop-blur-[2px]">
                  <div className="text-center text-sm text-slate-500">
                    <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-accent-blue/30 border-t-accent-blue" />
                    Cargando proyectos…
                  </div>
                </div>
              )}
              <div className="pointer-events-none absolute inset-x-8 top-6 z-10 flex items-center justify-between">
                <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 backdrop-blur">
                  Hover / tooltip
                </span>
                <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 backdrop-blur">
                  Tap móvil
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
                      const list = projects[province.id] ?? [];
                      const projectCount = list.length;
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
                        >
                          <title>{pathTooltip(province.name, list)}</title>
                        </path>
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
