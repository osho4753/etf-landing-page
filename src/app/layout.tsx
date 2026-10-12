import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Onest } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display-face",
  subsets: ["latin", "latin-ext"],
  weight: ["800"],
  preload: false,
});

const body = Onest({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "TrustOne – kolik stojí poplatky a které ETF z Česka koupíte",
  description:
    "Spočítejte si, kolik za 20 let zaplatíte na poplatcích v bankovním fondu a v ETF. Srovnání 5 ETF z newyorské burzy a jejich evropských verzí.",
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#f5f0e6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="cs" className={`${display.variable} ${body.variable} antialiased`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
