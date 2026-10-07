// The search index, built from the same data modules the pages render, so a result can never disagree
// with the page it points to. Loaded only when the search dialog opens.

import { caseStudies } from "./caseStudies";
import { achievements, certifications, codingProfiles, education } from "./credentials";
import { experience } from "./experience";
import { profile } from "./profile";
import { projectMeta, projects } from "./projects";
import { segment, tokenize, type Segment } from "./searchText";
import { skillGroups } from "./skills";

export interface SearchEntry {
  /** Section name shown above the result. */
  where: string;
  title?: string;
  text: string;
  path: string;
  /** Element id on the target page, without the "#". */
  hash?: string;
  /** Skills weigh most, then projects and bullets, then everything else. */
  weight: number;
}

export interface SearchHit {
  entry: SearchEntry;
  snippet: Segment[];
}

const plain = (text: string) => text.replace(/`/g, "");

function buildIndex(): SearchEntry[] {
  const index: SearchEntry[] = [];
  const add = (entry: SearchEntry) => index.push({ ...entry, text: plain(entry.text) });

  add({
    where: "About",
    title: profile.headline,
    text: `${profile.role}. ${profile.summary}`,
    path: "/",
    hash: "about",
    weight: 2,
  });

  for (const job of experience) {
    for (const bullet of job.bullets) {
      add({ where: "Experience", title: job.title, text: bullet, path: "/", hash: "experience", weight: 3 });
    }
    add({ where: "Experience", title: job.title, text: `Stack: ${job.stack.join(", ")}`, path: "/", hash: "experience", weight: 4 });
  }

  for (const project of projects) {
    add({
      where: "Selected work",
      title: project.title,
      text: [projectMeta(project), project.summary, `Stack: ${project.stack.join(", ")}`].filter(Boolean).join(". "),
      path: project.caseStudy ? `/projects/${project.slug}` : "/",
      hash: project.caseStudy ? undefined : "work",
      weight: 4,
    });
  }

  for (const study of caseStudies) {
    const project = projects.find((entry) => entry.slug === study.slug);
    if (!project) continue;
    const where = `Case study: ${project.title}`;
    const path = `/projects/${study.slug}`;
    add({ where, text: study.outcome, path, weight: 3 });
    for (const paragraph of study.problem ?? []) add({ where, title: "Problem", text: paragraph, path, hash: "problem", weight: 3 });
    for (const item of study.constraints ?? []) add({ where, title: "Constraints", text: item, path, hash: "constraints", weight: 3 });
    for (const decision of study.decisions ?? []) {
      add({ where, title: decision.title, text: decision.body, path, hash: "decisions", weight: 3 });
    }
    for (const item of study.terms ?? []) add({ where, title: item.term, text: item.meaning, path, hash: "terms", weight: 2 });
    for (const result of study.results ?? []) {
      add({ where, title: result.figure, text: `${result.label}. Source: ${result.source}`, path, hash: "results", weight: 3 });
    }
  }

  for (const group of skillGroups) {
    add({ where: "Skills", title: group.title, text: group.items.join(", "), path: "/", hash: "skills", weight: 5 });
  }

  for (const entry of education) {
    const text = [entry.institution, entry.location, entry.period, entry.status, entry.grade, entry.detail].filter(Boolean).join(", ");
    add({ where: "Credentials", title: entry.degree, text, path: "/", hash: "credentials", weight: 2 });
  }
  for (const cert of certifications) {
    add({
      where: "Credentials",
      title: cert.title,
      text: [cert.issuer, cert.year, cert.kind].filter(Boolean).join(", "),
      path: "/",
      hash: "credentials",
      weight: 2,
    });
  }
  for (const item of achievements) {
    add({
      where: "Credentials",
      title: [item.title, item.event].filter(Boolean).join(", "),
      text: [item.year, item.detail].filter(Boolean).join(". "),
      path: "/",
      hash: "credentials",
      weight: 2,
    });
  }
  for (const item of codingProfiles) {
    add({ where: "Credentials", title: item.platform, text: "Coding profile", path: "/", hash: "credentials", weight: 1 });
  }

  add({ where: "Contact", title: "Get in touch", text: `${profile.contact.email}. ${profile.contact.location}`, path: "/", hash: "contact", weight: 1 });

  return index;
}

let cached: SearchEntry[] | undefined;

const WINDOW = 150;

/** A window of the entry text around the first match, with every match marked. */
function snippetOf(text: string, tokens: string[]): Segment[] {
  const lower = text.toLowerCase();
  let first = -1;
  for (const token of tokens) {
    const at = lower.indexOf(token);
    if (at !== -1 && (first === -1 || at < first)) first = at;
  }
  if (first === -1 || text.length <= WINDOW) return segment(text, tokens);

  const start = Math.max(0, first - 40);
  const end = Math.min(text.length, start + WINDOW);
  const runs = segment(text.slice(start, end), tokens);
  if (start > 0) runs.unshift({ text: "…", hit: false });
  if (end < text.length) runs.push({ text: "…", hit: false });
  return runs;
}

/** Every word of the query has to appear in the entry. Returns the best `limit` hits and the total count. */
export function searchSite(query: string, limit = 8): { hits: SearchHit[]; total: number } {
  const tokens = tokenize(query);
  if (!tokens.length) return { hits: [], total: 0 };

  cached ??= buildIndex();
  const scored: { entry: SearchEntry; score: number; order: number }[] = [];
  cached.forEach((entry, order) => {
    const title = (entry.title ?? "").toLowerCase();
    const haystack = `${title} ${entry.text.toLowerCase()}`;
    if (!tokens.every((token) => haystack.includes(token))) return;
    const inTitle = tokens.filter((token) => title.includes(token)).length;
    scored.push({ entry, score: entry.weight * 10 + inTitle * 5, order });
  });
  scored.sort((a, b) => b.score - a.score || a.order - b.order);

  return {
    total: scored.length,
    hits: scored.slice(0, limit).map(({ entry }) => ({ entry, snippet: snippetOf(entry.text, tokens) })),
  };
}
