"use client";

import { Overview } from "./Overview";
import { useLead } from "./LeadProvider";

export function ThankYou() {
  const { lead, input, etf } = useLead();
  if (!lead) return null;
  return (
    <section id="prehled" className="scroll-mt-4 bg-mint-soft/60" aria-live="polite">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Overview input={input} etf={etf} email={lead.email} />
      </div>
    </section>
  );
}
