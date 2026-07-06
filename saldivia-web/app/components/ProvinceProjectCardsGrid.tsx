"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import type { ProvinceProjectCard } from "@/lib/supabase/province-projects";
import { optimizedStorageImageUrl } from "@/lib/optimized-storage-image";
import { imageFocalStyle } from "@/lib/image-focal";

type LightboxState = {
  index: number;
  items: ProvinceProjectCard[];
} | null;

function ProjectLightbox({
  state,
  onClose,
  onPrev,
  onNext,
}: {
  state: LightboxState;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const current = state ? state.items[state.index] : null;

  useEffect(() => {
    if (!state) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [state, onClose, onPrev, onNext]);

  if (!state || !current?.imageUrl) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Ampliar: ${current.title}`}
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-4 top-4 z-30 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/70 text-white shadow-lg backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue sm:right-6 sm:top-6"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Cerrar"
      >
        <span className="material-symbols-outlined text-[1.75rem]">close</span>
      </button>

      {state.items.length > 1 ? (
        <>
          <button
            type="button"
            className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/60 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue sm:left-6"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Anterior"
          >
            <span className="material-symbols-outlined text-2xl">chevron_left</span>
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/60 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue sm:right-6"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Siguiente"
          >
            <span className="material-symbols-outlined text-2xl">chevron_right</span>
          </button>
        </>
      ) : null}

      <div className="pointer-events-none flex h-full w-full items-center justify-center p-4 sm:p-8">
        <div className="pointer-events-auto relative flex max-h-[min(88vh,920px)] w-full max-w-5xl flex-col">
          <div
            className="relative min-h-[200px] flex-1 cursor-pointer overflow-hidden rounded-curve-lg border border-white/15 bg-[#051018] shadow-2xl"
            onClick={onClose}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={optimizedStorageImageUrl(current.imageUrl) ?? current.imageUrl}
              alt={current.title}
              className="mx-auto h-full max-h-[min(72vh,780px)] w-full cursor-default object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="mt-4 text-center">
            <p className="font-headline text-xl font-bold text-white md:text-2xl">{current.title}</p>
            {state.items.length > 1 ? (
              <p className="mt-1 text-sm text-slate-400">
                {state.index + 1} de {state.items.length}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function MapProjectImage({
  src,
  alt,
  focalX = 50,
  focalY = 50,
  zoom = 1,
}: {
  src: string;
  alt: string;
  focalX?: number;
  focalY?: number;
  zoom?: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const [useNative, setUseNative] = useState(false);
  const imageSrc = optimizedStorageImageUrl(src) ?? src;
  const coverZoom = Math.max(1, zoom ?? 1);
  const focalStyle = imageFocalStyle(focalX, focalY, coverZoom);

  if (useNative) {
    return (
      <>
        {!loaded ? <span className="absolute inset-0 animate-pulse bg-[#0d2844]" aria-hidden /> : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:scale-[1.03] ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          style={focalStyle}
          onLoad={() => setLoaded(true)}
        />
      </>
    );
  }

  return (
    <>
      {!loaded ? <span className="absolute inset-0 animate-pulse bg-[#0d2844]" aria-hidden /> : null}
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
        className={`object-cover transition-opacity duration-500 group-hover:scale-[1.03] ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={focalStyle}
        onLoad={() => setLoaded(true)}
        onError={() => setUseNative(true)}
      />
    </>
  );
}

function ProjectCard({
  project,
  onOpen,
  fillHeight = false,
}: {
  project: ProvinceProjectCard;
  onOpen: () => void;
  fillHeight?: boolean;
}) {
  const hasImage = Boolean(project.imageUrl);

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-curve-lg border border-white/12 bg-[#051018]/90 shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-colors hover:border-cyan-400/35 ${
        fillHeight ? "h-full min-h-0" : ""
      }`}
    >
      <button
        type="button"
        className={`relative w-full overflow-hidden bg-[#0a1e36] text-left ${
          fillHeight ? "min-h-0 flex-1" : "aspect-[4/3]"
        }`}
        onClick={hasImage ? onOpen : undefined}
        disabled={!hasImage}
        aria-label={hasImage ? `Ver imagen de ${project.title}` : project.title}
      >
        {hasImage ? (
          <>
            <MapProjectImage
              src={project.imageUrl!}
              alt={project.title}
              focalX={project.imageFocalX}
              focalY={project.imageFocalY}
              zoom={project.imageZoom}
            />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <span className="pointer-events-none absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <span className="material-symbols-outlined text-lg">zoom_in</span>
            </span>
          </>
        ) : (
          <span className="flex h-full items-center justify-center text-slate-600">
            <span className="material-symbols-outlined text-5xl">directions_bus</span>
          </span>
        )}
      </button>
      <div className={`flex shrink-0 flex-col gap-1 p-4 ${fillHeight ? "pt-3" : ""}`}>
        <h4 className="font-headline text-base font-bold leading-tight text-white md:text-lg">
          {project.title}
        </h4>
        {project.segment && project.segment !== "—" ? (
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-blue">{project.segment}</p>
        ) : null}
        {hasImage ? (
          <button
            type="button"
            className="mt-2 inline-flex items-center gap-1 self-start text-xs font-bold uppercase tracking-[0.16em] text-slate-400 transition-colors hover:text-accent-blue"
            onClick={onOpen}
          >
            Ver imagen
            <span className="material-symbols-outlined text-sm">open_in_full</span>
          </button>
        ) : null}
      </div>
    </article>
  );
}

const GRID_GAP_PX = 16;
const MIN_ROW_HEIGHT_PX = 150;

function computeDesktopGridLayout(viewportHeight: number, rowCount: number) {
  if (rowCount <= 0 || viewportHeight <= 0) return null;

  const totalGaps = Math.max(0, rowCount - 1) * GRID_GAP_PX;
  const minGridHeight = rowCount * MIN_ROW_HEIGHT_PX + totalGaps;

  if (minGridHeight <= viewportHeight) {
    return {
      fillHeight: true,
      gridHeight: viewportHeight,
      gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))`,
    };
  }

  const visibleRows = Math.max(
    1,
    Math.floor((viewportHeight + GRID_GAP_PX) / (MIN_ROW_HEIGHT_PX + GRID_GAP_PX)),
  );
  const rowHeight = (viewportHeight - (visibleRows - 1) * GRID_GAP_PX) / visibleRows;

  return {
    fillHeight: true,
    gridHeight: rowCount * rowHeight + totalGaps,
    gridTemplateRows: `repeat(${rowCount}, ${rowHeight}px)`,
  };
}

export function ProvinceProjectCardsGrid({
  projects,
  initialLimit,
  compact = false,
  viewportHeight,
}: {
  projects: ProvinceProjectCard[];
  initialLimit?: number;
  compact?: boolean;
  /** Altura medida del área de scroll en desktop; reparte filas sin usar 1fr sin límite */
  viewportHeight?: number;
}) {
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const [mounted, setMounted] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => setShowAll(false), [projects]);

  const withImages = projects.filter((p) => p.imageUrl);
  const hasLimit = initialLimit != null && projects.length > initialLimit;
  const visibleProjects = hasLimit && !showAll ? projects.slice(0, initialLimit) : projects;

  const openAt = useCallback(
    (index: number) => {
      if (withImages.length === 0) return;
      setLightbox({ index, items: withImages });
    },
    [withImages],
  );

  const close = useCallback(() => setLightbox(null), []);

  const prev = useCallback(() => {
    setLightbox((s) => {
      if (!s || s.items.length < 2) return s;
      const n = s.items.length;
      return { ...s, index: (s.index - 1 + n) % n };
    });
  }, []);

  const next = useCallback(() => {
    setLightbox((s) => {
      if (!s || s.items.length < 2) return s;
      const n = s.items.length;
      return { ...s, index: (s.index + 1) % n };
    });
  }, []);

  if (projects.length === 0) {
    return (
      <div className="rounded-curve-lg border border-dashed border-white/22 bg-[#071422]/80 p-5 text-base leading-relaxed text-slate-500">
        No hay proyectos en esta provincia. Ejecute{" "}
        <code className="text-xs text-slate-400">npm run sync:mapa</code> para subir la carpeta MAPA a
        Supabase Storage.
      </div>
    );
  }

  const columnCount = compact ? 2 : 3;
  const rowCount = Math.ceil(visibleProjects.length / columnCount);
  const showMoreButton = hasLimit && !showAll;
  const desktopLayout =
    viewportHeight != null && viewportHeight > 0 && !showMoreButton
      ? computeDesktopGridLayout(viewportHeight, rowCount)
      : null;

  return (
    <div className={desktopLayout ? "flex h-full min-h-0 flex-1 flex-col" : undefined}>
      <div
        className={`grid gap-4 sm:grid-cols-2 ${compact ? "lg:grid-cols-2" : "lg:grid-cols-3 xl:grid-cols-4"} ${
          desktopLayout ? "min-h-0 shrink-0" : ""
        }`}
        style={
          desktopLayout
            ? {
                height: desktopLayout.gridHeight,
                gridTemplateRows: desktopLayout.gridTemplateRows,
                gap: GRID_GAP_PX,
              }
            : undefined
        }
      >
        {visibleProjects.map((project, index) => {
          const imageIndex = withImages.findIndex(
            (p) => p.title === project.title && p.imageUrl === project.imageUrl,
          );
          return (
            <ProjectCard
              key={`${project.title}-${index}`}
              project={project}
              fillHeight={Boolean(desktopLayout?.fillHeight)}
              onOpen={() => {
                if (imageIndex >= 0) openAt(imageIndex);
              }}
            />
          );
        })}
      </div>

      {showMoreButton ? (
        <div className="mt-6 flex shrink-0 justify-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/35 bg-[#081a30]/90 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-accent-blue transition-colors hover:bg-cyan-400/10"
            onClick={() => setShowAll(true)}
          >
            Ver los {projects.length} proyectos
            <span className="material-symbols-outlined text-lg">expand_more</span>
          </button>
        </div>
      ) : null}

      {mounted && lightbox ? (
        <ProjectLightbox state={lightbox} onClose={close} onPrev={prev} onNext={next} />
      ) : null}
    </div>
  );
}
