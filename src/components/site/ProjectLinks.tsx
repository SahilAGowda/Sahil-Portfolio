import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { ExternalLink } from "./ExternalLink";

interface ProjectLinksProps {
  project: Project;
  /** The case-study button is an outline instead of a filled one, for cards that sit below the work rows in weight. */
  quiet?: boolean;
  className?: string;
}

/** What a reader can open for a project: its case study, its public repository, its live demo. */
export function ProjectLinks({ project, quiet, className }: ProjectLinksProps) {
  if (!project.caseStudy && !project.repo && !project.live) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-x-6 gap-y-1", className)}>
      {project.caseStudy && (
        <Button asChild variant={quiet ? "outline" : "default"} size="lg" className="text-[0.9375rem]">
          <Link to={`/projects/${project.slug}`}>
            Read the full case study<span className="sr-only"> for {project.title}</span>
          </Link>
        </Button>
      )}
      {project.repo && (
        <ExternalLink href={project.repo} className="link inline-flex min-h-11 items-center">
          Open repository<span className="sr-only"> for {project.title}</span>
        </ExternalLink>
      )}
      {project.live && (
        <ExternalLink href={project.live} className="link inline-flex min-h-11 items-center">
          Open live demo<span className="sr-only"> for {project.title}</span>
        </ExternalLink>
      )}
    </div>
  );
}
