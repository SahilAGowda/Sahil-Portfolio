import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { ResponsiveProjectDiagram } from "@/components/diagrams/ProjectDiagram";
import { ExternalLink } from "@/components/site/ExternalLink";
import { Rich } from "@/components/site/Rich";
import { employerNote, getCaseStudy, type CaseStudy } from "@/data/caseStudies";
import { hasDiagram } from "@/data/diagrams";
import { caseStudyProjects, projectMeta, type Project } from "@/data/projects";
import { usePageMeta } from "@/hooks/usePageMeta";
import NotFound from "./NotFound";

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} tabIndex={-1} aria-labelledby={`${id}-title`} className="mt-14 scroll-mt-20 outline-none lg:scroll-mt-10">
      <h2 id={`${id}-title`} className="text-h2-sm font-semibold">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function CaseStudyPage({ project, study }: { project: Project; study: CaseStudy }) {
  usePageMeta({
    title: `${project.title} | Sahil A Gowda`,
    description: study.outcome.replace(/`/g, ""),
    path: `/projects/${project.slug}`,
  });

  const index = caseStudyProjects.findIndex((entry) => entry.slug === project.slug);
  const next = caseStudyProjects[index + 1];
  const meta = projectMeta(project);

  return (
    <article className="enter pt-10 lg:pt-20">
      <Link to={{ pathname: "/", hash: "#work" }} className="link inline-flex min-h-11 items-center">
        Back to work
      </Link>

      <header className="mt-4">
        {meta && <p className="text-muted-foreground">{meta}</p>}
        <h1 className="mt-3 text-h2 font-bold sm:text-h1-sm">{project.title}</h1>
        <p className="mt-6 max-w-[64ch] text-lede">
          <Rich text={study.outcome} />
        </p>
        {project.origin === "DIATOZ" && (
          <p className="mt-4 max-w-[64ch] text-caption text-muted-foreground">{employerNote}</p>
        )}
        {(project.repo || project.live) && (
          <p className="mt-3 flex flex-wrap gap-x-6">
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
      </header>

      {hasDiagram(project.slug) && (
        <Block id="diagram" title="How it fits together">
          <ResponsiveProjectDiagram slug={project.slug} />
        </Block>
      )}

      {study.problem && (
        <Block id="problem" title="Problem">
          <div className="max-w-[64ch] space-y-4">
            {study.problem.map((paragraph) => (
              <p key={paragraph}>
                <Rich text={paragraph} />
              </p>
            ))}
          </div>
        </Block>
      )}

      {study.constraints && (
        <Block id="constraints" title="Constraints">
          <ul className="max-w-[64ch] list-disc space-y-2 pl-5 marker:text-muted-foreground">
            {study.constraints.map((item) => (
              <li key={item}>
                <Rich text={item} />
              </li>
            ))}
          </ul>
        </Block>
      )}

      {study.decisions && (
        <Block id="decisions" title="Decisions and trade-offs">
          <ul className="space-y-8">
            {study.decisions.map((decision) => (
              <li key={decision.title}>
                <h3 className="text-lede font-semibold">{decision.title}</h3>
                <p className="mt-1 max-w-[64ch]">
                  <Rich text={decision.body} />
                </p>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {study.terms && (
        <Block id="terms" title="Terms">
          <p className="max-w-[64ch] text-muted-foreground">What the labels mean, in general terms.</p>
          <dl className="mt-4 max-w-[64ch] space-y-4">
            {study.terms.map((item) => (
              <div key={item.term}>
                <dt className="font-semibold">{item.term}</dt>
                <dd>{item.meaning}</dd>
              </div>
            ))}
          </dl>
        </Block>
      )}

      {study.results && (
        <Block id="results" title="Results">
          <dl className="space-y-6">
            {study.results.map((result) => (
              <div key={result.figure} className="md:grid md:grid-cols-[13rem_1fr] md:gap-x-6">
                <dt className="text-lede font-semibold tabular-nums">{result.figure}</dt>
                <dd className="max-w-[64ch]">
                  <p>{result.label}</p>
                  <p className="text-caption text-muted-foreground">
                    Source: <Rich text={result.source} />
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </Block>
      )}

      <Block id="stack" title="Stack">
        <p className="max-w-[64ch]">{project.stack.join(", ")}</p>
      </Block>

      <nav aria-label="More case studies" className="mt-16 flex flex-wrap gap-x-8 border-t border-border pt-4">
        <Link to={{ pathname: "/", hash: "#work" }} className="link inline-flex min-h-11 items-center">
          Back to work
        </Link>
        {next && (
          <Link to={`/projects/${next.slug}`} className="link inline-flex min-h-11 items-center">
            Next case study: {next.title}
          </Link>
        )}
      </nav>
    </article>
  );
}

const Project = () => {
  const { slug = "" } = useParams();
  const project = caseStudyProjects.find((entry) => entry.slug === slug);
  const study = getCaseStudy(slug);
  if (!project || !study) return <NotFound />;
  return <CaseStudyPage project={project} study={study} />;
};

export default Project;
