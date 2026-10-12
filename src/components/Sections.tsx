import { bankFund, fees, formatDate, formatTer, funds, performanceAsOf, snapshotDate } from "@/lib/data";
import { CtaLink } from "./CtaLink";
import { LeadForm } from "./LeadForm";
import { TAX_RULES } from "@/content/overview";

export function SectionTitle({ eyebrow, title, lead, id }: { eyebrow: string; title: string; lead?: string; id: string }) {
  return (
    <header className="mb-6 max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-wider text-mint-ink">{eyebrow}</p>
      <h2 id={id} className="mt-1 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
        {title}
      </h2>
      {lead && <p className="mt-2 text-lg leading-snug text-ink-soft">{lead}</p>}
    </header>
  );
}

export function KidExplainer() {
  const ters = funds.map((f) => f.ucits.ter);
  const terRange = `${formatTer(Math.min(...ters))}–${formatTer(Math.max(...ters))}`;
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[
        {
          n: "1",
          t: "Chybí jim KID",
          d: "Evropská pravidla PRIIPs vyžadují, aby drobný investor dostal před nákupem „sdělení klíčových informací“ (KID). Americké fondy ho nevydávají.",
        },
        {
          n: "2",
          t: "Broker je proto neprodá",
          d: "Bez KID distributor fond drobnému investorovi prodat nesmí. Výjimkou je třeba status profesionálního klienta – ten má ale přísné podmínky.",
        },
        {
          n: "3",
          t: "Evropská verze existuje",
          d: `Vanguard, iShares i SPDR mají irské (UCITS) fondy na stejný nebo podobný index. Mají KID, takže je evropský broker nabídnout smí. Roční náklady: ${terRange}.`,
        },
      ].map((s) => (
        <div key={s.n} className="rounded-3xl bg-card p-5">
          <p className="font-display text-4xl font-extrabold text-gold">{s.n}</p>
          <h3 className="mt-2 font-display text-xl font-extrabold">{s.t}</h3>
          <p className="mt-1.5 text-ink-soft">{s.d}</p>
        </div>
      ))}
      <p className="text-xs text-ink-soft md:col-span-3">
        Zdroj: ČNB, stanovisko RS2018-12 k nařízení PRIIPs (čl. 13 odst. 1 – KID se poskytuje v dostatečném předstihu před uzavřením smlouvy; při české propagaci v
        češtině).{" "}
        <a className="underline" href="https://www.cnb.cz/cs/dohled-financni-trh/legislativni-zakladna/stanoviska-k-regulaci-financniho-trhu/RS2018-12" target="_blank" rel="noopener noreferrer">
          cnb.cz
        </a>
      </p>
    </div>
  );
}

export function PlanPreview() {
  const items = [
    ["Vaše čísla a graf", "Kolik vložíte, kolik může zůstat v ETF a kolik v bankovním fondu – podle vašich vkladů."],
    ["Evropská verze vašeho ETF", "ISIN, roční náklady, akumulace a odkaz, kde se fond obchoduje."],
    ["Postup prvního nákupu", "6 kroků od výběru brokera po pravidelnou investici."],
    ["Daně v ČR na jedné stránce", "Časový test 3 roky a limit 100 000 Kč – srozumitelně a se zdrojem."],
  ];
  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-start">
      <ol className="grid gap-3">
        {items.map(([t, d], i) => (
          <li key={t} className="flex gap-3 rounded-2xl bg-card p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pine font-bold text-white">{i + 1}</span>
            <span>
              <strong className="block">{t}</strong>
              <span className="text-sm text-ink-soft">{d}</span>
            </span>
          </li>
        ))}
      </ol>
      <div id="formular" className="scroll-mt-6 rounded-3xl bg-card p-5 shadow-[0_12px_32px_-18px_rgba(15,42,34,0.35)]">
        <LeadForm location="plan" />
        <p className="mt-3 text-xs text-ink-soft">Přehled uvidíte hned po odeslání a stáhnete si ho jako PDF. Žádný telefon, žádný poradce, který by volal.</p>
      </div>
    </div>
  );
}

export function Faq() {
  const items = [
    {
      q: "Kdo je TrustOne a proč je to zdarma?",
      a: "TrustOne je nezávislý vzdělávací projekt. Nejsme banka, broker ani investiční poradce a nic neprodáváme. Za e-mail vám pošleme přehled; pokud souhlasíte, občas i tip k investování.",
    },
    {
      q: "Je to investiční doporučení?",
      a: "Ne. Jde o modelový výpočet a přehled možností. Nezohledňujeme vaši finanční situaci ani cíle. Rozhodnutí je na vás, případně se poraďte s licencovaným poradcem.",
    },
    {
      q: "Proč počítáte s 6 % ročně?",
      a: "Je to konzervativní modelové číslo, stejné pro obě varianty – rozdíl tak ukazuje jen vliv nákladů. Skutečný výnos může být vyšší, nižší i záporný.",
    },
    {
      q: "Jak se ETF daní v Česku?",
      a: TAX_RULES.slice(0, 2).join(" "),
    },
    {
      q: "Pošlete mi spam?",
      a: "Ne. Bez zaškrtnutí nepovinného souhlasu dostanete jen jeden e-mail s přehledem. Odhlásit se dá jedním klikem.",
    },
  ];
  return (
    <div className="grid gap-2">
      {items.map((i) => (
        <details key={i.q} className="group rounded-2xl bg-card p-4 open:pb-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold">
            {i.q}
            <span aria-hidden className="text-xl text-pine transition group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-2 text-ink-soft">{i.a}</p>
        </details>
      ))}
      <CtaLink href="#formular" location="faq" className="mt-4 flex h-13 items-center justify-center rounded-xl bg-pine text-base font-bold text-white">
        Chci osobní přehled zdarma
      </CtaLink>
    </div>
  );
}

export function Sources() {
  return (
    <div className="grid gap-4 text-sm text-ink-soft">
      <ul className="grid list-disc gap-1.5 pl-5">
        {funds.map((f) => (
          <li key={f.ticker}>
            {f.ticker}:{" "}
            <a className="underline" href={f.source.url} target="_blank" rel="noopener noreferrer">
              {f.issuer}
            </a>{" "}
            (výkonnost k {formatDate(f.returnsNav.asOf)}, aktiva k {formatDate(f.aum.asOf)}); {f.ucits.ticker}:{" "}
            <a className="underline" href={f.ucits.source.url} target="_blank" rel="noopener noreferrer">
              emitent
            </a>{" "}
            (staženo {formatDate(f.ucits.source.retrieved)})
          </li>
        ))}
        <li>
          Burza:{" "}
          <a className="underline" href={funds[0].exchangeSource.url} target="_blank" rel="noopener noreferrer">
            adresář Nasdaq Trader
          </a>{" "}
          (kód P = NYSE Arca)
        </li>
        <li>
          Bankovní fond:{" "}
          <a className="underline" href={bankFund.source.url} target="_blank" rel="noopener noreferrer">
            KID {bankFund.name}
          </a>{" "}
          ({formatDate(bankFund.kidDate)})
        </li>
        <li>
          Daně:{" "}
          <a className="underline" href="https://www.zakonyprolidi.cz/cs/1992-586" target="_blank" rel="noopener noreferrer">
            zákon č. 586/1992 Sb.
          </a>
          , § 4 odst. 1 písm. t) a u), znění od 1. 8. 2026
        </li>
      </ul>
      <p>
        Data stažena {formatDate(snapshotDate)}, výkonnost k {formatDate(performanceAsOf)}. Modelový výnos {fees.assumptions.grossReturn} % p. a. je předpoklad, ne
        předpověď.
      </p>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-4 border-t border-line bg-paper">
      <div className="mx-auto grid max-w-5xl gap-3 px-4 py-8 text-xs leading-relaxed text-ink-soft sm:px-6">
        <p className="font-semibold text-ink">Nejde o investiční doporučení.</p>
        <p>
          Obsah stránky je modelový výpočet a obecný přehled možností, nikoli investiční doporučení ani investiční poradenství. Minulá ani modelová výkonnost
          nezaručuje budoucí výnosy; hodnota investice může klesat i stoupat a nemusí se vám vrátit celá vložená částka. Výkonnost ETF je uvedena v USD a nezahrnuje
          vliv kurzu koruny. TrustOne je fiktivní vzdělávací projekt – není banka, obchodník s cennými papíry ani investiční zprostředkovatel. Názvy fondů a tickery
          slouží jen k identifikaci, s emitenty nemáme žádný vztah.
        </p>
        <p>
          <a href="/ochrana-udaju" className="underline">
            Ochrana osobních údajů
          </a>{" "}
          · Stránka nepoužívá cookies.
        </p>
      </div>
    </footer>
  );
}
