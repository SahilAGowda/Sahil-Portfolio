import { Code, Database, Brain, Wrench, Server, Palette } from "lucide-react";
import { Card } from "@/components/ui/card";

const skillCategories = [
  {
    title: "Programming Languages",
    icon: Code,
    skills: [
      { name: "JavaScript", level: 90 },
      { name: "Python", level: 85 },
      { name: "Java", level: 88 },
      { name: "TypeScript", level: 82 },
      { name: "SQL", level: 80 }
    ]
  },
  {
    title: "Frontend Development",
    icon: Palette,
    skills: [
      { name: "React", level: 92 },
      { name: "HTML5", level: 95 },
      { name: "CSS3", level: 90 },
      { name: "Tailwind CSS", level: 85 },
      { name: "Bootstrap", level: 80 }
    ]
  },
  {
    title: "Backend Development",
    icon: Server,
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
  return (
    <section className="portfolio-section">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">Technical Skills</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => {
            const IconComponent = category.icon;
            
            return (
              <Card key={index} className="card-hover bg-card border-border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{category.title}</h3>
                </div>
                
                <div className="space-y-4">
                  {category.skills.map((skill, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">{skill.name}</span>
                        <span className="text-xs text-text-muted">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Additional Skills Section */}
        <Card className="mt-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 p-6">
          <h3 className="text-xl font-bold text-foreground mb-4 text-center">Additional Competencies</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-xl">🚀</span>
              </div>
              <p className="text-sm font-medium text-foreground">Performance Optimization</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-xl">🔒</span>
              </div>
              <p className="text-sm font-medium text-foreground">Security Best Practices</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-xl">📱</span>
              </div>
              <p className="text-sm font-medium text-foreground">Responsive Design</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
              <p className="text-sm font-medium text-foreground">Agile Development</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}