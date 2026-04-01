"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Award, TrendingDown, Plus, Check } from "lucide-react";
import { Badge } from "./Badge";
import { BankComparison } from "./BankComparison";
import { rankBanks } from "@/lib/ranking";
import { formatARS } from "@/lib/calculations";
import { banks } from "@/data/banks";
import type { Bank, BankRanking } from "@/types";

const DAY_OPTIONS = [30, 60, 90, 180, 365];

interface Props {
  amount: string;
  days: number;
  onAmountChange: (v: string) => void;
  onDaysChange: (v: number) => void;
}

function calcRealGain(amount: number, annualRate: number, days: number, annualInflation: number): number {
  const nominalFactor = 1 + (annualRate / 100 / 365) * days;
  const inflationFactor = Math.pow(1 + annualInflation / 100, days / 365);
  return amount * (nominalFactor / inflationFactor - 1);
}

export function FixedTermSimulator({ amount, days, onAmountChange, onDaysChange }: Props) {
  const [showInflation, setShowInflation] = useState(false);
  const [inflationRate, setInflationRate] = useState("50");
  const [selectedBankIds, setSelectedBankIds] = useState<string[]>([]);

  const toggleBank = (id: string) => {
    setSelectedBankIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const parsedInflation = parseFloat(inflationRate) || 0;

  const rankings: BankRanking[] = useMemo(() => {
    const parsed = parseFloat(amount.replace(/\./g, "").replace(",", "."));
    if (isNaN(parsed) || parsed <= 0) return [];
    return rankBanks(banks, parsed, days);
  }, [amount, days]);

  const parsedAmount = parseFloat(amount.replace(/\./g, "").replace(",", ".")) || 0;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Monto a invertir (ARS)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
              $
            </span>
            <input
              type="text"
              value={amount}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d]/g, "");
                onAmountChange(raw);
              }}
              className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="100000"
            />
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {[50000, 100000, 500000, 1000000].map((amt) => (
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
          <label className="block text-sm font-medium text-slate-300 mb-2">Plazo</label>
          <div className="grid grid-cols-5 gap-2">
            {DAY_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => onDaysChange(d)}
                className={`py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  days === d
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:border-blue-500/40"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inflation toggle */}
      <div className="rounded-xl border border-slate-700/40 bg-slate-800/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInflation((v) => !v)}
              className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
                showInflation ? "bg-violet-600" : "bg-slate-700"
              }`}
              aria-label="Ajustar por inflación"
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                  showInflation ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className="text-sm font-medium text-slate-300">Ajustar por inflación</span>
          </div>

          <AnimatePresence>
            {showInflation && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center gap-2 overflow-hidden"
              >
                <span className="text-xs text-slate-500 whitespace-nowrap">Inflación anual estimada</span>
                <div className="relative w-20">
                  <input
                    type="text"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(e.target.value.replace(/[^\d.]/g, ""))}
                    className="w-full bg-slate-700/60 border border-slate-600/50 rounded-lg px-2 py-1 pr-6 text-white text-sm text-right focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {showInflation && (
          <p className="text-xs text-slate-500 mt-2">
            Muestra cuánto ganás <strong className="text-slate-400">por encima de la inflación</strong>. Si es negativo, el plazo fijo no alcanza a cubrir la suba de precios.
          </p>
        )}
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {rankings.length > 0 && parsedAmount > 0 && (
          <motion.div
            key={`${amount}-${days}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-400">
                Ranking de bancos — {days} días
              </h3>
              <span className="text-xs text-slate-500">
                {formatARS(parsedAmount)} invertidos
              </span>
            </div>

            {rankings.map((ranking, i) => (
              <BankRow
                key={ranking.bank.id}
                ranking={ranking}
                index={i}
                showInflation={showInflation}
                inflationRate={parsedInflation}
                isSelected={selectedBankIds.includes(ranking.bank.id)}
                onToggle={() => toggleBank(ranking.bank.id)}
                canSelect={selectedBankIds.length < 3 || selectedBankIds.includes(ranking.bank.id)}
              />
            ))}

            {/* Compare panel */}
            <AnimatePresence>
              {selectedBankIds.length >= 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden pt-2"
                >
                  {selectedBankIds.length === 1 ? (
                    <p className="text-center text-xs text-slate-500 py-3">
                      Seleccioná otro banco para comparar
                    </p>
                  ) : (
                    <BankComparison
                      banks={banks.filter((b) => selectedBankIds.includes(b.id)) as Bank[]}
                      amount={parsedAmount}
                      days={days}
                      onClose={() => setSelectedBankIds([])}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BankRow({
  ranking,
  index,
  showInflation,
  inflationRate,
  isSelected,
  onToggle,
  canSelect,
}: {
  ranking: BankRanking;
  index: number;
  showInflation: boolean;
  inflationRate: number;
  isSelected: boolean;
  onToggle: () => void;
  canSelect: boolean;
}) {
  const { bank, rate, estimatedGain, totalAmount, rank, badges, amount, days } = ranking;
  const isFirst = rank === 1;

  const realGain = showInflation ? calcRealGain(amount, rate, days, inflationRate) : null;
  const beatsInflation = realGain !== null && realGain >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-xl border px-4 py-3.5 transition-all ${
        isFirst
          ? "bg-gradient-to-r from-teal-900/30 to-slate-900 border-teal-500/40"
          : "bg-slate-800/40 border-slate-700/30"
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Rank */}
        <div className="w-8 text-center shrink-0">
          {isFirst ? (
            <Award className="w-5 h-5 text-teal-400 mx-auto" />
          ) : (
            <span className="text-slate-500 text-sm font-medium">#{rank}</span>
          )}
        </div>

        {/* Bank name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-white text-sm">{bank.name}</span>
            {badges.map((b) => (
              <Badge key={b} type={b} />
            ))}
          </div>
          <span className="text-xs text-slate-500 capitalize">{bank.type}</span>
        </div>

        {/* Rate */}
        <div className="text-center shrink-0">
          <div className="flex items-center gap-1">
            <TrendingUp className={`w-3 h-3 ${isFirst ? "text-teal-400" : "text-slate-400"}`} />
            <span className={`font-bold text-base ${isFirst ? "text-teal-400" : "text-slate-200"}`}>
              {rate}%
            </span>
          </div>
          <span className="text-xs text-slate-500">TNA</span>
        </div>

        {/* Nominal gain */}
        <div className="text-right shrink-0">
          <p className="text-emerald-400 font-semibold text-sm">+{formatARS(estimatedGain)}</p>
          <p className="text-xs text-slate-500">{formatARS(totalAmount)} total</p>
        </div>

        {/* Select button */}
        <button
          onClick={onToggle}
          disabled={!canSelect}
          title={isSelected ? "Quitar de comparación" : "Agregar a comparación"}
          className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-150 ${
            isSelected
              ? "bg-blue-600 border-blue-500 text-white"
              : canSelect
              ? "border-slate-600 text-slate-500 hover:border-blue-400 hover:text-blue-400"
              : "border-slate-800 text-slate-700 cursor-not-allowed"
          }`}
        >
          {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Real gain row */}
      <AnimatePresence>
        {showInflation && realGain !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-slate-700/40 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {beatsInflation ? (
                  <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span className="text-xs text-slate-400">Ganancia real (vs inflación {inflationRate}%)</span>
              </div>
              <div className="text-right">
                <span className={`text-sm font-semibold ${beatsInflation ? "text-violet-400" : "text-rose-400"}`}>
                  {beatsInflation ? "+" : ""}{formatARS(realGain)}
                </span>
                {!beatsInflation && (
                  <p className="text-xs text-rose-500/70">No cubre inflación</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
