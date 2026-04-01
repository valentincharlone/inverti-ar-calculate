"use client";

import { motion } from "framer-motion";
import { X, CheckCircle, XCircle } from "lucide-react";
import type { BrokerRanking } from "@/types";

interface Props {
  rankings: BrokerRanking[];
  instrument: "cedears" | "acciones" | "bonos";
  onClose: () => void;
}

function bestIndex(values: number[], higherIsBetter = true): number {
  let best = 0;
  for (let i = 1; i < values.length; i++) {
    if (higherIsBetter ? values[i] > values[best] : values[i] < values[best]) best = i;
  }
  return best;
}

const LEVEL_LABELS: Record<string, string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

export function BrokerComparison({ rankings, instrument, onClose }: Props) {
  const commissions = rankings.map((r) => r.commission);
  const uxScores = rankings.map((r) => r.broker.uxScore);
  const scores = rankings.map((r) => r.score);
  const minAmounts = rankings.map(
    (r) => r.broker.instruments[instrument]?.minAmount ?? 0
  );

  const bestCommission = bestIndex(commissions, false);
  const bestUX = bestIndex(uxScores);
  const bestScore = bestIndex(scores);
  const bestMinAmount = bestIndex(minAmounts, false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="rounded border border-slate-700 bg-slate-900 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-800">
        <span className="text-sm font-semibold text-white">
          Comparando {rankings.length} {rankings.length === 1 ? "broker" : "brokers"}
        </span>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left px-5 py-3 text-slate-500 font-medium w-36" />
              {rankings.map((r) => (
                <th key={r.broker.id} className="px-5 py-3 text-center font-semibold text-white">
                  {r.broker.name}
                  <div className="text-xs font-normal text-slate-500">
                    {LEVEL_LABELS[r.broker.level]}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
              <td className="px-5 py-2.5 text-slate-400 text-xs uppercase tracking-wide font-medium">Comisión</td>
              {commissions.map((c, i) => (
                <td key={i} className="px-5 py-2.5 text-center">
                  <span className={i === bestCommission ? "font-bold text-green-400" : "text-slate-300"}>
                    {c === 0 ? "Sin comisión" : `${c}%`}
                    {i === bestCommission && rankings.length > 1 && " ★"}
                  </span>
                </td>
              ))}
            </tr>

            <tr className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
              <td className="px-5 py-2.5 text-slate-400 text-xs uppercase tracking-wide font-medium">UX Score</td>
              {uxScores.map((s, i) => (
                <td key={i} className="px-5 py-2.5 text-center">
                  <span className={i === bestUX ? "font-bold text-white" : "text-slate-300"}>
                    {s}{i === bestUX && rankings.length > 1 && " ★"}
                  </span>
                </td>
              ))}
            </tr>

            <tr className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
              <td className="px-5 py-2.5 text-slate-400 text-xs uppercase tracking-wide font-medium">Score general</td>
              {scores.map((s, i) => (
                <td key={i} className="px-5 py-2.5 text-center">
                  <span className={i === bestScore ? "font-bold text-blue-400" : "text-slate-300"}>
                    {s.toFixed(1)}{i === bestScore && rankings.length > 1 && " ★"}
                  </span>
                </td>
              ))}
            </tr>

            <tr className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
              <td className="px-5 py-2.5 text-slate-400 text-xs uppercase tracking-wide font-medium">Monto mínimo</td>
              {minAmounts.map((m, i) => (
                <td key={i} className="px-5 py-2.5 text-center">
                  <span className={i === bestMinAmount ? "font-bold text-white" : "text-slate-300"}>
                    {m === 0 ? "Sin mínimo ★" : `$${m}`}
                  </span>
                </td>
              ))}
            </tr>

            <tr className="border-b border-slate-800">
              <td className="px-5 py-3 text-slate-400 text-xs uppercase tracking-wide font-medium align-top">Ventajas</td>
              {rankings.map((r) => (
                <td key={r.broker.id} className="px-5 py-3 align-top">
                  <ul className="space-y-1.5">
                    {r.broker.pros.slice(0, 3).map((pro, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                        <CheckCircle className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            <tr>
              <td className="px-5 py-3 text-slate-400 text-xs uppercase tracking-wide font-medium align-top">Desventajas</td>
              {rankings.map((r) => (
                <td key={r.broker.id} className="px-5 py-3 align-top">
                  <ul className="space-y-1.5">
                    {r.broker.cons.slice(0, 2).map((con, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-slate-500">
                        <XCircle className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
