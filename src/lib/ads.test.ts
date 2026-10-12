import { describe, expect, it } from "vitest";
import { compare, DEFAULT_INPUT } from "./calc";
import { bankCost, etfCost, findFund } from "./data";

describe("tvrzení v reklamách odpovídají datům", () => {
  it("reklama A: modelový rozdíl ≈ 500 000 Kč a poměr pruhů 69,6 %", () => {
    const r = compare(DEFAULT_INPUT, bankCost, etfCost("IVV"));
    expect(Math.abs(r.difference - 500_000)).toBeLessThan(15_000);
    expect(Math.round((r.bank / r.etf) * 1000) / 10).toBe(69.6);
  });

  it("reklama B: TER evropských verzí", () => {
    expect(findFund("VOO").ucits).toMatchObject({ ticker: "VUAA", ter: 0.07 });
    expect(findFund("SPY").ucits).toMatchObject({ ticker: "SPYL", ter: 0.03 });
    expect(findFund("VT").ucits).toMatchObject({ ticker: "VWCE", ter: 0.14 });
  });
});
