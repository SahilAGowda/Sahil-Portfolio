# Where each claim on the site comes from

Rule from the brief: every title, date, number and claim traces to `resume-latest.pdf`, a repo README, the Facts in the brief, or an answer at a checkpoint. This is the ledger. Anything marked **check** is the part I could not confirm from here.

| On the site | Source |
|---|---|
| Name, role, Bengaluru, email, LinkedIn and GitHub links | Resume header; links as in the old `Home.tsx` (the brief says those are the correct ones) |
| "Software development engineer at DIATOZ", May 2026 to present | Resume; Facts |
| Software Engineering Intern, Oct 2025 to May 2026 | Resume; Facts |
| About 273 million records, Spring Batch, multithreading, JDBC batch inserts | Resume; Facts |
| Excel pipeline, 14+ validation rules, heap fix with Apache POI SXSSF | Resume; Facts. **check** SXSSF is Apache POI's streaming writer; POI streams reads through its SAX event API. Worth confirming which one the pipeline uses so the wording is exact |
| Report APIs, Elasticsearch, 1 s to 400 ms (60%), PostgreSQL as source of truth | Resume; Facts |
| Async Elasticsearch and PostgreSQL updates after a production timeout, audit mechanism | Resume; Facts |
| RAG chatbot, LangChain and LangGraph, Milvus and Pinecone evaluated, reranking, multi-representation indexing, query structuring, logical routing | Resume; Facts |
| Multi-tenant WhatsApp agent, Meta Cloud API, LLM-as-selector RAG for parts lookup, deterministic slot-filling, in-chat PDFs, Nginx and webhook callbacks | Resume; Facts |
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
| Skills lists | Resume, plus FastAPI and JWT from the Meet transcriber README and the Railway project bullet |
| Railway Reservation System, 2024, stack, RBAC with JWT | Resume |
| Meet transcriber extension | Its README (Brave extension, FastAPI backend, faster-whisper on CPU, Markdown transcript) |
| GmailSage: every 15 minutes, daily 8 am digest, rules then Groq, 13 categories, safety layers, keep list, undo, SQLite store, nothing deleted | README and code of `SahilAGowda/GmailSage`, read on 7 October 2026 |
| GmailSage: 16 unit tests pass | Ran `python -m unittest test_rules` on 7 October 2026 |
| GmailSage: README says "12 categories", "80% hit" and "16 newsletter domains" | Not used. The code has 13 categories and 13 newsletter domains, and nothing measures the 80% |
| Architecture diagrams | Drawn only from the facts above. The RAG and WhatsApp diagrams show the standard order for those techniques (indexing before search, query structuring and routing before retrieval, reranking after). **check** that order is how you built them |
| "Terms" definitions on two case studies | General meanings of the terms, not claims about the build |
