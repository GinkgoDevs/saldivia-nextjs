/** Fila en `province_projects`; `province_slug` coincide con `id` en argentinaProvinceMapData.json */
export type ProvinceProjectRow = {
  id: string;
  province_slug: string;
  title: string;
  description: string | null;
  location_label: string | null;
  segment: string | null;
  year: string | null;
  image_url: string | null;
  image_focal_x: number;
  image_focal_y: number;
  image_zoom: number;
  sort_order: number | null;
  active: boolean;
  created_at: string;
};
