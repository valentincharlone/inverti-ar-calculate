import { Landmark, Globe, Shield } from "lucide-react";

export function BestDecisionToday() {
  return (
    <section className="mt-16 rounded border border-slate-800 bg-slate-900 p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
        <h2 className="text-base font-semibold text-white uppercase tracking-wide">Mejor decisión hoy</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <DecisionCard
          icon={<Landmark className="w-4 h-4 text-slate-400" />}
          title="Plazo fijo"
          highlight="Brubank"
          detail="TNA 40% — el mayor del mercado"
          badge="Mejor tasa"
        />
        <DecisionCard
          icon={<Globe className="w-4 h-4 text-slate-400" />}
          title="CEDEARs / Acciones"
          highlight="Cocos Capital"
          detail="Sin comisiones + mejor app del mercado"
          badge="Sin comisión"
        />
        <DecisionCard
          icon={<Shield className="w-4 h-4 text-slate-400" />}
          title="Perfil conservador"
          highlight="Plazo fijo UVA"
          detail="Cubrís inflación + tasa adicional"
          badge="Cobertura inflación"
        />
      </div>

      <p className="text-xs text-slate-600 mt-5">
        * Las recomendaciones se basan en datos de mercado aproximados y no constituyen asesoramiento
        financiero. Consultá un asesor certificado.
      </p>
    </section>
  );
}

function DecisionCard({
  icon,
  title,
  highlight,
  detail,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  highlight: string;
  detail: string;
  badge: string;
}) {
  return (
    <div className="rounded border border-slate-800 bg-slate-800/40 p-4">
      <div className="flex items-start justify-between mb-3">
        <span>{icon}</span>
        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-medium text-slate-400">
          {badge}
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide">{title}</p>
      <p className="font-semibold text-white text-sm">{highlight}</p>
      <p className="text-xs text-slate-400 mt-1">{detail}</p>
    </div>
  );
}
