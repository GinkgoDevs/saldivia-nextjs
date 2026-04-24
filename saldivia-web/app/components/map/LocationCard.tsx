import type { Location, LocationType } from "@/types/location";

const TYPE_LABELS: Record<LocationType, string> = {
  taller: "Taller Autorizado",
  distribuidor: "Distribuidor",
  concesionario: "Concesionario",
};

const TYPE_BADGE: Record<LocationType, string> = {
  taller: "text-orange-400 border-orange-500/30",
  distribuidor: "text-[#2095D4] border-[#2095D4]/30",
  concesionario: "text-emerald-400 border-emerald-500/30",
};

type Props = {
  location: Location;
  selected?: boolean;
  onClick?: () => void;
};

export function LocationCard({ location, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left p-4 rounded-lg border transition-all duration-200",
        selected
          ? "bg-[#2095D4]/10 border-[#2095D4]/40 shadow-[0_0_0_1px_rgba(32,149,212,0.2)]"
          : "bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-white/20",
      ].join(" ")}
    >
      <span
        className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border mb-2 ${TYPE_BADGE[location.type]}`}
      >
        {TYPE_LABELS[location.type]}
      </span>
      <p className="font-headline font-bold text-white text-sm leading-tight">
        {location.name}
      </p>
      <p className="text-slate-400 text-xs mt-0.5">
        {location.city}, {location.province}
      </p>
      <p className="text-slate-500 text-xs mt-1 line-clamp-1">{location.address}</p>
      {location.phone && (
        <p className="text-slate-400 text-xs mt-1.5 flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
            phone
          </span>
          {location.phone}
        </p>
      )}
      {location.hours && (
        <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
            schedule
          </span>
          {location.hours}
        </p>
      )}
    </button>
  );
}
