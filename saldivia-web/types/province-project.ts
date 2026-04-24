/** Fila en `province_projects`; `province_slug` coincide con `id` en argentinaProvinceMapData.json */
export type ProvinceProjectRow = {
  id: string;
  province_slug: string;
  title: string;
  description: string | null;
  location_label: string | null;
  segment: string | null;
  year: string | null;
  sort_order: number | null;
  active: boolean;
  created_at: string;
};
