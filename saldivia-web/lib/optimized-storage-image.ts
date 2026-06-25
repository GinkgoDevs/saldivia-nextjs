/**
 * URL pública de Storage para mostrar en el sitio.
 * La optimización de tamaño la hace `next/image` (no la API render de Supabase,
 * que puede no estar habilitada en todos los planes).
 */
export function optimizedStorageImageUrl(url: string | undefined): string | undefined {
  if (!url?.trim()) return undefined;
  return url.trim();
}
