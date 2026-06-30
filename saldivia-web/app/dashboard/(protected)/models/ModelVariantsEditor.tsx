"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";

export type SpecRow = { spec_key: string; spec_value: string };

export type VariantFormRow = {
  id: string | null;
  code: string;
  name: string;
  description: string;
  is_default: boolean;
  tech_specs: SpecRow[];
  general_feature_bodies: string[];
};

export const specRowEmpty = (): SpecRow => ({ spec_key: "", spec_value: "" });

export const variantRowEmpty = (isDefault = false): VariantFormRow => ({
  id: null,
  code: "",
  name: "",
  description: "",
  is_default: isDefault,
  tech_specs: [specRowEmpty()],
  general_feature_bodies: [""],
});

type Props = {
  variants: VariantFormRow[];
  onChange: (next: VariantFormRow[]) => void;
  busy?: boolean;
};

function SpecRowsEditor({
  rows,
  onChange,
  busy,
  labelPrefix,
}: {
  rows: SpecRow[];
  onChange: (rows: SpecRow[]) => void;
  busy?: boolean;
  labelPrefix: string;
}) {
  return (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <Input
            aria-label={`${labelPrefix} parámetro ${i + 1}`}
            className="sm:flex-1"
            placeholder="Parámetro"
            value={row.spec_key}
            onChange={(e) =>
              onChange(rows.map((r, j) => (j === i ? { ...r, spec_key: e.target.value } : r)))
            }
          />
          <Input
            aria-label={`${labelPrefix} valor ${i + 1}`}
            className="sm:flex-[2]"
            placeholder="Detalle / valor"
            value={row.spec_value}
            onChange={(e) =>
              onChange(rows.map((r, j) => (j === i ? { ...r, spec_value: e.target.value } : r)))
            }
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 text-on-surface-variant"
            disabled={busy || rows.length <= 1}
            aria-label={`Quitar fila ${i + 1}`}
            onClick={() => {
              const next = rows.filter((_, j) => j !== i);
              onChange(next.length > 0 ? next : [specRowEmpty()]);
            }}
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={busy}
        className="gap-1"
        onClick={() => onChange([...rows, specRowEmpty()])}
      >
        <Plus className="size-4" aria-hidden />
        Fila de spec
      </Button>
    </div>
  );
}

function FeatureRowsEditor({
  rows,
  onChange,
  busy,
  labelPrefix,
}: {
  rows: string[];
  onChange: (rows: string[]) => void;
  busy?: boolean;
  labelPrefix: string;
}) {
  return (
    <div className="space-y-2">
      {rows.map((body, i) => (
        <div key={i} className="flex gap-2">
          <Textarea
            aria-label={`${labelPrefix} característica ${i + 1}`}
            rows={2}
            className="min-h-[2.75rem] flex-1"
            placeholder="Texto del ítem"
            value={body}
            onChange={(e) => onChange(rows.map((b, j) => (j === i ? e.target.value : b)))}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 self-start text-on-surface-variant"
            disabled={busy || rows.length <= 1}
            aria-label={`Quitar característica ${i + 1}`}
            onClick={() => {
              const next = rows.filter((_, j) => j !== i);
              onChange(next.length > 0 ? next : [""]);
            }}
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={busy}
        className="gap-1"
        onClick={() => onChange([...rows, ""])}
      >
        <Plus className="size-4" aria-hidden />
        Ítem
      </Button>
    </div>
  );
}

export function ModelVariantsEditor({ variants, onChange, busy }: Props) {
  function patchVariant(index: number, patch: Partial<VariantFormRow>) {
    onChange(variants.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }

  function setDefault(index: number) {
    onChange(variants.map((v, i) => ({ ...v, is_default: i === index })));
  }

  function removeVariant(index: number) {
    const next = variants.filter((_, i) => i !== index);
    if (next.length > 0 && !next.some((v) => v.is_default)) {
      next[0].is_default = true;
    }
    onChange(next);
  }

  return (
    <div className="space-y-4">
      {variants.length === 0 ? (
        <p className="rounded-sm border border-dashed border-outline-variant/40 bg-surface-container-low/30 px-4 py-3 text-[11px] text-on-surface-variant">
          Sin configuraciones todavía. Usá el botón de abajo para agregar la primera (4x2, 4x4, largo 12 m,
          etc.).
        </p>
      ) : null}
      {variants.map((variant, index) => (
        <div
          key={variant.id ?? `new-${index}`}
          className="space-y-4 rounded-sm border border-accent-blue/25 bg-surface-container-low/50 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-wide text-secondary">
              Configuración {index + 1}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="radio"
                  name="variant-default"
                  checked={variant.is_default}
                  onChange={() => setDefault(index)}
                />
                Por defecto en ficha
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy}
                className="text-on-surface-variant"
                onClick={() => removeVariant(index)}
              >
                <Trash2 className="size-4" aria-hidden />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary">Nombre visible</label>
              <Input
                placeholder="4x2 Turismo"
                value={variant.name}
                onChange={(e) => patchVariant(index, { name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary">Código interno</label>
              <Input
                placeholder="4x2"
                value={variant.code}
                onChange={(e) => patchVariant(index, { code: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary">Descripción (opcional)</label>
            <Textarea
              rows={2}
              value={variant.description}
              onChange={(e) => patchVariant(index, { description: e.target.value })}
              placeholder="Breve texto para esta configuración"
            />
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">
              Specs solo de esta configuración
            </p>
            <SpecRowsEditor
              rows={variant.tech_specs}
              onChange={(tech_specs) => patchVariant(index, { tech_specs })}
              busy={busy}
              labelPrefix={`Variante ${index + 1}`}
            />
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">
              Características solo de esta configuración
            </p>
            <FeatureRowsEditor
              rows={variant.general_feature_bodies}
              onChange={(general_feature_bodies) => patchVariant(index, { general_feature_bodies })}
              busy={busy}
              labelPrefix={`Variante ${index + 1}`}
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={busy}
        className="gap-1"
        onClick={() =>
          onChange([...variants, variantRowEmpty(variants.length === 0)])
        }
      >
        <Plus className="size-4" aria-hidden />
        Agregar configuración
      </Button>
    </div>
  );
}
