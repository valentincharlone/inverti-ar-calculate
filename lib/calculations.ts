import type { SimulatorResult } from "@/types";

// Supuestos mockeados (representativos del mercado AR)
const ASSUMPTIONS = {
  "plazo-fijo": {
    annualRate: 40, // TNA %
    period: "30 días",
    label: "Plazo Fijo (mejor banco)",
    assumption: "TNA 40% anual promedio mejor banco",
  },
  cedears: {
    annualReturn: 45, // rendimiento anual estimado en pesos (dolarizado)
    period: "1 año",
    label: "CEDEARs (estimado)",
    assumption: "Rendimiento estimado en pesos incluyendo variación del CCL",
  },
  acciones: {
    annualReturn: 55,
    period: "1 año",
    label: "Acciones ARG (estimado)",
    assumption: "Rendimiento anual estimado en pesos, mercado local",
  },
  bonos: {
    annualReturn: 35,
    period: "1 año",
    label: "Bonos (estimado)",
    assumption: "Rendimiento anual estimado en pesos, bonos en pesos",
  },
};

export function simulateFixedTerm(amount: number, days: number, annualRate: number): SimulatorResult {
  const estimatedReturn = amount * (annualRate / 100 / 365) * days;
  return {
    instrument: "Plazo Fijo",
    amount,
    estimatedReturn,
    totalAmount: amount + estimatedReturn,
    returnPct: (estimatedReturn / amount) * 100,
    period: `${days} días`,
    assumption: `TNA ${annualRate}% anual`,
  };
}

export function compareInvestments(amount: number, days: number): SimulatorResult[] {
  const results: SimulatorResult[] = [];

  // Plazo fijo a 30 días
  const pfReturn = amount * (ASSUMPTIONS["plazo-fijo"].annualRate / 100 / 365) * days;
  results.push({
    instrument: ASSUMPTIONS["plazo-fijo"].label,
    amount,
    estimatedReturn: pfReturn,
    totalAmount: amount + pfReturn,
    returnPct: (pfReturn / amount) * 100,
    period: `${days} días`,
    assumption: ASSUMPTIONS["plazo-fijo"].assumption,
  });

  // CEDEARs (proporcional al período)
  const cedearReturn = amount * (ASSUMPTIONS.cedears.annualReturn / 100 / 365) * days;
  results.push({
    instrument: ASSUMPTIONS.cedears.label,
    amount,
    estimatedReturn: cedearReturn,
    totalAmount: amount + cedearReturn,
    returnPct: (cedearReturn / amount) * 100,
    period: `${days} días`,
    assumption: ASSUMPTIONS.cedears.assumption,
  });

  // Acciones
  const accionesReturn = amount * (ASSUMPTIONS.acciones.annualReturn / 100 / 365) * days;
  results.push({
    instrument: ASSUMPTIONS.acciones.label,
    amount,
    estimatedReturn: accionesReturn,
    totalAmount: amount + accionesReturn,
    returnPct: (accionesReturn / amount) * 100,
    period: `${days} días`,
    assumption: ASSUMPTIONS.acciones.assumption,
  });

  // Bonos
  const bonosReturn = amount * (ASSUMPTIONS.bonos.annualReturn / 100 / 365) * days;
  results.push({
    instrument: ASSUMPTIONS.bonos.label,
    amount,
    estimatedReturn: bonosReturn,
    totalAmount: amount + bonosReturn,
    returnPct: (bonosReturn / amount) * 100,
    period: `${days} días`,
    assumption: ASSUMPTIONS.bonos.assumption,
  });

  return results.sort((a, b) => b.estimatedReturn - a.estimatedReturn);
}

export function formatARS(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPct(value: number): string {
  return `${value.toFixed(2)}%`;
}
