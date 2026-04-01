import { TrendingUp } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-600 flex items-center justify-center rounded">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-base tracking-tight">inverti.ar</span>
          <span className="hidden sm:inline text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-medium">
            Beta
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Datos actualizados al 31/03/2025
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
        </div>
      </div>
    </header>
  );
}
