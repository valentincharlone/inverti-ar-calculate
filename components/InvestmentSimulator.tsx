"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { compareInvestments, formatARS, formatPct } from "@/lib/calculations";
import type { SimulatorResult } from "@/types";

const DAY_OPTIONS = [
  { label: "1 mes", days: 30 },
  { label: "3 meses", days: 90 },
  { label: "6 meses", days: 180 },
  { label: "1 año", days: 365 },
];

const INSTRUMENT_COLORS: Record<string, string> = {
  "Plazo Fijo (mejor banco)": "from-blue-600 to-blue-400",
  "CEDEARs (estimado)": "from-violet-600 to-violet-400",
  "Acciones ARG (estimado)": "from-emerald-600 to-emerald-400",
  "Bonos (estimado)": "from-amber-600 to-amber-400",
};

interface Props {
  amount: string;
  days: number;
  onAmountChange: (v: string) => void;
  onDaysChange: (v: number) => void;
}

export function InvestmentSimulator({ amount, days, onAmountChange, onDaysChange }: Props) {
  const results: SimulatorResult[] = useMemo(() => {
    const parsed = parseFloat(amount.replace(/[^\d]/g, ""));
    if (isNaN(parsed) || parsed <= 0) return [];
    return compareInvestments(parsed, days);
  }, [amount, days]);

  const parsedAmount = parseFloat(amount.replace(/[^\d]/g, "")) || 0;
  const maxReturn = results[0]?.estimatedReturn ?? 1;

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="rounded-xl bg-amber-900/20 border border-amber-700/30 px-4 py-3">
        <p className="text-xs text-amber-400/80">
          ⚠️ Los rendimientos de inversiones son <strong>estimaciones basadas en supuestos históricos</strong>,
          no garantías. El plazo fijo es el único con rendimiento asegurado.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Monto a comparar (ARS)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
            <input
              type="text"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value.replace(/[^\d]/g, ""))}
              className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
              placeholder="100000"
            />
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {[100000, 500000, 1000000, 5000000].map((amt) => (
              <button
                key={amt}
                onClick={() => onAmountChange(String(amt))}
                className="text-xs px-2 py-1 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 transition-colors"
              >
                {formatARS(amt)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Período</label>
          <div className="grid grid-cols-4 gap-2">
            {DAY_OPTIONS.map((opt) => (
              <button
                key={opt.days}
                onClick={() => onDaysChange(opt.days)}
                className={`py-3 rounded-xl text-xs font-medium transition-all duration-150 ${
                  days === opt.days
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                    : "bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:border-violet-500/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {results.length > 0 && parsedAmount > 0 && (
          <motion.div
            key={`${amount}-${days}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <p className="text-sm text-slate-400">
              Si invertís <strong className="text-white">{formatARS(parsedAmount)}</strong> durante{" "}
              <strong className="text-white">{DAY_OPTIONS.find((d) => d.days === days)?.label ?? `${days} días`}</strong>:
            </p>

            {results.map((result, i) => {
              const barWidth = (result.estimatedReturn / maxReturn) * 100;
              const gradient = INSTRUMENT_COLORS[result.instrument] ?? "from-slate-600 to-slate-400";

              return (
                <motion.div
                  key={result.instrument}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`rounded-xl border p-4 ${
                    i === 0
                      ? "bg-gradient-to-br from-slate-800/80 to-slate-900 border-slate-600/60"
                      : "bg-slate-900/60 border-slate-800/40"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        {i === 0 && <span className="text-base">🏆</span>}
                        <span className="font-medium text-white text-sm">{result.instrument}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{result.assumption}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold">
                        +{formatARS(result.estimatedReturn)}
                      </p>
                      <p className="text-xs text-slate-500">{formatPct(result.returnPct)}</p>
                    </div>
                  </div>

                  {/* Bar */}
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ delay: i * 0.07 + 0.2, duration: 0.6, ease: "easeOut" }}
                      className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                    />
                  </div>

                  <p className="text-xs text-slate-400 mt-2">
                    Total: <span className="text-white font-medium">{formatARS(result.totalAmount)}</span>
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
