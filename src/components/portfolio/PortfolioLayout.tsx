import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Home } from "./sections/Home";
import { Experience } from "./sections/Experience";
import { Education } from "./sections/Education";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";
import { Achievements } from "./sections/Achievements";
import { Certifications } from "./sections/Certifications";
import { Connect } from "./sections/Connect";
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
  contact: Connect,
};

export function PortfolioLayout() {
  const [activeSection, setActiveSection] = useState("home");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displaySection, setDisplaySection] = useState("home");
  const [transitionDirection, setTransitionDirection] = useState("right");

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Enhanced section transition with direction detection
  useEffect(() => {
    if (activeSection !== displaySection) {
      // Determine transition direction based on section order
      const sectionOrder = Object.keys(sections);
      const currentIndex = sectionOrder.indexOf(displaySection);
      const newIndex = sectionOrder.indexOf(activeSection);
      
      setTransitionDirection(newIndex > currentIndex ? "right" : "left");
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        setDisplaySection(activeSection);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [activeSection, displaySection]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ActiveComponent = sections[displaySection as keyof typeof sections];

  return (
    <div className="min-h-screen bg-background text-foreground flex relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-primary/2 rounded-full blur-2xl animate-float-slow"></div>
      </div>

      {/* Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-x-hidden relative">
        <div 
          className={`transition-all duration-500 ease-in-out ${
            isTransitioning 
              ? `opacity-0 scale-95 ${transitionDirection === 'right' ? 'translate-x-10' : '-translate-x-10'}` 
              : 'opacity-100 scale-100 translate-x-0'
          }`}
        >
          <div className="animate-page-enter">
            <ActiveComponent setActiveSection={setActiveSection} />
          </div>
        </div>

        {/* Page transition overlay with gradient animation */}
        {isTransitioning && (
          <div className="absolute inset-0 pointer-events-none">
            <div className={`absolute inset-0 bg-gradient-to-${transitionDirection === 'right' ? 'r' : 'l'} from-primary/10 via-primary/5 to-transparent animate-pulse`}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-transparent"></div>
          </div>
        )}
      </main>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-6 right-6 z-40 shadow-lg hover:shadow-glow transition-all duration-300 bg-primary hover:bg-primary/90 hover:scale-110 animate-bounce-in"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}

      {/* Floating Action Indicators */}
      <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-30 space-y-2">
        {Object.keys(sections).map((section, index) => (
          <div
            key={section}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeSection === section 
                ? 'bg-primary scale-150 shadow-lg' 
                : 'bg-primary/30 hover:bg-primary/60'
            }`}
            style={{animationDelay: `${index * 0.1}s`}}
          />
        ))}
      </div>
    </div>
  );
}