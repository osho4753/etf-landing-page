"use client";

import Script from "next/script";
import { useEffect } from "react";
import { pickUtm } from "@/lib/lead";
import { flushQueue, setTrackContext, track } from "@/lib/track";
import type { Variant } from "./LeadProvider";

export function Analytics({ variant, page = "landing" }: { variant: Variant; page?: string }) {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTrackContext({ variant, page, ...pickUtm(params) });
    if (page === "landing") track("landing", { referrer: document.referrer ? new URL(document.referrer).hostname : "direct" });
    if (page === "overview" && params.get("odeslano") === "1") {
      params.delete("odeslano");
      window.history.replaceState(window.history.state, "", `${window.location.pathname}?${params.toString()}`);
      track("lead_submit", { location: params.get("location") ?? "unknown", etf: params.get("etf") ?? "", flow: "redirect" });
    }

    if (page !== "landing") return;
    const marks = [25, 50, 75];
    const hit = new Set<number>();
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const depth = ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;
        for (const m of marks) {
          if (depth >= m && !hit.has(m)) {
            hit.add(m);
            track(`scroll_${m}`);
          }
        }
        if (hit.size === marks.length) window.removeEventListener("scroll", onScroll);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant, page]);

  if (!websiteId) return null;
  return <Script src="https://cloud.umami.is/script.js" data-website-id={websiteId} strategy="afterInteractive" onLoad={flushQueue} onReady={flushQueue} />;
}
