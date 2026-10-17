import { ContactSection } from "@/components/site/ContactSection";
import { CredentialsSection } from "@/components/site/CredentialsSection";
import { ExperienceSection } from "@/components/site/ExperienceSection";
import { Hero } from "@/components/site/Hero";
import { SkillsSection } from "@/components/site/SkillsSection";
import { WorkSection } from "@/components/site/WorkSection";
import { profile } from "@/data/profile";
import { usePageMeta } from "@/hooks/usePageMeta";

const Index = () => {
  usePageMeta({ title: profile.title, description: profile.description, path: "/" });

  // On phones a 2 px flowline runs down the left edge; each section heading carries a dot on it.
  return (
    <div className="relative pl-6 before:absolute before:bottom-0 before:left-[5px] before:top-0 before:w-0.5 before:bg-border lg:pl-0 lg:before:hidden">
      <Hero />
      <ExperienceSection />
      <WorkSection />
      <SkillsSection />
      <CredentialsSection />
      <ContactSection />
    </div>
  );
};

export default Index;
