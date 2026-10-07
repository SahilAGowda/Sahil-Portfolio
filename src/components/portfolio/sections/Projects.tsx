import { ExternalLink, Github } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { links } from "@/data/profile";
import { projects } from "@/data/projects";

export function Projects() {
  return (
    <section className="portfolio-section">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.slug} className="card-hover bg-card border-border p-6 flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-lg font-bold text-foreground">
                  {project.title}
                </h3>
                {(project.origin || project.year) && (
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium whitespace-nowrap">
                    {project.origin === "DIATOZ" ? "Built at DIATOZ" : project.origin === "Personal" ? "Personal project" : project.year}
                  </span>
                )}
              </div>

              <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                {project.summary}
              </p>

              <ul className="flex flex-wrap gap-1 mb-4">
                {project.stack.map((tech) => (
                  <li key={tech} className="px-2 py-1 bg-code-bg text-foreground rounded text-xs font-medium">
                    {tech}
                  </li>
                ))}
              </ul>

              {(project.repo || project.live) && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.repo && (
                    <Button asChild size="sm" variant="outline" className="btn-secondary">
                      <a href={project.repo} target="_blank" rel="noopener noreferrer">
                        <Github className="h-3 w-3 mr-1" />
                        Open repository
                      </a>
                    </Button>
                  )}
                  {project.live && (
                    <Button asChild size="sm" className="btn-primary">
                      <a href={project.live} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open live demo
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild className="btn-primary">
            <a href={links.github.href} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-2" />
              Open GitHub profile
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
