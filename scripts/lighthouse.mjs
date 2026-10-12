import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const RUNS = Number(process.env.RUNS ?? 3);
const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "docs/lighthouse";
mkdirSync(OUT, { recursive: true });

const pages = [
  ["a", `${BASE}/?utm_source=lighthouse&utm_content=a_fees`],
  ["b", `${BASE}/?utm_source=lighthouse&utm_content=b_compare`],
];
const summary = { date: new Date().toISOString(), runs: RUNS, formFactor: "mobile", throttling: "simulate (Lighthouse default: Moto G Power, slow 4G)", pages: {} };

for (const [name, url] of pages) {
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    const base = join(tmpdir(), `lh-${name}-${i}`);
    execFileSync(
      "npx",
      [
        "-y",
        "lighthouse@12",
        url,
        `--chrome-path=${CHROME}`,
        "--chrome-flags=--headless=new",
        "--form-factor=mobile",
        "--only-categories=performance,accessibility,best-practices,seo",
        "--blocked-url-patterns=*cloud.umami.is*",
        "--output=json",
        "--output=html",
        `--output-path=${base}`,
        "--quiet",
      ].map((arg) => `"${arg}"`),
      { stdio: "inherit", shell: true },
    );
    const report = JSON.parse(readFileSync(`${base}.report.json`, "utf8"));
    const scores = Object.fromEntries(Object.entries(report.categories).map(([k, c]) => [k, Math.round(c.score * 100)]));
    const metrics = Object.fromEntries(
      ["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift", "speed-index"].map((m) => [m, report.audits[m].numericValue]),
    );
    runs.push({ scores, metrics, base });
  }
  runs.sort((x, y) => x.scores.performance - y.scores.performance);
  const median = runs[Math.floor(runs.length / 2)];
  copyFileSync(`${median.base}.report.html`, join(OUT, `${name}.report.html`));
  copyFileSync(`${median.base}.report.json`, join(OUT, `${name}.report.json`));
  summary.pages[name] = { url, median: { scores: median.scores, metrics: median.metrics }, all: runs.map((r) => r.scores) };
  console.log(name, JSON.stringify(summary.pages[name].median.scores), "všechny běhy:", JSON.stringify(summary.pages[name].all.map((s) => s.performance)));
}
writeFileSync(join(OUT, "summary.json"), JSON.stringify(summary, null, 2) + "\n");
