import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/Brand";

export const metadata: Metadata = {
  title: "Ochrana osobních údajů – TrustOne",
  description: "Jak TrustOne zpracovává e-mail zadaný ve formuláři pro zaslání osobního přehledu ETF.",
};

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-4 font-display text-xl font-extrabold">{children}</h2>;
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-4 sm:px-6">
      <Brand />
      <article className="mt-8 grid gap-3 leading-relaxed">
        <h1 className="font-display text-3xl font-extrabold">Ochrana osobních údajů</h1>
        <p className="text-sm text-ink-soft">Platné od 12. 10. 2026</p>

        <H2>Správce</H2>
        <p>
          Správcem je TrustOne – fiktivní vzdělávací projekt vytvořený jako ukázka landing page. Nejde o banku, obchodníka s cennými papíry ani investičního
          zprostředkovatele. Kontakt pro otázky k osobním údajům: <a className="underline" href="mailto:ochrana-udaju@trustone.example">ochrana-udaju@trustone.example</a>{" "}
          (fiktivní adresa; při skutečném provozu zde budou identifikační údaje provozovatele).
        </p>

        <H2>Jaké údaje zpracováváme</H2>
        <ul className="list-disc pl-5">
          <li>e-mail zadaný ve formuláři,</li>
          <li>čísla z kalkulačky (počáteční a měsíční vklad, horizont, vybrané ETF, vypočtený rozdíl),</li>
          <li>variantu stránky, místo formuláře a čas odeslání,</li>
          <li>informaci, zda jste udělili souhlas se zasíláním tipů.</li>
        </ul>
        <p>Jméno, telefon ani údaje o vašem majetku nežádáme.</p>

        <H2>Účel a právní základ</H2>
        <ul className="list-disc pl-5">
          <li>
            <strong>Zaslání osobního přehledu</strong>, o který jste požádali – zpracování nezbytné k vyřízení vaší žádosti (čl. 6 odst. 1 písm. b) GDPR). Bez
            e-mailu vám kopii přehledu nemůžeme poslat; na stránce ho uvidíte i tak.
          </li>
          <li>
            <strong>Občasné tipy k investování</strong> – jen pokud zaškrtnete samostatné nepovinné políčko, na základě vašeho souhlasu (čl. 6 odst. 1 písm. a)
            GDPR). Souhlas můžete kdykoli odvolat odkazem v každém e-mailu nebo e-mailem na kontakt výše; odvolání nemá vliv na zaslaný přehled.
          </li>
        </ul>

        <H2>Doba uložení</H2>
        <ul className="list-disc pl-5">
          <li>Údaje pro zaslání přehledu: 12 měsíců od odeslání formuláře, poté je smažeme.</li>
          <li>Údaje pro zasílání tipů: do odvolání souhlasu, nejdéle 3 roky od posledního otevření našeho e-mailu.</li>
        </ul>

        <H2>Zpracovatelé</H2>
        <ul className="list-disc pl-5">
          <li>
            <strong>Brevo</strong> – ukládání kontaktů a rozesílání e-mailů, na základě smlouvy o zpracování osobních údajů.
          </li>
          <li>
            <strong>Vercel</strong> – hosting stránky a serverové funkce. Pokud se kontakt nepodaří uložit do Brevo, údaje z formuláře se dočasně zapíšou do
            provozních záznamů hostingu, odkud je ručně převezmeme.
          </li>
        </ul>

        <H2>Měření návštěvnosti bez cookies</H2>
        <p>
          Používáme Umami, které podle svého provozovatele nepoužívá cookies ani nesbírá osobně identifikovatelné údaje. Měříme anonymní události, například
          použití kalkulačky nebo odeslání formuláře. E-mail do měření nikdy neposíláme.
        </p>

        <H2>Vaše práva</H2>
        <p>
          Máte právo na přístup k údajům, jejich opravu a výmaz, omezení zpracování, přenositelnost, právo vznést námitku a odvolat souhlas. Pokud máte za to, že
          zpracování porušuje předpisy, můžete podat stížnost u Úřadu pro ochranu osobních údajů (uoou.gov.cz).
        </p>

        <p className="mt-4">
          <Link href="/" className="font-semibold text-pine underline">
            ← Zpět na srovnání
          </Link>
        </p>
      </article>
    </main>
  );
}
