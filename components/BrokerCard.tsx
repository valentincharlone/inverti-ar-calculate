"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, Star, Plus, Check } from "lucide-react";
import { Badge } from "./Badge";
import type { BrokerRanking } from "@/types";

interface Props {
  ranking: BrokerRanking;
  index: number;
  isSelected?: boolean;
  onToggle?: () => void;
  canSelect?: boolean;
}

export function BrokerCard({ ranking, index, isSelected = false, onToggle, canSelect = true }: Props) {
  const { broker, rank, commission, badges, score } = ranking;
  const isTop = rank === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`rounded border p-5 transition-colors duration-150 ${
        isTop
          ? "bg-slate-900 border-blue-500/60"
          : "bg-slate-900 border-slate-800"
      }`}
    >
      {/* Rank + Name */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`text-sm font-bold tabular-nums w-6 text-right ${isTop ? "text-blue-400" : "text-slate-500"}`}>
            #{rank}
          </span>
          <div>
            <h3 className="font-semibold text-white text-sm">{broker.name}</h3>
            <p className="text-xs text-slate-500 capitalize mt-0.5">
              Perfil: {broker.level}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <Star className="w-3 h-3 text-slate-400 fill-slate-400" />
              <span className="text-sm font-semibold text-white">{broker.uxScore}</span>
            </div>
            <span className="text-xs text-slate-500">UX</span>
          </div>
          {onToggle && (
            <button
              onClick={onToggle}
              disabled={!canSelect}
              title={isSelected ? "Quitar de comparación" : "Agregar a comparación"}
              className={`w-7 h-7 rounded border flex items-center justify-center transition-colors duration-150 shrink-0 ${
                isSelected
                  ? "bg-blue-600 border-blue-500 text-white"
                  : canSelect
                  ? "border-slate-600 text-slate-500 hover:border-blue-400 hover:text-blue-400"
                  : "border-slate-800 text-slate-700 cursor-not-allowed"
              }`}
            >
              {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {badges.map((b) => (
            <Badge key={b} type={b} />
          ))}
        </div>
      )}

      {/* Commission */}
      <div className="flex items-center justify-between bg-slate-800 border border-slate-700 px-4 py-3 mb-4 rounded">
        <span className="text-slate-400 text-xs uppercase tracking-wide font-medium">Comisión</span>
        <span className={`font-bold text-base ${commission === 0 ? "text-green-400" : "text-slate-200"}`}>
          {commission === 0 ? "Sin comisión" : `${commission}%`}
        </span>
      </div>

      {/* Pros & Cons */}
      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">
            Ventajas
          </p>
          <ul className="space-y-1">
            {broker.pros.slice(0, 3).map((pro, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
            Desventajas
          </p>
          <ul className="space-y-1">
            {broker.cons.slice(0, 2).map((con, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
