import { Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { achievements } from "@/data/credentials";

export function Achievements() {
  return (
    <section className="portfolio-section">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">Achievements</h2>

        <div className="space-y-6">
          {achievements.map((achievement) => (
            <Card key={`${achievement.event}-${achievement.title}`} className="card-hover bg-card border-border p-6 lg:p-8">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        {achievement.title}
                      </h3>
                      {achievement.event && (
                        <p className="text-primary font-semibold">
                          {achievement.event}
                        </p>
                      )}
                    </div>

                    {achievement.year && (
                      <span className="mt-2 lg:mt-0 text-text-secondary font-medium">
                        {achievement.year}
                      </span>
                    )}
                  </div>

                  {achievement.detail && (
                    <p className="mt-3 text-text-secondary leading-relaxed">
                      {achievement.detail}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
