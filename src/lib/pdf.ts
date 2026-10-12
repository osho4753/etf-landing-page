import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { BUY_STEPS, TAX_RULES } from "@/content/overview";
import { compare, formatCzk, roundForDisplay, type CalcInput } from "./calc";
import { bankCost, bankFund, entryFeeLabel, etfCost, fees, findFund, formatDate, formatTer } from "./data";

const INK = rgb(0.059, 0.165, 0.133);
const SOFT = rgb(0.24, 0.32, 0.29);
const PINE = rgb(0.078, 0.325, 0.247);
const MINT = rgb(0.184, 0.561, 0.42);
const LOSS = rgb(0.76, 0.255, 0.047);
const PAPER = rgb(0.961, 0.941, 0.902);
const MINT_SOFT = rgb(0.847, 0.933, 0.89);
const GOLD = rgb(0.914, 0.725, 0.286);

const A4 = { w: 595.28, h: 841.89 };
const M = 48;

type Fonts = { regular: PDFFont; bold: PDFFont };

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const words = text.replace(/(\d) %/g, "$1\u00a0%").split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

class Writer {
  y: number;
  constructor(
    public page: PDFPage,
    public fonts: Fonts,
  ) {
    this.y = A4.h - M;
  }

  text(text: string, opts: { size?: number; bold?: boolean; color?: ReturnType<typeof rgb>; gap?: number; x?: number; width?: number } = {}) {
    const size = opts.size ?? 10.5;
    const font = opts.bold ? this.fonts.bold : this.fonts.regular;
    const x = opts.x ?? M;
    const width = opts.width ?? A4.w - M - x;
    for (const line of wrap(text, font, size, width)) {
      this.page.drawText(line, { x, y: this.y - size, size, font, color: opts.color ?? INK });
      this.y -= size * 1.4;
    }
    this.y -= opts.gap ?? 4;
  }

  space(h: number) {
    this.y -= h;
  }
}

function header(page: PDFPage, fonts: Fonts, pageNo: number) {
  page.drawRectangle({ x: 0, y: 0, width: A4.w, height: A4.h, color: rgb(1, 0.992, 0.973) });
  page.drawRectangle({ x: M, y: A4.h - M - 22, width: 22, height: 22, color: PINE });
  page.drawText("1", { x: M + 7.5, y: A4.h - M - 16.5, size: 14, font: fonts.bold, color: rgb(1, 1, 1) });
  page.drawCircle({ x: M + 17, y: A4.h - M - 17, size: 2.2, color: GOLD });
  page.drawText("TrustOne", { x: M + 30, y: A4.h - M - 16, size: 13, font: fonts.bold, color: INK });
  const tag = `Osobní přehled · strana ${pageNo}`;
  page.drawText(tag, { x: A4.w - M - fonts.regular.widthOfTextAtSize(tag, 9), y: A4.h - M - 15, size: 9, font: fonts.regular, color: SOFT });
}

function footer(page: PDFPage, fonts: Fonts) {
  const lines = wrap(
    "Modelový výpočet a přehled možností, nikoli investiční doporučení ani investiční poradenství. Minulá ani modelová výkonnost nezaručuje budoucí výnosy. TrustOne je fiktivní vzdělávací projekt – není banka ani obchodník s cennými papíry.",
    fonts.regular,
    7.5,
    A4.w - 2 * M,
  );
  lines.forEach((l, i) => page.drawText(l, { x: M, y: 30 + (lines.length - 1 - i) * 10, size: 7.5, font: fonts.regular, color: SOFT }));
}

function chart(page: PDFPage, fonts: Fonts, x: number, y: number, w: number, h: number, points: ReturnType<typeof compare>["points"]) {
  const max = Math.max(...points.map((p) => Math.max(p.etf, p.bank, p.invested))) * 1.05;
  const px = (i: number) => x + (i / Math.max(points.length - 1, 1)) * w;
  const py = (v: number) => y + (v / max) * h;
  page.drawLine({ start: { x, y }, end: { x: x + w, y }, thickness: 0.8, color: rgb(0.87, 0.83, 0.76) });
  const series: Array<[keyof (typeof points)[number], ReturnType<typeof rgb>, number, number[] | undefined]> = [
    ["invested", SOFT, 1, [3, 3]],
    ["bank", LOSS, 2.2, undefined],
    ["etf", MINT, 2.2, undefined],
  ];
  for (const [key, color, thickness, dash] of series) {
    for (let i = 1; i < points.length; i++) {
      page.drawLine({
        start: { x: px(i - 1), y: py(points[i - 1][key]) },
        end: { x: px(i), y: py(points[i][key]) },
        thickness,
        color,
        dashArray: dash,
      });
    }
  }
  const years = points.length - 1;
  page.drawText("dnes", { x, y: y - 12, size: 8, font: fonts.regular, color: SOFT });
  const end = `${years}. rok`;
  page.drawText(end, { x: x + w - fonts.regular.widthOfTextAtSize(end, 8), y: y - 12, size: 8, font: fonts.regular, color: SOFT });
  const legend: Array<[string, ReturnType<typeof rgb>]> = [
    ["ETF (evropská verze)", MINT],
    ["bankovní akciový fond", LOSS],
    ["vloženo", SOFT],
  ];
  let lx = x;
  for (const [label, color] of legend) {
    page.drawRectangle({ x: lx, y: y - 27, width: 12, height: 3, color });
    page.drawText(label, { x: lx + 16, y: y - 29, size: 8, font: fonts.regular, color: SOFT });
    lx += 16 + fonts.regular.widthOfTextAtSize(label, 8) + 18;
  }
}

async function loadFonts(doc: PDFDocument): Promise<Fonts> {
  doc.registerFontkit(fontkit);
  const [r, b] = await Promise.all([
    fetch("/fonts/Onest-Regular.ttf").then((res) => res.arrayBuffer()),
    fetch("/fonts/Onest-Bold.ttf").then((res) => res.arrayBuffer()),
  ]);
  return { regular: await doc.embedFont(r, { subset: true }), bold: await doc.embedFont(b, { subset: true }) };
}

export async function buildOverviewPdf(input: CalcInput, ticker: string, generatedAt = new Date()) {
  const fund = findFund(ticker);
  const r = compare(input, bankCost, etfCost(fund.ticker));
  const doc = await PDFDocument.create();
  doc.setTitle("TrustOne – osobní přehled ETF");
  doc.setLanguage("cs-CZ");
  doc.setAuthor("TrustOne");
  const fonts = await loadFonts(doc);

  const p1 = doc.addPage([A4.w, A4.h]);
  header(p1, fonts, 1);
  const w = new Writer(p1, fonts);
  w.space(44);
  w.text("Váš osobní přehled ETF", { size: 24, bold: true, gap: 2 });
  w.text(`Modelový výpočet ze dne ${formatDate(generatedAt.toISOString().slice(0, 10))} · data emitentů k ${formatDate(fund.returnsNav.asOf)}`, {
    size: 9.5,
    color: SOFT,
    gap: 14,
  });

  w.text("1. Vaše čísla", { size: 14, bold: true });
  w.text(
    `${formatCzk(input.initial)} na začátek, ${formatCzk(input.monthly)} měsíčně, ${input.years} let. Celkem vloženo ${formatCzk(r.invested)}.`,
    { gap: 10 },
  );

  const boxY = w.y - 58;
  const boxW = (A4.w - 2 * M - 16) / 3;
  const boxes: Array<[string, string, ReturnType<typeof rgb>]> = [
    [`ETF ${fund.ucits.ticker}`, formatCzk(roundForDisplay(r.etf)), MINT_SOFT],
    ["Bankovní fond", formatCzk(roundForDisplay(r.bank)), rgb(0.984, 0.89, 0.839)],
    ["Rozdíl ve prospěch ETF", formatCzk(roundForDisplay(r.difference)), PAPER],
  ];
  boxes.forEach(([label, value, color], i) => {
    const bx = M + i * (boxW + 8);
    p1.drawRectangle({ x: bx, y: boxY, width: boxW, height: 56, color });
    p1.drawText(label, { x: bx + 10, y: boxY + 36, size: 9, font: fonts.regular, color: SOFT });
    p1.drawText(value, { x: bx + 10, y: boxY + 14, size: 15, font: fonts.bold, color: i === 2 ? PINE : INK });
  });
  w.y = boxY - 20;

  chart(p1, fonts, M, w.y - 170, A4.w - 2 * M, 160, r.points);
  w.y -= 210;
  w.text(
    `Předpoklady: výnos ${fees.assumptions.grossReturn} % ročně před náklady pro obě varianty. Bankovní fond ${bankFund.name}: vstupní poplatek ${entryFeeLabel} z každého vkladu, průběžné náklady ${bankFund.ongoing.toLocaleString("cs-CZ")} % ročně (KID ze dne ${formatDate(bankFund.kidDate)}; transakční náklady ${bankFund.transaction.toLocaleString("cs-CZ")} % nezapočteny). ETF: TER ${formatTer(fund.ucits.ter)} ročně, náklady brokera a konverze ${fees.etfSide.brokerCostPerDeposit.toLocaleString("cs-CZ")} % z vkladu (předpoklad). Daně a inflace nezohledněny.`,
    { size: 8.5, color: SOFT, gap: 16 },
  );

  w.text(`2. ${fund.ticker} a jeho evropská verze`, { size: 14, bold: true });
  w.text(
    `${fund.ticker} (${fund.name}) se obchoduje na ${fund.exchange}. Americké fondy nemají sdělení klíčových informací (KID) podle nařízení PRIIPs, proto je běžný broker drobnému investorovi v EU zpravidla nenabídne. Na ${fund.ucits.index} existuje evropský (UCITS) fond:`,
    { gap: 8 },
  );
  const ucY = w.y - 74;
  p1.drawRectangle({ x: M, y: ucY, width: A4.w - 2 * M, height: 72, color: MINT_SOFT });
  p1.drawText(fund.ucits.ticker, { x: M + 12, y: ucY + 46, size: 18, font: fonts.bold, color: INK });
  p1.drawText(fund.ucits.name, { x: M + 12, y: ucY + 30, size: 10, font: fonts.regular, color: INK });
  p1.drawText(`ISIN ${fund.ucits.isin} · TER ${formatTer(fund.ucits.ter)} · ${fund.ucits.distribution} · ${fund.ucits.domicile}`, {
    x: M + 12,
    y: ucY + 14,
    size: 9.5,
    font: fonts.regular,
    color: SOFT,
  });
  w.y = ucY - 10;
  if (fund.ucits.indexNote) w.text(fund.ucits.indexNote, { size: 8.5, color: SOFT });
  w.text(`Kde se obchoduje: ${fund.ucits.justEtfUrl}`, { size: 8.5, color: PINE });
  w.text("Fond nabízejí brokeři, kteří mají v nabídce UCITS ETF. Dostupnost u konkrétního brokera si ověřte podle ISIN.", { size: 8.5, color: SOFT });
  footer(p1, fonts);

  const p2 = doc.addPage([A4.w, A4.h]);
  header(p2, fonts, 2);
  const w2 = new Writer(p2, fonts);
  w2.space(44);
  w2.text("3. Jak obvykle probíhá první nákup", { size: 14, bold: true, gap: 6 });
  BUY_STEPS.forEach((step, i) => {
    p2.drawCircle({ x: M + 8, y: w2.y - 6, size: 8, color: PINE });
    p2.drawText(String(i + 1), { x: M + 5.4, y: w2.y - 9.5, size: 9, font: fonts.bold, color: rgb(1, 1, 1) });
    w2.text(step, { x: M + 24, gap: 6 });
  });
  w2.space(10);
  w2.text("4. Daně v ČR v kostce", { size: 14, bold: true, gap: 6 });
  TAX_RULES.forEach((rule) => w2.text(`•  ${rule}`, { gap: 5 }));
  w2.text("Zákon č. 586/1992 Sb., o daních z příjmů, znění účinné od 1. 8. 2026. Neplatí pro ETF v obchodním majetku podnikatele.", {
    size: 8.5,
    color: SOFT,
    gap: 14,
  });
  w2.text("5. Zdroje", { size: 14, bold: true, gap: 6 });
  [
    `${fund.ticker}: ${fund.source.url} (výkonnost k ${formatDate(fund.returnsNav.asOf)})`,
    `${fund.ucits.ticker}: ${fund.ucits.source.url} (staženo ${formatDate(fund.ucits.source.retrieved)})`,
    `Bankovní fond – KID ${bankFund.name}: ${bankFund.source.url}`,
    "PRIIPs a KID: ČNB, stanovisko RS2018-12, cnb.cz",
    "Daně: zakonyprolidi.cz/cs/1992-586, § 4 odst. 1 písm. t) a u)",
  ].forEach((s) => w2.text(s, { size: 8.5, color: SOFT, gap: 3 }));
  footer(p2, fonts);

  return doc.save();
}
