import etfJson from "../../data/etf.json";
import feesJson from "../../data/fees.json";
import type { CostModel } from "./calc";

export type Source = { url: string; retrieved: string; note?: string };

export type Ucits = {
  ticker: string;
  isin: string;
  name: string;
  index: string;
  distribution: string;
  domicile: string;
  ter: number;
  aum: { value: number; currency: string; asOf: string; scope: string } | null;
  source: Source;
  justEtfUrl: string;
  indexNote?: string;
};

export type Fund = {
  ticker: string;
  name: string;
  issuer: string;
  index: string;
  exchange: string;
  exchangeSource: Source;
  ter: number;
  aum: { value: number; currency: string; asOf: string; scope: string };
  returnsNav: { y1: number; y3: number; y5: number; y10: number; asOf: string };
  source: Source;
  ucits: Ucits;
};

export const funds = etfJson.funds as Fund[];
export const snapshotDate = etfJson.snapshotDate;
export const fees = feesJson;
export const bankFund = feesJson.bankFund;

export const bankCost: CostModel = { entryPct: bankFund.entry, ongoingPct: bankFund.ongoing };

export const entryFeeLabel = `max. ${bankFund.entry.toLocaleString("cs-CZ")} % dle KID`;

export function etfCost(ticker: string): CostModel {
  const fund = funds.find((f) => f.ticker === ticker) ?? funds[0];
  return { entryPct: fees.etfSide.brokerCostPerDeposit, ongoingPct: fund.ucits.ter };
}

export function findFund(ticker: string | null | undefined) {
  return funds.find((f) => f.ticker === ticker) ?? funds.find((f) => f.ticker === fees.defaultEtf) ?? funds[0];
}

export const performanceAsOf = funds[0].returnsNav.asOf;

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d}. ${m}. ${y}`;
}

export function formatPct(value: number, digits = 2) {
  return `${value.toLocaleString("cs-CZ", { minimumFractionDigits: digits, maximumFractionDigits: Math.max(digits, 4) })}\u00a0%`;
}

export function formatTer(value: number) {
  const digits = String(value).split(".")[1]?.length ?? 0;
  return formatPct(value, Math.max(2, Math.min(digits, 4)));
}

export function formatUsdShort(value: number) {
  if (value >= 1e12) return `${(value / 1e12).toLocaleString("cs-CZ", { maximumFractionDigits: 2 })} bil. USD`;
  if (value >= 1e9) return `${(value / 1e9).toLocaleString("cs-CZ", { maximumFractionDigits: 1 })} mld. USD`;
  return `${(value / 1e6).toLocaleString("cs-CZ", { maximumFractionDigits: 0 })} mil. USD`;
}
