import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "TrustOne – VOO, SPY, nebo VT? Co z Česka opravdu koupíte",
  robots: { index: false },
};

export default function VariantB() {
  return <LandingPage variant="b" />;
}
