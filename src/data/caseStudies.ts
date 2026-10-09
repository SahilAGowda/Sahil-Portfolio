// Case-study content. Every line traces to resume-latest.pdf, the Facts in the v2 brief, or (for GmailSage)
// the public repo's README and code. A section with no sourced content is left out, not padded.
//
// DIATOZ entries are employer work, described at resume level: no client names, code, schemas or data.
// Backticked text renders as inline code.

import { diagrams } from "./diagrams";
import { profile } from "./profile";
import { projects } from "./projects";

export interface Decision {
  title: string;
  body: string;
}

/** A short fact in the "At a glance" block under the page header. */
export interface GlanceItem {
  label: string;
  value: string;
}

/** One stop in the "follow the data" walkthrough. While it is selected, the diagram puts these nodes and edges in focus. */
export interface FlowStep {
  title: string;
  body: string;
  /** Node ids from the project's diagram. */
  nodes: string[];
  /** Edges as [from, to] node ids. */
  edges?: [string, string][];
}

/** A problem met along the way: what went wrong, what I did, and, when it is sourced, what changed. */
export interface Blocker {
  title: string;
  problem: string;
  fix: string;
  result?: string;
}

export interface Result {
  /** The number or short claim, for example "1 s to 400 ms". */
  figure: string;
  label: string;
  /** Where the number comes from, shown under it. */
  source: string;
}

export interface Term {
  term: string;
  meaning: string;
}

export interface CaseStudy {
  slug: string;
  /** One line: what it does and at what scale. Also the page's meta description. */
  outcome: string;
  /** When it was built, what my part was, and the scale. Only what the sources state. */
  glance?: GlanceItem[];
  problem?: string[];
  constraints?: string[];
  /** The design choices made up front, with the reason where a source gives one. */
  decisions?: Decision[];
  /** Walks the diagram in the order the data moves. Each step lights up part of it. */
  steps?: FlowStep[];
  /** Problems that came up while building it, and how each was handled. */
  blockers?: Blocker[];
  /** Plain-language definitions of labels used in the diagram. General meanings, not claims about the build. */
  terms?: Term[];
  results?: Result[];
}

export const employerNote = "Employer work, described at the level of my resume. Code and data are not public.";

export const caseStudies: CaseStudy[] = [
  {
    slug: "ingestion-pipelines",
    outcome:
      "Ingests about 273 million records with Spring Batch, and checks Excel workbooks against 14+ validation rules without loading whole files into memory.",
    glance: [
      { label: "When", value: "Internship at DIATOZ, October 2025 to May 2026" },
      { label: "My part", value: "I built both pipelines." },
      { label: "Scale", value: "About 273 million records. 14+ validation rules." },
    ],
    problem: [
      "Source data of about 273 million records had to be ingested into a database. A second pipeline had to take in Excel workbooks and validate them against 14+ rules.",
    ],
    constraints: [
      "Volume: about 273 million records.",
      "Memory: loading a whole workbook into memory exhausted the heap.",
      "Correctness: workbooks are checked against 14+ validation rules.",
    ],
    decisions: [
      {
        title: "Multithreaded processing with JDBC batch inserts",
        body: "The volume pipeline is a Spring Batch job. Processing is multithreaded, and writes reach the database as JDBC batch inserts.",
      },
    ],
    steps: [
      {
        title: "Source data arrives",
        body: "The volume pipeline starts from source data of about 273 million records.",
        nodes: ["src"],
      },
      {
        title: "A Spring Batch job processes it",
        body: "A Spring Batch job reads and processes the records, and the processing is multithreaded.",
        nodes: ["batch"],
        edges: [["src", "batch"]],
      },
      {
        title: "JDBC batch inserts write it",
        body: "Processed records reach the database through JDBC batch inserts.",
        nodes: ["jdbc", "db"],
        edges: [
          ["batch", "jdbc"],
          ["jdbc", "db"],
        ],
      },
      {
        title: "A workbook comes in",
        body: "The second pipeline takes in Excel workbooks.",
        nodes: ["xlsx"],
      },
      {
        title: "The workbook is streamed",
        body: "Apache POI SXSSF streams the workbook instead of loading all of it into memory.",
        nodes: ["stream"],
        edges: [["xlsx", "stream"]],
      },
      {
        title: "14+ rules validate it",
        body: "The workbook is checked against 14+ validation rules.",
        nodes: ["rules"],
        edges: [["stream", "rules"]],
      },
    ],
    blockers: [
      {
        title: "Loading whole workbooks exhausted the heap",
        problem: "The Excel pipeline loaded each whole workbook into memory, and that exhausted the heap.",
        fix: "I switched to streaming the workbooks with Apache POI SXSSF.",
        result: "That fixed the heap-exhaustion bug.",
      },
    ],
    results: [
      { figure: "about 273 million", label: "records handled by the Spring Batch pipeline", source: "my resume" },
      { figure: "14+", label: "validation rules in the Excel pipeline", source: "my resume" },
    ],
  },
  {
    slug: "report-search",
    outcome:
      "Cut read-heavy report query latency from 1 s to 400 ms by serving reads from Elasticsearch, with PostgreSQL still the source of truth.",
    glance: [
      { label: "When", value: "Internship at DIATOZ, October 2025 to May 2026" },
      { label: "My part", value: "I built the Spring Boot report APIs, fixed a production timeout and added an audit mechanism." },
      { label: "Scale", value: "Millions of records, multi-filter queries. Query latency from 1 s to 400 ms." },
    ],
    problem: [
      "Report APIs had to serve analytics over millions of records with multi-filter support. The queries were read-heavy and took about 1 s.",
    ],
    constraints: [
      "PostgreSQL stays the source of truth.",
      "Queries are read-heavy and combine several filters.",
      "Elasticsearch and PostgreSQL have to stay consistent.",
    ],
    decisions: [
      {
        title: "Elasticsearch for reads, PostgreSQL for truth",
        body: "Elasticsearch indexing serves the read-heavy, multi-filter queries. PostgreSQL remains the source of truth for the data.",
      },
    ],
    steps: [
      {
        title: "A client calls the report APIs",
        body: "Spring Boot REST APIs serve the report module.",
        nodes: ["client", "api"],
        edges: [["client", "api"]],
      },
      {
        title: "Queries are answered from Elasticsearch",
        body: "The read-heavy, multi-filter queries are served by Elasticsearch indexing. Query latency fell from 1 s to 400 ms.",
        nodes: ["es"],
        edges: [["api", "es"]],
      },
      {
        title: "PostgreSQL stays the source of truth",
        body: "PostgreSQL remains the source of truth for the data.",
        nodes: ["pg"],
      },
      {
        title: "Updates run asynchronously",
        body: "Updates to Elasticsearch and PostgreSQL run asynchronously, after a synchronous version caused a production server timeout.",
        nodes: ["api", "pg"],
        edges: [["api", "pg"]],
      },
      {
        title: "An audit check compares the two",
        body: "An audit mechanism verifies that Elasticsearch and PostgreSQL stay consistent.",
        nodes: ["audit", "es", "pg"],
        edges: [
          ["audit", "es"],
          ["audit", "pg"],
        ],
      },
    ],
    blockers: [
      {
        title: "A production server timeout",
        problem: "Updating Elasticsearch and PostgreSQL synchronously caused a production server timeout.",
        fix: "I made the updates asynchronous.",
      },
      {
        title: "Two stores that are no longer written in one step",
        problem: "With asynchronous updates, Elasticsearch and PostgreSQL are no longer written in one step, so they have to be kept in step another way.",
        fix: "I added an audit mechanism that verifies write consistency between them.",
      },
    ],
    results: [
      {
        figure: "1 s to 400 ms",
        label: "read-heavy query latency, a 60% improvement",
        source: "my resume",
      },
    ],
  },
  {
    slug: "rag-chatbot",
    outcome:
      "Answers questions over ingested documents with LangChain and LangGraph, using reranking, multi-representation indexing, query structuring and logical routing.",
    glance: [
      { label: "When", value: "Full-time role at DIATOZ, since May 2026" },
      {
        label: "My part",
        value:
          "I built the chatbot and its document-ingestion pipeline, evaluated Milvus and Pinecone, and implemented reranking, multi-representation indexing, query structuring and logical routing.",
      },
    ],
    decisions: [
      {
        title: "Evaluate Milvus and Pinecone",
        body: "I evaluated both as the vector database for the ingested documents.",
      },
      {
        title: "Four retrieval techniques",
        body: "Multi-representation indexing happens when documents are indexed. Query structuring and logical routing happen before retrieval, and reranking happens after it.",
      },
    ],
    steps: [
      {
        title: "Documents are ingested",
        body: "A document-ingestion pipeline takes in the documents.",
        nodes: ["docs", "ingest"],
        edges: [["docs", "ingest"]],
      },
      {
        title: "Multi-representation indexing",
        body: "Multi-representation indexing happens as the documents are indexed.",
        nodes: ["index"],
        edges: [["ingest", "index"]],
      },
      {
        title: "A vector database holds the index",
        body: "I evaluated Milvus and Pinecone as the vector database.",
        nodes: ["vdb"],
        edges: [["index", "vdb"]],
      },
      {
        title: "A question is structured and routed",
        body: "Query structuring and logical routing happen before retrieval.",
        nodes: ["q", "struct", "route"],
        edges: [
          ["q", "struct"],
          ["struct", "route"],
        ],
      },
      {
        title: "Retrieval, then reranking",
        body: "Retrieval searches the vector database, and reranking happens after it.",
        nodes: ["retrieve", "rerank", "vdb"],
        edges: [
          ["route", "retrieve"],
          ["vdb", "retrieve"],
          ["retrieve", "rerank"],
        ],
      },
      {
        title: "A language model answers",
        body: "A language model writes the answer.",
        nodes: ["rerank", "llm"],
        edges: [["rerank", "llm"]],
      },
    ],
    terms: [
      {
        term: "Multi-representation indexing",
        meaning: "Indexing a document under more than one representation, such as a summary, so retrieval can match on whichever fits the question.",
      },
      { term: "Query structuring", meaning: "Turning a free-text question into a structured query, for example search text plus filters." },
      { term: "Logical routing", meaning: "Choosing, for each question, which data source or index should answer it." },
      { term: "Reranking", meaning: "Reordering retrieved passages by relevance before they go to the model." },
    ],
  },
  {
    slug: "whatsapp-agent",
    outcome:
      "A multi-tenant WhatsApp agent on Meta's WhatsApp Cloud API: parts lookup with LLM-as-selector RAG, deterministic slot-filling and in-chat PDF delivery.",
    glance: [
      { label: "When", value: "Full-time role at DIATOZ, since May 2026" },
      {
        label: "My part",
        value: "I shipped the agent on Meta's WhatsApp Cloud API and configured Nginx and the webhook callbacks for a working MVP.",
      },
    ],
    constraints: [
      "Multi-tenant: one agent serves several tenants.",
      "WhatsApp traffic arrives as webhook callbacks from Meta's Cloud API.",
    ],
    decisions: [
      {
        title: "LLM as selector for parts lookup",
        body: "Parts lookup uses RAG in which the language model acts as the selector.",
      },
      {
        title: "Deterministic slot-filling",
        body: "Slot-filling does not depend on model output. It is deterministic.",
      },
      {
        title: "Nginx and webhook callbacks",
        body: "Nginx and the webhook callbacks were configured for a working MVP. The callbacks are set up on the Meta Developer Dashboard.",
      },
      {
        title: "PDFs in the chat",
        body: "The agent delivers PDFs inside the WhatsApp conversation.",
      },
    ],
    steps: [
      {
        title: "A user messages on WhatsApp",
        body: "Messages travel through Meta's WhatsApp Cloud API.",
        nodes: ["user", "api"],
        edges: [["user", "api"]],
      },
      {
        title: "Meta calls back through webhooks",
        body: "Nginx receives the webhook callbacks, which are set up on the Meta Developer Dashboard.",
        nodes: ["nginx"],
        edges: [["api", "nginx"]],
      },
      {
        title: "One agent serves several tenants",
        body: "The callbacks reach the multi-tenant agent. One agent serves several tenants.",
        nodes: ["agent"],
        edges: [["nginx", "agent"]],
      },
      {
        title: "Slot-filling is deterministic",
        body: "The details a request needs are collected by deterministic slot-filling, which does not depend on model output.",
        nodes: ["slot"],
        edges: [["agent", "slot"]],
      },
      {
        title: "Parts lookup uses LLM-as-selector RAG",
        body: "Parts lookup is RAG in which the language model acts as the selector.",
        nodes: ["lookup"],
        edges: [["agent", "lookup"]],
      },
      {
        title: "PDFs go back in the chat",
        body: "The agent delivers PDFs inside the WhatsApp conversation.",
        nodes: ["pdf"],
        edges: [["agent", "pdf"]],
      },
    ],
    terms: [
      {
        term: "LLM-as-selector RAG",
        meaning: "Retrieval finds candidates, and a language model picks the best match instead of writing free text.",
      },
      { term: "Slot-filling", meaning: "Collecting the details a request needs, one field at a time." },
      { term: "Deterministic", meaning: "The same input gives the same result, and no model decides it." },
    ],
  },
  {
    slug: "gmailsage",
    outcome:
      "Triages a Gmail inbox every 15 minutes with rules first and an LLM as the fallback, archives job-alert spam, deletes nothing and emails a daily digest.",
    glance: [
      { label: "When", value: "September 2026, as a personal project" },
      { label: "My part", value: "I built it end to end." },
      { label: "Scale", value: "Runs every 15 minutes on one inbox, with 13 categories and a digest at 8 am." },
    ],
    problem: [
      "Job-alert and newsletter mail arrives in the same inbox as the mail that matters, such as interview invites, offer letters and deadlines. GmailSage labels and archives the first kind and puts what matters in a daily digest.",
    ],
    constraints: [
      "Nothing is ever deleted. Archiving only removes the INBOX label, so mail stays searchable in All Mail and can be restored.",
      "Missing one important mail costs far more than leaving a promo in the inbox.",
      "It runs unattended, so a failed message has to be skipped and retried on the next run.",
      "Every message the rules can decide is one less LLM call.",
    ],
    decisions: [
      {
        title: "Rules first, LLM second",
        body: "`rules_engine.py` decides on sender domain, subject patterns and the List-Unsubscribe header. Subjects that look like job-hunt mail, such as an application or an interview invite, are checked first, so they win over every bulk rule. Only mail the rules cannot decide goes to the LLM (Groq), which returns a category and a priority as JSON. The README calls the rules cheaper and more predictable than the LLM.",
      },
      {
        title: "A guard over both tiers",
        body: "A final check runs over the rules and the LLM. Mail from anyone you have written to, and security, sign-in, payment and similar subjects, can never be archived, even if the LLM says low priority.",
      },
      {
        title: "It learns from rescues",
        body: "If you move an archived message back to the inbox, its sender goes on a keep list and is never archived again.",
      },
      {
        title: "Email is untrusted input",
        body: "The prompt tells the model that email content is untrusted data and to ignore instructions inside it. Unknown categories fall back to medium priority and stay in the inbox.",
      },
      {
        title: "Fail safe, then retry",
        body: "A failure on one message is logged and the message is not marked as processed, so the next run tries it again. Gmail calls retry up to three times, and so does the Groq client. If no model answers, the mail is left alone: the code retries it \"on the next run instead of guessing\".",
      },
      {
        title: "Archiving can be undone",
        body: "Each message the job handles is recorded in SQLite (`triage.db`). `python triage.py --undo --hours 168 --sender google.com` restores one sender's archived mail to the inbox, and `--dry-run` classifies without changing any labels or recording any message as processed.",
      },
    ],
    steps: [
      {
        title: "Cron starts the triage job",
        body: "Cron runs `triage.py` every 15 minutes.",
        nodes: ["triage"],
      },
      {
        title: "It fetches recent inbox mail",
        body: "It lists up to 50 messages from the inbox that are less than two days old.",
        nodes: ["inbox", "triage"],
        edges: [["inbox", "triage"]],
      },
      {
        title: "Mail it has seen is skipped",
        body: "Messages whose ids are already in the SQLite store are skipped, so nothing is classified or labelled twice.",
        nodes: ["triage", "store"],
        edges: [["triage", "store"]],
      },
      {
        title: "Rules decide first",
        body: "The rules engine checks the sender, the subject and the List-Unsubscribe header. Job-hunt subjects are checked before any bulk rule.",
        nodes: ["rules"],
        edges: [["triage", "rules"]],
      },
      {
        title: "On a miss, an LLM decides",
        body: "Mail the rules cannot decide goes to the LLM on Groq, which returns one of 13 categories and a priority as JSON. A bad answer falls back to medium priority, and the mail stays in the inbox.",
        nodes: ["llm"],
        edges: [["rules", "llm"]],
      },
      {
        title: "A guard checks the result",
        body: "A final check covers both tiers. Mail from anyone you have written to, and security, sign-in or payment subjects, are never archived, even when the result says low priority.",
        nodes: ["rules", "llm", "actions"],
        edges: [
          ["rules", "actions"],
          ["llm", "actions"],
        ],
      },
      {
        title: "Labels go on, low priority is archived",
        body: "Every message gets a `GmailSage/` label. Only low-priority mail loses its INBOX label, and nothing is deleted.",
        nodes: ["actions"],
        edges: [
          ["rules", "actions"],
          ["llm", "actions"],
        ],
      },
      {
        title: "Each message is recorded",
        body: "The SQLite store records every handled message. A message that fails is left unrecorded, so the next run tries it again.",
        nodes: ["store"],
        edges: [["actions", "store"]],
      },
      {
        title: "A daily digest goes out at 8 am",
        body: "A second cron job builds an HTML digest from the store: high-priority mail, plus medium-priority mail that is not in the generic \"other\" bucket, from the last 24 hours. It is emailed through the Gmail API.",
        nodes: ["store", "digest"],
        edges: [["store", "digest"]],
      },
    ],
    blockers: [
      {
        title: "Token refresh failed with invalid_scope",
        problem:
          "The dry run asked Gmail for read-only access and the real run asked for modify access, but both used one saved token. Asking for a narrower scope on refresh than the token was granted fails with `invalid_scope`.",
        fix: "I made a token with unknown scopes count as a mismatch, so the old credentials are dropped and consent runs again. Then I made every command request the same `gmail.modify` scope, which includes read access.",
      },
      {
        title: "The network is not up when cron wakes",
        problem: "The job runs from cron on a laptop, which often wakes before the network is up. A comment in the code records DNS failures in the log.",
        fix: "Refreshing the token retries up to four times, waiting 5, 10 and 20 seconds between tries. If the network is still down, the run exits and the next one starts fresh.",
      },
    ],
    results: [
      {
        figure: "16 unit tests",
        label: "pass; they cover the rules engine and the never-archive guard",
        source: "test_rules.py in the repository, run with `python -m unittest test_rules` on 7 October 2026",
      },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

/** Title, description and path for a case-study page. The page and the static HTML emitted at build time both read this. */
export function caseStudyMeta(slug: string): { title: string; description: string; path: string } | undefined {
  const study = getCaseStudy(slug);
  const project = projects.find((entry) => entry.slug === slug);
  if (!study || !project) return undefined;
  return {
    title: `${project.title} | ${profile.name}`,
    description: study.outcome.replace(/`/g, ""),
    path: `/projects/${slug}`,
  };
}

/**
 * Build-time check, run from vite.config.ts: every walkthrough step names nodes and edges that exist in the
 * project's diagram, in both layouts where the layout draws the edge, so a step can never light up nothing.
 */
export function checkCaseStudies(): void {
  for (const study of caseStudies) {
    if (!study.steps?.length) continue;
    const spec = diagrams[study.slug];
    if (!spec) throw new Error(`Case study "${study.slug}" has steps but no diagram`);
    const nodeIds = new Set(spec.full.nodes.map((n) => n.id));
    const edgePairs = new Set(spec.full.edges.map((e) => `${e.from}>${e.to}`));
    for (const step of study.steps) {
      for (const id of step.nodes) {
        if (!nodeIds.has(id)) throw new Error(`Case study "${study.slug}", step "${step.title}": unknown node "${id}"`);
      }
      for (const [from, to] of step.edges ?? []) {
        if (!edgePairs.has(`${from}>${to}`)) throw new Error(`Case study "${study.slug}", step "${step.title}": no edge ${from} to ${to}`);
      }
    }
  }
}
