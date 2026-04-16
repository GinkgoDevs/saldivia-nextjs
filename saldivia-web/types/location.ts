export type LocationType = "taller" | "distribuidor" | "concesionario";

/** Fila de `locations` alineada al schema Supabase (lat/lng como número en app). */
export type Location = {
  id: string;
  name: string;
  type: LocationType;
  province: string;
  city: string;
  address: string;
  phone: string | null;
  hours: string | null;
  lat: number;
  lng: number;
  active: boolean;
  created_at: string;
};
