// Sources: resume-latest.pdf, the Facts in the v2 brief, and the READMEs of the public repos linked below.
// DIATOZ entries are employer work described at resume level: no code links.

export interface Project {
  /** Used by the /projects/:slug case-study route. */
  slug: string;
  title: string;
  origin?: "DIATOZ" | "Personal";
  year?: string;
  summary: string;
  stack: string[];
  /** Public repositories only. */
  repo?: string;
  live?: string;
}

// Display order.
export const projects: Project[] = [
  {
    slug: "ingestion-pipelines",
    title: "Ingestion pipelines at 273 million records",
    origin: "DIATOZ",
    summary:
      "A Spring Batch pipeline ingests about 273 million records with multithreaded workers and JDBC batch inserts. A second pipeline validates Excel workbooks against 14+ rules and streams them with SXSSF instead of loading whole files into memory.",
    stack: ["Java", "Spring Batch", "JDBC", "Apache POI"],
  },
  {
    slug: "report-search",
    title: "Report search on Elasticsearch",
    origin: "DIATOZ",
    summary:
      "Report APIs serve multi-filter analytics over millions of records. Elasticsearch indexing cut query latency from 1 s to 400 ms while PostgreSQL stays the source of truth; updates run asynchronously and an audit mechanism checks that the two stay consistent.",
    stack: ["Spring Boot", "Elasticsearch", "PostgreSQL"],
  },
  {
    slug: "rag-chatbot",
    title: "RAG chatbot over ingested documents",
    origin: "DIATOZ",
    summary:
      "Automated Q&A over ingested documents with LangChain and LangGraph. I evaluated Milvus and Pinecone and implemented reranking, multi-representation indexing, query structuring and logical routing.",
    stack: ["LangChain", "LangGraph", "Milvus", "Pinecone"],
  },
  {
    slug: "whatsapp-agent",
    title: "Multi-tenant WhatsApp agent",
    origin: "DIATOZ",
    summary:
      "A WhatsApp automation agent on Meta's Cloud API that serves several tenants. Parts lookup uses LLM-as-selector RAG, slot-filling is deterministic, PDFs are delivered in chat, and Nginx fronts the webhook callbacks.",
    stack: ["Meta WhatsApp Cloud API", "RAG", "Nginx"],
  },
  {
    slug: "gmailsage",
    title: "GmailSage",
    origin: "Personal",
    summary:
      "Triages a Gmail inbox every 15 minutes: rules first, an LLM (Groq) as the fallback. It labels and archives job-alert spam, sends a daily digest of what matters, and logs every action so it can be undone.",
    stack: ["Python", "Gmail API", "Groq", "SQLite"],
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
