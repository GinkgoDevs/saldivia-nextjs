# 🎫 Tickets del Proyecto — Saldivia Web Institucional
**GinkGoDevs | Abril 2026 | 14 días corridos**

---

## 🎯 Objetivo General

Desarrollar el sitio web institucional de Saldivia Carrocerías: alto impacto visual, rendimiento técnico superior (Lighthouse > 90) y gestión dinámica de contenidos sin tocar código.

**Stack:** Next.js 14 (App Router) · Supabase (PostgreSQL) · Vercel · Leaflet.js · Framer Motion

---

## 🔵 CHECKPOINTS

| Checkpoint | Día | Acción |
|---|---|---|
| ✅ CP-1 | Día 4 | Link de staging enviado al cliente para primer feedback |
| ✅ CP-2 | Día 10 | Segundo staging enviado al cliente para segundo feedback |
| ✅ CP-3 | Día 14 | Aprobación final + handover completo |

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
- [ ] Crear proyecto Next.js 14 con App Router, Tailwind, ESLint, Prettier
- [ ] Configurar estructura de carpetas según el plan
- [ ] Crear repo en GitHub con ramas `main` y `develop`
- [ ] Configurar variables de entorno (`.env.local` + `.env.example`)
- [ ] Crear proyecto inicial en Supabase

**Entregable:** Repo en GitHub con estructura base y README de desarrollo.

---

#### `DEV-A-02` · Navbar y Footer globales
**Día:** 2 | **Prioridad:** 🔴 Alta | **Asignado:** Dev A

**Objetivo:** Tener los componentes globales de navegación funcionales en todas las rutas.

**Tareas:**
- [ ] Navbar con mega-menú de Modelos
- [ ] Dark/light mode toggle funcional y persistente
- [ ] CTA "Cotizar Ahora" en Navbar
- [ ] Footer con links institucionales, segmentos y datos de contacto
- [ ] Layout principal con providers (tema, etc.)

**Rama:** `feature/navbar-footer`
**Entregable:** Navbar y Footer funcionales en todas las rutas.

---

#### `DEV-A-03` · Home — Secciones superiores
**Día:** 3 | **Prioridad:** 🔴 Alta | **Asignado:** Dev A

**Objetivo:** Home visible en staging con las secciones superiores pixel-perfect respecto a la maqueta.

**Tareas:**
- [ ] Hero section (imagen Aries 405, título, botones CTA)
- [ ] KPIs animados
- [ ] Sección Segmentación (3 cards: Urbano, Interurbano, Interprovincial)

**Rama:** `feature/home-hero`
**Referencia:** maqueta en `saldivia-frontend.vercel.app`
**Entregable:** Home visible en staging con secciones superiores.

---

#### `DEV-A-04` · Deploy a staging + Checkpoint 1
**Día:** 4 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Ambos

**Tareas:**
- [ ] Revisión interna conjunta con Dev B
- [ ] Deploy a Vercel (staging)
- [ ] Preparar link y mensaje para el cliente
- [ ] Documentar pendientes detectados

**Entregable:** 🔵 CP-1 — Link de staging enviado al cliente.

---

### FASE 2 — Desarrollo Completo (Días 5–10)

---

#### `DEV-A-05` · Home completo + Mapa interactivo
**Día:** 5 | **Prioridad:** 🔴 Alta | **Asignado:** Dev A

**Objetivo:** Home 100% completo con mapa funcional.

**Tareas:**
- [ ] Showcase Técnico (carrusel de modelos)
- [ ] Galería de imágenes
- [ ] CTA final
- [ ] Animaciones con Framer Motion
- [ ] Componente `MapView` (react-leaflet, carga dinámica `ssr:false`)
- [ ] Marcadores diferenciados por tipo de ubicación con ícono propio
- [ ] Popup básico con nombre y dirección al hacer clic
- [ ] Componente `MapFilters`: 3 botones toggle (taller / distribuidor / concesionario) + select de provincia

**Rama:** `feature/home-completo` + `feature/mapa-interactivo`
**Entregable:** Home 100% completo con mapa funcional.

---

#### `DEV-A-06` · Página /flota + Mapa responsive
**Día:** 6 | **Prioridad:** 🔴 Alta | **Asignado:** Dev A

**Objetivo:** /flota funcional. Mapa 100% integrado y responsive.

**Tareas:**
- [ ] Página `/flota`: listado dinámico por segmento (datos de Supabase)
- [ ] Filtros por categoría en /flota
- [ ] Panel de lista colapsable en mobile (375px) para el mapa
- [ ] Componente `LocationCard`: nombre, dirección, teléfono y horario al clic en marcador

**Rama:** `feature/flota` + `feature/mapa-responsive`
**Entregable:** /flota funcional. Mapa responsive validado.

---

#### `DEV-A-07` · Página /tecnologia
**Día:** 7 | **Prioridad:** 🟡 Media | **Asignado:** Dev A

**Tareas:**
- [ ] Pilares tecnológicos: CAD/CAM, estructura, aerodinámica
- [ ] Sección seguridad activa y pasiva
- [ ] Animaciones de scroll reveal

**Rama:** `feature/tecnologia`
**Entregable:** /tecnologia completa.

---

#### `DEV-A-08` · Página /postventa
**Día:** 8 | **Prioridad:** 🟡 Media | **Asignado:** Dev A

**Tareas:**
- [ ] Formulario de soporte técnico (campos: VIN, empresa, descripción)
- [ ] Validación de campos requeridos + mensajes de error/éxito
- [ ] Documentación técnica descargable
- [ ] Sección red de servicios

**Rama:** `feature/postventa`
**Entregable:** /postventa con formulario funcional.

---

#### `DEV-A-09` · Responsive Home y /flota
**Día:** 9 | **Prioridad:** 🔴 Alta | **Asignado:** Dev A

**Tareas:**
- [ ] Responsive completo: mobile (375px), tablet (768px), desktop (1280px+) para Home y /flota
- [ ] Testing del mapa en múltiples viewports
- [ ] Validar fallback visual si Leaflet no carga

**Entregable:** Home (con mapa) y /flota responsive validados.

---

#### `DEV-A-10` · Revisión interna + Responsive restante + Checkpoint 2
**Día:** 10 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Ambos

**Tareas:**
- [ ] Revisión interna conjunta con Dev B
- [ ] Responsive de todas las páginas restantes
- [ ] Testing de formularios y mapa end-to-end
- [ ] Corrección de bugs detectados
- [ ] Actualizar staging

**Entregable:** 🔵 CP-2 — Segundo link de staging enviado al cliente.

---

### FASE 3 — Optimización y Deploy (Días 11–14)

---

#### `DEV-A-11` · SEO técnico completo
**Día:** 11 | **Prioridad:** 🔴 Alta | **Asignado:** Dev A

**Objetivo:** SEO validado con herramientas. Score Lighthouse SEO > 95.

**Tareas:**
- [ ] Metadata dinámica por página (title, description)
- [ ] Open Graph tags
- [ ] Twitter Cards
- [ ] `sitemap.xml` accesible
- [ ] `robots.txt` configurado
- [ ] Structured data: `Organization` + `Product` (JSON-LD)

**Rama:** `feature/seo`
**Entregable:** SEO validado con herramientas.

---

#### `DEV-A-12` · Feedback CP-2 + Accesibilidad
**Día:** 12 | **Prioridad:** 🔴 Alta | **Asignado:** Dev A

**Tareas:**
- [ ] Aplicar todos los ajustes del feedback del Checkpoint 2
- [ ] Alt texts descriptivos en todas las imágenes (`next/image`)
- [ ] Aria-labels en elementos interactivos
- [ ] Contraste de colores validado (WCAG AA)
- [ ] Aria-labels en controles de filtro del mapa

**Entregable:** Todos los feedbacks del cliente aplicados. Accesibilidad > 85.

---

#### `DEV-A-13` · QA en producción
**Día:** 13 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Ambos

**Checklist Dev A:**
- [ ] Home: Hero, KPIs, Showcase, Segmentación, Mapa + filtros, Galería, CTA
- [ ] Mapa: marcadores visibles, filtros funcionales, LocationCard al clic, responsive mobile
- [ ] /flota: listado por segmento, filtros funcionales
- [ ] /tecnologia: pilares y seguridad
- [ ] /postventa: formulario enviado a Supabase
- [ ] Responsive completo en todas las páginas
- [ ] Dark mode funcional en todas las páginas (incluido mapa)
- [ ] SEO: metadata, OG, sitemap, robots
- [ ] Sin errores en consola del navegador

**Entregable:** Checklist QA firmado (sección Dev A).

---

#### `DEV-A-14` · Presentación y handover
**Día:** 14 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Ambos

**Tareas:**
- [ ] Presentación al cliente
- [ ] Acompañar handover junto con Dev B

**Entregable:** 🔵 CP-3 — Aprobación final del cliente.

---

---

## 👨‍💻 DEV B — Backend, DB & Dashboard

> **Responsabilidad principal:** Base de datos, integración Supabase, páginas de contenido, dashboard admin y performance.

---

### FASE 1 — Estructura y Base Técnica (Días 1–4)

---

#### `DEV-B-01` · Setup inicial del proyecto
**Día:** 1 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Ambos

*(mismo ticket compartido con Dev A — ver DEV-A-01)*

---

#### `DEV-B-02` · Schema de Supabase y seed data
**Día:** 2 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Dev B

**Objetivo:** Base de datos funcional con datos de prueba accesible por todo el equipo.

**Tareas:**
- [ ] Crear tablas: `models`, `products`, `spare_parts`, `contacts`, `service_requests`
- [ ] Crear tabla `locations` con campos: `id`, `name`, `type` (taller|distribuidor|concesionario), `province`, `city`, `address`, `phone`, `hours`, `lat`, `lng`, `active`
- [ ] Configurar RLS policies para todas las tablas
- [ ] Seed data: 5 modelos base (Aries 405 DD, 365, 325, 330, A305)
- [ ] Seed data: 8 ubicaciones de prueba distribuidas en Argentina
- [ ] Compartir acceso al Dashboard de Supabase con Dev A

**Rama:** `feature/db-schema`
**Entregable:** DB funcional con datos de prueba. Dashboard de Supabase compartido.

---

#### `DEV-B-03` · Skeletons de todas las páginas
**Día:** 3 | **Prioridad:** 🔴 Alta | **Asignado:** Dev B

**Objetivo:** Todas las rutas navegan sin errores 404.

**Tareas:**
- [ ] Skeleton de `/flota`
- [ ] Skeleton de `/producto/[slug]`
- [ ] Skeleton de `/tecnologia`
- [ ] Skeleton de `/nosotros`
- [ ] Skeleton de `/postventa`
- [ ] Skeleton de `/contacto`
- [ ] Skeleton de `/dashboard` con auth guard (redirecciona si no hay sesión)

**Rama:** `feature/page-skeletons`
**Entregable:** Todas las rutas navegan sin errores 404.

---

#### `DEV-B-04` · Deploy a staging + Checkpoint 1
**Día:** 4 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Ambos

*(mismo checkpoint compartido — ver DEV-A-04)*

---

### FASE 2 — Desarrollo Completo (Días 5–10)

---

#### `DEV-B-05` · Integración Supabase en el frontend
**Día:** 5 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Dev B

**Objetivo:** Datos reales de Supabase consumidos en el frontend, incluyendo ubicaciones del mapa.

**Tareas:**
- [ ] Integración del cliente Supabase en el frontend
- [ ] Hook `useModels` con manejo de loading/error
- [ ] Hook `useProducts` con manejo de loading/error
- [ ] Hook `useLocations` con filtros `{ type, province }` y manejo de loading/error
- [ ] `lib/supabase/locations.ts`: función `getLocations` con queries filtrables
- [ ] `types/location.ts`: tipo TypeScript `Location`

**Rama:** `feature/supabase-integration`
**Entregable:** Datos reales de Supabase en el frontend.

---

#### `DEV-B-06` · Página /producto/[slug]
**Día:** 6 | **Prioridad:** 🔴 Alta | **Asignado:** Dev B

**Objetivo:** Ficha de producto funcional y SEO-ready.

**Tareas:**
- [ ] Ficha técnica completa (tabla de specs)
- [ ] Galería de imágenes del modelo
- [ ] Descarga de PDF con ficha técnica
- [ ] CTA "Cotizar este modelo"
- [ ] `generateStaticParams` para SSG (Static Site Generation)
- [ ] Metadata dinámica por modelo (title, description, OG)

**Rama:** `feature/producto-slug`
**Entregable:** Ficha de producto funcional y SEO-ready.

---

#### `DEV-B-07` · Página /nosotros
**Día:** 7 | **Prioridad:** 🟡 Media | **Asignado:** Dev B

**Tareas:**
- [ ] Historia y hitos de la empresa
- [ ] Estadísticas y datos fundacionales
- [ ] Sección planta industrial (fotos si el cliente las entregó)
- [ ] Sección RRHH

**Rama:** `feature/nosotros`
**Entregable:** /nosotros completa.

---

#### `DEV-B-08` · Página /contacto con Server Action
**Día:** 8 | **Prioridad:** 🔴 Alta | **Asignado:** Dev B

**Tareas:**
- [ ] Formulario de cotización (campos: modelo, configuración, empresa, nombre, email, teléfono)
- [ ] Validación de campos requeridos + mensajes de error/éxito
- [ ] Server Action → guardar en tabla `contacts` de Supabase
- [ ] Envío de email de notificación al equipo de Saldivia

**Rama:** `feature/contacto`
**Entregable:** /contacto con formulario funcional.

---

#### `DEV-B-09` · Dashboard /dashboard
**Día:** 9 | **Prioridad:** 🔴 Alta | **Asignado:** Dev B

**Objetivo:** Dashboard funcional con CRUD de modelos y CRUD de ubicaciones operativos.

**Tareas:**
- [ ] Autenticación con Supabase Auth (login, logout, auth guard)
- [ ] CRUD de modelos: alta, edición, baja
- [ ] Upload de imágenes y PDFs a Supabase Storage
- [ ] CRUD de ubicaciones del mapa: listado, alta, edición, toggle `active` (visible/oculto en el mapa)

**Rama:** `feature/dashboard-crud-models` + `feature/dashboard-crud-locations`
**Entregable:** Dashboard funcional con CRUD completo.

---

#### `DEV-B-10` · Revisión interna + Responsive + Checkpoint 2
**Día:** 10 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Ambos

*(mismo checkpoint compartido — ver DEV-A-10)*

---

### FASE 3 — Optimización y Deploy (Días 11–14)

---

#### `DEV-B-11` · Auditoría Lighthouse y performance
**Día:** 11 | **Prioridad:** 🔴 Alta | **Asignado:** Dev B

**Objetivo:** Lighthouse score > 90 en todas las páginas, mapa incluido.

**Tareas:**
- [ ] Auditoría completa con Lighthouse
- [ ] Corrección de CLS (Cumulative Layout Shift)
- [ ] Corrección de LCP (Largest Contentful Paint)
- [ ] Corrección de FID / INP
- [ ] Code splitting donde sea necesario
- [ ] Lazy loading de Leaflet con `dynamic import` (`ssr:false`) confirmado
- [ ] Validar que Performance > 90 con el mapa incluido

**Entregable:** Lighthouse Performance > 90 en todas las páginas.

---

#### `DEV-B-12` · Configuración del entorno de producción
**Día:** 12 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Dev B

**Tareas:**
- [ ] Configurar dominio del cliente en Vercel
- [ ] Variables de entorno cargadas en el panel de Vercel (producción)
- [ ] RLS policies de Supabase revisadas y activas en producción
- [ ] Backup inicial de la base de datos

**Entregable:** Entorno de producción listo.

---

#### `DEV-B-13` · QA en producción
**Día:** 13 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Ambos

**Checklist Dev B:**
- [ ] /producto/[slug]: specs, galería, descarga PDF
- [ ] /nosotros: historia, planta, RRHH
- [ ] /contacto: formulario de cotización + email de notificación
- [ ] /dashboard: login funcional, CRUD de modelos operativo, CRUD de ubicaciones operativo
- [ ] Responsive completo en todas las páginas
- [ ] Lighthouse > 90 en Home y /flota
- [ ] Dominio del cliente activo con HTTPS
- [ ] Sin errores en consola del navegador

**Entregable:** Checklist QA firmado (sección Dev B).

---

#### `DEV-B-14` · Handover completo
**Día:** 14 | **Prioridad:** 🔴 Bloqueante | **Asignado:** Ambos

**Tareas:**
- [ ] Entrega de credenciales de Supabase al cliente
- [ ] Entrega de acceso al repositorio de GitHub al cliente
- [ ] Entrega de guía de uso del dashboard (incluye gestión del mapa)
- [ ] Presentación final al cliente

**Entregable:** 🔵 CP-3 — Sitio live + documentación entregada al cliente.

---

## 📋 Definition of Done (DoD)

Una tarea está **terminada** solo cuando cumple todo esto:

- [ ] Diseño fiel a la maqueta aprobada (`saldivia-frontend.vercel.app`)
- [ ] Funciona en Chrome, Firefox y Safari (últimas versiones)
- [ ] Responsive validado: mobile 375px · tablet 768px · desktop 1280px+
- [ ] Datos dinámicos vienen de Supabase (nada hardcodeado)
- [ ] Formularios validan campos y muestran mensajes de error/éxito
- [ ] Imágenes usan `next/image` con `alt` descriptivo
- [ ] Sin errores ni warnings críticos en consola

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