// Case-study content. Every line traces to resume-latest.pdf, the Facts in the v2 brief, the owner's own account of
// the DIATOZ work (his message of 9 October 2026, which is the source for what each piece of work was and how it went),
// or, for GmailSage, the public repo's README and code. See docs/v2/SOURCES.md for the line-by-line ledger.
// A section with no sourced content is left out, not padded.
//
// DIATOZ entries are employer work, described in general terms: no client names, internal tool, class, endpoint or
// table names, schemas or configuration values. Backticked text renders as inline code.

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
  /** The number or short claim, for example "4–5 s to 400 ms". */
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

export const employerNote = "Employer work, described in general terms. Code and data are not public.";

export const caseStudies: CaseStudy[] = [
  {
    slug: "master-data-ingestion",
    outcome:
      "Reworked a Spring Batch flow that loads device records from CSV into master data: one-by-one inserts became partitioned parallel workers with batch writes, so a million records now load in about 1.5 to 2 minutes instead of 16 hours.",
    glance: [
      { label: "When", value: "Internship at DIATOZ, October 2025 to May 2026" },
      {
        label: "My part",
        value:
          "My senior engineers wrote the first Spring Batch flow. I reviewed it, found what set its pace, and reworked it with batch inserts and parallel processing. I also traced and fixed why stopped jobs got stuck.",
      },
      {
        label: "Scale",
        value: "About 273 million records, uploaded as 273 files in parts of 10 million. A million records took around 16 hours at first and now take about 1.5 to 2 minutes.",
      },
    ],
    problem: [
      "Master data had to be loaded from CSV files of device records. The whole data set came to about 273 million records.",
      "I reviewed the Spring Batch flow my senior engineers had written. It ran sequentially, and each record was inserted on its own, one after another. Loading a million records took around 16 hours. At that speed, loading about 273 million was not realistic, so the flow had to change.",
    ],
    decisions: [
      {
        title: "Review the flow before changing it",
        body: "I read the first version to find what set its pace. Two things stood out: the records were handled one after another, and each was inserted with its own statement. Batching the inserts and running the work in parallel were the two changes I set out to make.",
      },
      {
        title: "Write a chunk at a time",
        body: "The writer sends each chunk of records to PostgreSQL as one multi-row insert-or-update statement, so a whole chunk costs one database call instead of one per record. A record that already exists is updated in place instead of failing.",
      },
      {
        title: "Split the file, run the parts in parallel",
        body: "A partitioner splits the CSV into parts, and each part runs on its own worker. Every worker has its own reader over its own part, so the threads share no file position and need no locks. Each part also remembers the line number its first row had in the original file, so a failed row can still be reported against the right line.",
      },
      {
        title: "A bad row does not stop the job",
        body: "A row that fails to parse, fails validation or fails to save is skipped and recorded with the reason and its line number, and the job carries on. When the job ends, the failed rows are written out as an error report CSV.",
      },
      {
        title: "Make a long job controllable",
        body: "A job can be stopped, paused and restarted. A stop takes effect after the current chunk. Spring Batch has no paused state, so a pause is a stop plus a marker that the API reports as paused. A restart skips the parts that finished and resumes the rest, reusing the part files, which are deleted only after a job completes or fails.",
      },
      {
        title: "Index outcomes for search",
        body: "The job and the outcome of each record are also indexed into Elasticsearch, in the background on a thread pool of their own. The job index powers the search over jobs.",
      },
    ],
    steps: [
      {
        title: "A CSV is uploaded and checked",
        body: "The front end uploads a CSV of device records. Before any work starts, the API rejects a file that is empty, is not a CSV, is too large, has only a header, or has the wrong header.",
        nodes: ["ui", "api"],
        edges: [["ui", "api"]],
      },
      {
        title: "The job starts in the background",
        body: "The API starts a Spring Batch job on another thread and answers at once with the job's details. The front end then polls for the job's status.",
        nodes: ["ui", "api", "split"],
        edges: [
          ["api", "split"],
          ["ui", "api"],
        ],
      },
      {
        title: "The file is split into parts",
        body: "A partitioner splits the data rows evenly into part files, one for each worker, and repeats the header in each. Each part remembers the line number its first row had in the original file.",
        nodes: ["split", "work"],
        edges: [["split", "work"]],
      },
      {
        title: "Workers run in parallel",
        body: "Each worker reads its own part, validates every row and processes the rows in chunks. The workers share nothing, so they need no locks.",
        nodes: ["work"],
      },
      {
        title: "A chunk is one database write",
        body: "The writer sends a whole chunk to PostgreSQL as a single multi-row insert-or-update statement.",
        nodes: ["work", "pg"],
        edges: [["work", "pg"]],
      },
      {
        title: "Outcomes are indexed for search",
        body: "The job and the outcome of each record are indexed into Elasticsearch in the background. The job index powers the search over jobs.",
        nodes: ["work", "es"],
        edges: [["work", "es"]],
      },
      {
        title: "Bad rows are skipped and reported",
        body: "A row that fails to parse, validate or save is skipped. It is recorded with an error type, the reason and its line number, and the job carries on. When the job ends, the failed rows are written to an error report CSV.",
        nodes: ["work", "errs"],
        edges: [["work", "errs"]],
      },
      {
        title: "A job can be stopped, paused and restarted",
        body: "A stop takes effect after the current chunk. A pause is a stop plus a marker, because Spring Batch has no paused state. A restart skips the parts that finished and resumes the rest.",
        nodes: ["api", "ctl", "work"],
        edges: [
          ["api", "ctl"],
          ["ctl", "work"],
        ],
      },
    ],
    blockers: [
      {
        title: "Inserting one record at a time",
        problem:
          "The flow wrote each record with its own insert, and a million records took around 16 hours. I wanted to send a whole chunk in one statement. The writer has to insert new records and update existing ones, and a comment in the code notes that the Postgres driver cannot rewrite an insert-or-update statement into a batch by itself.",
        fix: "I made the writer build one multi-row insert-or-update statement for each chunk, so a whole chunk costs one database call.",
      },
      {
        title: "Making the work parallel",
        problem:
          "Spreading the work across threads takes more than a thread pool. A file reader keeps its position, so threads cannot share one. A failed row still has to point at the right line of the original file, and a restarted job must neither redo finished work nor lose its place.",
        fix: "I split the CSV into part files and gave every part its own reader, so no locks are needed. Each part carries the line number of its first row, and the reader saves its position so line numbers stay right after a restart. The part files are named from the job's id, so a restart reuses them instead of splitting again.",
        result: "With the batch writes, a million records now load in about 1.5 to 2 minutes, down from around 16 hours.",
      },
      {
        title: "Stopped jobs stayed in a stopping state",
        problem:
          "When someone stopped an upload, the job went into a stopping state and stayed there, and the front end kept polling for it.",
        fix: "I found the root cause and debugged it. The front end needed changes as well, and I made those too.",
      },
    ],
    terms: [
      { term: "Partition", meaning: "Splitting the input so that several workers can each take their own part." },
      { term: "Chunk", meaning: "A group of rows that are read, processed and written together." },
      { term: "Upsert", meaning: "Insert a row, or update it when it already exists." },
      { term: "Skip", meaning: "Carrying on after a bad row instead of failing the whole job." },
    ],
    results: [
      {
        figure: "16 hours to 1.5–2 minutes",
        label: "to load a million records, with the original one-by-one flow and after the rework",
        source: "my account of the work, October 2026",
      },
      {
        figure: "10 million in 12–14 minutes",
        label: "records loaded in one part of the upload, which went in as 273 files in parts of 10 million",
        source: "my account of the work, October 2026",
      },
      { figure: "about 273 million", label: "records in the data set the flow was reworked to load", source: "my resume" },
    ],
  },
  {
    slug: "bulk-store-upload",
    outcome:
      "Reworked a bulk Excel upload that creates stores. It validates once and saves in the background, so an upload of up to 4,000 stores no longer hangs the application.",
    glance: [
      { label: "When", value: "Internship at DIATOZ, October 2025 to May 2026" },
      {
        label: "My part",
        value: "I debugged the hang with the DevOps team and my senior lead engineers, then reworked the validation flow on my senior's suggestion.",
      },
      { label: "Scale", value: "Up to 4,000 stores in one upload. 14+ validation rules." },
    ],
    problem: [
      "Users create stores in bulk: they upload an Excel file, and each row becomes a store.",
      "The whole workbook was loaded into memory. When a user uploaded a file with 4,000 stores in it, the entire application got stuck, and at first we could not tell why.",
    ],
    constraints: [
      "Memory: loading a whole workbook into memory exhausted the heap.",
      "A file has to belong to the customer who uploads it.",
      "Uploading the same file twice must not create duplicate stores.",
    ],
    decisions: [
      {
        title: "Validate once, while the user waits",
        body: "The upload parses and validates the workbook in a single pass before anything is saved. A bad file is rejected at once, with a message that names the row and the problem.",
      },
      {
        title: "Save in the background",
        body: "Once the file passes, a request record is saved in a processing state, so the client always gets a request id, and the rows are handed to a background pool. The API answers right away with the request id and the number of stores, and the client polls the request until it finishes. If saving fails, the request is marked failed with a note.",
      },
      {
        title: "Save in chunks with batch writes",
        body: "The background save works in chunks. Each chunk is one transaction that updates existing stores, inserts new ones and writes their model assignments, all as JDBC batches instead of one statement per row.",
      },
      {
        title: "Make a repeat upload safe",
        body: "Stores are matched on the customer and the store number. A match is updated rather than duplicated, and when a file lists the same store twice, the last row wins. Uploading the same file again leaves the same result.",
      },
      {
        title: "A template for each customer",
        body: "The template a customer downloads is built for them: their models as columns, drop-downs for the regions or countries they may use, and phone numbers formatted as text so Excel does not turn them into scientific notation. A hidden sheet records their customer id, and the upload reads it back, so a template made for another customer is rejected. Excel limits an inline drop-down list to 255 characters, so longer lists live on a hidden sheet.",
      },
    ],
    steps: [
      {
        title: "The user downloads a template",
        body: "The template is built for the customer: their models as columns, drop-downs for the regions or countries they may use, and a hidden sheet that holds their customer id.",
        nodes: ["tpl"],
      },
      {
        title: "The filled workbook is uploaded",
        body: "The user fills in the template and uploads the workbook. The API copies the file's bytes at once, because the upload stream closes when the request ends.",
        nodes: ["tpl", "xlsx", "api"],
        edges: [
          ["tpl", "xlsx"],
          ["xlsx", "api"],
        ],
      },
      {
        title: "It is validated once, up front",
        body: "One pass parses the workbook and checks it: that it came from the right customer's template, the mandatory fields, dates and quantities, the allowed regions or countries, and that every store has at least one valid model. A store listed twice is collapsed to its last row.",
        nodes: ["api", "val"],
        edges: [["api", "val"]],
      },
      {
        title: "A request record is created",
        body: "A request record is saved in a processing state, so the client always gets a request id. If this step fails, the user sees the error immediately.",
        nodes: ["val", "req"],
        edges: [["val", "req"]],
      },
      {
        title: "Rows go to a background pool",
        body: "The validated rows are handed to a background thread pool as plain objects. The API answers with the request id and the number of stores.",
        nodes: ["val", "bg"],
        edges: [["val", "bg"]],
      },
      {
        title: "Chunks are saved with batch writes",
        body: "Rows are saved in chunks. Each chunk is one transaction: it updates existing stores, inserts new ones and writes their model assignments, all as JDBC batches.",
        nodes: ["bg", "db"],
        edges: [["bg", "db"]],
      },
      {
        title: "The status is updated",
        body: "When every chunk is saved, the request moves to its final status. If anything fails, it is marked failed with a note. The client polls the request until it leaves the processing state.",
        nodes: ["bg", "req"],
        edges: [["bg", "req"]],
      },
    ],
    blockers: [
      {
        title: "A 4,000-store upload hung the whole application",
        problem:
          "The entire Excel file was loaded into memory when a user uploaded it. A file with 4,000 stores in it made the whole application get stuck, and we could not tell what was happening.",
        fix: "I went through the logs with the DevOps team and my senior lead engineers. They showed that large Excel files made the system hang.",
        result: "We had a cause to work on, instead of a hang with no explanation.",
      },
      {
        title: "More space in production did not help",
        problem: "The first fix was to give production more space. It did not work, and the whole system went down.",
        fix: "My senior suggested going back over the approach and asking what could improve in the validation flow. I reworked it: validate once up front, then save in the background in chunks with batch writes.",
        result: "Uploads of up to 4,000 stores now go through in one flow.",
      },
    ],
    terms: [
      { term: "Heap", meaning: "The memory a Java program uses for its objects. When it fills up, the program slows down or fails." },
      { term: "Fail fast", meaning: "Reject bad input at the first check, before any work is done." },
      { term: "Idempotent upload", meaning: "Uploading the same file twice leaves the same result as uploading it once." },
      { term: "Batch write", meaning: "Sending many rows to the database in one go instead of one statement per row." },
    ],
    results: [
      {
        figure: "up to 4,000 stores",
        label: "in one upload. Before the rework, a 4,000-store upload hung the application",
        source: "my account of the work, October 2026",
      },
      { figure: "14+", label: "validation rules", source: "my resume" },
    ],
  },
  {
    slug: "report-search",
    outcome:
      "Built 7+ report APIs with PDF and Excel downloads over ticket data, and cut query latency from 4–5 s to 400 ms by moving report reads from multi-join database queries to Elasticsearch, with PostgreSQL still the source of truth.",
    glance: [
      { label: "When", value: "Internship at DIATOZ, October 2025 to May 2026" },
      {
        label: "My part",
        value:
          "I built the Spring Boot report APIs and a download endpoint for each report. A senior engineer suggested Elasticsearch, so I learned it, indexed the ticket data there (a backfill for old tickets, automatic async indexing for new ones) and moved report reads to it. I also made the indexing asynchronous after a production timeout, and added an audit mechanism.",
      },
      { label: "Scale", value: "Millions of records and multi-filter queries over ticket data. 7+ reports. Query latency from 4–5 s to 400 ms." },
    ],
    problem: [
      "Report APIs had to serve analytics over ticket data, millions of records, with several filters at once. I first queried the database directly. Each query joined several tables and took around 4 to 5 seconds, which is very slow. It was the bottleneck I found.",
      "At that point I had not worked with Elasticsearch. One of my senior engineers suggested it, so I learned how it works.",
    ],
    constraints: [
      "PostgreSQL already holds the ticket data and stays the source of truth.",
      "Queries are read-heavy and combine several filters.",
      "Old tickets and new tickets both have to be in Elasticsearch, and the two stores have to stay consistent.",
      "Every report needs a file download as well as the screen view.",
    ],
    decisions: [
      {
        title: "Elasticsearch for reads, PostgreSQL for truth",
        body: "The ticket data is indexed into report indexes in Elasticsearch, and the report reads go there instead of to multi-join queries on the database. PostgreSQL already holds the ticket data and stays the source of truth, and nothing is written to it for the reports. Elasticsearch is there only to make reads fast.",
      },
      {
        title: "Backfill the old tickets",
        body: "Existing tickets were reindexed into the report indexes with a backfill method.",
      },
      {
        title: "Index new tickets as they are created",
        body: "Whenever a ticket is created, it is indexed into the report indexes automatically, and the indexing runs asynchronously.",
      },
      {
        title: "Two endpoints for every report",
        body: "Each report has one endpoint for the screen and one for the download. Both call the same service method to build the data, so the file matches the screen.",
      },
      {
        title: "PDF from an HTML template",
        body: "A PDF is made inside the Spring backend: the report data fills an HTML template, and an HTML-to-PDF library converts it. Changing how a PDF looks means editing HTML and CSS, not Java.",
      },
      {
        title: "Excel written as a stream",
        body: "Excel files are written with Apache POI's streaming workbook (SXSSF), which keeps only the most recent rows in memory and spills the rest to temporary files. That is what keeps a large export from running out of memory.",
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
        body: "The multi-filter report queries are answered from the report indexes in Elasticsearch. Query latency fell from 4–5 s, with multi-join queries on the database, to 400 ms.",
        nodes: ["es"],
        edges: [["api", "es"]],
      },
      {
        title: "Each report has a download",
        body: "A second endpoint for each report builds the same data and returns it as a PDF, made from an HTML template, or as an Excel file written with a streaming workbook.",
        nodes: ["api", "dl"],
        edges: [["api", "dl"]],
      },
      {
        title: "PostgreSQL stays the source of truth",
        body: "PostgreSQL already holds the ticket data and remains the source of truth. The reports do not write to it.",
        nodes: ["pg"],
      },
      {
        title: "Indexing keeps Elasticsearch current",
        body: "Old tickets were reindexed into Elasticsearch with a backfill. A new ticket is indexed into the report indexes automatically, and asynchronously, when it is created.",
        nodes: ["pg", "idx", "es"],
        edges: [
          ["pg", "idx"],
          ["idx", "es"],
        ],
      },
      {
        title: "An audit check compares the two",
        body: "An audit mechanism verifies that the report indexes and PostgreSQL stay consistent.",
        nodes: ["audit", "es", "pg"],
        edges: [
          ["audit", "es"],
          ["audit", "pg"],
        ],
      },
    ],
    blockers: [
      {
        title: "Slow multi-join queries",
        problem: "Each report query joined several tables in the database and took around 4 to 5 seconds, which is very slow. I had not used Elasticsearch before.",
        fix: "A senior engineer pointed me to Elasticsearch. I learned how it works, indexed the ticket data into report indexes, reindexed the old tickets with a backfill and moved the report reads there, leaving PostgreSQL as the source of truth.",
        result: "Query latency fell from 4–5 s to 400 ms.",
      },
      {
        title: "A production server timeout",
        problem: "Indexing a new ticket into Elasticsearch synchronously caused a production server timeout.",
        fix: "I made the indexing of new tickets asynchronous.",
      },
      {
        title: "An index that is written in a separate step",
        problem:
          "With asynchronous indexing, a ticket and its entry in the report indexes are no longer written in one step, so they have to be kept in step another way.",
        fix: "I added an audit mechanism that verifies write consistency between them.",
      },
    ],
    terms: [
      { term: "Source of truth", meaning: "The store whose data wins when two stores disagree." },
      { term: "Backfill", meaning: "Loading data that already existed into a new store, such as an index, so it starts complete." },
      { term: "Streaming workbook", meaning: "An Excel file written row by row, with only the latest rows held in memory." },
    ],
    results: [
      {
        figure: "4–5 s to 400 ms",
        label: "query latency for the report queries, from multi-join database queries to Elasticsearch",
        source: "my account of the work, October 2026",
      },
      {
        figure: "7+ reports",
        label: "each with an API for the screen and a PDF or Excel download",
        source: "my account of the work, October 2026",
      },
    ],
  },
  {
    slug: "rag-chatbot",
    outcome:
      "A proof-of-concept chatbot on LangChain, LangGraph and Milvus that answers from ingested documents and sends other questions to service APIs, using reranking, multi-representation indexing, query structuring and logical routing.",
    glance: [
      { label: "When", value: "Full-time role at DIATOZ, since May 2026" },
      {
        label: "What",
        value: "A proof of concept, built to learn how semantic and logical routing, multi-representation indexing and query structuring work.",
      },
      {
        label: "My part",
        value:
          "I built the chatbot and its document-ingestion pipeline, wrote the routing logic, exposed the service APIs it calls, chose Milvus over Pinecone as the vector database, and implemented reranking, multi-representation indexing, query structuring and logical routing.",
      },
    ],
    problem: [
      "Questions inside a company are not all answered by documents. People also want to create a ticket, check one they raised, or ask something about themselves, such as how many keys are available to them. The chatbot had to answer from ingested documents and also reach the services behind such questions, and decide which one a question needs.",
    ],
    decisions: [
      {
        title: "Milvus over Pinecone",
        body: "I learned about both vector databases and chose Milvus because it is open source: I could pull its Docker image and run it locally quickly.",
      },
      {
        title: "Route each question",
        body: "Semantic and logical routing decide where a question goes: to the ingested documents, or to a service API such as ticketing. I wrote the routing logic.",
      },
      {
        title: "Expose the services as APIs",
        body: "I exposed the APIs the chatbot calls to reach other services, including a ticketing service where a person can create a ticket or check one that was raised.",
      },
      {
        title: "Let people add documents",
        body: "A new document can be uploaded at any time. It is split into chunks and indexed automatically, so the chatbot can answer from it.",
      },
      {
        title: "Four retrieval techniques",
        body: "Multi-representation indexing happens when documents are indexed. Query structuring and logical routing happen before retrieval, and reranking happens after it.",
      },
      {
        title: "Study what production needs",
        body: "A proof of concept leaves out things a production assistant needs, so I studied them: guardrails, keeping restricted information away from the model, and latency. One idea I took from it is to answer greetings and \"who are you\" questions with fixed text, which avoids an unnecessary model call and lowers latency. This was reading and learning, not something I shipped.",
      },
    ],
    steps: [
      {
        title: "Documents are uploaded and ingested",
        body: "A document-ingestion pipeline takes in each uploaded document and splits it into chunks automatically.",
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
        body: "I chose Milvus over Pinecone: it is open source, and I could pull its Docker image and run it locally quickly.",
        nodes: ["vdb"],
        edges: [["index", "vdb"]],
      },
      {
        title: "A question is structured and routed",
        body: "Query structuring and logical routing happen before retrieval. Routing decides whether the question goes to the documents or to a service API.",
        nodes: ["q", "struct", "route"],
        edges: [
          ["q", "struct"],
          ["struct", "route"],
        ],
      },
      {
        title: "Service questions go to APIs",
        body: "A question that needs a service, such as creating a ticket or checking one, goes to that service's API instead of to the documents.",
        nodes: ["route", "svc"],
        edges: [["route", "svc"]],
      },
      {
        title: "Retrieval, then reranking",
        body: "For a document question, retrieval searches the vector database, and reranking happens after it.",
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
      {
        term: "Semantic routing",
        meaning: "Choosing a route by comparing the meaning of the question with a description of each route.",
      },
      { term: "Reranking", meaning: "Reordering retrieved passages by relevance before they go to the model." },
    ],
  },
  {
    slug: "whatsapp-agent",
    outcome:
      "A proof-of-concept WhatsApp agent on Meta's WhatsApp Cloud API: parts lookup with LLM-as-selector RAG, deterministic slot-filling, repair status and service booking, and in-chat PDF delivery. Built for a single tenant and configurable for more.",
    glance: [
      { label: "When", value: "Full-time role at DIATOZ, since May 2026" },
      { label: "Status", value: "A proof of concept for a single tenant, configurable for more. It was not shipped." },
      {
        label: "My part",
        value:
          "I built the webhook handling and the five conversation flows, and set up Nginx and the webhook callbacks on the Meta Developer Dashboard.",
      },
    ],
    problem: [
      "Customers message one WhatsApp number. A menu offers five things: buy a product, register one, find a spare part, check a repair or book a service, and get a catalogue. The agent has to handle each in the chat, and has to cope with the way WhatsApp delivers messages.",
    ],
    constraints: [
      "Single tenant: it is built for one tenant, and it is configurable.",
      "WhatsApp traffic arrives as webhook callbacks from Meta's Cloud API.",
      "Meta can deliver the same message more than once, and in parallel.",
    ],
    decisions: [
      {
        title: "Talk to Meta's Cloud API directly",
        body: "The agent uses Meta's WhatsApp Cloud API itself, with no messaging provider in between. Only one piece of code knows Meta's message format, so the rest of the agent deals in plain messages, and a different provider would only need a new adapter.",
      },
      {
        title: "Verify Meta, then verify every call",
        body: "Meta checks the callback URL with a verify token, and the agent echoes Meta's challenge back only when the token matches. After that, each incoming call is checked against Meta's signature, computed over the raw request body with the app secret, and rejected if it does not match.",
      },
      {
        title: "Skip a message that was already handled",
        body: "The agent checks Meta's message id before anything else and skips a message it has stored already. A unique index on that id backs the check.",
      },
      {
        title: "A conversation is a loop",
        body: "Each simple flow is a loop: ask a question, wait for the reply, validate it, store it, ask the next. The questions are data, not code, so a new flow is a new list of fields. Buying a product and registering one use this loop.",
      },
      {
        title: "Buttons return ids, not words",
        body: "A tapped button comes back from Meta as an interactive reply id. The agent matches the id exactly and never tries to match typed text against an option, so the answer stored for a button question is always one of the options offered.",
      },
      {
        title: "The model only selects",
        body: "The language model is used in one place, the spare-part lookup, and even there it only chooses from a shortlist. Compatibility comes from the database, not from the model. If the model's choice is not on the shortlist, the agent shows the top few shortlisted parts without it.",
      },
      {
        title: "Send PDFs by media id",
        body: "To send a catalogue, the agent uploads the PDF to Meta's media endpoint and then sends a document message that points at the returned media id, which also works for files that are not on a public URL.",
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
        body: "Nginx receives the webhook callbacks, which are set up on the Meta Developer Dashboard. Meta first verifies the callback URL with a token, and the agent echoes Meta's challenge back only if the token matches.",
        nodes: ["nginx"],
        edges: [["api", "nginx"]],
      },
      {
        title: "Each call is checked",
        body: "Every call is checked against Meta's signature on the raw request body. A message whose id is already stored is skipped.",
        nodes: ["guard"],
        edges: [["nginx", "guard"]],
      },
      {
        title: "The agent finds the conversation",
        body: "The agent loads the user's conversation, saves the message and hands it to the flow that owns the conversation. A tap on the menu starts a new flow.",
        nodes: ["agent"],
        edges: [["guard", "agent"]],
      },
      {
        title: "Buying and registering use slot-filling",
        body: "Deterministic slot-filling collects the details one field at a time: ask, wait, validate, store, next. Button replies come back as ids and are matched exactly.",
        nodes: ["slot"],
        edges: [["agent", "slot"]],
      },
      {
        title: "Spare parts: search, then select",
        body: "The request is searched in Elasticsearch, which shortlists the compatible parts. A language model acts as the selector: it checks whether the shortlist answers the request and picks the best match. The user confirms with Yes, No, or Connect to a person.",
        nodes: ["lookup", "es"],
        edges: [
          ["agent", "lookup"],
          ["lookup", "es"],
        ],
      },
      {
        title: "Repairs: look up or book",
        body: "To check a repair, the agent looks it up in the database and replies. To book a service, it asks a fixed set of questions, such as which machine, what the issue is and whether there was a safety hazard, and then creates a service record, much like a ticket.",
        nodes: ["svc"],
        edges: [["agent", "svc"]],
      },
      {
        title: "Catalogues come back as PDFs",
        body: "The user picks a category. The agent uploads the matching PDF to Meta's media endpoint, then sends a document message that points at the returned media id.",
        nodes: ["pdf"],
        edges: [["agent", "pdf"]],
      },
    ],
    blockers: [
      {
        title: "The same message can arrive twice",
        problem: "Meta can deliver the same message more than once, and in parallel, so the agent has to recognise a repeat before it acts on it.",
        fix: "I check the message id before anything else. A message whose id is already stored is skipped, and a unique index on the id backs the check.",
      },
    ],
    terms: [
      {
        term: "LLM-as-selector RAG",
        meaning: "Retrieval finds candidates, and a language model picks the best match instead of writing free text.",
      },
      { term: "Slot-filling", meaning: "Collecting the details a request needs, one field at a time." },
      { term: "Deterministic", meaning: "The same input gives the same result, and no model decides it." },
      { term: "Webhook", meaning: "A URL on the agent's server that Meta calls whenever something happens, such as a new message." },
      { term: "Deduplication", meaning: "Making sure the same message, delivered twice, is handled once." },
    ],
  },
  {
    slug: "gmailsage",
    outcome:
      "Triages a Gmail inbox every 15 minutes with rules first and an LLM as the fallback, archives job-alert spam, deletes nothing and emails a daily digest.",
    glance: [
      { label: "When", value: "September 2026, as a personal project" },
      { label: "Why", value: "For fun, and for myself. Job-board and promotional mail was burying the personal mail I did not want to miss." },
      { label: "My part", value: "I built it end to end." },
      { label: "Scale", value: "Runs every 15 minutes on one inbox, with 13 categories and a digest at 8 am." },
    ],
    problem: [
      "I built this for myself. Every day my inbox filled with promotions and job-board mail from sites such as Naukri, LinkedIn, Indeed, Cutshort and Hirist, and I started missing the mail that mattered, including personal mail.",
      "So I thought: label the mail, so I can see which is important and which is not, and let an AI do the sorting. GmailSage labels and archives the job-alert and promotional kind, and keeps mail that matters, such as interview invites, offer letters and deadlines, in the inbox and in a daily digest. It is a personal project and has no connection to my job.",
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
