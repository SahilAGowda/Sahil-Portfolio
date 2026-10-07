import { Award, Calendar, ExternalLink, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { certifications, codingProfiles } from "@/data/credentials";

export function Certifications() {
  return (
    <section className="portfolio-section">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">Certifications</h2>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {certifications.map((cert) => (
            <Card key={cert.title} className="card-hover bg-card border-border p-6 flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {cert.title}
                  </h3>
                  <div className="flex items-center gap-2 text-primary font-medium text-sm mb-1">
                    <User className="h-4 w-4" />
                    <span>{cert.issuer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{cert.year}</span>
                  </div>
                  {cert.kind && (
                    <p className="text-text-secondary text-sm mt-1">{cert.kind}</p>
                  )}
                </div>
              </div>

              {cert.url && (
                <Button asChild className="w-full btn-secondary mt-auto" size="sm">
                  <a href={cert.url} target="_blank" rel="noopener noreferrer">
                    <Award className="h-4 w-4 mr-2" />
                    Open certificate
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              )}
            </Card>
          ))}
        </div>

        {/* Coding Profiles Section */}
        <div className="border-t border-border pt-12">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            Coding profiles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {codingProfiles.map((profile) => (
              <Card key={profile.platform} className="card-hover bg-card border-border p-4 text-center group">
                <a
                  href={profile.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                    {profile.platform}
                  </h4>
                  <p className="text-text-muted text-xs">@{profile.handle}</p>
                  {profile.stat && (
                    <p className="text-primary font-medium text-sm mt-2">{profile.stat}</p>
                  )}
                </a>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
