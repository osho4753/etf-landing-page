# Krok 1 – plán a ověření faktů

Stav k 12. 10. 2026. Značení: **[OVĚŘENO]** = ověřeno v primárním zdroji (emitent, zákon, regulátor, oficiální adresář), **[ČÁSTEČNĚ]** = jen sekundární zdroj nebo neúplné, **[PŘEDPOKLAD]** = naše úvaha, **[OTÁZKA]** = čeká na rozhodnutí.

---

## 1. Ověření faktů

### a) PRIIPs / KID – může drobný investor z ČR koupit americké ETF?

| Tvrzení | Stav | Zdroj (datum) |
|---|---|---|
| Distributor musí retailovému investorovi **poskytnout KID v dostatečném předstihu před uzavřením smlouvy** (čl. 13 odst. 1 nařízení PRIIPs). Bez KID tedy prodej retailu není možný. | OVĚŘENO | ČNB, stanovisko RS2018-12 „Otázky a odpovědi k nařízení PRIIPs“, zveř. 22. 10. 2018 – https://www.cnb.cz/cs/dohled-financni-trh/legislativni-zakladna/stanoviska-k-regulaci-financniho-trhu/RS2018-12 |
| Je-li produkt v ČR propagován česky, musí mít KID **v češtině**. | OVĚŘENO | tamtéž |
| Američtí emitenti KID nevydávají → evropští brokeři americká ETF retailu blokují; kdo je už drží, může je držet a prodat, ne dokoupit. | ČÁSTEČNĚ (odborný web, ne regulátor) | justETF, 28. 3. 2018 – https://www.justetf.com/en/news/etf/us-domiciled-etfs.html |
| Výjimky: status profesionálního klienta (MiFID II), opce/CFD na ETF. | ČÁSTEČNĚ | tamtéž; IBKR knowledge base (stránka vrací 403, ověřeno jen přes výňatek ve vyhledávání) |
| Konkrétní hláška „produkt není dostupný retailovým klientům“ u českého brokera. | ČÁSTEČNĚ | finhacker.cz – https://www.finhacker.cz/jak-obejit-znemozneni-obchodovani-americkych-etfek-1-cast |

**Závěr pro stránku:** Tvrzení „drobný investor z ČR americké ETF jako VOO nebo SPY u běžného brokera většinou nekoupí, protože k nim chybí KID“ je podložené (mechanismus PRIIPs je ověřen ze stanoviska ČNB). Formulace musí znít „většinou / u běžných brokerů“, ne „nikdy“, protože existují výjimky (profesionální klient, deriváty).

**Brokeři s UCITS ekvivalenty:**

| Broker | Co je ověřeno | Stav |
|---|---|---|
| XTB | Má stránky nástrojů VUAA.DE, SXR8.DE (ISIN IE00B5BMR087), SPYL.DE; deklaruje 0% poplatek do měsíčního objemu 100 000 EUR, konverze měny 0,5 %. | ČÁSTEČNĚ – stránky nástrojů jsou na UK/INT webu XTB, ne na CZ; poplatky ze sekundárního zdroje. https://www.xtb.com/en/etfs/ishares-core-s-p-500-ucits-acc-eur, https://www.xtb.com/cz/etf |
| Trading 212 | Nenašel jsem oficiální stránku nástroje. | OTÁZKA |
| Fio e-Broker | Obchoduje na Xetře a amerických burzách; ceník a seznam ETF jsem z oficiálního webu nezískal. | OTÁZKA |
| Portu | Portfolia z ETF iShares/Xtrackers/Amundi (polská analýza, ne Portu). | ČÁSTEČNĚ |

→ **Otevřený úkol:** dostupnost každého UCITS ETF u každého brokera ověřit ručně (vyhledání ISIN v aplikaci/na webu brokera, screenshot + datum). Bez toho v plánu uvedeme jen brokery, u kterých to bude ověřené.

### b) Kandidátní ETF na NYSE Arca (data emitentů)

Burza: oficiální adresář Nasdaq Trader `otherlisted.txt` (soubor z 12. 10. 2026), sloupec Exchange = **P = NYSE Arca** – https://www.nasdaqtrader.com/dynamic/SymDir/otherlisted.txt. Kontrola: QQQ, VXUS a BND jsou v `nasdaqlisted.txt` → **Nasdaq, nepoužít**.

| Ticker | Fond | Burza | TER | Aktiva | Výkonnost NAV p.a. k 30. 9. 2026 (1R / 3R / 5R / 10R) | Zdroj |
|---|---|---|---|---|---|---|
| SPY | State Street SPDR S&P 500 ETF Trust | NYSE Arca | 0,0945 % | 821,7 mld. USD (9. 10. 2026) | 15,60 / 22,73 / 13,65 / 15,18 | ssga.com |
| IVV | iShares Core S&P 500 ETF | NYSE Arca | 0,03 % | 896,4 mld. USD (9. 10. 2026) | 15,71 / 22,85 / 13,76 / 15,30 | ishares.com |
| VOO | Vanguard S&P 500 ETF | NYSE Arca | 0,03 % | ETF třída 1,0 bil. USD (31. 8. 2026) | 15,70 / 22,85 / 13,75 / 15,29 | investor.vanguard.com |
| VT | Vanguard Total World Stock ETF | NYSE Arca | 0,06 % | ETF třída 81,9 mld. USD (31. 8. 2026) | 16,32 / 21,42 / 11,34 / 12,32 | investor.vanguard.com |
| VWO | Vanguard FTSE Emerging Markets ETF | NYSE Arca | 0,06 % | ETF třída 127,3 mld. USD (31. 8. 2026) | 12,54 / 17,91 / 6,62 / 7,66 | investor.vanguard.com |
| VTI *(rezerva)* | Vanguard Total Stock Market ETF | NYSE Arca | 0,03 % | ETF třída 690,1 mld. USD (31. 8. 2026) | 15,33 / 22,32 / 12,56 / 14,70 | investor.vanguard.com |

Všechny údaje OVĚŘENO ze surových dat emitenta (HTML/JSON API), ne ze sumarizace. Poznámka k procesu: první pokus přes automatický sumarizátor posunul sloupce u SPY (1M/3M/YTD vs. 1R/3R…), chyba odhalena porovnáním s VOO (stejný index) a opravena čtením surového HTML. Proto se v implementaci data stáhnou skriptem a uloží i se surovou odpovědí.

**Návrh: 5 fondů – SPY, IVV, VOO, VT, VWO.** Tři S&P 500 fondy jsou záměr: ukazují, že „stejný index, jiný obal“ – a jsou to tickery, které cílovka zná z YouTube/Redditu. VT = celý svět, VWO = rozvíjející se trhy. VTI vynechávám, protože nemá UCITS ekvivalent na stejný index (US total market), takže by porušil hlavní příběh stránky.

### c) UCITS ekvivalenty (web/factsheet emitenta)

| NYSE ETF | UCITS ekvivalent (akumulační) | ISIN | TER/OCF | Aktiva | Zdroj |
|---|---|---|---|---|---|
| SPY | State Street SPDR S&P 500 UCITS ETF (Acc) – SPYL | IE000XZSV718 | 0,03 % | 17,6 mld. EUR (justETF) | ssga.com/ie, stránka fondu (12. 10. 2026) |
| IVV | iShares Core S&P 500 UCITS ETF (Acc) – CSPX / SXR8 | IE00B5BMR087 | 0,07 % | 161,5 mld. USD (9. 10. 2026) | ishares.com/uk |
| VOO | Vanguard S&P 500 UCITS ETF (Acc) – VUAA | IE00BFMXXD54 | 0,07 % | třída 35,9 mld. USD (31. 8. 2026) | factsheet fund-docs.vanguard.com |
| VT | Vanguard FTSE All-World UCITS ETF (Acc) – VWCE | IE00BK5BQT80 | 0,14 % (sníženo z 0,19 % k 28. 7. 2026) | třída 58,0 mld. USD (31. 8. 2026) | factsheet fund-docs.vanguard.com |
| VWO | Vanguard FTSE Emerging Markets UCITS ETF (Acc) | IE00BK5BR733 | 0,17 % | třída 2,4 mld. USD (31. 8. 2026) | factsheet fund-docs.vanguard.com |

Stav: OVĚŘENO (TER/OCF z dokumentů emitenta, SPYL TER ze stránky SSGA). Křížová kontrola justETF sedí u všech pěti. Pozor: řada sekundárních webů má u VWCE ještě 0,22 % nebo 0,19 % – zastaralé.

Poznámka: UCITS „dvojče“ sleduje stejný index, ale není to stejný fond (jiná domicilace, zdanění dividend uvnitř fondu, jiná měna obchodování). Na stránce uvádět jako „evropská verze na stejný index“, ne „totéž“.

### d) Náklady podílových fondů českých bank (základ kalkulačky)

| Fond | Vstup | Průběžné | Transakční | Zdroj |
|---|---|---|---|---|
| ČSOB Akciový zodpovědný (CZ0008477098) | max. 3,00 % | 2,65 % (odhad) | 0,42 % | KID ČSOB AM, vypracováno 1. 6. 2026 – https://multimediafiles.kbcgroup.eu/ng/feed/am/funds/KID/KID_CZ0008477098_CS.PDF – OVĚŘENO |
| Top Stocks, Erste/Česká spořitelna (CZ0008472404) | max. 3,00 % | 2,18 % | 0,13 % | KID Erste AM, vypracováno 22. 5. 2023 – OVĚŘENO, ale **starý**. Factsheet k 30. 1. 2026: vstup 3,00 %, správcovský poplatek 1,70 % p.a., kapitál 33,4 mld. Kč |
| KB / Amundi | – | – | – | aktuální KID nenalezen – OTÁZKA |

**Návrh pro kalkulačku (konzervativní):** výchozí srovnání = Top Stocks (nižší náklady ze dvou ověřených → nenadsazujeme úsporu): vstup 3 % z každého vkladu + 2,31 % ročně. V implementaci stáhnout **aktuální** KID Top Stocks (2026); pokud se liší, použít nový. Uživatel si může přepnout na ČSOB (dražší).

ETF strana: TER UCITS ETF + 0,5 % konverze měny z každého vkladu [ČÁSTEČNĚ – ověřit v ceníku XTB] + 0 Kč poplatek za nákup [ČÁSTEČNĚ].

**Modelový výpočet pro reklamu A** (6 % ročně před náklady, 100 000 Kč na začátek + 3 000 Kč měsíčně, 20 let, vloženo 820 000 Kč):
bankovní fond (Top Stocks KID) ≈ 1 204 000 Kč, ETF CSPX (0,07 % + 0,5 % konverze) ≈ 1 657 000 Kč → **rozdíl ≈ 453 000 Kč**. Při 7 % ≈ 525 000 Kč. Do reklamy pouze konzervativní varianta s hvězdičkou a předpoklady.

### e) Daně v ČR (fyzická osoba, ETF mimo podnikání)

Zdroj: zákon č. 586/1992 Sb., o daních z příjmů, znění účinné 1. 8. – 31. 12. 2026 (zakonyprolidi.cz, verze 157) – OVĚŘENO z textu zákona.

- **§ 4 odst. 1 písm. u) – časový test:** příjem z prodeje cenného papíru je osvobozen, pokud mezi nákupem a prodejem uplyne **více než 3 roky**.
- **§ 4 odst. 1 písm. t) – limit:** osvobozeny jsou příjmy z prodeje cenných papírů, pokud jejich **úhrn za rok nepřesáhne 100 000 Kč** (jde o příjem z prodeje, ne o zisk).
- **Limit 40 mil. Kč:** v aktuálním znění § 4 odst. 3 se vztahuje **jen na kryptoaktiva**, ne na cenné papíry. Sekundární zdroje se zde rozcházejí (zrušení od 2026) – na stránce limit 40 mil. vůbec nezmiňovat, cílovky se netýká.
- Akumulační ETF nevyplácí dividendy → odpadá daňové přiznání dividend. [PŘEDPOKLAD – obecná vlastnost akumulačních fondů, v plánu formulovat opatrně]

### f) Benchmarky konverze

Unbounce Conversion Benchmark Report, stránka Finance & Insurance (publikováno 29. 8. 2024, aktualizováno 25. 2. 2026) – https://unbounce.com/conversion-benchmark-report/finance-insurance-conversion-rate – OVĚŘENO:
- medián finančních služeb **8,3 %**, podkategorie **investice 3,9 %** (top stránky do 20,6 %),
- placené sociální sítě ve financích medián **9,3 %**, TikTok a Instagram „7 % a více“,
- ve financích mobil konvertuje lépe – desktop o **22 % méně** než mobil.

Starší Unbounce (edice 2020): finance & insurance medián 3,8 % – jen pro kontext.

### g) Pravidla Meta pro finanční reklamu

Primární stránka (transparency.meta.com → Financial and insurance products and services) se nástroji nenačte (JS) → **ČÁSTEČNĚ**, ověřeno přes výňatky z ní a z politiky Personal attributes:
- Reklama nesmí **přímo žádat osobní či finanční údaje** (spadá pod Fraud/Privacy). → v reklamě nic nevyplňovat, lead se sbírá až na webu.
- **Personal attributes:** text nesmí tvrdit/naznačovat finanční situaci čtenáře („Máte úspory na spořáku?“ ✗). „Vy/vaše“ je povoleno, pokud se neváže na citlivý atribut. → „Kolik sní poplatky z 3 000 Kč měsíčně?“ ✓, „Vaše banka vás okrádá“ ✗.
- Advertiser může potřebovat **ověření identity a regulatorní autorizaci**; Meta smí kontrolovat, zda autorizace pokrývá propagovaný produkt (změna 3/2026 dle sekundárního zdroje). Seznam zemí pro EU Meta nezveřejňuje.
- Special Ad Category pro finanční produkty: povinná pro USA (a úvěry v části Evropy) – pro ČR a investiční obsah pravděpodobně ne. [ČÁSTEČNĚ]
- Zákaz nepodložených a zavádějících tvrzení, žádné sliby výnosů.

→ **Důsledky pro texty:** žádný slib výnosu, každé číslo s hvězdičkou a předpoklady na landing page, žádné oslovení přes finanční situaci, žádná loga emitentů/burz, tickery jako text jsou OK. **[OTÁZKA]** před spuštěním zkontrolovat v Ads Manageru, zda ČR vyžaduje ověření finančního inzerenta.

### Riziko navíc (nebylo v zadání)

**[PŘEDPOKLAD / RIZIKO]** „Osobní plán – který ETF koupit“ se může blížit **investičnímu poradenství** (osobní doporučení konkrétního investičního nástroje), které v ČR vyžaduje oprávnění ČNB. TrustOne žádné nemá. Návrh: plán formulovat jako **modelový vzdělávací výpočet s přehledem možností** („UCITS ETF na stejný index jako vámi zvolený VOO jsou: …“), bez slov „doporučujeme koupit“, bez dotazníku vhodnosti, s jasným disclaimerem. Právní posouzení mimo rozsah tohoto testu – uvedu v README.

---

## 2. Návrh řešení

### Cílovka (potvrzeno z koncepce)
25–45 let, peníze na spořáku / ve stavebku / v bankovním fondu, zná pojmy ETF a S&P 500 (YouTube, kolegové), neví který a jak z ČR, bojí se poplatků a „udělat chybu“. Mobil, Meta/IG, 3–8 sekund pozornosti.

### Pořadí sekcí (varianta A = poplatky)

1. **Hero (message match)** – nadpis navazuje na reklamu, pod ním hned **předvyplněná kalkulačka s výsledkem** (číslo rozdílu je vidět bez scrollu). Proč: návštěvník přichází s jedinou otázkou z reklamy, odpověď musí být nad ohybem; hodnota před formulářem.
2. **Kalkulačka – úprava vlastních čísel + graf** → hned pod výsledkem **inline formulář (e-mail)** s náhledem plánu. Proč: nejvyšší motivace je ve chvíli, kdy člověk vidí „svoje“ číslo – to je moment žádosti o kontakt.
3. **„Proč VOO z Česka nekoupíte“** – 3 věty o KID + „co místo toho“. Proč: překvapivá informace = důvod pokračovat a důvěra („tihle tomu rozumí“).
4. **Srovnání 5 NYSE ETF ↔ UCITS ekvivalent** (karty na mobilu, tabulka na desktopu, tickery otevřené) → CTA „Pošlete mi plán pro [vybraný ETF]“. Proč: hodnota i pro ty, koho kalkulačka nezaujala; druhá vstupní brána ke kontaktu.
5. **Co je v plánu** – náhled PDF (3 stránky), formulář znovu. Proč: pro váhající – konkrétně ukázat, co dostanou.
6. **FAQ** – daně (3 roky / 100 000 Kč), „Kdo je TrustOne a proč to děláte zdarma“, „Pošlete mi spam?“, „Je to investiční doporučení?“. Proč: odbourání námitek těsně před posledním CTA.
7. **Zdroje dat a právní text** – data emitentů s datem, KID bank, disclaimery, odkaz na zpracování osobních údajů.

**Varianta B (srovnání ETF)** – stejné sekce, ale **3 a 4 jdou na pozici 2** (srovnání hned pod hero), kalkulačka až potom. Přepíná se podle `utm_content=a|b` (výchozí bez UTM = A). Sticky spodní lišta na mobilu „Získat plán“ po scrollu 25 %.

### Texty první obrazovky

**A – poplatky** (reklama: „100 000 Kč + 3 000 Kč měsíčně na 20 let: poplatky bankovního fondu vs. ETF mohou dělat ≈ 450 000 Kč*. Spočítejte si svoje číslo.“)
- Nadpis: **Kolik vám za 20 let sní poplatky fondu?**
- Podnadpis: Zadejte svoje vklady a hned uvidíte rozdíl mezi bankovním fondem a ETF na stejný trh. Bez registrace.
- Výsledek v hero: „Rozdíl: **453 000 Kč**“ + mini graf + „Upravit čísla ↓“
- Mikrotext: *Modelový výpočet, 6 % ročně před náklady, náklady dle KID fondu Top Stocks a TER iShares. Nejde o investiční doporučení.*

**B – srovnání** (reklama: „VOO, SPY, nebo VT? Z Česka většinou nekoupíte ani jeden. Ukážeme evropské verze se stejným indexem a nižším poplatkem.“)
- Nadpis: **VOO, SPY, nebo VT? Tady je, co z Česka opravdu koupíte.**
- Podnadpis: 5 nejznámějších ETF z newyorské burzy a jejich evropská dvojčata, která mají české brokery. Data emitentů k 30. 9. 2026.
- V hero: 3 karty (VOO → VUAA 0,07 %, SPY → SPYL 0,03 %, VT → VWCE 0,14 %) + „Celé srovnání ↓“

### Co dostane za e-mail (obsah PDF „Osobní plán“)
1. **Vaše čísla:** zadané vklady a horizont, rozdíl v nákladech (graf), tabulka po 5/10/20 letech.
2. **Váš ETF a jeho evropská verze:** vybraný NYSE ETF → UCITS ekvivalent(y), ISIN, TER, ticker na Xetře, akumulace.
3. **Kde ho koupit:** brokeři s ověřenou dostupností (stav k datu), poplatky za nákup a konverzi.
4. **První nákup krok za krokem:** 6 kroků od založení účtu po trvalý příkaz.
5. **Daně v ČR:** časový test 3 roky, limit 100 000 Kč, akumulace vs. dividendy.
6. **Zdroje, datum dat, disclaimer.**

Po odeslání: (1) plán se hned ukáže na stránce, (2) tlačítko **Stáhnout PDF** (generuje se v prohlížeči), (3) e-mail z Brevo s odkazem na plán. Odkaz nese jen čísla z kalkulačky (`/plan?v=100000&m=3000&r=20&etf=VOO`), žádný e-mail ani jiný osobní údaj → není potřeba databáze.

### Formulář
Jedno pole **e-mail** + povinný checkbox „Souhlasím se zpracováním e-mailu za účelem zaslání plánu“ (odkaz na zásady) + nepovinný checkbox „Chci občas tipy k investování“ (oddělený marketingový souhlas). Kontakt jde do seznamu v Brevo. Honeypot proti botům, bez CAPTCHA.

### Datový model – `data/etf-snapshot.json`
```json
{
  "snapshotDate": "2026-10-12",
  "performanceAsOf": "2026-09-30",
  "funds": [
    {
      "ticker": "VOO",
      "name": "Vanguard S&P 500 ETF",
      "exchange": "NYSE Arca",
      "exchangeSource": "https://www.nasdaqtrader.com/dynamic/SymDir/otherlisted.txt",
      "index": "S&P 500",
      "ter": 0.03,
      "aum": { "value": 1.0e12, "currency": "USD", "asOf": "2026-08-31", "scope": "ETF share class" },
      "returnsNav": { "y1": 15.70, "y3": 22.85, "y5": 13.75, "y10": 15.29, "asOf": "2026-09-30" },
      "source": { "url": "https://investor.vanguard.com/investment-products/etfs/profile/voo", "retrieved": "2026-10-12" },
      "ucits": [
        { "ticker": "VUAA", "isin": "IE00BFMXXD54", "name": "Vanguard S&P 500 UCITS ETF (USD) Acc", "ter": 0.07, "distribution": "acc",
          "source": { "url": "https://fund-docs.vanguard.com/SandP_500_UCITS_ETF_USD_Accumulating_9694_EU_INT_EN.pdf", "retrieved": "2026-10-12" },
          "brokers": [ { "id": "xtb", "verified": "2026-10-12", "evidence": "url|screenshot" } ] }
      ]
    }
  ],
  "bankFunds": [
    { "id": "top-stocks", "name": "Top Stocks", "manager": "Erste Asset Management", "isin": "CZ0008472404",
      "entryFee": 3.0, "ongoing": 2.18, "transaction": 0.13, "kidDate": "2023-05-22", "source": { "url": "…", "retrieved": "2026-10-12" } }
  ],
  "assumptions": { "grossReturn": 6.0, "fxFee": 0.5 }
}
```
Data se stahují skriptem `scripts/fetch-data` (surové odpovědi do `data/raw/`), stránka čte jen JSON → každé číslo na stránce má zdroj a datum.

### Měření – Umami Cloud (zdůvodnění)
**Umami** místo PostHogu: bez cookies a bez osobních údajů už z principu (FAQ Umami), Hobby plán zdarma 100 tis. událostí/měsíc, 1 web, 6 měsíců historie, funnel a UTM reporty (https://umami.is/pricing, 12. 10. 2026). Skript má jednotky kB → nepoškodí Lighthouse. PostHog umí víc (session replay), ale cookieless režim je dodatečné nastavení a SDK je výrazně těžší; pro lead-gen funnel zbytečné. **[ČÁSTEČNĚ]** – detail funnel reportu (počet kroků, custom events jako kroky) ověřím při implementaci; záloha = PostHog cookieless.

Události (názvy v Umami, všechny nesou `variant` a UTM):

| Událost | Kdy |
|---|---|
| `landing` | načtení stránky (+ utm_source/medium/campaign/content, varianta) |
| `scroll_25` / `scroll_50` / `scroll_75` | dosažení hloubky |
| `cta_click` | klik na hlavní CTA (`location`: hero/sticky/compare/plan) |
| `calc_interact` | první změna vstupu kalkulačky |
| `calc_result_view` | výsledek kalkulačky ve viewportu ≥ 1 s |
| `compare_interact` | výběr / rozkliknutí ETF ve srovnání (`ticker`) |
| `email_focus` | focus do pole e-mail (`location`) |
| `form_error` | chyba validace / API (`type`) |
| `lead_submit` | úspěšné odeslání (`location`, `etf`) |
| `pdf_download` | stažení PDF |

**Funnel v Umami:** `landing` → `calc_result_view` **nebo** `compare_interact` → `email_focus` → `lead_submit` (+ zvlášť `lead_submit` → `pdf_download`). Segmentace podle `variant`.

### Odhad konverze (návštěva → odeslaný e-mail)
Kotva: Unbounce – investice 3,9 % medián, finance celkem 8,3 %, paid social ve financích 9,3 %. Naše výhody: 1 pole, hodnota před formulářem, message match. Nevýhoda: studený provoz, neznámá značka.

| Krok | z předchozího | kumulativně ze 100 návštěv |
|---|---|---|
| Příchod | – | 100 |
| Zůstane > 5 s / scroll 25 % | 60 % | 60 |
| Uvidí výsledek nebo interaguje se srovnáním | 70 % | 42 |
| Focus do e-mailu | 30 % | 12,6 |
| Odeslání | 45 % | **≈ 5,7 %** |

**Očekávaná konverze: 5–6 %** (pesimisticky 3,5 % ≈ medián investic, optimisticky 9 % ≈ medián paid social ve financích). [PŘEDPOKLAD – mezikroky jsou odhad, ověří se po prvních ~1 000 návštěvách]

### 3 hypotézy A/B testu (seřazeno podle očekávaného dopadu)
1. **E-mail přímo v hero pod výsledkem** vs. formulář až pod kalkulačkou. Očekávaný dopad nejvyšší – mobilní návštěvník ze sociálních sítí z velké části nescrolluje; formulář v prvním viewportu zvětší krok „focus“.
2. **Lead magnet „plán na míru vašemu ETF“ (s ukázkou vašeho UCITS tickeru, zbytek za e-mail)** vs. obecné „PDF průvodce“. Konkrétní, personalizovaný slib zvyšuje vnímanou hodnotu.
3. **Hero varianta B (srovnání) i pro provoz z reklamy A** – tj. test, zda zvědavost („VOO z Česka nekoupíte“) táhne víc než strach z poplatků. Dopad nejnejistější, proto poslední.

---

## 3. Definition of Done („zítra by šlo spustit reklamu“)

- [ ] Stránka na Vercelu (veřejná URL), vlastní doména není nutná.
- [ ] Obě varianty hero fungují podle `utm_content`, výchozí = A.
- [ ] Kalkulačka: výsledek bez formuláře, graf, předvyplněné hodnoty, funguje na 360 px.
- [ ] Srovnání 5 ETF + UCITS ekvivalenty, u každého čísla zdroj a datum.
- [ ] Formulář: e-mail + souhlas; validace; **e-mail reálně doručen** (Brevo, test na Gmail + Seznam), kontakt v Brevo seznamu.
- [ ] Plán na stránce + PDF ke stažení (česká diakritika v PDF OK).
- [ ] Umami: všech 10 událostí přichází, funnel je nastavený a viditelný (screenshot v README).
- [ ] Lighthouse mobil ≥ 90 ve všech 4 kategoriích (screenshot/JSON v repu).
- [ ] Bez cookies (ověřeno v DevTools), takže bez cookie lišty.
- [ ] Právní: „Nejde o investiční doporučení“, minulá výkonnost ≠ budoucí, stránka Zpracování osobních údajů, TrustOne jasně „není banka ani broker“, zdroje dat s datem.
- [ ] `ads/` – obě reklamy (texty + vizuály 1080×1350 a 1080×1920) bez cizích log.
- [ ] README česky: cílovka, výměna za kontakt a moment žádosti, pořadí sekcí + zdůvodnění, očekávaná konverze, 3 hypotézy, odkazy (repo + URL), zdroje.
- [ ] `ai-log/` – export konverzace (`/export`, spouštíš ty).
- [ ] Průběžná historie commitů (ne jeden velký).

## 4. Plán commitů

1. `docs: zadání a plán s ověřenými fakty` (tento soubor + 00-zadani.md)
2. `chore: Next.js + Tailwind + TypeScript kostra, Vercel config`
3. `data: skript na stažení dat emitentů + snímek etf-snapshot.json se zdroji`
4. `feat: výpočetní jádro kalkulačky + testy`
5. `feat: hero s message match (A/B podle UTM)`
6. `feat: kalkulačka s grafem`
7. `feat: srovnání NYSE ETF a UCITS ekvivalentů`
8. `feat: formulář + API route na Brevo (kontakt + transakční e-mail)`
9. `feat: stránka plánu + generování PDF`
10. `feat: měření Umami (události, scroll, UTM)`
11. `content: FAQ, zdroje, právní texty, zásady zpracování údajů`
12. `ads: dvě verze reklamy (texty + vizuály)`
13. `perf: optimalizace pro Lighthouse mobil`
14. `docs: README (zdůvodnění, konverze, hypotézy, odkazy)`
15. `chore: ai-log export`

**Odchylka od schválené koncepce:** čistý statický export (`output: 'export'`) neumí serverovou funkci, a API klíč k Brevo nesmí být v prohlížeči. Návrh: Next.js bez `output: 'export'`, všechny stránky předrenderované staticky (stejný výkon), plus jedna route `/api/lead` jako Vercel Function. Alternativa: statický export + samostatná funkce v `/api` mimo Next.

---

## 5. Otevřené otázky

1. **Dostupnost UCITS ETF u brokerů** (XTB CZ, Trading 212, Fio, Portu) – ověříme ručně v aplikacích? Máš u některého účet pro screenshot?
2. **Brevo**: máš účet? Potřebuju API klíč a ověřenou odesílací adresu/doménu (jinak e-maily padají do spamu).
3. **Umami Cloud**: založíš účet, nebo mám připravit vše a ty jen vložíš website ID?
4. **Výchozí bankovní fond v kalkulačce:** Top Stocks (konzervativní) – OK?
5. **Odchylka stacku** (Next.js s jednou API route místo čistého statického exportu) – OK?
6. **Riziko investičního poradenství** – souhlasíš s formulací plánu jako „modelový výpočet a přehled možností“, ne „doporučení“?
7. Reklamní vizuály: stačí statické obrázky (PNG z HTML/SVG), nebo chceš i video/carousel?
