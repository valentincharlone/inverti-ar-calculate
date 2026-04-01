"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Check } from "lucide-react";
import { InstrumentSelector } from "@/components/InstrumentSelector";
import { RankingList } from "@/components/RankingList";
import { FixedTermSimulator } from "@/components/FixedTermSimulator";
import { InvestmentSimulator } from "@/components/InvestmentSimulator";
import type { InstrumentType } from "@/types";

const SECTION_LABELS: Record<InstrumentType, string> = {
  "plazo-fijo": "Plazo Fijo — Comparador de bancos",
  cedears: "CEDEARs — Ranking de brokers",
  acciones: "Acciones — Ranking de brokers",
  bonos: "Bonos — Ranking de brokers",
  letras: "Letras del Tesoro — LECAPs y LECERs",
  on: "Obligaciones Negociables — Deuda corporativa",
};

export function HomeClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const selected = (searchParams.get("i") as InstrumentType) || null;
  const activeTab = (searchParams.get("tab") as "ranking" | "simulator") || "ranking";
  const amount = searchParams.get("amount") || "100000";
  const days = parseInt(searchParams.get("days") || "30", 10);

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) params.delete(key);
      else params.set(key, value);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const setSelected = (instrument: InstrumentType | null) => {
    updateParams({ i: instrument, tab: null });
  };

  const setActiveTab = (tab: "ranking" | "simulator") => {
    updateParams({ tab });
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-12 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Datos de mercado argentino
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
            ¿Dónde invertís hoy?
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Compará bancos y brokers en segundos. Encontrá la mejor opción según el instrumento que
            elijas.
          </p>
        </motion.div>
      </section>

      {/* Selector */}
      <section className="mb-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm font-medium text-slate-400 mb-4 text-center"
        >
          ¿Qué querés hacer?
        </motion.p>
        <InstrumentSelector selected={selected} onChange={setSelected} />
      </section>

      {/* Dynamic Content */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.section
            key={selected}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">{SECTION_LABELS[selected]}</h2>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600/50 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    Compartir
                  </>
                )}
              </button>
            </div>

            {/* Tab switcher for plazo fijo */}
            {selected === "plazo-fijo" && (
              <div className="flex gap-2 mb-6 bg-slate-900/60 rounded-md p-1 border border-slate-800/60 w-fit">
                {(["ranking", "simulator"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                      activeTab === tab
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tab === "ranking" ? "Comparar bancos" : "Simular ganancia"}
                  </button>
                ))}
              </div>
            )}

            {/* Content panels */}
            {selected === "plazo-fijo" ? (
              <div className="rounded-lg border border-slate-800/60 bg-slate-900/40 p-6">
                <AnimatePresence mode="wait">
                  {activeTab === "ranking" ? (
                    <motion.div
                      key="ranking"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <FixedTermSimulator
                        amount={amount}
                        days={days}
                        onAmountChange={(v) => updateParams({ amount: v })}
                        onDaysChange={(v) => updateParams({ days: String(v) })}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="simulator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <InvestmentSimulator
                        amount={amount}
                        days={days}
                        onAmountChange={(v) => updateParams({ amount: v })}
                        onDaysChange={(v) => updateParams({ days: String(v) })}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <RankingList instrument={selected as "cedears" | "acciones" | "bonos" | "on" | "letras"} />
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-16"
        >
          <div className="text-5xl mb-4">👆</div>
          <p className="text-slate-500 text-base">
            Seleccioná un instrumento arriba para ver las mejores opciones
          </p>
        </motion.div>
      )}
    </>
  );
}
