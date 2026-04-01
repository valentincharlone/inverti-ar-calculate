export function BestDecisionToday() {
  return (
    <section className="mt-16 rounded-lg   border border-slate-800/60 bg-linear-to-br from-slate-900 to-slate-950 p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">⚡</span>
        <h2 className="text-xl font-semibold text-white">Mejor decisión hoy</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DecisionCard
          emoji="🏦"
          title="Plazo fijo"
          highlight="Brubank"
          detail="TNA 40% — el mayor del mercado"
          badge="Mejor tasa"
          badgeColor="text-teal-400 bg-teal-900/30 border-teal-700/30"
        />
        <DecisionCard
          emoji="🌎"
          title="CEDEARs / Acciones"
          highlight="Cocos Capital"
          detail="Sin comisiones + mejor app del mercado"
          badge="Sin comisión"
          badgeColor="text-emerald-400 bg-emerald-900/30 border-emerald-700/30"
        />
        <DecisionCard
          emoji="📊"
          title="Perfil conservador"
          highlight="Plazo fijo UVA"
          detail="Cubrís inflación + tasa adicional"
          badge="Cobertura inflación"
          badgeColor="text-violet-400 bg-violet-900/30 border-violet-700/30"
        />
      </div>

      <p className="text-xs text-slate-600 mt-5">
        * Las recomendaciones se basan en datos de mercado aproximados y no
        constituyen asesoramiento financiero. Consultá un asesor certificado.
      </p>
    </section>
  );
}

function DecisionCard({
  emoji,
  title,
  highlight,
  detail,
  badge,
  badgeColor,
}: {
  emoji: string;
  title: string;
  highlight: string;
  detail: string;
  badge: string;
  badgeColor: string;
}) {
  return (
    <div className="rounded-xl bg-slate-800/30 border border-slate-700/30 p-4">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xl">{emoji}</span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${badgeColor}`}
        >
          {badge}
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-1">{title}</p>
      <p className="font-semibold text-white text-base">{highlight}</p>
      <p className="text-xs text-slate-400 mt-1">{detail}</p>
    </div>
  );
}
