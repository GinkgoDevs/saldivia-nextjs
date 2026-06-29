"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { ProvinceProjectCard } from "@/lib/supabase/province-projects";
import argentinaProvinceMapData from "./argentinaProvinceMapData.json";
import { ProvinceProjectCardsGrid } from "./ProvinceProjectCardsGrid";

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

const HEX = {
  idleNoProjects: "rgba(13, 44, 79, 0.48)",
  idleWithProjects: "rgba(20, 62, 92, 0.58)",
  strokeIdle: "rgba(148, 163, 184, 0.22)",
  activeFill: "rgba(32, 149, 212, 0.34)",
  activeStroke: "#38bdf8",
} as const;

function pathTooltip(provinceName: string, entries: ProvinceProjectCard[]): string {
  if (entries.length === 0) return provinceName;
  const names = entries.map((p) => p.title).join(" · ");
  return `${provinceName}: ${names}`;
}

type MapTooltip =
  | {
      px: number;
      py: number;
      segment: string;
      title: string;
      location: string;
      provinceId: string;
    }
  | null;

export type ArgentinaProjectsMapClientProps = {
  byProvince: Partial<Record<string, ProvinceProjectCard[]>>;
  fetchError: Error | null;
};

export default function ArgentinaProjectsMapClient({
  byProvince,
  fetchError,
}: ArgentinaProjectsMapClientProps) {
  const projects = useMemo(() => byProvince ?? {}, [byProvince]);

  const provinceById = useMemo(
    () => new Map(mapData.provinces.map((province) => [province.id, province])),
    [],
  );

  const aggregate = useMemo(() => {
    let provincesWith = 0;
    let projectsTotal = 0;
    for (const province of mapData.provinces) {
      const n = (projects[province.id] ?? []).length;
      if (n > 0) {
        provincesWith += 1;
        projectsTotal += n;
      }
    }
    return { provincesWith, projectsTotal };
  }, [projects]);

  const [selectedProvinceId, setSelectedProvinceId] = useState<string>(FIRST_PROVINCE_ID);
  const [hoveredProvinceId, setHoveredProvinceId] = useState<string | null>(null);
  const [selectionLocked, setSelectionLocked] = useState(false);
  const [mapTooltip, setMapTooltip] = useState<MapTooltip>(null);
  const [isDesktopLayout, setIsDesktopLayout] = useState(false);
  const [mapColumnHeight, setMapColumnHeight] = useState<number | undefined>(undefined);

  const sectionRef = useRef<HTMLElement | null>(null);
  const projectsPanelRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const mapSurfaceRef = useRef<HTMLDivElement | null>(null);

  const scrollToProjectsIfNeeded = useCallback(() => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) return;
    const panel = projectsPanelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const navOffset = 96;
    const mostlyHidden = rect.top > window.innerHeight * 0.42 || rect.bottom < navOffset + 120;
    if (mostlyHidden) {
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktopLayout(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleProvinceSelect = useCallback(
    (provinceId: string) => {
      setSelectedProvinceId(provinceId);
      setSelectionLocked(true);
      setHoveredProvinceId(null);
      setMapTooltip(null);
      requestAnimationFrame(() => scrollToProjectsIfNeeded());
    },
    [scrollToProjectsIfNeeded],
  );

  useEffect(() => {
    const withData = mapData.provinces.find((p) => (byProvince[p.id] ?? []).length > 0);
    if (withData) setSelectedProvinceId(withData.id);
  }, [byProvince]);

  const activeProvinceId = selectionLocked
    ? selectedProvinceId
    : hoveredProvinceId ?? selectedProvinceId;
  const activeProvince = provinceById.get(activeProvinceId) ?? mapData.provinces[0] ?? null;
  const activeProjects = activeProvince ? (projects[activeProvince.id] ?? []) : [];

  useEffect(() => {
    if (!isDesktopLayout) {
      setMapColumnHeight(undefined);
      return undefined;
    }
    const el = mapSurfaceRef.current;
    if (!el) return undefined;

    const syncHeight = () => {
      setMapColumnHeight(el.getBoundingClientRect().height);
    };

    syncHeight();
    const ro = new ResizeObserver(syncHeight);
    ro.observe(el);
    window.addEventListener("resize", syncHeight);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncHeight);
    };
  }, [isDesktopLayout, activeProvinceId, selectionLocked]);

  const updateTooltipForProvince = useCallback((provinceId: string) => {
    const svg = svgRef.current;
    const surf = mapSurfaceRef.current;
    const list = projects[provinceId] ?? [];
    const prov = provinceById.get(provinceId);
    if (!svg || !surf || !prov || list.length === 0) {
      setMapTooltip(null);
      return;
    }
    const preview = list[0]!;
    const [cx, cy] = prov.centroid;
    const pt = svg.createSVGPoint();
    pt.x = cx;
    pt.y = cy;
    const ctm = svg.getScreenCTM();
    if (!ctm) {
      setMapTooltip(null);
      return;
    }
    const screen = pt.matrixTransform(ctm);
    const fig = surf.getBoundingClientRect();
    setMapTooltip({
      px: screen.x - fig.left,
      py: screen.y - fig.top,
      segment: preview.segment,
      title: preview.title,
      location: preview.location,
      provinceId,
    });
  }, [projects, provinceById]);

  if (!activeProvince) {
    return null;
  }

  const vbWidth = mapData.viewBox[2];
  const vbHeight = mapData.viewBox[3];

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-visible border-y border-white/10 bg-[#071422] py-24 lg:overflow-visible"
      aria-label="Mapa de proyectos destacados por provincia"
    >
      {/* ── Background: gradiente tipo Hero + overlays ───────────── */}
      <div className="pointer-events-none absolute inset-0 hero-gradient-home opacity-95" aria-hidden />
      <div className="pointer-events-none absolute inset-0 hero-overlay-home" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0d2c4f]/95 via-[#061220] to-[#020817]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(32,149,212,0.14),transparent_55%)]"
      />
      {/* Líneas técnicas (circuit diagram / orthogonal) */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.11]" aria-hidden>
        <defs>
          <pattern
            id="argentinaPresenceCircuitLines"
            width="72"
            height="72"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M36 8v56M8 36h56M52 52L20 20M52 20L20 52"
              fill="none"
              stroke="#38bdf8"
              strokeWidth={0.45}
              opacity={0.7}
            />
            <circle cx={36} cy={36} r={1} fill="#38bdf8" opacity={0.5} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#argentinaPresenceCircuitLines)" />
      </svg>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {fetchError ? (
          <p className="mb-4 rounded-sm border border-amber-300/35 bg-amber-950/50 px-4 py-2 text-sm text-amber-100">
            No se pudieron cargar los proyectos destacados. Intente más tarde.
          </p>
        ) : null}

        <div className="flex flex-col gap-10 xl:gap-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="mb-4 inline-flex items-center gap-3 font-headline text-sm font-black uppercase tracking-[0.28em] text-accent-blue md:text-base">
                <span className="h-[2.125rem] w-0.5 shrink-0 bg-accent-blue" aria-hidden />
                Presencia nacional
              </p>
              <h2 className="font-headline text-4xl font-extrabold text-white md:text-5xl">
                Nuestras últimas unidades
              </h2>
              <p className="mt-3 text-base leading-relaxed text-slate-400 md:text-lg">
                Seleccione una provincia y explore las empresas con unidades Saldivia en todo el país.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:max-w-md lg:justify-end">
              <div className="rounded-curve-md border border-cyan-400/35 bg-[#081a30]/85 px-4 py-3 text-center font-headline sm:min-w-[7.5rem]">
                <p className="text-2xl font-black tabular-nums text-white">{aggregate.provincesWith}</p>
                <p className="ui-caption-caps mt-1 text-slate-400">Provincias</p>
              </div>
              <div className="rounded-curve-md border border-cyan-400/35 bg-[#081a30]/85 px-4 py-3 text-center font-headline sm:min-w-[7.5rem]">
                <p className="text-2xl font-black tabular-nums text-white">{aggregate.projectsTotal}</p>
                <p className="ui-caption-caps mt-1 text-slate-400">Proyectos</p>
              </div>
              <div className="rounded-curve-md border border-cyan-400/35 bg-[#081a30]/85 px-4 py-3 text-center font-headline sm:min-w-[7.5rem]">
                <p className="text-2xl font-black tabular-nums text-white">
                  +{new Date().getFullYear() - 1995}
                </p>
                <p className="ui-caption-caps mt-1 text-slate-400">Años</p>
              </div>
            </div>
          </div>

          <div className="rounded-curve-md border border-cyan-400/25 bg-[#030b14] shadow-[0px_42px_100px_rgba(0,0,0,0.55)] lg:grid lg:grid-cols-[minmax(340px,44%)_minmax(0,1fr)] lg:items-start lg:overflow-hidden">
            <div ref={mapSurfaceRef} className="relative h-fit w-full min-w-0">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_54%_20%,rgba(32,149,212,0.08),transparent_58%)]" />

              <div className="relative z-[6] flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 md:px-6">
                <p className="font-headline text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Mapa interactivo
                </p>
                {!selectionLocked ? (
                  <p className="hidden text-xs font-bold uppercase tracking-[0.16em] text-slate-500 lg:block">
                    Hover para previsualizar · clic para fijar
                  </p>
                ) : (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full border border-cyan-400/35 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-accent-blue transition-colors hover:bg-cyan-400/10"
                    onClick={() => setSelectionLocked(false)}
                  >
                    <span className="material-symbols-outlined text-sm">explore</span>
                    Modo exploración
                  </button>
                )}
              </div>

              {mapTooltip &&
              hoveredProvinceId &&
              mapTooltip.provinceId === hoveredProvinceId &&
              (projects[hoveredProvinceId] ?? []).length > 0 ? (
                <div
                  role="tooltip"
                  className="pointer-events-none absolute z-20 max-w-[min(100%,260px)] -translate-x-1/2 -translate-y-[calc(100%+18px)] rounded-lg border border-cyan-400/45 bg-[#051018]/96 px-3.5 py-2.5 text-left shadow-[0_16px_40px_rgba(0,0,0,0.55)] backdrop-blur-[6px]"
                  style={{ left: mapTooltip.px, top: mapTooltip.py }}
                >
                  <p className="font-headline text-xs font-black uppercase tracking-[0.26em] text-accent-blue">
                    {mapTooltip.segment}
                  </p>
                  <p className="mt-1.5 font-headline text-base font-bold leading-tight text-white">
                    {mapTooltip.title}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {mapTooltip.location}
                  </p>
                </div>
              ) : null}

              <div className="relative z-[2]">
                <div className="flex justify-center px-4 pb-4 pt-2">
                  <svg
                    ref={svgRef}
                    className="block h-auto w-full max-w-[min(100%,440px)]"
                    preserveAspectRatio="xMidYMin meet"
                  viewBox={mapData.viewBox.join(" ")}
                  xmlns="http://www.w3.org/2000/svg"
                  onMouseLeave={() => {
                    if (!selectionLocked) {
                      setHoveredProvinceId(null);
                    }
                    setMapTooltip(null);
                  }}
                >
                  <defs>
                    <pattern
                      id="argentinaMapInteriorMesh"
                      width={48}
                      height={48}
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M48 0H0V48M24 0V48M0 24H48"
                        fill="none"
                        stroke="rgba(56,189,248,0.09)"
                        strokeWidth={0.55}
                      />
                    </pattern>
                    <filter id="argentinaProvinceActiveGlow" x="-40%" y="-40%" width="180%" height="180%">
                      <feDropShadow
                        dx="0"
                        dy="10"
                        stdDeviation="12"
                        floodColor="#2095d4"
                        floodOpacity="0.35"
                      />
                    </filter>
                  </defs>

                  <rect width={vbWidth} height={vbHeight} fill="url(#argentinaMapInteriorMesh)" opacity={0.65} />

                  <g>
                      {mapData.provinces.map((province) => {
                        const list = projects[province.id] ?? [];
                        const projectCount = list.length;
                        const isActive = province.id === activeProvince.id;
                        const hasProjects = projectCount > 0;
                        const fill = isActive
                          ? HEX.activeFill
                          : hasProjects
                            ? HEX.idleWithProjects
                            : HEX.idleNoProjects;
                        return (
                          <path
                            key={province.id}
                            d={province.path}
                            className="cursor-pointer transition-[fill,stroke,stroke-width,filter] duration-200 ease-out"
                            fill={fill}
                            stroke={isActive ? HEX.activeStroke : HEX.strokeIdle}
                            strokeWidth={isActive ? 2.1 : 1.05}
                            filter={isActive ? "url(#argentinaProvinceActiveGlow)" : undefined}
                            onClick={() => handleProvinceSelect(province.id)}
                            onFocus={() => handleProvinceSelect(province.id)}
                            onMouseEnter={() => {
                              if (!selectionLocked) {
                                setHoveredProvinceId(province.id);
                                updateTooltipForProvince(province.id);
                              }
                            }}
                          >
                            <title>{pathTooltip(province.name, list)}</title>
                          </path>
                        );
                      })}
                  </g>

                  {/* Pins luminosos por provincias con proyecto */}
                  <g className="pointer-events-none">
                      {mapData.provinces.map((province) => {
                        const list = projects[province.id] ?? [];
                        if (list.length === 0) return null;
                        const [cx, cy] = province.centroid;
                        const isPinnedActive = province.id === activeProvince.id;
                        return (
                          <g key={`pin-${province.id}`} transform={`translate(${cx} ${cy})`}>
                            <circle
                              r={13}
                              className="motion-reduce:!animate-none motion-reduce:!opacity-[0.35]"
                              cx={0}
                              cy={0}
                              fill="none"
                              stroke="#38bdf8"
                              strokeOpacity={isPinnedActive ? 0.7 : 0.45}
                              strokeWidth={1}
                              style={{
                                animation: "saldivia-pin-halo 3s ease-in-out infinite",
                                transformBox: "fill-box",
                                transformOrigin: "center",
                              }}
                            />
                            <circle
                              r={3.65}
                              cx={0}
                              cy={0}
                              fill="#7dd3fc"
                              opacity={isPinnedActive ? 1 : 0.92}
                            />
                            <circle r={9} cx={0} cy={0} fill="#2095d4" opacity={0.12} />
                          </g>
                        );
                      })}
                  </g>
                </svg>
                </div>
              </div>
            </div>

            <div
              ref={projectsPanelRef}
              id="province-projects-panel"
              className="scroll-mt-28 border-t border-white/10 bg-[#071422]/60 lg:flex lg:min-h-0 lg:flex-col lg:overflow-hidden lg:border-l lg:border-t-0"
              style={isDesktopLayout && mapColumnHeight ? { maxHeight: mapColumnHeight } : undefined}
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="shrink-0 border-b border-white/10 px-5 py-6 md:px-7 md:py-7">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-headline text-xs font-black uppercase tracking-[0.24em] text-accent-blue">
                        Unidades en
                      </p>
                      <h3 className="font-headline text-2xl font-extrabold text-white md:text-3xl">
                        {activeProvince.name}
                      </h3>
                      <p className="mt-1.5 text-sm text-slate-400 md:text-base">
                        {activeProjects.length > 0
                          ? `${activeProjects.length} empresa${activeProjects.length === 1 ? "" : "s"} con flota Saldivia`
                          : "Sin proyectos cargados en esta provincia"}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full border border-white/15 bg-[#081a30]/90 px-3 py-1 text-xs font-bold tabular-nums uppercase tracking-[0.14em] text-slate-300">
                      {activeProjects.length} total
                    </span>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Cambiar provincia
                    </span>
                    <div className="relative">
                      <select
                        value={activeProvince.id}
                        onChange={(e) => handleProvinceSelect(e.target.value)}
                        className="w-full cursor-pointer appearance-none rounded-curve-sm border border-white/15 bg-[#081a30]/90 py-3 pl-4 pr-10 font-headline text-sm font-bold uppercase tracking-[0.1em] text-white transition-colors hover:border-cyan-400/35 focus-visible:border-accent-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/40"
                      >
                        {mapData.provinces.map((province) => {
                          const count = (projects[province.id] ?? []).length;
                          return (
                            <option key={province.id} value={province.id} disabled={count === 0}>
                              {province.name}
                              {count > 0 ? ` (${count})` : " — sin proyectos"}
                            </option>
                          );
                        })}
                      </select>
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-xl text-slate-400">
                        expand_more
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="px-5 py-6 md:px-7 md:py-7 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain lg:pr-4">
                <ProvinceProjectCardsGrid
                  key={activeProvince.id}
                  projects={activeProjects}
                  initialLimit={isDesktopLayout ? undefined : 8}
                  compact={isDesktopLayout}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
