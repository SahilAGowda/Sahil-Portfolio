import { Link } from "react-router-dom";
import type { Project } from "@/data/projects";
import { ProjectLinks } from "./ProjectLinks";

/** One personal project as a card: text and links only, so a longer list stays short. The diagram is on its case-study page. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <li className="flex flex-col rounded-lg border border-border p-5 md:p-6">
      <h3 className="text-lede font-semibold">
        {project.caseStudy ? (
          <Link to={`/projects/${project.slug}`} className="underline-offset-4 hover:underline">
            {project.title}
          </Link>
        ) : (
          project.title
        )}
      </h3>
      {project.year && <p className="text-muted-foreground">{project.year}</p>}
      <p className="mt-3 max-w-[64ch]">{project.blurb ?? project.summary}</p>
      <p className="mt-3 max-w-[64ch] text-caption text-muted-foreground">
        <span className="font-semibold">Stack: </span>
        {project.stack.join(", ")}
      </p>
      <ProjectLinks project={project} quiet className="mt-auto pt-5" />
    </li>
  );
}
