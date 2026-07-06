"use client";

import { FramedImageField } from "../_ui/FramedImageField";

type Props = {
  label: string;
  hint?: string;
  imageUrl: string;
  fallbackUrl?: string | null;
  focalX: number;
  focalY: number;
  zoom: number;
  disabled?: boolean;
  uploading?: boolean;
  onImageUrlChange: (url: string) => void;
  onFocalChange: (x: number, y: number) => void;
  onZoomChange: (zoom: number) => void;
  onFileSelect: (file: File) => void;
};

export function ShowcaseImageField({
  label,
  hint,
  imageUrl,
  fallbackUrl,
  focalX,
  focalY,
  zoom,
  disabled,
  uploading,
  onImageUrlChange,
  onFocalChange,
  onZoomChange,
  onFileSelect,
}: Props) {
  return (
    <FramedImageField
      id="showcase-hero"
      label={label}
      hint={hint}
      previewPreset="showcase"
      imageUrl={imageUrl}
      fallbackUrl={fallbackUrl}
      focalX={focalX}
      focalY={focalY}
      zoom={zoom}
      disabled={disabled}
      uploading={uploading}
      framingRequiresOwnImage
      showUrlField
      urlFieldId="showcase-hero-url"
      emptyLabel="Sin imagen para el showcase"
      onImageUrlChange={onImageUrlChange}
      onFocalChange={onFocalChange}
      onZoomChange={onZoomChange}
      onFileSelect={onFileSelect}
    />
  );
}
