import { chromium } from "@playwright/test";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const ads = ["reklama-a-poplatky", "reklama-b-srovnani"];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
for (const name of ads) {
  await page.goto(pathToFileURL(resolve("ads", `${name}.html`)).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve("ads", `${name}.png`) });
  console.log(`ads/${name}.png`);
}
await browser.close();
