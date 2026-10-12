# TrustOne – konverzní landing page se srovnáním ETF

Lead magnet pro českého drobného investora, který přichází z reklamy na Meta (mobil) a stránce věnuje pár sekund. Stránka okamžitě ukáže modelový rozdíl v nákladech mezi bankovním akciovým fondem a ETF, srovná 5 ETF z newyorské burzy s jejich evropskými (UCITS) verzemi a výměnou za e-mail nabídne **osobní přehled** (na stránce, v PDF a e-mailem).

- **Repozitář:** https://github.com/osho4753/etf-landing-page
- **Web:** https://etf-landing-page-three.vercel.app (varianta B: `?utm_content=b_compare`)
- **Reklamy:** [ads/README.md](ads/README.md) (obrázky 1080 × 1350 + texty pro Meta)
- **Zadání a plán s ověřenými fakty:** [docs/00-zadani.md](docs/00-zadani.md), [docs/01-plan.md](docs/01-plan.md)
- **Export konverzace s Claude Code:** [ai-log/](ai-log/)

TrustOne je fiktivní značka. Nevydává se za banku ani brokera a na stránce, v PDF i v reklamách je uvedeno, že nejde o investiční doporučení.

---

## 1. Cílová skupina

Čech 25–45 let, peníze má na spořicím účtu, ve stavebním spoření nebo v podílovém fondu od banky. Slyšel o ETF a S&P 500 (YouTube, kolegové, Reddit), zná tickery jako VOO nebo SPY, ale neví, který fond vybrat a jak ho z Česka koupit. Bojí se poplatků a „udělat chybu“. Přichází z Instagramu/Facebooku na mobilu a během 3–8 sekund se rozhoduje, jestli zůstane.

Z toho plyne: číslo, které odpovídá na otázku z reklamy, musí být vidět bez scrollování; formulář až ve chvíli, kdy má návštěvník svoje číslo; žádné registrace, telefony ani dotazníky.

## 2. Co návštěvník dostane a kdy žádáme o kontakt

**Zdarma a bez formuláře:** modelový výpočet v hero, kalkulačka s vlastními čísly a grafem, srovnání 5 ETF s evropskými verzemi (tickery, ISIN, TER, odkaz na justETF), vysvětlení, proč americká ETF z Česka většinou nekoupí.

**Za e-mail – „Osobní přehled“** (modelový výpočet a přehled možností, žádné „kupte X“):
1. jeho čísla, graf a rozdíl v nákladech,
2. vybrané NYSE ETF a jeho evropská verze (ISIN, TER, akumulace, odkaz na justETF),
3. obecný postup prvního nákupu v 6 krocích,
4. daně v ČR (časový test 3 roky, limit 100 000 Kč) se zdrojem,
5. zdroje a disclaimer.

**Kdy žádáme:** formulář je přímo pod výsledkem kalkulačky (moment nejvyšší motivace – „tohle je moje číslo“), u každé karty srovnání tlačítko „Přehled pro VOO → VUAA“, které předvybere ETF a skočí na formulář, a samostatná sekce „Co dostanete za e-mail“. Na mobilu se po odscrollování objeví spodní lišta „Osobní přehled zdarma“.

**Po odeslání:** přehled se **okamžitě** zobrazí na stránce (garantované doručení hodnoty), tlačítko stáhne PDF (generuje se v prohlížeči, font s českou diakritikou je vložený) a Brevo pošle e-mail s odkazem na přehled. Když e-mail selže, uživatel to nepozná – hodnotu už má.

**Formulář:** jedno pole (e-mail), jedno povinné potvrzení „Beru na vědomí zpracování e-mailu pro zaslání přehledu“ s odkazem na [/ochrana-udaju](src/app/ochrana-udaju/page.tsx) a samostatné **nepovinné, ve výchozím stavu nezaškrtnuté** políčko pro marketing (atribut `MARKETING`). Validace na klientu i serveru, stavy odesílám / hotovo / chyba, honeypot proti botům. Funguje i bez JavaScriptu (klasický POST → přesměrování na `/prehled`).

## 3. Pořadí sekcí a proč

Dvě varianty podle reklamy (message match). Přepíná je `src/proxy.ts` podle `utm_content` (`b…` → statická stránka `/b`, jinak `/`), obě jsou předgenerované, takže bez probliknutí a bez JS.

| # | Varianta A – „poplatky“ | Varianta B – „srovnání“ | Proč tady |
|---|---|---|---|
| 1 | **Hero:** „Kolik vám za 20 let sní poplatky fondu?“ + modelový rozdíl ≈ 505 000 Kč, pruhy, CTA | **Hero:** „VOO, SPY, nebo VT? Tohle z Česka opravdu koupíte.“ + 3 dvojice tickerů s TER, CTA | Navazuje doslova na slib reklamy; odpověď je nad ohybem, hodnota je zřejmá před formulářem. |
| 2 | **Kalkulačka** + formulář pod výsledkem | **Proč VOO z Česka nekoupíte** (KID/PRIIPs ve 3 krocích) | A: návštěvník chce „svoje číslo“. B: překvapivá informace z reklamy potřebuje vysvětlení, jinak nevěří. |
| 3 | **Proč VOO z Česka nekoupíte** | **Srovnání 5 ETF ↔ UCITS** s CTA na každé kartě | A: druhá vrstva hodnoty pro ty, které čísla nezaujala. B: jádro slibu reklamy. |
| 4 | **Srovnání 5 ETF ↔ UCITS** | **Kalkulačka** + formulář | A: vstup ke kontaktu přes konkrétní fond. B: po výběru ETF si spočítá, kolik ušetří. |
| 5 | **Co dostanete za e-mail** + formulář | totéž | Pro váhající: konkrétně ukázat obsah přehledu a odstranit nejistotu („žádný poradce, který by volal“). |
| 6 | **FAQ** (kdo jsme, není to doporučení, proč 6 %, daně, spam) + CTA | totéž | Námitky řešené těsně před posledním CTA. |
| 7 | **Zdroje dat** + patička s právními texty | totéž | Důvěra a právní minimum; každé číslo má zdroj a datum. |

Po odeslání se mezi sekce 4 a 5 vloží **osobní přehled** a stránka na něj odroluje.

## 4. Data a zdroje

Všechna čísla načítá skript `npm run data` (`scripts/fetch-data.mjs`) ze **surových dat emitentů** (HTML, JSON API, PDF factsheety a KID) – ne ze sumarizací. Důvod: v kroku ověřování automatický sumarizátor posunul sloupce výkonnosti u SPY; chyba se odhalila porovnáním s VOO (stejný index). Výstup:

- `data/etf.json` – 5 ETF z NYSE Arca (SPY, IVV, VOO, VT, VWO): burza (adresář Nasdaq Trader), TER, aktiva, výkonnost NAV k 30. 9. 2026, UCITS ekvivalent (SPYL, CSPX, VUAA, VWCE, VFEA) s TER, ISIN a odkazem na justETF. Každá hodnota má URL zdroje, datum a poznámku.
- `data/fees.json` – bankovní fond z KID, předpoklady výpočtu.
- `data/raw/evidence.json` – důkazní výňatky ze zdrojů (34 položek).

Testy (`npm test`) hlídají výpočet i to, že čísla v reklamách odpovídají datům.

## 5. Rozhodnutí

| Rozhodnutí | Důvod |
|---|---|
| **Konkrétní brokery neuvádíme.** Text „u brokerů, kteří nabízejí UCITS ETF“ + u každého UCITS ETF odkaz na justETF. | Dostupnost konkrétních fondů u konkrétních brokerů se nepodařilo ověřit z primárních zdrojů. |
| **Srovnávací bankovní fond: ČSOB Akciový zodpovědný** (KID ze dne 1. 6. 2026; vstup max. 3 %, průběžné náklady 2,65 % ročně). | Preferovaný Top Stocks (Erste/ČS) nemá veřejně dohledatelný KID z roku 2026 (nalezený dokument z 2026 je factsheet, KID je z 22. 5. 2023). Transakční náklady (0,42 %) nezapočítáváme – konzervativně. |
| **Modelový výnos 6 % p. a.** pro obě varianty, náklady brokera 0,5 % z vkladu (předpoklad). | Rozdíl tak ukazuje jen vliv nákladů; předpoklady jsou pod grafem, v hero, v PDF i v reklamě. |
| **Lead magnet jako „Osobní přehled“** – modelový výpočet a přehled možností. | Konkrétní doporučení nákupu by se blížilo investičnímu poradenství, na které TrustOne nemá oprávnění. |
| **Next.js se statickými stránkami + jedna serverová funkce `/api/lead`.** | API klíč k Brevo nesmí být v prohlížeči; čistý statický export by serverovou funkci neuměl. |
| **Umami (cookieless)** místo PostHogu. | Bez cookies → bez cookie lišty; skript má jednotky kB; funnel a UTM v bezplatném plánu. |
| **Lead se ukládá do Brevo** (seznam „TrustOne leads“) s atributy `VARIANTA, ETF, VKLAD_START, VKLAD_MESIC, HORIZONT, ROZDIL, ZDROJ_FORM, LEAD_CAS, MARKETING`. Když uložení selže, data se zapíšou do logu Vercelu (`lead_backup`). | Žádná vlastní databáze; uživatel hodnotu dostane vždy. |
| **Graf jako vlastní SVG**, PDF přes `pdf-lib` načtené až po kliknutí. | Nula kB JavaScriptu navíc při načtení stránky. |

## 6. Měření

Umami Cloud, bez cookies. Všechny události nesou `variant` (a/b), `page` a UTM parametry z URL; `landing` navíc referrer.

| Událost | Kdy vzniká |
|---|---|
| `landing` | načtení stránky (+ `utm_source/medium/campaign/content`) |
| `scroll_25` / `scroll_50` / `scroll_75` | dosažení hloubky stránky |
| `cta_click` | klik na CTA (`location`: hero / compare / faq / sticky) |
| `calc_interact` | **první vlastní změna** jezdce kalkulačky |
| `calc_result_view` | výsledek kalkulačky ve viewportu ≥ 1 s **až po** `calc_interact` (modelový příklad v hero ani pasivní scroll ji nevyvolají – ověřeno e2e testem) |
| `compare_interact` | výběr ETF ve srovnání nebo v kalkulačce, klik na justETF (`ticker`, `action`) |
| `email_focus` | první focus do pole e-mail (`location`) |
| `form_error` | chyba validace / sítě / PDF (`type`) |
| `lead_submit` | úspěšné uložení kontaktu, jednou na odeslání (`location`, `etf`, `flow`). `flow: inline` – formulář s JS, přehled se ukáže na stejné stránce. `flow: redirect` – formulář odeslaný bez JS nebo před hydratací; server přesměruje na `/prehled?…&odeslano=1` s variantou a UTM z refereru, událost odejde až tam a parametr `odeslano` se z URL odstraní, aby ji reload nezopakoval. |
| `pdf_download` | stažení PDF |

**Definice funnelu (Umami → Reports → Funnel, okno 30 minut).** Krok v Umami je URL nebo událost a nepodporuje „nebo“, proto dvě cesty a jedna souhrnná:

1. **Kalkulačka:** `landing` → `calc_interact` → `email_focus` → `lead_submit`
2. **Srovnání:** `landing` → `compare_interact` → `email_focus` → `lead_submit`
3. **Souhrn:** `landing` → `email_focus` → `lead_submit` → `pdf_download`

**Poslední krok funnelu je `lead_submit`, ne zobrazení `/prehled`.** Při běžném odeslání s JS se na `/prehled` vůbec nepřechází (přehled se zobrazí na landing page), takže pageview `/prehled` by zachytil jen menšinovou cestu bez JS a navíc i otevření odkazu z e-mailu. `lead_submit` vzniká v obou cestách právě jednou a až po úspěšné odpovědi `/api/lead`; ověřuje `npm run e2e:lead` (Playwright zachytí požadavky na Umami `/api/send`).

Konverze = `lead_submit` / `landing`. Varianty reklamy se porovnávají filtrem `variant` / `utm_content`. Do funnelu záměrně nebereme `calc_result_view`, protože interakci neprokazuje tak jednoznačně jako `calc_interact`.

**Funnel v Umami na produkci (kalkulačková cesta):**

![Funnel v Umami: / → calc_interact → email_focus → lead_submit](docs/screenshots/umami-funnel.png)

> **Pozor: nejde o reálný provoz.** Screenshot zachycuje jen mé vlastní testovací průchody (6 návštěv), žádné návštěvníky z reklamy. Čísla v něm (např. 50 % na `lead_submit`) proto o konverzi nic neříkají. Screenshot dokládá jen to, že měření funguje od příchodu na stránku až po odeslání formuláře. Očekávaná konverze je odhad v [kapitole 7](#7-očekávaná-konverze).

## 7. Očekávaná konverze

Kotva: Unbounce Conversion Benchmark Report (finance, aktualizace 25. 2. 2026) – medián finančních služeb 8,3 %, podkategorie investic 3,9 %, placené sociální sítě ve financích 9,3 %; ve financích konvertuje mobil lépe než desktop. Naše výhody: jedno pole, hodnota před formulářem, message match. Nevýhody: studený provoz, neznámá značka.

| Krok | z předchozího | ze 100 návštěv |
|---|---|---|
| Příchod (`landing`) | – | 100 |
| Zůstane / scroll 25 % | 60 % | 60 |
| Vlastní výpočet nebo interakce se srovnáním | 70 % | 42 |
| Focus do e-mailu | 30 % | 12,6 |
| Odeslání | 45 % | **≈ 5,7 %** |

**Očekávaná konverze návštěva → lead: 5–6 %** (pesimisticky 3,5 % ≈ medián investic, optimisticky 9 % ≈ medián paid social ve financích). Mezikroky jsou odhad; ověří se po prvních ~1 000 návštěvách.

## 8. Tři hypotézy na A/B test (podle očekávaného dopadu)

1. **E-mail přímo v hero pod modelovým číslem** vs. formulář až pod kalkulačkou. Většina mobilních návštěvníků ze sociálních sítí nescrolluje; formulář v prvním viewportu zvětší krok „focus“. Očekávaný dopad nejvyšší.
2. **Personalizovaný slib s ukázkou** („Váš ETF: VOO → VUAA, 0,07 %. Celý přehled vám pošleme.“) vs. obecné „Osobní přehled zdarma“. Konkrétní, viditelně „můj“ obsah zvyšuje vnímanou hodnotu výměny.
3. **Hero B (zvědavost „VOO z Česka nekoupíte“) i pro provoz z reklamy A** vs. hero A (strach z poplatků). Nejnejistější dopad, protože mění message match – proto poslední.

## 9. Kvalita

- **Lighthouse mobil** (simulovaný mobil / pomalé 4G, Umami při měření blokované, aby test neznečistil data):

  | | Výkon | Přístupnost | Best practices | SEO | LCP | CLS |
  |---|---|---|---|---|---|---|
  | Produkce (Vercel), A – medián ze 3 | 92 | 100 | 100 | 100 | 3,1 s | 0 |
  | Produkce (Vercel), B – medián ze 3 | 90 | 100 | 100 | 100 | 3,1 s | 0 |
  | Lokálně (`next start`), A / B – medián z 5 | 96 / 97 | 100 | 100 | 100 | 2,4 s | 0 |

  Všechny produkční běhy 90–92, lokální 94–97. Reporty: [docs/lighthouse/produkce](docs/lighthouse/produkce/), [docs/lighthouse/lokalne](docs/lighthouse/lokalne/); spuštění `npm run lighthouse` (`BASE_URL=… OUT_DIR=…`).
- **E2E** `npm run e2e` (Playwright, 390 px): průchod hero → kalkulačka → srovnání → chybový stav formuláře → odeslání → přehled → PDF; kontrola, že pasivní scroll nevyvolá události kalkulačky. Umami je blokované a `/api/lead` mockované. Screenshoty: [docs/screenshots/](docs/screenshots/).
- **Bez JS:** hlavní texty, modelové číslo, srovnání i disclaimery jsou ve statickém HTML; formulář funguje klasickým POSTem.
- **Bez cookies:** Umami ani stránka cookies nepoužívají, proto bez cookie lišty.

## 10. Spuštění

```bash
npm install
cp .env.example .env.local   # BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_LIST_ID, NEXT_PUBLIC_UMAMI_WEBSITE_ID
npm run dev                  # vývoj
npm test                     # výpočet + čísla v reklamách
npm run build && npx next start -p 3100
npm run e2e                  # vyžaduje běžící server na :3100
npm run lighthouse           # vyžaduje běžící server na :3100 (nebo BASE_URL) a Chrome
npm run data                 # znovu stáhne data emitentů (vyžaduje pdftotext)
npm run ads                  # vyrenderuje reklamy do PNG
```

V Brevo je potřeba vytvořit seznam a atributy kontaktu uvedené v kapitole 5 a ověřit odesílací adresu. Bez proměnných prostředí stránka funguje, lead se jen zapíše do logu.

## 11. Právní minimum

„Nejde o investiční doporučení“ v hero, pod kalkulačkou, v přehledu, PDF, reklamách i patičce; upozornění, že minulá ani modelová výkonnost nezaručuje budoucí výnosy; stránka [Ochrana osobních údajů](src/app/ochrana-udaju/page.tsx); zdroje dat s datem u tabulky, grafu i v samostatné sekci. Právní posouzení skutečným právníkem je mimo rozsah tohoto testu.
