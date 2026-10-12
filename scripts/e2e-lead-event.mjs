import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const LANDING = `${BASE}/?utm_source=meta&utm_medium=paid_social&utm_campaign=etf_leadgen&utm_content=b_compare`;

const browser = await chromium.launch();

async function run(javaScriptEnabled) {
  const sent = [];
  const context = await browser.newContext({ javaScriptEnabled });
  await context.route("**/api/send", async (route) => {
    sent.push(JSON.parse(route.request().postData() ?? "{}"));
    await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
  });
  const page = await context.newPage();
  await page.goto(LANDING, { waitUntil: "networkidle" });
  const form = page.locator("#formular");
  await form.getByPlaceholder("vas@email.cz").fill("test@example.com");
  await form.getByRole("checkbox").first().check();
  await form.getByRole("button", { name: "Chci přehled zdarma" }).click();
  if (!javaScriptEnabled) {
    await page.waitForURL("**/prehled?**");
    const url = page.url();
    await page.close();
    const overview = await (await browser.newContext()).newPage();
    await overview.context().route("**/api/send", async (route) => {
      sent.push(JSON.parse(route.request().postData() ?? "{}"));
      await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    });
    await overview.goto(url, { waitUntil: "networkidle" });
    await overview.waitForTimeout(1500);
    const cleaned = overview.url();
    await overview.reload({ waitUntil: "networkidle" });
    await overview.waitForTimeout(1500);
    return { redirect: url.replace(BASE, ""), cleaned: cleaned.replace(BASE, ""), sent };
  }
  await page.locator("#prehled").waitFor({ timeout: 10000 });
  await page.waitForTimeout(1500);
  return { url: page.url().replace(BASE, ""), sent };
}

const summarize = ({ sent, ...rest }) => ({
  ...rest,
  events: sent.map(({ payload }) => payload.name ?? `pageview ${payload.url}`),
  leadSubmit: sent.filter(({ payload }) => payload.name === "lead_submit").map(({ payload }) => payload.data),
});

const inline = summarize(await run(true));
const redirect = summarize(await run(false));
console.log(JSON.stringify({ inline, redirect }, null, 2));
await browser.close();

const ok = (r) => r.leadSubmit.length === 1 && r.leadSubmit[0].variant && r.leadSubmit[0].utm_source === "meta";
if (!ok(inline) || !ok(redirect)) process.exit(1);
