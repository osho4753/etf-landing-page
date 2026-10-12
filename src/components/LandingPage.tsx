import { Analytics } from "./Analytics";
import { Calculator } from "./Calculator";
import { Compare } from "./Compare";
import { HeroCompare, HeroFees } from "./Hero";
import { LeadProvider, type Variant } from "./LeadProvider";
import { RevealObserver } from "./Reveal";
import { Faq, Footer, KidExplainer, PlanPreview, SectionTitle, Sources } from "./Sections";
import { StickyCta } from "./StickyCta";
import { ThankYou } from "./ThankYou";

function Band({ id, tone = "paper", children }: { id: string; tone?: "paper" | "white"; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-4 [content-visibility:auto] [contain-intrinsic-size:auto_900px] ${tone === "white" ? "bg-card/60" : ""}`}>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">{children}</div>
    </section>
  );
}

function CalculatorBand() {
  return (
    <Band id="kalkulacka" tone="white">
      <SectionTitle
        id="kalkulacka-title"
        eyebrow="Kalkulačka"
        title="Spočítejte si to s vlastními čísly"
        lead="Posuňte jezdce. Výsledek se přepočítá hned – formulář vyplňovat nemusíte."
      />
      <Calculator />
    </Band>
  );
}

function CompareBand() {
  return (
    <>
      <Band id="proc">
        <SectionTitle id="proc-title" eyebrow="Proč to nejde" title="Proč VOO nebo SPY z Česka většinou nekoupíte" />
        <KidExplainer />
      </Band>
      <Band id="srovnani" tone="white">
        <SectionTitle
          id="srovnani-title"
          eyebrow="Srovnání"
          title="5 známých ETF z newyorské burzy a jejich evropské verze"
          lead="Náklady, velikost a výkonnost přímo od emitentů. U každého fondu najdete evropskou verzi, kterou nabízejí brokeři s UCITS ETF."
        />
        <Compare />
      </Band>
    </>
  );
}

export function LandingPage({ variant }: { variant: Variant }) {
  return (
    <LeadProvider variant={variant}>
      <main>
        {variant === "a" ? <HeroFees /> : <HeroCompare />}
        {variant === "a" ? (
          <>
            <CalculatorBand />
            <CompareBand />
          </>
        ) : (
          <>
            <CompareBand />
            <CalculatorBand />
          </>
        )}
        <ThankYou />
        <Band id="co-dostanete">
          <SectionTitle
            id="co-dostanete-title"
            eyebrow="Osobní přehled zdarma"
            title="Co dostanete za e-mail"
            lead="Jeden přehled na míru vašim číslům a vybranému ETF. Hned na stránce i jako PDF."
          />
          <PlanPreview />
        </Band>
        <Band id="faq" tone="white">
          <SectionTitle id="faq-title" eyebrow="Časté otázky" title="Než se rozhodnete" />
          <Faq />
        </Band>
        <Band id="zdroje">
          <SectionTitle id="zdroje-title" eyebrow="Transparentnost" title="Zdroje dat" />
          <Sources />
        </Band>
      </main>
      <Footer />
      <StickyCta />
      <RevealObserver />
      <Analytics variant={variant} />
    </LeadProvider>
  );
}
