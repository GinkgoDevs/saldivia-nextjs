# PLAN DE PROYECTO — Desarrollo Web Institucional
**Saldivia Carrocerías | GinkGoDevs | Abril 2026**

---

## 1. Resumen Ejecutivo

El objetivo de este proyecto es desarrollar el nuevo sitio web institucional de Saldivia Carrocerías, posicionándola como referente digital nacional en fabricación de buses y carrocerías. El sitio tendrá alto impacto visual, rendimiento técnico superior y gestión dinámica de contenidos sin necesidad de tocar código.

**Stack tecnológico:** Next.js 14 (App Router) · Supabase (PostgreSQL) · Vercel · next/image · Leaflet.js  
**Duración:** 14 días corridos | **Inversión:** USD 1.000 (50/50) | **Equipo:** 2 devs

### Objetivos específicos

- Reemplazar el sitio anterior por una plataforma moderna, veloz y escalable.
- Reflejar identidad de marca: innovación, ingeniería argentina, solidez y liderazgo.
- Permitir gestión autónoma de contenidos por parte del equipo de Saldivia (sin código).
- Generar leads comerciales a través de formularios de cotización y contacto.
- Optimizar el posicionamiento SEO orgánico para búsquedas del sector.
- Localización geográfica interactiva de talleres, distribuidores y concesionarios.

---

## 2. Alcance del Proyecto

### 2.1 Mapa del Sitio

| Ruta | Contenido | Estado en maqueta |
|------|-----------|-------------------|
| `/` (Home) | Hero Aries 405, KPIs, Showcase Técnico, Segmentación, Mapa Interactivo de Red, Galería, CTA | ✔ Completo |
| `/flota` | Listado de modelos por segmento: Urbano, Interurbano, Interprovincial. Cards con imagen. | ✔ Completo |
| `/producto/[slug]` | Ficha técnica individual: specs, galería, descarga PDF, CTA cotizar. | ⚠ Parcial (solo Aries 365) |
| `/tecnologia` | Pilares tecnológicos: CAD/CAM, estructura, aerodinámica. Seguridad activa y pasiva. | ✔ Completo |
| `/nosotros` | Historia, planta industrial, capacidades, sección RRHH. | ✔ Completo |
| `/postventa` | Formulario soporte técnico, documentación descargable, red de servicios. | ✔ Completo |
| `/contacto` | Formulario de cotización. Integración server action → Supabase. | ⚠ Pendiente funcionalidad |
| `/dashboard` | Panel admin: CRUD modelos, repuestos, fichas técnicas, ubicaciones del mapa. Login protegido. | ✗ No iniciado |

### 2.2 Componentes Globales

- Navbar con mega-menú de Modelos, dark/light mode toggle, CTA "Cotizar Ahora".
- Footer con links institucionales, segmentos y datos de contacto.
- Sistema de temas (dark/light) persistente por preferencia del usuario.
- Galería con carrusel reutilizable en múltiples páginas.
- Sistema de notificaciones de éxito/error en formularios.
- Mapa interactivo con filtros por tipo de punto y provincia (Leaflet.js + OpenStreetMap).

### 2.3 Qué NO incluye este proyecto

- E-commerce o tienda online con pasarela de pago.
- Blog o sección de noticias.
- Integración con CRM externo (Salesforce, HubSpot, etc.).
- Multilenguaje / internacionalización.
- App móvil nativa.

---

## 3. Plan de Tickets

**10 días hábiles · 2 devs · Abril 2026**

---

### FASE 1 — Estructura y Base Técnica (Días 1–3)

> **Objetivo:** Proyecto configurado, desplegado en staging y todas las rutas navegables para el primer feedback del cliente.

#### Día 1 — Ambos

- Setup Next.js 14 App Router, Tailwind, ESLint, Prettier
- Estructura de carpetas, repo en GitHub, variables de entorno
- Supabase project inicial

**Entregable:** Repo en GitHub con estructura base y README de desarrollo

#### Día 2 — Dev A

- Navbar global (mega-menú Modelos, dark mode toggle, CTA)
- Footer global
- Layout principal con providers

**Entregable:** Navbar y Footer funcionales en todas las rutas

#### Día 2 — Dev B

- Diseño de schema Supabase: tablas `models`, `products`, `spare_parts`, `contacts`, `service_requests`
- Nueva tabla `locations`: `id`, `name`, `type` (taller|distribuidor|concesionario), `province`, `city`, `address`, `phone`, `hours`, `lat`, `lng`, `active`. RLS policies.
- Seed data: 5 modelos base + 8 ubicaciones de prueba distribuidas en Argentina

**Entregable:** DB funcional con datos de prueba. Dashboard de Supabase compartido con el equipo.

#### Día 3 — Dev A

- Home: Hero section · KPIs animados · Sección Segmentación (3 cards)
- Skeleton de páginas: `/flota` · `/tecnologia` · `/nosotros` · `/postventa` · `/contacto` · `/dashboard` (con auth guard)

**Entregable:** Home visible en staging con secciones superiores. Todas las rutas navegan sin errores 404.

#### Día 3 — Dev B (hecho)

- Integración Supabase client en el frontend
- Hooks de datos: `useModels`, `useProducts`, `useLocations` (acepta filtros `{ type, province }`)
- `lib/supabase/locations.ts`: función `getLocations` con queries filtrables
- `types/location.ts`: tipo TypeScript `Location`. Manejo de estados loading/error.
- Deploy a staging en Vercel. Preparar link de feedback para el cliente.

**Entregable:** Datos reales de Supabase consumidos en el frontend. Link de staging listo.

> 🔵 **CHECKPOINT 1 — Fin Día 3:** Link de staging enviado al cliente para primer feedback.

---

### FASE 2 — Desarrollo Completo (Días 4–8)

> **Objetivo:** Todas las páginas 100% desarrolladas y conectadas a Supabase. Formularios funcionales. Mapa interactivo integrado.

#### Día 4 — Dev A

- Home: Showcase Técnico (carrusel modelos), galería, CTA final. Animaciones con Framer Motion.
- Componente `MapView` (react-leaflet, carga dinámica `ssr:false`). Marcadores por tipo con ícono diferenciado. Popup con nombre y dirección.
- Componente `MapFilters`: filtros por tipo (3 botones toggle) y por provincia (select).

**Entregable:** Home 100% completo con mapa funcional.

#### Día 4 — Dev B

- Página `/flota`: listado dinámico por segmento con datos de Supabase. Filtros por categoría.
- Página `/producto/[slug]`: ficha técnica completa (specs table, galería, descarga PDF). `generateStaticParams` para SSG. Metadata dinámica por modelo.

**Entregable:** `/flota` funcional. `/producto/[slug]` funcional y SEO-ready.

#### Día 5 — Dev A

- Integración responsive del mapa en Home: panel de lista colapsable en mobile (375px).
- Tarjeta `LocationCard`: detalle al clic en marcador (nombre, dirección, teléfono, horario).
- Página `/tecnologia`: pilares tecnológicos, sección seguridad. Animaciones de scroll reveal.

**Entregable:** Mapa 100% integrado y responsive. `/tecnologia` completa.

#### Día 5 — Dev B

- Página `/nosotros`: historia, estadísticas, planta industrial, RRHH. Imágenes reales del cliente si ya están disponibles.
- Página `/contacto`: formulario de cotización (modelo, configuración, empresa, contacto). Integración server action → Supabase → email de notificación.

**Entregable:** `/nosotros` completa. `/contacto` con formulario funcional.

#### Día 6 — Dev A

- Página `/postventa`: formulario soporte técnico (VIN, empresa, descripción), documentación técnica descargable, red de servicios.
- Responsive completo desktop/tablet/mobile para Home y `/flota`.

**Entregable:** `/postventa` con formulario funcional. Home y Flota responsive validados.

#### Día 6 — Dev B

- Dashboard `/dashboard`: autenticación con Supabase Auth. CRUD de modelos (alta, edición, baja). Upload de imágenes y PDFs a Supabase Storage.
- Gestión de ubicaciones del mapa: tabla con listado, alta, edición y toggle `active`.

**Entregable:** Dashboard funcional con CRUD de modelos y CRUD de ubicaciones operativos.

#### Día 7 — Ambos

- Revisión interna conjunta
- Responsive de todas las páginas restantes
- Testing de formularios y mapa end-to-end
- Corrección de bugs detectados
- Actualizar staging

> 🔵 **CHECKPOINT 2 — Fin Día 7:** Segundo link de staging enviado al cliente para segundo feedback.

---

### FASE 3 — Optimización y Deploy (Días 8–10)

> **Objetivo:** Sitio a nivel producción. Performance, SEO técnico y deploy final aprobado por el cliente.

#### Día 8 — Dev A

- SEO técnico completo: metadata por página, Open Graph, Twitter Cards, `sitemap.xml`, `robots.txt`, structured data (Organization, Product)
- Ajustes finales según feedback del Checkpoint 2
- Accesibilidad básica: alt texts, aria-labels, contraste de colores. Accesibilidad del mapa: `aria-label` en controles de filtro.

**Entregable:** SEO validado con herramientas. Todos los feedbacks del cliente aplicados.

#### Día 8 — Dev B

- Auditoría Lighthouse. Corrección CLS/LCP/FID. Code splitting. Lazy loading de Leaflet (`dynamic import`) para mantener Performance > 90.
- Configuración del dominio en Vercel. Variables de entorno en producción. RLS policies de Supabase en producción. Backup inicial de la DB.

**Entregable:** Lighthouse score > 90 en todas las páginas. Entorno de producción listo.

#### Día 9 — Ambos

- Testing completo en producción: formularios, dashboard, mapa, navegación, responsive, dark mode, imágenes, descarga de PDFs.
- Completar el Checklist QA.

**Entregable:** Checklist QA completo.

#### Día 10 — Ambos

- Presentación al cliente

> 🔵 **CHECKPOINT 3: Aprobación final**

- Handover completo: credenciales de Supabase, acceso al repo de GitHub, guía de uso del dashboard

**Entregable:** Sitio live + documentación entregada al cliente

---

## 4. División de Responsabilidades

### Dev A — Frontend & UI

- Navbar y Footer globales.
- Página Home completa (hero, KPIs, showcase, mapa interactivo, galería, CTA).
- Componentes del mapa: `MapView`, `MapFilters`, `LocationCard`.
- Página `/flota` (UI y filtros).
- Página `/tecnologia`.
- Página `/postventa` (UI y formulario).
- Testing responsive en todas las páginas (incluido mapa en mobile).
- Implementación SEO técnico completo.
- Accesibilidad y ajustes de feedback del cliente.

### Dev B — Backend, DB & Dashboard

- Schema y seed data en Supabase (incluye tabla `locations`).
- Hook `useLocations` y función `getLocations` con filtros dinámicos.
- Tipo TypeScript `Location`.
- Página `/producto/[slug]` con SSG.
- Página `/nosotros`.
- Página `/contacto` con server action.
- Dashboard `/dashboard`: auth + CRUD modelos + CRUD ubicaciones del mapa.
- Upload de imágenes y PDFs a Supabase Storage.
- Configuración del entorno de producción y RLS.
- Optimización de performance (Lighthouse), incluyendo lazy loading de Leaflet.

### Tareas compartidas (ambos)

- Setup inicial del proyecto y configuración del repo (Día 1).
- Revisión interna al cierre de cada fase (Días 4, 10, 14).
- Testing QA en producción (Día 13).
- Presentación y handover al cliente (Día 14).

---

## 5. Material Requerido al Cliente

> ⚠ Todo el material debe entregarse **antes del inicio del Día 1**. Si se entrega con demora, el cronograma se ajusta proporcionalmente.

| # | Material | Formato | Fecha límite |
|---|----------|---------|--------------|
| 1 | Logo oficial de Saldivia Carrocerías | SVG o PNG transparente | Día 0 |
| 2 | Fotografías oficiales de todos los modelos (Aries 405 DD, 365, 325, 330, A305) | JPG/PNG mín. 2000px ancho | Día 0 |
| 3 | Fotografías de la planta industrial (exteriores, línea de producción, cabina de pintura) | JPG/PNG mín. 2000px ancho | Día 0 |
| 4 | Fichas técnicas de cada modelo con especificaciones completas | PDF o Word/Excel | Día 0 |
| 5 | Manual de marca (si existe): paleta de colores, tipografías, usos del logo | PDF | Día 0 |
| 6 | Información institucional: historia, hitos, datos fundacionales, texto "Quiénes Somos" | Word o texto plano | Día 0 |
| 7 | Datos de contacto definitivos (teléfono, email, dirección exacta de la planta) | Texto | Día 0 |
| 8 | Listado de talleres autorizados, distribuidores y concesionarios con dirección exacta, teléfono y horario | Excel / Google Sheets | Día 4 |
| 9 | Credenciales del dominio o confirmación del dominio a utilizar (ej: saldivia.com.ar) | Panel de hosting | Día 10 |

> ⚠ Los ítems **1 al 7** son bloqueantes para el inicio del Día 1. El ítem **8** (red de ubicaciones) debe entregarse antes del Día 4 para no afectar el desarrollo del mapa. El ítem **9** (dominio) puede entregarse hasta el Día 10.

---

## 6. Condiciones Comerciales

### Inversión y forma de pago

| Cuota | Momento | Monto |
|-------|---------|-------|
| 1° Cuota | Al inicio del proyecto (Día 1) | USD 500 |
| 2° Cuota | Contra entrega final aprobada (Día 14) | USD 500 |
| **TOTAL** | | **USD 1.000** |

**Medios de pago aceptados:** dólares en efectivo o transferencia en pesos argentinos al valor del dólar blue vigente al momento de cada pago.

### Soporte mensual post-entrega (opcional)

**Costo:** USD 20/mes. El primer mes está incluido en el valor del proyecto.

**Incluye:** Hosting en Vercel · Supabase DB · monitoreo · actualizaciones menores de texto/imágenes/PDFs/ubicaciones del mapa · backups · soporte básico.

**No incluye:** Nuevas funcionalidades, rediseños estructurales ni módulos adicionales.

### Ajustes post-entrega incluidos

- 15 días corridos de ajustes sin costo adicional.
- Aplica a bugs, correcciones visuales o cambios de texto.
- No aplica a nuevas funcionalidades ni cambios de arquitectura.

### Propiedad del código

Al completar el pago total, el código fuente y la base de datos pasan a ser propiedad exclusiva de Saldivia Carrocerías. GinkGoDevs entregará acceso completo al repositorio de GitHub y al proyecto de Supabase.

---

## 7. Protocolo de Trabajo en Equipo

### Flujo de Git

- `main`: código en producción. Rama protegida. Solo se mergea con PR aprobado.
- `develop`: integración continua. Base de trabajo diaria.
- `feature/nombre-de-tarea`: para cada nueva funcionalidad (ej: `feature/mapa-interactivo`, `feature/dashboard-crud-models`).
- `fix/descripcion-del-bug`: para correcciones.

Pull Request obligatorio para mergear a `develop`. El compañero debe aprobar antes del merge.

### Convención de commits

Usar [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`.

**Ejemplo:** `feat(mapa): add MapFilters component with province selector`

Los commits van en inglés para consistencia técnica.

### Canales de comunicación

| Canal | Uso | Frecuencia |
|-------|-----|------------|
| WhatsApp / Telegram | Coordinación diaria, preguntas rápidas, avisos de disponibilidad | Diaria |
| GitHub Issues | Registro de bugs, tareas específicas, asignación de responsables | Por demanda |
| GitHub PR | Code review, comentarios técnicos, aprobación de merges | Por cada feature |
| Video call (Meet/Zoom) | Stand-up de sincronización y revisión de checkpoints | Días 4, 10 y 14 |
| Email / WhatsApp (cliente) | Envío de links de staging, solicitud de feedback | Días 4, 10 y 14 |

### Variables de entorno

- Cada dev mantiene su archivo `.env.local` para desarrollo local. Nunca se commitea al repo.
- Variables de producción configuradas directamente en el panel de Vercel.
- Se documenta en el README qué variables son necesarias y su propósito.

### Estructura de carpetas

| Carpeta | Contenido |
|---------|-----------|
| `app/` | Rutas Next.js App Router (`page.tsx` por cada ruta) |
| `app/dashboard/` | Panel de administración con auth guard |
| `components/` | Componentes reutilizables (Navbar, Footer, Cards, etc.) |
| `components/map/` | Componentes del mapa interactivo (MapView, MapFilters, LocationCard) |
| `lib/` | Clientes de Supabase, helpers, constantes |
| `lib/supabase/` | Queries por entidad: `models.ts`, `locations.ts`, etc. |
| `hooks/` | Custom hooks: `useModels`, `useProducts`, `useLocations` |
| `types/` | Tipos TypeScript: `Model`, `Product`, `Contact`, `Location`, etc. |
| `public/` | Assets estáticos: logo, imágenes de placeholder, íconos del mapa |
| `supabase/` | Migraciones SQL y seed data |

---

## 8. Criterios de Aceptación (Definition of Done)

### Por página / feature

Una tarea se considera completada solo cuando cumple **todo** lo siguiente:

- El diseño es fiel a la maqueta aprobada (saldivia-frontend.vercel.app).
- Funciona correctamente en Chrome, Firefox y Safari (últimas versiones).
- Responsive validado en mobile (375px), tablet (768px) y desktop (1280px+).
- Los datos dinámicos provienen de Supabase, no están hardcodeados en el código.
- Los formularios validan campos requeridos y muestran mensajes de error/éxito.
- Las imágenes usan `next/image` con atributo `alt` descriptivo.
- No hay errores en consola del navegador ni warnings críticos.

### Criterios específicos del mapa interactivo

- Los marcadores se renderizan correctamente en Chrome, Firefox y Safari.
- Los filtros por tipo (taller / distribuidor / concesionario) y por provincia actualizan el mapa sin recargar la página.
- La tarjeta `LocationCard` muestra nombre, dirección, teléfono y horario al hacer clic en un marcador.
- El mapa es táctil y usable en mobile (375px). El panel de lista es colapsable.
- Soporta dark/light mode de forma consistente con el sistema de temas del sitio.
- Las ubicaciones se gestionan íntegramente desde el dashboard admin (sin tocar código).
- Leaflet se carga con `dynamic import` (`ssr:false`) para no afectar el score de Lighthouse.
- Existe un fallback visual si el mapa no carga (error de red o tiles no disponibles).

### Para el deploy final

- Lighthouse Performance > 90 en todas las páginas principales.
- Lighthouse SEO > 95 en todas las páginas principales.
- Lighthouse Accessibility > 85 en todas las páginas principales.
- `sitemap.xml` accesible y enviado a Google Search Console.
- `robots.txt` configurado correctamente.
- Todos los formularios funcionan en producción.
- El mapa carga y los filtros funcionan en producción.
- El dashboard requiere autenticación (no hay acceso público).
- El dominio del cliente apunta correctamente al deploy de Vercel.
- El cliente recibió: credenciales de Supabase, acceso al repo de GitHub y guía de uso del dashboard.

### Checklist QA Final (Día 9)

- [ ] Home: Hero, KPIs, Showcase, Segmentación, Mapa interactivo + filtros, Galería, CTA — **Dev A**
- [ ] Mapa: marcadores visibles, filtros funcionales, LocationCard al clic, responsive mobile — **Dev A**
- [ ] Flota: listado por segmento, filtros funcionales — **Dev A**
- [ ] Producto [slug]: specs, galería, descarga PDF — **Dev B**
- [ ] Tecnología: pilares y seguridad — **Dev A**
- [ ] Nosotros: historia, planta, RRHH — **Dev B**
- [ ] Postventa: formulario de soporte enviado a Supabase — **Dev A**
- [ ] Contacto: formulario de cotización + email de notificación — **Dev B**
- [ ] Dashboard: login funcional, CRUD de modelos operativo, CRUD de ubicaciones operativo — **Dev B**
- [ ] Responsive completo en todas las páginas — **Ambos**
- [ ] Dark mode funcional en todas las páginas (incluido mapa) — **Dev A**
- [ ] SEO: metadata, OG, sitemap, robots — **Dev A**
- [ ] Lighthouse > 90 en Home y Flota — **Dev B**
- [ ] Sin errores en consola del navegador — **Ambos**
- [ ] Dominio del cliente activo con HTTPS — **Dev B**