import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync, readFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const RAW = join(ROOT, "data", "raw");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130 Safari/537.36";
const today = new Date().toISOString().slice(0, 10);
mkdirSync(RAW, { recursive: true });

const evidence = [];

async function get(url, init = {}) {
  const res = await fetch(url, { ...init, headers: { "User-Agent": UA, ...(init.headers ?? {}) } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res;
}

async function text(url) {
  return (await get(url)).text();
}

async function json(url) {
  return (await get(url)).json();
}

async function pdfText(url) {
  const buf = Buffer.from(await (await get(url)).arrayBuffer());
  const dir = mkdtempSync(join(tmpdir(), "etfpdf-"));
  const file = join(dir, "doc.pdf");
  writeFileSync(file, buf);
  const out = execFileSync("pdftotext", ["-enc", "UTF-8", "-layout", file, "-"]).toString("utf8");
  return { out, sha256: createHash("sha256").update(buf).digest("hex") };
}

function plain(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#34;|&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");
}

function grab(src, re, label, url) {
  const m = src.match(re);
  if (!m) throw new Error(`Nenalezeno: ${label} v ${url}`);
  evidence.push({ label, url, excerpt: m[0].slice(0, 400) });
  return m;
}

function num(s) {
  return Number(String(s).replace(/[,\s]/g, ""));
}

function src(url, note) {
  return { url, retrieved: today, ...(note ? { note } : {}) };
}

const isoDate = (s) => new Date(`${s} UTC`).toISOString().slice(0, 10);

async function exchanges() {
  const url = "https://www.nasdaqtrader.com/dynamic/SymDir/otherlisted.txt";
  const body = await text(url);
  const map = {};
  for (const line of body.split(/\r?\n/)) {
    const [sym, name, exch] = line.split("|");
    if (["SPY", "IVV", "VOO", "VT", "VWO"].includes(sym)) {
      map[sym] = exch;
      evidence.push({ label: `exchange ${sym}`, url, excerpt: line });
    }
  }
  const created = body.match(/File Creation Time: (\d{2})(\d{2})(\d{4})/);
  return { map, fileDate: created ? `${created[3]}-${created[1]}-${created[2]}` : today, url };
}

async function spy() {
  const url = "https://www.ssga.com/us/en/intermediary/etfs/state-street-spdr-sp-500-etf-trust-spy";
  const t = plain(await text(url));
  const ter = grab(t, /Gross Expense Ratio[\s\S]{0,400}?"originalValue":"([\d.]+)"/, "SPY gross expense ratio", url);
  const aum = grab(t, /Assets Under Management","value":"[^"]*","asOfDate":"as of ([A-Za-z]{3} \d{2} \d{4})"[^}]*"originalValue":"([\d.]+)"/, "SPY AUM", url);
  const perf = grab(
    t,
    /1 Year 3 Year 5 Year 10 Year Since Inception [A-Za-z]{3} \d{2} \d{4} Fund Before Tax NAV ([A-Za-z]{3} \d{2} \d{4}) (-?[\d.]+)% (-?[\d.]+)% (-?[\d.]+)% (-?[\d.]+)% (-?[\d.]+)% (-?[\d.]+)% (-?[\d.]+)% (-?[\d.]+)%/,
    "SPY NAV performance (1M 3M YTD 1Y 3Y 5Y 10Y SI)",
    url,
  );
  return {
    ter: num(ter[1]),
    aum: { value: num(aum[2]), currency: "USD", asOf: isoDate(aum[1]), scope: "fond celkem" },
    returnsNav: { y1: num(perf[5]), y3: num(perf[6]), y5: num(perf[7]), y10: num(perf[8]), asOf: isoDate(perf[1]) },
    source: src(url, "Sloupce výkonnosti na webu: 1M, 3M, YTD, 1R, 3R, 5R, 10R, od založení – bereme 1R až 10R."),
  };
}

async function ishares(url, label) {
  const t = plain(await text(url));
  return { t, url, label };
}

async function ivv() {
  const { t, url } = await ishares("https://www.ishares.com/us/products/239726/ishares-core-sp-500-etf", "IVV");
  const ter = grab(t, /Expense Ratio: Fees as stated in the prospectus ([\d.]+)%/, "IVV expense ratio", url);
  const aum = grab(t, /Net Assets of Fund \$([\d,]+) as of ([A-Za-z]{3} \d{2}, \d{4})/, "IVV net assets", url);
  const perf = grab(
    t,
    /Average Annual Cumulative Calendar Year As of Dates ([A-Za-z]{3} \d{2}, \d{4}) [\s\S]{0,200}?1y 3y 5y 10y Incept\. (-?[\d.]+) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+)/,
    "IVV average annual total return NAV",
    url,
  );
  return {
    ter: num(ter[1]),
    aum: { value: num(aum[1]), currency: "USD", asOf: isoDate(aum[2].replace(",", "")), scope: "fond celkem" },
    returnsNav: { y1: num(perf[2]), y3: num(perf[3]), y5: num(perf[4]), y10: num(perf[5]), asOf: isoDate(perf[1].replace(",", "")) },
    source: src(url),
  };
}

function parseMoney(s) {
  const m = s.match(/\$([\d.]+)\s*(trillion|billion|million)/);
  const mult = { trillion: 1e12, billion: 1e9, million: 1e6 }[m[2]];
  return Math.round(Number(m[1]) * mult);
}

async function vanguardUs(ticker) {
  const base = `https://investor.vanguard.com/vmf/api/${ticker}`;
  const page = `https://investor.vanguard.com/investment-products/etfs/profile/${ticker.toLowerCase()}`;
  const profile = (await json(`${base}/profile`)).fundProfile;
  const perf = (await json(`${base}/performance`)).quarterEndAvgAnnualRtn;
  const chr = JSON.stringify(await json(`${base}/characteristic`));
  const share = chr.match(/"shareClassTotalNetAssets":"([^"]+)","shareClassTotalNetAssetsDate":"(\d{4}-\d{2}-\d{2})/);
  evidence.push({ label: `${ticker} profile`, url: `${base}/profile`, excerpt: `expenseRatio=${profile.expenseRatio} asOf=${profile.expenseRatioAsOfDate}` });
  evidence.push({ label: `${ticker} performance`, url: `${base}/performance`, excerpt: JSON.stringify(perf.fundReturn) });
  evidence.push({ label: `${ticker} share class assets`, url: `${base}/characteristic`, excerpt: share[0] });
  const f = perf.fundReturn;
  return {
    ter: num(profile.expenseRatio),
    aum: { value: parseMoney(share[1]), currency: "USD", asOf: share[2], scope: "třída ETF" },
    returnsNav: { y1: num(f.oneYrPct), y3: num(f.threeYrPct), y5: num(f.fiveYrPct), y10: num(f.tenYrPct), asOf: perf.asOfDate.slice(0, 10) },
    source: src(page, `Data z JSON API stránky emitenta: ${base}/profile, /performance, /characteristic`),
  };
}

async function cspx() {
  const url = "https://www.ishares.com/uk/individual/en/products/253743/ishares-sp-500-b-ucits-etf-acc-fund";
  const t = plain(await text(url));
  const ter = grab(t, /Total Expense Ratio ([\d.]+)%/, "CSPX TER", url);
  const aum = grab(t, /Net Assets of Fund as of (\d{2})\/([A-Za-z]{3})\/(\d{4}) USD ([\d,]+)/, "CSPX net assets", url);
  return {
    ter: num(ter[1]),
    aum: { value: num(aum[4]), currency: "USD", asOf: isoDate(`${aum[2]} ${aum[1]} ${aum[3]}`), scope: "fond celkem" },
    source: src(url),
  };
}

async function spyl() {
  const url = "https://www.ssga.com/ie/en_gb/intermediary/etfs/state-street-spdr-sp-500-ucits-etf-acc-spyl-gy";
  const raw = (await text(url)).replace(/&#34;/g, '"');
  const ter = grab(raw, /"total-expense-ratio":\{"label":"TER","value":"([\d.]+)%"/, "SPYL TER", url);
  return { ter: num(ter[1]), aum: null, source: src(url) };
}

async function vanguardUcits(file, label) {
  const url = `https://fund-docs.vanguard.com/${file}`;
  const { out } = await pdfText(url);
  const ocf = grab(out, /Ongoing Charges Figure\S*\s+([\d.]+)%/, `${label} OCF`, url);
  const aum = grab(out, /Share class assets \(million\) \$([\d,]+) as at (\d{1,2} [A-Za-z]+ \d{4})/, `${label} share class assets`, url);
  return {
    ter: num(ocf[1]),
    aum: { value: num(aum[1]) * 1e6, currency: "USD", asOf: isoDate(aum[2]), scope: "třída fondu" },
    source: src(url, "Factsheet emitenta (PDF)"),
  };
}

async function csobKid() {
  const url = "https://multimediafiles.kbcgroup.eu/ng/feed/am/funds/KID/KID_CZ0008477098_CS.PDF";
  const { out, sha256 } = await pdfText(url);
  const t = out.replace(/\s+/g, " ");
  const date = grab(t, /Datum vypracování nebo poslední úpravy: (\d{1,2})\. (\S+) (\d{4})/, "ČSOB KID datum", url);
  const entry = grab(t, /Náklady na vstup Max\. ([\d,]+)%/, "ČSOB vstupní náklady", url);
  const ongoing = grab(t, /provozní náklady ([\d,]+)% hodnoty Vaší investice za rok|správní nebo ([\d,]+)% hodnoty Vaší investice za rok/, "ČSOB průběžné náklady", url);
  const trans = grab(t, /Transakční náklady ([\d,]+)% hodnoty Vaší investice za rok/, "ČSOB transakční náklady", url);
  const hold = grab(t, /Doporučená doba držení:? ?(\d+) (?:let|roky|roků)/, "ČSOB doporučená doba držení", url);
  const months = { ledna: 1, února: 2, března: 3, dubna: 4, května: 5, června: 6, cervna: 6, července: 7, srpna: 8, září: 9, října: 10, listopadu: 11, prosince: 12 };
  const mm = String(months[date[2]] ?? 0).padStart(2, "0");
  const cz = (s) => Number(s.replace(",", "."));
  return {
    entry: cz(entry[1]),
    ongoing: cz(ongoing[1] ?? ongoing[2]),
    transaction: cz(trans[1]),
    recommendedHoldingYears: Number(hold[1]),
    kidDate: `${date[3]}-${mm}-${date[1].padStart(2, "0")}`,
    pdfSha256: sha256,
    source: src(url, "Sdělení klíčových informací (PRIIPs KID), oddíl Skladba nákladů"),
  };
}

const ex = await exchanges();
const exchangeName = (code) => ({ P: "NYSE Arca", N: "NYSE" })[code] ?? `kód ${code}`;
const exchangeSource = src(ex.url, `Oficiální adresář Nasdaq Trader, soubor ze dne ${ex.fileDate}; sloupec Exchange: P = NYSE Arca`);

const justEtf = (isin) => `https://www.justetf.com/en/etf-profile.html?isin=${isin}`;

const [spyData, ivvData, vooData, vtData, vwoData, cspxData, spylData, vuaaData, vwceData, vfeaData, csob] = await Promise.all([
  spy(),
  ivv(),
  vanguardUs("VOO"),
  vanguardUs("VT"),
  vanguardUs("VWO"),
  cspx(),
  spyl(),
  vanguardUcits("SandP_500_UCITS_ETF_USD_Accumulating_9694_EU_INT_EN.pdf", "VUAA"),
  vanguardUcits("FTSE_All-World_UCITS_ETF_USD_Accumulating_9679_EU_INT_EN.pdf", "VWCE"),
  vanguardUcits("FTSE_Emerging_Markets_UCITS_ETF_USD_Accumulating_9678_EU_INT_EN.pdf", "VFEA"),
  csobKid(),
]);

const fund = (ticker, name, index, issuer, data, ucits) => ({
  ticker,
  name,
  issuer,
  index,
  exchange: exchangeName(ex.map[ticker]),
  exchangeSource,
  ...data,
  ucits: { ...ucits, justEtfUrl: justEtf(ucits.isin) },
});

const etf = {
  snapshotDate: today,
  note: "Čísla načtena skriptem scripts/fetch-data.mjs ze surových dat emitentů (HTML, JSON API, PDF). Důkazní výňatky v data/raw/evidence.json.",
  funds: [
    fund("VOO", "Vanguard S&P 500 ETF", "S&P 500", "Vanguard", vooData, {
      ticker: "VUAA", isin: "IE00BFMXXD54", name: "Vanguard S&P 500 UCITS ETF (USD) Accumulating", index: "S&P 500", distribution: "akumulační", domicile: "Irsko", ...vuaaData,
    }),
    fund("SPY", "SPDR S&P 500 ETF Trust", "S&P 500", "State Street", spyData, {
      ticker: "SPYL", isin: "IE000XZSV718", name: "SPDR S&P 500 UCITS ETF (Acc)", index: "S&P 500", distribution: "akumulační", domicile: "Irsko", ...spylData,
    }),
    fund("IVV", "iShares Core S&P 500 ETF", "S&P 500", "iShares (BlackRock)", ivvData, {
      ticker: "CSPX", isin: "IE00B5BMR087", name: "iShares Core S&P 500 UCITS ETF USD (Acc)", index: "S&P 500", distribution: "akumulační", domicile: "Irsko", ...cspxData,
    }),
    fund("VT", "Vanguard Total World Stock ETF", "FTSE Global All Cap", "Vanguard", vtData, {
      ticker: "VWCE", isin: "IE00BK5BQT80", name: "Vanguard FTSE All-World UCITS ETF (USD) Accumulating", index: "FTSE All-World", distribution: "akumulační", domicile: "Irsko", ...vwceData,
      indexNote: "VT sleduje širší FTSE Global All Cap (i malé firmy), VWCE sleduje FTSE All-World (velké a střední firmy). Podobná expozice, ne identický index.",
    }),
    fund("VWO", "Vanguard FTSE Emerging Markets ETF", "FTSE Emerging Markets All Cap China A Inclusion", "Vanguard", vwoData, {
      ticker: "VFEA", isin: "IE00BK5BR733", name: "Vanguard FTSE Emerging Markets UCITS ETF (USD) Accumulating", index: "FTSE Emerging", distribution: "akumulační", domicile: "Irsko", ...vfeaData,
      indexNote: "VWO sleduje FTSE Emerging Markets All Cap China A Inclusion, UCITS verze FTSE Emerging. Podobná expozice, ne identický index.",
    }),
  ],
};

const fees = {
  snapshotDate: today,
  bankFund: {
    id: "csob-akciovy-zodpovedny",
    name: "ČSOB Akciový zodpovědný",
    manager: "ČSOB Asset Management, a.s., investiční společnost",
    isin: "CZ0008477098",
    ...csob,
    note: "Výchozí srovnání. Aktuální KID fondu Top Stocks (Erste/ČS) z roku 2026 nebyl veřejně dohledatelný, proto podle rozhodnutí v README používáme tento fond. Ve výpočtu: vstupní poplatek z každého vkladu + průběžné náklady ročně. Transakční náklady do výpočtu nezahrnujeme (konzervativně).",
  },
  etfSide: {
    brokerCostPerDeposit: 0.5,
    note: "Předpoklad, ne údaj konkrétního brokera: 0,5 % z každého vkladu na konverzi měny a poplatky. Neuvádíme konkrétní brokery (dostupnost neověřena).",
  },
  assumptions: {
    grossReturn: 6,
    note: "Modelový roční výnos před náklady 6 % p. a. – stejný pro obě varianty, aby rozdíl ukazoval jen vliv nákladů. Nejde o predikci ani slib výnosu.",
  },
  defaultEtf: "IVV",
};

writeFileSync(join(ROOT, "data", "etf.json"), JSON.stringify(etf, null, 2) + "\n");
writeFileSync(join(ROOT, "data", "fees.json"), JSON.stringify(fees, null, 2) + "\n");
writeFileSync(join(RAW, "evidence.json"), JSON.stringify({ retrieved: today, items: evidence }, null, 2) + "\n");
console.log(`OK: ${etf.funds.length} fondů, ${evidence.length} důkazních výňatků, KID ČSOB ${csob.kidDate}`);
JSON.parse(readFileSync(join(ROOT, "data", "etf.json"), "utf8"));
