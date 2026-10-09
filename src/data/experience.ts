// Source: resume-latest.pdf (DIATOZ entries), the Facts in the v2 brief, and the owner's account of the DIATOZ work
// (9 October 2026). Where that account is more exact than the resume, such as who wrote the first version of a flow and
// how the Excel heap bug was fixed, the account wins, and docs/v2/SOURCES.md lists the difference.

export interface ExperienceEntry {
  title: string;
  company: string;
  location: string;
  /** First month, as YYYY-MM. */
  from: string;
  /** Last month as YYYY-MM, or null for the current role. */
  to: string | null;
  bullets: string[];
  stack: string[];
  /** Set only when the employer's public site is known. */
  companyUrl?: string;
}

// Newest first.
export const experience: ExperienceEntry[] = [
  {
    title: "Software Development Engineer",
    company: "DIATOZ Solutions Pvt. Ltd.",
    location: "Bengaluru, India",
    from: "2026-05",
    to: null,
    bullets: [
      "Built a proof-of-concept RAG chatbot with a document-ingestion pipeline for automated Q&A, with service APIs for tickets alongside the documents. Evaluated Milvus and Pinecone and implemented reranking, multi-representation indexing, query structuring and logical routing.",
      "Shipped a multi-tenant WhatsApp agent for client Kärcher on Meta's WhatsApp Cloud API, with LLM-as-selector RAG for parts lookup, deterministic slot-filling and in-chat PDF delivery. Configured Nginx and webhook callbacks on the Meta Developer Dashboard for a working MVP.",
      "Fixed a broken-audio bug on the inbound voice-calling agent and built a human-transfer feature that hands live calls to a person.",
      "Extended Lexi, an internal code-understanding agent, to parse and understand MuleSoft code.",
    ],
    stack: ["LangChain", "LangGraph", "RAG", "Milvus", "Pinecone", "Meta WhatsApp Cloud API", "Nginx"],
  },
  {
    title: "Software Engineering Intern",
    company: "DIATOZ Solutions Pvt. Ltd.",
    location: "Bengaluru, India",
    from: "2025-10",
    to: "2026-05",
    bullets: [
      "Reworked a Spring Batch ingestion pipeline for about 273 million records, replacing one-by-one inserts with JDBC batch inserts and adding multithreaded processing. Found and fixed why stopped jobs got stuck.",
      "Reworked the validation flow of a bulk Excel upload (14+ validation rules) after loading whole workbooks into memory exhausted the heap and hung the application. The flow now validates once and saves in the background in batches.",
      "Built 7+ Spring Boot report APIs for analytics over millions of records with multi-filter support, each with a PDF and Excel download. Moving report reads to Elasticsearch cut read-heavy query latency from 1 s to 400 ms (60%), with PostgreSQL kept as the source of truth.",
      "Fixed a production server timeout by making Elasticsearch and PostgreSQL updates asynchronous, and added an audit mechanism to verify write consistency.",
      "Traced a UAT-versus-production schema mismatch to a missing `liquibase.enabled` flag that silently skipped migrations in production; fixed the config and reconciled the schema.",
    ],
    stack: ["Java", "Spring Boot", "Spring Batch", "JDBC", "Apache POI", "PostgreSQL", "Elasticsearch", "Liquibase"],
  },
];
