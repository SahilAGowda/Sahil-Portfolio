import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, FileText, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { linkOrder, links, profile } from "@/data/profile";
import { linkIcons } from "../linkIcons";

interface HomeProps {
  setActiveSection: (section: string) => void;
}

const fullText = profile.name;
const fullTitle = profile.headline;

export function Home({ setActiveSection }: HomeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [typedTitle, setTypedTitle] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isFloating, setIsFloating] = useState(true);

  useEffect(() => {
    setIsVisible(true);

    // Typing animation for the name
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);

        // Start typing the title after name is complete
        setTimeout(() => {
          let titleIndex = 0;
          const titleInterval = setInterval(() => {
            if (titleIndex <= fullTitle.length) {
              setTypedTitle(fullTitle.slice(0, titleIndex));
              titleIndex++;
            } else {
              clearInterval(titleInterval);
              setShowCursor(false);
            }
          }, 50);
        }, 500);
      }
    }, 100);

    // Stop floating animation after 8 seconds
    const floatingTimer = setTimeout(() => {
      setIsFloating(false);
    }, 8000);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(floatingTimer);
    };
  }, []);

  const handleViewWork = () => {
    setActiveSection("projects");
  };

  return (
    <section className="portfolio-section min-h-screen flex items-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-primary/20 rounded-full blur-lg animate-float-delayed"></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-32 w-12 h-12 bg-primary/15 rounded-full blur-md animate-float"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`space-y-8 order-2 lg:order-1 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            {/* Introduction */}
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-primary font-medium text-lg animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                  Hello, I'm
                </p>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight min-h-[4rem] lg:min-h-[6rem]">
                  <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                    {typedText}
                  </span>
                  {showCursor && <span className="animate-pulse">|</span>}
                </h1>
                <h2 className="text-xl lg:text-2xl text-primary font-semibold animate-fade-in-up min-h-[2rem]" style={{animationDelay: '1.5s'}}>
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="h-6 w-6 animate-spin-slow" />
                    {typedTitle}
                    {typedTitle.length > 0 && typedTitle.length < fullTitle.length && showCursor && (
                      <span className="animate-pulse">|</span>
                    )}
                  </span>
                </h2>
              </div>

              <p className="text-lg lg:text-xl text-text-secondary leading-relaxed max-w-2xl animate-fade-in-up" style={{animationDelay: '2s'}}>
                {profile.summary}
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{animationDelay: '2.6s'}}>
              <Button
                onClick={handleViewWork}
                className="btn-primary group transition-all duration-300 hover:shadow-2xl hover:scale-105"
                size="lg"
              >
                <Eye className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                View my work
                <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-2" />
              </Button>

              <Button
                asChild
                variant="outline"
                className="btn-secondary transition-all duration-300 hover:shadow-xl hover:scale-105"
                size="lg"
              >
                <a href={profile.resume.href} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-5 w-5 mr-2" />
                  {profile.resume.label}
                </a>
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{animationDelay: '2.9s'}}>
              {linkOrder.map((key, index) => {
                const link = links[key];
                const IconComponent = linkIcons[key];
                return (
                  <a
                    key={key}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-card border border-border hover:text-primary transition-all duration-300 hover:scale-125 hover:rotate-6 hover:shadow-xl group animate-bounce-in"
                    style={{animationDelay: `${3 + index * 0.1}s`}}
                    title={link.label}
                    aria-label={link.label}
                  >
                    <IconComponent className="h-5 w-5 group-hover:animate-pulse" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Content - Profile Image */}
          <div className={`order-1 lg:order-2 flex justify-center lg:justify-end transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`} style={{animationDelay: '1s'}}>
            <div className="relative group">
              {/* Main Image Container */}
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                {/* Profile Image */}
                <div className={`w-full h-full rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border-4 border-primary/30 overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:rotate-1 hover:shadow-2xl ${
                  isFloating ? 'animate-float' : ''
                }`}>
                  <img
                    src={profile.photo.src}
                    alt={profile.photo.alt}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -top-8 -left-8 w-8 h-8 bg-primary/30 rounded-full blur-lg animate-ping"></div>
                <div className="absolute -bottom-6 -right-6 w-10 h-10 bg-primary/25 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>

                {/* Orbiting Elements */}
                <div className="absolute inset-0 animate-spin-slow">
                  <div className="absolute top-4 left-1/2 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 left-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                </div>
              </div>

              {/* Background Decoration */}
              <div className="absolute -inset-8 bg-gradient-to-br from-primary/5 to-transparent rounded-full -z-10 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
