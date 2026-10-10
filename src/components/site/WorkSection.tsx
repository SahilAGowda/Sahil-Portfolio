import { links } from "@/data/profile";
import { projects } from "@/data/projects";
import { ExternalLink } from "./ExternalLink";
import { ProjectRow } from "./ProjectRow";
import { Section } from "./Section";

export function WorkSection() {
  return (
    <Section id="work" title="Selected work">
      <ul className="mt-10 space-y-16">
        {projects.map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      </ul>
      <p className="mt-12">
        <ExternalLink href={links.github.href} className="link inline-flex min-h-11 items-center">
          Open GitHub profile
        </ExternalLink>
      </p>
    </Section>
  );
}
