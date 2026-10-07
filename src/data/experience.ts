// Source: resume-latest.pdf (DIATOZ entries) and the Facts in the v2 brief.

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
      "Built a RAG chatbot with a document-ingestion pipeline for automated Q&A. Evaluated Milvus and Pinecone and implemented reranking, multi-representation indexing, query structuring and logical routing.",
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
      "Built a Spring Batch ingestion pipeline for about 273 million records, using multithreaded processing and JDBC batch inserts.",
      "Built an Excel-workbook ingestion pipeline with 14+ validation rules. Fixed a heap-exhaustion bug caused by loading whole files into memory by switching to streaming with Apache POI SXSSF.",
      "Built Spring Boot REST APIs for a report module that serves analytics over millions of records with multi-filter support. Elasticsearch indexing cut read-heavy query latency from 1 s to 400 ms (60%), with PostgreSQL kept as the source of truth.",
      "Fixed a production server timeout by making Elasticsearch and PostgreSQL updates asynchronous, and added an audit mechanism to verify write consistency.",
      "Traced a UAT-versus-production schema mismatch to a missing `liquibase.enabled` flag that silently skipped migrations in production; fixed the config and reconciled the schema.",
    ],
    stack: ["Java", "Spring Boot", "Spring Batch", "JDBC", "Apache POI", "PostgreSQL", "Elasticsearch", "Liquibase"],
  },
];
