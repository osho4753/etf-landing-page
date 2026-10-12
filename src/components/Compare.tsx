"use client";

import { formatDate, formatTer, formatUsdShort, funds, performanceAsOf, snapshotDate, type Fund } from "@/lib/data";
import { track } from "@/lib/track";
import { useLead } from "./LeadProvider";

function Returns({ fund }: { fund: Fund }) {
  const items = [
    ["1 rok", fund.returnsNav.y1],
    ["5 let p. a.", fund.returnsNav.y5],
    ["10 let p. a.", fund.returnsNav.y10],
  ] as const;
  return (
    <dl className="grid grid-cols-3 gap-2 text-center">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-xl bg-paper px-1 py-2">
          <dt className="text-[11px] text-ink-soft">{label}</dt>
          <dd className="tabular font-semibold">{value.toLocaleString("cs-CZ", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}&nbsp;%</dd>
        </div>
      ))}
    </dl>
  );
}

function Card({ fund }: { fund: Fund }) {
  const { etf, setEtf } = useLead();
  const selected = etf === fund.ticker;

  return (
    <li className={`flex flex-col rounded-3xl border-2 bg-card p-4 sm:p-5 ${selected ? "border-pine" : "border-transparent"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-3xl font-extrabold leading-none">{fund.ticker}</p>
          <p className="mt-1 text-sm text-ink-soft">{fund.name}</p>
        </div>
        <p className="shrink-0 rounded-full bg-paper px-2.5 py-1 text-xs font-semibold">{fund.exchange}</p>
      </div>
      <p className="mt-3 text-sm">
        <span className="text-ink-soft">Index:</span> {fund.index} · <span className="text-ink-soft">TER</span> {formatTer(fund.ter)} ·{" "}
        <span className="text-ink-soft">aktiva</span> {formatUsdShort(fund.aum.value)}
      </p>
      <div className="mt-3">
        <Returns fund={fund} />
      </div>

      <div className="mt-4 rounded-2xl bg-mint-soft p-3.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-pine">Z Česka koupíte evropskou verzi</p>
        <div className="mt-1 flex items-baseline justify-between gap-2">
          <p className="font-display text-2xl font-extrabold">{fund.ucits.ticker}</p>
          <p className="tabular text-sm font-semibold">TER {formatTer(fund.ucits.ter)}</p>
        </div>
        <p className="text-sm">{fund.ucits.name}</p>
        <p className="mt-1 text-xs text-ink-soft">
          ISIN {fund.ucits.isin} · {fund.ucits.distribution} · {fund.ucits.domicile}
        </p>
        {fund.ucits.indexNote && <p className="mt-2 text-xs text-ink-soft">{fund.ucits.indexNote}</p>}
        <a
          href={fund.ucits.justEtfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm font-semibold text-pine underline"
          onClick={() => track("compare_interact", { ticker: fund.ticker, action: "justetf" })}
        >
          Detail na justETF ↗
        </a>
      </div>

      <a
        href="#formular"
        onClick={() => {
          setEtf(fund.ticker);
          track("compare_interact", { ticker: fund.ticker, action: "select" });
          track("cta_click", { location: "compare", target: "formular" });
        }}
        className="mt-4 flex h-12 items-center justify-center rounded-xl border-2 border-pine text-base font-bold text-pine transition hover:bg-pine hover:text-white"
      >
        Přehled pro {fund.ticker} → {fund.ucits.ticker}
      </a>
    </li>
  );
}

export function Compare() {
  return (
    <div>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {funds.map((f) => (
          <Card key={f.ticker} fund={f} />
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-ink-soft">
        Zdroj: weby emitentů (Vanguard, State Street SPDR, iShares) – výkonnost NAV p. a. k {formatDate(performanceAsOf)}, TER a aktiva stažené{" "}
        {formatDate(snapshotDate)}; burza dle adresáře Nasdaq Trader; evropské verze dle factsheetů emitentů. Aktiva u fondů Vanguard jsou za třídu ETF.
        Minulá výkonnost nezaručuje budoucí výnosy. Výkonnost je v USD, bez vlivu kurzu koruny.{" "}
        <a href="#zdroje" className="underline">
          Všechny zdroje
        </a>
      </p>
    </div>
  );
}
