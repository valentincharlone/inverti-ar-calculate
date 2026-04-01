"use client";

import { motion } from "framer-motion";
import type { InstrumentType } from "@/types";

const INSTRUMENTS: {
  id: InstrumentType;
  label: string;
  description: string;
  icon: string;
  color: string;
}[] = [
  {
    id: "plazo-fijo",
    label: "Plazo Fijo",
    description: "Rendimiento fijo garantizado en pesos",
    icon: "🏦",
    color: "from-blue-600/30 to-blue-500/10 border-blue-500/40 hover:border-blue-400",
  },
  {
    id: "cedears",
    label: "CEDEARs",
    description: "Acciones extranjeras desde Argentina",
    icon: "🌎",
    color: "from-violet-600/30 to-violet-500/10 border-violet-500/40 hover:border-violet-400",
  },
  {
    id: "acciones",
    label: "Acciones",
    description: "Empresas argentinas en bolsa",
    icon: "📈",
    color: "from-emerald-600/30 to-emerald-500/10 border-emerald-500/40 hover:border-emerald-400",
  },
  {
    id: "bonos",
    label: "Bonos",
    description: "Deuda soberana y corporativa",
    icon: "📄",
    color: "from-amber-600/30 to-amber-500/10 border-amber-500/40 hover:border-amber-400",
  },
];

interface Props {
  selected: InstrumentType | null;
  onChange: (instrument: InstrumentType) => void;
}

export function InstrumentSelector({ selected, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {INSTRUMENTS.map((instrument, i) => (
        <motion.button
          key={instrument.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          onClick={() => onChange(instrument.id)}
          className={`relative flex flex-col items-start p-5 rounded-2xl border bg-gradient-to-br transition-all duration-200 text-left cursor-pointer group ${instrument.color} ${
            selected === instrument.id
              ? "ring-2 ring-white/40 scale-[1.02] shadow-xl"
              : "hover:scale-[1.01]"
          }`}
        >
          {selected === instrument.id && (
            <motion.div
              layoutId="selectedIndicator"
              className="absolute inset-0 rounded-2xl bg-white/5"
            />
          )}
          <span className="text-3xl mb-3">{instrument.icon}</span>
          <span className="font-semibold text-white text-base">{instrument.label}</span>
          <span className="text-xs text-white/50 mt-1 leading-snug">{instrument.description}</span>
          {selected === instrument.id && (
            <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white/70" />
          )}
        </motion.button>
      ))}
    </div>
  );
}
