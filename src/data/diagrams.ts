// Architecture diagrams, drawn only from facts in resume-latest.pdf, the Facts in the v2 brief, the owner's own
// account of the DIATOZ work (9 October 2026) and the README of the public repo. Where the sources do not name a
// component it is drawn generically, and internal names (classes, endpoints, tables, services) are left out.
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
  /** Ids of the nodes the edge connects, so a walkthrough step and the 3D view can address it. */
  from: string;
  to: string;
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
  "master-data-ingestion": {
    title: "Master-data ingestion",
    description:
      "The front end uploads a CSV of device records to an upload API, which checks the file and starts a Spring Batch job in the background. A partitioner splits the file, and parallel workers read, validate and write it in chunks. Each chunk goes to PostgreSQL as one multi-row insert-or-update. Outcomes are indexed in Elasticsearch in the background, and failed rows go to an error report CSV. Job controls let a job be stopped, paused and restarted.",
    full: {
      width: 720,
      height: 262,
      fontSize: 14,
      nodes: [
        node("ui", "plain", "Front end", 0, 102, 86, 48, "upload, poll"),
        node("api", "flow", "Upload API", 120, 96, 120, 60, "checks the file"),
        node("split", "flow", "Partitioner", 272, 96, 116, 60, "splits the file"),
        node("work", "flow", "Parallel\nworkers", 420, 82, 130, 88, "read, validate,\nwrite in chunks"),
        node("ctl", "flow", "Job controls", 208, 8, 210, 52, "stop, pause, restart"),
        node("pg", "store", "PostgreSQL", 584, 0, 136, 72, "multi-row upsert"),
        node("es", "store", "Elasticsearch", 584, 104, 136, 72, "job and record\nstatus"),
        node("errs", "plain", "Error report", 584, 208, 136, 52, "CSV of failed rows"),
      ],
      edges: [
        { from: "ui", to: "api", points: [[86, 126], [120, 126]], bothWays: true },
        { from: "api", to: "split", points: [[240, 126], [272, 126]] },
        { from: "split", to: "work", points: [[388, 126], [420, 126]] },
        { from: "api", to: "ctl", points: [[180, 96], [180, 34], [208, 34]], dashed: true },
        { from: "ctl", to: "work", points: [[418, 34], [485, 34], [485, 82]], dashed: true },
        { from: "work", to: "pg", points: [[550, 104], [567, 104], [567, 36], [584, 36]] },
        { from: "work", to: "es", points: [[550, 126], [584, 126]], dashed: true },
        { from: "work", to: "errs", points: [[550, 148], [567, 148], [567, 234], [584, 234]] },
      ],
    },
    compact: {
      width: 320,
      height: 432,
      fontSize: 12.5,
      nodes: [
        node("ui", "plain", "Front end", 0, 4, 150, 40, "upload, poll"),
        node("api", "flow", "Upload API", 0, 66, 150, 44, "checks the file"),
        node("split", "flow", "Partitioner", 0, 132, 150, 44, "splits the file"),
        node("work", "flow", "Parallel workers", 0, 198, 150, 56, "read, validate, write"),
        node("ctl", "flow", "Job controls", 170, 66, 150, 44, "stop, pause, restart"),
        node("pg", "store", "PostgreSQL", 170, 206, 150, 68, "multi-row upsert"),
        node("es", "store", "Elasticsearch", 170, 294, 150, 72, "job and record\nstatus"),
        node("errs", "plain", "Error report", 170, 388, 150, 40, "CSV of failed rows"),
      ],
      edges: [
        { from: "ui", to: "api", points: [[75, 44], [75, 66]], bothWays: true },
        { from: "api", to: "split", points: [[75, 110], [75, 132]] },
        { from: "split", to: "work", points: [[75, 176], [75, 198]] },
        { from: "api", to: "ctl", points: [[150, 88], [170, 88]], dashed: true },
        { from: "ctl", to: "work", points: [[245, 110], [245, 184], [160, 184], [160, 222], [150, 222]], dashed: true },
        { from: "work", to: "pg", points: [[150, 238], [170, 238]] },
        { from: "work", to: "es", points: [[60, 254], [60, 330], [170, 330]], dashed: true },
        { from: "work", to: "errs", points: [[30, 254], [30, 408], [170, 408]] },
      ],
    },
  },

  "bulk-store-upload": {
    title: "Bulk store upload",
    description:
      "A customer downloads an Excel template built for them and fills it in. The upload API receives the workbook, and a validation step parses and checks it in one pass while the user waits. A request record is created, and the validated rows go to a background save, which writes them to the database in chunks with batch statements and then sets the request's final status. The client polls that status.",
    full: {
      width: 720,
      height: 258,
      fontSize: 14,
      texts: [{ x: 0, y: 252, text: "Validation runs while the user waits. Saving runs in the background." }],
      nodes: [
        node("xlsx", "plain", "Excel\nworkbook", 0, 28, 104, 52),
        node("api", "flow", "Upload API", 137, 28, 100, 52),
        node("val", "flow", "Validate", 270, 24, 128, 60, "once, fails fast"),
        node("bg", "flow", "Background\nsave", 431, 16, 136, 76, "chunks, batch writes"),
        node("db", "store", "Database", 600, 16, 120, 76, "stores, models"),
        node("tpl", "plain", "Template", 0, 168, 104, 52, "per customer"),
        node("req", "store", "Request record", 250, 148, 190, 84, "processing, then\nfinal status"),
      ],
      edges: [
        { from: "tpl", to: "xlsx", points: [[52, 168], [52, 80]], label: "filled in", labelAt: [62, 128], labelAnchor: "start" },
        { from: "xlsx", to: "api", points: [[104, 54], [137, 54]] },
        { from: "api", to: "val", points: [[237, 54], [270, 54]] },
        { from: "val", to: "bg", points: [[398, 54], [431, 54]] },
        { from: "bg", to: "db", points: [[567, 54], [600, 54]] },
        { from: "val", to: "req", points: [[334, 84], [334, 148]], label: "creates it", labelAt: [344, 122], labelAnchor: "start" },
        { from: "bg", to: "req", points: [[499, 92], [499, 190], [440, 190]], dashed: true, label: "final status", labelAt: [509, 150], labelAnchor: "start" },
      ],
    },
    compact: {
      width: 320,
      height: 354,
      fontSize: 12.5,
      texts: [
        { x: 0, y: 332, text: "Validation runs while the user waits." },
        { x: 0, y: 348, text: "Saving runs in the background." },
      ],
      nodes: [
        node("xlsx", "plain", "Excel workbook", 0, 24, 150, 44),
        node("api", "flow", "Upload API", 0, 90, 150, 40),
        node("val", "flow", "Validate", 0, 152, 150, 44, "once, fails fast"),
        node("req", "store", "Request record", 0, 232, 150, 76, "processing, then\nfinal status"),
        node("tpl", "plain", "Template", 170, 24, 150, 44, "per customer"),
        node("bg", "flow", "Background save", 170, 148, 150, 52, "chunks, batch writes"),
        node("db", "store", "Database", 170, 232, 150, 68, "stores, models"),
      ],
      edges: [
        { from: "tpl", to: "xlsx", points: [[170, 46], [150, 46]] },
        { from: "xlsx", to: "api", points: [[75, 68], [75, 90]] },
        { from: "api", to: "val", points: [[75, 130], [75, 152]] },
        { from: "val", to: "bg", points: [[150, 174], [170, 174]] },
        { from: "bg", to: "db", points: [[245, 200], [245, 232]] },
        { from: "val", to: "req", points: [[75, 196], [75, 232]] },
        { from: "bg", to: "req", points: [[170, 190], [160, 190], [160, 276], [150, 276]], dashed: true },
      ],
    },
  },

  "report-search": {
    title: "Report search",
    description:
      "A client calls the Spring Boot report APIs, which query Elasticsearch with multiple filters; query latency dropped from 1 second to 400 milliseconds. Each report also has a download endpoint that builds the same data as a PDF or Excel file. PostgreSQL stays the source of truth. Updates reach PostgreSQL and Elasticsearch asynchronously, and an audit check verifies that the two stay consistent.",
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
        node("dl", "flow", "PDF and Excel\ndownload", 0, 158, 120, 60),
      ],
      edges: [
        { from: "client", to: "api", points: [[90, 45], [150, 45]] },
        { from: "api", to: "es", points: [[290, 45], [370, 45]], label: "queries", labelAt: [330, 37], labelAnchor: "middle" },
        {
          from: "api",
          to: "pg",
          points: [[220, 71], [220, 195], [370, 195]],
          dashed: true,
          label: "async updates",
          labelAt: [232, 187],
          labelAnchor: "start",
        },
        { from: "api", to: "dl", points: [[170, 71], [170, 188], [120, 188]], label: "same data", labelAt: [162, 130], labelAnchor: "end" },
        { from: "audit", to: "es", points: [[580, 121], [555, 121], [555, 45], [530, 45]], dashed: true },
        { from: "audit", to: "pg", points: [[580, 121], [555, 121], [555, 195], [530, 195]], dashed: true },
      ],
    },
    compact: {
      width: 320,
      height: 296,
      fontSize: 12.5,
      nodes: [
        node("client", "plain", "Client", 25, 4, 100, 34),
        node("api", "flow", "Report APIs", 0, 58, 150, 42, "Spring Boot"),
        node("dl", "flow", "Download", 170, 58, 150, 42, "PDF or Excel"),
        node("es", "store", "Elasticsearch", 0, 138, 150, 72, "latency 1 s to 400 ms"),
        node("pg", "store", "PostgreSQL", 170, 138, 150, 72, "source of truth"),
        node("audit", "flow", "Audit check", 80, 244, 160, 48, "verifies consistency"),
      ],
      edges: [
        { from: "client", to: "api", points: [[75, 38], [75, 58]] },
        { from: "api", to: "dl", points: [[150, 79], [170, 79]] },
        { from: "api", to: "es", points: [[40, 100], [40, 138]], label: "queries", labelAt: [50, 124], labelAnchor: "start" },
        {
          from: "api",
          to: "pg",
          points: [[110, 100], [110, 121], [245, 121], [245, 138]],
          dashed: true,
          label: "async updates",
          labelAt: [203, 114],
          labelAnchor: "middle",
        },
        { from: "audit", to: "es", points: [[120, 244], [120, 227], [75, 227], [75, 210]], dashed: true },
        { from: "audit", to: "pg", points: [[200, 244], [200, 227], [245, 227], [245, 210]], dashed: true },
      ],
    },
  },

  "rag-chatbot": {
    title: "RAG chatbot",
    description:
      "Indexing: documents are uploaded, chunked automatically and passed through multi-representation indexing into a vector database; Milvus and Pinecone were evaluated. Answering: a question passes through query structuring and routing. Document questions go to retrieval from the vector database and reranking, and then a language model writes the answer. Questions that need a service, such as raising or checking a ticket, go to service APIs instead.",
    full: {
      width: 720,
      height: 318,
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
        node("svc", "flow", "Service APIs", 192, 262, 170, 52, "HR and ticketing"),
      ],
      edges: [
        { from: "docs", to: "ingest", points: [[110, 54], [150, 54]] },
        { from: "ingest", to: "index", points: [[270, 54], [310, 54]] },
        { from: "index", to: "vdb", points: [[486, 54], [510, 54]] },
        { from: "q", to: "struct", points: [[84, 192], [108, 192]] },
        { from: "struct", to: "route", points: [[208, 192], [232, 192]] },
        { from: "route", to: "retrieve", points: [[322, 192], [346, 192]] },
        { from: "retrieve", to: "rerank", points: [[436, 192], [460, 192]] },
        { from: "rerank", to: "llm", points: [[560, 192], [600, 192]] },
        {
          from: "vdb",
          to: "retrieve",
          points: [[615, 86], [615, 128], [391, 128], [391, 170]],
          label: "search",
          labelAt: [503, 122],
          labelAnchor: "middle",
        },
        {
          from: "route",
          to: "svc",
          points: [[277, 214], [277, 262]],
          label: "service questions",
          labelAt: [287, 244],
          labelAnchor: "start",
        },
      ],
    },
    compact: {
      width: 344,
      height: 466,
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
        node("llm", "model", "LLM\nanswer", 190, 334, 110, 62),
        node("svc", "flow", "Service APIs", 170, 418, 150, 44, "HR and ticketing"),
      ],
      edges: [
        { from: "docs", to: "ingest", points: [[75, 60], [75, 82]] },
        { from: "ingest", to: "index", points: [[75, 124], [75, 146]] },
        { from: "index", to: "vdb", points: [[75, 188], [75, 210]] },
        { from: "q", to: "struct", points: [[245, 60], [245, 82]] },
        { from: "struct", to: "route", points: [[245, 118], [245, 142]] },
        { from: "route", to: "retrieve", points: [[245, 178], [245, 202]] },
        { from: "retrieve", to: "rerank", points: [[245, 238], [245, 262]] },
        { from: "rerank", to: "llm", points: [[245, 298], [245, 334]] },
        { from: "vdb", to: "retrieve", points: [[150, 236], [160, 236], [160, 220], [170, 220]] },
        {
          from: "route",
          to: "svc",
          points: [[320, 160], [332, 160], [332, 440], [320, 440]],
          label: "service questions",
          labelAt: [326, 412],
          labelAnchor: "end",
        },
      ],
    },
  },

  "whatsapp-agent": {
    title: "WhatsApp agent",
    description:
      "A WhatsApp user and the Meta WhatsApp Cloud API exchange messages. Nginx receives the webhook callbacks, and a webhook check verifies Meta's signature and drops repeated messages before they reach the multi-tenant agent. The agent runs five flows: deterministic slot-filling to buy or register a product; parts lookup, which searches Elasticsearch and lets a language model select from the shortlist; repair status and service booking; and delivery of catalogue PDFs in the chat.",
    full: {
      width: 720,
      height: 338,
      fontSize: 14,
      nodes: [
        node("user", "plain", "WhatsApp\nuser", 0, 22, 90, 52),
        node("api", "flow", "Meta WhatsApp\nCloud API", 122, 20, 124, 56),
        node("nginx", "flow", "Nginx", 278, 20, 124, 56, "webhook callbacks"),
        node("guard", "flow", "Webhook checks", 434, 20, 130, 56, "signature, dedupe"),
        node("agent", "flow", "Multi-tenant\nagent", 596, 20, 124, 56),
        node("slot", "flow", "Slot-filling", 0, 164, 120, 52, "deterministic"),
        node("lookup", "model", "Parts lookup", 150, 140, 200, 100, "LLM-as-selector RAG"),
        node("svc", "flow", "Repair status\nand booking", 380, 156, 180, 68, "fixed questions"),
        node("pdf", "flow", "In-chat PDF\ndelivery", 596, 160, 124, 60),
        node("es", "store", "Elasticsearch", 180, 268, 140, 66, "parts index"),
      ],
      edges: [
        { from: "user", to: "api", points: [[90, 48], [122, 48]], bothWays: true },
        { from: "api", to: "nginx", points: [[246, 48], [278, 48]] },
        { from: "nginx", to: "guard", points: [[402, 48], [434, 48]] },
        { from: "guard", to: "agent", points: [[564, 48], [596, 48]] },
        { from: "agent", to: "slot", points: [[658, 76], [658, 108], [60, 108], [60, 164]] },
        { from: "agent", to: "lookup", points: [[658, 108], [250, 108], [250, 140]] },
        { from: "agent", to: "svc", points: [[658, 108], [470, 108], [470, 156]] },
        { from: "agent", to: "pdf", points: [[658, 76], [658, 160]] },
        {
          from: "lookup",
          to: "es",
          points: [[250, 240], [250, 268]],
          bothWays: true,
          label: "shortlist",
          labelAt: [260, 260],
          labelAnchor: "start",
        },
      ],
    },
    compact: {
      width: 320,
      height: 532,
      fontSize: 12.5,
      nodes: [
        node("user", "plain", "WhatsApp user", 85, 4, 150, 34),
        node("api", "flow", "Meta WhatsApp\nCloud API", 70, 60, 180, 42),
        node("nginx", "flow", "Nginx", 70, 124, 180, 44, "webhook callbacks"),
        node("guard", "flow", "Webhook checks", 70, 190, 180, 44, "signature, dedupe"),
        node("agent", "flow", "Multi-tenant\nagent", 70, 256, 180, 42),
        node("lookup", "model", "Parts lookup", 0, 344, 150, 84, "LLM as selector"),
        node("es", "store", "Elasticsearch", 0, 452, 150, 64, "parts index"),
        node("svc", "flow", "Repair status\nand booking", 170, 344, 150, 52, "fixed questions"),
        node("slot", "flow", "Slot-filling", 170, 416, 150, 44, "deterministic"),
        node("pdf", "flow", "In-chat PDF\ndelivery", 170, 484, 150, 44),
      ],
      edges: [
        { from: "user", to: "api", points: [[160, 38], [160, 60]], bothWays: true },
        { from: "api", to: "nginx", points: [[160, 102], [160, 124]] },
        { from: "nginx", to: "guard", points: [[160, 168], [160, 190]] },
        { from: "guard", to: "agent", points: [[160, 234], [160, 256]] },
        { from: "agent", to: "lookup", points: [[160, 298], [160, 320], [75, 320], [75, 344]] },
        { from: "agent", to: "svc", points: [[160, 320], [245, 320], [245, 344]] },
        { from: "agent", to: "slot", points: [[160, 320], [160, 438], [170, 438]] },
        { from: "agent", to: "pdf", points: [[160, 320], [160, 506], [170, 506]] },
        { from: "lookup", to: "es", points: [[75, 428], [75, 452]], bothWays: true },
      ],
    },
  },

  gmailsage: {
    title: "GmailSage",
    description:
      "A job runs every 15 minutes and fetches recent inbox mail from Gmail. A SQLite store of processed message IDs lets it skip mail it has already handled. Rules on sender domain, subject and the List-Unsubscribe header come first; on a miss, an LLM classifier on Groq decides among 13 categories. Labels are applied and low-priority mail is archived, never deleted. Each handled message is recorded in the store, which the undo command reads, and a daily digest email is built from the store.",
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
        { from: "inbox", to: "triage", points: [[80, 44], [108, 44]] },
        { from: "triage", to: "rules", points: [[224, 44], [256, 44]] },
        { from: "rules", to: "actions", points: [[406, 44], [444, 44]], label: "hit", labelAt: [425, 36], labelAnchor: "middle" },
        { from: "rules", to: "llm", points: [[331, 70], [331, 122]], label: "miss", labelAt: [341, 100], labelAnchor: "start" },
        { from: "llm", to: "actions", points: [[421, 170], [470, 170], [470, 70]] },
        {
          from: "actions",
          to: "store",
          points: [[530, 70], [530, 236]],
          label: "records each message",
          labelAt: [540, 150],
          labelAnchor: "start",
        },
        {
          from: "triage",
          to: "store",
          points: [[166, 70], [166, 265], [419, 265]],
          dashed: true,
          label: "skips processed mail",
          labelAt: [290, 257],
          labelAnchor: "middle",
        },
        { from: "store", to: "digest", points: [[589, 267], [661, 267], [661, 70]], dashed: true },
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
        { from: "inbox", to: "triage", points: [[70, 38], [70, 60]] },
        { from: "triage", to: "rules", points: [[70, 104], [70, 126]] },
        { from: "rules", to: "actions", points: [[140, 148], [180, 148]], label: "hit", labelAt: [160, 140], labelAnchor: "middle" },
        { from: "rules", to: "llm", points: [[70, 170], [70, 206]], label: "miss", labelAt: [80, 192], labelAnchor: "start" },
        { from: "llm", to: "actions", points: [[140, 248], [225, 248], [225, 170]] },
        { from: "actions", to: "store", points: [[285, 170], [285, 300]] },
        { from: "store", to: "digest", points: [[250, 372], [250, 400]], dashed: true },
      ],
    },
  },
};

export function hasDiagram(slug: string): boolean {
  return slug in diagrams;
}

/** What a walkthrough step puts in focus: node ids, and edges as [from, to] pairs. */
export interface DiagramFocus {
  nodes: string[];
  edges?: [string, string][];
}

/** True when the edge is one of the pairs. */
export function edgeInFocus(edge: DEdge, focus: DiagramFocus | null | undefined): boolean {
  return !!focus?.edges?.some(([from, to]) => from === edge.from && to === edge.to);
}

/**
 * Build-time check, run from vite.config.ts: every edge names nodes that exist in its layout, and the full and
 * compact layouts draw the same nodes, so a walkthrough step can address either one.
 */
export function checkDiagrams(): void {
  for (const [slug, spec] of Object.entries(diagrams)) {
    const ids = (layout: DiagramLayout) => layout.nodes.map((n) => n.id).sort();
    if (ids(spec.full).join() !== ids(spec.compact).join()) {
      throw new Error(`Diagram "${slug}": the full and compact layouts have different nodes`);
    }
    for (const name of ["full", "compact"] as const) {
      const known = new Set(spec[name].nodes.map((n) => n.id));
      for (const edge of spec[name].edges) {
        if (!known.has(edge.from) || !known.has(edge.to)) {
          throw new Error(`Diagram "${slug}" (${name}): edge ${edge.from} to ${edge.to} names an unknown node`);
        }
      }
    }
  }
}
