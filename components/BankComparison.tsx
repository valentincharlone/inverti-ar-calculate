"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { formatARS } from "@/lib/calculations";
import type { Bank } from "@/types";

interface Props {
  banks: Bank[];
  amount: number;
  days: number;
  onClose: () => void;
}

const RATE_PERIODS: { label: string; key: keyof Bank["fixedTermRates"] }[] = [
  { label: "TNA 30 días", key: "days30" },
  { label: "TNA 60 días", key: "days60" },
  { label: "TNA 90 días", key: "days90" },
  { label: "TNA 180 días", key: "days180" },
  { label: "TNA 365 días", key: "days365" },
];

function gain(amount: number, rate: number, days: number) {
  return amount * (rate / 100 / 365) * days;
}

function bestIndex(values: number[], higherIsBetter = true): number {
  let best = 0;
  for (let i = 1; i < values.length; i++) {
    if (higherIsBetter ? values[i] > values[best] : values[i] < values[best]) best = i;
  }
  return best;
}

export function BankComparison({ banks, amount, days, onClose }: Props) {
  const gains = banks.map((b) => {
    const rate =
      days <= 30 ? b.fixedTermRates.days30
      : days <= 60 ? b.fixedTermRates.days60
      : days <= 90 ? b.fixedTermRates.days90
      : days <= 180 ? b.fixedTermRates.days180
      : b.fixedTermRates.days365;
    return { rate, gain: gain(amount, rate, days) };
  });

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
          Comparando {banks.length} {banks.length === 1 ? "banco" : "bancos"}
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
              {banks.map((bank) => (
                <th key={bank.id} className="px-5 py-3 text-center font-semibold text-white">
                  {bank.name}
                  <div className="text-xs font-normal text-slate-500 capitalize">{bank.type}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RATE_PERIODS.map(({ label, key }) => {
              const values = banks.map((b) => b.fixedTermRates[key]);
              const best = bestIndex(values);
              return (
                <tr key={key} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-2.5 text-slate-400 text-xs uppercase tracking-wide font-medium">{label}</td>
                  {values.map((v, i) => (
                    <td key={i} className="px-5 py-2.5 text-center">
                      <span className={i === best ? "font-bold text-blue-400" : "text-slate-300"}>
                        {v}%{i === best && banks.length > 1 && " ★"}
                      </span>
                    </td>
                  ))}
                </tr>
              );
            })}

            <tr className="border-b border-slate-700 bg-slate-800">
              <td colSpan={banks.length + 1} className="px-5 py-2">
                <span className="text-xs text-slate-500 uppercase tracking-wider">
                  Para {formatARS(amount)} a {days} días
                </span>
              </td>
            </tr>

            <tr className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
              <td className="px-5 py-2.5 text-slate-400 text-xs uppercase tracking-wide font-medium">Ganancia</td>
              {gains.map(({ gain: g }, i) => {
                const best = bestIndex(gains.map((x) => x.gain));
                return (
                  <td key={i} className="px-5 py-2.5 text-center">
                    <span className={i === best ? "font-bold text-green-400" : "text-slate-300"}>
                      +{formatARS(g)}{i === best && banks.length > 1 && " ★"}
                    </span>
                  </td>
                );
              })}
            </tr>

            <tr className="hover:bg-slate-800/50 transition-colors">
              <td className="px-5 py-2.5 text-slate-400 text-xs uppercase tracking-wide font-medium">Total a cobrar</td>
              {gains.map(({ gain: g }, i) => {
                const best = bestIndex(gains.map((x) => x.gain));
                return (
                  <td key={i} className="px-5 py-2.5 text-center">
                    <span className={i === best ? "font-semibold text-white" : "text-slate-400"}>
                      {formatARS(amount + g)}
                    </span>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
