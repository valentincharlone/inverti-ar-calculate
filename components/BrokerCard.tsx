"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, Star, Plus, Check } from "lucide-react";
import { Badge } from "./Badge";
import type { BrokerRanking } from "@/types";

const RANK_MEDALS = ["🥇", "🥈", "🥉"];

interface Props {
  ranking: BrokerRanking;
  index: number;
  isSelected?: boolean;
  onToggle?: () => void;
  canSelect?: boolean;
}

export function BrokerCard({ ranking, index, isSelected = false, onToggle, canSelect = true }: Props) {
  const { broker, rank, commission, badges, score } = ranking;
  const isTop3 = rank <= 3;
  const medal = RANK_MEDALS[rank - 1];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      className={`relative rounded-2xl border p-5 transition-all duration-200 hover:scale-[1.01] ${
        rank === 1
          ? "bg-linear-to-br from-emerald-900/40 to-slate-900 border-emerald-500/40"
          : rank === 2
          ? "bg-linear-to-br from-slate-800/60 to-slate-900 border-slate-600/40"
          : rank === 3
          ? "bg-linear-to-br from-amber-900/20 to-slate-900 border-amber-700/30"
          : "bg-slate-900/60 border-slate-700/30"
      }`}
    >
      {/* Rank */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {isTop3 ? (
            <span className="text-2xl">{medal}</span>
          ) : (
            <span className="text-lg font-bold text-slate-500">#{rank}</span>
          )}
          <div>
            <h3 className="font-semibold text-white text-base">{broker.name}</h3>
            <p className="text-xs text-slate-400 capitalize">
              Perfil: {broker.level}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          {/* Score */}
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold text-white">{broker.uxScore}</span>
            </div>
            <span className="text-xs text-slate-500">UX Score</span>
          </div>
          {/* Select button */}
          {onToggle && (
            <button
              onClick={onToggle}
              disabled={!canSelect}
              title={isSelected ? "Quitar de comparación" : "Agregar a comparación"}
              className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-150 shrink-0 ${
                isSelected
                  ? "bg-violet-600 border-violet-500 text-white"
                  : canSelect
                  ? "border-slate-600 text-slate-500 hover:border-violet-400 hover:text-violet-400"
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
      <div className="flex items-center justify-between bg-slate-800/60 rounded-xl px-4 py-3 mb-4">
        <span className="text-slate-400 text-sm">Comisión</span>
        <span
          className={`font-bold text-lg ${
            commission === 0
              ? "text-emerald-400"
              : commission <= 0.35
              ? "text-blue-400"
              : "text-slate-200"
          }`}
        >
          {commission === 0 ? "Sin comisión" : `${commission}%`}
        </span>
      </div>

      {/* Pros & Cons */}
      <div className="grid grid-cols-1 gap-3">
        <div>
          <p className="text-xs font-medium text-emerald-400 mb-1.5 uppercase tracking-wide">
            Ventajas
          </p>
          <ul className="space-y-1">
            {broker.pros.slice(0, 3).map((pro, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium text-rose-400 mb-1.5 uppercase tracking-wide">
            Desventajas
          </p>
          <ul className="space-y-1">
            {broker.cons.slice(0, 2).map((con, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
