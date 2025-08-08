import { Button } from "@/components/ui/button";
import { Download, Eye, ArrowRight, Github, Linkedin, ExternalLink, Code, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";

interface HomeProps {
  setActiveSection: (section: string) => void;
}

const socialLinks = [
  {
    name: "GitHub",
    icon: Github,
    url: "https://github.com/SahilAGowda",
    color: "hover:text-primary"
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://www.linkedin.com/in/sahil-a-gowda-551b32270/",
    color: "hover:text-primary"
  },
  {
    name: "LeetCode",
    icon: Code,
    url: "https://leetcode.com/u/sahilgowda204/",
    color: "hover:text-primary"
  },
  {
    name: "HackerRank",
    icon: ExternalLink,
    url: "https://www.hackerrank.com/profile/sahilgowda204",
    color: "hover:text-primary"
  },
  {
    name: "CodeChef",
    icon: BookOpen,
    url: "https://www.codechef.com/users/sahilgowda204",
    color: "hover:text-primary"
  }
];

export function Home({ setActiveSection }: HomeProps) {
  const handleDownloadResume = () => {
    // This would typically link to a PDF resume
    window.open("/resume.pdf", "_blank");
  };

  const handleViewWork = () => {
    setActiveSection("projects");
  };

  return (
    <section className="portfolio-section min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 order-2 lg:order-1">
            {/* Introduction */}
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-primary font-medium text-lg">Hello, I'm</p>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Sahil A Gowda
                </h1>
                <h2 className="text-xl lg:text-2xl text-primary font-semibold">
                  Full Stack Developer & AI/ML Enthusiast
                </h2>
              </div>
              
              <p className="text-lg lg:text-xl text-text-secondary leading-relaxed max-w-2xl">
                I'm a passionate Computer Science student who loves creating{" "}
                <span className="text-primary font-medium">intelligent web solutions</span>,{" "}
                <span className="text-primary font-medium">AI-powered applications</span>, and{" "}
                <span className="text-primary font-medium">solving complex problems</span> through innovative code.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="text-2xl font-bold text-primary">4+</div>
                <div className="text-sm text-text-muted">Years Experience</div>
              </Card>
              <Card className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="text-2xl font-bold text-primary">7+</div>
                <div className="text-sm text-text-muted">Projects Built</div>
              </Card>
              <Card className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="text-2xl font-bold text-primary">5+</div>
                <div className="text-sm text-text-muted">Tech Stacks</div>
              </Card>
              <Card className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="text-2xl font-bold text-primary">9.25</div>
                <div className="text-sm text-text-muted">CGPA</div>
              </Card>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleViewWork}
                className="btn-primary group transition-all duration-300"
                size="lg"
              >
                <Eye className="h-5 w-5 mr-2" />
                View My Work
                <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <Button
                onClick={handleDownloadResume}
                variant="outline"
                className="btn-secondary transition-all duration-300"
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Resume
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-lg bg-card border border-border ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg group`}
                    title={social.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Content - Profile Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Main Image Container */}
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                {/* Placeholder for actual image */}
                <div className="w-full h-full rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border-4 border-primary/30 flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:rotate-2">
                  <div className="w-3/4 h-3/4 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                    <span className="text-6xl lg:text-7xl font-bold text-primary">SG</span>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              </div>
              
              {/* Background Decoration */}
              <div className="absolute -inset-8 bg-gradient-to-br from-primary/5 to-transparent rounded-full -z-10"></div>
            </div>
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