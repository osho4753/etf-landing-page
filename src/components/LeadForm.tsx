"use client";

import { useId, useState } from "react";
import { track } from "@/lib/track";
import { useLead } from "./LeadProvider";

type Status = "idle" | "sending" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function LeadForm({ location, compact = false }: { location: string; compact?: boolean }) {
  const { variant, input, etf, result, lead, setLead } = useLead();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const id = useId();

  if (lead) {
    return (
      <div className="rounded-2xl bg-mint-soft p-4 text-sm">
        <p className="font-semibold">Hotovo – váš osobní přehled je připravený.</p>
        <a href="#prehled" className="mt-1 inline-block font-semibold text-pine underline">
          Zobrazit přehled a PDF ↓
        </a>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const consent = form.get("consent") === "on";
    if (!EMAIL_RE.test(email)) {
      setError("Zkontrolujte prosím e-mail – chybí zavináč nebo doména.");
      setStatus("error");
      track("form_error", { type: "email_invalid", location });
      return;
    }
    if (!consent) {
      setError("Pro zaslání přehledu prosím potvrďte první políčko.");
      setStatus("error");
      track("form_error", { type: "consent_missing", location });
      return;
    }
    setError(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          consent,
          marketing: form.get("marketing") === "on",
          company: form.get("company") ?? "",
          variant,
          location,
          etf,
          initial: input.initial,
          monthly: input.monthly,
          years: input.years,
          difference: result.difference,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      track("lead_submit", { location, etf });
      setLead({ email, submittedAt: new Date().toISOString() });
      requestAnimationFrame(() => document.getElementById("prehled")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (err) {
      setStatus("error");
      setError("Odeslání se nepovedlo. Zkuste to prosím znovu za chvíli.");
      track("form_error", { type: "network", location, detail: String(err).slice(0, 40) });
    }
  }

  const sending = status === "sending";

  return (
    <form action="/api/lead" method="post" noValidate onSubmit={onSubmit} className="grid gap-3" aria-describedby={`${id}-hint`}>
      {!compact && (
        <div>
          <p className="font-display text-xl font-extrabold leading-tight">Pošleme vám osobní přehled s těmito čísly</p>
          <p id={`${id}-hint`} className="mt-1 text-sm text-ink-soft">
            Evropská verze vašeho ETF, graf, daně v ČR a postup prvního nákupu. Zobrazí se hned, kopie přijde e-mailem.
          </p>
        </div>
      )}
      <input type="hidden" name="variant" value={variant} />
      <input type="hidden" name="location" value={location} />
      <input type="hidden" name="etf" value={etf} />
      <input type="hidden" name="initial" value={input.initial} />
      <input type="hidden" name="monthly" value={input.monthly} />
      <input type="hidden" name="years" value={input.years} />
      <input type="hidden" name="difference" value={result.difference} />
      <div className="absolute -left-[9999px]" aria-hidden>
        <label htmlFor={`${id}-company`}>Firma</label>
        <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <label htmlFor={`${id}-email`} className="sr-only">
        E-mail
      </label>
      <div className="flex flex-col gap-2">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="vas@email.cz"
          aria-invalid={status === "error" && !!error?.includes("e-mail")}
          onFocus={() => {
            if (!focused) {
              setFocused(true);
              track("email_focus", { location });
            }
          }}
          className="h-13 w-full min-w-0 rounded-xl border-2 border-line bg-white px-4 text-base outline-none focus:border-pine"
        />
      </div>
      <label className="flex items-start gap-2.5 text-xs leading-snug text-ink-soft">
        <input type="checkbox" name="consent" required className="mt-0.5 h-5 w-5 shrink-0 accent-pine" />
        <span>
          Beru na vědomí zpracování e-mailu pro zaslání přehledu.{" "}
          <a href="/ochrana-udaju" className="underline">
            Ochrana údajů
          </a>
        </span>
      </label>
      <label className="flex items-start gap-2.5 text-xs leading-snug text-ink-soft">
        <input type="checkbox" name="marketing" className="mt-0.5 h-5 w-5 shrink-0 accent-pine" />
        <span>Nepovinné: souhlasím se zasíláním občasných tipů k investování. Souhlas můžu kdykoli odvolat.</span>
      </label>
      <button
        type="submit"
        disabled={sending}
        className="h-13 w-full rounded-xl bg-pine px-5 text-base font-bold text-white transition hover:bg-ink disabled:opacity-70"
      >
        {sending ? "Odesílám…" : "Chci přehled zdarma"}
      </button>
      <p role="status" aria-live="polite" className={error ? "text-sm font-semibold text-loss" : "sr-only"}>
        {error ?? (sending ? "Odesílám" : "")}
      </p>
    </form>
  );
}
