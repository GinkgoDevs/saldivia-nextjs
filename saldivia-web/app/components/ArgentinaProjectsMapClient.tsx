"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

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
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [mapTooltip, setMapTooltip] = useState<MapTooltip>(null);

  const [connector, setConnector] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const panelAnchorRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const mapSurfaceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const withData = mapData.provinces.find((p) => (byProvince[p.id] ?? []).length > 0);
    if (withData) setSelectedProvinceId(withData.id);
  }, [byProvince]);

  const activeProvinceId = selectionLocked
    ? selectedProvinceId
    : hoveredProvinceId ?? selectedProvinceId;
  const activeProvince = provinceById.get(activeProvinceId) ?? mapData.provinces[0] ?? null;
  const activeProjects = activeProvince ? (projects[activeProvince.id] ?? []) : [];
  const activeProject = activeProjects[selectedProjectIndex] ?? activeProjects[0] ?? null;

  const showConnector = hoveredProvinceId !== null || selectionLocked;

  useEffect(() => {
    setSelectedProjectIndex(0);
  }, [activeProvinceId]);

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

  const updateConnector = useCallback(() => {
    const sectionEl = sectionRef.current;
    const anchorEl = panelAnchorRef.current;
    const svg = svgRef.current;
    if (!showConnector || !sectionEl || !anchorEl || !svg || !activeProvince) {
      setConnector(null);
      return;
    }
    const minW = typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)") : null;
    if (minW && !minW.matches) {
      setConnector(null);
      return;
    }
    const rect = sectionEl.getBoundingClientRect();
    const ar = anchorEl.getBoundingClientRect();
    const [cx, cy] = activeProvince.centroid;
    const pt = svg.createSVGPoint();
    pt.x = cx;
    pt.y = cy;
    const ctm = svg.getScreenCTM();
    if (!ctm) {
      setConnector(null);
      return;
    }
    const sp = pt.matrixTransform(ctm);
    setConnector({
      x1: ar.right - rect.left,
      y1: ar.top + Math.min(ar.height / 2, 48) - rect.top,
      x2: sp.x - rect.left,
      y2: sp.y - rect.top,
    });
  }, [activeProvince, showConnector]);

  useLayoutEffect(() => {
    updateConnector();
  }, [updateConnector]);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return undefined;
    const ro = new ResizeObserver(() => updateConnector());
    ro.observe(sec);
    const onResize = () => updateConnector();
    window.addEventListener("scroll", onResize, true);
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onResize, true);
      window.removeEventListener("resize", onResize);
    };
  }, [updateConnector]);

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

      {/* Línea puente panel ↔ provincia */}
      {connector ? (
        <svg
          className="pointer-events-none absolute inset-0 z-[5] hidden h-full w-full overflow-visible lg:block"
          aria-hidden
        >
          <defs>
            <linearGradient id="presenceConnectorGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(56,189,248,0.92)" />
              <stop offset="52%" stopColor="rgba(32,149,212,0.35)" />
              <stop offset="100%" stopColor="rgba(56,189,248,0.55)" />
            </linearGradient>
          </defs>
          <path
            d={`M ${connector.x1} ${connector.y1} Q ${(connector.x1 + connector.x2) / 2} ${connector.y2 - (connector.y2 - connector.y1) * 0.15} ${connector.x2} ${connector.y2}`}
            fill="none"
            stroke="url(#presenceConnectorGlow)"
            strokeDasharray={5.5}
            strokeLinecap="round"
            strokeWidth={1}
            opacity={0.55}
          />
        </svg>
      ) : null}

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {fetchError ? (
          <p className="mb-4 rounded-sm border border-amber-300/35 bg-amber-950/50 px-4 py-2 text-sm text-amber-100">
            No se pudieron cargar proyectos destacados. Revisá la tabla{" "}
            <code className="text-xs">locations</code> en Supabase. {fetchError.message}
          </p>
        ) : null}

        <div className="flex flex-col gap-10 xl:gap-12">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(300px,0.82fr)_minmax(0,1.18fr)] lg:gap-10 xl:gap-12">
            <div className="order-2 lg:order-1">
              <div className="mb-6 max-w-xl lg:mb-8">
                <p className="mb-4 inline-flex items-center gap-3 font-headline text-sm font-black uppercase tracking-[0.28em] text-accent-blue md:text-base">
                  <span className="h-[2.125rem] w-0.5 shrink-0 bg-accent-blue" aria-hidden />
                  Presencia nacional
                </p>
                <h2 className="font-headline text-4xl font-extrabold text-white md:text-5xl">
                  Nuestras últimas unidades
                </h2>
                <p className="mt-3 text-base leading-relaxed text-slate-400 md:text-lg">
                  Cada pin es un proyecto que refleja nuestra trayectoria. Pasá el cursor sobre una provincia para
                  ver el detalle.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-cyan-400/35 bg-[#081a30]/85 px-4 py-4 text-center font-headline sm:text-left">
                  <p className="text-2xl font-black tabular-nums text-white md:text-3xl">{aggregate.provincesWith}</p>
                  <p className="ui-caption-caps mt-1.5 text-slate-400">Provincias</p>
                </div>
                <div className="rounded-xl border border-cyan-400/35 bg-[#081a30]/85 px-4 py-4 text-center font-headline sm:text-left">
                  <p className="text-2xl font-black tabular-nums text-white md:text-3xl">{aggregate.projectsTotal}</p>
                  <p className="ui-caption-caps mt-1.5 text-slate-400">Proyectos</p>
                </div>
                <div className="rounded-xl border border-cyan-400/35 bg-[#081a30]/85 px-4 py-4 text-center font-headline sm:text-left">
                  <p className="text-2xl font-black tabular-nums text-white md:text-3xl">
                    +{new Date().getFullYear() - 1995}
                  </p>
                  <p className="ui-caption-caps mt-1.5 text-slate-400">Años</p>
                </div>
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
            <div
              ref={mapSurfaceRef}
              className="relative overflow-hidden rounded-[2rem] border border-cyan-400/25 bg-gradient-to-br from-[#0a1e36]/95 to-[#020817]/98 p-4 shadow-[0px_42px_100px_rgba(0,0,0,0.55)] md:p-6"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_54%_20%,rgba(32,149,212,0.08),transparent_58%)]" />

              {/* Contador */}
              <div className="absolute left-4 top-4 z-[6] rounded-full border border-cyan-400/40 bg-[#061220]/94 px-3 py-1.5 font-headline text-sm font-bold uppercase tracking-[0.15em] text-slate-200 shadow-[0_0_26px_rgba(32,149,212,0.15)] backdrop-blur-sm md:left-6 md:top-6">
                <span className="tabular-nums text-white">{aggregate.provincesWith}</span>
                {" provincias "}
                <span className="text-slate-500">·</span>
                {" "}
                <span className="tabular-nums text-white">{aggregate.projectsTotal}</span> proyectos
              </div>

              {/* Tooltip proyecto */}
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

              <div className="relative z-[2] flex justify-center lg:max-h-[760px] xl:max-h-[820px]">
                <svg
                  ref={svgRef}
                  className="h-auto w-full max-w-[520px]"
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
                    <clipPath id="argentinaMapClip">
                      <rect x={0} y={0} width={vbWidth} height={vbHeight} rx={28} ry={28} />
                    </clipPath>
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

                  <g clipPath="url(#argentinaMapClip)">
                    <rect
                      width={vbWidth}
                      height={vbHeight}
                      fill="#030b14"
                      opacity={0.96}
                    />
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
                            onClick={() => {
                              setSelectedProvinceId(province.id);
                              setSelectionLocked(true);
                              setHoveredProvinceId(null);
                              setMapTooltip(null);
                            }}
                            onFocus={() => {
                              setSelectedProvinceId(province.id);
                              setSelectionLocked(true);
                              setHoveredProvinceId(null);
                              setMapTooltip(null);
                            }}
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
                  </g>
                </svg>
              </div>

              {/* Leyenda */}
              <div className="relative z-[2] mt-4 flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-4 text-sm font-bold uppercase tracking-[0.16em] text-slate-400 md:justify-end">
                <span className="inline-flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inset-0 rounded-full bg-accent-blue shadow-[0_0_10px_rgba(32,149,212,0.75)]" />
                  </span>
                  Con proyecto
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full border border-slate-500/80 bg-transparent ring-2 ring-transparent" />
                  Sin proyecto
                </span>
              </div>
            </div>
          </div>
          </div>

          {/* Detalle de unidad — ancho completo para evitar recorte con el mapa */}
          <div
            className="relative rounded-[1.5rem] border border-cyan-400/35 bg-[#081a30]/92 p-5 shadow-[0px_36px_80px_rgba(0,10,26,0.55)] backdrop-blur-sm md:p-8"
            aria-live="polite"
            aria-atomic="true"
          >
            <div
              ref={panelAnchorRef}
              aria-hidden
              className="pointer-events-none absolute right-0 top-10 z-[1] hidden h-20 w-px lg:block xl:top-12"
            />

            <div className="min-w-0 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-accent-blue px-2.5 py-1 text-sm font-black uppercase tracking-[0.22em] text-white shadow-[0_0_22px_rgba(32,149,212,0.35)]">
                  Provincia activa
                </span>
                <span className="inline-flex items-center rounded-full border border-white/18 bg-[#071422]/85 px-2.5 py-1 text-sm font-bold uppercase tracking-[0.18em] text-slate-300">
                  {activeProjects.length} destacado
                  {activeProjects.length === 1 ? "" : "s"}
                </span>
                <span className="inline-flex items-center rounded-full border border-white/12 px-2.5 py-1 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                  {selectionLocked ? "Selección fija" : "Hover activo"}
                </span>
                {selectionLocked ? (
                  <button
                    className="inline-flex items-center rounded-full border border-cyan-400/40 px-2.5 py-1 text-sm font-bold uppercase tracking-[0.18em] text-accent-blue transition-colors hover:bg-cyan-400/15"
                    onClick={() => setSelectionLocked(false)}
                    type="button"
                  >
                    Liberar selección
                  </button>
                ) : null}
              </div>

              <div>
                <h3 className="font-headline text-3xl font-extrabold text-white md:text-4xl">
                  {activeProvince.name}
                </h3>
                <p className="mt-2.5 max-w-3xl text-base leading-relaxed text-slate-400 md:text-lg">
                  {activeProjects.length > 0
                    ? "Proyectos destacados en esta provincia."
                    : "No hay destacados en esta provincia. Creálos en Dashboard → Ubicaciones; la provincia debe ser la del mapa (slug, ej. cordoba)."}
                </p>
              </div>

            <div className="min-w-0 space-y-3">
              {activeProjects.length > 0 ? (
                <>
                  {activeProjects.length > 1 ? (
                    <div className="flex flex-wrap gap-2">
                      {activeProjects.map((project, index) => {
                        const isSelected = index === selectedProjectIndex;
                        return (
                          <button
                            key={`${activeProvince.id}-tab-${index}`}
                            className={`rounded-full border px-3 py-1.5 text-left text-sm font-black uppercase tracking-[0.18em] transition-colors ${
                              isSelected
                                ? "border-accent-blue bg-accent-blue/25 text-accent-blue"
                                : "border-white/15 bg-transparent text-slate-400 hover:border-cyan-400/45 hover:text-slate-200"
                            }`}
                            onClick={() => setSelectedProjectIndex(index)}
                            type="button"
                          >
                            Destacado {index + 1}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  {activeProject ? (
                    <article
                      key={`${activeProvince.id}-${selectedProjectIndex}-${activeProject.title}`}
                      className="relative overflow-visible rounded-[1.25rem] border border-white/14 bg-[#051018]/92 pl-[4px]"
                    >
                      <div
                        className="pointer-events-none absolute bottom-4 left-0 top-4 w-[3px] rounded-sm bg-accent-blue"
                        aria-hidden
                      />
                      <div className="p-4 pl-[1.125rem] md:p-5 md:pl-6">
                        <div className="mb-2.5 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center rounded-full border border-accent-blue/50 bg-accent-blue/20 px-2.5 py-1 text-xs font-black uppercase tracking-[0.22em] text-accent-blue">
                            {activeProject.segment}
                          </span>
                          {activeProject.year.trim() && activeProject.year.trim() !== "—" ? (
                            <span className="inline-flex items-center rounded-full border border-white/15 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                              {activeProject.year}
                            </span>
                          ) : null}
                        </div>
                        <h4 className="font-headline text-xl font-bold text-white md:text-2xl">{activeProject.title}</h4>
                        <p className="mt-1.5 text-sm font-black uppercase tracking-[0.18em] text-accent-blue">
                          {activeProject.location}
                        </p>
                        <p className="mt-2.5 text-base leading-relaxed text-slate-300 md:text-lg">
                          {activeProject.description}
                        </p>
                      </div>
                    </article>
                  ) : null}
                </>
              ) : (
                <div className="rounded-[1.25rem] border border-dashed border-white/22 bg-[#071422]/80 p-5 text-base leading-relaxed text-slate-500">
                  No hay proyectos destacados en esta provincia. Agregalos en Dashboard → Ubicaciones con el slug
                  correcto (ej. mendoza, buenos-aires) y marcá Activo.
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
