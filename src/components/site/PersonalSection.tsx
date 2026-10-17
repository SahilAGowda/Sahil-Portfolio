import { links } from "@/data/profile";
import { groups, personalProjects } from "@/data/projects";
import { ExternalLink } from "./ExternalLink";
import { ProjectCard } from "./ProjectCard";
import { Section } from "./Section";

/** Personal projects: a grid of cards, with a link to the GitHub profile where the code is. */
export function PersonalSection() {
  const { id, title, intro } = groups.personal;
  return (
    <Section id={id} title={title} intro={intro}>
      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {personalProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </ul>
      <p className="mt-10">
        <ExternalLink href={links.github.href} className="link inline-flex min-h-11 items-center">
          Open GitHub profile
        </ExternalLink>
      </p>
    </Section>
  );
}
