# Phase 0 evidence

Supports [`../AUDIT.md`](../AUDIT.md). Raw data sits next to this file: `capture-log.json`, `probe.json`, `lighthouse-local.json`, `build-lint.txt`, `knip.txt`, `link-check.tsv`, and the screenshots in `1440x900/`, `768x1024/`, `390x844/` (8 sections each).

## Method and limits

- **Baseline commit:** `main@80c732a` ("portfolio completed", 2025-08-08). GitHub's deployment record lists one Production deployment of that exact SHA (Vercel bot, `success`, 2025-08-08T17:29:28Z), so the live site was built from this commit.
- **The live site could not be opened.** The container's egress policy denies `sahil-a-gowda-portfolio.vercel.app` (CONNECT 403). Every runtime number here comes from a local production build served by `vite preview`; the dev server was used for the dev-console check only. No content comparison with the live host was possible.
- **Tooling** (Playwright 1.56 with the pre-installed Chromium, Lighthouse 13.5, axe-core 4.14, knip 5) was installed in a scratch directory. `package.json` and both lockfiles are untouched (`npm ci`, not `npm install`).
- **Timing caveat:** headless Chromium renders in software, so animation timings are inflated. Nav switch measured 1.2 s to the new heading and 2.2 s to full opacity; by construction it is about 0.8 s (200 ms timeout + 100 ms + 500 ms transition).
- **`probe.json` caveat:** Chromium reports `outline-width: 0px` for `auto` outlines, so those fields say nothing about focus rings; rings were checked in a screenshot instead.
- **Lighthouse** is the median of 3 local runs per form factor. It is valid for before/after comparison on this setup, not as an absolute live-site number (no CDN, no HTTP/2, no edge cache).
- **Links:** only `fonts.googleapis.com` was reachable. LinkedIn, LeetCode, HackerRank, CodeChef, X, Google Drive and Maps, and lovable.dev were denied by the egress policy; github.com web pages answered 403. All of them are therefore "unverifiable", none is "broken".

## Findings 1 to 21

| # | Verdict | Evidence |
|---|---|---|
| 1 | Confirmed | `Connect.tsx` `onSubmit` awaits a 1.2 s timer, then toasts "Message sent"; nothing is sent. `Contact.tsx` is imported nowhere (knip), has placeholder email and phone and a 2 s fake submit. |
| 2 | Confirmed | `public/Sahil A Gowda Resume.pdf` was generated 2025-08-08 (Samsung, Avarista, SmartFlex, RailEase; no DIATOZ). `Home.tsx` calls `window.open("/resume.html")`, an iframe wrapper; nothing downloads. Mobile iframe-PDF failure: not testable here. |
| 3 | Confirmed | `Experience.tsx`: Avarista, Samsung ("2024 - Present"), GDG; no DIATOZ. Hero says "Computer Science student". Old PDF: Samsung May 2024 to Nov 2024; the `samsung-prism-citnc` org repos listed under your account were last pushed between 2024-05-20 and 2024-11-25. |
| 4 | Confirmed | `index.html`: og:title "sahil-codes-ai", og:description "Lovable Generated Project", og:image on lovable.dev, twitter:site @lovable_dev; meta description says "Computer Science student". With JavaScript off, `#root` has 0 children and there is no `<noscript>`. |
| 5 | Confirmed | 12 `"#"` URLs (6 demo, 6 GitHub); no component reads them. Card "Live Demo" and GitHub buttons, hover "Demo"/"Code" and "View GitHub Profile" have no `href` or `onClick` (the only `onClick` in `Projects.tsx` is the category filter). `image` is never rendered. The company `ExternalLink` icons are bare icons. |
| 6 | Confirmed | Sidebar: `github.com/sahil-gowda`, `linkedin.com/in/sahil-gowda`, `leetcode.com/sahil-gowda`, `codechef.com/users/sahil_gowda`. Resume hyperlinks: `github.com/SahilAGowda`, `linkedin.com/in/sahil-a-gowda-551b32270`. Social links are defined in 5 files: Sidebar, Home, Connect, Contact, Certifications. Live status of the wrong URLs: unverifiable. |
| 7 | Confirmed | Home "4+ years" vs Skills "3+ years"; "7+ projects" vs 6 listed; "6+ achievements" vs 6; "3 hackathon wins" (no entry is a hackathon win); "2 national level" (1 entry); "800+ competitors beaten" (entry says top 100 of 800+ teams); "4+ certifications" (4); "5 coding platforms" counts GitHub and LinkedIn; LeetCode 500+ (site), 450+ (new PDF), 400+ (old PDF); HackerRank "Gold Badge" vs "5-Star Java"; CodeChef "3 Star Rating" vs resume "Active"; "100+ hours learning", "5+ tech stacks" unsourced; GDG "500+ participants" vs resume "50+ students". |
| 8 | Confirmed | Site: "Winner - GDG Quizzard" (2024). Both PDFs: 2nd place (old PDF: Apr 2024). |
| 9 | Confirmed | B.E. 2020-2024 overlaps PUC 2020-2022; SSLC "2007 - 2020". New PDF: B.E. 2022 - 2026 (Expected). PUC 89% and SSLC 97% appear on neither PDF. |
| 10 | Partly | Confirmed: platform "Udemy" and `verified: true` hard-coded on all 4 cards. Unknown: whether it is the exam credential. Old PDF says "AWS Certified Cloud Practitioner - Udemy 2024"; the new PDF drops the platform. |
| 11 | Confirmed | `Skills.tsx`: 27 skills with invented percentages and Beginner/Advanced/Expert badges (Java 95, VS Code 95, Tailwind 65 "Beginner"). None of Spring Batch, Elasticsearch, LangChain, LangGraph, RAG, Milvus, Pinecone, Redis, Nginx, FastAPI or the AWS services on the resume. |
| 12 | Confirmed | Projects: E-Commerce, AutoProof, SmartFlex, OMR Scanner, Weather, To-Do. SmartFlex is "In Progress" (last push 2025-07-26); its card lists React, TensorFlow.js, MediaPipe, WebRTC, but the repo is a Flask and Node health platform (meal-photo nutrition, bone-health predictor, pose-based workout form) with no React project files at the top level. The repo behind AutoProof is private. Nothing from DIATOZ. |
| 13 | Confirmed | Routes are `/` and `*` only; the section is `useState`. Mobile test: scrolled to 1500 px in Skills, opened the menu, chose Certifications; scrollY stayed 1500 (not reset). |
| 14 | Confirmed | Typewriter (name 100 ms per character, 500 ms pause, title 50 ms per character), about 4 s; hero stagger delays up to 3.4 s plus 0.6 s animation; 14 blurred orbs, 13 `animate-pulse`, 26 `hover:scale-*`, 10 `card-hover`; 0 `prefers-reduced-motion` rules in the built CSS. |
| 15 | Confirmed | Eight `<div>`s, `cursor: auto`, no role or handler; a real mouse click on one changed nothing. They also sit on top of content at 390 px. |
| 16 | Confirmed (judgement) | Screenshots: navy plus cyan (#00bfff) with glow, Poppins, identical rounded cards with the same hover. |
| 17 | Confirmed | At 1440x900 the `aside` is `position: static` and 797 px tall on a 2802 px page; after scrolling 1200 px its top is at -1200 px and the nav is out of view. Every section is `min-h-screen` (Contact is 946 px tall). `Skills.tsx` has its own wrapper. `.dark` holds an unrelated default-shadcn palette (white primary); `next-themes` is used only by `ui/sonner.tsx`. |
| 18 | Confirmed | Built CSS contains `bg-gradient-to-r` and `bg-gradient-to-br` only; there is no `-l`. |
| 19 | Confirmed | README is Lovable boilerplate (3 Lovable URLs); `lovable-tagger` in devDependencies and `vite.config.ts` (dev only: injects `data-lov-*`); package name `vite_react_shadcn_ts`; `placeholder.svg` and `src/App.css` unused. |
| 20 | Confirmed | knip: 43 unused files (40 of 49 `ui/*`, `App.css`, `use-mobile.tsx`, `Contact.tsx`), 35 unused dependencies plus `@tailwindcss/typography`. Both lockfiles were added in the same Lovable commit (2025-08-07) and never touched since; there is no `vercel.json` and no `packageManager` field, so which one Vercel uses is **undetermined**. |
| 21 | Confirmed | Poppins from the Google Fonts CDN (Lighthouse: render-blocking, est. 1,060 ms on mobile); no sitemap, canonical, JSON-LD, apple-touch-icon, manifest; `robots.txt` has no `Sitemap:` line; no `vercel.json` (live deep-link behaviour: unverifiable). |

## Found beyond the brief

- **N1** On mobile the fixed hamburger covers the first letters of the heading on 5 of 8 sections (Experience, Education, Projects, Achievements, Certifications) and collides with the pill on Contact.
- **N2** Hamburger has no accessible name and no `aria-expanded` (axe `button-name`, critical). With the menu closed, Tab visits 12 off-screen controls before the hero button. Focus rings do show (the browser default, checked in a screenshot), but they are not designed. No skip link. The first heading in DOM order is the sidebar `<h2>`; only Home has an `<h1>` (axe `page-has-heading-one` on the other 7 sections); the H1 is typed one character at a time and includes a literal "|" cursor.
- **N3** `--text-muted` #667b99 on card #131620 is 4.18:1 (AA needs 4.5). axe: 26 nodes at 1440, 18 at 390. Lighthouse accessibility is 90 on mobile.
- **N4** The icon-only GitHub buttons on project cards have no name (axe `button-name`, 6 nodes). The hover "Code" button uses `text-background` on `bg-background`, so its label is invisible until hover.
- **N5** shadcn buttons and inputs are 36-40 px high; all 29-30 interactive controls on Projects are under 44 px.
- **N6** `me.jpg` is 868x1156 px, 218 KB, displayed at most 384 px wide; Lighthouse estimates 192 KiB saving. No `srcset`, no width/height.
- **N7** One JS chunk (374 kB, 115 kB gzip) and one CSS file (87 kB, 14 kB gzip). Lighthouse: unused JS 52 KiB, unused CSS 11 KiB.
- **N8** Baseline `npm run lint` already fails: 3 errors (`command.tsx`, `textarea.tsx`, `tailwind.config.ts` `require`) and 7 warnings, all in `ui/*` or the Tailwind config. `tsc` passes (`strict` is off).
- **N9** `NotFound` calls `console.error` on every unknown URL. Dev console shows 2 React Router future-flag warnings. `vite.config.ts` has `host: "::"`, which fails to start where IPv6 is unavailable (it ran with `--host 127.0.0.1`).
- **N10** The real phone number is public on the site (`tel:` without country code) and in both PDFs.
- **N11** Phrases from your banned list are live: "passionate", "innovative", "intelligent web solutions", "Enthusiast", "Silicon Valley of India", "Let's build something great". The contact copy ("always interested in new opportunities") is close to an open-to-work banner.
- **Fine as is:** no horizontal overflow at 1440, 390 or 360 on any section; 0 console errors or warnings and 0 failed requests in the production build at 1440, 768 and 390.

## Site and old PDF against `resume-latest.pdf`

| Item | Site | resume-latest.pdf | Old PDF (`public/`) |
|---|---|---|---|
| Role line | "Full Stack Developer & AI/ML Enthusiast"; hero "Computer Science student" | Software Development Engineer | "Computer Science Engineer" |
| City | Bangalore | Bengaluru | Bengaluru |
| DIATOZ | absent | SDE May 2026 to present; SWE intern Oct 2025 to May 2026 | n/a |
| Samsung Prism | "Image Quality Assessment Intern", "2024 - Present" | absent | Research Intern, May 2024 to Nov 2024 |
| Avarista Nexus | Website Development Intern, Jun to Sep 2025, 25% and 30% metrics | absent | same dates and metrics |
| GDG | AI/ML Lead, 2023-2025, "500+ participants" | Tech Lead, GDSC, "50+ students", no dates | AI/ML Lead, GDSC Core Member |
| B.E. | 2020-2024, CGPA 9.25 | 2022-2026 (Expected), North Campus, CGPA 9.25/10 | no dates, CGPA 9.25 |
| PUC / SSLC | 89% (2020-2022) / 97% (2007-2020) | absent | absent |
| AWS | platform Udemy, 2024 | "AWS Certified Cloud Practitioner (2024)", no platform | "- Udemy 2024" |
| Selenium | "Introduction to Selenium", 2023 | "Selenium WebDriver with Java", Simplilearn, 2024 | "Intro to Selenium", 2024 |
| Other certificates | ML and Data Science (Udemy 2023); Intro to AI (Simplilearn 2023) | absent | ML and Data Science (Udemy 2024) |
| Quizzard | Winner, 2024 | 2nd place, 2024 | 2nd place, Apr 2024 |
| SIH | Participant, 2024 | Finalist, 2025 | absent |
| Site-only achievements | Code Red top 100 of 800+ teams; Don Bosco 2nd (2023); SIT Hackathon abstract; TCS TechBytes | absent | "selected in NMIT Hacks and SIT Hackathon" |
| LeetCode | 500+ | 450+ | 400+ |
| HackerRank / CodeChef | "Gold Badge" / "3 Star Rating" | 5-Star Java / "Active" | 5-star / absent |
| Projects | E-Commerce, AutoProof, SmartFlex, OMR, Weather, To-Do | Railway Reservation System (Java, Spring Boot, MySQL, Hibernate, JWT, 2024) | SmartFlex, RailEase |
| Skills | 27 with percentages; JS, React, Node, TensorFlow, OpenCV, Pandas | Spring stack, Elasticsearch, LangChain/LangGraph, RAG, Milvus/Pinecone, Redis, AWS services, JUnit | Java, Python, C; React, Flask; Pandas, OpenCV |
| Profile links | GitHub, LinkedIn, LeetCode, HackerRank, CodeChef | GitHub, LinkedIn, email only | adds IEEE Collabratec and X |

## Your Facts against `resume-latest.pdf`

1. Facts: "Samsung Prism Lab and Avarista Nexus internships ... dates and details come from resume-latest.pdf". The new resume contains neither; they exist only in the old PDF.
2. Facts: "GDG AI/ML lead". Resume: "Tech Lead, GDSC", mentored 50+ students, no dates.
3. Education years: the resume says 2022 to 2026 (Expected). The PDF was generated today (2026-10-06), so "Expected" may be stale.
4. Confidentiality: the resume names a client in the WhatsApp bullet and an internal agent by name. The Facts say never to name clients. The site copy will not repeat them, but a published PDF would.
5. Usable resume items missing from the Facts: report-query latency 1 s to 400 ms (60%), the UAT-versus-production migration-flag fix, and the Railway Reservation System project.
6. The Railway project's `[GitHub]` link goes to the profile root, not a repo. The closest public repo, `Train-Booking-App`, has 8 files (pom and docs, no `src/`) and its README mentions basic authentication, not JWT, RBAC or Hibernate, so the resume bullets cannot be backed with code.

## Project candidates

All visibilities and last-push dates come from the GitHub repo listing; READMEs were read from shallow clones. The repo "Website" field is not readable from this session, so "live demo" means a URL stated in the README.

| Repo | Last push | What it is | Live demo |
|---|---|---|---|
| Adya-Travels | 2026-09-30 | Static HTML/CSS/JS travel site, 16 files, no README | none |
| Meet-Transcriber-Extension | 2026-09-24 | Local-first Meet transcriber: Brave extension to a FastAPI backend, faster-whisper on CPU, Markdown output; `docs/HOW_IT_WORKS.md` has diagrams | none (runs locally) |
| GmailSage | 2026-09-24 | Inbox triage: rules first, LLM fallback (Groq), labels and archive, daily digest, undo log, cron every 15 min; Mermaid architecture, rule tests | none |
| PromptFlow | 2026-03-29 | Offline Windows app: speech to structured prompts (Tauri, React, Express, faster-whisper, TinyLlama/Phi-2); latest commit is "Initial commit" | none |
| thunder-cipher | 2026-04-29 | A single `index.html`, no README | none |
| study-eyes | 2026-01-09 | AI student-engagement monitoring (face and eye detection, behaviour classes, voice check), React/Vite/TS plus Python; 744-line README, paper and slides in repo | none found |
| Hirely | 2025-10-12 | React/TSX frontend plus `main.py`; no README; includes a collaborator's merged PR | none |
| Taskify | 2025-10-11 | Task manager: Express, PostgreSQL, JWT, vanilla JS and Tailwind; `render.yaml` | README lists two Render URLs (unverifiable here) |
| smart-flex | 2025-07-26 | "Smart Health Monitoring System": meal-photo nutrition (custom YOLOv5, per README), bone-health predictor (README claims 94% accuracy, unverified), pose-based workout guidance; Flask and Node | none |
| Optical-Mark-Recognition-OMR- | 2025-02-11 | OpenCV OMR scorer, 2 Python files and sample JPGs; no README; `__pycache__` committed | none |
| Hepatitis-Disease-Risk-Prediction | 2025-12-18 | UCI dataset, 6 models, Streamlit UI; README: "Learning ML + deployment, not medical accuracy" | none |
| EpicElectrons/AEGIS | 2025-12-07 | "AEGIS LEA Mobile App": Expo/React Native officer app plus Python backend; REPORT.md | none |
| SIH-Epic-Electrons/AEGIS- | 2026-02-21 | AEGIS: fraud and mule-account detection with geolocated intervention; Python backend, TS frontends, Neo4j guide, long docs | none |
| Train-Booking-App (extra) | 2024-09-18 | pom and docs only, no `src/`; Spring Boot, MySQL | none |

All 14 are public. The repo behind the site's "AutoProof" project is private, so no code link is possible for it.
