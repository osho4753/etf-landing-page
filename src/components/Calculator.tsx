"use client";

import { useEffect, useRef } from "react";
import { LIMITS, formatCzk, roundForDisplay, type CalcInput } from "@/lib/calc";
import { bankFund, fees, findFund, formatDate, formatTer, funds } from "@/lib/data";
import { track, trackOnce } from "@/lib/track";
import { GrowthChart } from "./GrowthChart";
import { useLead } from "./LeadProvider";
import { LeadForm } from "./LeadForm";

type Field = {
  key: keyof Pick<CalcInput, "initial" | "monthly" | "years">;
  label: string;
  suffix: string;
};

const FIELDS: Field[] = [
  { key: "initial", label: "Na začátek", suffix: "Kč" },
  { key: "monthly", label: "Každý měsíc", suffix: "Kč" },
  { key: "years", label: "Na kolik let", suffix: "let" },
];

export function Calculator() {
  const { input, setInput, result, etf, setEtf } = useLead();
  const resultRef = useRef<HTMLParagraphElement>(null);
  const fund = findFund(etf);

  useEffect(() => {
    const el = resultRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => trackOnce("calc_result_view"), 1000);
        } else if (timer) {
          clearTimeout(timer);
        }
      },
      { threshold: 1 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  function update(key: Field["key"], raw: string) {
    const value = Number(raw.replace(/\s/g, ""));
    const limit = LIMITS[key];
    const next = { ...input, [key]: Math.min(limit.max, Math.max(limit.min, Number.isFinite(value) ? value : 0)) };
    setInput(next);
    trackOnce("calc_interact", { field: key });
  }

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:items-start">
      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()} aria-label="Vstupy kalkulačky">
        <div className="sticky top-0 z-10 -mx-4 flex items-baseline justify-between gap-3 border-b border-line bg-card/95 px-4 py-2.5 backdrop-blur md:hidden" aria-hidden>
          <span className="text-sm text-ink-soft">Rozdíl ve prospěch ETF</span>
          <span className="tabular font-display text-xl font-extrabold text-pine">{formatCzk(roundForDisplay(result.difference))}</span>
        </div>
        {FIELDS.map((f) => {
          const limit = LIMITS[f.key];
          const id = `calc-${f.key}`;
          return (
            <div key={f.key} className="grid gap-2">
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={id} className="text-sm font-semibold">
                  {f.label}
                </label>
                <span className="tabular text-lg font-bold">
                  {f.key === "years" ? `${input.years} let` : formatCzk(input[f.key])}
                </span>
              </div>
              <input
                id={id}
                type="range"
                min={limit.min}
                max={f.key === "initial" ? 1_000_000 : limit.max}
                step={limit.step}
                value={input[f.key]}
                onChange={(e) => update(f.key, e.target.value)}
                className="h-11 w-full cursor-pointer accent-pine"
                aria-valuetext={f.key === "years" ? `${input.years} let` : formatCzk(input[f.key])}
              />
            </div>
          );
        })}
        <div className="grid gap-2">
          <label htmlFor="calc-etf" className="text-sm font-semibold">
            ETF, které vás zajímá
          </label>
          <select
            id="calc-etf"
            value={etf}
            onChange={(e) => {
              setEtf(e.target.value);
              track("compare_interact", { ticker: e.target.value, location: "calculator" });
            }}
            className="h-12 rounded-xl border border-line bg-card px-3 text-base"
          >
            {funds.map((f) => (
              <option key={f.ticker} value={f.ticker}>
                {f.ticker} → evropská verze {f.ucits.ticker} (TER {formatTer(f.ucits.ter)})
              </option>
            ))}
          </select>
        </div>
      </form>

      <div className="rounded-3xl bg-card p-5 shadow-[0_1px_0_var(--color-line),0_12px_32px_-18px_rgba(15,42,34,0.35)] sm:p-6">
        <p className="text-sm text-ink-soft">
          Za {input.years} let vložíte <strong className="tabular text-ink">{formatCzk(result.invested)}</strong>. Rozdíl po nákladech:
        </p>
        <p ref={resultRef} className="tabular mt-1 font-display text-4xl font-extrabold leading-none text-pine sm:text-5xl" aria-live="polite">
          {result.difference >= 0 ? "+" : "−"}
          {formatCzk(roundForDisplay(Math.abs(result.difference)))}
        </p>
        <p className="mt-1 text-sm text-ink-soft">ve prospěch ETF {fund.ucits.ticker} oproti bankovnímu fondu</p>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-mint-soft p-3">
            <dt className="text-ink-soft">ETF {fund.ucits.ticker}</dt>
            <dd className="tabular text-lg font-bold">{formatCzk(roundForDisplay(result.etf))}</dd>
          </div>
          <div className="rounded-2xl bg-loss-soft p-3">
            <dt className="text-ink-soft">Bankovní fond</dt>
            <dd className="tabular text-lg font-bold">{formatCzk(roundForDisplay(result.bank))}</dd>
          </div>
        </dl>

        <div className="mt-4">
          <GrowthChart points={result.points} title="Vývoj hodnoty investice" />
        </div>
          <div className="mt-3 text-xs leading-relaxed text-ink-soft">
            <p className="font-semibold text-ink">Předpoklady a zdroje</p>
            <ul className="mt-1 grid list-disc gap-1 pl-4">
              <li>
                Modelový výnos {fees.assumptions.grossReturn} % ročně před náklady, stejný pro obě varianty. Nejde o předpověď ani slib výnosu.
              </li>
              <li>
                Bankovní fond: {bankFund.name} – vstupní poplatek {bankFund.entry.toLocaleString("cs-CZ")} % z každého vkladu, průběžné náklady{" "}
                {bankFund.ongoing.toLocaleString("cs-CZ")} % ročně. Transakční náklady ({bankFund.transaction.toLocaleString("cs-CZ")} %) nezapočítáváme. Zdroj:{" "}
                <a className="underline" href={bankFund.source.url} target="_blank" rel="noopener noreferrer">
                  sdělení klíčových informací (KID)
                </a>
                , stav k {formatDate(bankFund.kidDate)}.
              </li>
              <li>
                ETF: {fund.ucits.name} – TER {formatTer(fund.ucits.ter)} ročně. Zdroj:{" "}
                <a className="underline" href={fund.ucits.source.url} target="_blank" rel="noopener noreferrer">
                  emitent
                </a>
                , staženo {formatDate(fund.ucits.source.retrieved)}.
              </li>
              <li>Náklady brokera a konverze měny: předpoklad {fees.etfSide.brokerCostPerDeposit.toLocaleString("cs-CZ")} % z každého vkladu (u různých brokerů se liší).</li>
              <li>Daně a inflaci nezohledňujeme. Minulá ani modelová výkonnost nezaručuje budoucí výnosy.</li>
            </ul>
          </div>

        <div className="mt-5 border-t border-line pt-5">
          <LeadForm location="calculator" />
        </div>
      </div>

    </div>
  );
}
