import type { Broker, Bank, BrokerRanking, BankRanking, BadgeType } from "@/types";

// ─── Broker Ranking ───────────────────────────────────────────────────────────

function calcBrokerScore(
  broker: Broker,
  instrument: "cedears" | "acciones" | "bonos"
): number {
  const data = broker.instruments[instrument];
  if (!data) return 0;

  // Pesos: menor comisión = mejor score, UX también pesa
  const commissionScore = Math.max(0, 10 - data.commission * 15); // 0% → 10pts, 0.6% → 1pt
  const uxScore = broker.uxScore; // ya viene en escala 1-10
  return commissionScore * 0.6 + uxScore * 0.4;
}

export function rankBrokers(
  brokers: Broker[],
  instrument: "cedears" | "acciones" | "bonos"
): BrokerRanking[] {
  const eligible = brokers.filter((b) => b.instruments[instrument] != null);

  const ranked = eligible
    .map((broker) => {
      const commission = broker.instruments[instrument]!.commission;
      const score = calcBrokerScore(broker, instrument);
      return { broker, instrument, score, commission, rank: 0, badges: [] as BadgeType[] };
    })
    .sort((a, b) => b.score - a.score)
    .map((item, i) => ({ ...item, rank: i + 1 }));

  // Asignar badges
  const minCommission = Math.min(...ranked.map((r) => r.commission));
  const maxUX = Math.max(...ranked.map((r) => r.broker.uxScore));

  return ranked.map((item) => {
    const badges: BadgeType[] = [];
    if (item.rank === 1) badges.push("mejor-opcion");
    if (item.commission === minCommission) badges.push("menor-comision");
    if (item.broker.uxScore === maxUX) badges.push("mejor-ux");
    if (item.broker.level === "principiante") badges.push("principiantes");
    if (item.commission <= 0.35 && item.broker.uxScore < 8) badges.push("traders");
    return { ...item, badges };
  });
}

// ─── Bank Ranking ─────────────────────────────────────────────────────────────

function getClosestRateDays(bank: Bank, days: number): number {
  const rates = bank.fixedTermRates;
  if (days <= 30) return rates.days30;
  if (days <= 60) return rates.days60;
  if (days <= 90) return rates.days90;
  if (days <= 180) return rates.days180;
  return rates.days365;
}

export function rankBanks(banks: Bank[], amount: number, days: number): BankRanking[] {
  const ranked = banks
    .map((bank) => {
      const annualRate = getClosestRateDays(bank, days);
      // Fórmula: ganancia = capital * (tasa_anual / 365) * días
      const estimatedGain = amount * (annualRate / 100 / 365) * days;
      const totalAmount = amount + estimatedGain;
      return {
        bank,
        days,
        amount,
        rate: annualRate,
        estimatedGain,
        totalAmount,
        rank: 0,
        badges: [] as BadgeType[],
      };
    })
    .sort((a, b) => b.rate - a.rate)
    .map((item, i) => ({ ...item, rank: i + 1 }));

  const maxRate = Math.max(...ranked.map((r) => r.rate));

  return ranked.map((item) => {
    const badges: BadgeType[] = [];
    if (item.rank === 1) badges.push("mejor-opcion");
    if (item.rate === maxRate) badges.push("mejor-tasa");
    return { ...item, badges };
  });
}

// ─── Recommendation Logic ─────────────────────────────────────────────────────

export function getRecommendation(
  rankings: BrokerRanking[],
  profile: "principiante" | "trader" | "general"
): BrokerRanking {
  if (profile === "principiante") {
    const forBeginners = rankings
      .filter((r) => r.broker.level === "principiante")
      .sort((a, b) => b.broker.uxScore - a.broker.uxScore);
    return forBeginners[0] ?? rankings[0];
  }
  if (profile === "trader") {
    return rankings.sort((a, b) => a.commission - b.commission)[0];
  }
  return rankings[0];
}
