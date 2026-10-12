export type CostModel = {
  entryPct: number;
  ongoingPct: number;
};

export type CalcInput = {
  initial: number;
  monthly: number;
  years: number;
  grossReturnPct: number;
};

export type YearPoint = {
  year: number;
  invested: number;
  bank: number;
  etf: number;
};

export type CalcResult = {
  points: YearPoint[];
  invested: number;
  bank: number;
  etf: number;
  difference: number;
};

export const LIMITS = {
  initial: { min: 0, max: 5_000_000, step: 10_000 },
  monthly: { min: 0, max: 50_000, step: 500 },
  years: { min: 1, max: 40, step: 1 },
} as const;

export const DEFAULT_INPUT: CalcInput = {
  initial: 100_000,
  monthly: 3_000,
  years: 20,
  grossReturnPct: 6,
};

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function sanitize(input: Partial<CalcInput>): CalcInput {
  return {
    initial: Math.round(clamp(input.initial ?? DEFAULT_INPUT.initial, LIMITS.initial.min, LIMITS.initial.max)),
    monthly: Math.round(clamp(input.monthly ?? DEFAULT_INPUT.monthly, LIMITS.monthly.min, LIMITS.monthly.max)),
    years: Math.round(clamp(input.years ?? DEFAULT_INPUT.years, LIMITS.years.min, LIMITS.years.max)),
    grossReturnPct: clamp(input.grossReturnPct ?? DEFAULT_INPUT.grossReturnPct, -10, 20),
  };
}

function grow(input: CalcInput, cost: CostModel) {
  const monthlyGrowth = Math.pow(1 + input.grossReturnPct / 100, 1 / 12);
  const monthlyCost = Math.pow(1 - cost.ongoingPct / 100, 1 / 12);
  const net = 1 - cost.entryPct / 100;
  let value = input.initial * net;
  const yearly = [value];
  for (let month = 1; month <= input.years * 12; month++) {
    value = value * monthlyGrowth * monthlyCost + input.monthly * net;
    if (month % 12 === 0) yearly.push(value);
  }
  return yearly;
}

export function compare(raw: Partial<CalcInput>, bank: CostModel, etf: CostModel): CalcResult {
  const input = sanitize(raw);
  const bankSeries = grow(input, bank);
  const etfSeries = grow(input, etf);
  const points = bankSeries.map((b, year) => ({
    year,
    invested: input.initial + input.monthly * 12 * year,
    bank: Math.round(b),
    etf: Math.round(etfSeries[year]),
  }));
  const last = points[points.length - 1];
  return {
    points,
    invested: last.invested,
    bank: last.bank,
    etf: last.etf,
    difference: last.etf - last.bank,
  };
}

const czk = new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 });

export function formatCzk(value: number) {
  return `${czk.format(Math.round(value))}\u00a0Kč`;
}

export function roundForDisplay(value: number) {
  if (value >= 100_000) return Math.round(value / 1_000) * 1_000;
  return Math.round(value / 100) * 100;
}
