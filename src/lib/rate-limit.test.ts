import { describe, expect, it } from "vitest";
import { createCooldown, createRateLimiter } from "./rate-limit";

const HOUR = 60 * 60 * 1000;

describe("limit odeslání z jedné IP", () => {
  it("pustí 5 odeslání za hodinu, šesté odmítne", () => {
    const limiter = createRateLimiter(5, HOUR);
    const results = Array.from({ length: 6 }, (_, i) => limiter.hit("1.2.3.4", i * 1000));
    expect(results).toEqual([true, true, true, true, true, false]);
  });

  it("jiná IP má vlastní limit a po hodině se limit uvolní", () => {
    const limiter = createRateLimiter(5, HOUR);
    for (let i = 0; i < 5; i++) limiter.hit("1.2.3.4", 0);
    expect(limiter.hit("5.6.7.8", 0)).toBe(true);
    expect(limiter.hit("1.2.3.4", HOUR - 1)).toBe(false);
    expect(limiter.hit("1.2.3.4", HOUR)).toBe(true);
  });
});

describe("přehled na stejný e-mail jednou za 24 h", () => {
  it("podruhé do 24 h neposílá, po 24 h znovu ano", () => {
    const cooldown = createCooldown(24 * HOUR);
    expect(cooldown.take("a@b.cz", 0)).toBe(true);
    expect(cooldown.take("a@b.cz", 24 * HOUR - 1)).toBe(false);
    expect(cooldown.take("c@d.cz", 1)).toBe(true);
    expect(cooldown.take("a@b.cz", 24 * HOUR)).toBe(true);
  });

  it("po neúspěšném odeslání jde poslat znovu", () => {
    const cooldown = createCooldown(24 * HOUR);
    cooldown.take("a@b.cz", 0);
    cooldown.release("a@b.cz");
    expect(cooldown.take("a@b.cz", 1)).toBe(true);
  });
});
