import type { BadgeType } from "@/types";

const BADGE_LABELS: Record<BadgeType, string> = {
  "mejor-opcion": "Mejor opción",
  "menor-comision": "Menor comisión",
  "mejor-ux": "Mejor experiencia",
  principiantes: "Principiantes",
  traders: "Traders",
  "mejor-tasa": "Mejor tasa",
};

export function Badge({ type }: { type: BadgeType }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
      {BADGE_LABELS[type]}
    </span>
  );
}
