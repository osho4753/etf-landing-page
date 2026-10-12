import Link from "next/link";
import type { Metadata } from "next";
import { Brand } from "@/components/Brand";

export const metadata: Metadata = {
  title: "Zásady zpracování osobních údajů – TrustOne",
};

export default function Privacy() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-4 sm:px-6">
      <Brand />
      <article className="mt-8 grid gap-4 leading-relaxed">
        <h1 className="font-display text-3xl font-extrabold">Zásady zpracování osobních údajů</h1>
        <p className="text-sm text-ink-soft">Platné od 12. 10. 2026</p>
        <p>
          TrustOne je fiktivní vzdělávací projekt vytvořený jako ukázka landing page. Při skutečném provozu by správcem byl provozovatel uvedený zde
          s identifikačními a kontaktními údaji.
        </p>
        <h2 className="font-display text-xl font-extrabold">Jaké údaje zpracováváme</h2>
        <p>
          Pouze e-mail, který vyplníte ve formuláři, a čísla zadaná v kalkulačce (vklady, horizont, vybrané ETF, variantu stránky a čas odeslání). Jméno ani telefon
          nežádáme.
        </p>
        <h2 className="font-display text-xl font-extrabold">Proč a na jakém základě</h2>
        <ul className="list-disc pl-5">
          <li>Zaslání osobního přehledu, o který jste požádali – na základě vašeho souhlasu (čl. 6 odst. 1 písm. a) GDPR).</li>
          <li>Občasné tipy k investování – jen pokud zaškrtnete nepovinný souhlas. Odvolat ho můžete odkazem v každém e-mailu.</li>
        </ul>
        <h2 className="font-display text-xl font-extrabold">Komu údaje předáváme</h2>
        <p>
          E-mail ukládáme a e-maily rozesíláme přes službu Brevo. Hosting stránky zajišťuje Vercel. Pokud se uložení kontaktu nepodaří, údaje
          se dočasně objeví v provozních záznamech hostingu, odkud je ručně doplníme.
        </p>
        <h2 className="font-display text-xl font-extrabold">Jak dlouho</h2>
        <p>Do odvolání souhlasu, nejdéle 3 roky od posledního kontaktu.</p>
        <h2 className="font-display text-xl font-extrabold">Měření návštěvnosti bez cookies</h2>
        <p>
          K měření používáme Umami, které podle svého provozovatele nepoužívá cookies ani nesbírá osobně identifikovatelné údaje. Měříme jen anonymní události, například zobrazení výsledku
          kalkulačky nebo odeslání formuláře.
        </p>
        <h2 className="font-display text-xl font-extrabold">Vaše práva</h2>
        <p>
          Máte právo na přístup, opravu, výmaz, omezení zpracování, přenositelnost a odvolání souhlasu, a také právo podat stížnost u Úřadu pro ochranu osobních
          údajů (uoou.gov.cz).
        </p>
        <p>
          <Link href="/" className="font-semibold text-pine underline">
            ← Zpět na srovnání
          </Link>
        </p>
      </article>
    </main>
  );
}
