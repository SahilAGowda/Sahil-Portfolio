import { Link } from "react-router-dom";
import { companyProjects, groups } from "@/data/projects";
import { ProjectRow } from "./ProjectRow";
import { Section } from "./Section";

/** Company work: the DIATOZ projects, each with its diagram and a link to its case study. */
export function WorkSection() {
  const { id, title, intro } = groups.company;
  const personal = groups.personal;
  return (
    <Section
      id={id}
      title={title}
      intro={
        <>
          {intro} My public code is under{" "}
          <Link to={{ pathname: "/", hash: `#${personal.id}` }} className="link">
            {personal.title}
          </Link>
          .
        </>
      }
    >
      <ul className="mt-10 space-y-16">
        {companyProjects.map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      </ul>
    </Section>
  );
}
