"use client";

import { compare, formatCzk, roundForDisplay, type CalcInput } from "@/lib/calc";
import { bankCost, bankFund, etfCost, fees, findFund, formatDate, formatTer } from "@/lib/data";
import { GrowthChart } from "./GrowthChart";
import { PdfButton } from "./PdfButton";
import { BUY_STEPS, TAX_RULES } from "@/content/overview";

export function Overview({ input, etf, email }: { input: CalcInput; etf: string; email?: string }) {
  const fund = findFund(etf);
  const r = compare(input, bankCost, etfCost(fund.ticker));

  return (
    <article className="grid gap-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wider text-mint-ink">Osobní přehled · modelový výpočet</p>
        <h2 className="mt-1 font-display text-3xl font-extrabold leading-tight sm:text-4xl">Váš přehled je připravený</h2>
        {email && (
          <p className="mt-2 text-ink-soft">
            Kopii s odkazem posíláme na <strong className="text-ink">{email}</strong>. Pokud nedorazí do pár minut, mrkněte do složky Hromadné / Spam.
          </p>
        )}
      </header>

      <PdfButton input={input} etf={fund.ticker} />

      <section className="rounded-3xl bg-card p-5">
        <h3 className="font-display text-xl font-extrabold">1. Vaše čísla</h3>
        <p className="mt-2 text-sm text-ink-soft">
          {formatCzk(input.initial)} na začátek, {formatCzk(input.monthly)} měsíčně, {input.years} let. Celkem vloženo {formatCzk(r.invested)}.
        </p>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-2xl bg-mint-soft p-3">
            <dt className="text-ink-soft">ETF {fund.ucits.ticker}</dt>
            <dd className="tabular font-bold">{formatCzk(roundForDisplay(r.etf))}</dd>
          </div>
          <div className="rounded-2xl bg-loss-soft p-3">
            <dt className="text-ink-soft">Bankovní fond</dt>
            <dd className="tabular font-bold">{formatCzk(roundForDisplay(r.bank))}</dd>
          </div>
          <div className="col-span-2 rounded-2xl bg-paper p-3">
            <dt className="text-ink-soft">Rozdíl ve prospěch ETF</dt>
            <dd className="tabular font-bold text-pine">{formatCzk(roundForDisplay(r.difference))}</dd>
          </div>
        </dl>
        <div className="mt-4">
          <GrowthChart points={r.points} title="Vývoj hodnoty investice podle vašich čísel" />
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          Výnos {fees.assumptions.grossReturn} % ročně před náklady. Bankovní fond {bankFund.name}: vstup {bankFund.entry.toLocaleString("cs-CZ")} %, průběžně{" "}
          {bankFund.ongoing.toLocaleString("cs-CZ")} % ročně (KID, {formatDate(bankFund.kidDate)}). ETF: TER {formatTer(fund.ucits.ter)}, náklady brokera{" "}
          {fees.etfSide.brokerCostPerDeposit.toLocaleString("cs-CZ")} % z vkladu (předpoklad).
        </p>
      </section>

      <section className="rounded-3xl bg-card p-5">
        <h3 className="font-display text-xl font-extrabold">2. {fund.ticker} a jeho evropská verze</h3>
        <p className="mt-2 text-sm">
          {fund.ticker} ({fund.name}) se obchoduje na {fund.exchange} a drobnému investorovi v EU ho běžný broker zpravidla nenabídne. Na {fund.ucits.index} existuje
          evropský fond:
        </p>
        <div className="mt-3 rounded-2xl bg-mint-soft p-4">
          <p className="font-display text-2xl font-extrabold">{fund.ucits.ticker}</p>
          <p className="text-sm">{fund.ucits.name}</p>
          <p className="mt-1 text-sm">
            ISIN <strong>{fund.ucits.isin}</strong> · TER {formatTer(fund.ucits.ter)} · {fund.ucits.distribution}
          </p>
          {fund.ucits.indexNote && <p className="mt-2 text-xs text-ink-soft">{fund.ucits.indexNote}</p>}
          <a href={fund.ucits.justEtfUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold text-pine underline">
            Kde se obchoduje – justETF ↗
          </a>
        </div>
        <p className="mt-3 text-xs text-ink-soft">
          Tento fond nabízejí brokeři, kteří mají v nabídce UCITS ETF. Dostupnost u konkrétního brokera si ověřte podle ISIN.
        </p>
      </section>

      <section className="rounded-3xl bg-card p-5">
        <h3 className="font-display text-xl font-extrabold">3. Jak obvykle probíhá první nákup</h3>
        <ol className="mt-3 grid list-decimal gap-2 pl-5 text-sm">
          {BUY_STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="rounded-3xl bg-card p-5">
        <h3 className="font-display text-xl font-extrabold">4. Daně v ČR v kostce</h3>
        <ul className="mt-3 grid list-disc gap-2 pl-5 text-sm">
          {TAX_RULES.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-ink-soft">Zákon č. 586/1992 Sb., znění účinné od 1. 8. 2026. Netýká se ETF v obchodním majetku podnikatele.</p>
      </section>

      <p className="text-xs leading-relaxed text-ink-soft">
        Tento přehled je modelový výpočet a přehled možností, nikoli investiční doporučení ani investiční poradenství. Nezohledňuje vaši finanční situaci, cíle ani
        znalosti. Minulá ani modelová výkonnost nezaručuje budoucí výnosy, hodnota investice může klesat. TrustOne není banka ani obchodník s cennými papíry.
      </p>
    </article>
  );
}
