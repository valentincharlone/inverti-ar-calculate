export type InstrumentType = "plazo-fijo" | "cedears" | "acciones" | "bonos" | "letras" | "on";

export type Broker = {
  id: string;
  name: string;
  logo?: string;
  instruments: {
    cedears?: { commission: number; minAmount?: number };
    acciones?: { commission: number; minAmount?: number };
    bonos?: { commission: number; minAmount?: number };
    on?: { commission: number; minAmount?: number };
    letras?: { commission: number; minAmount?: number };
  };
  uxScore: number; // 1-10
  pros: string[];
  cons: string[];
  website: string;
  type: "broker" | "bank";
  level: "principiante" | "intermedio" | "avanzado";
};

export type Bank = {
  id: string;
  name: string;
  logo?: string;
  fixedTermRates: {
    days30: number;
    days60: number;
    days90: number;
    days180: number;
    days365: number;
  };
  type: "publico" | "privado";
  pros: string[];
  cons: string[];
};

export type BrokerRanking = {
  broker: Broker;
  instrument: "cedears" | "acciones" | "bonos" | "on" | "letras";
  score: number;
  commission: number;
  badges: BadgeType[];
  rank: number;
};

export type BankRanking = {
  bank: Bank;
  days: number;
  amount: number;
  rate: number;
  estimatedGain: number;
  totalAmount: number;
  rank: number;
  badges: BadgeType[];
};

export type BadgeType =
  | "mejor-opcion"
  | "menor-comision"
  | "mejor-ux"
  | "principiantes"
  | "traders"
  | "mejor-tasa";

export type SimulatorResult = {
  instrument: string;
  amount: number;
  estimatedReturn: number;
  totalAmount: number;
  returnPct: number;
  period: string;
  assumption: string;
};
