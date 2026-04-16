function ShimmerBlock({ className }: { className: string }) {
  return (
    <div
      className={`rounded-sm bg-surface-container-high/90 motion-safe:animate-pulse motion-reduce:animate-none ${className}`}
      aria-hidden
    />
  );
}

type RoutePageSkeletonProps = {
  variant?: "marketing" | "dashboard";
};

/**
 * Full-viewport loading placeholder for App Router `loading.tsx`.
 * Uses transform-free opacity pulse; respects `prefers-reduced-motion`.
 */
export default function RoutePageSkeleton({
  variant = "marketing",
}: RoutePageSkeletonProps) {
  if (variant === "dashboard") {
    return (
      <div className="min-h-screen bg-surface font-headline text-on-surface">
        <div className="border-b border-outline-variant/40 bg-surface-container-lowest px-6 py-4 md:px-8">
          <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4">
            <ShimmerBlock className="h-9 w-40" />
            <div className="hidden gap-3 sm:flex">
              <ShimmerBlock className="h-9 w-24" />
              <ShimmerBlock className="h-9 w-24" />
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-screen-2xl px-6 py-10 md:px-8">
          <ShimmerBlock className="mb-2 h-4 w-32" />
          <ShimmerBlock className="mb-8 h-10 w-full max-w-md" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ShimmerBlock className="h-32" />
            <ShimmerBlock className="h-32" />
            <ShimmerBlock className="h-32 sm:col-span-2 lg:col-span-1" />
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <ShimmerBlock className="h-64 lg:col-span-2" />
            <ShimmerBlock className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface font-headline text-on-surface">
      <section className="relative min-h-[380px] overflow-hidden bg-primary-container pt-20 md:min-h-[420px] md:pt-24">
        <div className="pointer-events-none absolute inset-0 industrial-grid-light opacity-[0.08]" />
        <div className="relative z-10 mx-auto max-w-screen-2xl px-6 md:px-8">
          <ShimmerBlock className="mb-4 h-3 w-48" />
          <ShimmerBlock className="mb-4 h-12 w-full max-w-xl md:h-16" />
          <ShimmerBlock className="h-3 w-full max-w-lg" />
          <ShimmerBlock className="mt-2 h-3 w-[85%] max-w-lg" />
          <div className="mt-10 flex flex-wrap gap-3">
            <ShimmerBlock className="h-10 w-28" />
            <ShimmerBlock className="h-10 w-32" />
            <ShimmerBlock className="h-10 w-24" />
          </div>
        </div>
      </section>
      <section className="border-t border-outline-variant/30 bg-surface-container-low py-16 md:py-20">
        <div className="mx-auto max-w-screen-2xl px-6 md:px-8">
          <ShimmerBlock className="mb-3 h-3 w-36" />
          <ShimmerBlock className="mb-2 h-8 w-64 md:h-10" />
          <ShimmerBlock className="mb-10 h-1 w-20 bg-surface-container-high" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-sm border border-outline-variant/35 bg-surface-container-lowest shadow-[0px_12px_32px_rgba(13,44,79,0.06)]"
              >
                <ShimmerBlock className="aspect-[16/9] w-full rounded-none" />
                <div className="space-y-3 p-5">
                  <ShimmerBlock className="h-3 w-3/4 max-w-[12rem]" />
                  <ShimmerBlock className="h-3 w-full" />
                  <ShimmerBlock className="h-3 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
