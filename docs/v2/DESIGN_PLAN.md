# Portfolio v2: design plan

Phase 2, plan pass. No code was written for this step. Phase 1 (data layer and content) is already committed, so the copy below is the real copy. Pick one direction, or merge two, at Checkpoint B.

How to read the wireframes: `[ text ]` is a button, `o` is a flowline node, `[word]` in Query is a highlighted match, `( Database )` is a data store. Every number on a wireframe comes from `src/data`.

## Shared by all three directions

- **Reader and goal.** A recruiter at a product company with about 60 seconds, and an engineer who opens one project to check the depth is real. The first screen says who you are, what you built at scale, and shows proof (numbers, diagrams, links).
- **Structure.** One scrolling page at `/` with hero, experience, selected work, skills, credentials and contact, and a scroll-spy nav. Real routes `/projects/:slug` for the five case studies, a styled not-found page, and a `vercel.json` rewrite so deep links work. Hash links and scroll restoration work.
- **Tokens.** HSL variables in `index.css` (`--background`, `--foreground`, `--primary`, `--muted-foreground`, `--border`, `--ring`) so the shadcn Button, Badge, Card, Input, Toast and Tooltip keep working. Tailwind's `fontFamily` points at the chosen families.
- **Fonts.** Self-hosted variable fonts from `@fontsource-variable/*` (the pre-approved dependency), the Latin file only, `font-display: swap`, primary face preloaded. All sizes below are measured from the packages. Tabular figures (`tnum`) exist in every body face proposed (checked in the font files).
- **Motion.** At most one entrance (400 ms, opacity and an 8 px move on the hero block, never hiding content behind a delay). Hover, focus and press feedback are fine. Nothing ambient or looping. Everything switches off under `prefers-reduced-motion`.
- **Quality floor.** 360 to 1920 px with no horizontal scroll, 44 px tap targets, AA contrast (ratios below are computed from the hex values), a 2 px focus ring, a skip link, landmarks, no transition delay on navigation.
- **Imagery.** `me.jpg` stays, shown at 96 px wide with no frame effects, converted to AVIF and WebP in Phase 4. Nothing else is invented. Diagrams are drawn only from sourced facts; where the sources do not name a component it is drawn generically ("Database").

## At a glance

| | A. Flowline | B. Marginalia | C. Query |
|---|---|---|---|
| The one memorable thing | The nav is a flowline through the page, and every project is drawn in one diagram language | Every number has a receipt in the margin | The site is searchable; hits highlight in place and a miss says so |
| Type | Atkinson Hyperlegible Next, Mono for code only (52 kB) | Source Serif 4 and Instrument Sans (81 kB) | Schibsted Grotesk (47 kB) |
| Palette | Cool paper, ink, three colours that mean flow, store and model | Near-white paper, ink, indigo links | Near-white paper, ink, highlighter yellow |
| Theme | Light and dark, equal polish | Light only, on purpose | Light only, on purpose |
| Diagrams on the home page | Yes, the work rows are led by them | No, case studies only | No, case studies only |
| Main risk | Compact diagrams must stay legible at 300 px | Margin notes on a phone | Visitors may ignore a search box |
| Build cost | Medium: rail plus a diagram system (5 full and 5 compact SVGs) | Medium: the sidenote layout | Medium: search index plus highlights |

---

## Direction A: Flowline

**Idea.** The page is a pipeline you scroll through. A thin line runs down the left with a node for each section; the node for the section you are in is filled. Every project is drawn in the same small diagram language, so the home page and the case studies read as one system.

### Palette

| Name | Light | Dark | Role |
|---|---|---|---|
| paper | `#F6F7F4` | `#0F1418` | page background |
| ink | `#15191C` | `#E8ECEF` | text (16.4:1 light, 15.6:1 dark) |
| muted | `#566069` | `#9BA6AF` | secondary text (6.0:1, 7.5:1) |
| flow | `#1D4ED8` | `#7FA6FF` | links, focus ring, the flowline, processing nodes (6.2:1, 7.8:1) |
| store | `#B45309` | `#F0A45D` | data stores in diagrams (4.7:1, 9.0:1) |
| model | `#6D28D9` | `#B9A0FF` | LLM, embedding and reranking nodes (6.6:1, 8.4:1) |

Diagram nodes are outlined, not filled: ink on a solid fill of any of the three colours measures 2.5 to 3.5:1 in light, which fails 4.5:1. Labels stay ink on a 10% tint of the stroke colour. Colour is never the only cue; the shapes differ too (box, cylinder, diamond).

### Type

- **Atkinson Hyperlegible Next** (variable, 200 to 800) for everything. **Atkinson Hyperlegible Mono** only for inline code such as `liquibase.enabled`. Tabular figures on for numbers.
- Scale, ratio 1.25 from 17 px: 14 caption, 17 body, 21 lede and h3, 26 h2 on phones, 33 h2, 41 h1 on phones, 52 h1. Weights 400 body, 600 headings, 700 the name.
- Body measure 64ch, so lines stay under 80 characters; line height 1.6 body, 1.15 headings.
- Why: it is built around distinct letterforms (I, l and 1; O and 0 do not blur), which helps when the text carries identifiers, and it is rare in portfolios. Latin files measured at 34.0 kB (sans) and 17.8 kB (mono).

### Layout

- At 1024 px and wider: a 208 px sticky rail (name, six nodes, theme toggle) and a 720 px main column. Diagrams may run to 880 px.
- Below 1024 px: a 56 px top bar with the name and a text button "Menu" (44 px) that opens the node list; the flowline stays as a 2 px line in a 16 px left gutter with a dot at each section heading.
- Work is one row per project: a compact diagram on the left, text on the right (stacked below 768 px). Only the five case-study projects get a diagram; the two compact projects are text rows with a repository link.
- Scroll-spy uses IntersectionObserver; the active node changes instantly.

### Wireframes

Hero, 1024 px and wider:

```
+--------------------------------------------------------------------------+
|  Sahil A Gowda     |                                                     |
|                    |  Backend and AI engineer                            |
|  o About           |                                                     |
|  |                 |  I build data pipelines, search and RAG systems.    |
|  o Experience      |                                                     |
|  |                 |  I'm a software development engineer at DIATOZ in   |
|  o Work            |  Bengaluru, building Java backends and applied-AI   |
|  |                 |  systems. I built a Spring Batch pipeline that      |
|  o Skills          |  ingests about 273 million records and an           |
|  |                 |  Elasticsearch read path that cut report queries    |
|  o Credentials     |  from 4-5 s to 400 ms.                              |
|  |                 |                                                     |
|  o Contact         |  [ Email me ]  [ Open resume ]   LinkedIn   GitHub  |
|                    |                                                     |
|                    |  [photo 96 x 120]                                   |
|  Theme: Light Dark |                                                     |
+--------------------------------------------------------------------------+
```

A project row (compact diagram, 300 px; the full diagram is on the case-study page):

```
+--------------------------------------------------------------------------+
|  +-----------------+                 |  Ingestion pipelines at 273       |
|  | Excel files     |                 |  million records                  |
|  +--------+--------+                 |  Built at DIATOZ                  |
|           | about 273M records       |                                   |
|  +--------v--------+                 |  A Spring Batch pipeline ingests  |
|  | Spring Batch    |                 |  about 273 million records with   |
|  | multithreaded   |                 |  multithreaded workers and JDBC   |
|  +--------+--------+                 |  batch inserts. A second          |
|           | JDBC batch inserts       |  pipeline validates Excel         |
|  +--------v--------+                 |  workbooks against 14+ rules.     |
|  | ( Database )    |                 |                                   |
|  +-----------------+                 |  Java, Spring Batch, JDBC,        |
|                                      |  Apache POI                       |
|                                      |  Read case study                  |
+--------------------------------------------------------------------------+
```

Case-study page:

```
+--------------------------------------------------------------------------+
|  Back to work                                                            |
|                                                                          |
|  Ingestion pipelines at 273 million records                              |
|  Built at DIATOZ. Java, Spring Batch, JDBC, Apache POI.                  |
|                                                                          |
|  +--------------------------------------------------------------------+  |
|  |  Full diagram, inline SVG, 880 px wide                             |  |
|  |  shapes: box = job or service, cylinder = store, diamond = model   |  |
|  |  colour: blue = flow, amber = store, violet = model (never alone)  |  |
|  +--------------------------------------------------------------------+  |
|                                                                          |
|  Outcome       One sentence with the number.                             |
|  Problem       What broke or was slow, in plain words.                   |
|  Constraints   What the design had to respect.                           |
|  Decisions     A  Decision, and the trade-off it cost.                   |
|                B  Next decision, same shape.                             |
|  Results       Verified numbers only.                                    |
|  Stack         Java, Spring Batch, JDBC, Apache POI                      |
|  Links         Only real, public ones. Omitted when there are none.      |
+--------------------------------------------------------------------------+
```

### The one memorable thing

The flowline and the diagram grammar. The rail is both the nav and the progress indicator, and the five diagrams share one set of rules: box for a job or service, cylinder for a store, diamond for a model call; blue, amber and violet repeat those meanings; an arrow that carries a sourced number says it ("about 273M records").

### Deliberately quiet

No cards, shadows, gradients or icons (apart from the theme toggle). One 1 px frame, around diagrams only. Hover thickens the underline, press moves 1 px. The only entrance is the hero block fading in over 400 ms.

### Light and dark

Both, with equal polish. The system setting decides first; a toggle in the rail and the menu overrides it through `next-themes` (the class strategy already matches the Tailwind config). Diagram colours are CSS variables, so one SVG serves both themes. I will review screenshots of both at three widths before calling it done.

### Review against the generic defaults

| Default | Result |
|---|---|
| Warm cream, serif, terracotta | Absent: cool paper, sans, no terracotta. |
| Near-black with one acid-green or vermilion accent | Dark uses three colours that carry meaning, none acid. First draft had a single cyan accent on dark; replaced. |
| Broadsheet hairline layouts | First draft ruled every section; removed. Only diagrams have a 1 px frame. |
| Identical rounded cards, soft shadows, gradient washes | No cards. First draft used thumbnail cards; now rows, and the diagrams differ. |
| A stat-tile row | None. The numbers sit in prose and in case-study results. First draft had a three-number row in the hero; removed. |
| Tracked all-caps eyebrow above headings | None; section titles are plain sentence-case headings. |
| Middle-dot meta strings | None; meta uses commas and separate lines. |
| "WORD - fragment" labels | None. |
| "→" appended to links | None; link text names the action ("Read case study"). First draft had arrows; removed. |
| Gradient text, one accented word in a headline | None. |
| Monospace for labels that are not code | Mono only for inline code. First draft set diagram labels in mono; now the sans. |
| 01/02/03 numbering | None. Diagram callouts use letters A, B, C as references, not a sequence. First draft numbered the nodes; changed. |
| Typewriter, floating orbs, glow, hover scale | None. First draft filled the flowline with an animation as you scroll; now an instant state change. |

---

## Direction B: Marginalia

**Idea.** A short engineering design doc: one text column and one margin column. Every number on the page has a receipt in the margin saying what it measures and where it comes from. The type is the design.

### Palette

| Name | Value | Role |
|---|---|---|
| paper | `#F9F9F7` | page background |
| ink | `#15171A` | text (17.0:1) |
| quiet | `#5A6068` | margin notes and captions (6.0:1) |
| link | `#2A3BC9` | links and focus ring (7.8:1) |
| panel | `#EEF0F4` | diagram background only (ink 15.7:1, quiet 5.6:1, link 7.2:1 on it) |

### Type

- **Source Serif 4** (variable, 200 to 900) for text and headings. **Instrument Sans** (variable, 400 to 700) for margin notes, nav, buttons and captions. Tabular figures exist in both.
- Scale, ratio 1.333 from 18 px: 14 notes (sans), 18 body, 24 lede and h3, 32 h2, 43 h1 on phones, 57 the name on desktop. Weights 400 body, 600 headings and the numbers in the margin.
- Body measure 60ch (about 36rem), so lines stay under 80 characters. Line height 1.65 body.
- Why: a text serif that holds up at 18 px on screens, whose tabular figures keep numbers aligned; the sans stays out of its way at small sizes. Latin files measured at 50.8 kB and 30.1 kB.

### Layout

- A sticky 56 px header: name on the left, five text links on the right, and a single 1 px rule under it (the only rule on the page).
- Text column 36rem, margin column 15rem, 3rem gap, from 1100 px up. Below 900 px the notes sit inline beneath their paragraph with a 2 px left border; nothing scrolls sideways.
- Work is a list of entries (title, one-line outcome, stack in the margin, "Read case study"). Skills are a definition list with the group name in the margin. Credentials are a short list.

### Wireframes

Hero, 1100 px and wider:

```
+--------------------------------------------------------------------------+
|  Sahil A Gowda           Experience  Work  Skills  Credentials  Contact  |
|  ----------------------------------------------------------------------  |
|                                                                          |
|  Backend and AI engineer                                                 |
|                                                                          |
|  I build data pipelines,               Now                               |
|  search and RAG systems.               Software development engineer     |
|                                        at DIATOZ, Bengaluru, since       |
|  I'm a software development            May 2026.                         |
|  engineer at DIATOZ in Bengaluru,                                        |
|  building Java backends and            273 million                       |
|  applied-AI systems. I built a         Records one Spring Batch          |
|  Spring Batch pipeline that            pipeline ingests (DIATOZ          |
|  ingests about 273 million             internship). Read the case        |
|  records and an Elasticsearch          study.                            |
|  read path that cut report                                               |
|  queries from 4-5 s to 400 ms.         4-5 s to 400 ms                   |
|                                        Report-query latency after        |
|  Email me     Open resume              Elasticsearch indexing.           |
+--------------------------------------------------------------------------+
```

A project entry (no card):

```
+--------------------------------------------------------------------------+
|                                                                          |
|  Report search on Elasticsearch        Built at DIATOZ                   |
|                                                                          |
|  Report APIs serve multi-filter        Spring Boot, Elasticsearch,       |
|  analytics over millions of            PostgreSQL                        |
|  records. Elasticsearch indexing                                         |
|  cut query latency from 4-5 s to       400 ms                            |
|  400 ms while PostgreSQL stays         Query latency after indexing,     |
|  the source of truth.                  down from 4-5 s.                  |
|                                                                          |
|  Read case study                                                         |
|                                                                          |
+--------------------------------------------------------------------------+
```

Case-study page:

```
+--------------------------------------------------------------------------+
|                                                                          |
|  Report search on Elasticsearch                                          |
|  Reads go to Elasticsearch, writes stay in PostgreSQL, and an audit      |
|  keeps the two honest. (lede, 24 px serif)                               |
|                                                                          |
|  Problem                                    Context                      |
|  Plain-language paragraph about the         Built at DIATOZ.             |
|  slow, multi-filter report queries.         Spring Boot, Elasticsearch,  |
|                                             PostgreSQL.                  |
|  +--------------------------------------------------------------------+  |
|  | Figure 1, wide panel: client > REST API > Elasticsearch (reads);   |  |
|  | PostgreSQL (source of truth); async update path; audit check.      |  |
|  +--------------------------------------------------------------------+  |
|  Figure 1. Reads and writes take different paths.                        |
|                                                                          |
|  Decisions                                  Receipt                      |
|  Paragraphs with the trade-offs.            4-5 s to 400 ms: owner's     |
|                                             account of the work.         |
|  Results                                                                 |
|  Verified numbers only.                                                  |
+--------------------------------------------------------------------------+
```

### The one memorable thing

Receipts. Each number (273 million records, 14+ rules, 4-5 s to 400 ms, 50+ students, CGPA 9.25) is set in the serif's tabular figures at weight 600 and has a margin note naming what it measures and its source: a case study or the resume. It turns "no invented facts" into something a visitor can see.

### Deliberately quiet

No cards, icons, shadows or colour other than the indigo links. One rule. One filled button ("Email me"); everything else is a text link.

### Light and dark

Light only, on purpose. The serif weights, the balance of the margin notes and the figure panels are tuned for dark on light. A dark theme needs a second typographic pass because light text on dark reads heavier, and I would rather not ship it half-tuned. The page declares `color-scheme: light` so scrollbars and form controls do not flip.

### Review against the generic defaults

| Default | Result |
|---|---|
| Warm cream, serif, terracotta | The serif made this the riskiest. First draft was warm paper with terracotta links, which is exactly the default; changed to near-neutral paper and indigo links. |
| Near-black with one acid accent | Not applicable; light only. |
| Broadsheet hairline layouts | A margin column echoes a newspaper. First draft ruled above every section and between the columns; removed. One rule under the header. |
| Identical rounded cards | None; entries are text. |
| A stat-tile row | First draft boxed the margin numbers as tiles; now plain note text with the figure set in the serif. |
| Tracked all-caps eyebrow | First draft labelled margin notes in small caps; now a plain lead-in (the number itself). |
| Middle-dot meta strings | None. |
| "WORD - fragment" labels | None; the margin label "Now" is a word followed by sentences. |
| "→" appended to links | None. |
| Gradient text, one accented word | None. |
| Monospace for labels that are not code | No mono face; inline code is Instrument Sans Medium on the panel tint. |
| 01/02/03 numbering | Only "Figure 1", "Figure 2" captions, which are a real sequence. |
| Typewriter, orbs, glow, hover scale | None. |

---

## Direction C: Query

**Idea.** The site is an index you can search, because search is part of your work. Press `/` (or tap Search) to find any term across experience, work, skills and credentials. Matches highlight in place like search hits, and a term that is not on the site gets a plain answer.

### Palette

| Name | Value | Role |
|---|---|---|
| paper | `#FBFBFA` | page background |
| ink | `#101216` | text (18.1:1) |
| quiet | `#596070` | secondary text (6.1:1) |
| field | `#EEF0F4` | search field background (ink 16.4:1, quiet 5.5:1) |
| hit | `#FFE066` | highlighter: a background behind ink text only (ink on hit 14.4:1) |

`hit` measures 1.26:1 against paper, so it is never text and never the only focus cue. Links are ink and underlined; hover and focus add the highlighter background, and focus adds a 2 px ink outline.

### Type

- **Schibsted Grotesk** only (variable, 400 to 900). Tabular figures exist.
- Scale, ratio 1.3 from 17 px: 14 small, 17 body, 22 lede, 29 h2, 37 h1 on phones, 48 h1 on desktop. Weight 700 for headings with -0.01em tracking above 29 px. Body measure 62ch, so lines stay under 80 characters.
- Why: a grotesque with more character than the usual defaults but no decorative quirks, and one family keeps the payload to 46.8 kB.

### Layout and search behaviour

- A single 40rem column. Sticky 56 px header: name, five nav links (wrapping to a second row on phones) and a Search button. The search field sits under the hero and spans the column.
- Search runs in the browser with no dependency: it matches terms across the `src/data` fields (skills weigh most, then bullets and project summaries) and lists up to six hits, each with the section name on its own line and a snippet below. Enter jumps to the first hit, Esc clears, `?q=` keeps the search in the URL, `/` focuses the field unless a field already has focus, and the count is announced politely to screen readers.
- Rows that do not match dim but stay where they are, so nothing jumps. A term that is not on the site gets: "No mention of 'x' on this site."

### Wireframes

Hero (all widths):

```
+--------------------------------------------------------------------------+
|  Sahil A Gowda           Experience  Work  Skills  Credentials           |
|  Backend and AI engineer, Bengaluru                                      |
|                                                                          |
|  I build data pipelines, search and RAG systems.                         |
|                                                                          |
|  I'm a software development engineer at DIATOZ in Bengaluru,             |
|  building Java backends and applied-AI systems. I built a                |
|  Spring Batch pipeline that ingests about 273 million records            |
|  and an Elasticsearch read path that cut report queries from             |
|  4-5 s to 400 ms.                                                        |
|                                                                          |
|  +--------------------------------------------------------------+        |
|  | Search this site                                          /  |        |
|  +--------------------------------------------------------------+        |
|  Try  Spring Batch   Elasticsearch   RAG   WhatsApp                      |
|                                                                          |
|  [ Email me ]  [ Open resume ]                                           |
+--------------------------------------------------------------------------+
```

A project entry while a search is active:

```
+--------------------------------------------------------------------------+
|  +--------------------------------------------------------------+        |
|  | elasticsearch                                            Esc |        |
|  +--------------------------------------------------------------+        |
|  4 matches: Experience 2, Work 1, Skills 1                               |
|                                                                          |
|  Report search on Elasticsearch                   Built at DIATOZ        |
|  Report APIs serve multi-filter analytics over millions of               |
|  records. [Elasticsearch] indexing cut query latency from 1 s            |
|  to 400 ms while PostgreSQL stays the source of truth.                   |
|  Spring Boot, [Elasticsearch], PostgreSQL           Read case study      |
|                                                                          |
|  WhatsApp agent (proof of concept)                Built at DIATOZ        |
|  (no match: shown dimmed, still in place, so nothing jumps)              |
+--------------------------------------------------------------------------+
```

Case-study page:

```
+--------------------------------------------------------------------------+
|  Back to work                                                            |
|  +--------------------------------------------------------------+        |
|  | Search this site                                          /  |        |
|  +--------------------------------------------------------------+        |
|                                                                          |
|  Report search on Elasticsearch                                          |
|  Reads go to Elasticsearch, writes stay in PostgreSQL, and an            |
|  audit keeps the two honest.                                             |
|                                                                          |
|  +--------------------------------------------------------------+        |
|  | Diagram, inline SVG, full column width                       |        |
|  +--------------------------------------------------------------+        |
|                                                                          |
|  Problem                                                                 |
|  Plain-language paragraph. Matches of the active search are              |
|  marked in yellow, on this page too.                                     |
|                                                                          |
|  Decisions   Constraints   Results   Stack   Links                       |
|  (same order as the other direction; sections without sourced            |
|  content are left out)                                                   |
+--------------------------------------------------------------------------+
```

### The one memorable thing

A searchable, honest site. Hits highlight like search results, and a miss says so. A recruiter scanning for a keyword gets a yes or no with evidence in a second, and the page demonstrates the kind of work it describes.

### Deliberately quiet

Colour appears only as the highlight. No cards, no icons except the search glyph, no shadows, one bordered element (the field).

### Light and dark

Light only, on purpose. A highlighter needs paper, and yellow on near-black is the acid-accent default.

### Review against the generic defaults

| Default | Result |
|---|---|
| Warm cream, serif, terracotta | Absent. |
| Near-black with one acid accent | First draft had a dark theme with yellow on near-black, which is that default; dark dropped. |
| Broadsheet hairline layouts | Only the search field has a border. |
| Identical rounded cards | None; rows. Non-matching rows dim rather than vanish, so the layout never jumps. |
| A stat-tile row | None. |
| Tracked all-caps eyebrow | None; the "Try" lead-in is inline sentence-case text. |
| Middle-dot meta strings | First draft joined hits as "Experience · Intern"; now section name and snippet sit on separate lines. |
| "WORD - fragment" labels | None. |
| "→" appended to links | None; results are plain text. |
| Gradient text, one accented word | None. The highlight marks the term the visitor typed, so it is functional, not decorative. |
| Monospace for labels that are not code | No mono face. |
| 01/02/03 numbering | None. |
| Typewriter, orbs, glow, hover scale | None; the results panel appears with no transition. |

---

## Seeds I did not take as written

- **Trace** as a standalone direction. With Samsung Prism and Avarista off the resume, the sourced time axis has three spans: B.E. (2022 to May 2026), the DIATOZ internship (Oct 2025 to May 2026) and the SDE role (May 2026 to now). Dates for individual systems are not sourced, and drawing them would invent timing. A three-row strip could be grafted onto any direction as the Experience header if you want it.
- **Pipeline** became Flowline. I kept the diagram-led idea and dropped a connected "system map" in the hero: the DIATOZ systems are separate, and joining them would imply one system.
- **Engineering doc** became Marginalia, with the receipts idea as the memorable part.
- **Query** is new, because search is part of your world and it makes the "no invented facts" stance visible.

## Recommendation

**Flowline (A).** Its memorable element does proof work, because the diagrams show system thinking that you cannot show with code or screenshots of employer work. It reuses the five diagrams Phase 3 needs anyway, so the home page and the case studies share one visual system. It stays calm, with one colour per meaning and no cards, and it ships in light and dark. Marginalia is the most refined read but shows no diagrams on the home page; Query is the most surprising but depends on the visitor using it. The cheapest strong merge is Flowline with Query's `/` search added afterwards (small, no dependency).

## Decisions needed at Checkpoint B

1. Pick A, B or C, or a merge such as A with the search from C.
2. Theme: A ships light and dark with a toggle. Confirm, or say light only. Default: both.
3. Hero photo at 96 px: keep? Default: yes.
4. Do you want the three-row Trace strip in the Experience header? Default: no.
5. If you have reference sites or screenshots, send them; they override all of the above.

---

## Decision at Checkpoint B

Answer received: "everything / both (toggle) / we can remove the pic or add that at a better position / however you feel the best way". I read that as a merge and built it as follows.

| Question | Decision |
|---|---|
| Direction | **Flowline** as the backbone. Quiet versions of the other two ideas ride on it: hero numbers link to case studies and results show their source (from Marginalia's receipts), a Search button opens a small search with `/` as the shortcut (from Query), and the Experience header carries the three-row career strip (the Trace seed). |
| Theme | Light and dark, with a two-button toggle labelled "Light" and "Dark". First visit follows the system setting. An inline script in `index.html` sets the class before first paint, so dark-mode visitors never see a light flash. |
| Photo | Removed from the hero, which stays text-first for LCP. A small 96 px portrait sits next to the email in the Contact section. |
| Search | No dimming of non-matching rows. The earlier Query sketch dimmed them, but dimmed text fails AA contrast. Matches get a `<mark>` highlight and a no-match query says "No mention of 'x' on this site." |
| Mobile bar | One 1 px rule under the bar; the flowline gutter below it is 2 px. Section dots sit on the gutter. |

Self-critique after the build, changes made before committing:

- Section spacing moved from padding to margins, so a jump link lands on the heading, not on 100 px of empty space.
- Container widened from 61 rem to 70 rem. The project text column was 296 px (about 36 characters a line); it is now 440 px at 1280 px and above.
- Cylinder labels in the diagrams were touching the front of the top cap. Text for stores now centres in the body below the cap, and the compact SQLite node got taller.
- Removed the "Full-time" and "Internship" label under each date. The title already says it, and the label cost a line per entry.
- The name link in the rail and the certificate link had tap targets under 44 px; both are 44 px now.

### Search, as built

- A "Search" button sits under the nav in the rail (with a `/` hint) and next to "Menu" on phones. `/` opens it from anywhere except a text field. (Moved to the top right on desktop on 9 October, see the revision below.)
- It is a native `<dialog>` loaded on demand: 2.7 kB gzipped, fetched when the button is hovered, focused or pressed. Focus is trapped, Esc and a click outside close it, and focus returns to the button.
- Every word of the query has to appear in an entry. The index is built from the same `src/data` modules the pages render, including the case studies, so a result cannot disagree with its page. Results show the section name, a heading and a snippet with the hit marked.
- Choosing a result goes to the page with `?q=` in the URL. The hits are painted on the page with the CSS Custom Highlight API instead of wrapping text in `<mark>`, so React never fights a changed text node. A browser without the API still gets the jump to the section. A small bar at the bottom says what is highlighted and has "Clear highlights"; Esc does the same.
- Contrast: highlighted text is forced to the foreground colour, so a hit over a link or muted text still passes AA in both themes.
- A term that is not on the site gets "No mention of “x” on this site." One letter gets "Type at least two letters."

## Revision, 9 October 2026: case-study pages, live diagrams, search position

Asked for by Sahil after the first review. It changes three rules in this plan, so it is written down here instead of left implicit.

- **Motion.** "Nothing ambient or looping" no longer holds for diagrams.
  - The five diagrams on the home page send one dot along each arrow, twice, when they scroll into view, and then stop (about five seconds; none under reduced motion).
  - The diagrams on the case-study pages are a 3D scene in which dots keep travelling along the arrows. A "Pause the flow" button stops them, and while paused no frames are drawn at all. A visitor who asked for reduced motion (or data saving) starts on the flat diagram and can switch; so can anyone else, with "Show the flat diagram".
- **Depth.** "No shadows" no longer holds inside the 3D scene: nodes have height, a contact shadow and a lit top face. The page around the scene is unchanged. The scene keeps the diagram language (box for a job, cylinder for a store, diamond for a model call, the same three colours) and is drawn from the same data as the flat diagrams, so it adds no component and no arrow.
- **Search.** The button left the rail for the top right of the page: a strip at 1024 px and wider that stays at the top, has the page's own colour, and moves nothing. Phones keep it in the top bar.
- **Case studies.** Each row on the home page ends in a "Read the full case study" button (and the title links there too). A case-study page now runs: the diagram with a step-by-step "Follow the data" list, the problem, constraints, how I approached it, blockers and how I got past them, results, stack. A section that has no sourced content is left out instead of padded.
- **Cost.** three.js (about 157 kB gzipped) sits in its own chunk. It loads only on a case-study page, only when the diagram is within a screen of the viewport, and only once the browser is idle. The home page's JavaScript grew by about 1 kB gzipped.

## Revision, 9 October 2026 (second): the ingestion case study is split in two

Sahil's reply to the request for "what was hardest" showed that the first case study had joined two separate pieces of work, so it is now two, and the page set is six case studies.

- **Master-data ingestion** (the CSV of device records, about 273 million records, the Spring Batch flow) and **Bulk store upload** (the Excel upload that creates stores) each have their own page, diagram and walkthrough. The old `/projects/ingestion-pipelines` page is gone; it was never merged to `main`.
- **Honest verbs.** The first ingestion flow was written by Sahil's senior engineers, so the pages and the home-page bullets say "reworked", with what was wrong, what was tried and what changed. The RAG chatbot is labelled a proof of concept. The work-row label under each title is "Work at DIATOZ" instead of "Built at DIATOZ".
- **Where the content came from.** The pages describe mechanisms (partitioned workers, multi-row insert-or-update, validate once and save in the background, a duplicate-message check) and leave out class, endpoint and table names, the CSV's columns, configuration values and the client's name. `SOURCES.md` lists every claim and how each disagreement between his account and the resume was settled.
- **Diagrams.** Two new ones, and new nodes on three old ones: a download node on report search, a service-API node on the RAG chatbot, and webhook checks, Elasticsearch and repair status on the WhatsApp agent. Lane captions that stood behind a node in the 3D view are now notes under the diagram.
- **Corrections the same day.** A second reply from Sahil corrected the report-search approach (the reports read ticket data; the old tickets were backfilled into Elasticsearch, new ones are indexed asynchronously, and nothing is sent asynchronously to the database), replaced the latency figure with 4 to 5 s to 400 ms, added the speed results of the master-data load (a million records in about 1.5 to 2 minutes, from 16 hours), said why Milvus was chosen, and made the WhatsApp agent a single-tenant proof of concept that was not shipped. The client's name is off the site and the resume. The diagram for report search gained an indexing step and lost its "async updates to PostgreSQL" arrow. In the 3D scene the eight ridges of a diamond are now drawn at half the strength of its outline: with the corrected diagrams, the lines under the label of the small phone-layout diamond held its text under 4.5:1. That node is also as wide as its column now.
