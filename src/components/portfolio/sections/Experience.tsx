import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";

const experiences = [
  {
    title: "Image Quality Assessment Intern",
    company: "Samsung Prism",
    location: "Bangalore, India",
    period: "2024 - Present",
    type: "Internship",
    description: [
      "Proposed Transformer-Refined CNN model for image quality prediction with enhanced accuracy",
      "Worked on deep learning algorithms for perceptual image analysis and quality assessment",
      "Collaborated with senior researchers on cutting-edge computer vision projects",
      "Implemented and optimized neural network architectures for real-time image processing"
    ],
    skills: ["Deep Learning", "Computer Vision", "Python", "TensorFlow", "CNN", "Transformers"]
  },
  {
    title: "AI/ML Lead",
    company: "Google Developer Group (GDG)",
    location: "Bangalore, India", 
    period: "2023 - 2025",
    type: "Leadership",
    description: [
      "Organized AI/ML workshops and hackathons for 500+ participants",
      "Mentored students in machine learning concepts and practical implementations",
      "Led community projects focused on AI applications in real-world scenarios",
      "Coordinated with Google Developer Experts to deliver high-quality technical content"
    ],
    skills: ["Leadership", "AI/ML", "Community Building", "Mentoring", "Event Management"]
  }
];

export function Experience() {
  return (
    <section className="portfolio-section">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">Professional Experience</h2>
        
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <Card key={index} className="card-hover bg-card border-border p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-2">
                    {exp.title}
                  </h3>
                  <div className="flex items-center gap-2 text-primary font-semibold mb-1">
                    <span className="text-lg">{exp.company}</span>
                    <ExternalLink className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-text-secondary text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{exp.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{exp.period}</span>
                    </div>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {exp.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <ul className="space-y-2">
                  {exp.description.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-text-secondary">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-text-muted mb-2">Key Technologies:</p>
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill, idx) => (
                    <span key={idx} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}