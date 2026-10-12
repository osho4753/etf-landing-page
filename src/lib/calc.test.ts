import { describe, expect, it } from "vitest";
import { compare, sanitize, formatCzk, roundForDisplay } from "./calc";

const bank = { entryPct: 3, ongoingPct: 2.65 };
const etf = { entryPct: 0.5, ongoingPct: 0.07 };

describe("compare", () => {
  it("bez nákladů a výnosu vrátí vloženou částku", () => {
    const r = compare({ initial: 1000, monthly: 100, years: 2, grossReturnPct: 0 }, { entryPct: 0, ongoingPct: 0 }, { entryPct: 0, ongoingPct: 0 });
    expect(r.invested).toBe(3400);
    expect(r.bank).toBe(3400);
    expect(r.etf).toBe(3400);
    expect(r.difference).toBe(0);
  });

  it("vstupní poplatek strhává z každého vkladu", () => {
    const r = compare({ initial: 1000, monthly: 100, years: 1, grossReturnPct: 0 }, { entryPct: 3, ongoingPct: 0 }, { entryPct: 0, ongoingPct: 0 });
    expect(r.bank).toBe(Math.round(2200 * 0.97));
  });

  it("průběžné náklady snižují hodnotu o roční sazbu", () => {
    const r = compare({ initial: 10000, monthly: 0, years: 1, grossReturnPct: 0 }, { entryPct: 0, ongoingPct: 2 }, { entryPct: 0, ongoingPct: 0 });
    expect(r.bank).toBe(9800);
  });

  it("výchozí příklad: 100 000 + 3 000 měsíčně, 20 let, 6 %", () => {
    const r = compare({ initial: 100000, monthly: 3000, years: 20, grossReturnPct: 6 }, bank, etf);
    expect(r.invested).toBe(820000);
    expect(r.points).toHaveLength(21);
    expect(r.etf).toBeGreaterThan(r.bank);
    expect(r.difference).toBeGreaterThan(400000);
    expect(r.difference).toBeLessThan(700000);
  });

  it("ořízne nesmyslné vstupy", () => {
    expect(sanitize({ initial: -5, monthly: 1e9, years: 0 })).toMatchObject({ initial: 0, monthly: 50000, years: 1 });
    expect(sanitize({ initial: Number.NaN })).toMatchObject({ initial: 0 });
  });
});

describe("formátování", () => {
  it("česká čísla s mezerou a Kč", () => {
    expect(formatCzk(453252).replace(/\s/g, " ")).toBe("453 252 Kč");
  });
  it("zaokrouhlení pro zobrazení", () => {
    expect(roundForDisplay(453252)).toBe(453000);
    expect(roundForDisplay(45321)).toBe(45300);
  });
});
