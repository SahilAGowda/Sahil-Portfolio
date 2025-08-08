import { useState, useEffect } from "react";
import { Code, Database, Brain, Wrench, Server, Palette } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const skillCategories = [
  {
    title: "Programming Languages",
    icon: Code,
    color: "from-blue-500 to-purple-600",
    skills: [
      { name: "Java", level: 95 },
      { name: "JavaScript", level: 95 },
      { name: "Python", level: 90 },
      { name: "C", level: 80 }
    ]
  },
  {
    title: "Frontend Development",
    icon: Palette,
    color: "from-pink-500 to-rose-600",
    skills: [
      { name: "React", level: 92 },
      { name: "HTML5", level: 95 },
      { name: "CSS3", level: 90 },
      { name: "Tailwind CSS", level: 65 },
      { name: "Bootstrap", level: 80 }
    ]
  },
  {
    title: "Backend Development",
    icon: Server,
    color: "from-green-500 to-emerald-600",
    skills: [
      { name: "Spring Boot", level: 85 },
      { name: "Node.js", level: 88 },
      { name: "Express.js", level: 82 },
      { name: "REST APIs", level: 90 },
      { name: "JWT", level: 78 }
    ]
  },
  {
    title: "Databases",
    icon: Database,
    color: "from-orange-500 to-red-600",
    skills: [
      { name: "MySQL", level: 85 },
      { name: "MongoDB", level: 80 },
      { name: "PostgreSQL", level: 75 }
    ]
  },
  {
    title: "AI/ML & Data Science",
    icon: Brain,
    color: "from-violet-500 to-indigo-600",
    skills: [
      { name: "TensorFlow", level: 80 },
      { name: "OpenCV", level: 85 },
      { name: "Scikit-learn", level: 78 },
      { name: "Pandas", level: 82 },
      { name: "NumPy", level: 85 }
    ]
  },
  {
    title: "Tools & Technologies",
    icon: Wrench,
    color: "from-cyan-500 to-teal-600",
    skills: [
      { name: "Git", level: 90 },
      { name: "VS Code", level: 95 },
      { name: "Postman", level: 85 },
      { name: "Docker", level: 70 },
      { name: "AWS", level: 75 }
    ]
  }
];

export function Skills() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = ["All", ...skillCategories.map((c) => c.title)];

  const getLevelLabel = (level: number) => {
    if (level >= 90) return { text: "Expert", color: "bg-green-500/15 text-green-400 border-green-500/20" };
    if (level >= 80) return { text: "Advanced", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" };
    if (level >= 70) return { text: "Intermediate", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" };
    return { text: "Beginner", color: "bg-slate-500/15 text-slate-300 border-slate-500/20" };
  };

  const visibleCategories = activeCategory === "All"
    ? skillCategories
    : skillCategories.filter((c) => c.title === activeCategory);

  return (
    <section className="relative py-20 bg-background overflow-hidden">
      {/* Subtle floating background orbs */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float-delayed"></div>
      </div>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl font-bold text-foreground mb-4 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Technical Skills
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here are the technologies and tools I work with
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              className={activeCategory === cat ? "btn-primary" : "btn-secondary"}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Skills Categories */}
        <div className="space-y-16">
          {visibleCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            
            return (
              <div 
                key={categoryIndex}
                className={`transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: `${categoryIndex * 200}ms` }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center shadow-lg shadow-primary/10`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{category.title}</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent ml-4"></div>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {category.skills.map((skill, skillIndex) => (
                    <div
                      key={skillIndex}
                      className="group cursor-pointer"
                      onMouseEnter={() => setHoveredSkill(skill.name)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >
                      <Card className="p-6 text-center bg-card/80 backdrop-blur-sm border-border hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:scale-105">
                        <div className="space-y-4">
                          {/* Skill Name */}
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {skill.name}
                          </h4>
                          
                          {/* Circular Progress */}
                          <div className="relative w-24 h-24 mx-auto">
                            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                              {/* Background Circle */}
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                className="text-muted/20"
                              />
                              {/* Progress Circle */}
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="currentColor"
                                strokeWidth="9"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 45}`}
                                strokeDashoffset={`${2 * Math.PI * 45 * (1 - (isVisible ? skill.level / 100 : 0))}`}
                                className={`drop-shadow-sm transition-all duration-1500 ease-out ${
                                  categoryIndex === 0 ? 'text-blue-500' :
                                  categoryIndex === 1 ? 'text-pink-500' :
                                  categoryIndex === 2 ? 'text-green-500' :
                                  categoryIndex === 3 ? 'text-orange-500' :
                                  categoryIndex === 4 ? 'text-violet-500' :
                                  'text-cyan-500'
                                }`}
                                style={{ transitionDelay: `${categoryIndex * 200 + skillIndex * 100}ms` }}
                              />
                            </svg>
                            {/* Percentage Text */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                {skill.level}%
                              </span>
                            </div>
                          </div>
                          
                          {/* Skill Level Text */}
                          <div className="flex items-center justify-center">
                            {(() => {
                              const info = getLevelLabel(skill.level);
                              return (
                                <Badge className={`border ${info.color}`}>{info.text}</Badge>
                              );
                            })()}
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

  {/* Summary Stats */}
        <div className={`mt-20 transition-all duration-1000 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Card className="p-8 bg-muted/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {skillCategories.length}
                </div>
                <div className="text-sm text-muted-foreground">Skill Categories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {skillCategories.reduce((total, category) => total + category.skills.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Technologies</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {Math.round(skillCategories.reduce((total, category) => 
                    total + category.skills.reduce((sum, skill) => sum + skill.level, 0), 0) / 
                    skillCategories.reduce((total, category) => total + category.skills.length, 0))}%
                </div>
                <div className="text-sm text-muted-foreground">Average Proficiency</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">3+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}