import type { BadgeType } from "@/types";

const BADGE_CONFIG: Record<BadgeType, { label: string; className: string }> = {
  "mejor-opcion": {
    label: "Mejor opción",
    className: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  },
  "menor-comision": {
    label: "Menor comisión",
    className: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  },
  "mejor-ux": {
    label: "Mejor experiencia",
    className: "bg-violet-500/20 text-violet-400 border border-violet-500/30",
  },
  principiantes: {
    label: "Ideal principiantes",
    className: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  },
  traders: {
    label: "Para traders",
    className: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
  },
  "mejor-tasa": {
    label: "Mejor tasa",
    className: "bg-teal-500/20 text-teal-400 border border-teal-500/30",
  },
};

export function Badge({ type }: { type: BadgeType }) {
  const config = BADGE_CONFIG[type];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
