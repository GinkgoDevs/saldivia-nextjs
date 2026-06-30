"use client";

import { useMemo, useState } from "react";
import { ProductSpecTable } from "@/app/components/producto/ProductSpecTable";
import { ProductoFeatureList } from "@/app/components/producto/ProductoFeatureList";
import { FadeUp } from "@/app/components/motion";
import { resolveFeaturesForVariant, resolveSpecsForVariant } from "@/lib/model-variants";
import type { ModelGeneralFeature } from "@/types/model";
import type { Product } from "@/types/product";

export type VariantOption = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  is_default: boolean;
  products: Product[];
  general_features: ModelGeneralFeature[];
};

type Props = {
  sharedProducts: Product[];
  sharedFeatures: ModelGeneralFeature[];
  variants: VariantOption[];
};

export function ProductVariantSpecs({ sharedProducts, sharedFeatures, variants }: Props) {
  const defaultId = useMemo(() => {
    const def = variants.find((v) => v.is_default);
    return def?.id ?? variants[0]?.id ?? null;
  }, [variants]);

  const [activeId, setActiveId] = useState<string | null>(defaultId);

  const activeVariant = variants.find((v) => v.id === activeId) ?? variants[0] ?? null;

  const specRows = useMemo(() => {
    if (!activeVariant) {
      return resolveSpecsForVariant(sharedProducts, []);
    }
    return resolveSpecsForVariant(sharedProducts, activeVariant.products);
  }, [activeVariant, sharedProducts]);

  const featureItems = useMemo(() => {
    if (!activeVariant) {
      return resolveFeaturesForVariant(sharedFeatures, []);
    }
    return resolveFeaturesForVariant(sharedFeatures, activeVariant.general_features);
  }, [activeVariant, sharedFeatures]);

  const hasVariants = variants.length > 0;

  return (
    <>
      {hasVariants && (
        <FadeUp size="sm">
          <div className="mb-8 sm:mb-10">
            <p className="mb-3 font-headline text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              Configuración
            </p>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => {
                const selected = variant.id === (activeId ?? defaultId);
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setActiveId(variant.id)}
                    className={`inline-flex min-h-[44px] cursor-pointer items-center rounded-sm border px-4 py-2.5 font-headline text-xs font-bold uppercase tracking-wider transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 ${
                      selected
                        ? "border-accent-blue bg-accent-blue text-white"
                        : "border-outline-variant/40 bg-surface-container-lowest text-primary hover:border-accent-blue/40"
                    }`}
                  >
                    {variant.name}
                  </button>
                );
              })}
            </div>
            {activeVariant?.description && (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-on-surface-variant md:text-base">
                {activeVariant.description}
              </p>
            )}
          </div>
        </FadeUp>
      )}

      {specRows.length > 0 ? (
        <ProductSpecTable
          rows={specRows.map((row) => ({
            id: row.id ?? `${row.spec_key}-${row.spec_value}`,
            spec_key: row.spec_key,
            spec_value: row.spec_value,
          }))}
        />
      ) : (
        <FadeUp>
          <p className="text-base text-on-surface-variant md:text-lg">
            Las especificaciones detalladas se publican desde el panel de administración o consulte con nuestro equipo.
          </p>
        </FadeUp>
      )}

      <ProductoFeatureList items={featureItems} columns={1} />
    </>
  );
}
