// Sources: resume-latest.pdf, the Facts in the v2 brief, the owner's account of the DIATOZ work (9 October 2026),
// and the READMEs of the public repos linked below. DIATOZ entries are employer work described in general terms: no code links.

export interface Project {
  /** Used by the /projects/:slug case-study route. */
  slug: string;
  title: string;
  origin?: "DIATOZ" | "Personal";
  year?: string;
  summary: string;
  stack: string[];
  /** True when src/data/caseStudies.ts has content for this slug, which turns on its /projects/:slug page and links. */
  caseStudy?: boolean;
  /** Public repositories only. */
  repo?: string;
  live?: string;
}

// Display order.
export const projects: Project[] = [
  {
    slug: "master-data-ingestion",
    title: "Master-data ingestion at 273 million records",
    origin: "DIATOZ",
    summary:
      "A Spring Batch flow loads CSV files of device records into master data. The first version inserted one record at a time and needed around 16 hours per million. I reworked it with parallel workers and batch writes: a million records now load in about 1.5 to 2 minutes, and the data set of about 273 million records went in as 273 files. I also fixed jobs that got stuck in a stopping state.",
    stack: ["Java", "Spring Batch", "JDBC", "PostgreSQL", "Elasticsearch"],
    caseStudy: true,
  },
  {
    slug: "bulk-store-upload",
    title: "Bulk store upload from Excel",
    origin: "DIATOZ",
    summary:
      "Users create stores by uploading an Excel file. Loading the whole workbook into memory hung the application on a 4,000-store upload, and adding production space did not help. I reworked the validation flow to validate once and save in the background, and up to 4,000 stores now go in with one upload.",
    stack: ["Java", "Spring Boot", "Apache POI", "JDBC"],
    caseStudy: true,
  },
  {
    slug: "report-search",
    title: "Report search on Elasticsearch",
    origin: "DIATOZ",
    summary:
      "7+ report APIs serve multi-filter analytics over ticket data, each with a PDF and Excel download. Moving the reads from multi-join database queries to Elasticsearch cut query latency from 4–5 s to 400 ms: old tickets were backfilled into the report indexes and new ones are indexed asynchronously, while PostgreSQL stays the source of truth and an audit mechanism checks that the two stay consistent.",
    stack: ["Spring Boot", "Elasticsearch", "PostgreSQL", "Apache POI"],
    caseStudy: true,
  },
  {
    slug: "rag-chatbot",
    title: "RAG chatbot over ingested documents",
    origin: "DIATOZ",
    summary:
      "A proof-of-concept chatbot on LangChain and LangGraph. It answers from ingested documents held in Milvus, which I chose over Pinecone because it is open source and runs locally in Docker, and sends other questions, such as creating or checking a ticket, to service APIs. I implemented reranking, multi-representation indexing, query structuring and logical routing.",
    stack: ["LangChain", "LangGraph", "Milvus"],
    caseStudy: true,
  },
  {
    slug: "whatsapp-agent",
    title: "WhatsApp agent on Meta's Cloud API",
    origin: "DIATOZ",
    summary:
      "A proof-of-concept WhatsApp agent on Meta's Cloud API, built for a single tenant and configurable for more. Parts lookup is LLM-as-selector RAG over an Elasticsearch shortlist, slot-filling and service booking are deterministic, PDFs are delivered in chat, and Nginx fronts the webhook callbacks.",
    stack: ["Meta WhatsApp Cloud API", "RAG", "Elasticsearch", "Nginx"],
    caseStudy: true,
  },
  {
    slug: "gmailsage",
    title: "GmailSage",
    origin: "Personal",
    summary:
      "Triages a Gmail inbox every 15 minutes: rules first, an LLM (Groq) as the fallback. It labels and archives job-alert spam, sends a daily digest of what matters, and logs every action so it can be undone.",
    stack: ["Python", "Gmail API", "Groq", "SQLite"],
    caseStudy: true,
    repo: "https://github.com/SahilAGowda/GmailSage",
  },
  {
    slug: "meet-transcriber",
    title: "Meet transcriber extension",
    origin: "Personal",
    summary:
      "Transcribes a Google Meet tab locally: a Brave extension sends short audio chunks to a FastAPI backend that runs faster-whisper on CPU and writes a Markdown transcript.",
    stack: ["Python", "FastAPI", "faster-whisper", "JavaScript"],
    repo: "https://github.com/SahilAGowda/Meet-Transcriber-Extension",
  },
  {
    slug: "railway-reservation",
    title: "Railway Reservation System",
    year: "2024",
    summary:
      "A ticket-booking backend with train search, booking and cancellation. Role-based access control with JWT secures user and admin access, and Hibernate with JPA handles persistence.",
    stack: ["Java", "Spring Boot", "MySQL", "Hibernate", "JWT", "Maven"],
  },
];

const originLabel: Record<NonNullable<Project["origin"]>, string> = {
  DIATOZ: "Work at DIATOZ",
  Personal: "Personal project",
};

/** The short line under a project title: where it was built, or its year. */
export function projectMeta(project: Project): string | undefined {
  return project.origin ? originLabel[project.origin] : project.year;
}

/** Projects that have a case-study page, in display order. */
export const caseStudyProjects = projects.filter((project) => project.caseStudy);
