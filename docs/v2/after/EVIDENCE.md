# Phase 5 evidence

Supports the pull request. Raw data sits next to this file: `lighthouse-local.json` (all runs), `link-check.tsv`, and the screenshots (`*.webp`: home at three widths in both themes, the five case studies, search). The matching "before" material is in [`../before/`](../before/EVIDENCE.md).

## Method and limits

- **The Vercel preview could not be measured.** The container's network policy denies `*.vercel.app`, as in Phase 0. Every runtime number is local, from two setups: `vite preview` (the Phase 0 method: no compression, `no-cache` headers) and a small static server that sends `dist/` with brotli and the cache headers from `vercel.json`, which is closer to Vercel. The old site (`main@80c732a`) was rebuilt and measured on the second setup in the same session, so that pair is like for like.
- **Lighthouse 13.5**, default simulated throttling (mobile: 4x CPU, 1.6 Mbps, 150 ms RTT; desktop preset), median of 3 runs. Mobile runs vary a little: after, performance 99 in 6 of 6 runs, TBT 49 to 104 ms.
- **Tooling** (Playwright 1.56 with the pre-installed Chromium, axe-core 4.14, knip 5, Lighthouse) lives outside the repo. Nothing was added to `package.json` for it.
- **Not testable from here:** the `vercel.json` rewrite, clean URLs and redirects on Vercel itself; link previews on LinkedIn or Slack; real phones. AVIF was not produced (no encoder here); the portrait ships as WebP with a JPEG fallback.

## Lighthouse, median of 3

| Setup | Form | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | Transfer |
|---|---|---|---|---|---|---|---|---|---|---|
| Before, `vite preview` (Phase 0) | Mobile | 90 | 90 | 100 | 100 | 2.49 s | 2.57 s | 0 ms | 0 | |
| Before, `vite preview` (Phase 0) | Desktop | 97 | 96 | 100 | 100 | 0.77 s | 0.81 s | 0 ms | 0.084 | |
| Before, static server | Mobile | 91 | 90 | 100 | 100 | 2.42 s | 2.50 s | 0 ms | 0 | 375 kB |
| Before, static server | Desktop | 97 | 96 | 100 | 100 | 0.83 s | 0.83 s | 0 ms | 0.084 | 375 kB |
| **After**, `vite preview` | Mobile | 99 | 100 | 100 | 100 | 1.41 s | 1.73 s | 91 ms | 0 | 137 kB |
| **After**, `vite preview` | Desktop | 100 | 100 | 100 | 100 | 0.35 s | 0.39 s | 0 ms | 0 | 137 kB |
| **After**, static server | Mobile | 99 | 100 | 100 | 100 | 1.42 s | 1.72 s | 73 ms | 0 | 130 kB |
| **After**, static server | Desktop | 100 | 100 | 100 | 100 | 0.34 s | 0.39 s | 0 ms | 0 | 130 kB |

Targets (performance 90, accessibility 95, best practices 95, SEO 100, LCP under 2.5 s, CLS under 0.1, TBT under 200 ms) are met on both setups. Two things to read honestly:

- **TBT went up from 0 to about 70 to 90 ms on mobile.** The old site did all its work before its first paint at 2.4 s, so nothing was left to block afterwards. The new one paints at 1.4 s and finishes a little work after that. It is well inside the target.
- **The LCP element is text** (the hero paragraph), so there is no image to prioritise. The entrance animation used to hide the hero at opacity 0 and made Chrome pick a lower heading as LCP; it now only moves the text 8 px, so the paragraph counts from the first frame.

What moved the numbers: main JavaScript 374 to 281 kB (115 to 92 kB gzip), CSS 87 to 21 kB (14 to 5 kB gzip) once the unused shadcn components stopped inflating Tailwind's output, no Google Fonts request, the main font preloaded and self-hosted (34 kB), the second font dropped (inline code uses the system monospace), a 60-line theme provider in place of `next-themes` (no whole-page style recalculation after first paint), and no ambient animation.

## Build, lint, types

- `npx tsc --noEmit -p tsconfig.app.json` and `npm run build` are clean. The build prints the existing "browsers data is 16 months old" notice from `browserslist`, as `main` does.
- `npm run lint`: 3 errors and 7 warnings on `main`; now 0 errors and 1 warning (`ui/button.tsx`, a shadcn file I may not edit).
- Dependencies: 49 runtime and 17 dev before; 8 runtime and 15 dev after. 48 unused shadcn components, 2 unused hooks, `App.css`, `placeholder.svg` and `me.jpg` are deleted. knip finds no unused files; it still lists `@fontsource-variable/atkinson-hyperlegible-next`, which is used from the CSS `url()`.
- The cleanup commit is visually identical: 18 screenshots (home and two case studies, three widths, two themes) matched the previous commit pixel for pixel.

## Accessibility

- **axe-core: 0 violations** on 7 pages (home, five case studies, 404) in light and dark at 1440 and 390 px, and on the open search dialog in the same four combinations.
- **Rendered contrast:** every visible text element was measured against its real background: 0 failures across 28 page, theme and width combinations (about 160 elements on the home page). Token pairs: smallest text ratio 5.13:1 (light) and 6.35:1 (dark); smallest graphic ratio 3.18:1 where 3:1 is required (the career strip's study bar on its track). Highlighted search hits force the foreground colour, so they hold over links and muted text.
- **Keyboard-only walkthrough:** the skip link is the first stop; the home page has 33 stops in reading order (name, six section links, Search, Light, Dark, hero actions, the case-study links, repositories, certificate, coding profiles, contact actions); every one shows a 2 px ring (an outline, or a ring on buttons). Esc closes the menu and the search and clears highlights; the search traps focus and hands it back to its button.
- **Targets:** no control is under 44 px except the two in-sentence links in the hero paragraph.
- **Landmarks and headings:** one banner, labelled navs ("Sections", "More case studies"), one main; headings never skip a level and each page has one h1.
- **Reflow:** no horizontal scroll from 320 to 1920 px on the home page and two case studies (13 widths).
- **Reduced motion:** the hero animation is `none` and `scroll-behavior` is `auto`; with motion on there is one 400 ms settle.
- **Language and alt text:** `lang="en"`; the portrait has alt text; each diagram is a `role="img"` with a title and a description.

## Behaviour checks

All pass on the final build: skip link first; rail and menu links land on the heading with focus moved to the section; scroll-spy marks Contact at the page bottom; the rail stays put; Light and Dark persist across reload with no flash; Copy email puts the address on the clipboard and says so; external links carry `noopener noreferrer`; no empty or `#` hrefs and every button has a handler; the phone menu opens, closes on selection and on Esc and returns focus; the 404 page and deep links work; "Back to work", "Next case study" and the browser Back button behave and restore scroll; search opens with the button and `/`, finds terms in every section, jumps to the right block, highlights hits, clears with the notice or Esc without moving the page, and says "No mention of" for a miss. Also checked with induced faults: a case-study file that fails to load (reload once, then an error page inside the shell), a search file that fails (the page stays up), a malformed hash such as `#100%`, and the career strip with the clock set to 2027 and 2028 (bars stay in their track).

## Console

0 errors or warnings at 1440, 768 and 390 px, in both themes, on the home page and the case studies, on fresh loads. One caveat: `vite preview` sends `Cache-Control: no-cache`, and with that header Chrome can log "preloaded font not used" when the same tab loads pages back to back. The static server (and Vercel, with the `immutable` header in `vercel.json`) does not trigger it.

## Links

`link-check.tsv`: 40 links. 35 are fine (the GitHub profile and both public repositories answer 200; all internal routes, hash targets, the PDF, icons, manifest, `robots.txt` and the six sitemap URLs answer 200). 5 are unverifiable from here because they returned HTTP 403: LinkedIn, the Google Drive certificate, LeetCode, HackerRank and CodeChef. None is known to be broken.

## The 21 findings

| # | After v2 |
|---|---|
| 1 | Fixed. No form: Email me opens the mail client, Copy email copies the address. No success message that is not true. |
| 2 | Fixed in code: Open resume opens the PDF in a tab, and the old URLs redirect to it. **Open item:** the PDF is the file you sent (see Open items). |
| 3 | Fixed. DIATOZ comes first with the resume's dates; Samsung Prism, Avarista and the old GDG lead entry are gone, as you asked. |
| 4 | Fixed. Title, description, canonical, Open Graph and Twitter tags, a designed 1200 x 630 card, JSON-LD, `<noscript>` text, and a static head for each case study. |
| 5 | Fixed. Links and buttons exist only where there is a target; no `#` hrefs. |
| 6 | Fixed. One source (`src/data/profile.ts`). GitHub verified; the others unverifiable from here. |
| 7 | Fixed. No counters. Every number has a source line (`docs/v2/SOURCES.md`). |
| 8 | Fixed. "2nd place" (resume). |
| 9 | Fixed for the B.E.: 2022 to 2026, graduated May 2026 (your answer). **Open item:** school years and marks come from the old site. |
| 10 | Fixed. "Course certificate", no badge. |
| 11 | Fixed. Grouped lists, no levels. |
| 12 | Fixed. Seven projects, five with case studies. |
| 13 | Fixed. Real routes, hash sections, working Back button, deep links. |
| 14 | Fixed. One 400 ms settle, nothing else moves, reduced motion respected. |
| 15 | Fixed. The flowline is the navigation: real links with scroll-spy. |
| 16 | Replaced with the Flowline design (`docs/v2/DESIGN_PLAN.md`). |
| 17 | Fixed. Sticky rail, sections sized by content, one section wrapper, a Light and Dark toggle. |
| 18 | Fixed. The layout that built class names dynamically is gone. |
| 19 | Fixed. README, package name, `lovable-tagger`, `placeholder.svg`, `App.css`. No Lovable text in the build output or the tracked files outside `docs/`. |
| 20 | Fixed for the dependencies. **Open item:** both lockfiles are kept; `bun.lockb` was regenerated to match. |
| 21 | Fixed. Self-hosted font with preload, sitemap, canonical, JSON-LD, touch icon, manifest, `vercel.json` with a rewrite for deep links. |

Beyond the brief (Phase 0): the phone menu no longer covers headings and has a name, a skip link exists, contrast passes, tap targets are 44 px, the portrait is 29 kB as JPEG, or 9 kB as WebP on most screens, instead of 218 kB, and lint is clean outside one shadcn file. The phone number is no longer on the page, but it is still in the PDF.

## Update, 9 October: case-study pages, 3D diagrams, search position

Asked for after the first review (the changes are listed in the pull request and in the revision note at the end of [`../DESIGN_PLAN.md`](../DESIGN_PLAN.md)). This section holds the measurements. Same limits as above: local only, software WebGL only.

**Cost.** Main JavaScript 281.4 to 284.6 kB (92.0 to 93.0 kB gzip), CSS 21.2 to 23.8 kB (5.3 to 5.8 kB gzip). three.js and the scene are one chunk, `Flow3D-*.js`: 608.8 kB, 156.3 kB gzip, 128.8 kB brotli. It is requested only on a case-study page, when the diagram is within 400 px of the viewport and the browser is idle, and never on the home page. One more runtime dependency (`three`) and one more dev dependency (`@types/three`); `package-lock.json` and `bun.lockb` were both regenerated, and `bun install --frozen-lockfile` passes.

**Lighthouse, median of 3** (the static server with brotli and the `vercel.json` cache headers; the Phase 5 method):

| Page | Form | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | Transfer |
|---|---|---|---|---|---|---|---|---|---|---|
| Home | Mobile | 99 | 100 | 100 | 100 | 1.35 s | 1.80 s | 44 ms | 0 | 132 kB |
| Home | Desktop | 100 | 100 | 100 | 100 | 0.32 s | 0.41 s | 0 ms | 0 | 132 kB |
| GmailSage, flat diagram | Mobile | 99 | 100 | 100 | 100 | 1.45 s | 2.00 s | 0 ms | 0 | 141 kB |
| GmailSage, flat diagram | Desktop | 100 | 100 | 100 | 100 | 0.35 s | 0.45 s | 0 ms | 0 | 141 kB |
| Ingestion pipelines, flat diagram | Mobile | 99 | 100 | 100 | 100 | 1.45 s | 1.99 s | 0 ms | 0 | 141 kB |
| Ingestion pipelines, flat diagram | Desktop | 100 | 100 | 100 | 100 | 0.35 s | 0.45 s | 0 ms | 0 | 141 kB |
| GmailSage, software WebGL on | Mobile | 99 | 100 | 100 | 100 | 1.45 s | 1.99 s | 0 ms | 0 | 141 kB |
| GmailSage, software WebGL on (the 3D chunk loads) | Desktop | 100 | 100 | 100 | 100 | 0.42 s | 0.55 s | 80 ms | 0 | 285 kB |

The home page moved only a little against the Phase 5 numbers (mobile LCP 1.72 to 1.80 s, TBT 73 to 44 ms, transfer 130 to 132 kB; desktop LCP 0.39 to 0.41 s). Lighthouse starts Chrome with `--disable-gpu`, which blocks WebGL, so the "flat diagram" rows measure the fallback. The two "software WebGL on" rows turn it on (SwiftShader). On a phone the diagram starts below the fold, so the 3D chunk is not fetched during the load (141 kB, as with the flat diagram); on desktop the diagram is in view, so the chunk loads once the browser is idle (285 kB) and TBT is 80 ms (runs: 76, 80, 129).

A first version also loaded the chunk 400 px ahead of the diagram on phones. With software WebGL on, Lighthouse mobile then gave performance 83 and TBT 639 ms, so on a phone the load now waits until the diagram is actually in view. To measure what that costs when it does happen, I scrolled a phone-sized page (412 x 823, device pixel ratio 2, CPU slowed 4x) to the diagram after the page had gone idle: the chunk arrived in about 0.2 s on this machine and the scene was ready 0.5 s after the scroll, with 2 long tasks (198 ms of blocking time in total, the longest 156 ms; median of 3). The software renderer mostly runs outside the page's main thread, so I read that figure as parsing and building the scene (a phone's CPU would do the same) with the drawing left to its GPU. That reading is my inference; I could not test on a phone.

**Accessibility**
- **axe-core: 0 violations** in 64 runs: the home page and the five case studies, each case study in three states (3D, 3D with a step selected, flat with a step selected), light and dark, at 1440 and 390 px. The only "needs review" item is colour contrast of text over SVG or WebGL, which is measured next.
- **Rendered contrast of the 3D labels:** for 252 labels (five case studies, both themes, both widths) the pixels under each label were read from a screenshot of the scene with the labels hidden, and compared with the label's text colour (edge labels and captions on their 82% plate-coloured pill). The worst tenth of the pixels behind any label is 4.56:1; the threshold is 4.5:1. Two things were fixed on the way: node second lines use the foreground colour (the muted grey measured about 3:1 over the tinted faces), and the dark tint is a little lower (one label measured 4.40:1).
- **Keyboard:** a case-study page has 28 tab stops in reading order (skip link, name, six section links, Light, Dark, Search, Back to work, the in-page links, the four 3D controls and the view toggle, six step buttons, two links at the end). All show a ring. The canvas is not a tab stop; turning, resetting, pausing and stepping work from the keyboard, and a status region announces the selected step.
- **Motion:** after "Pause the flow" no frame is drawn (0 frames in 1.5 s, against 57 while playing). Under reduced motion the page starts on the flat diagram, the home page has no dots, and the 3D view, if chosen, skips its intro and starts paused.
- **Touch:** the canvas sets `touch-action: pan-y`, so a horizontal drag turns the diagram and a vertical swipe still scrolls the page.

**Behaviour checks** (all pass): hover over a block gives a pointer cursor; clicking a block selects its step; step buttons set `aria-pressed` and clear on a second press; Turn left and right, Reset view and dragging all change the view; the flat toggle removes the canvas, and a step still dims the rest of the flat diagram; the 3D view comes back. Fallbacks, each with a clean console: no WebGL (flat diagram, says why, no 3D controls), a lost context (flat diagram, canvas removed), reduced motion (flat first, opt in to 3D), and a chunk that fails to load (flat diagram and the steps still work; the console shows the failed request and the page's own "The 3D view could not be loaded" error). Search finds the new content (`invalid_scope`, `heap`, `timeout`, `List-Unsubscribe`) and highlights it on the page. On the home page the dots start when a diagram is in view and stop by themselves (0 moving at 8 s). The Search button's right edge matches the content edge at 1024, 1280 and 1440 px, and switching Light and Dark recolours a live 3D scene without a reload.

**What I could not test:** a real GPU, a real phone (frame rate, heat and battery under the 3D view), and the Vercel preview, which is also the first build with the new dependency.

## Open items for Sahil

1. **Resume PDF.** `public/Sahil-A-Gowda-Resume.pdf` is the file you sent. It still says "B.E. ... (Expected)" and "AWS Certified Cloud Practitioner (2024)", and it contains your phone number (+91-9945886311), so publishing the PDF publishes the number. Send a corrected PDF, or tell me to edit it.
2. **Facts I could not confirm.** PUC 89%, SSLC 97% and the school names and years (from the old site); the Google Drive certificate link; LeetCode, HackerRank and CodeChef figures (the site shows links only, because those pages were unreachable). LinkedIn, LeetCode, HackerRank, CodeChef and Drive could not be checked from here.
3. **The DIATOZ case studies hold only what the resume and your Facts say.** Each page now has places for "How I approached it" and "Blockers and how I got past them", but only these are filled: ingestion pipelines (one blocker, the heap), report search (two: the production timeout, then the audit mechanism), and nothing for the RAG chatbot and the WhatsApp agent, so that section is left out instead of padded. Send three to five lines per project in your words, inside the confidentiality line (what was hardest, what you tried that did not work, why you chose one thing over another) and they go into `src/data/caseStudies.ts`; I can write them in. Please also check that the RAG and WhatsApp diagrams and steps show the standard order, not necessarily yours, and the Excel line: the site says "streaming with Apache POI SXSSF" (the resume says "streaming read"; SXSSF is POI's streaming writer).
4. **GmailSage's README disagrees with its code.** The README says 12 categories, "80% hit", 16 newsletter domains and a digest of `high` mail only. The code has 13 categories, 13 newsletter domains and a digest of high plus non-"other" medium mail, and nothing measures the 80%. The site follows the code. On 9 October I also corrected five statements on the GmailSage page that the code did not support (they are listed in `SOURCES.md`); for example "every action can be undone" now reads "archiving can be undone".
5. **Lockfiles.** I kept both and regenerated both for the new `three` dependency. Tell me which one Vercel should use and I will remove the other.
6. **Checks on the Vercel preview.** I could not open it. Please try `/projects/gmailsage` directly, `/resume.html` and the old PDF URL (both redirect to the new PDF), and read the build log's "Installing dependencies" line. Preview deployments send `noindex`, so Lighthouse SEO on a preview URL flags "blocked from indexing"; production will not.
7. **A client name.** The experience bullet names the client because the resume does; the case-study pages do not. Remove it in `src/data/experience.ts` if you would rather not.
8. **After the merge:** refresh the LinkedIn preview with LinkedIn Post Inspector (LinkedIn caches link previews), and check whether the Lovable project is still connected to this repository, since a connected project can push over `main`.
9. **The 3D view on a real phone.** I could only test it with software WebGL. Open a case study on your phone and check that the diagram turns smoothly and the page still scrolls past it. If it stutters, tell me and I will start phones on the flat diagram (it is a one-line change in `FlowDiagram.tsx`).
