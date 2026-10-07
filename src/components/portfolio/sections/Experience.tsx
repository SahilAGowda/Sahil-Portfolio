import { Calendar, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { experience } from "@/data/experience";

export function Experience() {
  return (
    <section className="portfolio-section">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">Experience</h2>

        <div className="space-y-8">
          {experience.map((exp) => (
            <Card key={`${exp.company}-${exp.start}`} className="card-hover bg-card border-border p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-2">
                    {exp.title}
                  </h3>
                  <p className="text-primary font-semibold mb-1">
                    {exp.companyUrl ? (
                      <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="text-lg hover:underline">
                        {exp.company}
                      </a>
                    ) : (
                      <span className="text-lg">{exp.company}</span>
                    )}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-text-secondary text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{exp.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{exp.start} – {exp.end}</span>
                    </div>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {exp.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <ul className="space-y-2">
                  {exp.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-text-secondary">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-text-muted mb-2">Stack</p>
                <ul className="flex flex-wrap gap-2">
                  {exp.stack.map((skill) => (
                    <li key={skill} className="skill-badge">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
