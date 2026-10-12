import { sanitize } from "./calc";

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
  const etf = TICKERS.includes(String(raw.etf)) ? String(raw.etf) : "IVV";
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
      difference: Math.round(Number(raw.difference) || 0),
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
