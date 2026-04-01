"use client";

import { motion } from "framer-motion";
import { Building2, Globe, BarChart2, FileText } from "lucide-react";
import type { InstrumentType } from "@/types";

const INSTRUMENTS: {
  id: InstrumentType;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "plazo-fijo",
    label: "Plazo Fijo",
    description: "Rendimiento fijo garantizado en pesos",
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: "cedears",
    label: "CEDEARs",
    description: "Acciones extranjeras desde Argentina",
    icon: <Globe className="w-5 h-5" />,
  },
  {
    id: "acciones",
    label: "Acciones",
    description: "Empresas argentinas en bolsa",
    icon: <BarChart2 className="w-5 h-5" />,
  },
  {
    id: "bonos",
    label: "Bonos",
    description: "Deuda soberana y corporativa",
    icon: <FileText className="w-5 h-5" />,
  },
];

interface Props {
  selected: InstrumentType | null;
  onChange: (instrument: InstrumentType) => void;
}

export function InstrumentSelector({ selected, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {INSTRUMENTS.map((instrument, i) => (
        <motion.button
          key={instrument.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          onClick={() => onChange(instrument.id)}
          className={`flex flex-col items-start p-4 rounded border transition-colors duration-150 text-left cursor-pointer ${
            selected === instrument.id
              ? "bg-slate-800 border-blue-500 text-white"
              : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-800/70"
          }`}
        >
          <span className={`mb-3 ${selected === instrument.id ? "text-blue-400" : "text-slate-500"}`}>
            {instrument.icon}
          </span>
          <span className="font-semibold text-white text-sm">{instrument.label}</span>
          <span className="text-xs text-slate-500 mt-1 leading-snug">{instrument.description}</span>
        </motion.button>
      ))}
    </div>
  );
}
