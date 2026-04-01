"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import type { BrokerRanking } from "@/types";

interface Props {
  rankings: BrokerRanking[];
  instrument: string;
}

export function RecommendationBox({ rankings, instrument }: Props) {
  const best = rankings[0];
  const bestForBeginners = rankings.find((r) => r.broker.level === "principiante");
  const bestCommission = [...rankings].sort((a, b) => a.commission - b.commission)[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-amber-500/30 bg-linear-to-br from-amber-900/20 to-slate-900 p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-amber-400" />
        </div>
        <h3 className="font-semibold text-white">Recomendación automática</h3>
      </div>

      <div className="space-y-3">
        <RecommendationRow
          emoji="🏆"
          title="Mejor opción general"
          broker={best.broker.name}
          reason={`Score combinado más alto para ${instrument}`}
          color="text-emerald-400"
        />
        {bestForBeginners && bestForBeginners.broker.id !== best.broker.id && (
          <RecommendationRow
            emoji="🎓"
            title="Si sos principiante"
            broker={bestForBeginners.broker.name}
            reason={`UX Score ${bestForBeginners.broker.uxScore}/10 — la más fácil de usar`}
            color="text-violet-400"
          />
        )}
        {bestCommission.broker.id !== best.broker.id && (
          <RecommendationRow
            emoji="💰"
            title="Si operás frecuentemente"
            broker={bestCommission.broker.name}
            reason={`Comisión ${bestCommission.commission === 0 ? "cero" : `${bestCommission.commission}%`} — ahorrás más en volumen`}
            color="text-blue-400"
          />
        )}
      </div>
    </motion.div>
  );
}

function RecommendationRow({
  emoji,
  title,
  broker,
  reason,
  color,
}: {
  emoji: string;
  title: string;
  broker: string;
  reason: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-slate-800/40 rounded-xl p-3">
      <span className="text-lg">{emoji}</span>
      <div>
        <p className="text-xs text-slate-400 mb-0.5">{title}</p>
        <p className={`font-semibold text-sm ${color}`}>{broker}</p>
        <p className="text-xs text-slate-500 mt-0.5">{reason}</p>
      </div>
    </div>
  );
}
