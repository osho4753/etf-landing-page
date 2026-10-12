import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const display = localFont({
  src: "./fonts/bricolage-cs-800.woff2",
  variable: "--font-display-face",
  weight: "800",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

const body = localFont({
  src: "./fonts/onest-cs.woff2",
  variable: "--font-body",
  weight: "400 800",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
