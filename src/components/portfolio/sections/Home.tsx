import { Button } from "@/components/ui/button";
import { Download, Eye, ArrowRight } from "lucide-react";

interface HomeProps {
  setActiveSection: (section: string) => void;
}

export function Home({ setActiveSection }: HomeProps) {
  const handleDownloadResume = () => {
    // This would typically link to a PDF resume
    window.open("/resume.pdf", "_blank");
  };

  const handleViewWork = () => {
    setActiveSection("projects");
  };

  return (
    <section className="portfolio-section flex items-center justify-center min-h-screen">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Avatar Section */}
        <div className="relative inline-block group mb-8">
          <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary/30 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary">SG</span>
            </div>
          </div>
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="hero-title leading-tight">
            Sahil A Gowda
          </h1>
          <h2 className="text-xl lg:text-2xl text-primary font-semibold">
            Full Stack Developer | AI/ML Enthusiast
          </h2>
          <p className="text-lg lg:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Building intelligent, scalable, and user-friendly web solutions
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl mx-auto">
          <p className="text-text-secondary text-lg leading-relaxed">
            I'm a Computer Science student passionate about{" "}
            <span className="text-primary font-medium">full-stack development</span>,{" "}
            <span className="text-primary font-medium">AI-powered applications</span>, and{" "}
            <span className="text-primary font-medium">solving real-world problems</span> through code.
          </p>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleViewWork}
            className="btn-primary group"
            size="lg"
          >
            <Eye className="h-5 w-5 mr-2" />
            View My Work
            <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
          
          <Button
            onClick={handleDownloadResume}
            variant="outline"
            className="btn-secondary"
            size="lg"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Resume
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-2xl mx-auto mt-16">
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-primary">4+</div>
            <div className="text-sm text-text-muted">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-primary">7+</div>
            <div className="text-sm text-text-muted">Projects Built</div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-primary">5+</div>
            <div className="text-sm text-text-muted">Tech Stacks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-primary">9.25</div>
            <div className="text-sm text-text-muted">CGPA</div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}