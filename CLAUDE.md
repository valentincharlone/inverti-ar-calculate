# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Development server (localhost:3000)
npm run build    # Production build
npm run start    # Production server (run after build)
```

No lint or test scripts are configured.

## Architecture

**inverti.ar** is a Next.js App Router application (client-side only — all components use `"use client"`) for comparing Argentine investment options: plazo fijo (fixed-term deposits) and broker rankings for CEDEARs, acciones, and bonos.

### Data flow

Static mock data in `data/` → ranking/calculation logic in `lib/` → components in `components/` → rendered in `app/page.tsx`.

- `data/banks.ts` — 8 Argentine banks with TNA rates per maturity period
- `data/brokers.ts` — 6 brokers with commissions, UX scores, and pros/cons
- `lib/calculations.ts` — Financial formulas: `simulateFixedTerm`, `compareInvestments`, `formatARS`, `formatPct`
- `lib/ranking.ts` — Scoring algorithms: `rankBanks`, `rankBrokers`, `getRecommendation`; broker score = 60% commission + 40% UX

### Main page logic (`app/page.tsx`)

1. User selects `InstrumentType` via `InstrumentSelector` (`"plazo-fijo" | "cedears" | "acciones" | "bonos"`)
2. If `plazo-fijo`: shows `FixedTermSimulator` and `InvestmentSimulator` in tabs
3. Otherwise: shows `RankingList` with broker cards and a `RecommendationBox`

### Key types (`types/index.ts`)

`Broker`, `Bank`, `BrokerRanking`, `BankRanking`, `BadgeType`, `SimulatorResult`, `InstrumentType` — all domain types live here.

### Styling

Tailwind CSS v4 (configured via `@tailwindcss/postcss`, not the classic `tailwind.config.js` approach). Dark theme with slate-950 background. Animations via Framer Motion.

### No backend

No API routes, no database, no environment variables. All data is static.
