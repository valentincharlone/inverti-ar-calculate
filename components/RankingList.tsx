"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { BrokerCard } from "./BrokerCard";
import { BrokerComparison } from "./BrokerComparison";
import { RecommendationBox } from "./RecommendationBox";
import { rankBrokers } from "@/lib/ranking";
import { brokers } from "@/data/brokers";
import type { BrokerRanking } from "@/types";

interface Props {
  instrument: "cedears" | "acciones" | "bonos";
}

const INSTRUMENT_LABELS: Record<string, string> = {
  cedears: "CEDEARs",
  acciones: "Acciones",
  bonos: "Bonos",
};

type LevelFilter = "todos" | "principiante" | "intermedio" | "avanzado";
type SortOrder = "score" | "comision" | "ux";

const LEVEL_OPTIONS: { value: LevelFilter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "principiante", label: "Principiante" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
];

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "score", label: "Mejor score" },
  { value: "comision", label: "Menor comisión" },
  { value: "ux", label: "Mejor UX" },
];

export function RankingList({ instrument }: Props) {
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("todos");
  const [sortOrder, setSortOrder] = useState<SortOrder>("score");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleBroker = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const allRankings: BrokerRanking[] = useMemo(
    () => rankBrokers(brokers, instrument),
    [instrument]
  );

  const filtered: BrokerRanking[] = useMemo(() => {
    let result = allRankings;

    if (levelFilter !== "todos") {
      result = result.filter((r) => r.broker.level === levelFilter);
    }

    if (sortOrder === "comision") {
      result = [...result].sort((a, b) => a.commission - b.commission);
    } else if (sortOrder === "ux") {
      result = [...result].sort((a, b) => b.broker.uxScore - a.broker.uxScore);
    }

    return result;
  }, [allRankings, levelFilter, sortOrder]);

  const isFiltered = levelFilter !== "todos" || sortOrder !== "score";

  return (
    <div className="space-y-5">
      <RecommendationBox rankings={allRankings} instrument={INSTRUMENT_LABELS[instrument]} />

      <div>
        {/* Header + filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-medium text-slate-400">
              Ranking — {INSTRUMENT_LABELS[instrument]}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2 sm:ml-auto">
            {/* Level filter */}
            <div className="flex gap-px bg-slate-800 border border-slate-700 rounded overflow-hidden">
              {LEVEL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setLevelFilter(opt.value)}
                  className={`px-2.5 py-1.5 text-xs font-medium transition-colors duration-100 ${
                    levelFilter === opt.value
                      ? "bg-slate-600 text-white"
                      : "text-slate-500 hover:text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Sort order */}
            <div className="flex gap-px bg-slate-800 border border-slate-700 rounded overflow-hidden">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortOrder(opt.value)}
                  className={`px-2.5 py-1.5 text-xs font-medium transition-colors duration-100 ${
                    sortOrder === opt.value
                      ? "bg-slate-600 text-white"
                      : "text-slate-500 hover:text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-600">
            {filtered.length} de {allRankings.length} brokers
            {isFiltered && (
              <button
                onClick={() => { setLevelFilter("todos"); setSortOrder("score"); }}
                className="ml-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </span>
        </div>

        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              key={`${levelFilter}-${sortOrder}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
            >
              {filtered.map((ranking, i) => (
                <BrokerCard
                  key={ranking.broker.id}
                  ranking={ranking}
                  index={i}
                  isSelected={selectedIds.includes(ranking.broker.id)}
                  onToggle={() => toggleBroker(ranking.broker.id)}
                  canSelect={selectedIds.length < 3 || selectedIds.includes(ranking.broker.id)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 rounded border border-slate-800 bg-slate-900"
            >
              <p className="text-slate-500 text-sm">
                Ningún broker coincide con los filtros seleccionados.
              </p>
              <button
                onClick={() => { setLevelFilter("todos"); setSortOrder("score"); }}
                className="mt-3 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Limpiar filtros
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compare panel */}
        <AnimatePresence>
          {selectedIds.length >= 1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-4"
            >
              {selectedIds.length === 1 ? (
                <p className="text-center text-xs text-slate-500 py-3">
                  Seleccioná otro broker para comparar
                </p>
              ) : (
                <BrokerComparison
                  rankings={allRankings.filter((r) => selectedIds.includes(r.broker.id))}
                  instrument={instrument}
                  onClose={() => setSelectedIds([])}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
