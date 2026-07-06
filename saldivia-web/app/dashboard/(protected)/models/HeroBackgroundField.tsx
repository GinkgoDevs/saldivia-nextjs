"use client";

import { FramedImageField } from "../_ui/FramedImageField";

type Props = {
  modelName: string;
  modelId: string | null;
  imageUrl: string;
  focalX: number;
  focalY: number;
  zoom: number;
  disabled?: boolean;
  uploading?: boolean;
  onImageUrlChange: (url: string) => void;
  onFocalChange: (x: number, y: number) => void;
  onZoomChange: (zoom: number) => void;
  onFileSelect: (file: File) => void;
  compact?: boolean;
};

export function HeroBackgroundField({
  modelName,
  modelId,
  imageUrl,
  focalX,
  focalY,
  zoom,
  disabled,
  uploading,
  onImageUrlChange,
  onFocalChange,
  onZoomChange,
  onFileSelect,
  compact = false,
}: Props) {
  return (
    <FramedImageField
      id="hero-background"
      label="Fondo del hero"
      hint={
        compact
          ? undefined
          : `Imagen exclusiva de ${modelName.trim() || "este modelo"} en /producto/[slug].`
      }
      previewHint="Vista previa como en la ficha del producto. Arrastrá para encuadrar y ajustá el zoom."
      previewPreset="productHero"
      imageUrl={imageUrl}
      focalX={focalX}
      focalY={focalY}
      zoom={zoom}
      disabled={disabled}
      uploading={uploading}
      uploadDisabled={!modelId}
      uploadDisabledMessage={
        !modelId ? "Guardá el modelo una vez para habilitar la subida." : undefined
      }
      overlay="productHero"
      emptyLabel="Sin imagen de hero para este modelo"
      showUrlField={!compact}
      urlFieldId="hero_background_image_url"
      onImageUrlChange={onImageUrlChange}
      onFocalChange={onFocalChange}
      onZoomChange={onZoomChange}
      onFileSelect={onFileSelect}
    />
  );
}
