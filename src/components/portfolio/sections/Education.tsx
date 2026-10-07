import { Award, Calendar, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { education } from "@/data/credentials";

export function Education() {
  const [degree, ...school] = education;

  return (
    <section className="portfolio-section">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">Education</h2>

        <Card className="card-hover bg-card border-border p-6 lg:p-8">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {degree.degree}
                  </h3>
                  <p className="text-primary font-semibold text-lg">
                    {degree.institution}
                  </p>
                  {degree.location && (
                    <p className="text-text-secondary text-sm">
                      {degree.location}
                    </p>
                  )}
                </div>

                <div className="mt-2 lg:mt-0 lg:text-right">
                  <div className="flex items-center gap-1 text-text-secondary text-sm mb-1 lg:justify-end">
                    <Calendar className="h-4 w-4" />
                    <span>{degree.period}</span>
                  </div>
                  {degree.grade && (
                    <div className="flex items-center gap-1 text-primary font-semibold lg:justify-end">
                      <Award className="h-4 w-4" />
                      <span>{degree.grade}</span>
                    </div>
                  )}
                  {degree.status && (
                    <p className="text-text-secondary text-sm mt-1">{degree.status}</p>
                  )}
                </div>
              </div>

              {degree.detail && (
                <p className="border-t border-border pt-4 mt-4 text-text-secondary text-sm">
                  {degree.detail}
                </p>
              )}
            </div>
          </div>
        </Card>

        <ul className="mt-6 space-y-3">
          {school.map((entry) => (
            <li
              key={entry.degree}
              className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 px-6 py-4 rounded-lg border border-border bg-card"
            >
              <span className="text-foreground">
                <span className="font-semibold">{entry.degree}</span>
                <span className="text-text-secondary">, {entry.institution}</span>
              </span>
              <span className="text-text-secondary text-sm">
                {[entry.period, entry.grade].filter(Boolean).join(", ")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
