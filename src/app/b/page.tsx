import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "TrustOne – VOO, SPY, nebo VT? Co z Česka opravdu koupíte",
  alternates: { canonical: "/" },
};

export default function VariantB() {
  return <LandingPage variant="b" />;
}
