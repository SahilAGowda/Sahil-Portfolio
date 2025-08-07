import { GraduationCap, Award, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

const educationData = [
  {
    degree: "B.E. in Computer Science and Engineering",
    institution: "Cambridge Institute of Technology",
    location: "Bangalore, India",
    period: "2020 - 2024",
    grade: "CGPA: 9.25",
    type: "Bachelor's Degree",
    highlights: [
      "Specialized in Full Stack Development and AI/ML",
      "Active member of coding clubs and technical societies",
      "Participated in multiple hackathons and coding competitions"
    ]
  },
  {
    degree: "Pre-University (PUC)",
    institution: "M.E.S. Pre-University College",
    location: "Bangalore, India",
    period: "2020 - 2022",
    grade: "89%",
    type: "Pre-University",
    highlights: [
      "Science stream with focus on Mathematics and Computer Science",
      "Consistent academic performance with distinction",
      "Developed foundational programming skills"
    ]
  },
  {
    degree: "High School (SSLC)",
    institution: "Sri Jnanvardhaka English High School",
    location: "Bangalore, India",
    period: "2007 - 2020",
    grade: "97%",
    type: "Secondary Education",
    highlights: [
      "Exceptional academic performance with highest honors",
      "Strong foundation in mathematics and sciences",
      "Early exposure to computer programming concepts"
    ]
  }
];

export function Education() {
  return (
    <section className="portfolio-section">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">Educational Background</h2>
        
        <div className="space-y-6">
          {educationData.map((edu, index) => (
            <Card key={index} className="card-hover bg-card border-border p-6 lg:p-8">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        {edu.degree}
                      </h3>
                      <p className="text-primary font-semibold text-lg">
                        {edu.institution}
                      </p>
                      <p className="text-text-secondary text-sm">
                        {edu.location}
                      </p>
                    </div>
                    
                    <div className="mt-2 lg:mt-0 lg:text-right">
                      <div className="flex items-center gap-1 text-text-secondary text-sm mb-1">
                        <Calendar className="h-4 w-4" />
                        <span>{edu.period}</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary font-semibold">
                        <Award className="h-4 w-4" />
                        <span>{edu.grade}</span>
                      </div>
                      <span className="inline-block mt-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">
                        {edu.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Key Highlights:</h4>
                    <ul className="space-y-1">
                      {edu.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-text-secondary text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Academic Excellence Banner */}
        <Card className="mt-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 p-6">
          <div className="text-center">
            <h3 className="text-lg font-bold text-foreground mb-2">Academic Excellence</h3>
            <p className="text-text-secondary">
              Consistent high performance across all educational levels, demonstrating 
              strong analytical skills and dedication to learning.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}