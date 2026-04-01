"use client";

import { motion } from "framer-motion";
import { Info, Trophy, GraduationCap, Percent } from "lucide-react";
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded border border-slate-700 bg-slate-900 p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-4 h-4 text-slate-400" />
        <h3 className="font-semibold text-white text-sm">Recomendación automática</h3>
      </div>

      <div className="space-y-2">
        <RecommendationRow
          icon={<Trophy className="w-4 h-4 text-slate-400" />}
          title="Mejor opción general"
          broker={best.broker.name}
          reason={`Score combinado más alto para ${instrument}`}
        />
        {bestForBeginners && bestForBeginners.broker.id !== best.broker.id && (
          <RecommendationRow
            icon={<GraduationCap className="w-4 h-4 text-slate-400" />}
            title="Si sos principiante"
            broker={bestForBeginners.broker.name}
            reason={`UX Score ${bestForBeginners.broker.uxScore}/10 — la más fácil de usar`}
          />
        )}
        {bestCommission.broker.id !== best.broker.id && (
          <RecommendationRow
            icon={<Percent className="w-4 h-4 text-slate-400" />}
            title="Si operás frecuentemente"
            broker={bestCommission.broker.name}
            reason={`Comisión ${bestCommission.commission === 0 ? "cero" : `${bestCommission.commission}%`} — ahorrás más en volumen`}
          />
        )}
      </div>
    </motion.div>
  );
}

function RecommendationRow({
  icon,
  title,
  broker,
  reason,
}: {
  icon: React.ReactNode;
  title: string;
  broker: string;
  reason: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-slate-800 border border-slate-700 rounded px-4 py-3">
      <span className="shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-slate-400 mb-0.5">{title}</p>
        <p className="font-semibold text-sm text-white">{broker}</p>
        <p className="text-xs text-slate-500 mt-0.5">{reason}</p>
      </div>
    </div>
  );
}
