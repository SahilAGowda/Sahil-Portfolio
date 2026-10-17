import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { links, profile, summaryLinks } from "@/data/profile";
import { projects } from "@/data/projects";
import { ExternalLink } from "./ExternalLink";

/** The summary, with each proof phrase linked to its case study once that page exists. */
function Summary() {
  const linkable = summaryLinks.filter((link) => projects.some((p) => p.slug === link.slug && p.caseStudy));
  const nodes: ReactNode[] = [];
  let rest: string = profile.summary;
  let key = 0;

  while (rest) {
    let best: { index: number; link: (typeof linkable)[number] } | null = null;
    for (const link of linkable) {
      const index = rest.indexOf(link.text);
      if (index >= 0 && (!best || index < best.index)) best = { index, link };
    }
    if (!best) {
      nodes.push(rest);
      break;
    }
    if (best.index > 0) nodes.push(rest.slice(0, best.index));
    nodes.push(
      <Link key={key++} to={`/projects/${best.link.slug}`} className="link">
        {best.link.text}
      </Link>,
    );
    rest = rest.slice(best.index + best.link.text.length);
  }

  return <>{nodes}</>;
}

export function Hero() {
  return (
    <section
      id="about"
      tabIndex={-1}
      aria-labelledby="hero-title"
      className="enter pt-16 outline-none lg:pt-28"
    >
      <p className="relative text-muted-foreground before:absolute before:-left-6 before:top-[0.5em] before:h-3 before:w-3 before:rounded-full before:border-2 before:border-primary before:bg-primary lg:before:hidden">
        {profile.role}
      </p>
      <h1 id="hero-title" className="mt-3 text-h1-sm font-bold sm:text-h1">
        {profile.headline}
      </h1>
      <p className="mt-6 max-w-[64ch]">
        <Summary />
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button asChild size="lg">
          <a href={`mailto:${profile.contact.email}`}>Email me</a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <ExternalLink href={profile.resume.href}>{profile.resume.label}</ExternalLink>
        </Button>
      </div>
      <p className="mt-5 flex flex-wrap gap-x-6 gap-y-1">
        <ExternalLink href={links.linkedin.href} className="link inline-flex min-h-11 items-center">
          {links.linkedin.label}
        </ExternalLink>
        <ExternalLink href={links.github.href} className="link inline-flex min-h-11 items-center">
          {links.github.label}
        </ExternalLink>
      </p>
    </section>
  );
}
