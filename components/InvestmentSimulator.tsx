"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { compareInvestments, formatARS, formatPct } from "@/lib/calculations";
import type { SimulatorResult } from "@/types";

const DAY_OPTIONS = [
  { label: "1 mes", days: 30 },
  { label: "3 meses", days: 90 },
  { label: "6 meses", days: 180 },
  { label: "1 año", days: 365 },
];

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
      <div className="rounded border border-slate-700 bg-slate-800 px-4 py-3 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400">
          Los rendimientos de inversiones son <strong className="text-slate-300">estimaciones basadas en supuestos históricos</strong>,
          no garantías. El plazo fijo es el único con rendimiento asegurado.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">
            Monto a comparar (ARS)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
            <input
              type="text"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value.replace(/[^\d]/g, ""))}
              className="w-full bg-slate-800 border border-slate-700 rounded pl-7 pr-4 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="100000"
            />
          </div>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {[100000, 500000, 1000000, 5000000].map((amt) => (
              <button
                key={amt}
                onClick={() => onAmountChange(String(amt))}
                className="text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors"
              >
                {formatARS(amt)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Período</label>
          <div className="grid grid-cols-4 gap-1.5">
            {DAY_OPTIONS.map((opt) => (
              <button
                key={opt.days}
                onClick={() => onDaysChange(opt.days)}
                className={`py-2.5 rounded text-xs font-medium transition-colors duration-100 border ${
                  days === opt.days
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
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
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <p className="text-sm text-slate-400 mb-3">
              Si invertís <strong className="text-white">{formatARS(parsedAmount)}</strong> durante{" "}
              <strong className="text-white">{DAY_OPTIONS.find((d) => d.days === days)?.label ?? `${days} días`}</strong>:
            </p>

            {results.map((result, i) => {
              const barWidth = (result.estimatedReturn / maxReturn) * 100;

              return (
                <motion.div
                  key={result.instrument}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`rounded border p-4 ${
                    i === 0
                      ? "bg-slate-900 border-slate-600"
                      : "bg-slate-900 border-slate-800"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        {i === 0 && (
                          <span className="text-xs font-medium text-blue-400 uppercase tracking-wide">Mayor retorno</span>
                        )}
                        <span className="font-medium text-white text-sm">{result.instrument}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{result.assumption}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold tabular-nums">
                        +{formatARS(result.estimatedReturn)}
                      </p>
                      <p className="text-xs text-slate-500">{formatPct(result.returnPct)}</p>
                    </div>
                  </div>

                  {/* Bar */}
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ delay: i * 0.06 + 0.2, duration: 0.5, ease: "easeOut" }}
                      className="h-full rounded-full bg-blue-500"
                    />
                  </div>

                  <p className="text-xs text-slate-500 mt-2 tabular-nums">
                    Total: <span className="text-slate-300 font-medium">{formatARS(result.totalAmount)}</span>
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
