"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Location, LocationType } from "@/types/location";

const ARGENTINA_CENTER: [number, number] = [-38.4161, -63.6167];
const DEFAULT_ZOOM = 4;

const MARKER_CFG: Record<LocationType, { color: string; letter: string }> = {
  taller: { color: "#f97316", letter: "T" },
  distribuidor: { color: "#2095D4", letter: "D" },
  concesionario: { color: "#10b981", letter: "C" },
};

const TYPE_LABELS: Record<LocationType, string> = {
  taller: "Taller Autorizado",
  distribuidor: "Distribuidor",
  concesionario: "Concesionario",
};

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildMarkerIcon(type: LocationType): L.DivIcon {
  const { color, letter } = MARKER_CFG[type];
  return L.divIcon({
    className: "",
    html: `<div style="
      width:30px;height:30px;
      background:${color};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:2px solid rgba(255,255,255,0.35);
      box-shadow:0 3px 10px rgba(0,0,0,0.45);
      display:flex;align-items:center;justify-content:center;
    "><span style="
      transform:rotate(45deg);
      color:#fff;
      font-size:12px;
      font-weight:900;
      font-family:sans-serif;
      display:flex;align-items:center;justify-content:center;
      width:100%;height:100%;
    ">${letter}</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -32],
  });
}

function buildPopupHtml(loc: Location): string {
  return `
    <div class="min-w-[180px]">
      <span class="text-[10px] font-bold uppercase tracking-wider text-gray-500">
        ${esc(TYPE_LABELS[loc.type])}
      </span>
      <p class="font-bold text-sm mt-0.5 leading-tight text-gray-900">
        ${esc(loc.name)}
      </p>
      <p class="text-xs text-gray-600 mt-1">${esc(loc.address)}</p>
      <p class="text-xs text-gray-500">${esc(loc.city)}, ${esc(loc.province)}</p>
      ${loc.phone ? `<p class="text-xs mt-1.5 text-gray-700">📞 ${esc(loc.phone)}</p>` : ""}
      ${loc.hours ? `<p class="text-xs text-gray-500 mt-0.5">🕐 ${esc(loc.hours)}</p>` : ""}
    </div>
  `;
}

type Props = {
  locations: Location[];
  selectedLocation: Location | null;
  onSelectLocation: (loc: Location) => void;
};

export default function MapView({ locations, selectedLocation, onSelectLocation }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const prevSelectedIdRef = useRef<string | null>(null);

  // Initialize map once — try/finally guarantees _leaflet_id is cleared even if
  // map.remove() throws, so React 19 StrictMode's double-mount never re-hits the
  // "already initialized" guard.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    const map = L.map(container, { center: ARGENTINA_CENTER, zoom: DEFAULT_ZOOM });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      try {
        map.remove();
      } finally {
        delete (container as HTMLElement & { _leaflet_id?: number })._leaflet_id;
        mapRef.current = null;
        markersRef.current.clear();
      }
    };
  }, []);

  // Sync markers whenever locations list changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const incoming = new Set(locations.map((l) => l.id));

    markersRef.current.forEach((marker, id) => {
      if (!incoming.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    locations.forEach((loc) => {
      if (markersRef.current.has(loc.id)) return;
      const marker = L.marker([loc.lat, loc.lng], { icon: buildMarkerIcon(loc.type) });
      marker.bindPopup(buildPopupHtml(loc));
      marker.on("click", () => onSelectLocation(loc));
      marker.addTo(map);
      markersRef.current.set(loc.id, marker);
    });
  }, [locations, onSelectLocation]);

  // Fly to selected location
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedLocation) return;
    if (selectedLocation.id === prevSelectedIdRef.current) return;
    prevSelectedIdRef.current = selectedLocation.id;
    map.flyTo([selectedLocation.lat, selectedLocation.lng], 13, { duration: 0.7 });
  }, [selectedLocation]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ background: "#0d1520" }}
    />
  );
}
