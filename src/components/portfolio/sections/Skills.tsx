import { useState, useEffect } from "react";
import { Code, Database, Brain, Wrench, Server, Palette } from "lucide-react";
import { Card } from "@/components/ui/card";

const skillCategories = [
  {
    title: "Programming Languages",
    icon: Code,
    color: "from-blue-500 to-purple-600",
    skills: [
      { name: "JavaScript", level: 90 },
      { name: "Python", level: 85 },
      { name: "Java", level: 88 },
      { name: "TypeScript", level: 70 },
      { name: "SQL", level: 80 }
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
      { name: "PostgreSQL", level: 75 },
      { name: "Firebase", level: 70 }
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

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-20 bg-background">
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

        {/* Skills Categories */}
        <div className="space-y-16">
          {skillCategories.map((category, categoryIndex) => {
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
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{category.title}</h3>
                  <div className="flex-1 h-px bg-border ml-4"></div>
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
                      <Card className="p-6 text-center bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="space-y-4">
                          {/* Skill Name */}
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {skill.name}
                          </h4>
                          
                          {/* Circular Progress */}
                          <div className="relative w-20 h-20 mx-auto">
                            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                              {/* Background Circle */}
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                className="text-muted/30"
                              />
                              {/* Progress Circle */}
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 45}`}
                                strokeDashoffset={`${2 * Math.PI * 45 * (1 - (isVisible ? skill.level / 100 : 0))}`}
                                className={`transition-all duration-1500 ease-out ${
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
                              <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                {skill.level}%
                              </span>
                            </div>
                          </div>
                          
                          {/* Skill Level Text */}
                          <div className="text-sm text-muted-foreground">
                            {skill.level >= 90 ? 'Expert' : 
                             skill.level >= 80 ? 'Advanced' : 
                             skill.level >= 70 ? 'Intermediate' : 'Beginner'}
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