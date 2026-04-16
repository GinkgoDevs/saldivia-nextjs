/** Fila de `products` (pares spec_key / spec_value por modelo). */
export type Product = {
  id: string;
  model_id: string | null;
  spec_key: string;
  spec_value: string;
  sort_order: number | null;
};
