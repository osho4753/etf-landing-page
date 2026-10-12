import { compare, DEFAULT_INPUT, formatCzk, roundForDisplay } from "@/lib/calc";
import { bankCost, bankFund, etfCost, fees, findFund, formatDate, formatTer, funds, performanceAsOf } from "@/lib/data";
import { Brand } from "./Brand";
import { CtaLink } from "./CtaLink";

function Header() {
  return (
    <header className="flex items-center justify-between gap-3">
      <Brand />
      <span className="rounded-full border border-line px-3 py-1 text-xs text-ink-soft">Nejsme banka ani broker</span>
    </header>
  );
}

export function HeroFees() {
  const fund = findFund(fees.defaultEtf);
  const r = compare(DEFAULT_INPUT, bankCost, etfCost(fund.ticker));
  const max = Math.max(r.etf, r.bank);

  return (
    <section className="mx-auto max-w-5xl px-4 pb-10 pt-4 sm:px-6 sm:pt-6" aria-labelledby="hero-title">
      <Header />
      <div className="mt-6 grid gap-6 md:mt-12 md:grid-cols-2 md:items-center md:gap-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-mint-ink">Kalkulačka poplatků</p>
          <h1 id="hero-title" className="mt-2 font-display text-[2.15rem] font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            Kolik vám za 20 let sní poplatky fondu?
          </h1>
          <p className="mt-3 text-lg leading-snug text-ink-soft">
            Stejný akciový trh, jiné náklady. Podívejte se na rozdíl mezi bankovním fondem a ETF – bez registrace.
          </p>
        </div>

        <div className="rounded-3xl bg-ink p-5 text-paper sm:p-6">
          <p className="text-sm text-paper/80">
            Modelový příklad: {formatCzk(DEFAULT_INPUT.initial)} na začátek + {formatCzk(DEFAULT_INPUT.monthly)} měsíčně, {DEFAULT_INPUT.years} let
          </p>
          <p className="tabular mt-2 font-display text-[2.6rem] font-extrabold leading-none text-gold sm:text-6xl">
            {formatCzk(roundForDisplay(r.difference))}
          </p>
          <p className="mt-1 text-sm text-paper/80">navíc by vám zůstalo v ETF*</p>

          <div className="mt-4 grid gap-2.5 text-sm" aria-hidden>
            <div>
              <div className="flex justify-between">
                <span>ETF {fund.ucits.ticker}</span>
                <span className="tabular font-semibold">{formatCzk(roundForDisplay(r.etf))}</span>
              </div>
              <div className="mt-1 h-3 rounded-full bg-paper/15">
                <div className="h-3 rounded-full bg-mint" style={{ width: `${(r.etf / max) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <span>Bankovní akciový fond</span>
                <span className="tabular font-semibold">{formatCzk(roundForDisplay(r.bank))}</span>
              </div>
              <div className="mt-1 h-3 rounded-full bg-paper/15">
                <div className="h-3 rounded-full bg-loss" style={{ width: `${(r.bank / max) * 100}%` }} />
              </div>
            </div>
          </div>

          <CtaLink href="#kalkulacka" location="hero" className="mt-5 flex h-13 items-center justify-center rounded-xl bg-gold text-base font-bold text-ink">
            Spočítat s mými čísly
          </CtaLink>
          <p className="mt-3 text-[11px] leading-snug text-paper/70">
            *Výnos {fees.assumptions.grossReturn} % ročně před náklady pro obě varianty. Bankovní fond: náklady dle KID {bankFund.name} ({formatDate(bankFund.kidDate)}),
            ETF: TER {formatTer(fund.ucits.ter)} + {fees.etfSide.brokerCostPerDeposit.toLocaleString("cs-CZ")} % z vkladu. Nejde o investiční doporučení.
          </p>
        </div>
      </div>
      <p className="sr-only">Data emitentů ke dni {formatDate(performanceAsOf)}, {funds.length} ETF ve srovnání.</p>
    </section>
  );
}

export function HeroCompare() {
  const pairs = ["VOO", "SPY", "VT"].map((t) => findFund(t));

  return (
    <section className="mx-auto max-w-5xl px-4 pb-10 pt-4 sm:px-6 sm:pt-6" aria-labelledby="hero-title">
      <Header />
      <div className="mt-6 grid gap-6 md:mt-12 md:grid-cols-2 md:items-center md:gap-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-mint-ink">Srovnání ETF · data k {formatDate(performanceAsOf)}</p>
          <h1 id="hero-title" className="mt-2 font-display text-[2.15rem] font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            VOO, SPY, nebo VT? Tohle z Česka opravdu koupíte.
          </h1>
          <p className="mt-3 text-lg leading-snug text-ink-soft">
            Americká ETF vám běžný broker v EU většinou neprodá – chybí jim povinný dokument KID. Každé má ale evropské dvojče.
          </p>
        </div>

        <div className="rounded-3xl bg-ink p-5 text-paper sm:p-6">
          <ul className="grid gap-2.5">
            {pairs.map((f) => (
              <li key={f.ticker} className="grid grid-cols-[4.2rem_1.2rem_1fr] items-center gap-2 rounded-2xl bg-paper/10 px-3 py-3">
                <span className="font-display text-xl font-extrabold text-paper/60 line-through decoration-loss decoration-2">{f.ticker}</span>
                <span aria-hidden className="text-gold">→</span>
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-xl font-extrabold text-gold">{f.ucits.ticker}</span>
                  <span className="tabular text-sm text-paper/80">TER {formatTer(f.ucits.ter)}</span>
                </span>
              </li>
            ))}
          </ul>
          <CtaLink href="#srovnani" location="hero" className="mt-5 flex h-13 items-center justify-center rounded-xl bg-gold text-base font-bold text-ink">
            Celé srovnání {funds.length} ETF
          </CtaLink>
          <p className="mt-3 text-[11px] leading-snug text-paper/70">
            Přeškrtnuté: ETF z newyorské burzy NYSE Arca. Vpravo evropská (UCITS) verze na stejný nebo podobný index. TER = roční náklady fondu dle emitenta. Nejde o investiční doporučení.
          </p>
        </div>
      </div>
    </section>
  );
}
