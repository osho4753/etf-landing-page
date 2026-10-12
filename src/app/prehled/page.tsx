import type { Metadata } from "next";
import { Suspense } from "react";
import { Brand } from "@/components/Brand";
import { Analytics } from "@/components/Analytics";
import { Overview } from "@/components/Overview";
import { Footer } from "@/components/Sections";
import { sanitize } from "@/lib/calc";
import { findFund } from "@/lib/data";

export const metadata: Metadata = {
  title: "Váš osobní přehled ETF – TrustOne",
  robots: { index: false },
};

async function Content({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const q = await searchParams;
  const one = (k: string) => (Array.isArray(q[k]) ? q[k]?.[0] : q[k]);
  const input = sanitize({ initial: Number(one("v")), monthly: Number(one("m")), years: Number(one("r")), grossReturnPct: 6 });
  const etf = findFund(one("etf")).ticker;
  return <Overview input={input} etf={etf} />;
}

export default function OverviewPage({ searchParams }: PageProps<"/prehled">) {
  return (
    <>
      <main className="mx-auto max-w-3xl px-4 pb-12 pt-4 sm:px-6">
        <Brand />
        <div className="mt-6">
          <Suspense fallback={<p className="text-ink-soft">Načítám přehled…</p>}>
            <Content searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
      <Footer />
      <Analytics variant="a" page="overview" />
    </>
  );
}
