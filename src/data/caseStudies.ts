// Case-study content. Every line traces to resume-latest.pdf, the Facts in the v2 brief, or (for GmailSage)
// the public repo's README and code. A section with no sourced content is left out, not padded.
//
// DIATOZ entries are employer work, described at resume level: no client names, code, schemas or data.
// Backticked text renders as inline code.

export interface Decision {
  title: string;
  body: string;
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
  problem?: string[];
  constraints?: string[];
  decisions?: Decision[];
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
      {
        title: "Stream Excel workbooks instead of loading them",
        body: "Loading a whole workbook into memory exhausted the heap. Reading workbooks as a stream with Apache POI SXSSF fixed it.",
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
      {
        title: "Make the updates asynchronous",
        body: "Updating Elasticsearch and PostgreSQL synchronously caused a production server timeout. The updates now run asynchronously.",
      },
      {
        title: "Add an audit mechanism",
        body: "With asynchronous updates the two stores are no longer written in one step. An audit mechanism verifies that they stay consistent.",
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
        body: "Nginx and the webhook callbacks are configured on the Meta Developer Dashboard, which got the agent to a working MVP.",
      },
      {
        title: "PDFs in the chat",
        body: "The agent delivers PDFs inside the WhatsApp conversation.",
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
    problem: [
      "A personal inbox fills with job-alert and newsletter mail that buries the messages that matter, such as interview invites, offer letters and deadlines.",
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
        body: "`rules_engine.py` decides on sender domain, subject patterns and the List-Unsubscribe header. Only mail the rules cannot decide goes to the LLM (Groq), which returns a category and a priority as JSON. The README calls the rules cheaper and more predictable than the LLM.",
      },
      {
        title: "A guard over both tiers",
        body: "A final check runs over the rules and the LLM. Application mail wins over bulk rules, anyone you have written to is never archived, and security, sign-in, payment and similar subjects can never be archived, even if the LLM says low priority.",
      },
      {
        title: "It learns from rescues",
        body: "If you move an archived message back to the inbox, its sender goes on a keep list and is never archived again.",
      },
      {
        title: "Email is untrusted input",
        body: "The prompt tells the model that email content is untrusted data and to ignore instructions inside it. Unknown categories fall back to medium priority and stay in the inbox. If no model answers, the mail is left alone and retried on the next run.",
      },
      {
        title: "Every action can be undone",
        body: "Actions go into SQLite (`triage.db`, with the processed messages and an undo log). `python triage.py --undo --hours 168 --sender google.com` restores one sender's mail to the inbox, and `--dry-run` classifies without touching labels or the database.",
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
