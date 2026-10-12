import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { compare, sanitize } from "@/lib/calc";
import { bankCost, etfCost } from "@/lib/data";
import { POST } from "./route";

type Call = { url: string; body: Record<string, unknown> };
let calls: Call[];

beforeEach(() => {
  calls = [];
  vi.stubEnv("BREVO_API_KEY", "test-key");
  vi.stubEnv("BREVO_LIST_ID", "7");
  vi.stubEnv("BREVO_SENDER_EMAIL", "sender@example.com");
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: RequestInit) => {
      calls.push({ url, body: JSON.parse(String(init.body)) });
      return new Response(null, { status: url.endsWith("/contacts") ? 204 : 201 });
    }),
  );
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function submit(ip: string, body: Record<string, unknown>) {
  return POST(
    new Request("https://etf.example/api/lead", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": `${ip}, 10.0.0.1` },
      body: JSON.stringify({ consent: true, variant: "a", location: "test", etf: "VT", initial: 100_000, monthly: 3_000, years: 20, ...body }),
    }),
  );
}

const contacts = () => calls.filter((c) => c.url.endsWith("/contacts"));
const emails = () => calls.filter((c) => c.url.endsWith("/smtp/email"));

describe("/api/lead", () => {
  it("rozdíl počítá server ze vstupů, hodnotu od klienta ignoruje", async () => {
    const res = await submit("198.51.100.1", { email: "rozdil@example.com", difference: 999_999_999, initial: 50_000, monthly: 2_000, years: 15, etf: "VOO" });
    expect(res.status).toBe(200);
    const expected = compare(sanitize({ initial: 50_000, monthly: 2_000, years: 15 }), bankCost, etfCost("VOO")).difference;
    expect(contacts()[0].body.attributes).toMatchObject({ ROZDIL: expected });
    expect(String(emails()[0].body.htmlContent)).not.toContain("999");
  });

  it("z jedné IP přijme 5 odeslání za hodinu, šesté vrátí 429", async () => {
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await submit("198.51.100.2", { email: `ip${i}@example.com` })).status);
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429]);
    expect((await submit("198.51.100.3", { email: "jina-ip@example.com" })).status).toBe(200);
  });

  it("na stejný e-mail do 24 h přehled znovu neposílá, kontakt jen aktualizuje", async () => {
    await submit("198.51.100.4", { email: "Opakovane@Example.com", initial: 100_000 });
    await submit("198.51.100.5", { email: "opakovane@example.com", initial: 200_000 });
    expect(contacts()).toHaveLength(2);
    expect(contacts()[1].body).toMatchObject({ email: "opakovane@example.com", updateEnabled: true, attributes: { VKLAD_START: 200_000 } });
    expect(emails()).toHaveLength(1);
  });
});
