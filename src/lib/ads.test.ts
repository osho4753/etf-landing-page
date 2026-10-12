import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { compare, DEFAULT_INPUT, floorForClaim, formatCzk } from "./calc";
import { bankCost, etfCost, fees, findFund } from "./data";

describe("tvrzení v reklamách odpovídají datům", () => {
  it("reklama A: „přes 400 000 Kč“ s globálním ETF i bez vstupního poplatku, poměr pruhů 70,2 %", () => {
    const html = readFileSync("ads/reklama-a-poplatky.html", "utf8");
    expect(fees.defaultEtf).toBe("VT");
    const r = compare(DEFAULT_INPUT, bankCost, etfCost("VT"));
    const noEntry = compare(DEFAULT_INPUT, { ...bankCost, entryPct: 0 }, etfCost("VT"));
    expect(floorForClaim(r.difference)).toBe(400_000);
    expect(floorForClaim(noEntry.difference)).toBe(400_000);
    expect(html).toContain(`přes ${formatCzk(floorForClaim(r.difference)).replace(/\s/g, " ")}`);
    expect(Math.round((r.bank / r.etf) * 1000) / 10).toBe(70.2);
    expect(html).toContain("width:70.2%");
    expect(html).toContain("TER globálního ETF 0,14 %");
  });

  it("reklama B: TER evropských verzí", () => {
    expect(findFund("VOO").ucits).toMatchObject({ ticker: "VUAA", ter: 0.07 });
    expect(findFund("SPY").ucits).toMatchObject({ ticker: "SPYL", ter: 0.03 });
    expect(findFund("VT").ucits).toMatchObject({ ticker: "VWCE", ter: 0.14 });
  });
});
