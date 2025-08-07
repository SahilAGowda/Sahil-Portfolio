import { Trophy, Users, Award, Code, Zap, Star } from "lucide-react";
import { Card } from "@/components/ui/card";

const achievements = [
  {
    title: "Top 100 among 800+ teams",
    event: "Code Red Hackathon (BMIST)",
    year: "2024",
    description: "Secured position in top 100 among 800+ participating teams in this prestigious coding competition.",
    icon: Trophy,
    category: "Competition",
    highlight: true
  },
  {
    title: "Winner - GDG Quizzard",
    event: "Google Developer Group Tech Quiz",
    year: "2024",
    description: "Won the technical quiz competition organized by Google Developer Group, demonstrating strong technical knowledge.",
    icon: Award,
    category: "Achievement",
    highlight: false
  },
  {
    title: "2nd Place - Coding Competition",
    event: "Don Bosco Institute",
    year: "2023",
    description: "Achieved second position in the annual coding competition, showcasing problem-solving skills.",
    icon: Code,
    category: "Competition",
    highlight: false
  },
  {
    title: "Abstract Selected - SIT Hackathon",
    event: "IEEE COMSOC",
    year: "2024",
    description: "Research abstract selected for presentation at the prestigious SIT Hackathon organized by IEEE COMSOC.",
    icon: Star,
    category: "Research",
    highlight: false
  },
  {
    title: "Smart India Hackathon Participant",
    event: "National Level Innovation Challenge",
    year: "2024",
    description: "Selected to participate in India's biggest hackathon, representing innovative solutions to real-world problems.",
    icon: Zap,
    category: "National",
    highlight: true
  },
  {
    title: "TCS TechBytes Qualified",
    event: "TCS Competitive Assessment",
    year: "2024",
    description: "Successfully qualified the competitive coding and aptitude test conducted by Tata Consultancy Services.",
    icon: Users,
    category: "Assessment",
    highlight: false
  }
];

export function Achievements() {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Competition":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "Achievement":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "Research":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "National":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Assessment":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <section className="portfolio-section">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">Achievements & Recognition</h2>
        
        <div className="space-y-6">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            
            return (
              <Card 
                key={index} 
                className={`
                  card-hover bg-card border-border p-6 lg:p-8 
                  ${achievement.highlight ? 'ring-2 ring-primary/20 bg-gradient-to-r from-primary/5 to-primary/10' : ''}
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`
                    flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                    ${achievement.highlight ? 'bg-primary/20' : 'bg-primary/10'}
                  `}>
                    <IconComponent className={`h-6 w-6 ${achievement.highlight ? 'text-primary' : 'text-primary'}`} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {achievement.title}
                        </h3>
                        <p className="text-primary font-semibold">
                          {achievement.event}
                        </p>
                      </div>
                      
                      <div className="mt-2 lg:mt-0 flex items-center gap-2">
                        <span className="text-text-secondary font-medium">
                          {achievement.year}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(achievement.category)}`}>
                          {achievement.category}
                        </span>
                        {achievement.highlight && (
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-text-secondary leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Achievement Stats */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="text-2xl font-bold text-primary mb-1">6+</div>
            <div className="text-sm text-text-muted">Major Achievements</div>
          </Card>
          <Card className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="text-2xl font-bold text-primary mb-1">3</div>
            <div className="text-sm text-text-muted">Hackathon Wins</div>
          </Card>
          <Card className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="text-2xl font-bold text-primary mb-1">2</div>
            <div className="text-sm text-text-muted">National Level</div>
          </Card>
          <Card className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="text-2xl font-bold text-primary mb-1">800+</div>
            <div className="text-sm text-text-muted">Competitors Beaten</div>
          </Card>
        </div>
      </div>
    </section>
  );
}