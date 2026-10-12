"use client";

import { useState } from "react";
import type { CalcInput } from "@/lib/calc";
import { track } from "@/lib/track";

type Status = "idle" | "working" | "error";

export function PdfButton({ input, etf }: { input: CalcInput; etf: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function download() {
    setStatus("working");
    try {
      const { buildOverviewPdf } = await import("@/lib/pdf");
      const bytes = await buildOverviewPdf(input, etf);
      const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `trustone-prehled-${etf}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      track("pdf_download", { etf });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      track("form_error", { type: "pdf", detail: String(err).slice(0, 40) });
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={download}
        disabled={status === "working"}
        className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-pine px-5 text-base font-bold text-white transition hover:bg-ink disabled:opacity-70 sm:w-auto"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M5 19h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {status === "working" ? "Připravuji PDF…" : "Stáhnout přehled v PDF"}
      </button>
      {status === "error" && <p className="mt-2 text-sm font-semibold text-loss">PDF se nepodařilo vytvořit. Zkuste to prosím znovu.</p>}
    </div>
  );
}
