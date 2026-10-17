import { Link } from "react-router-dom";
import { hasDiagram } from "@/data/diagrams";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { ProjectDiagram } from "../diagrams/ProjectDiagram";
import { ProjectLinks } from "./ProjectLinks";

/** One company-work project: its diagram on the left (when it has one), the text on the right. */
export function ProjectRow({ project }: { project: Project }) {
  const diagram = hasDiagram(project.slug);

  return (
    <li className="md:grid md:grid-cols-[20rem_1fr] md:gap-x-10">
      {diagram && (
        <div className="mb-6 max-w-[20rem] md:mb-0 md:max-w-none">
          <ProjectDiagram slug={project.slug} variant="compact" />
        </div>
      )}
      <div className={cn(!diagram && "md:col-start-2")}>
        <h3 className="text-lede font-semibold">
          {project.caseStudy ? (
            <Link to={`/projects/${project.slug}`} className="underline-offset-4 hover:underline">
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </h3>
        <p className="mt-3 max-w-[64ch]">{project.summary}</p>
        <p className="mt-3 max-w-[64ch] text-caption text-muted-foreground">
          <span className="font-semibold">Stack: </span>
          {project.stack.join(", ")}
        </p>
        <ProjectLinks project={project} className="mt-4" />
      </div>
    </li>
  );
}
