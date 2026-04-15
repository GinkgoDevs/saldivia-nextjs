# Base de datos (Supabase / PostgreSQL)

Referencia del esquema definido en `supabase/migrations/`. La fuente de verdad son esos archivos SQL; este documento resume tablas, relaciones y políticas RLS que viven en el repo.

## Migraciones

| Archivo | Contenido |
|---------|-----------|
| `001_initial_schema.sql` | Tablas de negocio: modelos, specs, repuestos, formularios, ubicaciones. |
| `002_create_newsletter_subscriptions.sql` | Suscripciones al newsletter + RLS. |
| `003_public_read_content_rls.sql` | Columna `sort_order` en `models`, RLS y lectura pública de contenido del sitio. |

Para aplicar en un proyecto vacío: ejecutar en orden **001 → 002 → 003** en el SQL Editor de Supabase (o vía Supabase CLI).

## Diagrama de relaciones (resumen)

```
models (1) ──< (N) products          ON DELETE CASCADE
models (1) ──< (N) spare_parts      ON DELETE SET NULL

contacts, service_requests, newsletter_subscriptions  →  sin FK a models
locations  →  sin FK (coordenadas y texto de punto en mapa)
```

## Tablas

### `models`

Catálogo de modelos de buses (navbar, `/flota`, fichas).

| Columna | Tipo | Notas |
|---------|------|--------|
| `id` | UUID | PK, default `gen_random_uuid()`. |
| `slug` | TEXT | UNIQUE, NOT NULL. Debe coincidir con rutas tipo `/producto/{slug}`. |
| `name` | TEXT | NOT NULL. |
| `segment` | TEXT | NOT NULL. Valores: `urbano`, `interurbano`, `interprovincial`. |
| `description` | TEXT | Opcional. |
| `cover_image_url` | TEXT | Opcional. |
| `pdf_url` | TEXT | Opcional. |
| `active` | BOOLEAN | Default `true`. |
| `sort_order` | INTEGER | Añadida en `003`. Default `0`. Orden dentro del segmento. |
| `created_at` | TIMESTAMPTZ | Default `now()`. |

**RLS (003):** habilitada. Política `Public read active models`: **SELECT** si `active = true`.

---

### `products`

Especificaciones técnicas como pares clave/valor por modelo (fichas).

| Columna | Tipo | Notas |
|---------|------|--------|
| `id` | UUID | PK. |
| `model_id` | UUID | FK → `models(id)` **ON DELETE CASCADE**. Puede ser NULL en DB; la política pública exige `model_id` NOT NULL para leer como visitante. |
| `spec_key` | TEXT | NOT NULL. |
| `spec_value` | TEXT | NOT NULL. |
| `sort_order` | INTEGER | Default `0`. |

**RLS (003):** habilitada. Política `Public read products for active models`: **SELECT** solo si existe un modelo activo asociado (`models.active = true`).

---

### `spare_parts`

Repuestos (alcance futuro / dashboard).

| Columna | Tipo | Notas |
|---------|------|--------|
| `id` | UUID | PK. |
| `name` | TEXT | NOT NULL. |
| `part_number` | TEXT | UNIQUE, NOT NULL. |
| `model_id` | UUID | FK → `models(id)` **ON DELETE SET NULL**. |
| `description` | TEXT | Opcional. |
| `pdf_url` | TEXT | Opcional. |
| `active` | BOOLEAN | Default `true`. |
| `created_at` | TIMESTAMPTZ | Default `now()`. |

**RLS:** no definida en las migraciones actuales del repo. Antes de exponer esta tabla al cliente anónimo, conviene definir políticas explícitas.

---

### `contacts`

Envíos del formulario de cotización (`/contacto`).

| Columna | Tipo | Notas |
|---------|------|--------|
| `id` | UUID | PK. |
| `model_name` | TEXT | Opcional. |
| `configuration` | TEXT | Opcional. |
| `company` | TEXT | Opcional. |
| `contact_name` | TEXT | NOT NULL. |
| `email` | TEXT | NOT NULL. |
| `phone` | TEXT | Opcional. |
| `message` | TEXT | Opcional. |
| `created_at` | TIMESTAMPTZ | Default `now()`. |

**RLS:** no definida en el repo. Los inserts desde el sitio suelen hacerse con **Server Action** + cliente con service role o política **INSERT** acotada; documentar en el mismo PR que agregue la política.

---

### `service_requests`

Soporte técnico / postventa.

| Columna | Tipo | Notas |
|---------|------|--------|
| `id` | UUID | PK. |
| `vin` | TEXT | NOT NULL. |
| `company` | TEXT | NOT NULL. |
| `description` | TEXT | NOT NULL. |
| `contact_name` | TEXT | Opcional. |
| `email` | TEXT | Opcional. |
| `phone` | TEXT | Opcional. |
| `status` | TEXT | Default `pending`. Valores: `pending`, `in_progress`, `resolved`. |
| `created_at` | TIMESTAMPTZ | Default `now()`. |

**RLS:** no definida en el repo; mismo criterio que `contacts`.

---

### `locations`

Puntos del mapa (talleres, distribuidores, concesionarios).

| Columna | Tipo | Notas |
|---------|------|--------|
| `id` | UUID | PK. |
| `name` | TEXT | NOT NULL. |
| `type` | TEXT | NOT NULL. Valores: `taller`, `distribuidor`, `concesionario`. |
| `province` | TEXT | NOT NULL. Filtros en UI deben coincidir con el valor guardado (mayúsculas/tildes). |
| `city` | TEXT | NOT NULL. |
| `address` | TEXT | NOT NULL. |
| `phone` | TEXT | Opcional. |
| `hours` | TEXT | Opcional. |
| `lat` | NUMERIC(10,7) | NOT NULL. |
| `lng` | NUMERIC(10,7) | NOT NULL. |
| `active` | BOOLEAN | Default `true`. |
| `created_at` | TIMESTAMPTZ | Default `now()`. |

**RLS (003):** habilitada. Política `Public read active locations`: **SELECT** si `active = true`.

---

### `newsletter_subscriptions`

Altas desde el formulario del footer.

| Columna | Tipo | Notas |
|---------|------|--------|
| `id` | UUID | PK. |
| `email` | TEXT | NOT NULL. |
| `created_at` | TIMESTAMPTZ | NOT NULL, default `now()`. |

**Índice:** único sobre `lower(trim(email))` para evitar duplicados por mayúsculas/espacios.

**RLS (002):**

- `Public can insert newsletter_subscriptions`: **INSERT** para rol `public`.
- `Authenticated users can read newsletter_subscriptions`: **SELECT** si `auth.role() = 'authenticated'`.

---

## Código en el frontend (referencia)

| Recurso | Ubicación |
|---------|-----------|
| Tipo `Location` | `types/location.ts` |
| Tipo `Model` | `types/model.ts` |
| Tipo `Product` | `types/product.ts` |
| Queries | `lib/supabase/locations.ts`, `models.ts`, `products.ts`, `mega-menu-models.ts` |
| Hooks cliente | `hooks/useLocations.ts`, `useModels.ts`, `useProducts.ts` |
| Cliente browser / server | `lib/supabase/client.ts`, `lib/supabase/server.ts` |

## Variables de entorno

El sitio usa la **anon key** con RLS para lecturas públicas. En Vercel y local:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Operaciones que no deben ser públicas (p. ej. leer suscripciones) requieren rol autenticado o **service role** solo en servidor, nunca en el bundle del cliente.
