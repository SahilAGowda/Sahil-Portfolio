# Where each claim on the site comes from

Rule from the brief: every title, date, number and claim traces to `resume-latest.pdf`, a repo README, the Facts in the brief, or an answer at a checkpoint. This is the ledger. Anything marked **check** is the part I could not confirm from here.

| On the site | Source |
|---|---|
| Name, role, Bengaluru, email, LinkedIn and GitHub links | Resume header; links as in the old `Home.tsx` (the brief says those are the correct ones) |
| "Software development engineer at DIATOZ", May 2026 to present | Resume; Facts |
| Software Engineering Intern, Oct 2025 to May 2026 | Resume; Facts |
| About 273 million records, Spring Batch, multithreading, JDBC batch inserts | Resume; Facts |
| Excel pipeline, 14+ validation rules, heap fix with Apache POI SXSSF | Resume; Facts. The site says "streaming with Apache POI SXSSF", the brief's wording; the resume says "streaming read via SXSSF". **check** SXSSF is POI's streaming writer, and reads stream through its SAX event API. Confirm which one the pipeline uses so the wording is exact |
| Report APIs, Elasticsearch, 1 s to 400 ms (60%), PostgreSQL as source of truth | Resume; Facts |
| Async Elasticsearch and PostgreSQL updates after a production timeout, audit mechanism | Resume; Facts |
| RAG chatbot, LangChain and LangGraph, Milvus and Pinecone evaluated, reranking, multi-representation indexing, query structuring, logical routing | Resume; Facts |
| Multi-tenant WhatsApp agent, Meta Cloud API, LLM-as-selector RAG for parts lookup, deterministic slot-filling, in-chat PDFs, Nginx and webhook callbacks | Resume; Facts. The resume says Nginx and the callbacks were configured "on the Meta Developer Dashboard"; the case study says only that the callbacks are set up there |
| Client name in the WhatsApp experience bullet, Lexi, MuleSoft | Resume bullets; you said at Checkpoint A that what is on the resume can be mentioned. Case-study pages do not name the client |
| Voice-agent bug fix and human transfer | Resume |
| Valtren, AEGIS, Samsung Prism, Avarista Nexus | Not on the site, as you asked |
| B.E., Cambridge Institute of Technology North Campus, CGPA 9.25 / 10, coursework | Resume |
| "Graduated May 2026" | Your answer at Checkpoint A. The resume PDF still says "(Expected)" |
| PUC 89%, SSLC 97%, school names and years | The previous site. Not on the resume. **check** |
| AWS Cloud Practitioner, Udemy, 2024, "course certificate", certificate link | Resume says "AWS Certified Cloud Practitioner (2024)"; you said it is a Udemy course certificate; the Drive link is from the previous site. **check** the link opens |
| Selenium WebDriver with Java, Simplilearn, 2024 | Resume |
| 2nd place GDSC Quizzard 2024, Finalist SIH 2025, Tech Lead GDSC (50+ students) | Resume |
| LeetCode, HackerRank, CodeChef links, no counts | Profile URLs from the previous site. The resume claims "LeetCode 450+" and "HackerRank 5-Star Java"; the brief says to show only what the profile pages confirm, and they were not reachable from here |
| Skills lists | Resume, plus FastAPI from the brief's positioning line and the Meet transcriber README, and JWT from the Railway project bullet |
| Railway Reservation System, 2024, stack, RBAC with JWT | Resume |
| Meet transcriber extension | Its README (Brave extension, FastAPI backend, faster-whisper on CPU, Markdown transcript) |
| GmailSage: every 15 minutes, daily 8 am digest, rules then Groq, 13 categories, safety layers, keep list, undo, SQLite store, nothing deleted | README, code and commit history of `SahilAGowda/GmailSage` (6 commits, 17 to 24 September 2026), read on 7 and 9 October 2026. The two cron lines are `setup_cron.sh:6-7` |
| GmailSage: 16 unit tests pass | Ran `python -m unittest test_rules` on 7 October 2026 |
| GmailSage: README says "12 categories", "80% hit" and "16 newsletter domains" | Not used. The code has 13 categories and 13 newsletter domains, and nothing measures the 80% |
| GmailSage blocker: `invalid_scope` on token refresh | Commit `57a9182` ("fix: gmail_auth scope mismatch invalid_scope on refresh", 18 September 2026) and the code comment at `gmail_auth.py:46-47`. Before it (commit `ade4ac1`) a dry run asked for read-only scopes and the real run for modify scopes, on one saved token. **check** that this matches what you remember; the repo does not say why the saved token's scopes were unknown |
| GmailSage blocker: the network is not up when cron wakes | The comment at `gmail_auth.py:34` ("Laptop cron often wakes before the network is up (DNS failures in the log)"), the retry loop at `gmail_auth.py:33-42` (4 attempts, waits of 5, 10 and 20 seconds), and the exit when the network is down at `triage.py:129-132` |
| GmailSage "Fail safe, then retry" | Gmail calls retry 3 times (`gmail_actions.py:7`), the Groq client has `max_retries=3` (`classifier.py:74`), a failed message is left unrecorded (`triage.py:153-181`), and the quoted words are from the comment at `classifier.py:9` |
| GmailSage "Follow the data" steps | Cron lines `setup_cron.sh:6-7`; `in:inbox newer_than:2d`, at most 50 (`triage.py:29-30`); skip processed ids (`triage.py:149-151`); job-hunt subjects first (`rules_engine.py:91-93`); bad model output falls back to medium priority (`classifier.py:121-132`); the guard (`rules_engine.py:130-138`); label always, archive only low priority (`gmail_actions.py`); digest of high plus non-"other" medium for 24 hours (`store.py:118-128`), sent through the Gmail API (`digest.py:94`) |
| GmailSage: statements corrected on 9 October | A re-read of the code against the site text found these overclaims, now fixed. "Every action can be undone": the undo command reverses archiving of low-priority mail only (`store.py:142-153`, `triage.py:212`). "`--dry-run` ... without touching the database": it still creates the tables and caches model answers, but it records no message as processed (`triage.py:169-172`). "Application mail wins" was listed under the final guard, but it is the first rule of the rules engine (`rules_engine.py:91-93`). "Rules classify most mail": nothing measures it (the code comment says "most job-alert spam"). The diagram edge "logs for undo" is now "records each message", because every handled message is written to the `processed` table that the undo command reads. The problem statement now follows the README's own tagline |
| Architecture diagrams | Drawn only from the facts above. The RAG and WhatsApp diagrams show the standard order for those techniques (indexing before search, query structuring and routing before retrieval, reranking after). **check** that order is how you built them |
| "Terms" definitions on two case studies | General meanings of the terms, not claims about the build |
| Case-study "At a glance" blocks (When, My part, Scale) | DIATOZ studies: the resume bullets and dates (internship October 2025 to May 2026 for ingestion and report search; full-time since May 2026 for the RAG chatbot and WhatsApp agent) and the Facts. "My part" uses only the resume's own verbs (built, evaluated, implemented, shipped, configured, fixed, added). GmailSage: "September 2026" is the commit range of the public repository |
| DIATOZ "Follow the data" steps and "Blockers" | Each step restates a sentence already in the case study, and the blockers are the three problems the resume and Facts name (the heap exhaustion, the production timeout, the audit mechanism). No symptom, cause or outcome is added beyond what they say. **check** the RAG and WhatsApp step order, as for their diagrams |
| 3D and flat diagrams, and the moving dots | Drawn from the same node and edge data (`src/data/diagrams.ts`) as the flat diagrams on the home page. The 3D view adds no component and no arrow, only height, a camera and moving dots. The dots show the direction of flow, not volume or timing: their speed and count are decorative |
