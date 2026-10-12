import { compare, sanitize } from "./calc";
import { bankCost, etfCost, fees } from "./data";

export type LeadPayload = {
  email: string;
  consent: boolean;
  marketing: boolean;
  honeypot: string;
  variant: "a" | "b";
  location: string;
  etf: string;
  initial: number;
  monthly: number;
  years: number;
  difference: number;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TICKERS = ["VOO", "SPY", "IVV", "VT", "VWO"];

export function parseLead(raw: Record<string, unknown>): { ok: true; lead: LeadPayload } | { ok: false; error: string } {
  const email = String(raw.email ?? "").trim().toLowerCase().slice(0, 254);
  if (!EMAIL_RE.test(email)) return { ok: false, error: "email_invalid" };
  const consent = raw.consent === true || raw.consent === "on";
  if (!consent) return { ok: false, error: "consent_missing" };
  const input = sanitize({ initial: Number(raw.initial), monthly: Number(raw.monthly), years: Number(raw.years) });
  const etf = TICKERS.includes(String(raw.etf)) ? String(raw.etf) : fees.defaultEtf;
  return {
    ok: true,
    lead: {
      email,
      consent,
      marketing: raw.marketing === true || raw.marketing === "on",
      honeypot: String(raw.company ?? ""),
      variant: raw.variant === "b" ? "b" : "a",
      location: String(raw.location ?? "unknown").slice(0, 32),
      etf,
      initial: input.initial,
      monthly: input.monthly,
      years: input.years,
      difference: compare(input, bankCost, etfCost(etf)).difference,
    },
  };
}

export function overviewPath(lead: Pick<LeadPayload, "initial" | "monthly" | "years" | "etf">) {
  const q = new URLSearchParams({
    v: String(lead.initial),
    m: String(lead.monthly),
    r: String(lead.years),
    etf: lead.etf,
  });
  return `/prehled?${q.toString()}`;
}

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export function pickUtm(params: URLSearchParams) {
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value.slice(0, 60);
  }
  return utm;
}

function refererParams(referer: string | null) {
  if (!referer || !URL.canParse(referer)) return new URLSearchParams();
  return new URL(referer).searchParams;
}

export function submittedPath(lead: Pick<LeadPayload, "initial" | "monthly" | "years" | "etf" | "variant" | "location">, referer: string | null) {
  const q = new URLSearchParams(overviewPath(lead).split("?")[1]);
  q.set("odeslano", "1");
  q.set("variant", lead.variant);
  q.set("location", lead.location);
  for (const [key, value] of Object.entries(pickUtm(refererParams(referer)))) q.set(key, value);
  return `/prehled?${q.toString()}`;
}
