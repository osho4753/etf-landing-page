import { chromium, devices } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const OUT = process.env.OUT_DIR ?? "screenshots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ ...devices["iPhone 14"], viewport: { width: 390, height: 844 } });
await context.route("**/cloud.umami.is/**", (route) => route.abort());
const leadRequests = [];
await context.route("**/api/lead", async (route) => {
  leadRequests.push(JSON.parse(route.request().postData() ?? "{}"));
  await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, overview: "/prehled" }) });
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && !m.text().includes("ERR_FAILED") && errors.push(m.text()));

const events = () => page.evaluate(() => (window.__trustoneQueue ?? []).map(([n, d]) => ({ name: n, ...d })));

await page.goto(`${BASE}/?utm_source=meta&utm_medium=paid_social&utm_campaign=etf_leadgen&utm_content=a_fees`, { waitUntil: "networkidle" });
await page.screenshot({ path: `${OUT}/01-a-hero.png` });

await page.getByRole("link", { name: "Spočítat s mými čísly" }).click();
await page.waitForTimeout(600);
const monthly = page.locator("#calc-monthly");
await monthly.focus();
await page.keyboard.press("ArrowRight");
await page.keyboard.press("ArrowRight");
await page.locator("#kalkulacka").getByText("Rozdíl po nákladech").scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/02-a-kalkulacka.png` });

await page.locator("#srovnani").scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/03-a-srovnani.png` });
await page.getByRole("link", { name: /Přehled pro VOO/ }).click();
await page.waitForTimeout(600);

const form = page.locator("#formular");
await form.getByRole("button", { name: "Chci přehled zdarma" }).click();
await page.waitForTimeout(200);
await form.getByPlaceholder("vas@email.cz").fill("test@example.com");
await form.getByRole("button", { name: "Chci přehled zdarma" }).click();
await page.waitForTimeout(200);
await page.screenshot({ path: `${OUT}/04-a-formular-chyba.png` });
await form.getByRole("checkbox").first().check();
await form.getByRole("button", { name: "Chci přehled zdarma" }).click();
await page.locator("#prehled").waitFor({ timeout: 10000 });
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/05-a-podekovani.png` });
await page.screenshot({ path: `${OUT}/06-a-cela-stranka.png`, fullPage: true });

const flowEvents = await events();

const pageB = await context.newPage();
await pageB.goto(`${BASE}/?utm_source=meta&utm_content=b_compare`, { waitUntil: "networkidle" });
await pageB.screenshot({ path: `${OUT}/07-b-hero.png` });
const bEvents = await pageB.evaluate(() => (window.__trustoneQueue ?? []).map(([n, d]) => ({ name: n, ...d })));

const passive = await context.newPage();
await passive.goto(`${BASE}/`, { waitUntil: "networkidle" });
for (let y = 0; y < 12; y++) {
  await passive.mouse.wheel(0, 700);
  await passive.waitForTimeout(400);
}
await passive.locator("#kalkulacka").scrollIntoViewIfNeeded();
await passive.waitForTimeout(1500);
const passiveEvents = await passive.evaluate(() => (window.__trustoneQueue ?? []).map(([n]) => n));
const passiveOk = !passiveEvents.includes("calc_result_view") && !passiveEvents.includes("calc_interact");

console.log(JSON.stringify({ errors, leadRequests: leadRequests.map(({ email, ...rest }) => ({ email: email ? "…" : "", ...rest })), passiveOk, passiveEvents, flowEvents, bEvents }, null, 2));
await browser.close();
