export type FleetModel = {
  name: string;
  href: string;
  description: string;
  image?: string;
};

export type FleetSegment = {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  variant: "surface" | "muted";
  columns: "2" | "3";
  aspect: "video" | "square";
  models: FleetModel[];
};

/** Imagen de catálogo compartida por todos los modelos en /flota (public/ARIES-305/345_1.png) */
export const CATALOG_IMG = "/ARIES-305/345_1.png";

export const FLEET_SEGMENTS: FleetSegment[] = [
  {
    id: "urbano",
    eyebrow: "Operación citadina",
    title: "Segmento urbano",
    intro: "Unidades ágiles para alto volumen de pasajeros, accesibilidad y eficiencia en recorridos urbanos.",
    variant: "surface",
    columns: "2",
    aspect: "video",
    models: [
      {
        name: "Aries 305",
        href: "/producto/aries-305",
        description:
          "Diseño compacto y robusto para líneas de alta frecuencia. Optimizado para maniobrabilidad y bajo costo operativo.",
      },
      {
        name: "Aries 315",
        href: "/producto/aries-315",
        description:
          "Mayor capacidad manteniendo el estándar Saldivia en confort y accesibilidad para el transporte metropolitano.",
      },
    ],
  },
  {
    id: "interurbano",
    eyebrow: "Media distancia",
    title: "Segmento interurbano",
    intro: "Confort y rendimiento para trayectos regionales, con bodega generosa y climatización de precisión.",
    variant: "muted",
    columns: "2",
    aspect: "video",
    models: [
      {
        name: "Aries 325",
        href: "/producto/aries-325",
        description:
          "Equilibrio entre capacidad y consumo. Ideal para corredores interurbanos y servicios semirrápido.",
      },
      {
        name: "Aries 330",
        href: "/producto/aries-330",
        description:
          "Plataforma versátil con múltiples layouts de cabina y bodega para operadores que priorizan flexibilidad.",
      },
    ],
  },
  {
    id: "interprovincial",
    eyebrow: "Larga distancia",
    title: "Segmento interprovincial",
    intro: "Referentes en confort ejecutivo y presencia en ruta. Ingeniería para los viajes más exigentes.",
    variant: "surface",
    columns: "3",
    aspect: "square",
    models: [
      {
        name: "Aries 345",
        href: "/producto/aries-345",
        description:
          "Semicama y ejecutivo con acabados premium. Aerodinámica y silencio de marcha para largas distancias.",
      },
      {
        name: "Aries 365",
        href: "/producto/aries-365",
        description:
          "Tope de gama en capacidad y tecnología de abordo. La referencia para operadores de alta exigencia.",
      },
      {
        name: "Aries 405",
        href: "/producto/aries-405",
        description:
          "Doble piso para máxima capacidad sin renunciar a seguridad estructural y confort de clase mundial.",
      },
    ],
  },
  {
    id: "especiales",
    eyebrow: "Aplicaciones a medida",
    title: "Segmento especiales",
    intro: "Proyectos y derivados para logística, servicios industriales y requerimientos fuera de serie.",
    variant: "surface",
    columns: "2",
    aspect: "video",
    models: [],
  },
];

/** Ancla compartida con /flota#especiales (mega menú y CTA) */
export const FLEET_ESPECIALES_ANCHOR = "especiales";
