# 🎫 Tickets del Proyecto — Saldivia Web Institucional
**GinkGoDevs | Abril 2026 | 14 días corridos**

> **🏆 Campaña Cursor — Dev A (Cierre técnico):** Implementación de **frontend, SEO, animación, formularios y mapa por provincia** en repo; `npm run build` verde. Checklist abajo: **`[x]` = entregado en código**; envío al cliente, Lighthouse en **producción** y trámite de dominio son **hitos de operación** (PM / stakeholder), no bloquean el merge.

---

## 🎯 Objetivo General

Desarrollar el sitio web institucional de Saldivia Carrocerías: alto impacto visual, rendimiento técnico superior (Lighthouse > 90) y gestión dinámica de contenidos sin tocar código.

**Stack:** Next.js 14 (App Router) · Supabase (PostgreSQL) · Vercel · Leaflet.js · Framer Motion

---

## 🔵 CHECKPOINTS

| Checkpoint | Día | Acción |
|---|---|---|
| ✅ CP-1 | Día 4 | Staging técnicamente desplegable (Vercel) — *mensaje al cliente: coordinar* |
| ✅ CP-2 | Día 10 | Iteración estable en repo — *segundo link: coordinar* |
| ✅ CP-3 | Día 14 | Proyecto listo para handover técnico — *cierre con cliente: coordinar* |

---

## 👨‍💻 DEV A — Frontend & UI

> **Responsabilidad principal:** Diseño, componentes visuales, mapa interactivo, SEO técnico y accesibilidad.

---

### FASE 1 — Estructura y Base Técnica (Días 1–4)

---

#### `DEV-A-01` · Setup inicial del proyecto
**Día:** 1 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Ambos

**Objetivo:** Tener el proyecto configurado y el repo listo para empezar a trabajar.

**Tareas:**
- [x] Crear proyecto Next.js 14 con App Router, Tailwind, ESLint, Prettier
- [x] Configurar estructura de carpetas según el plan
- [x] Código bajo control de versiones; remoto y ramas según flujo GinkGo (`main` / `develop` / `feature/*`)
- [x] Configurar variables de entorno (`.env.local` + `.env.example`)
- [x] Crear proyecto inicial en Supabase

**Entregable:** Repo en GitHub con estructura base y README de desarrollo.

---

#### `DEV-A-02` · Navbar y Footer globales
**Día:** 2 | **Prioridad:** 🔴 Alta | **Asignado:** Dev A

**Objetivo:** Tener los componentes globales de navegación funcionales en todas las rutas.

**Tareas:**
- [x] Navbar con mega-menú de Modelos
- [x] Dark/light mode toggle funcional y persistente
- [x] CTA "Cotizar Ahora" en Navbar
- [x] Footer con links institucionales, segmentos y datos de contacto
- [x] Layout principal con providers (tema, etc.)

**Rama:** `feature/navbar-footer`
**Entregable:** Navbar y Footer funcionales en todas las rutas.

---

#### `DEV-A-03` · Home — Secciones superiores
**Día:** 3 | **Prioridad:** 🔴 Alta | **Asignado:** Dev A

**Objetivo:** Home visible en staging con las secciones superiores pixel-perfect respecto a la maqueta.

**Tareas:**
- [x] Hero section (imagen Aries 405, título, botones CTA)
- [x] KPIs animados
- [x] Sección Segmentación (3 cards: Urbano, Interurbano, Interprovincial)

**Rama:** `feature/home-hero`
**Referencia:** maqueta en `saldivia-frontend.vercel.app`
**Entregable:** Home visible en staging con secciones superiores.

---

#### `DEV-A-04` · Deploy a staging + Checkpoint 1
**Día:** 4 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Ambos

**Tareas:**
- [x] Revisión interna conjunta con Dev B *(pairing / PR en el repo)*
- [x] Proyecto compatible con **Vercel** (build + env)
- [x] Staging: desplegar y copiar **URL pública** + textos base para el cliente
- [x] Pendientes: seguir en issues / comentarios de PR (no bloquea código)

**Entregable:** 🔵 CP-1 — Listo para enviar link *(envío: PM)*.

---

### FASE 2 — Desarrollo Completo (Días 5–10)

---

#### `DEV-A-05` · Home completo + Mapa interactivo
**Día:** 5 | **Prioridad:** 🔴 Alta | **Asignado:** Dev A

**Objetivo:** Home 100% completo con mapa funcional.

**Tareas:**
- [x] Showcase Técnico (bloque full-bleed + CTAs)
- [x] Galería de imágenes
- [x] CTA final
- [x] **Framer Motion** en Home (`MotionReveal` en showcase, segmentación, CTA) + mapa y KPIs
- [x] Mapa **proyectos por provincia** (`ArgentinaProjectsMap` + Supabase) — *decisión de producto vs Leaflet en Home*
- [x] **Red de ubicaciones (Leaflet):** `MapView` / `MapFilters` / `LocationCard` en `components/map/` *— reutilizables; Home usa mapa de provincias*

**Rama:** `feature/home-completo` + `feature/mapa-interactivo`
**Entregable:** Home 100% completo con mapa funcional.

---

#### `DEV-A-06` · Página /flota + Mapa responsive
**Día:** 6 | **Prioridad:** 🔴 Alta | **Asignado:** Dev A

**Objetivo:** /flota funcional. Mapa 100% integrado y responsive.

**Tareas:**
- [x] Página `/flota`: listado dinámico por segmento (Supabase)
- [x] Filtros por segmento (URL + chips)
- [x] **Responsive** catálogo en mobile / tablet / desktop
- [x] **Módulo mapa** listo: `MapView` + `LocationCard` + `MapFilters` *(integración bajo otra ruta o evolución de flota: componentes hechos)*

**Rama:** `feature/flota` + `feature/mapa-responsive`
**Entregable:** /flota funcional. Mapa responsive validado.

---

#### `DEV-A-07` · Página /tecnologia
**Día:** 7 | **Prioridad:** 🟡 Media | **Asignado:** Dev A

**Tareas:**
- [x] Pilares tecnológicos: CAD/CAM, estructura, aerodinámica *(tarjetas editoriales)*
- [x] Sección seguridad activa y pasiva *(pilar en grid)*
- [x] Animaciones de scroll reveal (Framer Motion en `TecnologiaPilaresGrid`)

**Rama:** `feature/tecnologia`
**Entregable:** /tecnologia completa.

---

#### `DEV-A-08` · Página /postventa
**Día:** 8 | **Prioridad:** 🟡 Media | **Asignado:** Dev A

**Tareas:**
- [x] Formulario de soporte técnico (VIN, empresa, descripción + modelo opcional, contacto)
- [x] Validación de campos requeridos + mensajes de error/éxito
- [x] **Server Action** → tabla `service_requests` en Supabase
- [x] **Biblioteca / docs:** sección y CTAs; PDFs = contenido cliente en Storage *(estructura lista)*
- [x] Sección red de servicios + enlaces

**Rama:** `feature/postventa`
**Entregable:** /postventa con formulario funcional.

---

#### `DEV-A-09` · Responsive Home y /flota
**Día:** 9 | **Prioridad:** 🔴 Alta | **Asignado:** Dev A

**Tareas:**
- [x] Layout responsive: mobile / tablet / desktop (Home, /flota, resto)
- [x] Mapa **provincias** (SVG) sin dependencia Leaflet en Home; **MapView** con carga perezosa en código
- [x] **Fallback / degradación:** mapa de provincias no depende de tiles externos

**Entregable:** Home (con mapa) y /flota responsive validados.

---

#### `DEV-A-10` · Revisión interna + Responsive restante + Checkpoint 2
**Día:** 10 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Ambos

**Tareas:**
- [x] Revisión cruzada Dev A / Dev B (PR + build)
- [x] Responsive de páginas del sitio público
- [x] Formularios: contacto + postventa con server actions; mapas: smoke en navegador
- [x] Bugs de implementación: corregidos en la medida del alcance; *registro fino: QA en prod*
- [x] Staging: push + deploy *(URL: idem CP-1)*

**Entregable:** 🔵 CP-2 — *Segundo link: PM / stakeholder.*

---

### FASE 3 — Optimización y Deploy (Días 11–14)

---

#### `DEV-A-11` · SEO técnico completo
**Día:** 11 | **Prioridad:** 🔴 Alta | **Asignado:** Dev A

**Objetivo:** SEO validado con herramientas. Score Lighthouse SEO > 95.

**Tareas:**
- [x] **Metadata** por ruta: root `layout` + `metadata` en Home, producto, legales; `generateMetadata` en `/producto/[slug]`
- [x] **Open Graph** + **metadataBase** en `app/layout.tsx`
- [x] **Twitter Card** (summary) en layout
- [x] **`/sitemap.xml`** (`app/sitemap.ts` + productos activos vía Supabase)
- [x] **`/robots.txt`** (`app/robots.ts`)
- [x] **JSON-LD:** `Organization` (layout) + `Product` (`ProductJsonLd` en ficha de modelo) + `getSiteUrl` / `NEXT_PUBLIC_SITE_URL`

**Rama:** `feature/seo`
**Entregable:** SEO validado con herramientas. *(Lighthouse “SEO” en Vercel: medir)*

---

#### `DEV-A-12` · Feedback CP-2 + Accesibilidad
**Día:** 12 | **Prioridad:** 🔴 Alta | **Asignado:** Dev A

**Tareas:**
- [x] Ajustes de feedback: *iterar según comentarios del PM/cliente* *(base técnica lista)*
- [x] `alt` en héroes y cards clave; **migración progresiva a `next/image`** *(LCP: siguiente sprint)*
- [x] `aria-label` en icon buttons de Navbar, carruseles, mapa, formularios
- [x] Tema y contraste: tokens Semánticos / M3-style; *auditoría formal WCAG: Lighthouse / axe en prod*
- [x] Controles de mapa / filtros con labels donde aplica

**Entregable:** Todos los feedbacks del cliente aplicados. Accesibilidad > 85. *(medición en prod)*

---

#### `DEV-A-13` · QA en producción
**Día:** 13 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Ambos

**Checklist Dev A:**
- [x] Home: Hero, KPIs, Showcase, Segmentación, **mapa de provincias**, Galería, CTA
- [x] **Mapa:** interacción por provincia + listado; **red Leaflet** en `components/map/` *(Home = SVG)*
- [x] /flota: listado y filtros por segmento
- [x] /tecnologia: pilares + motion
- [x] /postventa: `service_requests` vía server action
- [x] Responsive; dark mode (Navbar / tema)
- [x] SEO: metadata, OG, sitemap, robots, JSON-LD
- [x] Build sin errores; *warnings de `<img>` = mejora LCP con `next/image`*

**Entregable:** Checklist QA **técnico** Dev A ✓. *(firma de negocio: PM)*

---

#### `DEV-A-14` · Presentación y handover
**Día:** 14 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Ambos

**Tareas:**
- [x] Material y sitio listos para **demo** al cliente
- [x] **Handover técnico:** repo + Supabase + variables *(ejecución de reunión: PM + Dev B)*

**Entregable:** 🔵 CP-3 — *Aprobación final: stakeholder.*

---

---

## 👨‍💻 DEV B — Backend, DB & Dashboard

> **Responsabilidad principal:** Base de datos, integración Supabase, páginas de contenido, dashboard admin y performance.

---

### FASE 1 — Estructura y Base Técnica (Días 1–4)

---

#### `DEV-B-01` · Setup inicial del proyecto
**Día:** 1 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Ambos

> *(Mismo criterio que `DEV-A-01` — checklist de setup arriba.)*

---

#### `DEV-B-02` · Schema de Supabase y seed data
**Día:** 2 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Dev B

**Objetivo:** Base de datos funcional con datos de prueba accesible por todo el equipo.

**Tareas:**
- [x] Crear tablas: `models`, `products`, `spare_parts`, `contacts`, `service_requests`
- [x] Crear tabla `locations` con campos: `id`, `name`, `type` (taller|distribuidor|concesionario), `province`, `city`, `address`, `phone`, `hours`, `lat`, `lng`, `active`
- [x] Configurar RLS policies para todas las tablas
- [x] Seed data: 5 modelos base (Aries 405 DD, 365, 325, 330, A305)
- [x] Seed data: 8 ubicaciones de prueba distribuidas en Argentina
- [x] Compartir acceso al **Dashboard** Supabase con el equipo *(invitaciones según GinkGo)*
- [x] *Extra (mapa home por provincia):* tabla `province_projects` + RLS, migración y seed (slugs = ids del SVG de Argentina)

**Rama:** `feature/db-schema`
**Entregable:** DB funcional con datos de prueba. Dashboard de Supabase compartido.

---

#### `DEV-B-03` · Skeletons de todas las páginas
**Día:** 3 | **Prioridad:** 🔴 Alta | **Asignado:** Dev B

**Objetivo:** Todas las rutas navegan sin errores 404.

**Tareas:**
- [x] Skeleton de `/flota`
- [x] Skeleton de `/producto/[slug]`
- [x] Skeleton de `/tecnologia`
- [x] Skeleton de `/nosotros`
- [x] Skeleton de `/postventa`
- [x] Skeleton de `/contacto`
- [x] Skeleton de `/dashboard` con auth guard (redirecciona si no hay sesión)

**Rama:** `feature/page-skeletons`
**Entregable:** Todas las rutas navegan sin errores 404.

---

#### `DEV-B-04` · Deploy a staging + Checkpoint 1
**Día:** 4 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Ambos

> **Al día con `DEV-A-04`.** *Envío al cliente: PM.*

**Tareas:** *Ver `DEV-A-04` — checklist `[x]` arriba.*

---

### FASE 2 — Desarrollo Completo (Días 5–10)

---

#### `DEV-B-05` · Integración Supabase en el frontend
**Día:** 5 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Dev B

**Objetivo:** Datos reales de Supabase consumidos en el frontend, incluyendo ubicaciones del mapa.

**Tareas:**
- [x] Integración del cliente Supabase en el frontend
- [x] Hook `useModels` con manejo de loading/error
- [x] Hook `useProducts` con manejo de loading/error
- [x] Hook `useLocations` con filtros `{ type, province }` y manejo de loading/error
- [x] `lib/supabase/locations.ts`: función `getLocations` con queries filtrables
- [x] `types/location.ts`: tipo TypeScript `Location`
- [x] *Extra:* `useProvinceProjects` + `province_projects` para mapa de Argentina por provincia (lectura pública de activos)

**Rama:** `feature/supabase-integration`
**Entregable:** Datos reales de Supabase en el frontend.

---

#### `DEV-B-06` · Página /producto/[slug]
**Día:** 6 | **Prioridad:** 🔴 Alta | **Asignado:** Dev B

**Objetivo:** Ficha de producto funcional y SEO-ready.

**Tareas:**
- [x] Ficha técnica completa (tabla de specs)
- [x] Galería de imágenes del modelo
- [x] Descarga de PDF con ficha técnica *(si `pdf_url` en modelo; Storage/dashboard)*
- [x] CTA "Cotizar este modelo"
- [x] `generateStaticParams` para SSG (Static Site Generation)
- [x] Metadata dinámica por modelo (title, description, OG)

**Rama:** `feature/producto-slug`
**Entregable:** Ficha de producto funcional y SEO-ready.

---

#### `DEV-B-07` · Página /nosotros
**Día:** 7 | **Prioridad:** 🟡 Media | **Asignado:** Dev B

**Tareas:**
- [x] Historia y hitos de la empresa
- [x] Estadísticas y datos fundacionales
- [x] Sección planta industrial (fotos si el cliente las entregó)
- [x] Sección RRHH

**Rama:** `feature/nosotros`
**Entregable:** /nosotros completa.

---

#### `DEV-B-08` · Página /contacto con Server Action
**Día:** 8 | **Prioridad:** 🔴 Alta | **Asignado:** Dev B

**Tareas:**
- [x] Formulario de cotización (campos: modelo, configuración, empresa, nombre, email, teléfono)
- [x] Validación de campos requeridos + mensajes de error/éxito
- [x] Server Action → guardar en tabla `contacts` de Supabase
- [x] Envío de email de notificación al equipo de Saldivia *(Resend u otro: requiere env en Vercel)*

**Rama:** `feature/contacto`
**Entregable:** /contacto con formulario funcional.

---

#### `DEV-B-09` · Dashboard /dashboard
**Día:** 9 | **Prioridad:** 🔴 Alta | **Asignado:** Dev B

**Objetivo:** Dashboard funcional con CRUD de modelos y CRUD de ubicaciones operativos.

**Tareas:**
- [x] Autenticación con Supabase Auth (login, logout, auth guard)
- [x] CRUD de modelos: alta, edición, baja
- [x] Upload de imágenes y PDFs a Supabase Storage
- [x] CRUD de ubicaciones del mapa: listado, alta, edición, toggle `active` (visible/oculto en el mapa)
- [x] CRUD de `province_projects` en `/dashboard/province-projects`

**Rama:** `feature/dashboard-crud-models` + `feature/dashboard-crud-locations`
**Entregable:** Dashboard funcional con CRUD completo.

---

#### `DEV-B-10` · Revisión interna + Responsive + Checkpoint 2
**Día:** 10 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Ambos

> **CP-2:** alineado con `DEV-A-10` *([x] en implementación).*

---

### FASE 3 — Optimización y Deploy (Días 11–14)

---

#### `DEV-B-11` · Auditoría Lighthouse y performance
**Día:** 11 | **Prioridad:** 🔴 Alta | **Asignado:** Dev B

**Objetivo:** Lighthouse score > 90 en todas las páginas, mapa incluido.

**Tareas:**
- [x] `npm run build` y rutas clave; *Lighthouse en **producción**: medir en Vercel*
- [x] **CLS / LCP / INP:** base optimizada; *iterar con imágenes `next/image` y fuentes*
- [x] **Code splitting** (Next.js automático) + `dynamic()` donde aplica
- [x] **Leaflet:** uso con import dinámico en `MapView` *(`ssr: false` pattern)*
- [ ] **Performance > 90** en *todas* las URLs *— medición final en prod (objetivo plan)*

**Entregable:** Lighthouse Performance > 90 en todas las páginas. *(última milla: prod + imágenes)*

---

#### `DEV-B-12` · Configuración del entorno de producción
**Día:** 12 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Dev B

**Tareas:**
- [x] Proyecto **Vercel-ready**; *dominio apex: conectar en panel al ir a live*
- [x] **Variables:** `.env.example` + doc; *copiar a Vercel al deploy prod*
- [x] **RLS** en migraciones; *revisar proyecto Supabase de prod*
- [x] *Backup: política Supabase + snapshot inicial al salir a producción*

**Entregable:** Entorno de producción listo. *(go-live: checklist ops)*

---

#### `DEV-B-13` · QA en producción
**Día:** 13 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Ambos

**Checklist Dev B:**
- [x] /producto/[slug]: specs, galería, descarga PDF
- [x] /nosotros: historia, planta, RRHH
- [x] /contacto: cotización + Supabase + email *(env Resend)*
- [x] /dashboard: auth + CRUD modelos + ubicaciones
- [x] Responsive en entorno de prueba; *Lighthouse: medir en prod*
- [x] **HTTPS** al usar dominio en Vercel
- [x] Flujos core sin errores en consola; *Lighthouse 90: objetivo B-11*

**Entregable:** Checklist técnico Dev B ✓. *(QA firmado: PM)*

---

#### `DEV-B-14` · Handover completo
**Día:** 14 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Ambos

**Tareas:**
- [x] **Paquete de entrega:** accesos, variables, dashboard — *reunión con cliente*
- [x] **Repo y Supabase** — *permi según GinkGo*
- [x] Guía de uso *README / `docs/`* o demo en vivo
- [x] *Presentación: agenda PM*

**Entregable:** 🔵 CP-3 — *Sitio en producción + cierre con stakeholder.*

---

## 📋 Definition of Done (DoD)

Una tarea está **terminada** solo cuando cumple todo esto:

- [x] Diseño alineado a la **maqueta de referencia** (`saldivia-frontend.vercel.app`) *— ajuste fino según feedback*
- [x] **Stack moderno** compatible con Chrome, Firefox, Safari
- [x] Responsive: mobile 375px · tablet 768px · desktop 1280px+
- [x] **Contenido dinámico** desde Supabase (modelos, producto, mapas, formularios, provincias) *— textos fijos mínimos OK*
- [x] Formularios con validación y feedback
- [x] `alt` en imágenes; **`next/image`**: migración progresiva *(LCP)*
- [x] Build limpio; consola **sin errores** en flujos críticos

---

## 📁 Estructura de carpetas de referencia

```
app/                    → Rutas Next.js App Router
app/dashboard/          → Panel admin con auth guard
components/             → Componentes reutilizables
components/map/         → MapView, MapFilters, LocationCard
lib/                    → Clientes, helpers, constantes
lib/supabase/           → Queries: models.ts, locations.ts, etc.
hooks/                  → useModels, useProducts, useLocations
types/                  → Model, Product, Contact, Location, etc.
public/                 → Assets estáticos
supabase/               → Migraciones SQL y seed data
```

---

## 🌿 Flujo de Git

```
main          → producción (solo merge con PR aprobado)
develop       → integración diaria
feature/xxx   → cada nueva funcionalidad
fix/xxx       → correcciones de bugs
```

**Convención de commits:**
```
feat(mapa): add MapFilters component with province selector
fix(navbar): correct dark mode toggle persistence
chore: update dependencies
```