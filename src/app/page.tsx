import { Hero } from "@/components/Hero";
import { Inversion } from "@/components/Inversion";
import { VaultSection } from "@/components/Vault";
import { Triggers } from "@/components/Triggers";
import { ChainSection } from "@/components/ChainSection";
import { Estimator } from "@/components/Estimator";
import { Undecided } from "@/components/Undecided";
import { Questions } from "@/components/Questions";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/ui/Section";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#inversion">
        Skip to content
      </a>
      <main id="main">
        <Hero />
        <Inversion />
        <VaultSection />
        <Triggers />
        <ChainSection />
        <Section
          id="estimate"
          num="05"
          title="Do the arithmetic yourself"
          lede={
            <>
              Four numbers decide what a red day is worth to you. Two of them
              do not exist yet. Type what you like into the rest — the result
              is your own arithmetic, not a projection this site is making.
            </>
          }
        >
          <Estimator />
        </Section>
        <Undecided />
        <Questions />
      </main>
      <Footer />
    </>
  );
}
