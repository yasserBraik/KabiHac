import { ContactSection } from "@/components/contact/ContactSection";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { Hero } from "@/components/hero/Hero";
import { BackToTop, Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ResearchSection } from "@/components/research/ResearchSection";
import { SkillsSection } from "@/components/skills/SkillsSection";
import { ToastProvider } from "@/components/ui/Toast";
import { WorkSection } from "@/components/work/WorkSection";
import { PortfolioProvider } from "@/state/portfolio";

export function App() {
  return (
    <ToastProvider>
      <PortfolioProvider>
        <Header />
        <main id="main" tabIndex={-1}>
          <Hero />
          <WorkSection />
          <ExperienceSection />
          <SkillsSection />
          <ResearchSection />
          <ContactSection />
        </main>
        <Footer />
        <BackToTop />
      </PortfolioProvider>
    </ToastProvider>
  );
}
