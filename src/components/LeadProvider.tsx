"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { compare, DEFAULT_INPUT, type CalcInput, type CalcResult } from "@/lib/calc";
import { bankCost, etfCost, fees } from "@/lib/data";

export type Variant = "a" | "b";

export type Lead = {
  email: string;
  submittedAt: string;
};

type LeadState = {
  variant: Variant;
  input: CalcInput;
  setInput: (next: CalcInput) => void;
  etf: string;
  setEtf: (ticker: string) => void;
  result: CalcResult;
  lead: Lead | null;
  setLead: (lead: Lead) => void;
};

const LeadContext = createContext<LeadState | null>(null);

export function LeadProvider({ variant, children }: { variant: Variant; children: React.ReactNode }) {
  const [input, setInput] = useState<CalcInput>(DEFAULT_INPUT);
  const [etf, setEtf] = useState<string>(fees.defaultEtf);
  const [lead, setLead] = useState<Lead | null>(null);
  const result = useMemo(() => compare(input, bankCost, etfCost(etf)), [input, etf]);

  const value = useMemo(
    () => ({ variant, input, setInput, etf, setEtf, result, lead, setLead }),
    [variant, input, etf, result, lead],
  );

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
}

export function useLead() {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error("useLead mimo LeadProvider");
  return ctx;
}
