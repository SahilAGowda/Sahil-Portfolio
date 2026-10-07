// Architecture diagrams, drawn only from facts in resume-latest.pdf, the Facts in the v2 brief and the
// README of the public repo. Where the sources do not name a component it is drawn generically.
//
// Shapes carry the meaning, colour repeats it: box = job or service (flow), cylinder = data store (store),
// diamond = model call (model), grey box = input or output (plain).
// Every project has a `full` layout for wide screens and a `compact` one for phones and the work rows.

export type NodeKind = "flow" | "store" | "model" | "plain";

export interface DNode {
  id: string;
  kind: NodeKind;
  /** Use \n for a second line. */
  label: string;
  /** Smaller line under the label. */
  sub?: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DEdge {
  /** Polyline in diagram coordinates. The arrowhead is at the last point. */
  points: [number, number][];
  label?: string;
  labelAt?: [number, number];
  labelAnchor?: "start" | "middle" | "end";
  dashed?: boolean;
  /** Arrowhead at both ends. */
  bothWays?: boolean;
}

export interface DText {
  x: number;
  y: number;
  text: string;
  anchor?: "start" | "middle" | "end";
}

export interface DiagramLayout {
  width: number;
  height: number;
  fontSize: number;
  nodes: DNode[];
  edges: DEdge[];
  texts?: DText[];
}

export interface DiagramSpec {
  title: string;
  /** Text alternative for screen readers. */
  description: string;
  full: DiagramLayout;
  compact: DiagramLayout;
}

const node = (
  id: string,
  kind: NodeKind,
  label: string,
  x: number,
  y: number,
  w: number,
  h: number,
  sub?: string,
): DNode => ({ id, kind, label, sub, x, y, w, h });

export const diagrams: Record<string, DiagramSpec> = {
  "ingestion-pipelines": {
    title: "Ingestion pipelines",
    description:
      "Two pipelines. Source data of about 273 million records goes through a multithreaded Spring Batch job and JDBC batch inserts into a database. Separately, an Excel workbook is read as a stream with Apache POI SXSSF and checked against 14 or more validation rules.",
    full: {
      width: 720,
      height: 216,
      fontSize: 14,
      texts: [
        { x: 0, y: 14, text: "Volume pipeline" },
        { x: 0, y: 134, text: "Excel pipeline" },
      ],
      nodes: [
        node("src", "plain", "Source data", 0, 28, 150, 52, "about 273M records"),
        node("batch", "flow", "Spring Batch", 210, 28, 160, 52, "multithreaded"),
        node("jdbc", "flow", "JDBC", 430, 28, 130, 52, "batch inserts"),
        node("db", "store", "Database", 610, 24, 110, 60),
        node("xlsx", "plain", "Excel workbook", 0, 148, 150, 52),
        node("stream", "flow", "Streaming read", 210, 148, 170, 52, "Apache POI SXSSF"),
        node("rules", "flow", "14+ validation\nrules", 440, 148, 150, 52),
      ],
      edges: [
        { points: [[150, 54], [210, 54]] },
        { points: [[370, 54], [430, 54]] },
        { points: [[560, 54], [610, 54]] },
        { points: [[150, 174], [210, 174]] },
        { points: [[380, 174], [440, 174]] },
      ],
    },
    compact: {
      width: 320,
      height: 262,
      fontSize: 12.5,
      texts: [
        { x: 0, y: 12, text: "Volume pipeline" },
        { x: 170, y: 12, text: "Excel pipeline" },
      ],
      nodes: [
        node("src", "plain", "Source data", 0, 24, 150, 40, "about 273M records"),
        node("batch", "flow", "Spring Batch", 0, 86, 150, 40, "multithreaded"),
        node("jdbc", "flow", "JDBC", 0, 148, 150, 40, "batch inserts"),
        node("db", "store", "Database", 0, 210, 150, 48),
        node("xlsx", "plain", "Excel workbook", 170, 24, 150, 40),
        node("stream", "flow", "Streaming read", 170, 86, 150, 40, "Apache POI SXSSF"),
        node("rules", "flow", "14+ validation\nrules", 170, 148, 150, 44),
      ],
      edges: [
        { points: [[75, 64], [75, 86]] },
        { points: [[75, 126], [75, 148]] },
        { points: [[75, 188], [75, 210]] },
        { points: [[245, 64], [245, 86]] },
        { points: [[245, 126], [245, 148]] },
      ],
    },
  },

  "report-search": {
    title: "Report search",
    description:
      "A client calls the Spring Boot report APIs, which query Elasticsearch with multiple filters; query latency dropped from 1 second to 400 milliseconds. PostgreSQL stays the source of truth. Updates reach PostgreSQL and Elasticsearch asynchronously, and an audit check verifies that the two stay consistent.",
    full: {
      width: 720,
      height: 252,
      fontSize: 14,
      texts: [{ x: 0, y: 246, text: "Updates to Elasticsearch and PostgreSQL run asynchronously." }],
      nodes: [
        node("client", "plain", "Client", 0, 21, 90, 48),
        node("api", "flow", "Report APIs", 150, 19, 140, 52, "Spring Boot"),
        node("es", "store", "Elasticsearch", 370, 8, 160, 74, "latency 1 s to 400 ms"),
        node("pg", "store", "PostgreSQL", 370, 158, 160, 74, "source of truth"),
        node("audit", "flow", "Audit check", 580, 95, 140, 52, "verifies consistency"),
      ],
      edges: [
        { points: [[90, 45], [150, 45]] },
        { points: [[290, 45], [370, 45]], label: "queries", labelAt: [330, 37], labelAnchor: "middle" },
        {
          points: [[220, 71], [220, 195], [370, 195]],
          dashed: true,
          label: "async updates",
          labelAt: [232, 187],
          labelAnchor: "start",
        },
        { points: [[580, 121], [555, 121], [555, 45], [530, 45]], dashed: true },
        { points: [[580, 121], [555, 121], [555, 195], [530, 195]], dashed: true },
      ],
    },
    compact: {
      width: 320,
      height: 296,
      fontSize: 12.5,
      nodes: [
        node("client", "plain", "Client", 110, 4, 100, 34),
        node("api", "flow", "Report APIs", 80, 60, 160, 44, "Spring Boot"),
        node("es", "store", "Elasticsearch", 0, 138, 150, 72, "latency 1 s to 400 ms"),
        node("pg", "store", "PostgreSQL", 170, 138, 150, 72, "source of truth"),
        node("audit", "flow", "Audit check", 80, 244, 160, 48, "verifies consistency"),
      ],
      edges: [
        { points: [[160, 38], [160, 60]] },
        {
          points: [[160, 104], [160, 121], [75, 121], [75, 138]],
          label: "queries",
          labelAt: [117, 114],
          labelAnchor: "middle",
        },
        {
          points: [[160, 121], [245, 121], [245, 138]],
          dashed: true,
          label: "async updates",
          labelAt: [203, 114],
          labelAnchor: "middle",
        },
        { points: [[120, 244], [120, 227], [75, 227], [75, 210]], dashed: true },
        { points: [[200, 244], [200, 227], [245, 227], [245, 210]], dashed: true },
      ],
    },
  },

  "rag-chatbot": {
    title: "RAG chatbot",
    description:
      "Indexing: documents go through an ingestion pipeline and multi-representation indexing into a vector database; Milvus and Pinecone were evaluated. Answering: a question passes through query structuring, logical routing, retrieval from the vector database and reranking, then a language model writes the answer.",
    full: {
      width: 720,
      height: 248,
      fontSize: 14,
      texts: [
        { x: 0, y: 14, text: "Indexing" },
        { x: 0, y: 150, text: "Answering" },
      ],
      nodes: [
        node("docs", "plain", "Documents", 0, 28, 110, 52),
        node("ingest", "flow", "Document\ningestion", 150, 28, 120, 52),
        node("index", "flow", "Multi-representation\nindexing", 310, 28, 176, 52),
        node("vdb", "store", "Vector database", 510, 22, 210, 64, "Milvus and Pinecone evaluated"),
        node("q", "plain", "Question", 0, 170, 84, 44),
        node("struct", "flow", "Query\nstructuring", 108, 170, 100, 44),
        node("route", "flow", "Logical\nrouting", 232, 170, 90, 44),
        node("retrieve", "flow", "Retrieval", 346, 170, 90, 44),
        node("rerank", "flow", "Reranking", 460, 170, 100, 44),
        node("llm", "model", "LLM\nanswer", 600, 152, 120, 80),
      ],
      edges: [
        { points: [[110, 54], [150, 54]] },
        { points: [[270, 54], [310, 54]] },
        { points: [[486, 54], [510, 54]] },
        { points: [[84, 192], [108, 192]] },
        { points: [[208, 192], [232, 192]] },
        { points: [[322, 192], [346, 192]] },
        { points: [[436, 192], [460, 192]] },
        { points: [[560, 192], [600, 192]] },
        {
          points: [[615, 86], [615, 128], [391, 128], [391, 170]],
          label: "search",
          labelAt: [503, 122],
          labelAnchor: "middle",
        },
      ],
    },
    compact: {
      width: 320,
      height: 384,
      fontSize: 12.5,
      texts: [
        { x: 0, y: 12, text: "Indexing" },
        { x: 170, y: 12, text: "Answering" },
      ],
      nodes: [
        node("docs", "plain", "Documents", 0, 24, 150, 36),
        node("ingest", "flow", "Document\ningestion", 0, 82, 150, 42),
        node("index", "flow", "Multi-representation\nindexing", 0, 146, 150, 42),
        node("vdb", "store", "Vector database", 0, 210, 150, 76, "Milvus and Pinecone\nevaluated"),
        node("q", "plain", "Question", 170, 24, 150, 36),
        node("struct", "flow", "Query structuring", 170, 82, 150, 36),
        node("route", "flow", "Logical routing", 170, 142, 150, 36),
        node("retrieve", "flow", "Retrieval", 170, 202, 150, 36),
        node("rerank", "flow", "Reranking", 170, 262, 150, 36),
        node("llm", "model", "LLM\nanswer", 190, 318, 110, 62),
      ],
      edges: [
        { points: [[75, 60], [75, 82]] },
        { points: [[75, 124], [75, 146]] },
        { points: [[75, 188], [75, 210]] },
        { points: [[245, 60], [245, 82]] },
        { points: [[245, 118], [245, 142]] },
        { points: [[245, 178], [245, 202]] },
        { points: [[245, 238], [245, 262]] },
        { points: [[245, 298], [245, 318]] },
        { points: [[150, 236], [160, 236], [160, 220], [170, 220]] },
      ],
    },
  },

  "whatsapp-agent": {
    title: "WhatsApp agent",
    description:
      "A WhatsApp user and the Meta WhatsApp Cloud API exchange messages. Nginx receives the webhook callbacks and passes them to a multi-tenant agent. The agent does parts lookup with RAG where a language model acts as the selector, fills slots deterministically, and delivers PDFs in the chat.",
    full: {
      width: 720,
      height: 232,
      fontSize: 14,
      nodes: [
        node("user", "plain", "WhatsApp user", 0, 22, 120, 48),
        node("api", "flow", "Meta WhatsApp\nCloud API", 160, 20, 140, 52),
        node("nginx", "flow", "Nginx", 340, 20, 160, 52, "webhook callbacks"),
        node("agent", "flow", "Multi-tenant\nagent", 540, 20, 180, 52),
        node("slot", "flow", "Slot-filling", 150, 150, 150, 52, "deterministic"),
        node("lookup", "model", "Parts lookup", 320, 126, 240, 100, "LLM-as-selector RAG"),
        node("pdf", "flow", "In-chat PDF\ndelivery", 580, 150, 140, 52),
      ],
      edges: [
        { points: [[120, 46], [160, 46]], bothWays: true },
        { points: [[300, 46], [340, 46]] },
        { points: [[500, 46], [540, 46]] },
        { points: [[630, 72], [630, 100], [225, 100], [225, 150]] },
        { points: [[630, 100], [440, 100], [440, 126]] },
        { points: [[630, 100], [650, 100], [650, 150]] },
      ],
    },
    compact: {
      width: 320,
      height: 346,
      fontSize: 12.5,
      texts: [{ x: 160, y: 338, text: "LLM-as-selector RAG", anchor: "middle" }],
      nodes: [
        node("user", "plain", "WhatsApp user", 85, 4, 150, 34),
        node("api", "flow", "Meta WhatsApp\nCloud API", 70, 60, 180, 42),
        node("nginx", "flow", "Nginx", 70, 124, 180, 44, "webhook callbacks"),
        node("agent", "flow", "Multi-tenant\nagent", 70, 190, 180, 42),
        node("slot", "flow", "Slot-filling", 0, 262, 100, 44, "deterministic"),
        node("lookup", "model", "Parts\nlookup", 110, 248, 100, 72),
        node("pdf", "flow", "In-chat PDF\ndelivery", 220, 262, 100, 44),
      ],
      edges: [
        { points: [[160, 38], [160, 60]], bothWays: true },
        { points: [[160, 102], [160, 124]] },
        { points: [[160, 168], [160, 190]] },
        { points: [[160, 232], [160, 248]] },
        { points: [[160, 240], [50, 240], [50, 262]] },
        { points: [[160, 240], [270, 240], [270, 262]] },
      ],
    },
  },

  gmailsage: {
    title: "GmailSage",
    description:
      "A job runs every 15 minutes and fetches recent inbox mail from Gmail. A SQLite store of processed message IDs lets it skip mail it has already handled. Rules on sender domain and subject classify most mail; on a miss, an LLM classifier on Groq decides among 13 categories. Labels are applied and low-priority mail is archived, never deleted; every action goes into an undo log in the store, and a daily digest email is built from the store.",
    full: {
      width: 720,
      height: 300,
      fontSize: 14,
      nodes: [
        node("inbox", "plain", "Gmail\ninbox", 0, 18, 80, 52),
        node("triage", "flow", "Triage job", 108, 18, 116, 52, "every 15 min"),
        node("rules", "flow", "Rules engine", 256, 18, 150, 52, "sender domain, subject"),
        node("actions", "flow", "Labels and\narchive", 444, 18, 120, 52),
        node("digest", "flow", "Daily digest", 602, 18, 118, 52, "8 am email"),
        node("llm", "model", "LLM classifier", 241, 122, 180, 96, "Groq, 13 categories"),
        node("store", "store", "SQLite store", 419, 236, 170, 62, "processed IDs, undo log"),
      ],
      edges: [
        { points: [[80, 44], [108, 44]] },
        { points: [[224, 44], [256, 44]] },
        { points: [[406, 44], [444, 44]], label: "hit", labelAt: [425, 36], labelAnchor: "middle" },
        { points: [[331, 70], [331, 122]], label: "miss", labelAt: [341, 100], labelAnchor: "start" },
        { points: [[421, 170], [470, 170], [470, 70]] },
        {
          points: [[530, 70], [530, 236]],
          label: "logs for undo",
          labelAt: [540, 150],
          labelAnchor: "start",
        },
        {
          points: [[166, 70], [166, 265], [419, 265]],
          dashed: true,
          label: "skips processed mail",
          labelAt: [290, 257],
          labelAnchor: "middle",
        },
        { points: [[589, 267], [661, 267], [661, 70]], dashed: true },
      ],
    },
    compact: {
      width: 320,
      height: 444,
      fontSize: 12.5,
      texts: [{ x: 70, y: 310, text: "Groq, 13 categories", anchor: "middle" }],
      nodes: [
        node("inbox", "plain", "Gmail inbox", 0, 4, 140, 34),
        node("triage", "flow", "Triage job", 0, 60, 140, 44, "every 15 min"),
        node("rules", "flow", "Rules engine", 0, 126, 140, 44, "sender domain, subject"),
        node("llm", "model", "LLM\nclassifier", 0, 206, 140, 84),
        node("actions", "flow", "Labels and\narchive", 180, 126, 140, 44),
        node("store", "store", "SQLite store", 180, 300, 140, 72, "processed IDs,\nundo log"),
        node("digest", "flow", "Daily digest", 180, 400, 140, 44, "8 am email"),
      ],
      edges: [
        { points: [[70, 38], [70, 60]] },
        { points: [[70, 104], [70, 126]] },
        { points: [[140, 148], [180, 148]], label: "hit", labelAt: [160, 140], labelAnchor: "middle" },
        { points: [[70, 170], [70, 206]], label: "miss", labelAt: [80, 192], labelAnchor: "start" },
        { points: [[140, 248], [225, 248], [225, 170]] },
        { points: [[285, 170], [285, 300]] },
        { points: [[250, 372], [250, 400]], dashed: true },
      ],
    },
  },
};

export function hasDiagram(slug: string): boolean {
  return slug in diagrams;
}
