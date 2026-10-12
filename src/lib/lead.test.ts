import { describe, expect, it } from "vitest";
import { submittedPath } from "./lead";

const lead = { initial: 50_000, monthly: 3_000, years: 20, etf: "VOO", variant: "b" as const, location: "formular" };

describe("přesměrování po odeslání formuláře bez JS", () => {
  it("nese variantu, místo formuláře a UTM z refereru", () => {
    const path = submittedPath(lead, "https://etf.example/?utm_source=meta&utm_content=b_compare&fbclid=x");
    const q = new URL(path, "https://etf.example").searchParams;
    expect(path.startsWith("/prehled?")).toBe(true);
    expect(Object.fromEntries(q)).toEqual({
      v: "50000",
      m: "3000",
      r: "20",
      etf: "VOO",
      odeslano: "1",
      variant: "b",
      location: "formular",
      utm_source: "meta",
      utm_content: "b_compare",
    });
  });

  it("bez platného refereru vynechá UTM", () => {
    expect(submittedPath(lead, null)).toBe(submittedPath(lead, "nesmysl"));
    expect(submittedPath(lead, null)).not.toContain("utm_");
  });
});
