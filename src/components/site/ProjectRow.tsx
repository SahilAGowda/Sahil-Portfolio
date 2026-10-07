import { Link } from "react-router-dom";
import { hasDiagram } from "@/data/diagrams";
import { projectMeta, type Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { ProjectDiagram } from "../diagrams/ProjectDiagram";
import { ExternalLink } from "./ExternalLink";

/** One project: its diagram on the left (when it has one), the text on the right. */
export function ProjectRow({ project }: { project: Project }) {
  const diagram = hasDiagram(project.slug);
  const meta = projectMeta(project);
  const hasLinks = project.caseStudy || project.repo || project.live;

  return (
    <li className="md:grid md:grid-cols-[20rem_1fr] md:gap-x-10">
      {diagram && (
        <div className="mb-6 max-w-[20rem] md:mb-0 md:max-w-none">
          <ProjectDiagram slug={project.slug} variant="compact" />
        </div>
      )}
      <div className={cn(!diagram && "md:col-start-2")}>
        <h3 className="text-lede font-semibold">{project.title}</h3>
        {meta && <p className="text-muted-foreground">{meta}</p>}
        <p className="mt-3 max-w-[64ch]">{project.summary}</p>
        <p className="mt-3 max-w-[64ch] text-caption text-muted-foreground">
          <span className="font-semibold">Stack: </span>
          {project.stack.join(", ")}
        </p>
        {hasLinks && (
          <p className="mt-2 flex flex-wrap gap-x-6">
            {project.caseStudy && (
              <Link to={`/projects/${project.slug}`} className="link inline-flex min-h-11 items-center">
                Read case study<span className="sr-only"> for {project.title}</span>
              </Link>
            )}
            {project.repo && (
              <ExternalLink href={project.repo} className="link inline-flex min-h-11 items-center">
                Open repository
              </ExternalLink>
            )}
            {project.live && (
              <ExternalLink href={project.live} className="link inline-flex min-h-11 items-center">
                Open live demo
              </ExternalLink>
            )}
          </p>
        )}
      </div>
    </li>
  );
}
