import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Home } from "./sections/Home";
import { Experience } from "./sections/Experience";
import { Education } from "./sections/Education";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";
import { Achievements } from "./sections/Achievements";
import { Certifications } from "./sections/Certifications";
import { Contact } from "./sections/Contact";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

const sections = {
  home: Home,
  experience: Experience,
  education: Education,
  projects: Projects,
  skills: Skills,
  achievements: Achievements,
  certifications: Certifications,
  contact: Contact,
};

export function PortfolioLayout() {
  const [activeSection, setActiveSection] = useState("home");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ActiveComponent = sections[activeSection as keyof typeof sections];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      {/* Main Content */}
      <main className="lg:ml-80 min-h-screen">
        <div className="animate-fade-in">
          <ActiveComponent setActiveSection={setActiveSection} />
        </div>
      </main>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-6 right-6 z-40 shadow-lg hover:shadow-glow transition-all duration-300 bg-primary hover:bg-primary/90"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}