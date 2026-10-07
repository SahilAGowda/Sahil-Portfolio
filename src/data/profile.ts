// Single source for identity, contact details and every outbound link.
// Components read from here; do not repeat these values in JSX.

export const SITE_URL = "https://sahil-a-gowda-portfolio.vercel.app";

export type LinkKey = "github" | "linkedin" | "leetcode" | "hackerrank" | "codechef";

export interface ProfileLink {
  label: string;
  href: string;
  /** Account name, where one is useful next to the label. */
  handle?: string;
}

export const links: Record<LinkKey, ProfileLink> = {
  github: { label: "GitHub", href: "https://github.com/SahilAGowda", handle: "SahilAGowda" },
  linkedin: { label: "LinkedIn", href: "https://www.linkedin.com/in/sahil-a-gowda-551b32270/" },
  leetcode: { label: "LeetCode", href: "https://leetcode.com/u/sahilgowda204/", handle: "sahilgowda204" },
  hackerrank: {
    label: "HackerRank",
    href: "https://www.hackerrank.com/profile/sahilgowda204",
    handle: "sahilgowda204",
  },
  codechef: {
    label: "CodeChef",
    href: "https://www.codechef.com/users/sahilgowda204",
    handle: "sahilgowda204",
  },
};

/** Order used wherever the links render as a row. */
export const linkOrder: LinkKey[] = ["github", "linkedin", "leetcode", "hackerrank", "codechef"];

export const profile = {
  name: "Sahil A Gowda",
  /** Short role line, used under the name and in metadata. */
  role: "Backend and AI engineer",
  /** The hero line: what I do. */
  headline: "I build data pipelines, search and RAG systems.",
  /** The home page's <title> and meta description; also used by index.html and the social card. */
  title: "Sahil A Gowda, backend and AI engineer",
  description:
    "Backend and AI engineer in Bengaluru. Spring Batch ingestion at 273 million records, Elasticsearch search, RAG chatbots and a multi-tenant WhatsApp agent.",
  summary:
    "I'm a software development engineer at DIATOZ in Bengaluru, building Java backends and applied-AI systems. " +
    "I built a Spring Batch pipeline that ingests about 273 million records and an Elasticsearch read path that cut report queries from 1 s to 400 ms. " +
    "I also build RAG chatbots with LangChain and LangGraph, and a multi-tenant WhatsApp agent on Meta's Cloud API.",
  contact: {
    email: "sahilgowda204@gmail.com",
    location: "Bengaluru, India",
  },
  photo: { base: "/portrait", alt: "Portrait of Sahil A Gowda", width: 96, height: 120 },
  /** One label for the one action, wherever the resume link appears. */
  resume: { href: "/Sahil-A-Gowda-Resume.pdf", label: "Open resume" },
};

/** The page sections, in order. The nav, the flowline and the scroll-spy all read this. */
export const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

/** Phrases in the summary that link to the case study holding the proof. */
export const summaryLinks: { text: string; slug: string }[] = [
  { text: "273 million records", slug: "ingestion-pipelines" },
  { text: "from 1 s to 400 ms", slug: "report-search" },
];
