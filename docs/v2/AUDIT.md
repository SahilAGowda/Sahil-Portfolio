# Portfolio v2: Phase 0 audit

Baseline is `main@80c732a`, measured 2026-10-06. GitHub's deployment record shows Vercel last deployed exactly this SHA to Production. The live host is blocked by this container's network policy, so every number comes from a local production build (`vite preview`), not the live URL. Evidence and raw data: [`before/EVIDENCE.md`](before/EVIDENCE.md).

## Findings

- **Confirmed (20 of 21):** 1-9 and 11-21. Highlights: the contact form sends nothing (1); the resume link opens an iframe around a pre-DIATOZ PDF (2); 12 `"#"` links and buttons with no target (5); the sidebar is `position: static` and scrolls away (17); `bg-gradient-to-l` is not in the built CSS (18); 40 of 49 `ui/*` files and 35 dependencies are unused (20).
- **Partly (10):** AWS shows platform "Udemy" and a hard-coded `verified`; whether it is the exam credential is unknown.
- **Undetermined:** which lockfile Vercel uses (both arrived in one Lovable commit; no `vercel.json`), so check the "Installing dependencies" line of the Vercel build log. Mobile iframe-PDF failure and live deep-link 404s need the live host.
- **Missed in the brief:** on mobile the fixed hamburger covers the first letters of 5 of 8 headings; it has no accessible name and the closed menu still takes 12 Tab stops; there is no skip link; `--text-muted` is 4.18:1 on cards (AA needs 4.5); the hover "Code" button is invisible (text colour equals background); every Projects control is under 44 px; `me.jpg` is 868x1156 for at most 384 px; baseline `npm run lint` already fails (3 errors, 7 warnings in `ui/*` and `tailwind.config.ts`); the real phone number is public on the site and in both PDFs.

## Baseline (local build, median of 3 Lighthouse runs)

| | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| Mobile | 90 | 90 | 100 | 100 | 2.49 s | 2.57 s | 0 ms | 0 |
| Desktop | 97 | 96 | 100 | 100 | 0.77 s | 0.81 s | 0 ms | 0.084 |

Against the Phase 4 targets only accessibility (90 vs 95) and mobile LCP (2.57 s vs 2.5 s) miss. Bundle: JS 374.19 kB (114.95 kB gzip), CSS 87.45 kB (14.08 kB gzip). Production console: 0 errors or warnings at 1440, 768 and 390. No horizontal overflow at 1440, 390 or 360. Screenshots are in `before/`.

## Site against `resume-latest.pdf` (full table in EVIDENCE.md)

| Item | Site | resume-latest.pdf |
|---|---|---|
| DIATOZ | absent | SDE May 2026 to present; SWE intern Oct 2025 to May 2026 |
| Samsung Prism, Avarista | present; Samsung "2024 - Present" | both absent (old PDF: Samsung May to Nov 2024; Avarista Jun to Sep 2025) |
| GDG | AI/ML Lead 2023-25, "500+ participants" | Tech Lead, GDSC, "50+ students" |
| B.E. | 2020-2024 | 2022-2026 (Expected) |
| Quizzard, SIH | Winner; Participant 2024 | 2nd place; Finalist 2025 |
| Site-only achievements | Code Red, Don Bosco, SIT abstract, TCS TechBytes | absent |
| LeetCode, HackerRank | 500+, "Gold Badge" | 450+, 5-Star Java (old PDF: 400+) |
| AWS, Selenium | Udemy; "Introduction to Selenium" 2023 | no platform; "Selenium WebDriver with Java" 2024 |
| Skills, projects | 27 skills with percentages; 6 projects | Spring, Elasticsearch, LangChain, RAG; Railway Reservation System |

Resume against your Facts: Samsung and Avarista are not on `resume-latest.pdf`; the resume names a client and an internal agent, which clashes with the confidentiality rule if the PDF is published; the Railway project's `[GitHub]` link points to the profile root.

## Project candidates (all public; no README lists a live demo except Taskify's unverified Render links)

| Repo | Last push | One line |
|---|---|---|
| GmailSage | 2026-09-24 | Inbox triage: rules first, LLM fallback, Mermaid architecture, tests |
| Meet-Transcriber-Extension | 2026-09-24 | Local Meet transcriber: extension to FastAPI and faster-whisper, diagram docs |
| SIH-Epic-Electrons/AEGIS-, EpicElectrons/AEGIS | 2026-02, 2025-12 | SIH fraud and mule-account detection; officer mobile app |
| study-eyes, PromptFlow, smart-flex | 2026-01, 2026-03, 2025-07 | AI engagement monitor; offline speech-to-prompt app; health platform (94% claim unverified) |
| Taskify, Hirely, Adya-Travels, Hepatitis, OMR, thunder-cipher | 2025-02 to 2026-09 | Generic or learning projects; four have no README |

**Recommendation.** Five case studies: the four DIATOZ systems at resume level, without client or internal names (273M-record ingestion; Elasticsearch over PostgreSQL with async updates and an audit check; RAG chatbot; multi-tenant WhatsApp agent), plus GmailSage as the one public repo with a real diagram. Meet-Transcriber and AEGIS become compact cards that link to code (AEGIS needs your role stated). The six old projects go; the repo behind AutoProof is private, so nothing could link to it.
